// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

const chalk = require("chalk");
const util = require("util");

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const shortid = require("shortid");
const fs = require("fs");
const Jimp = require("jimp");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminSvgo = require("imagemin-svgo");
const { extendDefaultPlugins } = require("svgo");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { imageCalculateSize } = require("./calculate.js");
const { CustomError } = require("../error/custom.js");

// ---------------------------------------------
//   Validations
// ---------------------------------------------

const { validationLanguage } = require("../../@validations/language.js");
const { validationInteger } = require("../../@validations/integer.js");
const {
  validationVideo,
} = require("../../@database/images-and-videos/validations/video.js");
const {
  validationType,
} = require("../../@database/images-and-videos/validations/type.js");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * 画像を保存して不要な画像は削除
 * データベースに保存するオブジェクトをフォーマットして返す
 *
 * @param {Array} newObj - 新しい画像情報の入ったオブジェクト (imagesAndVideosObj)
 * @param {Array} oldObj - 古い（データベースから取得した）画像情報の入ったオブジェクト (imagesAndVideosObj)
 * @param {string} loginUsers_id - ログインユーザーID
 * @param {string} ISO8601 - 日時
 * @param {number} minSize - 画像の最小サイズ指定
 * @param {boolean} square - 正方形にする場合 true
 * @param {boolean} heroImage - ヒーローイメージをアップロードする場合 true
 * @return {Object} 画像＆動画情報の入ったオブジェクト
 */
const formatAndSave = async ({
  newObj,
  oldObj = {},
  loginUsers_id,
  ISO8601,
  minSize,
  square,
  heroImage = false,
}) => {
  // ---------------------------------------------
  //   Property
  // ---------------------------------------------

  const returnArr = [];
  const _idsArr = [];

  let _id = shortid.generate();
  let createdDate = ISO8601;
  let updatedDate = ISO8601;
  let type = lodashGet(newObj, ["type"], "");

  const newArr = lodashGet(newObj, ["arr"], []);
  const oldArr = lodashGet(oldObj, ["arr"], []);

  if (oldObj && Object.keys(oldObj).length !== 0) {
    _id = lodashGet(oldObj, ["_id"], "");
    createdDate = lodashGet(oldObj, ["createdDate"], ISO8601);
    type = lodashGet(oldObj, ["type"], "");
  }
  // console.log('eee');

  // ---------------------------------------------
  //   Validation
  // ---------------------------------------------

  validationType({ throwError: true, value: type });

  // ---------------------------------------------
  //   console.log
  // ---------------------------------------------

  // console.log(`
  //   ----- newObj -----\n
  //   ${util.inspect(newObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- oldObj -----\n
  //   ${util.inspect(oldObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   loginUsers_id: {green ${loginUsers_id}}
  //   ISO8601: {green ${ISO8601}}
  //   minSize: {green ${minSize}}
  //   square: {green ${square}}
  // `);

  // return;

  // ---------------------------------------------
  //   配列が空の場合は処理停止
  // ---------------------------------------------

  if (newArr.length === 0 && oldArr.length === 0) {
    return {};
  }

  // ---------------------------------------------
  //   画像を保存する
  // ---------------------------------------------

  let countNewImages = 0;
  let countNewVideos = 0;

  for (let valueObj of newArr.values()) {
    // ---------------------------------------------
    //   _id & type
    // ---------------------------------------------

    let _id2 = lodashGet(valueObj, ["_id"], "");
    const type2 = lodashGet(valueObj, ["type"], "");

    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   _id2: {green ${_id2}}
    //   type2: {green ${type2}}
    // `);

    // ---------------------------------------------
    //   画像と動画の数をカウント
    // ---------------------------------------------

    if (type2 === "image") {
      countNewImages += 1;
    } else if (type2 === "video") {
      countNewVideos += 1;
    }

    // ---------------------------------------------
    //   既存の画像＆動画の場合（新規追加ではない場合）
    // ---------------------------------------------

    if (_id2) {
      // ---------------------------------------------
      //   そのまま追加
      // ---------------------------------------------

      returnArr.push(valueObj);

      // ---------------------------------------------
      //   削除用　_idの入った配列作成 / imagesAndVideosObj.arr._id
      // ---------------------------------------------

      _idsArr.push(_id2);

      // ---------------------------------------------
      //   処理しない
      // ---------------------------------------------

      continue;
    }

    // ---------------------------------------------
    //   新規の動画
    // ---------------------------------------------

    if (type2 === "video") {
      const videoChannel = lodashGet(valueObj, ["videoChannel"], "");
      const videoID = lodashGet(valueObj, ["videoID"], "");

      validationVideo({ throwError: true, videoChannel, videoID });

      const tempObj = {
        _id: shortid.generate(),
        type: "video",
        videoChannel,
        videoID,
      };

      returnArr.push(tempObj);

      continue;
    }

    // ---------------------------------------------
    //   新規の画像
    // ---------------------------------------------

    const src = lodashGet(valueObj, ["srcSetArr", 0, "src"], "");

    if (type2 === "image" && src && src.indexOf("base64") !== -1) {
      // --------------------------------------------------
      //   _id & width & height / Validation
      // --------------------------------------------------

      _id2 = shortid.generate();
      const width = lodashGet(valueObj, ["srcSetArr", 0, "width"], 128);
      const height = lodashGet(valueObj, ["srcSetArr", 0, "height"], 128);

      validationInteger({ throwError: true, required: true, value: width });
      validationInteger({ throwError: true, required: true, value: height });

      // --------------------------------------------------
      //   localesArr / Validation
      // --------------------------------------------------

      const preLocalesArr = lodashGet(valueObj, ["localesArr"], []);
      const localesArr = [];

      if (preLocalesArr.length > 0) {
        for (let valueObj of preLocalesArr.values()) {
          const language = lodashGet(valueObj, ["language"], "ja");
          const caption = lodashGet(valueObj, ["caption"], "");

          validationLanguage({ throwError: true, value: language });

          localesArr.push({
            _id: shortid.generate(),
            language,
            caption,
          });
        }
      }

      // --------------------------------------------------
      //   extension & imageType & mimeType
      // --------------------------------------------------

      let extension = src.slice(src.indexOf("/") + 1, src.indexOf(";"));

      let imageType = "JPEG";
      let mimeType = "image/jpeg";

      if (extension === "jpeg") {
        extension = "jpg";
      } else if (extension === "svg+xml") {
        extension = "svg";
        imageType = "SVG";
      } else if (extension === "gif" || extension === "png") {
        extension = "png";
        mimeType = "image/png";
        imageType = "PNG";
      }

      // console.log('hhh');

      // ---------------------------------------------
      //   ディレクトリ作成　【チェック時は要コメントアウト】
      // ---------------------------------------------

      const dirPath = `public/img/${type}/${_id}/${_id2}`;

      mkdirp.sync(dirPath);

      // mkdirp.sync(dirPath, (err) => {
      //   console.log(chalk`
      //     err: {green ${err}}
      //   `);
      //   if (err) {
      //     throw new CustomError({ level: 'error', errorsArr: [{ code: 'AewCZCF5v', messageID: 'Error' }] });
      //   }
      // });

      // console.log(chalk`
      //   _id2: {green ${_id2}}
      //   src: {green ${src.substr(0, 30)}}
      //   width: {green ${width}}
      //   height: {green ${height}}
      //   imageType: {green ${imageType}}
      //   mimeType: {green ${mimeType}}
      //   extension: {green ${extension}}
      //   dirPath: {green ${dirPath}}
      // `);

      // ---------------------------------------------
      //   srcset
      // ---------------------------------------------

      const srcSetArr = [];
      let longSideArr = [800];

      if (heroImage) {
        longSideArr = [320, 480, 640, 800, 1920];

        if (width < 480) {
          longSideArr = [320];
        } else if (width < 640) {
          longSideArr = [320, 480];
        } else if (width < 800) {
          longSideArr = [320, 480, 640];
        } else if (width < 960) {
          longSideArr = [320, 480, 640, 800];
        }
      } else {
        if (width < 480) {
          longSideArr = [320];
        } else if (width < 640) {
          longSideArr = [480];
        } else if (width < 800) {
          longSideArr = [640];
        }
      }

      // let longSideArr = [320, 480, 640, 800];

      // if (width < 480) {

      //   longSideArr = [320];

      // } else if (width < 640) {

      //   longSideArr = [320, 480];

      // } else if (width < 800) {

      //   longSideArr = [320, 480, 640];

      // }

      for (let longSide of longSideArr.values()) {
        // ---------------------------------------------
        //   横幅・高さを計算する
        // ---------------------------------------------

        const calculatedObj = imageCalculateSize({
          width,
          height,
          minSize,
          maxSize: longSide,
          square,
        });

        // console.log(`
        //   ----- calculatedObj -----\n
        //   ${util.inspect(calculatedObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // ---------------------------------------------
        //   画像をリサイズ＆圧縮する
        // ---------------------------------------------

        let buff = Buffer.from(src.slice(src.indexOf("base64") + 7), "base64");

        // 画像がSVGでない場合、リサイズする
        if (extension !== "svg") {
          const image = await Jimp.read(buff);
          image.resize(calculatedObj.width, calculatedObj.height);
          buff = await image.getBufferAsync(mimeType);
        }

        // 圧縮する
        const optimizedBuffer = await imagemin.buffer(buff, {
          plugins: [
            imageminMozjpeg({ quality: 80 }),
            imageminPngquant({ quality: [0.5, 0.7] }),
            imageminGifsicle(),
            imageminSvgo({
              plugins: extendDefaultPlugins([
                { name: "removeViewBox", active: false },
              ]),
            }),
          ],
        });

        // ---------------------------------------------
        //   ファイル保存　【チェック時は要コメントアウト】
        // ---------------------------------------------

        const srcSetSrc = `${dirPath}/${longSide}w.${extension}`;
        fs.writeFileSync(srcSetSrc, optimizedBuffer);

        // ---------------------------------------------
        //   srcSetArr 作成
        // ---------------------------------------------

        srcSetArr.push({
          _id: shortid.generate(),
          w: `${longSide}w`,
          width: calculatedObj.width,
          height: calculatedObj.height,
        });

        // console.log(chalk`
        //   srcSetSrc: {green ${srcSetSrc}}
        // `);
      }

      // ---------------------------------------------
      //   Push
      // ---------------------------------------------

      const tempObj = {
        _id: _id2,
        type: "image",
        imageType,
        srcSetArr,
      };

      if (localesArr.length > 0) {
        tempObj.localesArr = localesArr;
      }

      returnArr.push(tempObj);
    }
  }

  // ---------------------------------------------
  //   画像と動画の数をカウント
  // ---------------------------------------------

  let countOldImages = 0;
  let countOldVideos = 0;

  for (let valueObj of oldArr.values()) {
    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    if (valueObj.type === "image") {
      countOldImages += 1;
    } else if (valueObj.type === "video") {
      countOldVideos += 1;
    }
  }

  const images = countNewImages - countOldImages;
  const videos = countNewVideos - countOldVideos;

  // console.log(`
  //   ----- newArr -----\n
  //   ${util.inspect(newArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- oldArr -----\n
  //   ${util.inspect(oldArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   countNewImages: {green ${countNewImages}}
  //   countOldImages: {green ${countOldImages}}
  // `);

  // console.log(`
  //   ----- _idsArr -----\n
  //   ${util.inspect(_idsArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // ---------------------------------------------
  //   画像を削除する　【チェック時は要コメントアウト】
  // ---------------------------------------------

  // ----------------------------------------
  //   すべて削除
  // ----------------------------------------

  if (countNewImages === 0) {
    // if (newArr.length === 0 && oldArr.length > 0) {

    const dirPath = `public/img/${type}/${_id}`;

    rimraf(dirPath, (err) => {
      if (err) {
        throw new CustomError({
          level: "error",
          errorsArr: [{ code: "mPduhlAfV", messageID: "Error" }],
        });
      }
    });

    // console.log('すべて削除');

    // ----------------------------------------
    //   個別に削除
    // ----------------------------------------
  } else {
    for (let valueObj of oldArr.values()) {
      // console.log(`
      //   ----- valueObj -----\n
      //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // 新しい _id の入った配列に古い _id が含まれていない場合、削除する
      if (_idsArr.includes(valueObj._id) === false) {
        const dirPath = `public/img/${type}/${_id}/${valueObj._id}`;

        rimraf(dirPath, (err) => {
          if (err) {
            throw new CustomError({
              level: "error",
              errorsArr: [{ code: "uzE621Av1", messageID: "Error" }],
            });
          }
        });

        // console.log(chalk`
        //   個別に削除
        //   valueObj._id: {green ${valueObj._id}}
        //   dirPath: {green ${dirPath}}
        // `);
      }
    }

    // console.log('個別に削除');
  }

  // ---------------------------------------------
  //   Return Object
  // ---------------------------------------------

  const returnObj = {
    imagesAndVideosObj: {
      _id,
      createdDate,
      updatedDate,
      users_id: loginUsers_id,
      type,
      images: countNewImages,
      videos: countNewVideos,
      arr: returnArr,
    },
    images,
    videos,
  };

  // const returnObj = {
  //   _id,
  //   createdDate,
  //   updatedDate,
  //   users_id: loginUsers_id,
  //   type,
  //   arr: returnArr,
  // };

  // console.log(`
  //   ----- _idsArr -----\n
  //   ${util.inspect(_idsArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- returnArr -----\n
  //   ${util.inspect(returnArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- returnObj -----\n
  //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   countNewImages: {green ${countNewImages}}
  //   countNewVideos: {green ${countNewVideos}}
  //   countOldImages: {green ${countOldImages}}
  //   countOldVideos: {green ${countOldVideos}}
  //   images: {green ${images}}
  //   videos: {green ${videos}}
  // `);

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return returnObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  formatAndSave,
};

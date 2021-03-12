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

const shortid = require("shortid");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");
const lodashHas = require("lodash/has");
const lodashCloneDeep = require("lodash/cloneDeep");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * Image & Video 情報の入った配列をフォーマットする
 *
 * @param {Object} localeObj - ロケール
 * @param {Array} arr - 配列
 * @return {Array} フォーマットされたオブジェクト
 */
const formatImagesAndVideosArr = ({ localeObj, arr }) => {
  const returnArr = [];

  // --------------------------------------------------
  //   Loop
  // --------------------------------------------------

  for (let valueObj of arr.values()) {
    // --------------------------------------------------
    //   Deep Copy
    // --------------------------------------------------

    const clonedObj = lodashCloneDeep(valueObj);

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    if (valueObj.imagesAndVideosObj) {
      const formattedObj = formatImagesAndVideosObj({
        localeObj,
        obj: valueObj.imagesAndVideosObj,
      });

      if (Object.keys(formattedObj).length !== 0) {
        clonedObj.imagesAndVideosObj = formattedObj;
      } else {
        delete clonedObj.imagesAndVideosObj;
      }
    }

    if (valueObj.imagesAndVideosThumbnailObj) {
      const formattedThumbnailObj = formatImagesAndVideosObj({
        localeObj,
        obj: valueObj.imagesAndVideosThumbnailObj,
      });

      if (Object.keys(formattedThumbnailObj).length !== 0) {
        clonedObj.imagesAndVideosThumbnailObj = formattedThumbnailObj;
      } else {
        delete clonedObj.imagesAndVideosThumbnailObj;
      }
    }

    // console.log(`
    //   ----- clonedObj -----\n
    //   ${util.inspect(clonedObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Push
    // --------------------------------------------------

    returnArr.push(clonedObj);

    // console.log(value);
  }
  // console.log(`
  //     ----- returnArr -----\n
  //     ${util.inspect(returnArr, { colors: true, depth: null })}\n
  //     --------------------\n
  //   `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return returnArr;
};

/**
 * Image & Video 情報の入った配列をフォーマットする
 * src / srcset / caption / width /height
 * そしてLightbox のライブラリでも使用できるようにする
 * https://github.com/jossmac/react-images
 *
 * @param {Object} localeObj - ロケール
 * @param {Object} obj - imagesAndVideosObj
 * @param {number} maxWidth - フォーマットする最大の横幅を指定する　それ以上のサイズの画像はフォーマットしない
 * @return {Array} フォーマットされたオブジェクト
 */
const formatImagesAndVideosObj = ({
  localeObj = {},
  obj,
  maxWidth = 15360,
}) => {
  // --------------------------------------------------
  //   Data
  // --------------------------------------------------

  const _id = lodashGet(obj, ["_id"], "");
  const type = lodashGet(obj, ["type"], "");
  const arr = lodashGet(obj, ["arr"], []);

  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  const returnArr = [];

  let returnObj = {
    _id,
    type,
  };

  // console.log(`
  //   ----- obj -----\n
  //   ${util.inspect(obj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   _id: {green ${_id}}
  //   type: {green ${type}}
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(arr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- obj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(obj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);
  // return null;

  // --------------------------------------------------
  //   必要なデータがない場合は処理停止
  // --------------------------------------------------

  if (!type || arr.length === 0) {
    return {};
    // return null;
  }

  // console.log('AAAAAAAAAAAAAAAAAAAAA');

  // --------------------------------------------------
  //   データ処理
  // --------------------------------------------------

  for (const valueObj of arr.values()) {
    const _id2 = lodashGet(valueObj, ["_id"], "");
    const type2 = lodashGet(valueObj, ["type"], "");
    const imageType = lodashGet(valueObj, ["imageType"], "");

    // console.log(chalk`
    //   _id2: {green ${_id2}}
    //   type2: {green ${type2}}
    //   imageType: {green ${imageType}}
    // `);

    // --------------------------------------------------
    //   画像の場合
    // --------------------------------------------------

    if (type2 === "image") {
      // --------------------------------------------------
      //   Data
      // --------------------------------------------------

      const localesArr = lodashGet(valueObj, ["localesArr"], []);
      const srcSetArr = lodashGet(valueObj, ["srcSetArr"], []);

      // --------------------------------------------------
      //   Temp Object
      // --------------------------------------------------

      const tempObj = {
        type: "image",
      };
      // console.log('AAAAAAAAAAAAAAAAAAA');

      // --------------------------------------------------
      //   Caption 表示する言語のデータを取得
      // --------------------------------------------------

      const filteredArr = localesArr.filter((filterObj) => {
        return filterObj.language === localeObj.language;
      });

      // --------------------------------------------------
      //   Caption 表示する言語のデータが存在する場合はそれを表示
      //   存在しない場合は、最初のデータを表示
      // --------------------------------------------------

      let caption = lodashGet(valueObj, ["localesArr", 0, "caption"], "");

      if (lodashHas(filteredArr, [0])) {
        caption = lodashGet(filteredArr, [0, "caption"], "");
      }

      if (caption) {
        tempObj.caption = caption;
      }

      // --------------------------------------------------
      //   srcset
      // --------------------------------------------------

      const srcSet2Arr = [];
      // const imageCount = 0;

      for (let value2Obj of srcSetArr.values()) {
        // if (_id === 'ymd-ldMa6odPm') {
        //   console.log(`
        //     ----- value2Obj -----\n
        //     ${util.inspect(JSON.parse(JSON.stringify(value2Obj)), { colors: true, depth: null })}\n
        //     --------------------\n
        //   `);
        // }

        // --------------------------------------------------
        //   フォーマットする画像の最大横幅　この値以上の横幅の画像はフォーマットしない
        // --------------------------------------------------

        if (value2Obj.width <= maxWidth) {
          // --------------------------------------------------
          //   Upload 画像の場合
          // --------------------------------------------------

          if (value2Obj.src) {
            tempObj.src = value2Obj.src;

            // --------------------------------------------------
            //   通常の画像の場合
            // --------------------------------------------------
          } else {
            // --------------------------------------------------
            //   extension
            // --------------------------------------------------

            let extension = ".jpg";

            if (imageType === "PNG") {
              extension = ".png";
            } else if (imageType === "SVG") {
              extension = ".svg";
            }

            // --------------------------------------------------
            //   src
            // --------------------------------------------------

            tempObj.src = `/img/${type}/${_id}/${_id2}/${value2Obj.w}${extension}`;
          }

          // --------------------------------------------------
          //   width & height
          // --------------------------------------------------

          tempObj.width = value2Obj.width;
          tempObj.height = value2Obj.height;

          // --------------------------------------------------
          //   srcset
          // --------------------------------------------------

          srcSet2Arr.push(`${tempObj.src} ${value2Obj.w}`);
        }
      }

      // --------------------------------------------------
      //   srcsetの配列をCSV形式の文字列に変換 & 配列に追加
      // --------------------------------------------------

      if (srcSet2Arr.length > 0) {
        tempObj.srcSet = srcSet2Arr.join(", ");

        returnArr.push(tempObj);
      }

      // --------------------------------------------------
      //   動画の場合
      // --------------------------------------------------
    } else if (type2 === "video") {
      returnArr.push({
        type: valueObj.type,
        videoChannel: valueObj.videoChannel,
        videoID: valueObj.videoID,
      });
    }
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  if (returnArr.length > 0) {
    returnObj.arr = returnArr;
  } else {
    returnObj = {};
  }

  // if (_id === 'ymd-ldMa6odPm') {

  //   console.log(`
  //     ----- returnArr -----\n
  //     ${util.inspect(JSON.parse(JSON.stringify(returnArr)), { colors: true, depth: null })}\n
  //     --------------------\n
  //   `);

  //   console.log(`
  //     ----- returnObj -----\n
  //     ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
  //     --------------------\n
  //   `);

  // }

  return returnObj;
};

/**
 * 新しい Image & Video オブジェクトを作成して返す
 * @return {Object} 作成されたオブジェクト
 */
const returnNewObj = ({}) => {
  // --------------------------------------------------
  //   Data
  // --------------------------------------------------

  const returnObj = {
    _id: shortid.generate(),
    createdDate: "",
    updatedDate: "",
    users_id: "",
    type: "",
    arr: [],
  };

  return returnObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  formatImagesAndVideosArr,
  formatImagesAndVideosObj,
  returnNewObj,
};

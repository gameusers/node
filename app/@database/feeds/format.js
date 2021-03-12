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

const moment = require("moment");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");
const lodashHas = require("lodash/has");
const lodashCloneDeep = require("lodash/cloneDeep");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const { formatImagesAndVideosObj } = require("../images-and-videos/format.js");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * フィード用フォーマット
 * @param {Object} localeObj - ロケール
 * @param {Array} arr - 配列
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @return {Object} フォーマット後のデータ
 */
const formatFeedsArr = ({ localeObj, arr = [], page, limit }) => {
  // --------------------------------------------------
  //   Language & Parse
  // --------------------------------------------------

  const language = lodashGet(localeObj, ["language"], "");
  const intLimit = parseInt(limit, 10);

  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  const obj = {
    page,
    limit: intLimit,
    count: arr.length,
    dataObj: {},
  };

  const ISO8601 = moment().utc().toISOString();

  // --------------------------------------------------
  //   必要なデータを抽出するための番号
  // --------------------------------------------------

  const start = (page - 1) * intLimit;
  const end = start + intLimit;
  // const start = (2 - 1) * 2;
  // const end = start + 2;

  // console.log(chalk`
  //   start: {green ${start}}
  //   end: {green ${end}}
  // `);

  // ---------------------------------------------
  //   - Loop
  // ---------------------------------------------

  for (const [index, valueObj] of arr.entries()) {
    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(valueObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   実質的な page, limit の処理　必要のないデータは処理しない
    // --------------------------------------------------

    if (index < start) {
      // console.log('除外', index);
      continue;
    } else if (index >= end) {
      // console.log('最後', index);
      break;
    }

    // console.log('採用', index);

    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    let localesArr = [];
    let filteredArr = [];

    // --------------------------------------------------
    //   Deep Copy
    // --------------------------------------------------

    const clonedObj = lodashCloneDeep(valueObj);

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    let datetimeCurrent = ISO8601;
    const datetimeUpdated = moment(valueObj.createdDate);

    if (datetimeUpdated.isAfter(datetimeCurrent)) {
      datetimeCurrent = datetimeUpdated;
    }

    clonedObj.datetimeFrom = datetimeUpdated.from(datetimeCurrent);

    // --------------------------------------------------
    //   画像と動画の処理 - メイン画像
    // --------------------------------------------------

    const formattedObj = formatImagesAndVideosObj({
      localeObj,
      obj: valueObj.imagesAndVideosObj,
      maxWidth: 800,
    });

    if (Object.keys(formattedObj).length !== 0) {
      clonedObj.imagesAndVideosObj = formattedObj;
    } else {
      delete clonedObj.imagesAndVideosObj;
    }

    // --------------------------------------------------
    //   画像と動画の処理
    // --------------------------------------------------

    // ---------------------------------------------
    //   - ゲームコミュニティ
    // ---------------------------------------------

    if (
      valueObj.type === "forumThreadsGc" ||
      valueObj.type === "forumCommentsAndRepliesGc" ||
      valueObj.type === "recruitmentThreads" ||
      valueObj.type === "recruitmentComments" ||
      valueObj.type === "recruitmentReplies"
    ) {
      // --------------------------------------------------
      //   ゲーム / メイン画像
      // --------------------------------------------------

      const imagesAndVideosObj = formatImagesAndVideosObj({
        localeObj,
        obj: lodashGet(valueObj, ["gamesObj", "imagesAndVideosObj"], {}),
        maxWidth: 800,
      });

      if (Object.keys(imagesAndVideosObj).length !== 0) {
        // 画像をランダムに抽出
        const randomArr = lodashGet(imagesAndVideosObj, ["arr"], []);
        imagesAndVideosObj.arr = [
          randomArr[Math.floor(Math.random() * randomArr.length)],
        ];

        lodashSet(
          clonedObj,
          ["gamesObj", "imagesAndVideosObj"],
          imagesAndVideosObj
        );
      } else {
        delete clonedObj.gamesObj.imagesAndVideosObj;
      }

      // --------------------------------------------------
      //   ゲーム / サムネイル画像
      // --------------------------------------------------

      const imagesAndVideosThumbnailObj = formatImagesAndVideosObj({
        localeObj,
        obj: lodashGet(
          valueObj,
          ["gamesObj", "imagesAndVideosThumbnailObj"],
          {}
        ),
      });

      if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
        lodashSet(
          clonedObj,
          ["gamesObj", "imagesAndVideosThumbnailObj"],
          imagesAndVideosThumbnailObj
        );
      } else {
        delete clonedObj.gamesObj.imagesAndVideosThumbnailObj;
      }

      // ---------------------------------------------
      //   - ユーザーコミュニティ
      // ---------------------------------------------
    } else if (
      valueObj.type === "forumThreadsUc" ||
      valueObj.type === "forumCommentsAndRepliesUc"
    ) {
      // --------------------------------------------------
      //   ユーザーコミュニティ / メイン画像
      // --------------------------------------------------

      const imagesAndVideosObj = formatImagesAndVideosObj({
        localeObj,
        obj: lodashGet(
          valueObj,
          ["userCommunitiesObj", "imagesAndVideosObj"],
          {}
        ),
        maxWidth: 800,
      });

      if (Object.keys(imagesAndVideosObj).length !== 0) {
        // 画像をランダムに抽出
        const randomArr = lodashGet(imagesAndVideosObj, ["arr"], []);
        imagesAndVideosObj.arr = [
          randomArr[Math.floor(Math.random() * randomArr.length)],
        ];

        lodashSet(
          clonedObj,
          ["userCommunitiesObj", "imagesAndVideosObj"],
          imagesAndVideosObj
        );
      } else {
        delete clonedObj.userCommunitiesObj.imagesAndVideosObj;
      }

      // --------------------------------------------------
      //   ユーザーコミュニティ / サムネイル画像
      // --------------------------------------------------

      const imagesAndVideosThumbnailObj = formatImagesAndVideosObj({
        localeObj,
        obj: lodashGet(
          valueObj,
          ["userCommunitiesObj", "imagesAndVideosThumbnailObj"],
          {}
        ),
      });

      if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
        lodashSet(
          clonedObj,
          ["userCommunitiesObj", "imagesAndVideosThumbnailObj"],
          imagesAndVideosThumbnailObj
        );
      }

      // --------------------------------------------------
      //   ユーザーコミュニティの名前
      // --------------------------------------------------

      localesArr = lodashGet(
        valueObj,
        ["userCommunitiesObj", "localesArr"],
        []
      );

      filteredArr = localesArr.filter((filterObj) => {
        return filterObj.language === language;
      });

      lodashSet(
        clonedObj,
        ["userCommunitiesObj", "name"],
        lodashGet(localesArr, [0, "name"], "")
      );

      if (lodashHas(filteredArr, [0])) {
        lodashSet(
          clonedObj,
          ["userCommunitiesObj", "name"],
          lodashGet(filteredArr, [0, "name"], "")
        );
      }

      delete clonedObj.userCommunitiesObj.localesArr;
    }

    // console.log(`
    //   ----- clonedObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(clonedObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   タイトルとコメント
    // --------------------------------------------------

    localesArr = lodashGet(valueObj, ["localesArr"], []);

    filteredArr = localesArr.filter((filterObj) => {
      return filterObj.language === language;
    });

    clonedObj.title = lodashGet(localesArr, [0, "name"], "");
    clonedObj.comment = lodashGet(localesArr, [0, "comment"], "");

    // ---------------------------------------------
    //   - フォーラム
    // ---------------------------------------------

    if (
      valueObj.type === "forumThreadsGc" ||
      valueObj.type === "forumCommentsAndRepliesGc" ||
      valueObj.type === "forumThreadsUc" ||
      valueObj.type === "forumCommentsAndRepliesUc"
    ) {
      if (lodashHas(filteredArr, [0])) {
        clonedObj.title = lodashGet(filteredArr, [0, "name"], "");
        clonedObj.comment = lodashGet(filteredArr, [0, "comment"], "");
      }

      // ---------------------------------------------
      //   - 募集
      // ---------------------------------------------
    } else if (
      valueObj.type === "recruitmentThreads" ||
      valueObj.type === "recruitmentComments" ||
      valueObj.type === "recruitmentReplies"
    ) {
      if (lodashHas(filteredArr, [0])) {
        clonedObj.title = lodashGet(filteredArr, [0, "title"], "");
        clonedObj.comment = lodashGet(filteredArr, [0, "comment"], "");
      }
    }

    // --------------------------------------------------
    //   Comments & Replies
    // --------------------------------------------------

    let comments = lodashGet(valueObj, ["comments"], 0);
    let replies = lodashGet(valueObj, ["replies"], 0);

    clonedObj.commentsAndReplies = comments + replies;

    // --------------------------------------------------
    //   フォーラム / コメント、返信
    // --------------------------------------------------

    if (
      valueObj.type === "forumCommentsAndRepliesGc" ||
      valueObj.type === "forumCommentsAndRepliesUc"
    ) {
      // --------------------------------------------------
      //   name にスレッドの名前を入れる
      // --------------------------------------------------

      localesArr = lodashGet(valueObj, ["forumThreadsObj", "localesArr"], []);

      filteredArr = localesArr.filter((filterObj) => {
        return filterObj.language === language;
      });

      if (lodashHas(filteredArr, [0])) {
        clonedObj.title = lodashGet(filteredArr, [0, "name"], "");
      } else {
        clonedObj.title = lodashGet(localesArr, [0, "name"], "");
      }

      // --------------------------------------------------
      //   Comments & Replies
      // --------------------------------------------------

      comments = lodashGet(valueObj, ["forumThreadsObj", "comments"], 0);
      replies = lodashGet(valueObj, ["forumThreadsObj", "replies"], 0);

      clonedObj.commentsAndReplies = comments + replies;

      // --------------------------------------------------
      //   募集 / コメント、返信の場合
      // --------------------------------------------------
    } else if (
      valueObj.type === "recruitmentComments" ||
      valueObj.type === "recruitmentReplies"
    ) {
      // --------------------------------------------------
      //   name にスレッドの名前を入れる
      // --------------------------------------------------

      localesArr = lodashGet(
        valueObj,
        ["recruitmentThreadsObj", "localesArr"],
        []
      );

      filteredArr = localesArr.filter((filterObj) => {
        return filterObj.language === language;
      });

      if (lodashHas(filteredArr, [0])) {
        clonedObj.title = lodashGet(filteredArr, [0, "title"], "");
      } else {
        clonedObj.title = lodashGet(localesArr, [0, "title"], "");
      }

      // --------------------------------------------------
      //   Comments & Replies
      // --------------------------------------------------

      comments = lodashGet(valueObj, ["recruitmentThreadsObj", "comments"], 0);
      replies = lodashGet(valueObj, ["recruitmentThreadsObj", "replies"], 0);

      clonedObj.commentsAndReplies = comments + replies;
    }

    // --------------------------------------------------
    //   改行コードを削除 ＆ 余分な文字をカット
    // --------------------------------------------------

    if (clonedObj.title) {
      clonedObj.title = clonedObj.title.replace(/\r?\n/g, " ");

      if (clonedObj.title.length > 40) {
        clonedObj.title = clonedObj.title.substr(0, 39) + "…";
      }
    }

    if (clonedObj.comment) {
      clonedObj.comment = clonedObj.comment.replace(/\r?\n/g, " ");

      if (clonedObj.comment.length > 80) {
        clonedObj.comment = clonedObj.comment.substr(0, 79) + "…";
      }
    }

    // --------------------------------------------------
    //   不要な項目を削除する
    // --------------------------------------------------

    // delete clonedObj._id;
    delete clonedObj.createdDate;
    delete clonedObj.localesArr;
    delete clonedObj.comments;
    delete clonedObj.replies;
    delete clonedObj.forumThreadsObj;
    delete clonedObj.recruitmentThreadsObj;

    // --------------------------------------------------
    //   Set Data
    // --------------------------------------------------

    lodashSet(obj, ["dataObj", valueObj._id], clonedObj);

    // --------------------------------------------------
    //   Pages Array
    // --------------------------------------------------

    const pagesArr = lodashGet(obj, [`page${page}Obj`, "arr"], []);
    pagesArr.push(valueObj._id);

    obj[`page${page}Obj`] = {
      loadedDate: ISO8601,
      arr: pagesArr,
    };
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/@database/feeds/format.js - formatFeedsArr
  // `);

  // console.log(`
  //   ----- commentsArr -----\n
  //   ${util.inspect(commentsArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return obj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  formatFeedsArr,
};

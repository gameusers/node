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

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");
const lodashHas = require("lodash/has");
const lodashCloneDeep = require("lodash/cloneDeep");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { verifyAuthority } = require("../../@modules/authority");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const { formatImagesAndVideosObj } = require("../images-and-videos/format");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * DB から取得したデータをフォーマットする
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} arr - 配列
 * @param {Object} recruitmentCommentsObj - コメントのデータ / 返信の総数を取得するために利用
 * @param {number} replyPage - 返信のページ数
 * @param {number} replyLimit - 返信のリミット
 * @param {string} ISO8601 - 日時
 * @return {Array} フォーマット後のデータ
 */
const formatRecruitmentRepliesArr = ({
  req,
  localeObj,
  loginUsers_id,
  arr,
  recruitmentCommentsObj,
  replyPage,
  replyLimit,
  ISO8601,
}) => {
  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  const recruitmentRepliesObj = {
    limit: replyLimit,
    dataObj: {},
  };

  // --------------------------------------------------
  //   Loop
  // --------------------------------------------------

  for (let valueObj of arr.values()) {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const recruitmentComments_id = lodashGet(
      valueObj,
      ["recruitmentComments_id"],
      ""
    );
    const recruitmentReplies_id = lodashGet(valueObj, ["_id"], "");
    const createdDate = lodashGet(valueObj, ["createdDate"], "");

    const imagesAndVideosObj = lodashGet(valueObj, ["imagesAndVideosObj"], {});
    const imagesAndVideosThumbnailObj = lodashGet(
      valueObj,
      ["cardPlayersObj", "imagesAndVideosThumbnailObj"],
      {}
    );

    const localesArr = lodashGet(valueObj, ["localesArr"], []);
    const replyToObj = lodashGet(valueObj, ["replyToObj"], null);

    const users_id = lodashGet(valueObj, ["users_id"], "");
    const webPush = lodashGet(valueObj, ["webPush"], false);
    const webPushEndpoint = lodashGet(
      valueObj,
      ["webPushSubscriptionObj", "endpoint"],
      ""
    );
    const webPushUsersEndpoint = lodashGet(
      valueObj,
      ["usersObj", "webPushSubscriptionObj", "endpoint"],
      ""
    );

    // --------------------------------------------------
    //   Deep Copy
    // --------------------------------------------------

    const clonedObj = lodashCloneDeep(valueObj);

    // --------------------------------------------------
    //   Format - 画像
    // --------------------------------------------------

    const formattedObj = formatImagesAndVideosObj({
      localeObj,
      obj: imagesAndVideosObj,
    });

    if (Object.keys(formattedObj).length !== 0) {
      clonedObj.imagesAndVideosObj = formattedObj;
    } else {
      delete clonedObj.imagesAndVideosObj;
    }

    // --------------------------------------------------
    //   Format - cardPlayersObj サムネイル画像
    // --------------------------------------------------

    const formattedThumbnailObj = formatImagesAndVideosObj({
      localeObj,
      obj: imagesAndVideosThumbnailObj,
    });

    if (Object.keys(formattedThumbnailObj).length !== 0) {
      clonedObj.cardPlayersObj.imagesAndVideosThumbnailObj = formattedThumbnailObj;
    }

    // --------------------------------------------------
    //   編集権限
    // --------------------------------------------------

    clonedObj.editable = verifyAuthority({
      req,
      users_id,
      loginUsers_id,
      ISO8601: createdDate,
      _id: recruitmentReplies_id,
    });

    // --------------------------------------------------
    //   Name & Description
    // --------------------------------------------------

    const filteredArr = localesArr.filter((filterObj) => {
      return filterObj.language === localeObj.language;
    });

    if (lodashHas(filteredArr, [0])) {
      clonedObj.name = lodashGet(filteredArr, [0, "name"], "");
      clonedObj.comment = lodashGet(filteredArr, [0, "comment"], "");
    } else {
      clonedObj.name = lodashGet(valueObj, ["localesArr", 0, "name"], "");
      clonedObj.comment = lodashGet(valueObj, ["localesArr", 0, "comment"], "");
    }

    // --------------------------------------------------
    //   Reply to: Name
    // --------------------------------------------------

    if (replyToObj) {
      clonedObj.replyToName = lodashGet(
        replyToObj,
        ["cardPlayersObj", "name"],
        ""
      );

      if (!clonedObj.replyToName) {
        const replyToLocalesArr = lodashGet(replyToObj, ["localesArr"], []);

        const replyToFilteredArr = replyToLocalesArr.filter((filterObj) => {
          return filterObj.language === localeObj.language;
        });

        if (lodashHas(replyToFilteredArr, [0])) {
          clonedObj.replyToName = lodashGet(
            replyToFilteredArr,
            [0, "name"],
            ""
          );
        } else {
          clonedObj.replyToName = lodashGet(replyToLocalesArr, [0, "name"], "");
        }
      }
    }

    // --------------------------------------------------
    //   通知
    // --------------------------------------------------

    if (
      (webPush && webPushEndpoint) ||
      (webPush && users_id && webPushUsersEndpoint)
    ) {
      clonedObj.notification = "webpush";
    }

    // --------------------------------------------------
    //   不要な項目を削除する
    // --------------------------------------------------

    delete clonedObj._id;
    delete clonedObj.createdDate;
    delete clonedObj.users_id;
    delete clonedObj.localesArr;
    delete clonedObj.replyToObj;
    delete clonedObj.recruitmentCommentsObj;
    delete clonedObj.language;
    delete clonedObj.ip;
    delete clonedObj.userAgent;
    delete clonedObj.__v;

    if (lodashHas(clonedObj, ["usersObj", "webPushSubscriptionObj"])) {
      delete clonedObj.usersObj.webPushSubscriptionObj;
    }

    // --------------------------------------------------
    //   オブジェクトに追加 - dataObj
    // --------------------------------------------------

    recruitmentRepliesObj.dataObj[valueObj._id] = clonedObj;

    // --------------------------------------------------
    //   recruitmentRepliesObj 作成
    // --------------------------------------------------

    let replies = 0;

    // findCommentsAndReplies からフォーマットを読み込んだ場合
    if (recruitmentCommentsObj) {
      replies = lodashGet(
        recruitmentCommentsObj,
        ["dataObj", recruitmentComments_id, "replies"],
        0
      );

      // findReplies からフォーマットを読み込んだ場合
    } else {
      replies = lodashGet(valueObj, ["recruitmentCommentsObj", "replies"], 0);
    }

    // const replies = lodashGet(recruitmentCommentsObj, ['dataObj', recruitmentComments_id, 'replies'], 0);

    const recruitmentRepliesPageArr = lodashGet(
      recruitmentRepliesObj,
      [recruitmentComments_id, `page${replyPage}Obj`, "arr"],
      []
    );
    recruitmentRepliesPageArr.push(valueObj._id);

    recruitmentRepliesObj[recruitmentComments_id] = {
      page: replyPage,
      count: replies,
    };

    recruitmentRepliesObj[recruitmentComments_id][`page${replyPage}Obj`] = {
      loadedDate: ISO8601,
      arr: recruitmentRepliesPageArr,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/format.js - formatRecruitmentThreadsArr
    // `);

    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- clonedObj -----\n
    //   ${util.inspect(clonedObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- replyToObj -----\n
    //   ${util.inspect(replyToObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   users_id: {green ${users_id}}
    //   webPush: {green ${webPush}}
    //   webPushEndpoint: {green ${webPushEndpoint}}
    //   webPushUsersEndpoint: {green ${webPushUsersEndpoint}}
    // `);

    // console.log(chalk`
    //   replies: {green ${replies}}
    // `);
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/@database/recruitment-replies/format.js - formatRecruitmentRepliesArr
  // `);

  // console.log(`
  //   ----- recruitmentThreadsObj -----\n
  //   ${util.inspect(recruitmentThreadsObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- recruitmentRepliesObj -----\n
  //   ${util.inspect(recruitmentRepliesObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return recruitmentRepliesObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  formatRecruitmentRepliesArr,
};

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
// const lodashSet = require('lodash/set');
const lodashHas = require("lodash/has");
const lodashCloneDeep = require("lodash/cloneDeep");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { verifyAuthority } = require("../../@modules/authority.js");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const { formatImagesAndVideosObj } = require("../images-and-videos/format.js");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * DB から取得したデータをフォーマットする
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} arr - 配列
 * @param {number} threadPage - スレッドのページ数
 * @param {number} threadLimit - スレッドのリミット
 * @return {Array} フォーマット後のデータ
 */
const formatRecruitmentThreadsArr = ({
  req,
  localeObj,
  loginUsers_id,
  arr,
  threadPage,
  threadLimit,
  // threadCount = 0,
}) => {
  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  const recruitmentThreadsObj = {
    page: threadPage,
    limit: threadLimit,
    count: lodashGet(
      arr,
      [0, "gameCommunitiesObj", "recruitmentObj", "threadCount"],
      0
    ),
    dataObj: {},
  };

  const dataObj = {};
  const recruitmentThreads_idsArr = [];
  const ISO8601 = moment().utc().toISOString();

  // if (threadCount > 0) {
  //   recruitmentThreadsObj.count = threadCount;
  // }

  // console.log(chalk`
  //   lodashGet(arr, [0, 'gameCommunitiesObj', 'recruitmentObj', 'threadCount'], 0): {green ${lodashGet(arr, [0, 'gameCommunitiesObj', 'recruitmentObj', 'threadCount'], 0)}}
  // `);

  // console.log(`
  //     ----- arr -----\n
  //     ${util.inspect(arr, { colors: true, depth: null })}\n
  //     --------------------\n
  //   `);

  // --------------------------------------------------
  //   Loop
  // --------------------------------------------------

  for (let valueObj of arr.values()) {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const imagesAndVideosObj = lodashGet(valueObj, ["imagesAndVideosObj"], {});

    const publicSetting = lodashGet(valueObj, ["publicSetting"], 1);
    const publicCommentsUsers_idsArr = lodashGet(
      valueObj,
      ["publicCommentsUsers_idsArr"],
      []
    );
    const publicApprovalUsers_idsArrr = lodashGet(
      valueObj,
      ["publicApprovalUsers_idsArrr"],
      []
    );
    const idsArr = lodashGet(valueObj, ["idsArr"], []);
    const publicIDsArr = lodashGet(valueObj, ["publicIDsArr"], []);
    const publicInformationsArr = lodashGet(
      valueObj,
      ["publicInformationsArr"],
      []
    );

    const hardwareIDsArr = lodashGet(valueObj, ["hardwareIDsArr"], []);
    const hardwaresArr = lodashGet(valueObj, ["hardwaresArr"], []);

    const imagesAndVideosThumbnailObj = lodashGet(
      valueObj,
      ["cardPlayersObj", "imagesAndVideosThumbnailObj"],
      {}
    );

    const users_id = lodashGet(valueObj, ["users_id"], "");

    // const webPush = lodashGet(valueObj, ['webPush'], false);
    // const webPushEndpoint = lodashGet(valueObj, ['webPushSubscriptionObj', 'endpoint'], '');
    // const webPushUsersEndpoint = lodashGet(valueObj, ['usersObj', 'webPushSubscriptionObj', 'endpoint'], '');

    const deadlineDate = lodashGet(valueObj, ["deadlineDate"], "");

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
    //   Format - IDと情報を公開する場合 true
    //
    //   1. 誰にでも公開
    //   2. 返信者に公開（全員）
    //   3. 返信者に公開（選択）
    // --------------------------------------------------

    let publicIDsAndInformations = false;

    if (
      publicSetting === 1 ||
      (publicSetting === 2 &&
        publicCommentsUsers_idsArr.includes(loginUsers_id)) ||
      (publicSetting === 3 &&
        publicApprovalUsers_idsArrr.includes(loginUsers_id))
    ) {
      publicIDsAndInformations = true;
    }

    // --------------------------------------------------
    //   締め切りの場合、IDと情報を伏せ字にする
    // --------------------------------------------------

    if (deadlineDate) {
      // 指定日時の翌日に締め切られるように、1日追加する。これを追加しないと当日になった瞬間 0:00 に締め切られてしまうため。
      const deadlineDateAddOneDay = moment(deadlineDate).utc().add(1, "day");

      // 現在の日時と締切日時の差をミリ秒で取得
      const diff = deadlineDateAddOneDay.diff(moment());

      // duration オブジェクトを生成
      const duration = moment.duration(diff);

      // 締め切りまでの日数を取得（小数点切り捨て）
      const days = Math.floor(duration.asDays());

      if (days < 0) {
        publicIDsAndInformations = false;
      }

      // console.log(chalk`
      //   days: {green ${days}}
      // `);
    }

    // --------------------------------------------------
    //   Format - IDs
    // --------------------------------------------------

    clonedObj.idsArr = [];

    for (let value2Obj of idsArr.values()) {
      const tempObj = {
        _id: value2Obj._id,
        platform: value2Obj.platform,
        label: value2Obj.label,
        id: value2Obj.id,
      };

      // --------------------------------------------------
      //   ゲーム情報がある場合
      // --------------------------------------------------

      if ("gamesObj" in value2Obj) {
        tempObj.gamesObj = value2Obj.gamesObj;

        // --------------------------------------------------
        //   Format - サムネイル画像
        // --------------------------------------------------

        const imagesAndVideosThumbnailObj = formatImagesAndVideosObj({
          localeObj,
          obj: value2Obj.gamesObj.imagesAndVideosThumbnailObj,
        });

        if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
          tempObj.gamesObj.imagesAndVideosThumbnailObj = imagesAndVideosThumbnailObj;
        }
      }

      // --------------------------------------------------
      //   伏せ字にする
      // --------------------------------------------------

      if (loginUsers_id !== users_id && !publicIDsAndInformations) {
        tempObj.id = "*****";
      }

      // --------------------------------------------------
      //   array.push
      // --------------------------------------------------

      clonedObj.idsArr.push(tempObj);
    }

    // --------------------------------------------------
    //   Format - publicIDsArr
    // --------------------------------------------------

    clonedObj.publicIDsArr = [];

    for (let value2Obj of publicIDsArr.values()) {
      // --------------------------------------------------
      //   伏せ字にする
      // --------------------------------------------------

      if (!publicIDsAndInformations) {
        value2Obj.id = "*****";
      }

      // --------------------------------------------------
      //   array.push
      // --------------------------------------------------

      clonedObj.publicIDsArr.push(value2Obj);
    }

    // --------------------------------------------------
    //   Format - publicInformationsArr
    // --------------------------------------------------

    clonedObj.publicInformationsArr = [];

    for (let value2Obj of publicInformationsArr.values()) {
      // --------------------------------------------------
      //   伏せ字にする
      // --------------------------------------------------

      if (!publicIDsAndInformations) {
        value2Obj.information = "*****";
      }

      // --------------------------------------------------
      //   array.push
      // --------------------------------------------------

      clonedObj.publicInformationsArr.push(value2Obj);
    }

    // --------------------------------------------------
    //   編集権限
    // --------------------------------------------------

    clonedObj.editable = verifyAuthority({
      req,
      users_id: valueObj.users_id,
      loginUsers_id,
      ISO8601: valueObj.createdDate,
      _id: valueObj._id,
    });

    // --------------------------------------------------
    //   Name & Description
    // --------------------------------------------------

    const filteredArr = valueObj.localesArr.filter((filterObj) => {
      return filterObj.language === localeObj.language;
    });

    if (lodashHas(filteredArr, [0])) {
      clonedObj.title = lodashGet(filteredArr, [0, "title"], "");
      clonedObj.name = lodashGet(filteredArr, [0, "name"], "");
      clonedObj.comment = lodashGet(filteredArr, [0, "comment"], "");
    } else {
      clonedObj.title = lodashGet(filteredArr, [0, "title"], "");
      clonedObj.name = lodashGet(valueObj, ["localesArr", 0, "name"], "");
      clonedObj.comment = lodashGet(valueObj, ["localesArr", 0, "comment"], "");
    }

    // --------------------------------------------------
    //   hardwaresArr - 元の配列の順番通りに並べなおす
    // --------------------------------------------------

    const sortedHardwaresArr = [];

    for (let hardwareID of hardwareIDsArr) {
      const index = hardwaresArr.findIndex((value2Obj) => {
        return value2Obj.hardwareID === hardwareID;
      });

      if (index !== -1) {
        sortedHardwaresArr.push(hardwaresArr[index]);
      }
    }

    clonedObj.hardwaresArr = sortedHardwaresArr;

    // --------------------------------------------------
    //   通知
    // --------------------------------------------------

    if (lodashHas(valueObj, ["webPushesObj", "_id"])) {
      clonedObj.notification = "webpush";
    }

    // --------------------------------------------------
    //   不要な項目を削除する
    // --------------------------------------------------

    delete clonedObj._id;
    delete clonedObj.createdDate;
    delete clonedObj.hardwareIDsArr;
    delete clonedObj.ids_idsArr;
    delete clonedObj.localesArr;
    // delete clonedObj.close;
    delete clonedObj.webPushAvailable;
    delete clonedObj.webPushesObj;
    delete clonedObj.language;
    delete clonedObj.ip;
    delete clonedObj.userAgent;
    delete clonedObj.__v;

    // --------------------------------------------------
    //   コメント取得用の _id の入った配列に push
    // --------------------------------------------------

    dataObj[valueObj._id] = clonedObj;

    if (valueObj.comments > 0) {
      recruitmentThreads_idsArr.push(valueObj._id);
    }

    // --------------------------------------------------
    //   forumThreadsObj を作成する
    // --------------------------------------------------

    const recruitmentThreadsPageArr = lodashGet(
      recruitmentThreadsObj,
      [`page${threadPage}Obj`, "arr"],
      []
    );

    recruitmentThreadsPageArr.push(valueObj._id);

    recruitmentThreadsObj[`page${threadPage}Obj`] = {
      loadedDate: ISO8601,
      arr: recruitmentThreadsPageArr,
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

    // console.log(chalk`
    //   users_id: {green ${users_id}}
    //   webPush: {green ${webPush}}
    //   webPushEndpoint: {green ${webPushEndpoint}}
    //   webPushUsersEndpoint: {green ${webPushUsersEndpoint}}
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   publicSetting: {green ${publicSetting}}
    // `);

    // console.log(`
    //   ----- publicCommentsUsers_idsArr -----\n
    //   ${util.inspect(publicCommentsUsers_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- publicApprovalUsers_idsArrr -----\n
    //   ${util.inspect(publicApprovalUsers_idsArrr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnArr -----\n
    //   ${util.inspect(returnArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  }

  // --------------------------------------------------
  //   dataObj
  // --------------------------------------------------

  recruitmentThreadsObj.dataObj = dataObj;

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    recruitmentThreadsObj,
    recruitmentThreads_idsArr,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  formatRecruitmentThreadsArr,
};

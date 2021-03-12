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

// const moment = require('moment');

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");
const lodashHas = require("lodash/has");
const lodashCloneDeep = require("lodash/cloneDeep");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const SchemaNotifications = require("./schema.js");

const ModelRecruitmentThreads = require("../recruitment-threads/model.js");
const ModelRecruitmentComments = require("../recruitment-comments/model.js");
const ModelRecruitmentReplies = require("../recruitment-replies/model.js");
const ModelWebPushes = require("../web-pushes/model.js");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { sendNotifications } = require("../../@modules/web-push.js");
const { tweet } = require("../../@modules/twitter.js");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * 検索してデータを取得する / 1件だけ
 * @param {Object} conditionObj - 検索条件
 * @return {Object} 取得データ
 */
const findOne = async ({ conditionObj }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Error
    // --------------------------------------------------

    if (!conditionObj || !Object.keys(conditionObj).length) {
      throw new Error();
    }

    // --------------------------------------------------
    //   FindOne
    // --------------------------------------------------

    return await SchemaNotifications.findOne(conditionObj).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * 取得する
 * @param {Object} conditionObj - 検索条件
 * @return {Array} 取得データ
 */
const find = async ({ conditionObj }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Error
    // --------------------------------------------------

    if (!conditionObj || !Object.keys(conditionObj).length) {
      throw new Error();
    }

    // --------------------------------------------------
    //   Find
    // --------------------------------------------------

    return await SchemaNotifications.find(conditionObj).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * カウントを取得する
 * @param {Object} conditionObj - 検索条件
 * @return {number} カウント数
 */
const count = async ({ conditionObj }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Error
    // --------------------------------------------------

    if (!conditionObj || !Object.keys(conditionObj).length) {
      throw new Error();
    }

    // --------------------------------------------------
    //   Find
    // --------------------------------------------------

    return await SchemaNotifications.countDocuments(conditionObj).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * 挿入 / 更新する
 * @param {Object} conditionObj - 検索条件
 * @param {Object} saveObj - 保存するデータ
 * @return {Array}
 */
const upsert = async ({ conditionObj, saveObj }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Error
    // --------------------------------------------------

    if (!conditionObj || !Object.keys(conditionObj).length) {
      throw new Error();
    }

    if (!saveObj || !Object.keys(saveObj).length) {
      throw new Error();
    }

    // --------------------------------------------------
    //   Upsert
    // --------------------------------------------------

    return await SchemaNotifications.findOneAndUpdate(conditionObj, saveObj, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * 大量に更新する
 * @param {Object} conditionObj - 検索条件
 * @param {Object} saveObj - 保存するデータ / $set を使うこと
 * @return {Array}
 */
const updateMany = async ({ conditionObj, saveObj }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Error
    // --------------------------------------------------

    if (!conditionObj || !Object.keys(conditionObj).length) {
      throw new Error();
    }

    if (!saveObj || !Object.keys(saveObj).length) {
      throw new Error();
    }

    // --------------------------------------------------
    //   Upsert
    // --------------------------------------------------

    return await SchemaNotifications.updateMany(conditionObj, saveObj).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * 大量に挿入する
 * @param {Array} saveArr - 保存するデータ
 * @return {Array}
 */
const insertMany = async ({ saveArr }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Error
    // --------------------------------------------------

    if (!saveArr || !saveArr.length) {
      throw new Error();
    }

    // --------------------------------------------------
    //   insertMany
    // --------------------------------------------------

    return await SchemaNotifications.insertMany(saveArr);
  } catch (err) {
    throw err;
  }
};

/**
 * 削除する
 * @param {Object} conditionObj - 検索条件
 * @param {boolean} reset - trueでデータをすべて削除する
 * @return {Array}
 */
const deleteMany = async ({ conditionObj, reset = false }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Error
    // --------------------------------------------------

    if (!reset && (!conditionObj || !Object.keys(conditionObj).length)) {
      throw new Error();
    }

    // --------------------------------------------------
    //   Delete
    // --------------------------------------------------

    return await SchemaNotifications.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   send
// --------------------------------------------------

/**
 * 通知を送信する / 2020/5/21
 * @return {Array} 取得データ
 */
const send = async ({}) => {
  try {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const notificationsArr = [];
    const notifications_idsArr = [];

    // --------------------------------------------------
    //   aggregate
    // --------------------------------------------------

    const docNotificationsArr = await SchemaNotifications.aggregate([
      {
        $match: {
          done: false,
        },
      },

      // --------------------------------------------------
      //   $sort / $limit
      // --------------------------------------------------

      { $sort: { createdDate: 1 } },
      { $limit: parseInt(process.env.NOTIFICATION_QUEUE_LIMIT, 10) },
    ]).exec();

    // console.log(`
    //   ----- docNotificationsArr -----\n
    //   ${util.inspect(docNotificationsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // return;

    // --------------------------------------------------
    //   Queue がない場合、処理停止
    // --------------------------------------------------

    if (docNotificationsArr.length === 0) {
      return;
    }

    // --------------------------------------------------
    //   Loop
    // --------------------------------------------------

    for (let value1Obj of docNotificationsArr.values()) {
      // --------------------------------------------------
      //   Property
      // --------------------------------------------------

      const arr = lodashGet(value1Obj, ["arr"], []);
      const type = lodashGet(value1Obj, ["type"], "");

      // --------------------------------------------------
      //   notifications_idsArr
      // --------------------------------------------------

      notifications_idsArr.push(value1Obj._id);

      // --------------------------------------------------
      //   Recruitment - 募集投稿 / 公式 Twitter へ投稿
      // --------------------------------------------------

      if (type === "recruitment-threads") {
        const _id = lodashGet(arr, [0, "_id"], "");

        if (_id) {
          const twitterText = await ModelRecruitmentThreads.findNotificationForTwitter(
            { _id }
          );
          tweet({ twitterText });
        }

        // --------------------------------------------------
        //   Recruitment - 募集へのコメント or 返信 / Push通知送信
        // --------------------------------------------------
      } else if (
        type === "recruitment-comments" ||
        type === "recruitment-replies"
      ) {
        let recruitmentThreadsObj = {};
        let recruitmentCommentsObj = {};
        let recruitmentRepliesObj = {};

        for (let value2Obj of arr.values()) {
          // --------------------------------------------------
          //   recruitment-threads
          // --------------------------------------------------

          if (value2Obj.db === "recruitment-threads") {
            recruitmentThreadsObj = await ModelRecruitmentThreads.findForNotification(
              {
                _id: value2Obj._id,
              }
            );

            // --------------------------------------------------
            //   recruitment-comments
            // --------------------------------------------------
          } else if (value2Obj.db === "recruitment-comments") {
            recruitmentCommentsObj = await ModelRecruitmentComments.findForNotification(
              {
                _id: value2Obj._id,
              }
            );

            // --------------------------------------------------
            //   recruitment-replies
            // --------------------------------------------------
          } else if (value2Obj.db === "recruitment-replies") {
            recruitmentRepliesObj = await ModelRecruitmentReplies.findForNotification(
              {
                _id: value2Obj._id,
              }
            );
          }
        }

        // --------------------------------------------------
        //   Send Today Limit
        // --------------------------------------------------

        const threadsSendTodayLimit = parseInt(
          recruitmentThreadsObj.users_id
            ? process.env.WEB_PUSH_SEND_TODAY_LIMIT_LOGIN_USER
            : process.env.WEB_PUSH_SEND_TODAY_LIMIT,
          10
        );

        const commentsSendTodayLimit = parseInt(
          recruitmentCommentsObj.users_id
            ? process.env.WEB_PUSH_SEND_TODAY_LIMIT_LOGIN_USER
            : process.env.WEB_PUSH_SEND_TODAY_LIMIT,
          10
        );

        // console.log(chalk`
        //   value1Obj._id: {green ${value1Obj._id}}

        //   threadsSendTodayLimit: {green ${threadsSendTodayLimit}}
        //   recruitmentThreadsObj.sendTodayCount: {green ${recruitmentThreadsObj.sendTodayCount}}

        //   commentsSendTodayLimit: {green ${commentsSendTodayLimit}}
        //   recruitmentCommentsObj.sendTodayCount: {green ${recruitmentCommentsObj.sendTodayCount}}
        // `);

        // console.log(`
        //   ----- recruitmentThreadsObj -----\n
        //   ${util.inspect(recruitmentThreadsObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- recruitmentCommentsObj -----\n
        //   ${util.inspect(recruitmentCommentsObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- recruitmentRepliesObj -----\n
        //   ${util.inspect(recruitmentRepliesObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // --------------------------------------------------
        //   コメントが投稿された場合
        // --------------------------------------------------

        if (
          type === "recruitment-comments" &&
          recruitmentThreadsObj.subscriptionObj &&
          // Object.keys(recruitmentThreadsObj.subscriptionObj).length !== 0 &&
          threadsSendTodayLimit >= recruitmentThreadsObj.sendTodayCount
        ) {
          // --------------------------------------------------
          //   スレッド投稿者に通知
          // --------------------------------------------------

          notificationsArr.push({
            notifications_id: value1Obj._id,

            webPushes_id: recruitmentThreadsObj.webPushes_id,
            subscriptionObj: recruitmentThreadsObj.subscriptionObj,
            title: recruitmentThreadsObj.title,
            body: recruitmentCommentsObj.comment,
            icon: recruitmentThreadsObj.icon,
            tag: recruitmentCommentsObj._id,
            url: `${process.env.NEXT_PUBLIC_URL_BASE}gc/${recruitmentThreadsObj.urlID}/rec/${recruitmentCommentsObj._id}`,
            TTL: 120,
          });

          // --------------------------------------------------
          //   返信が投稿された場合
          // --------------------------------------------------
        } else if (type === "recruitment-replies") {
          // --------------------------------------------------
          //   スレッド投稿者に通知
          // --------------------------------------------------

          if (
            recruitmentThreadsObj.subscriptionObj &&
            // Object.keys(recruitmentThreadsObj.subscriptionObj).length !== 0 &&
            threadsSendTodayLimit >= recruitmentThreadsObj.sendTodayCount
          ) {
            notificationsArr.push({
              notifications_id: value1Obj._id,

              webPushes_id: recruitmentThreadsObj.webPushes_id,
              subscriptionObj: recruitmentThreadsObj.subscriptionObj,
              title: recruitmentThreadsObj.title,
              body: recruitmentRepliesObj.comment,
              icon: recruitmentThreadsObj.icon,
              tag: recruitmentRepliesObj._id,
              url: `${process.env.NEXT_PUBLIC_URL_BASE}gc/${recruitmentThreadsObj.urlID}/rec/${recruitmentRepliesObj._id}`,
              TTL: 120,
            });
          }

          // --------------------------------------------------
          //   コメント投稿者に通知
          // --------------------------------------------------

          if (
            recruitmentCommentsObj.subscriptionObj &&
            Object.keys(recruitmentRepliesObj).length !== 0 &&
            recruitmentThreadsObj.webPushes_id !==
              recruitmentCommentsObj.webPushes_id &&
            commentsSendTodayLimit >= recruitmentCommentsObj.sendTodayCount
          ) {
            notificationsArr.push({
              notifications_id: value1Obj._id,

              webPushes_id: recruitmentCommentsObj.webPushes_id,
              subscriptionObj: recruitmentCommentsObj.subscriptionObj,
              title: recruitmentThreadsObj.title,
              body: recruitmentRepliesObj.comment,
              icon: recruitmentThreadsObj.icon,
              tag: recruitmentRepliesObj._id,
              url: `${process.env.NEXT_PUBLIC_URL_BASE}gc/${recruitmentThreadsObj.urlID}/rec/${recruitmentRepliesObj._id}`,
              TTL: 120,
            });
          }
        }
      }
    }

    // --------------------------------------------------
    //   Push通知送信
    // --------------------------------------------------

    if (notificationsArr.length > 0) {
      const resultObj = await sendNotifications({ arr: notificationsArr });

      // const resultObj = {

      //   successesArr: ['nOVilxpSk', 'CLza57t8J', 'L4D5QB9p4'],
      //   failuresArr: [],

      // };

      // const resultObj = {

      //   successesArr: [],
      //   failuresArr: ['nOVilxpSk', 'CLza57t8J', 'L4D5QB9p4'],

      // };

      const successesArr = lodashGet(resultObj, ["successesArr"], []);
      const failuresArr = lodashGet(resultObj, ["failuresArr"], []);

      // --------------------------------------------------
      //   送信後の処理
      //   成功した行は errorCount を 0 に戻し、失敗した行は errorCount を +1 する
      // --------------------------------------------------

      await ModelWebPushes.successAndFailure({
        successesArr,
        failuresArr,
      });
    }

    // --------------------------------------------------
    //   Notifications / done: true / 通知を処理済みにする
    // --------------------------------------------------

    if (notifications_idsArr.length > 0) {
      const resultArr = await updateMany({
        conditionObj: {
          _id: { $in: notifications_idsArr },
        },

        saveObj: {
          $set: {
            done: true,
          },
        },
      });

      // console.log(`
      //   ----- resultArr -----\n
      //   ${util.inspect(resultArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/notifications/model.js - send
    // `);

    // console.log(`
    //   ----- docNotificationsArr -----\n
    //   ${util.inspect(docNotificationsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- notifications_idsArr -----\n
    //   ${util.inspect(notifications_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- notificationsArr -----\n
    //   ${util.inspect(notificationsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- resultObj -----\n
    //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  findOne,
  find,
  count,
  upsert,
  updateMany,
  insertMany,
  deleteMany,

  send,
};

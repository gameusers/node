// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

import moment from "moment";
import shortid from "shortid";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { calculateLevel } from "app/@modules/level.js";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import SchemaAchievements from "app/@database/achievements/schema.js";

import ModelExperiences from "app/@database/experiences/model.js";
import ModelAchievements from "app/@database/achievements/model.js";
import ModelTitles from "app/@database/titles/model.js";
import ModelUsers from "app/@database/users/model.js";
import ModelForumComments from "app/@database/forum-comments/model.js";
import ModelRecruitmentThreads from "app/@database/recruitment-threads/model.js";
import ModelRecruitmentComments from "app/@database/recruitment-comments/model.js";
import ModelRecruitmentReplies from "app/@database/recruitment-replies/model.js";
import ModelFollows from "app/@database/follows/model.js";
import ModelCardPlayers from "app/@database/card-players/model.js";
import ModelWebPushes from "app/@database/web-pushes/model.js";

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * 古のアカウント / account-ancient
 * @param {string} users_id - DB users _id / ユーザーID
 * @param {string} ISO8601 - 日時
 * @param {Array} historiesArr - 現在の達成状況を計算するためのデータが入っている配列
 * @param {Array} acquiredTitles_idsArr - 獲得した称号の _id が入っている配列
 */
const calculateAccountAncient = async ({
  users_id,
  ISO8601,
  historiesArr,
  acquiredTitles_idsArr,
}) => {
  try {
    // ---------------------------------------------
    //   index
    // ---------------------------------------------

    const index = historiesArr.findIndex((valueObj) => {
      return valueObj.type === "account-ancient";
    });

    // ---------------------------------------------
    //   DB find / users
    // ---------------------------------------------

    const docUsersObj = await ModelUsers.findOne({
      conditionObj: {
        _id: users_id,
      },
    });

    const createdDate = lodashGet(docUsersObj, ["createdDate"], "");

    // ---------------------------------------------
    //   DB achievements
    // ---------------------------------------------

    const docAchievementsObj = await ModelAchievements.findOne({
      conditionObj: {
        type: "account-ancient",
      },
    });

    const conditionsArr = lodashGet(docAchievementsObj, ["conditionsArr"], []);

    // ---------------------------------------------
    //   newHistoryObj
    // ---------------------------------------------

    let newHistoryObj = {
      _id: shortid.generate(),
      createdDate: ISO8601,
      updatedDate: ISO8601,
      type: "account-ancient",
      countDay: 0,
      countMonth: 0,
      countYear: 0,
      countValid: 0,
      countTotal: 0,
    };

    // ---------------------------------------------
    //   Calculate
    // ---------------------------------------------

    const datetimeCreated = moment(createdDate).utc();
    const datetimeVer2 = moment(process.env.VER2_START_DATETIME).utc(); // Ver.2の開始日時を入れる。それ以前にアカウントを作成している場合、実績達成。

    if (datetimeCreated.isBefore(datetimeVer2)) {
      // console.log('isBefore');

      newHistoryObj.countValid = 1;
      newHistoryObj.countTotal = 1;
    }

    // ---------------------------------------------
    //   acquiredTitles_idsArr
    // ---------------------------------------------

    const allTitles_idsArr = [];
    const newAcquiredTitles_idsArr = [];

    for (let valueObj of conditionsArr.values()) {
      // 獲得できるすべての titles_id を取得する
      allTitles_idsArr.push(valueObj.titles_id);

      // 獲得した titles_id を取得する
      if (valueObj.count <= newHistoryObj.countValid) {
        newAcquiredTitles_idsArr.push(valueObj.titles_id);
      }
    }

    // 一度、配列から獲得できるすべての titles_id を削除する
    const filteredArr = acquiredTitles_idsArr.filter((titles_id) => {
      return allTitles_idsArr.includes(titles_id) === false;
    });

    // 獲得した titles_id を追加（結合）する
    const updatedTitles_idsArr = filteredArr.concat(newAcquiredTitles_idsArr);

    // ---------------------------------------------
    //   Return Object
    // ---------------------------------------------

    const newHistoriesArr = historiesArr;

    if (index === -1 && newHistoryObj.countValid === 1) {
      newHistoriesArr.push(newHistoryObj);
    }

    const returnObj = {
      historiesArr: newHistoriesArr,
      acquiredTitles_idsArr: updatedTitles_idsArr,
    };

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/experience.js - calculateAccountAncient
    // `);

    // console.log(`
    //   ----- acquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(acquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- allTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(allTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newAcquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newAcquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- filteredArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(filteredArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- updatedTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(updatedTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newHistoryObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newHistoryObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- historiesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(historiesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newHistoryObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newHistoryObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return
    // ---------------------------------------------

    return returnObj;
  } catch (errorObj) {
    throw errorObj;
  }
};

/**
 * アカウント作成後の経過日数 / account-count-day
 * @param {string} users_id - DB users _id / ユーザーID
 * @param {string} ISO8601 - 日時
 * @param {Array} historiesArr - 現在の達成状況を計算するためのデータが入っている配列
 * @param {Array} acquiredTitles_idsArr - 獲得した称号の _id が入っている配列
 */
const calculateAccountCountDay = async ({
  users_id,
  ISO8601,
  historiesArr,
  acquiredTitles_idsArr,
}) => {
  try {
    // ---------------------------------------------
    //   historyObj
    // ---------------------------------------------

    let historyObj = {};

    const index = historiesArr.findIndex((valueObj) => {
      return valueObj.type === "account-count-day";
    });

    if (index !== -1) {
      historyObj = historiesArr[index];
    }

    // console.log(chalk`
    //   index: {green ${index}}
    // `);

    // console.log(`
    //   ----- historyObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(historyObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   DB find / users
    // ---------------------------------------------

    const docUsersObj = await ModelUsers.findOne({
      conditionObj: {
        _id: users_id,
      },
    });

    const createdDate = lodashGet(docUsersObj, ["createdDate"], "");

    // ---------------------------------------------
    //   DB achievements
    // ---------------------------------------------

    const docAchievementsObj = await ModelAchievements.findOne({
      conditionObj: {
        type: "account-count-day",
      },
    });

    // const limitDay = lodashGet(docAchievementsObj, ['limitDay'], 0);
    // const limitMonth = lodashGet(docAchievementsObj, ['limitMonth'], 0);
    // const limitYear = lodashGet(docAchievementsObj, ['limitYear'], 0);

    const conditionsArr = lodashGet(docAchievementsObj, ["conditionsArr"], []);

    // ---------------------------------------------
    //   newHistoryObj
    // ---------------------------------------------

    // ----------------------------------------
    //   - Update
    // ----------------------------------------

    let newHistoryObj = {};

    if (Object.keys(historyObj).length !== 0) {
      newHistoryObj = historyObj;
      newHistoryObj.updatedDate = ISO8601;

      // ----------------------------------------
      //   - Insert
      // ----------------------------------------
    } else {
      newHistoryObj = {
        _id: shortid.generate(),
        createdDate,
        updatedDate: ISO8601,
        type: "account-count-day",
        countDay: 0,
        countMonth: 0,
        countYear: 0,
        countValid: 0,
        countTotal: 0,
      };
    }

    // ---------------------------------------------
    //   Calculate
    // ---------------------------------------------

    const datetimeCreated = moment(createdDate).utc();
    const datetimeCurrent = moment().utc();
    const days = datetimeCurrent.diff(datetimeCreated, "days");

    newHistoryObj.updatedDate = ISO8601;
    newHistoryObj.countValid = days;
    newHistoryObj.countTotal = days;

    // ---------------------------------------------
    //   acquiredTitles_idsArr
    // ---------------------------------------------

    const allTitles_idsArr = [];
    const newAcquiredTitles_idsArr = [];

    for (let valueObj of conditionsArr.values()) {
      // 獲得できるすべての titles_id を取得する
      allTitles_idsArr.push(valueObj.titles_id);

      // 獲得した titles_id を取得する  (アカウント作成当日 countValid が 0 のときは無効)
      if (
        newHistoryObj.countValid > 0 &&
        valueObj.count <= newHistoryObj.countValid
      ) {
        newAcquiredTitles_idsArr.push(valueObj.titles_id);
      }
    }

    // 一度、配列から獲得できるすべての titles_id を削除する
    const filteredArr = acquiredTitles_idsArr.filter((titles_id) => {
      return allTitles_idsArr.includes(titles_id) === false;
    });

    // 獲得した titles_id を追加（結合）する
    const updatedTitles_idsArr = filteredArr.concat(newAcquiredTitles_idsArr);

    // ---------------------------------------------
    //   Return Object
    // ---------------------------------------------

    const newHistoriesArr = historiesArr;

    if (index === -1) {
      newHistoriesArr.push(newHistoryObj);
    } else {
      newHistoriesArr[index] = newHistoryObj;
    }

    const returnObj = {
      historiesArr: newHistoriesArr,
      acquiredTitles_idsArr: updatedTitles_idsArr,
    };

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/experience.js - calculateAccountCountDay
    // `);

    // console.log(chalk`
    // users_id: {green ${users_id}}
    // ISO8601: {green ${ISO8601}}
    // `);

    // console.log(`
    //   ----- historiesArr -----\n
    //   ${util.inspect(historiesArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- acquiredTitles_idsArr -----\n
    //   ${util.inspect(acquiredTitles_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newAcquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newAcquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- filteredArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(filteredArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- updatedTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(updatedTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newHistoryObj -----\n
    //   ${util.inspect(newHistoryObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return
    // ---------------------------------------------

    return returnObj;
  } catch (errorObj) {
    throw errorObj;
  }
};

/**
 * レベルアップ / level-count
 * @param {string} users_id - DB users _id / ユーザーID
 * @param {string} ISO8601 - 日時
 * @param {Array} historiesArr - 現在の達成状況を計算するためのデータが入っている配列
 * @param {Array} acquiredTitles_idsArr - 獲得した称号の _id が入っている配列
 */
const calculateLevelCount = async ({
  users_id,
  ISO8601,
  historiesArr,
  acquiredTitles_idsArr,
}) => {
  try {
    // ---------------------------------------------
    //   historyObj
    // ---------------------------------------------

    let historyObj = {};

    const index = historiesArr.findIndex((valueObj) => {
      return valueObj.type === "level-count";
    });

    if (index !== -1) {
      historyObj = historiesArr[index];
    }

    // --------------------------------------------------
    //   DB achievements
    // --------------------------------------------------

    const docAchievementsArr = await SchemaAchievements.find().exec();

    const findObj = docAchievementsArr.find((valueObj) => {
      return valueObj.type === "level-count";
    });

    const conditionsArr = lodashGet(findObj, ["conditionsArr"], []);

    // console.log(`
    //   ----- docAchievementsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docAchievementsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- conditionsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(conditionsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   newHistoryObj
    // ---------------------------------------------

    // ----------------------------------------
    //   - Update
    // ----------------------------------------

    let newHistoryObj = {};

    if (Object.keys(historyObj).length !== 0) {
      newHistoryObj = historyObj;
      newHistoryObj.updatedDate = ISO8601;

      // ----------------------------------------
      //   - Insert
      // ----------------------------------------
    } else {
      newHistoryObj = {
        _id: shortid.generate(),
        createdDate: ISO8601,
        updatedDate: ISO8601,
        type: "level-count",
        countDay: 0,
        countMonth: 0,
        countYear: 0,
        countValid: 0,
        countTotal: 0,
      };
    }

    // ---------------------------------------------
    //   Calculate
    // ---------------------------------------------

    let exp = 0;

    for (let valueObj of historiesArr.values()) {
      const type = lodashGet(valueObj, ["type"], "");
      const countValid = lodashGet(valueObj, ["countValid"], 0);

      const findObj = docAchievementsArr.find((valueObj) => {
        return valueObj.type === type;
      });

      exp += countValid * lodashGet(findObj, ["exp"], 0);

      // console.log(chalk`
      //   type: {green ${type}}
      //   countValid: {green ${countValid}}
      //   lodashGet(findObj, ['exp'], 0): {green ${lodashGet(findObj, ['exp'], 0)}}
      //   exp: {green ${exp}}
      // `);
    }

    const level = calculateLevel({ exp });

    newHistoryObj.countValid = level;
    newHistoryObj.countTotal = level;

    // console.log(chalk`
    //   exp total: {green ${exp}}
    //   level: {green ${level}}
    // `);

    // ---------------------------------------------
    //   acquiredTitles_idsArr
    // ---------------------------------------------

    const allTitles_idsArr = [];
    const newAcquiredTitles_idsArr = [];

    for (let valueObj of conditionsArr.values()) {
      // 獲得できるすべての titles_id を取得する
      allTitles_idsArr.push(valueObj.titles_id);

      // 獲得した titles_id を取得する
      if (valueObj.count <= newHistoryObj.countValid) {
        newAcquiredTitles_idsArr.push(valueObj.titles_id);
      }
    }

    // 一度、配列から獲得できるすべての titles_id を削除する
    const filteredArr = acquiredTitles_idsArr.filter((titles_id) => {
      return allTitles_idsArr.includes(titles_id) === false;
    });

    // 獲得した titles_id を追加（結合）する
    const updatedTitles_idsArr = filteredArr.concat(newAcquiredTitles_idsArr);

    // ---------------------------------------------
    //   Return Object
    // ---------------------------------------------

    const newHistoriesArr = historiesArr;

    if (index === -1) {
      newHistoriesArr.push(newHistoryObj);
    } else {
      newHistoriesArr[index] = newHistoryObj;
    }

    const returnObj = {
      historiesArr: newHistoriesArr,
      acquiredTitles_idsArr: updatedTitles_idsArr,
      exp,
    };

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/experience.js - calculateLevelCount
    // `);

    // console.log(`
    //   ----- acquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(acquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- allTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(allTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newAcquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newAcquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- filteredArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(filteredArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- updatedTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(updatedTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- historiesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(historiesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newHistoryObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newHistoryObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return
    // ---------------------------------------------

    return returnObj;
  } catch (errorObj) {
    throw errorObj;
  }
};

/**
 * 計算 / 加算、減算、再計算が可能
 * @param {string} type - [forum-count-post, recruitment-count-post, follow-count, followed-count, title-count]
 * @param {string} calculation - [addition（加算）, subtraction（減算）, recalculation（再計算）]
 * @param {string} users_id - DB users _id / ユーザーID
 * @param {string} ISO8601 - 日時
 * @param {Array} historiesArr - 現在の達成状況を計算するためのデータが入っている配列
 * @param {Array} acquiredTitles_idsArr - 獲得した称号の _id が入っている配列
 */
const calculate = async ({
  type,
  calculation,
  users_id,
  ISO8601,
  historiesArr,
  acquiredTitles_idsArr,
}) => {
  try {
    // ---------------------------------------------
    //   historyObj
    // ---------------------------------------------

    let historyObj = {};

    const index = historiesArr.findIndex((valueObj) => {
      return valueObj.type === type;
    });

    if (index !== -1) {
      historyObj = historiesArr[index];
    }

    // ---------------------------------------------
    //   DB achievements
    // ---------------------------------------------

    const docAchievementsObj = await ModelAchievements.findOne({
      conditionObj: {
        type,
      },
    });

    const limitDay = lodashGet(docAchievementsObj, ["limitDay"], 0);
    const limitMonth = lodashGet(docAchievementsObj, ["limitMonth"], 0);
    const limitYear = lodashGet(docAchievementsObj, ["limitYear"], 0);

    const conditionsArr = lodashGet(docAchievementsObj, ["conditionsArr"], []);

    // ---------------------------------------------
    //   newHistoryObj
    // ---------------------------------------------

    // ----------------------------------------
    //   - Update
    // ----------------------------------------

    let newHistoryObj = {};

    if (Object.keys(historyObj).length !== 0) {
      newHistoryObj = historyObj;

      const datetimeCurrent = moment(ISO8601).startOf("day");
      const datetimeUpdated = moment(newHistoryObj.updatedDate).startOf("day");

      // ---------------------------------------------
      //   前回の更新から日、月、年が変わっている場合はカウントを0にする
      // ---------------------------------------------

      if (
        limitDay &&
        datetimeCurrent.isSame(datetimeUpdated, "day") === false
      ) {
        newHistoryObj.countDay = 0;
      } else if (
        limitMonth &&
        datetimeCurrent.isSame(datetimeUpdated, "month") === false
      ) {
        newHistoryObj.countMonth = 0;
      } else if (
        limitYear &&
        datetimeCurrent.isSame(datetimeUpdated, "year") === false
      ) {
        newHistoryObj.countYear = 0;
      }

      newHistoryObj.updatedDate = ISO8601;

      // ----------------------------------------
      //   - Insert
      // ----------------------------------------
    } else {
      newHistoryObj = {
        _id: shortid.generate(),
        createdDate: ISO8601,
        updatedDate: ISO8601,
        type,
        countDay: 0,
        countMonth: 0,
        countYear: 0,
        countValid: 0,
        countTotal: 0,
      };
    }

    // ---------------------------------------------
    //   Calculate
    // ---------------------------------------------

    if (calculation === "addition") {
      // ----------------------------------------
      //   上限がある場合
      // ----------------------------------------

      if (
        (limitDay && limitDay >= newHistoryObj.countDay + 1) ||
        (limitMonth && limitMonth >= newHistoryObj.countMonth + 1) ||
        (limitYear && limitYear >= newHistoryObj.countYear + 1)
      ) {
        newHistoryObj.countDay += 1;
        newHistoryObj.countValid += 1;

        // ----------------------------------------
        //   上限がない場合
        // ----------------------------------------
      } else if (limitDay === 0 && limitMonth === 0 && limitYear === 0) {
        newHistoryObj.countValid += 1;
      }

      // console.log(chalk`
      //   type: {green ${type}}
      //   users_id: {green ${users_id}}
      //   limitDay: {green ${limitDay}}
      //   limitDay >= newHistoryObj.countDay + 1: {green ${limitDay >= newHistoryObj.countDay + 1}}
      // `);

      newHistoryObj.countTotal += 1;
    } else if (calculation === "subtraction") {
      newHistoryObj.countValid -= 1;
      newHistoryObj.countTotal -= 1;

      // ---------------------------------------------
      //   マイナスにしない
      // ---------------------------------------------

      if (newHistoryObj.countValid <= 0) {
        newHistoryObj.countValid = 0;
      }

      if (newHistoryObj.countTotal <= 0) {
        newHistoryObj.countTotal = 0;
      }
    } else {
      // ---------------------------------------------
      //   フォーラム書き込み / forum-count-post
      // ---------------------------------------------

      if (type === "forum-count-post") {
        newHistoryObj.countValid = await ModelForumComments.count({
          conditionObj: {
            users_id,
          },
        });

        // ---------------------------------------------
        //   募集の投稿 / recruitment-count-post
        // ---------------------------------------------
      } else if (type === "recruitment-count-post") {
        // ---------------------------------------------
        //   DB find / recruitment-threads
        // ---------------------------------------------

        const threadsCount = await ModelRecruitmentThreads.count({
          conditionObj: {
            users_id,
          },
        });

        // ---------------------------------------------
        //   DB find / recruitment-comments
        // ---------------------------------------------

        const commentsCount = await ModelRecruitmentComments.count({
          conditionObj: {
            users_id,
          },
        });

        // ---------------------------------------------
        //   DB find / recruitment-replies
        // ---------------------------------------------

        const repliesCount = await ModelRecruitmentReplies.count({
          conditionObj: {
            users_id,
          },
        });

        newHistoryObj.countValid = threadsCount + commentsCount + repliesCount;

        // ---------------------------------------------
        //   フォローする / follow-count
        // ---------------------------------------------
      } else if (type === "follow-count") {
        const docFollowsObj = await ModelFollows.findOne({
          conditionObj: {
            users_id,
          },
        });

        newHistoryObj.countValid = lodashGet(docFollowsObj, ["followCount"], 0);

        // ---------------------------------------------
        //   フォローされる / followed-count
        // ---------------------------------------------
      } else if (type === "followed-count") {
        const docFollowsObj = await ModelFollows.findOne({
          conditionObj: {
            users_id,
          },
        });

        newHistoryObj.countValid = lodashGet(
          docFollowsObj,
          ["followedCount"],
          0
        );

        // ---------------------------------------------
        //   称号を獲得する / title-count
        // ---------------------------------------------
      } else if (type === "title-count") {
        newHistoryObj.countValid = acquiredTitles_idsArr.length;
        newHistoryObj.countTotal = acquiredTitles_idsArr.length;
      }

      // ---------------------------------------------
      //   合計が有効数より少ない場合は、同じ数に変更する
      // ---------------------------------------------

      if (newHistoryObj.countTotal < newHistoryObj.countValid) {
        newHistoryObj.countTotal = newHistoryObj.countValid;
      }
    }

    // ---------------------------------------------
    //   acquiredTitles_idsArr
    // ---------------------------------------------

    const allTitles_idsArr = [];
    const newAcquiredTitles_idsArr = [];

    for (let valueObj of conditionsArr.values()) {
      // 獲得できるすべての titles_id を取得する
      allTitles_idsArr.push(valueObj.titles_id);

      // 獲得した titles_id を取得する
      if (valueObj.count <= newHistoryObj.countValid) {
        newAcquiredTitles_idsArr.push(valueObj.titles_id);
      }
    }

    // 一度、配列から獲得できるすべての titles_id を削除する
    const filteredArr = acquiredTitles_idsArr.filter((titles_id) => {
      return allTitles_idsArr.includes(titles_id) === false;
    });

    // 獲得した titles_id を追加（結合）する
    const updatedTitles_idsArr = filteredArr.concat(newAcquiredTitles_idsArr);

    // ---------------------------------------------
    //   Return Object
    // ---------------------------------------------

    const newHistoriesArr = historiesArr;

    if (index === -1) {
      newHistoriesArr.push(newHistoryObj);
    } else {
      newHistoriesArr[index] = newHistoryObj;
    }

    const returnObj = {
      historiesArr: newHistoriesArr,
      acquiredTitles_idsArr: updatedTitles_idsArr,
    };

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/experience.js - calculate
    // `);

    // console.log(`
    //   ----- acquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(acquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- allTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(allTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newAcquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newAcquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- filteredArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(filteredArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- updatedTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(updatedTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- historiesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(historiesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   type: {green ${type}}
    //   users_id: {green ${users_id}}
    // `);

    // console.log(`
    //   ----- newHistoryObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newHistoryObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return
    // ---------------------------------------------

    return returnObj;
  } catch (errorObj) {
    throw errorObj;
  }
};

/**
 * 計算・加算のみ / 一度、加算すると取り消すことはできない
 * 例えば Good ボタンを押して + 1 された値は、Good ボタンをもう一度押して取り消したとしても - 1 にはならない
 * @param {string} type - [login-count, good-count-click, good-count-clicked, gc-register, card-player-edit]
 * @param {string} calculation - [addition（加算）, recalculation（再計算）]
 * @param {string} users_id - DB users _id / ユーザーID
 * @param {string} ISO8601 - 日時
 * @param {Array} historiesArr - 現在の達成状況を計算するためのデータが入っている配列
 * @param {Array} acquiredTitles_idsArr - 獲得した称号の _id が入っている配列
 */
const calculateAddition = async ({
  type,
  calculation,
  onlyOnce = false,
  totalEqualValid = false,
  users_id,
  ISO8601,
  historiesArr,
  acquiredTitles_idsArr,
}) => {
  try {
    // ---------------------------------------------
    //   historyObj
    // ---------------------------------------------

    let historyObj = {};

    const index = historiesArr.findIndex((valueObj) => {
      return valueObj.type === type;
    });

    if (index !== -1) {
      historyObj = historiesArr[index];
    }

    // ---------------------------------------------
    //   DB achievements
    // ---------------------------------------------

    const docAchievementsObj = await ModelAchievements.findOne({
      conditionObj: {
        type,
      },
    });

    const limitDay = lodashGet(docAchievementsObj, ["limitDay"], 0);
    const limitMonth = lodashGet(docAchievementsObj, ["limitMonth"], 0);
    const limitYear = lodashGet(docAchievementsObj, ["limitYear"], 0);

    const conditionsArr = lodashGet(docAchievementsObj, ["conditionsArr"], []);

    // ---------------------------------------------
    //   newHistoryObj
    // ---------------------------------------------

    // ----------------------------------------
    //   - Update
    // ----------------------------------------

    let newHistoryObj = {};

    if (Object.keys(historyObj).length !== 0) {
      newHistoryObj = historyObj;

      const datetimeCurrent = moment(ISO8601).startOf("day");
      const datetimeUpdated = moment(newHistoryObj.updatedDate).startOf("day");

      // ---------------------------------------------
      //   前回の更新から日、月、年が変わっている場合はカウントを0にする
      // ---------------------------------------------

      if (
        limitDay &&
        datetimeCurrent.isSame(datetimeUpdated, "day") === false
      ) {
        newHistoryObj.countDay = 0;
      } else if (
        limitMonth &&
        datetimeCurrent.isSame(datetimeUpdated, "month") === false
      ) {
        newHistoryObj.countMonth = 0;
      } else if (
        limitYear &&
        datetimeCurrent.isSame(datetimeUpdated, "year") === false
      ) {
        newHistoryObj.countYear = 0;
      }

      newHistoryObj.updatedDate = ISO8601;

      // console.log(chalk`
      //   datetimeCurrent: {green ${datetimeCurrent}}
      //   datetimeUpdated: {green ${datetimeUpdated}}
      //   datetimeCurrent.isSame(datetimeUpdated, 'day')：{green ${datetimeCurrent.isSame(datetimeUpdated, 'day')}}
      // `);

      // ----------------------------------------
      //   - Insert
      // ----------------------------------------
    } else {
      newHistoryObj = {
        _id: shortid.generate(),
        createdDate: ISO8601,
        updatedDate: ISO8601,
        type,
        countDay: 0,
        countMonth: 0,
        countYear: 0,
        countValid: 0,
        countTotal: 0,
      };
    }

    // ---------------------------------------------
    //   Calculate
    // ---------------------------------------------

    // console.log(chalk`
    //   type: {green ${type}}
    //   limitDay: {green ${limitDay}}
    //   newHistoryObj.countDay：{green ${newHistoryObj.countDay}}
    //   newHistoryObj.countValid：{green ${newHistoryObj.countValid}}
    //   newHistoryObj.countTotal：{green ${newHistoryObj.countTotal}}
    // `);

    // ----------------------------------------
    //   追加
    // ----------------------------------------

    if (calculation === "addition") {
      // ----------------------------------------
      //   上限がある場合
      // ----------------------------------------

      if (
        (limitDay && limitDay >= newHistoryObj.countDay + 1) ||
        (limitMonth && limitMonth >= newHistoryObj.countMonth + 1) ||
        (limitYear && limitYear >= newHistoryObj.countYear + 1)
      ) {
        newHistoryObj.countDay += 1;
        newHistoryObj.countValid += 1;

        // ----------------------------------------
        //   上限がない場合
        // ----------------------------------------
      } else if (limitDay === 0 && limitMonth === 0 && limitYear === 0) {
        newHistoryObj.countValid += 1;
      }

      newHistoryObj.countTotal += 1;

      // ----------------------------------------
      //   一度だけ追加が許される場合
      // ----------------------------------------

      if (onlyOnce) {
        newHistoryObj.countDay = 0;
        newHistoryObj.countMonth = 0;
        newHistoryObj.countYear = 0;
        newHistoryObj.countValid = 1;
        newHistoryObj.countTotal = 1;
      }
    }

    // ----------------------------------------
    //   - countTotal と countValid が同じでなければならない場合
    // ----------------------------------------

    if (totalEqualValid) {
      newHistoryObj.countTotal = newHistoryObj.countValid;
    }

    // ---------------------------------------------
    //   acquiredTitles_idsArr
    // ---------------------------------------------

    const allTitles_idsArr = [];
    const newAcquiredTitles_idsArr = [];

    for (let valueObj of conditionsArr.values()) {
      // 獲得できるすべての titles_id を取得する
      allTitles_idsArr.push(valueObj.titles_id);

      // 獲得した titles_id を取得する
      if (valueObj.count <= newHistoryObj.countValid) {
        newAcquiredTitles_idsArr.push(valueObj.titles_id);
      }
    }

    // 一度、配列から獲得できるすべての titles_id を削除する
    const filteredArr = acquiredTitles_idsArr.filter((titles_id) => {
      return allTitles_idsArr.includes(titles_id) === false;
    });

    // 獲得した titles_id を追加（結合）する
    const updatedTitles_idsArr = filteredArr.concat(newAcquiredTitles_idsArr);

    // ---------------------------------------------
    //   Return Object
    // ---------------------------------------------

    const newHistoriesArr = historiesArr;

    if (index === -1) {
      newHistoriesArr.push(newHistoryObj);
    } else {
      newHistoriesArr[index] = newHistoryObj;
    }

    const returnObj = {
      historiesArr: newHistoriesArr,
      acquiredTitles_idsArr: updatedTitles_idsArr,
    };

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/experience.js - calculateLoginCount
    // `);

    // console.log(`
    //   ----- acquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(acquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- allTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(allTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newAcquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newAcquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- filteredArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(filteredArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- updatedTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(updatedTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- historiesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(historiesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newHistoryObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newHistoryObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return
    // ---------------------------------------------

    return returnObj;
  } catch (errorObj) {
    throw errorObj;
  }
};

/**
 * 計算する・DB / データベースの値によって 0 か 1 に変わるもの
 * @param {string} type - [title-show, card-player-upload-image-main, card-player-upload-image-thumbnail, user-page-upload-image-main, web-push-permission]
 * @param {string} users_id - DB users _id / ユーザーID
 * @param {string} ISO8601 - 日時
 * @param {Array} historiesArr - 現在の達成状況を計算するためのデータが入っている配列
 * @param {Array} acquiredTitles_idsArr - 獲得した称号の _id が入っている配列
 * @param {Array} selectedTitles_idsArr - 表示する称号の _id が入っている配列
 */
const calculateDB = async ({
  type,
  users_id,
  ISO8601,
  historiesArr,
  acquiredTitles_idsArr,
  selectedTitles_idsArr,
}) => {
  try {
    // ---------------------------------------------
    //   historyObj
    // ---------------------------------------------

    let historyObj = {};

    const index = historiesArr.findIndex((valueObj) => {
      return valueObj.type === type;
    });

    if (index !== -1) {
      historyObj = historiesArr[index];
    }

    // ---------------------------------------------
    //   DB achievements
    // ---------------------------------------------

    const docAchievementsObj = await ModelAchievements.findOne({
      conditionObj: {
        type,
      },
    });

    const conditionsArr = lodashGet(docAchievementsObj, ["conditionsArr"], []);

    // ---------------------------------------------
    //   newHistoryObj
    // ---------------------------------------------

    // ----------------------------------------
    //   - Update
    // ----------------------------------------

    let newHistoryObj = {};

    if (Object.keys(historyObj).length !== 0) {
      newHistoryObj = historyObj;
      newHistoryObj.updatedDate = ISO8601;

      // ----------------------------------------
      //   - Insert
      // ----------------------------------------
    } else {
      newHistoryObj = {
        _id: shortid.generate(),
        createdDate: ISO8601,
        updatedDate: ISO8601,
        type,
        countDay: 0,
        countMonth: 0,
        countYear: 0,
        countValid: 0,
        countTotal: 0,
      };
    }

    // ---------------------------------------------
    //   Calculate
    // ---------------------------------------------

    let enable = false;

    // ---------------------------------------------
    //   - title-show
    // ---------------------------------------------

    if (type === "title-show") {
      if (selectedTitles_idsArr.length > 0) {
        enable = true;
      }

      // ----------------------------------------
      //   - card-player-upload-image-main
      // ----------------------------------------
    } else if (type === "card-player-upload-image-main") {
      const docCardPlayersObj = await ModelCardPlayers.findOne({
        conditionObj: {
          users_id,
        },
      });

      const imagesAndVideos_id = lodashGet(
        docCardPlayersObj,
        ["imagesAndVideos_id"],
        ""
      );

      if (imagesAndVideos_id) {
        enable = true;
      }

      // ----------------------------------------
      //   - card-player-upload-image-thumbnail
      // ----------------------------------------
    } else if (type === "card-player-upload-image-thumbnail") {
      const docCardPlayersObj = await ModelCardPlayers.findOne({
        conditionObj: {
          users_id,
        },
      });

      const imagesAndVideosThumbnail_id = lodashGet(
        docCardPlayersObj,
        ["imagesAndVideosThumbnail_id"],
        ""
      );

      if (imagesAndVideosThumbnail_id) {
        enable = true;
      }

      // ----------------------------------------
      //   - user-page-upload-image-main
      // ----------------------------------------
    } else if (type === "user-page-upload-image-main") {
      const docUsersObj = await ModelUsers.findOne({
        conditionObj: {
          _id: users_id,
        },
      });

      const imagesAndVideos_id = lodashGet(
        docUsersObj,
        ["pagesObj", "imagesAndVideos_id"],
        ""
      );

      if (imagesAndVideos_id) {
        enable = true;
      }

      // ----------------------------------------
      //   - web-push-permission
      // ----------------------------------------
    } else if (type === "web-push-permission") {
      const docUsersObj = await ModelUsers.findOne({
        conditionObj: {
          _id: users_id,
        },
      });

      const webPushes_id = lodashGet(docUsersObj, ["webPushes_id"], "");

      const docWebPushesObj = await ModelWebPushes.findOne({
        conditionObj: {
          _id: webPushes_id,
        },
      });

      const endpoint = lodashGet(
        docWebPushesObj,
        ["subscriptionObj", "endpoint"],
        ""
      );

      if (endpoint) {
        enable = true;
      }
    }

    if (enable) {
      newHistoryObj.updatedDate = ISO8601;
      newHistoryObj.countValid = 1;
      newHistoryObj.countTotal = 1;
    } else {
      newHistoryObj.updatedDate = ISO8601;
      newHistoryObj.countValid = 0;
      newHistoryObj.countTotal = 0;
    }

    // ---------------------------------------------
    //   acquiredTitles_idsArr
    // ---------------------------------------------

    const allTitles_idsArr = [];
    const newAcquiredTitles_idsArr = [];

    for (let valueObj of conditionsArr.values()) {
      // 獲得できるすべての titles_id を取得する
      allTitles_idsArr.push(valueObj.titles_id);

      // 獲得した titles_id を取得する
      if (valueObj.count <= newHistoryObj.countValid) {
        newAcquiredTitles_idsArr.push(valueObj.titles_id);
      }
    }

    // 一度、配列から獲得できるすべての titles_id を削除する
    const filteredArr = acquiredTitles_idsArr.filter((titles_id) => {
      return allTitles_idsArr.includes(titles_id) === false;
    });

    // 獲得した titles_id を追加（結合）する
    const updatedTitles_idsArr = filteredArr.concat(newAcquiredTitles_idsArr);

    // console.log(`
    //   ----- conditionsArr -----\n
    //   ${util.inspect(conditionsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newAcquiredTitles_idsArr -----\n
    //   ${util.inspect(newAcquiredTitles_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- filteredArr -----\n
    //   ${util.inspect(filteredArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- updatedTitles_idsArr -----\n
    //   ${util.inspect(updatedTitles_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return Object
    // ---------------------------------------------

    const newHistoriesArr = historiesArr;

    if (index === -1) {
      newHistoriesArr.push(newHistoryObj);
    } else {
      newHistoriesArr[index] = newHistoryObj;
    }

    const returnObj = {
      historiesArr: newHistoriesArr,
      acquiredTitles_idsArr: updatedTitles_idsArr,
    };

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/experience.js - calculateDB
    // `);

    // console.log(`
    //   ----- acquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(acquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- allTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(allTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newAcquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newAcquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- filteredArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(filteredArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- updatedTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(updatedTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newHistoryObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newHistoryObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- historiesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(historiesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- newHistoryObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(newHistoryObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return
    // ---------------------------------------------

    return returnObj;
  } catch (errorObj) {
    throw errorObj;
  }
};

/**
 * 経験値、獲得称号を計算する / 数値の加算、減算、再計算も行う
 * （何度もデータベースにアクセスするので処理が重いかもしれない）
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} arr - { type, calculation }
 * type - なにを処理するのか指定する / ['account-ancient', 'level-count', 'account-count-day', 'login-count', 'good-count-click', 'good-count-clicked', 'forum-count-post', 'recruitment-count-post', 'follow-count', 'followed-count', 'title-count', 'title-show', 'card-player-edit', 'card-player-upload-image-main', 'card-player-upload-image-thumbnail', 'user-page-upload-image-main', 'user-page-change-url', 'web-push-permission']
 * calculation - [addition（加算）, subtraction（減算）, recalculation（再計算）]
 */
const experienceCalculate = async ({
  req,
  localeObj,
  loginUsers_id,
  targetUsers_id,
  recalculationAll = false,
  arr = [],
}) => {
  try {
    // console.log(chalk`
    // loginUsers_id: {green ${loginUsers_id}}
    // targetUsers_id: {green ${targetUsers_id}}
    // recalculationAll: {green ${recalculationAll}}
    // `);

    // --------------------------------------------------
    //   ログインチェック
    // --------------------------------------------------

    if (!req.isAuthenticated()) {
      return {};
    }

    // --------------------------------------------------
    //   Role - サイト運営
    // --------------------------------------------------

    const role = lodashGet(req, ["user", "role"], "user");

    if (role === "administrator" && !targetUsers_id) {
      return {};
    }

    // ---------------------------------------------
    //   Property
    // ---------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    const users_id = targetUsers_id || loginUsers_id;

    // ---------------------------------------------
    //   DB find / experiences
    // ---------------------------------------------

    const docExperiencesObj = await ModelExperiences.findOne({
      conditionObj: {
        users_id,
      },
    });

    const currentExp = lodashGet(docExperiencesObj, ["exp"], 0);
    const currentAcquiredTitles_idsArr = lodashGet(
      docExperiencesObj,
      ["acquiredTitles_idsArr"],
      []
    );

    let historiesArr = lodashGet(docExperiencesObj, ["historiesArr"], []);
    let acquiredTitles_idsArr = lodashGet(
      docExperiencesObj,
      ["acquiredTitles_idsArr"],
      []
    );
    let selectedTitles_idsArr = lodashGet(
      docExperiencesObj,
      ["selectedTitles_idsArr"],
      []
    );

    // ---------------------------------------------
    //   Loop
    // ---------------------------------------------

    for (let valueObj of arr.values()) {
      // ---------------------------------------------
      //   type & calculation
      // ---------------------------------------------

      const type = valueObj.type;
      const calculation = recalculationAll
        ? "recalculation"
        : valueObj.calculation;

      // ---------------------------------------------
      //   account-ancient
      // ---------------------------------------------

      if (type === "account-ancient" || calculation === "recalculation") {
        const tempObj = await calculateAccountAncient({
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   account-count-day
      // ---------------------------------------------

      // if (calculation === 'recalculation') {

      //   const tempObj = await calculateAccountCountDay({

      //     users_id,
      //     ISO8601,
      //     historiesArr,
      //     acquiredTitles_idsArr,

      //   });

      //   historiesArr = lodashGet(tempObj, ['historiesArr'], []);
      //   acquiredTitles_idsArr = lodashGet(tempObj, ['acquiredTitles_idsArr'], []);

      // }

      // ---------------------------------------------
      //   login-count & account-count-day
      //   ログインカウントを増やす際に、同時にアカウント作成からの経過日数を計算する
      // ---------------------------------------------

      if (
        (type === "login-count" && calculation === "addition") ||
        calculation === "recalculation"
      ) {
        // ---------------------------------------------
        //   login-count
        // ---------------------------------------------

        let tempObj = await calculateAddition({
          type: "login-count",
          calculation,
          totalEqualValid: true,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );

        // ---------------------------------------------
        //   account-count-day
        // ---------------------------------------------

        tempObj = await calculateAccountCountDay({
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   good-count-click
      // ---------------------------------------------

      if (
        (type === "good-count-click" && calculation === "addition") ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculateAddition({
          type: "good-count-click",
          calculation,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   good-count-clicked
      // ---------------------------------------------

      if (
        (type === "good-count-clicked" && calculation === "addition") ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculateAddition({
          type: "good-count-clicked",
          calculation,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   gc-register
      // ---------------------------------------------

      if (
        (type === "gc-register" && calculation === "addition") ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculateAddition({
          type: "gc-register",
          calculation,
          totalEqualValid: true,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   forum-count-post
      // ---------------------------------------------

      if (type === "forum-count-post" || calculation === "recalculation") {
        const tempObj = await calculate({
          type: "forum-count-post",
          calculation,
          ISO8601,
          users_id,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   recruitment-count-post
      // ---------------------------------------------

      if (
        type === "recruitment-count-post" ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculate({
          type: "recruitment-count-post",
          calculation,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   follow-count
      // ---------------------------------------------

      if (type === "follow-count" || calculation === "recalculation") {
        const tempObj = await calculate({
          type: "follow-count",
          calculation,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   followed-count
      // ---------------------------------------------

      if (type === "followed-count" || calculation === "recalculation") {
        const tempObj = await calculate({
          type: "followed-count",
          calculation,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   title-show
      // ---------------------------------------------

      if (type === "title-show" || calculation === "recalculation") {
        const tempObj = await calculateDB({
          type: "title-show",
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
          selectedTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   card-player-edit
      // ---------------------------------------------

      if (
        (type === "card-player-edit" && calculation === "addition") ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculateAddition({
          type: "card-player-edit",
          calculation,
          onlyOnce: true,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   card-player-upload-image-main
      // ---------------------------------------------

      if (
        type === "card-player-upload-image-main" ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculateDB({
          type: "card-player-upload-image-main",
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   card-player-upload-image-thumbnail
      // ---------------------------------------------

      if (
        type === "card-player-upload-image-thumbnail" ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculateDB({
          type: "card-player-upload-image-thumbnail",
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   user-page-upload-image-main
      // ---------------------------------------------

      if (
        type === "user-page-upload-image-main" ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculateDB({
          type: "user-page-upload-image-main",
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   user-page-change-url
      // ---------------------------------------------

      if (
        (type === "user-page-change-url" && calculation === "addition") ||
        calculation === "recalculation"
      ) {
        const tempObj = await calculateAddition({
          type: "user-page-change-url",
          calculation,
          onlyOnce: true,
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }

      // ---------------------------------------------
      //   web-push-permission
      // ---------------------------------------------

      if (type === "web-push-permission" || calculation === "recalculation") {
        const tempObj = await calculateDB({
          type: "web-push-permission",
          users_id,
          ISO8601,
          historiesArr,
          acquiredTitles_idsArr,
        });

        historiesArr = lodashGet(tempObj, ["historiesArr"], []);
        acquiredTitles_idsArr = lodashGet(
          tempObj,
          ["acquiredTitles_idsArr"],
          []
        );
      }
    }

    // ---------------------------------------------
    //   title-count
    // ---------------------------------------------

    const titleCountObj = await calculate({
      type: "title-count",
      users_id,
      ISO8601,
      historiesArr,
      acquiredTitles_idsArr,
    });

    historiesArr = lodashGet(titleCountObj, ["historiesArr"], []);
    acquiredTitles_idsArr = lodashGet(
      titleCountObj,
      ["acquiredTitles_idsArr"],
      []
    );

    // ---------------------------------------------
    //   level-count
    // ---------------------------------------------

    const levelCountObj = await calculateLevelCount({
      users_id,
      ISO8601,
      historiesArr,
      acquiredTitles_idsArr,
    });

    historiesArr = lodashGet(levelCountObj, ["historiesArr"], []);
    acquiredTitles_idsArr = lodashGet(
      levelCountObj,
      ["acquiredTitles_idsArr"],
      []
    );
    const exp = lodashGet(levelCountObj, ["exp"], 0);

    // console.log(`
    //   ----- selectedTitles_idsArr 1 -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(selectedTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   獲得していない称号が選択されている場合は削除する
    // ---------------------------------------------

    selectedTitles_idsArr = selectedTitles_idsArr.filter((titles_id) => {
      return acquiredTitles_idsArr.includes(titles_id);
    });

    // console.log(`
    //   ----- selectedTitles_idsArr 2 -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(selectedTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Condition Object
    // --------------------------------------------------

    const conditionObj = {
      users_id,
    };

    // --------------------------------------------------
    //   Save Object
    // --------------------------------------------------

    const saveObj = {
      $set: {
        updatedDate: ISO8601,
        exp,
        historiesArr,
        acquiredTitles_idsArr,
        selectedTitles_idsArr,
      },
    };

    // ---------------------------------------------
    //   DB experiences / upsert
    // ---------------------------------------------

    await ModelExperiences.upsert({
      conditionObj,
      saveObj,
    });

    // ---------------------------------------------
    //   本人分のみ Snackbar で通知する
    // ---------------------------------------------

    let returnObj = {};

    if (loginUsers_id && !targetUsers_id) {
      // ---------------------------------------------
      //   Snackbar
      // ---------------------------------------------

      const increaseExp = exp - currentExp;

      const currentlevel = calculateLevel({ exp: currentExp });
      const level = calculateLevel({ exp });

      const increaseLevel = level - currentlevel > 0 ? level : 0;

      const increaseAcquiredTitles_idsArr = acquiredTitles_idsArr.filter(
        (titles_id) => {
          return currentAcquiredTitles_idsArr.includes(titles_id) === false;
        }
      );

      // ----------------------------------------
      //   - DB titles
      // ----------------------------------------

      const language = lodashGet(localeObj, ["language"], "");

      const docTitlesArr = await ModelTitles.find({
        conditionObj: {
          _id: { $in: increaseAcquiredTitles_idsArr },
          language,
        },
      });

      const increaseTitlesArr = [];

      for (let valueObj of docTitlesArr.values()) {
        increaseTitlesArr.push(valueObj.name);
      }

      // ---------------------------------------------
      //   returnObj
      // ---------------------------------------------

      if (increaseExp || increaseLevel || increaseTitlesArr.length > 0) {
        returnObj = {
          exp: increaseExp,
          level: increaseLevel,
          titlesArr: increaseTitlesArr,
        };
      }
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/experience.js - experienceCalculate
    // `);

    // console.log(chalk`
    //   recalculationAll: {green ${recalculationAll}}
    // `);

    // console.log(`
    //   ----- arr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(conditionObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- saveObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(saveObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   currentExp: {green ${currentExp}}
    //   exp: {green ${exp}}
    //   increaseExp: {green ${increaseExp}}
    // `);

    // console.log(`
    //   ----- increaseAcquiredTitles_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(increaseAcquiredTitles_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docTitlesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docTitlesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return
    // ---------------------------------------------

    return returnObj;
  } catch (errorObj) {
    throw errorObj;
  }
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  experienceCalculate,
};

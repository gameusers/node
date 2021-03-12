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
//   Model
// ---------------------------------------------

const SchemaWebPushes = require("./schema.js");

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

    return await SchemaWebPushes.findOne(conditionObj).exec();
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

    return await SchemaWebPushes.find(conditionObj).exec();
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

    return await SchemaWebPushes.countDocuments(conditionObj).exec();
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

    return await SchemaWebPushes.findOneAndUpdate(conditionObj, saveObj, {
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

    return await SchemaWebPushes.updateMany(conditionObj, saveObj).exec();
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

    return await SchemaWebPushes.insertMany(saveArr);
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

    return await SchemaWebPushes.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//
// --------------------------------------------------

/**
 * Web Pushを送信後、成功した行は errorCount を 0 に戻し、失敗した行は errorCount を +1 する
 * 2020/5/21
 * @param {Array} successesArr - DB web-pushes _id / 通知に成功したIDの入った配列
 * @param {Array} errorsArr - DB users _id / 通知に失敗したIDの入った配列
 * @return {Object} 取得データ
 */
const successAndFailure = async ({ successesArr = [], failuresArr = [] }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // ---------------------------------------------
    //   Datetime
    // ---------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // ---------------------------------------------
    //   Success
    // ---------------------------------------------

    if (successesArr.length > 0) {
      const resultSuccessObj = await updateMany({
        conditionObj: {
          _id: { $in: successesArr },
        },

        saveObj: {
          $set: {
            sendDate: ISO8601,
            errorCount: 0,
          },
          $inc: { sendTotalCount: 1, sendTodayCount: 1 },
        },
      });

      // const resultSuccessObj = await upsert({

      //   conditionObj: {
      //     _id: { $in: successesArr }
      //   },

      //   saveObj: {
      //     sendDate: ISO8601,
      //     errorCount: 0,
      //   },

      // });

      // console.log(`
      //   ----- resultSuccessObj -----\n
      //   ${util.inspect(resultSuccessObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // ---------------------------------------------
    //   Failure
    // ---------------------------------------------

    if (failuresArr.length > 0) {
      const resultFailureObj = await updateMany({
        conditionObj: {
          _id: { $in: failuresArr },
        },

        saveObj: {
          $set: {
            sendDate: ISO8601,
          },
          $inc: { errorCount: 1 },
        },
      });

      // console.log(`
      //   ----- resultFailureObj -----\n
      //   ${util.inspect(resultFailureObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/web-pushes/model.js - successAndFailure
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    // `);

    // console.log(`
    //   ----- successesArr -----\n
    //   ${util.inspect(successesArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- failuresArr -----\n
    //   ${util.inspect(failuresArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    // return returnObj;
  } catch (err) {
    throw err;
  }
};

/**
 * 毎日一度 sendTodayCount（その日に送信したプッシュ通知の数） を 0 にする
 * それにより次の日また決まった数送信できるようになる
 * 2020/5/22
 */
const resetSendTodayCount = async ({}) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // ---------------------------------------------
    //   Datetime
    // ---------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // ---------------------------------------------
    //   Success
    // ---------------------------------------------

    const resultObj = await updateMany({
      conditionObj: {
        sendDate: { $ne: null },
      },

      saveObj: {
        $set: {
          sendTodayCount: 0,
        },
      },
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/web-pushes/model.js - resetSendTodayCount
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

  successAndFailure,
  resetSendTodayCount,
};

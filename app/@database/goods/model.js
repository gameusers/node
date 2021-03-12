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
//   Model
// ---------------------------------------------

const Schema = require("./schema");
const SchemaForumComments = require("../forum-comments/schema");
const SchemaRecruitmentComments = require("../recruitment-comments/schema");
const SchemaRecruitmentReplies = require("../recruitment-replies/schema");
const SchemaUsers = require("../users/schema");

// ---------------------------------------------
//   Format
// ---------------------------------------------

// const { formatImagesAndVideosObj } = require('../images-and-videos/format');
// const { formatFollowsObj } = require('../follows/format');

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

    return await Schema.findOne(conditionObj).exec();
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

    return await Schema.find(conditionObj).exec();
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

    return await Schema.countDocuments(conditionObj).exec();
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

    return await Schema.findOneAndUpdate(conditionObj, saveObj, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();
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

    return await Schema.insertMany(saveArr);
  } catch (err) {
    throw err;
  }
};

/**
 * データを削除する / 1件だけ
 * @param {Object} conditionObj - 検索条件
 * @return {Object} 取得データ
 */
const deleteOne = async ({ conditionObj }) => {
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

    return await Schema.deleteOne(conditionObj).exec();
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

    return await Schema.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

/**
 * Transaction 挿入 / 更新する
 * スレッド、画像＆動画、ユーザーコミュニティを同時に更新する
 *
 * @param {Object} goodsConditionObj - DB goods 検索条件
 * @param {Object} goodsSaveObj - DB goods 保存データ
 * @param {Object} forumCommentsConditionObj - DB forum-comments 検索条件
 * @param {Object} forumCommentsSaveObj - DB forum-comments 保存データ
 * @param {Object} recruitmentCommentsConditionObj - DB recruitment-comments 検索条件
 * @param {Object} recruitmentCommentsSaveObj - DB recruitment-comments 保存データ
 * @param {Object} recruitmentRepliesConditionObj - DB recruitment-replies 検索条件
 * @param {Object} recruitmentRepliesSaveObj - DB recruitment-replies 保存データ
 * @param {Object} usersConditionObj - DB users 検索条件
 * @param {Object} usersSaveObj - DB users 保存データ
 * @return {Object}
 */
const transaction = async ({
  goodsConditionObj,
  goodsSaveObj,
  forumCommentsConditionObj = {},
  forumCommentsSaveObj = {},
  recruitmentCommentsConditionObj = {},
  recruitmentCommentsSaveObj = {},
  recruitmentRepliesConditionObj = {},
  recruitmentRepliesSaveObj = {},
  usersConditionObj = {},
  usersSaveObj = {},
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await Schema.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // ---------------------------------------------
    //   - goods
    // ---------------------------------------------

    // 追加
    if (
      Object.keys(goodsConditionObj).length !== 0 &&
      Object.keys(goodsSaveObj).length !== 0
    ) {
      await Schema.updateOne(goodsConditionObj, goodsSaveObj, {
        session,
        upsert: true,
      });

      // 削除
    } else if (Object.keys(goodsConditionObj).length !== 0) {
      await Schema.deleteOne(goodsConditionObj, { session });
    }

    // ---------------------------------------------
    //   - forum-comments
    // ---------------------------------------------

    if (
      Object.keys(forumCommentsConditionObj).length !== 0 &&
      Object.keys(forumCommentsSaveObj).length !== 0
    ) {
      await SchemaForumComments.updateOne(
        forumCommentsConditionObj,
        forumCommentsSaveObj,
        { session }
      );
    }

    // ---------------------------------------------
    //   - recruitment-comments
    // ---------------------------------------------

    if (
      Object.keys(recruitmentCommentsConditionObj).length !== 0 &&
      Object.keys(recruitmentCommentsSaveObj).length !== 0
    ) {
      await SchemaRecruitmentComments.updateOne(
        recruitmentCommentsConditionObj,
        recruitmentCommentsSaveObj,
        { session }
      );
    }

    // ---------------------------------------------
    //   - recruitment-replies
    // ---------------------------------------------

    if (
      Object.keys(recruitmentRepliesConditionObj).length !== 0 &&
      Object.keys(recruitmentRepliesSaveObj).length !== 0
    ) {
      await SchemaRecruitmentReplies.updateOne(
        recruitmentRepliesConditionObj,
        recruitmentRepliesSaveObj,
        { session }
      );
    }

    // ---------------------------------------------
    //   - users
    // ---------------------------------------------

    if (
      Object.keys(usersConditionObj).length !== 0 &&
      Object.keys(usersSaveObj).length !== 0
    ) {
      await SchemaUsers.updateOne(usersConditionObj, usersSaveObj, { session });
    }

    // --------------------------------------------------
    //   Transaction / Commit
    // --------------------------------------------------

    await session.commitTransaction();
    // console.log('--------コミット-----------');

    session.endSession();

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/goods/model.js - transactionForUpsert
    // `);

    // console.log(`
    //   ----- goodsConditionObj -----\n
    //   ${util.inspect(goodsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- goodsSaveObj -----\n
    //   ${util.inspect(goodsSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsConditionObj -----\n
    //   ${util.inspect(forumCommentsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsSaveObj -----\n
    //   ${util.inspect(forumCommentsSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentCommentsConditionObj -----\n
    //   ${util.inspect(recruitmentCommentsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentCommentsSaveObj -----\n
    //   ${util.inspect(recruitmentCommentsSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentRepliesConditionObj -----\n
    //   ${util.inspect(recruitmentRepliesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentRepliesSaveObj -----\n
    //   ${util.inspect(recruitmentRepliesSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- usersConditionObj -----\n
    //   ${util.inspect(usersConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- usersSaveObj -----\n
    //   ${util.inspect(usersSaveObj, { colors: true, depth: null })}\n
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

    return returnObj;
  } catch (errorObj) {
    // console.log(`
    //   ----- errorObj -----\n
    //   ${util.inspect(errorObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Transaction / Rollback
    // --------------------------------------------------

    await session.abortTransaction();
    // console.log('--------ロールバック-----------');

    session.endSession();

    throw errorObj;
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
  insertMany,
  deleteOne,
  deleteMany,

  transaction,
};

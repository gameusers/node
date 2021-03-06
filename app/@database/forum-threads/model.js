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

const SchemaForumThreads = require("./schema.js");
const SchemaForumComments = require("../forum-comments/schema.js");
const SchemaImagesAndVideos = require("../images-and-videos/schema.js");
const SchemaGameCommunities = require("../game-communities/schema.js");
const SchemaUserCommunities = require("../user-communities/schema.js");

const ModelForumComments = require("../forum-comments/model.js");
const ModelGameCommunities = require("../game-communities/model.js");
const ModelUserCommunities = require("../user-communities/model.js");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../@modules/error/custom.js");
const { verifyAuthority } = require("../../@modules/authority.js");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const { formatImagesAndVideosObj } = require("../images-and-videos/format.js");

// ---------------------------------------------
//   Moment Locale
// ---------------------------------------------

moment.locale("ja");

// --------------------------------------------------
//   Common
// --------------------------------------------------

/**
 * ???????????????????????????????????? / 1?????????
 * @param {Object} conditionObj - ????????????
 * @return {Object} ???????????????
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

    return await SchemaForumThreads.findOne(conditionObj).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * ????????????
 * @param {Object} conditionObj - ????????????
 * @return {Array} ???????????????
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

    return await SchemaForumThreads.find(conditionObj).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * ???????????????????????????
 * @param {Object} conditionObj - ????????????
 * @return {number} ???????????????
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

    return await SchemaForumThreads.countDocuments(conditionObj).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * ?????? / ????????????
 * @param {Object} conditionObj - ????????????
 * @param {Object} saveObj - ?????????????????????
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

    return await SchemaForumThreads.findOneAndUpdate(conditionObj, saveObj, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();
  } catch (err) {
    throw err;
  }
};

/**
 * ?????????????????????
 * @param {Array} saveArr - ?????????????????????
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

    return await SchemaForumThreads.insertMany(saveArr);
  } catch (err) {
    throw err;
  }
};

/**
 * ????????????
 * @param {Object} conditionObj - ????????????
 * @param {boolean} reset - true????????????????????????????????????
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

    return await SchemaForumThreads.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Function
// --------------------------------------------------

// --------------------------------------------------
//   ??????????????????
// --------------------------------------------------

/**
 * ?????????????????????????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ??????????????????????????????ID
 * @param {string} userCommunities_id - DB user-communities _id / ?????????????????????????????????ID
 * @param {number} page - ?????????
 * @param {number} limit - 1??????????????????????????????
 * @return {Array} ???????????????
 */
const findForThreadsList = async ({
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  userCommunities_id,
  page = 1,
  limit = process.env.NEXT_PUBLIC_FORUM_THREAD_LIST_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Condition
    // --------------------------------------------------

    const conditionObj = {};
    let count = 0;

    // --------------------------------------------------
    //   Game Community
    // --------------------------------------------------

    if (gameCommunities_id) {
      // --------------------------------------------------
      //   Condition Object
      // --------------------------------------------------

      conditionObj.gameCommunities_id = gameCommunities_id;

      // --------------------------------------------------
      //   Count
      // --------------------------------------------------

      const gameCommunityArr = await ModelGameCommunities.find({
        conditionObj: {
          _id: gameCommunities_id,
        },
      });

      count = lodashGet(gameCommunityArr, [0, "forumObj", "threadCount"], 0);

      // --------------------------------------------------
      //   User Community
      // --------------------------------------------------
    } else if (userCommunities_id) {
      // --------------------------------------------------
      //   Condition Object
      // --------------------------------------------------

      conditionObj.userCommunities_id = userCommunities_id;

      // --------------------------------------------------
      //   Count
      // --------------------------------------------------

      const userCommunityArr = await ModelUserCommunities.find({
        conditionObj: {
          _id: userCommunities_id,
        },
      });

      count = lodashGet(userCommunityArr, [0, "forumObj", "threadCount"], 0);
    } else {
      return;
    }

    // --------------------------------------------------
    //   Find
    // --------------------------------------------------

    const intLimit = parseInt(limit, 10);

    const resultArr = await SchemaForumThreads.find(conditionObj)
      .sort({ updatedDate: -1 })
      .skip((page - 1) * limit)
      .limit(intLimit)
      .exec();

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const dataObj = {};
    const arr = [];

    for (let valueObj of resultArr.values()) {
      // --------------------------------------------------
      //   Deep Copy
      // --------------------------------------------------

      let clonedObj = lodashCloneDeep(valueObj.toJSON());

      // --------------------------------------------------
      //   Datetime
      // --------------------------------------------------

      clonedObj.updatedDate = moment(valueObj.updatedDate)
        .utc()
        .format("YYYY/MM/DD HH:mm");

      // --------------------------------------------------
      //   Locale
      // --------------------------------------------------

      const filteredArr = valueObj.localesArr.filter((filterObj) => {
        return filterObj.language === localeObj.language;
      });

      if (lodashHas(filteredArr, [0])) {
        clonedObj.name = lodashGet(filteredArr, [0, "name"], "");
      } else {
        clonedObj.name = lodashGet(valueObj, ["localesArr", 0, "name"], "");
      }

      // --------------------------------------------------
      //   ??????????????????????????????
      // --------------------------------------------------

      delete clonedObj.createdDate;
      delete clonedObj.users_id;
      delete clonedObj.localesArr;
      delete clonedObj.imagesAndVideos_id;
      delete clonedObj.acceptLanguage;
      delete clonedObj.ip;
      delete clonedObj.userAgent;
      delete clonedObj.__v;

      // --------------------------------------------------
      //   push
      // --------------------------------------------------

      dataObj[valueObj._id] = clonedObj;
      arr.push(valueObj._id);
    }

    // --------------------------------------------------
    //   Return Object
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    const returnObj = {
      page,
      limit: intLimit,
      count,
    };

    lodashSet(returnObj, ["dataObj"], dataObj);

    lodashSet(returnObj, [`page${page}Obj`, "loadedDate"], ISO8601);
    lodashSet(returnObj, [`page${page}Obj`, "arr"], arr);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/forum-threads/model.js - findForThreadsList
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   page: {green ${page}}
    //   limit: {green ${limit}}
    // `);

    // console.log(`
    //   ----- resultArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(resultArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return returnObj;
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   ????????????
// --------------------------------------------------

/**
 * ?????????????????????????????? / ??????
 * @param {string} commonType - ????????? / matchConditionArr & sortSkipLimitArr ???????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {Array} matchConditionArr - ????????????
 * @param {Array} sortSkipLimitArr - ???????????????????????????????????????
 * @param {number} threadCount - ?????????????????????
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Object} ???????????????
 */
const findForumCommon = async ({
  commonType = "default",
  req,
  localeObj,
  loginUsers_id,
  matchConditionArr = [],
  sortSkipLimitArr = [],
  threadCount,
  threadPage = 1,
  threadLimit = process.env.NEXT_PUBLIC_FORUM_THREAD_LIMIT,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   parseInt
    // --------------------------------------------------

    const intThreadPage = parseInt(threadPage, 10);
    const intCommentPage = parseInt(commentPage, 10);
    const intReplyPage = parseInt(replyPage, 10);

    const intThreadLimit = parseInt(threadLimit, 10);
    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);

    const intTreadCount = parseInt(threadCount, 10);

    // --------------------------------------------------
    //   matchConditionArr & sortSkipLimitArr
    // --------------------------------------------------

    let mcArr = matchConditionArr;
    let sslArr = sortSkipLimitArr;

    if (commonType === "default") {
      sslArr = [
        { $sort: { updatedDate: -1 } },
        { $skip: (intThreadPage - 1) * intThreadLimit },
        { $limit: intThreadLimit },
      ];
    }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaForumThreads.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      ...mcArr,

      // --------------------------------------------------
      //   $sort / $skip / $limit
      // --------------------------------------------------

      ...sslArr,

      // { $sort: { updatedDate: -1 } },
      // { $skip: (intThreadPage - 1) * intThreadLimit },
      // { $limit: intThreadLimit },

      // --------------------------------------------------
      //   images-and-videos
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: { letImagesAndVideos_id: "$imagesAndVideos_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$letImagesAndVideos_id"],
                },
              },
            },
            {
              $project: {
                createdDate: 0,
                updatedDate: 0,
                users_id: 0,
                __v: 0,
              },
            },
          ],
          as: "imagesAndVideosObj",
        },
      },

      {
        $unwind: {
          path: "$imagesAndVideosObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          imagesAndVideos_id: 0,
          acceptLanguage: 0,
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const formattedThreadsObj = formatVer2({
      req,
      localeObj,
      loginUsers_id,
      arr: docArr,
      threadPage: intThreadPage,
      threadLimit: intThreadLimit,
      threadCount: intTreadCount,
    });

    const forumThreadsObj = lodashGet(
      formattedThreadsObj,
      ["forumThreadsObj"],
      {}
    );
    const forumThreads_idsForCommentArr = lodashGet(
      formattedThreadsObj,
      ["forumThreads_idsForCommentArr"],
      []
    );

    // --------------------------------------------------
    //   DB find / Forum Comments & Replies
    // --------------------------------------------------

    const forumCommentsAndRepliesObj = await ModelForumComments.findCommentsAndRepliesByForumThreads_idsArr(
      {
        req,
        localeObj,
        loginUsers_id,
        forumThreads_idsArr: forumThreads_idsForCommentArr,
        forumThreadsObj,
        commentPage: intCommentPage,
        commentLimit: intCommentLimit,
        replyPage: intReplyPage,
        replyLimit: intReplyLimit,
      }
    );

    const forumCommentsObj = lodashGet(
      forumCommentsAndRepliesObj,
      ["forumCommentsObj"],
      {}
    );
    const forumRepliesObj = lodashGet(
      forumCommentsAndRepliesObj,
      ["forumRepliesObj"],
      {}
    );

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   page: {green ${page}}
    //   limit: {green ${limit}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(docArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumThreadsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumThreadsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumCommentsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumRepliesObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumRepliesObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return {
      forumThreadsObj,
      forumCommentsObj,
      forumRepliesObj,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * ???????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ???????????????????????????ID
 * @param {string} userCommunities_id - DB user-communities _id / ??????????????????????????????ID
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Object} ???????????????
 */
const findForForum = async ({
  req,
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  userCommunities_id,
  forumThreads_idsArr = [],
  threadPage = 1,
  threadLimit = process.env.NEXT_PUBLIC_FORUM_THREAD_LIMIT,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Parse
    // --------------------------------------------------

    // const intThreadLimit = parseInt(threadLimit, 10);
    // const intCommentLimit = parseInt(commentLimit, 10);
    // const intReplyLimit = parseInt(replyLimit, 10);

    // --------------------------------------------------
    //   threadCount & Match Condition Array
    // --------------------------------------------------

    let threadCount = 0;
    let matchConditionArr = [];

    // ---------------------------------------------
    //   - Game Community
    // ---------------------------------------------

    if (gameCommunities_id) {
      // -----------------------------------
      //   - matchConditionArr
      // -----------------------------------

      matchConditionArr = [
        {
          $match: { gameCommunities_id },
        },
      ];

      // ???????????????????????????????????????????????????????????????????????????????????????forumThreads_idsArr ???????????????
      if (forumThreads_idsArr.length > 0) {
        matchConditionArr = [
          {
            $match: {
              $and: [
                { _id: { $in: forumThreads_idsArr } },
                { gameCommunities_id },
              ],
            },
          },
        ];
      }

      // -----------------------------------
      //   - threadCount
      // -----------------------------------

      const gameCommunityArr = await ModelGameCommunities.find({
        conditionObj: {
          _id: gameCommunities_id,
        },
      });

      threadCount = lodashGet(
        gameCommunityArr,
        [0, "forumObj", "threadCount"],
        0
      );

      // ---------------------------------------------
      //   - User Community
      // ---------------------------------------------
    } else if (userCommunities_id) {
      // -----------------------------------
      //   - matchConditionArr
      // -----------------------------------

      matchConditionArr = [
        {
          $match: { userCommunities_id },
        },
      ];

      // ???????????????????????????????????????????????????????????????????????????????????????forumThreads_idsArr ???????????????
      if (forumThreads_idsArr.length > 0) {
        matchConditionArr = [
          {
            $match: {
              $and: [
                { _id: { $in: forumThreads_idsArr } },
                { userCommunities_id },
              ],
            },
          },
        ];
      }

      // -----------------------------------
      //   - threadCount
      // -----------------------------------

      const userCommunityArr = await ModelUserCommunities.find({
        conditionObj: {
          _id: userCommunities_id,
        },
      });

      threadCount = lodashGet(
        userCommunityArr,
        [0, "forumObj", "threadCount"],
        0
      );
    }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const returnObj = await findForumCommon({
      req,
      localeObj,
      loginUsers_id,
      matchConditionArr,
      threadCount,
      threadPage,
      threadLimit,
      commentPage,
      commentLimit,
      replyPage,
      replyLimit,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   app/@database/forum-threads/model.js - findForForum
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   page: {green ${page}}
    //   limit: {green ${limit}}
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- formattedThreadsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(formattedThreadsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsAndRepliesObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumCommentsAndRepliesObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumThreadsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumThreadsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumCommentsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumRepliesObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumRepliesObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return returnObj;
  } catch (err) {
    throw err;
  }
};

/**
 * ??????????????????????????????????????? - ?????????????????????????????? / ??????????????????????????????????????? forumID ????????? ???2020/6/22???
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ???????????????????????????ID
 * @param {string} userCommunities_id - DB user-communities _id / ??????????????????????????????ID
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Array} ???????????????
 */
const findForumByforumID = async ({
  req,
  localeObj,
  loginUsers_id,
  forumID,
  gameCommunities_id = "",
  userCommunities_id = "",
  threadPage = 1,
  threadLimit = process.env.NEXT_PUBLIC_FORUM_THREAD_LIMIT,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Parse
    // --------------------------------------------------

    const intThreadLimit = parseInt(threadLimit, 10);
    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);

    // --------------------------------------------------
    //   DB find / ????????????????????????????????????????????????ID???????????????
    // --------------------------------------------------

    const forumCommentsAndRepliesObj = await ModelForumComments.findOne({
      conditionObj: {
        _id: forumID,
        gameCommunities_id,
        userCommunities_id,
      },
    });

    const forumThreads_id = lodashGet(
      forumCommentsAndRepliesObj,
      ["forumThreads_id"],
      forumID
    );

    let forumComments_id = "";
    let forumReplies_id = "";

    if (forumCommentsAndRepliesObj) {
      if (forumCommentsAndRepliesObj.forumComments_id === "") {
        forumComments_id = forumCommentsAndRepliesObj._id;
        forumReplies_id = "";
      } else {
        forumComments_id = forumCommentsAndRepliesObj.forumComments_id;
        forumReplies_id = forumCommentsAndRepliesObj._id;
      }
    }

    // ------------------------------------------------------------
    //   ?????????????????????????????????????????????????????????????????????
    // ------------------------------------------------------------

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [];

    if (gameCommunities_id) {
      matchConditionArr = [
        {
          $match: { _id: forumThreads_id, gameCommunities_id },
        },
      ];
    } else {
      matchConditionArr = [
        {
          $match: { _id: forumThreads_id, userCommunities_id },
        },
      ];
    }

    // --------------------------------------------------
    //   Aggregation / ???????????????????????????
    // --------------------------------------------------

    const docArr = await SchemaForumThreads.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      ...matchConditionArr,

      // --------------------------------------------------
      //   images-and-videos
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: { letImagesAndVideos_id: "$imagesAndVideos_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$letImagesAndVideos_id"],
                },
              },
            },
            {
              $project: {
                createdDate: 0,
                updatedDate: 0,
                users_id: 0,
                __v: 0,
              },
            },
          ],
          as: "imagesAndVideosObj",
        },
      },

      {
        $unwind: {
          path: "$imagesAndVideosObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          imagesAndVideos_id: 0,
          acceptLanguage: 0,
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   ????????????????????????????????? - ?????????????????????????????????????????????
    // --------------------------------------------------

    let communityArr = [];

    // ---------------------------------------------
    //   - ???????????????????????????
    // ---------------------------------------------

    if (gameCommunities_id) {
      communityArr = await ModelGameCommunities.find({
        conditionObj: {
          _id: gameCommunities_id,
        },
      });

      // ---------------------------------------------
      //   - ??????????????????????????????
      // ---------------------------------------------
    } else {
      communityArr = await ModelUserCommunities.find({
        conditionObj: {
          _id: userCommunities_id,
        },
      });
    }

    const threadCount = lodashGet(
      communityArr,
      [0, "forumObj", "threadCount"],
      0
    );

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const formattedThreadsObj = formatVer2({
      req,
      localeObj,
      loginUsers_id,
      arr: docArr,
      threadPage,
      threadLimit: intThreadLimit,
      threadCount,
    });

    const forumThreadsObj = lodashGet(
      formattedThreadsObj,
      ["forumThreadsObj"],
      {}
    );
    const forumThreads_idsForCommentArr = lodashGet(
      formattedThreadsObj,
      ["forumThreads_idsForCommentArr"],
      []
    );

    // ------------------------------------------------------------
    //   ????????????????????????????????????
    // ------------------------------------------------------------

    let forumCommentsObj = {};
    let forumRepliesObj = {};

    // --------------------------------------------------
    //   ForumID ????????????????????????
    // --------------------------------------------------

    if (forumComments_id === "" && forumReplies_id === "") {
      // --------------------------------------------------
      //   DB find / Forum Comments & Replies
      // --------------------------------------------------

      const forumCommentsAndRepliesObj = await ModelForumComments.findCommentsAndRepliesByForumThreads_idsArr(
        {
          req,
          localeObj,
          loginUsers_id,
          forumThreads_idsArr: forumThreads_idsForCommentArr,
          forumThreadsObj,
          commentPage,
          commentLimit: intCommentLimit,
          replyPage,
          replyLimit: intReplyLimit,
        }
      );

      forumCommentsObj = lodashGet(
        forumCommentsAndRepliesObj,
        ["forumCommentsObj"],
        {}
      );
      forumRepliesObj = lodashGet(
        forumCommentsAndRepliesObj,
        ["forumRepliesObj"],
        {}
      );

      // --------------------------------------------------
      //   ForumID ????????????????????????
      // --------------------------------------------------
    } else if (forumComments_id && forumReplies_id === "") {
      // --------------------------------------------------
      //   DB find / Forum Comments & Replies
      // --------------------------------------------------

      const pageObj = await ModelForumComments.getPage({
        req,
        localeObj,
        loginUsers_id,
        forumThreads_id,
        forumComments_id,
        forumReplies_id,
        commentLimit: intCommentLimit,
        replyLimit: intReplyLimit,
      });

      const newCommentPage = lodashGet(pageObj, ["commentPage"], 1);

      // --------------------------------------------------
      //   DB find / Forum Comments & Replies
      // --------------------------------------------------

      const forumCommentsAndRepliesObj = await ModelForumComments.findCommentsAndRepliesByForumThreads_idsArr(
        {
          req,
          localeObj,
          loginUsers_id,
          forumThreads_idsArr: forumThreads_idsForCommentArr,
          forumThreadsObj,
          commentPage: newCommentPage,
          commentLimit: intCommentLimit,
          replyPage,
          replyLimit: intReplyLimit,
        }
      );

      forumCommentsObj = lodashGet(
        forumCommentsAndRepliesObj,
        ["forumCommentsObj"],
        {}
      );
      forumRepliesObj = lodashGet(
        forumCommentsAndRepliesObj,
        ["forumRepliesObj"],
        {}
      );

      // --------------------------------------------------
      //   ForumID ??????????????????
      // --------------------------------------------------
    } else if (forumComments_id && forumReplies_id) {
      // --------------------------------------------------
      //   DB find / Forum Comments & Replies
      // --------------------------------------------------

      const pageObj = await ModelForumComments.getPage({
        req,
        localeObj,
        loginUsers_id,
        forumThreads_id,
        forumComments_id,
        forumReplies_id,
        commentLimit: intCommentLimit,
        replyLimit: intReplyLimit,
      });

      // const newCommentPage = 1;
      const newCommentPage = lodashGet(pageObj, ["commentPage"], 1);
      const newReplyPage = lodashGet(pageObj, ["replyPage"], 1);

      // --------------------------------------------------
      //   DB find / Forum Comments & Replies
      // --------------------------------------------------

      const forumCommentsAndRepliesObj = await ModelForumComments.findCommentsAndRepliesByForumThreads_idsArr(
        {
          req,
          localeObj,
          loginUsers_id,
          forumThreads_idsArr: forumThreads_idsForCommentArr,
          forumThreadsObj,
          commentPage: newCommentPage,
          commentLimit: intCommentLimit,
          replyPage: newReplyPage,
          replyLimit: intReplyLimit,
        }
      );

      forumCommentsObj = lodashGet(
        forumCommentsAndRepliesObj,
        ["forumCommentsObj"],
        {}
      );
      forumRepliesObj = lodashGet(
        forumCommentsAndRepliesObj,
        ["forumRepliesObj"],
        {}
      );

      // console.log(`
      //   ----- pageObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(pageObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/forum-threads/model.js - findForumByforumID
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   forumID: {green ${forumID}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    // `);

    // console.log(`
    //   ----- forumCommentsAndRepliesObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumCommentsAndRepliesObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   forumThreads_id: {green ${forumThreads_id}}
    //   forumComments_id: {green ${forumComments_id}}
    //   forumReplies_id: {green ${forumReplies_id}}
    // `);

    // console.log(`
    //   ----- matchConditionArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(matchConditionArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- communityArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(communityArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- formattedThreadsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(formattedThreadsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumThreadsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumThreadsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumCommentsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumRepliesObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumRepliesObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return {
      forumThreadsObj,
      forumCommentsObj,
      forumRepliesObj,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * DB???????????????????????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {Array} arr - ??????
 * @param {number} threadPage - ????????????????????????No
 * @param {number} threadLimit - ???????????????1??????????????????????????????
 * @param {number} threadCount - ?????????????????????
 * @return {Array} ?????????????????????????????????
 */
const formatVer2 = ({
  req,
  localeObj,
  loginUsers_id,
  arr,
  threadPage,
  threadLimit,
  threadCount,
}) => {
  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  const forumThreadsObj = {
    page: threadPage,
    limit: threadLimit,
    count: threadCount,
    dataObj: {},
  };

  const ISO8601 = moment().utc().toISOString();

  const dataObj = {};
  const forumThreads_idsForCommentArr = [];

  // --------------------------------------------------
  //   Loop
  // --------------------------------------------------

  for (let valueObj of arr.values()) {
    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(valueObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Deep Copy
    // --------------------------------------------------

    const clonedObj = lodashCloneDeep(valueObj);

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    clonedObj.updatedDate = moment(valueObj.updatedDate)
      .utc()
      .format("YYYY/MM/DD hh:mm");

    // --------------------------------------------------
    //   ????????????????????????
    // --------------------------------------------------

    const formattedObj = formatImagesAndVideosObj({
      localeObj,
      obj: valueObj.imagesAndVideosObj,
    });

    if (Object.keys(formattedObj).length !== 0) {
      clonedObj.imagesAndVideosObj = formattedObj;
    } else {
      delete clonedObj.imagesAndVideosObj;
    }

    // --------------------------------------------------
    //   ????????????
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
      clonedObj.name = lodashGet(filteredArr, [0, "name"], "");
      clonedObj.comment = lodashGet(filteredArr, [0, "comment"], "");
    } else {
      clonedObj.name = lodashGet(valueObj, ["localesArr", 0, "name"], "");
      clonedObj.comment = lodashGet(valueObj, ["localesArr", 0, "comment"], "");
    }

    // --------------------------------------------------
    //   ??????????????????????????????
    // --------------------------------------------------

    delete clonedObj._id;
    delete clonedObj.createdDate;
    delete clonedObj.users_id;
    delete clonedObj.localesArr;
    delete clonedObj.ip;
    delete clonedObj.userAgent;
    delete clonedObj.__v;

    // --------------------------------------------------
    //   push
    // --------------------------------------------------

    dataObj[valueObj._id] = clonedObj;

    if (valueObj.comments > 0) {
      forumThreads_idsForCommentArr.push(valueObj._id);
    }

    // --------------------------------------------------
    //
    // --------------------------------------------------

    const forumThreadsPageArr = lodashGet(
      forumThreadsObj,
      [`page${threadPage}Obj`, "arr"],
      []
    );
    forumThreadsPageArr.push(valueObj._id);

    forumThreadsObj[`page${threadPage}Obj`] = {
      loadedDate: ISO8601,
      arr: forumThreadsPageArr,
    };
  }

  forumThreadsObj.dataObj = dataObj;

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    forumThreadsObj,
    forumThreads_idsForCommentArr,
  };
};

/**
 * ?????????????????????????????????????????????????????????????????? _id ???????????????
 * @param {Object} req - ???????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} forumThreads_id - DB forum-threads _id / ???????????????ID
 * @return {Array} ???????????????
 */
const findForDeleteThread = async ({ req, loginUsers_id, forumThreads_id }) => {
  try {
    // --------------------------------------------------
    //   Thread
    // --------------------------------------------------

    const forumThreadsArr = await SchemaForumThreads.aggregate([
      // --------------------------------------------------
      //   $match
      // --------------------------------------------------

      {
        $match: { _id: forumThreads_id },
      },

      // --------------------------------------------------
      //   user-communities
      // --------------------------------------------------

      {
        $lookup: {
          from: "user-communities",
          let: { letUserCommunities_id: "$userCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$letUserCommunities_id"] }],
                },
              },
            },

            {
              $project: {
                _id: 0,
                users_id: 1,
              },
            },
          ],
          as: "userCommunitiesObj",
        },
      },

      {
        $unwind: {
          path: "$userCommunitiesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          createdDate: 1,
          users_id: 1,
          imagesAndVideos_id: 1,
          userCommunitiesObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   Comments & Replies
    // --------------------------------------------------

    const forumCommentsArr = await SchemaForumComments.aggregate([
      {
        $match: { forumThreads_id },
      },

      {
        $project: {
          createdDate: 1,
          users_id: 1,
          imagesAndVideos_id: 1,
        },
      },
    ]).exec();

    //   console.log(`
    //   ----- forumThreadsArr -----\n
    //   ${util.inspect(forumThreadsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   ????????????????????????????????????
    // --------------------------------------------------

    if (forumThreadsArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "Wwc1vpiQ-", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   ?????????????????????
    // --------------------------------------------------

    let deletable = false;

    // ---------------------------------------------
    //   - ?????????????????????????????????????????????????????????????????????
    // ---------------------------------------------

    const userCommunitiesUsers_id = lodashGet(
      forumThreadsArr,
      [0, "userCommunitiesObj", "users_id"],
      ""
    );

    if (
      userCommunitiesUsers_id &&
      loginUsers_id &&
      userCommunitiesUsers_id === loginUsers_id
    ) {
      deletable = true;
    }

    // ---------------------------------------------
    //   - ????????????????????????????????????????????????
    // ---------------------------------------------

    const editable = verifyAuthority({
      req,
      users_id: lodashGet(forumThreadsArr, [0, "users_id"], ""),
      loginUsers_id,
      ISO8601: lodashGet(forumThreadsArr, [0, "createdDate"], ""),
      _id: lodashGet(forumThreadsArr, [0, "_id"], ""),
    });

    if (editable) {
      deletable = true;
    }

    // console.log(chalk`
    // deletable: {green ${deletable} typeof ${typeof deletable}}
    // editable: {green ${editable} typeof ${typeof editable}}
    // `);

    // ---------------------------------------------
    //   ????????????????????????????????????
    // ---------------------------------------------

    if (!deletable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "M2XmqnE4r", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const imagesAndVideos_id = lodashGet(
      forumThreadsArr,
      [0, "imagesAndVideos_id"],
      ""
    );

    let imagesAndVideos_idsArr = [];

    if (imagesAndVideos_id) {
      imagesAndVideos_idsArr = [imagesAndVideos_id];
    }

    for (let valueObj of forumCommentsArr.values()) {
      if (valueObj.imagesAndVideos_id) {
        imagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }
    }

    const returnObj = {
      imagesAndVideos_idsArr,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   forumThreads_id: {green ${forumThreads_id}}
    // `);

    // console.log(`
    //   ----- imagesAndVideos_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideos_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumThreadsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumThreadsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumCommentsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return returnObj;
  } catch (err) {
    throw err;
  }
};

/**
 * ??????????????????????????? / ????????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} forumThreads_id - DB forum-threads _id / ????????????ID
 * @return {Array} ???????????????
 */
const findForEdit = async ({
  req,
  localeObj,
  loginUsers_id,
  forumThreads_id,
}) => {
  try {
    // --------------------------------------------------
    //   Find
    // --------------------------------------------------

    const resultArr = await SchemaForumThreads.aggregate([
      // ?????????????????????
      {
        $match: { _id: forumThreads_id },
      },

      // ????????????????????????
      {
        $lookup: {
          from: "images-and-videos",
          let: { forumThreadsImagesAndVideos_id: "$imagesAndVideos_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$forumThreadsImagesAndVideos_id"],
                },
              },
            },
            {
              $project: {
                createdDate: 0,
                updatedDate: 0,
                users_id: 0,
                __v: 0,
              },
            },
          ],
          as: "imagesAndVideosObj",
        },
      },

      {
        $unwind: {
          path: "$imagesAndVideosObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          createdDate: 0,
          imagesAndVideos_id: 0,
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   ????????????????????????????????????
    // --------------------------------------------------

    if (resultArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "V2oFFcQIl", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   ??????????????????????????????????????????
    // --------------------------------------------------

    const editable = verifyAuthority({
      req,
      users_id: lodashGet(resultArr, [0, "users_id"], ""),
      loginUsers_id,
      ISO8601: lodashGet(resultArr, [0, "createdDate"], ""),
      _id: lodashGet(resultArr, [0, "_id"], ""),
    });

    if (!editable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "-2ENyEiaJ", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const _id = lodashGet(resultArr, [0, "_id"], "");
    const imagesAndVideosObj = lodashGet(
      resultArr,
      [0, "imagesAndVideosObj"],
      {}
    );
    let name = "";
    let comment = "";

    // --------------------------------------------------
    //   Name & Description
    // --------------------------------------------------

    const filteredArr = resultArr.filter((filterObj) => {
      return filterObj.language === localeObj.language;
    });

    if (lodashHas(filteredArr, [0])) {
      name = lodashGet(filteredArr, [0, "name"], "");
      comment = lodashGet(filteredArr, [0, "comment"], "");
    } else {
      name = lodashGet(resultArr, [0, "localesArr", 0, "name"], "");
      comment = lodashGet(resultArr, [0, "localesArr", 0, "comment"], "");
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   forumThreads_id: {green ${forumThreads_id}}
    // `);

    // console.log(`
    //   ----- resultArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(resultArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return {
      _id,
      name,
      comment,
      imagesAndVideosObj,
    };
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Transaction
// --------------------------------------------------

/**
 * Transaction ?????? / ????????????
 * ???????????????????????????????????????????????????????????????????????????????????????
 *
 * @param {Object} forumThreadsConditionObj - DB forum-threads ????????????
 * @param {Object} forumThreadsSaveObj - DB forum-threads ???????????????
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos ????????????
 * @param {Object} imagesAndVideosSaveObj - DB images-and-videos ???????????????
 * @param {Object} gameCommunitiesConditionObj - DB game-communities ????????????
 * @param {Object} gameCommunitiesSaveObj - DB game-communities ???????????????
 * @param {Object} userCommunitiesConditionObj - DB user-communities ????????????
 * @param {Object} userCommunitiesSaveObj - DB user-communities ???????????????
 * @return {Object}
 */
const transactionForUpsertThread = async ({
  forumThreadsConditionObj,
  forumThreadsSaveObj,
  imagesAndVideosConditionObj = {},
  imagesAndVideosSaveObj = {},
  gameCommunitiesConditionObj = {},
  gameCommunitiesSaveObj = {},
  userCommunitiesConditionObj = {},
  userCommunitiesSaveObj = {},
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaForumThreads.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // ---------------------------------------------
    //   - forum-threads
    // ---------------------------------------------

    await SchemaForumThreads.updateOne(
      forumThreadsConditionObj,
      forumThreadsSaveObj,
      { session, upsert: true }
    );

    // ---------------------------------------------
    //   - images-and-videos
    // ---------------------------------------------

    if (
      Object.keys(imagesAndVideosConditionObj).length !== 0 &&
      Object.keys(imagesAndVideosSaveObj).length !== 0
    ) {
      // --------------------------------------------------
      //   ??????????????????????????????
      // --------------------------------------------------

      const arr = lodashGet(imagesAndVideosSaveObj, ["arr"], []);

      if (arr.length === 0) {
        await SchemaImagesAndVideos.deleteOne(imagesAndVideosConditionObj, {
          session,
        });

        // --------------------------------------------------
        //   ????????????????????????
        // --------------------------------------------------
      } else {
        await SchemaImagesAndVideos.updateOne(
          imagesAndVideosConditionObj,
          imagesAndVideosSaveObj,
          { session, upsert: true }
        );
      }
    }

    // ---------------------------------------------
    //   - game-communities
    // ---------------------------------------------

    if (
      Object.keys(gameCommunitiesConditionObj).length !== 0 &&
      Object.keys(gameCommunitiesSaveObj).length !== 0
    ) {
      await SchemaGameCommunities.updateOne(
        gameCommunitiesConditionObj,
        gameCommunitiesSaveObj,
        { session }
      );
    }

    // ---------------------------------------------
    //   - user-communities
    // ---------------------------------------------

    if (
      Object.keys(userCommunitiesConditionObj).length !== 0 &&
      Object.keys(userCommunitiesSaveObj).length !== 0
    ) {
      await SchemaUserCommunities.updateOne(
        userCommunitiesConditionObj,
        userCommunitiesSaveObj,
        { session }
      );
    }

    // --------------------------------------------------
    //   Transaction / Commit
    // --------------------------------------------------

    await session.commitTransaction();
    // console.log('--------????????????-----------');

    session.endSession();

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----- forumThreadsConditionObj -----\n
    //   ${util.inspect(forumThreadsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumThreadsSaveObj -----\n
    //   ${util.inspect(forumThreadsSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosConditionObj -----\n
    //   ${util.inspect(imagesAndVideosConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosSaveObj -----\n
    //   ${util.inspect(imagesAndVideosSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- gameCommunitiesConditionObj -----\n
    //   ${util.inspect(gameCommunitiesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- gameCommunitiesSaveObj -----\n
    //   ${util.inspect(gameCommunitiesSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunitiesConditionObj -----\n
    //   ${util.inspect(userCommunitiesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunitiesSaveObj -----\n
    //   ${util.inspect(userCommunitiesSaveObj, { colors: true, depth: null })}\n
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
    // console.log('--------??????????????????-----------');

    session.endSession();

    throw errorObj;
  }
};

/**
 * Transaction ???????????????????????????
 * ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
 * @param {Object} forumRepliesConditionObj - DB forum-comments ????????????
 * @param {Object} forumCommentsConditionObj - DB forum-comments ????????????
 * @param {Object} forumThreadsConditionObj - DB forum-threads ????????????
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos ????????????
 * @param {Object} gameCommunitiesConditionObj - DB game-communities ????????????
 * @param {Object} gameCommunitiesSaveObj - DB game-communities ???????????????
 * @param {Object} userCommunitiesConditionObj - DB user-communities ????????????
 * @param {Object} userCommunitiesSaveObj - DB user-communities ???????????????
 * @return {Object}
 */
const transactionForDeleteThread = async ({
  forumRepliesConditionObj,
  forumCommentsConditionObj,
  forumThreadsConditionObj,
  imagesAndVideosConditionObj = {},
  gameCommunitiesConditionObj = {},
  gameCommunitiesSaveObj = {},
  userCommunitiesConditionObj = {},
  userCommunitiesSaveObj = {},
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaForumThreads.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // --------------------------------------------------
    //   - forum-comments / Comments & Replies / deleteMany
    // --------------------------------------------------

    await SchemaForumComments.deleteMany(forumRepliesConditionObj, { session });
    await SchemaForumComments.deleteMany(forumCommentsConditionObj, {
      session,
    });

    // --------------------------------------------------
    //   - forum-threads / deleteOne
    // --------------------------------------------------

    await SchemaForumThreads.deleteOne(forumThreadsConditionObj, { session });

    // ---------------------------------------------
    //   - images-and-videos
    // ---------------------------------------------

    if (Object.keys(imagesAndVideosConditionObj).length !== 0) {
      await SchemaImagesAndVideos.deleteMany(imagesAndVideosConditionObj, {
        session,
      });
    }

    // ---------------------------------------------
    //   - game-communities
    // ---------------------------------------------

    if (
      Object.keys(gameCommunitiesConditionObj).length !== 0 &&
      Object.keys(gameCommunitiesSaveObj).length !== 0
    ) {
      await SchemaGameCommunities.updateOne(
        gameCommunitiesConditionObj,
        gameCommunitiesSaveObj,
        { session }
      );
    }

    // ---------------------------------------------
    //   - user-communities
    // ---------------------------------------------

    if (
      Object.keys(userCommunitiesConditionObj).length !== 0 &&
      Object.keys(userCommunitiesSaveObj).length !== 0
    ) {
      await SchemaUserCommunities.updateOne(
        userCommunitiesConditionObj,
        userCommunitiesSaveObj,
        { session }
      );
    }

    // --------------------------------------------------
    //   Transaction / Commit
    // --------------------------------------------------

    await session.commitTransaction();
    // console.log('--------????????????-----------');

    session.endSession();

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----- forumRepliesConditionObj -----\n
    //   ${util.inspect(forumRepliesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsConditionObj -----\n
    //   ${util.inspect(forumCommentsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumThreadsConditionObj -----\n
    //   ${util.inspect(forumThreadsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosConditionObj -----\n
    //   ${util.inspect(imagesAndVideosConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunitiesConditionObj -----\n
    //   ${util.inspect(userCommunitiesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunitiesSaveObj -----\n
    //   ${util.inspect(userCommunitiesSaveObj, { colors: true, depth: null })}\n
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
    // console.log('--------??????????????????-----------');

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
  deleteMany,

  findForumCommon,
  findForThreadsList,
  findForForum,
  findForumByforumID,
  // findForumForFollowContents,
  findForEdit,
  findForDeleteThread,

  transactionForUpsertThread,
  transactionForDeleteThread,
};

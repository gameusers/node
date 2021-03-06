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

const SchemaRecruitmentThreads = require("./schema.js");
const SchemaRecruitmentComments = require("../recruitment-comments/schema.js");
const SchemaRecruitmentReplies = require("../recruitment-replies/schema.js");
const SchemaImagesAndVideos = require("../images-and-videos/schema.js");
const SchemaGameCommunities = require("../game-communities/schema.js");
const SchemaWebPushes = require("../web-pushes/schema.js");
const SchemaUsers = require("../users/schema.js");
const SchemaNotifications = require("../notifications/schema.js");

const ModelRecruitmentComments = require("../recruitment-comments/model.js");
const ModelRecruitmentReplies = require("../recruitment-replies/model.js");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../@modules/error/custom.js");
const { verifyAuthority } = require("../../@modules/authority.js");

// ---------------------------------------------
//   Locales
// ---------------------------------------------

const { locale } = require("../../@locales/locale.js");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const { formatRecruitmentThreadsArr } = require("./format.js");
const { formatImagesAndVideosObj } = require("../images-and-videos/format.js");

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

    return await SchemaRecruitmentThreads.findOne(conditionObj).exec();
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

    return await SchemaRecruitmentThreads.find(conditionObj).exec();
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

    return await SchemaRecruitmentThreads.countDocuments(conditionObj).exec();
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

    return await SchemaRecruitmentThreads.findOneAndUpdate(
      conditionObj,
      saveObj,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
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

    return await SchemaRecruitmentThreads.insertMany(saveArr);
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

    return await SchemaRecruitmentThreads.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * ????????????????????? / ??????
 * @param {string} commonType - ????????? / matchConditionArr & sortSkipLimitArr ???????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {Array} matchConditionArr - ????????????
 * @param {Array} sortSkipLimitArr - ???????????????????????????????????????
 * @param {boolean} format - ?????????????????????????????? true / ??????????????????????????????????????????????????? false
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Array} ???????????????
 */
const findRecruitmentCommon = async ({
  commonType = "default",
  req,
  localeObj,
  loginUsers_id,
  matchConditionArr = [],
  sortSkipLimitArr = [],
  format = false,
  threadPage = 1,
  threadLimit = process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   parseInt
    // --------------------------------------------------

    // const intThreadPage = parseInt(threadPage, 10);
    // const intThreadLimit = parseInt((threadLimit || process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT), 10);

    const intThreadPage = parseInt(threadPage, 10);
    const intCommentPage = parseInt(commentPage, 10);
    const intReplyPage = parseInt(replyPage, 10);

    const intThreadLimit = parseInt(threadLimit, 10);
    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);

    const errorLimit = parseInt(process.env.WEB_PUSH_ERROR_LIMIT, 10);

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
    //   sortSkipLimitArr
    // --------------------------------------------------

    // let sslArr = [

    //   { $sort: { updatedDate: -1 } },
    //   { $skip: (intThreadPage - 1) * intThreadLimit },
    //   { $limit: intThreadLimit },

    // ];

    // if (sortSkipLimitArr.length > 0) {
    //   sslArr = sortSkipLimitArr;
    // }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaRecruitmentThreads.aggregate([
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
      //   games
      // --------------------------------------------------

      {
        $lookup: {
          from: "games",
          let: { letGameCommunities_id: "$gameCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    { $eq: ["$gameCommunities_id", "$$letGameCommunities_id"] },
                  ],
                },
              },
            },

            {
              $project: {
                _id: 0,
                twitterHashtagsArr: 1,
              },
            },
          ],
          as: "gamesObj",
        },
      },

      {
        $unwind: {
          path: "$gamesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   game-communities / threadCount ?????????
      // --------------------------------------------------

      {
        $lookup: {
          from: "game-communities",
          let: { letGameCommunities_id: "$gameCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$letGameCommunities_id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                recruitmentObj: 1,
              },
            },
          ],
          as: "gameCommunitiesObj",
        },
      },

      {
        $unwind: {
          path: "$gameCommunitiesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   card-players / ????????????????????????????????????????????????????????????????????????????????????
      // --------------------------------------------------

      {
        $lookup: {
          from: "card-players",
          let: { letUsers_id: "$users_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$users_id", "$$letUsers_id"] },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   card-players / images-and-videos / ????????????????????????
            // --------------------------------------------------

            {
              $lookup: {
                from: "images-and-videos",
                let: {
                  letImagesAndVideosThumbnail_id:
                    "$imagesAndVideosThumbnail_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$letImagesAndVideosThumbnail_id"],
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
                as: "imagesAndVideosThumbnailObj",
              },
            },

            {
              $unwind: {
                path: "$imagesAndVideosThumbnailObj",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                name: 1,
                status: 1,
                imagesAndVideosThumbnailObj: 1,
              },
            },
          ],
          as: "cardPlayersObj",
        },
      },

      {
        $unwind: {
          path: "$cardPlayersObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   web-pushes
      // --------------------------------------------------

      {
        $lookup: {
          from: "web-pushes",
          let: { letWebPushes_id: "$webPushes_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$letWebPushes_id"] },
                    { $lt: ["$errorCount", errorLimit] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                users_id: 1,
                subscriptionObj: 1,
                sendTodayCount: 1,
              },
            },
          ],
          as: "webPushesObj",
        },
      },

      {
        $unwind: {
          path: "$webPushesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   users
      // --------------------------------------------------

      {
        $lookup: {
          from: "users",
          let: { letUsers_id: "$users_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$letUsers_id"],
                },
              },
            },

            {
              $project: {
                _id: 0,
                accessDate: 1,
                exp: 1,
                userID: 1,
              },
            },
          ],
          as: "usersObj",
        },
      },

      {
        $unwind: {
          path: "$usersObj",
          preserveNullAndEmptyArrays: true,
        },
      },

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
      //   hardwares
      // --------------------------------------------------

      {
        $lookup: {
          from: "hardwares",
          let: { letHardwareIDsArr: "$hardwareIDsArr" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    { $in: ["$hardwareID", "$$letHardwareIDsArr"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                hardwareID: 1,
                name: 1,
              },
            },
          ],
          as: "hardwaresArr",
        },
      },

      // --------------------------------------------------
      //   ids
      // --------------------------------------------------

      {
        $lookup: {
          from: "ids",
          let: {
            letIDs_idArr: "$ids_idsArr",
            letUsers_id: "$users_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$users_id", "$$letUsers_id"] },
                    { $in: ["$_id", "$$letIDs_idArr"] },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   ids / games
            // --------------------------------------------------

            {
              $lookup: {
                from: "games",
                let: { letGameCommunities_id: "$gameCommunities_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$language", language] },
                          { $eq: ["$country", country] },
                          {
                            $eq: [
                              "$gameCommunities_id",
                              "$$letGameCommunities_id",
                            ],
                          },
                        ],
                      },
                    },
                  },

                  // --------------------------------------------------
                  //   ids / games / images-and-videos / ??????????????????
                  // --------------------------------------------------

                  {
                    $lookup: {
                      from: "images-and-videos",
                      let: {
                        letImagesAndVideosThumbnail_id:
                          "$imagesAndVideosThumbnail_id",
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ["$_id", "$$letImagesAndVideosThumbnail_id"],
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
                      as: "imagesAndVideosThumbnailObj",
                    },
                  },

                  {
                    $unwind: {
                      path: "$imagesAndVideosThumbnailObj",
                      preserveNullAndEmptyArrays: true,
                    },
                  },

                  {
                    $project: {
                      _id: 1,
                      gameCommunities_id: 1,
                      name: 1,
                      imagesAndVideosThumbnailObj: 1,
                    },
                  },
                ],
                as: "gamesObj",
              },
            },

            {
              $unwind: {
                path: "$gamesObj",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                createdDate: 0,
                updatedDate: 0,
                users_id: 0,
                search: 0,
                __v: 0,
              },
            },
          ],
          as: "idsArr",
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          imagesAndVideos_id: 0,
          webPushes_id: 0,
          acceptLanguage: 0,
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    if (format) {
      //   console.log(`
      //   ----- docArr111 -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   Threads
      // --------------------------------------------------

      const formattedThreadsObj = formatRecruitmentThreadsArr({
        req,
        localeObj,
        loginUsers_id,
        arr: docArr,
        threadPage: intThreadPage,
        threadLimit: intThreadLimit,
        // threadCount,
      });

      const recruitmentThreadsObj = lodashGet(
        formattedThreadsObj,
        ["recruitmentThreadsObj"],
        {}
      );

      // --------------------------------------------------
      //   Comments & Replies
      // --------------------------------------------------

      const formattedCommentsAndRepliesObj = await ModelRecruitmentComments.findCommentsAndReplies(
        {
          req,
          localeObj,
          loginUsers_id,
          recruitmentThreads_idsArr: lodashGet(
            formattedThreadsObj,
            ["recruitmentThreads_idsArr"],
            []
          ),
          recruitmentThreadsObj,
          commentPage: intCommentPage,
          commentLimit: intCommentLimit,
          replyPage: intReplyPage,
          replyLimit: intReplyLimit,
        }
      );

      const recruitmentCommentsObj = lodashGet(
        formattedCommentsAndRepliesObj,
        ["recruitmentCommentsObj"],
        {}
      );
      const recruitmentRepliesObj = lodashGet(
        formattedCommentsAndRepliesObj,
        ["recruitmentRepliesObj"],
        {}
      );

      // --------------------------------------------------
      //   Return
      // --------------------------------------------------

      return {
        recruitmentThreadsObj,
        recruitmentCommentsObj,
        recruitmentRepliesObj,
      };
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - findRecruitments
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   threadPage: {green ${threadPage}}
    //   threadLimit: {green ${threadLimit}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(chalk`
    //   threadLimit: {green ${threadLimit} / ${typeof threadLimit}}
    //   process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT: {green ${process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT} / ${typeof process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT}}
    //   intThreadLimit: {green ${intThreadLimit}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return docArr;
  } catch (err) {
    throw err;
  }
};

/**
 * ???????????????????????????????????????????????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ???????????????????????????ID
 * @param {Array} recruitmentThreads_idsArr - DB recruitment-threads _id / ????????????ID
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Array} ???????????????
 */
const findRecruitments = async ({
  req,
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  recruitmentThreads_idsArr = [],
  gameCommunities_idsArr = [],
  period,
  threadPage = 1,
  threadLimit = process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   property
    // --------------------------------------------------

    let threadCount = 0;
    let matchConditionArr = [];

    // --------------------------------------------------
    //   parseInt
    // --------------------------------------------------

    const intThreadLimit = parseInt(threadLimit, 10);
    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    matchConditionArr = [
      {
        $match: { gameCommunities_id },
      },
    ];

    // ---------------------------------------------
    //   ???????????????????????????????????????????????????????????????????????????????????????????????????
    // ---------------------------------------------

    if (recruitmentThreads_idsArr.length > 0) {
      matchConditionArr = [
        {
          $match: {
            $and: [
              { gameCommunities_id },
              { _id: { $in: recruitmentThreads_idsArr } },
            ],
          },
        },
      ];

      // ---------------------------------------------
      //   Follow Contents
      // ---------------------------------------------
    } else if (gameCommunities_idsArr.length > 0) {
      // ---------------------------------------------
      //   ?????????????????????????????????????????????????????????????????????????????????????????????
      // ---------------------------------------------

      const dateTimeLimit = moment().utc().add(-period, "minutes").toDate();

      conditionObj = {
        gameCommunities_id: { $in: gameCommunities_idsArr },
        updatedDate: { $gte: dateTimeLimit },
        // updatedDate: { $gt: new Date("2021-02-05T12:00:00.000Z") }
      };

      // ---------------------------------------------
      //   matchConditionArr
      // ---------------------------------------------

      matchConditionArr = [
        {
          $match: conditionObj,
        },
      ];

      // ---------------------------------------------
      //   threadCount
      // ---------------------------------------------

      threadCount = await count({
        conditionObj,
      });
    }

    // --------------------------------------------------
    //   findRecruitmentCommon
    // --------------------------------------------------

    const docArr = await findRecruitmentCommon({
      req,
      localeObj,
      loginUsers_id,
      matchConditionArr,
      threadPage,
      threadLimit: intThreadLimit,
    });

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const formattedThreadsObj = formatRecruitmentThreadsArr({
      req,
      localeObj,
      loginUsers_id,
      arr: docArr,
      threadPage,
      threadLimit: intThreadLimit,
      // threadCount,
    });

    const recruitmentThreadsObj = lodashGet(
      formattedThreadsObj,
      ["recruitmentThreadsObj"],
      {}
    );

    // --------------------------------------------------
    //   DB find / Comments & Replies
    // --------------------------------------------------

    const formattedCommentsAndRepliesObj = await ModelRecruitmentComments.findCommentsAndReplies(
      {
        req,
        localeObj,
        loginUsers_id,
        recruitmentThreads_idsArr: lodashGet(
          formattedThreadsObj,
          ["recruitmentThreads_idsArr"],
          []
        ),
        recruitmentThreadsObj,
        commentPage,
        commentLimit: intCommentLimit,
        replyPage,
        replyLimit: intReplyLimit,
      }
    );

    const recruitmentCommentsObj = lodashGet(
      formattedCommentsAndRepliesObj,
      ["recruitmentCommentsObj"],
      {}
    );
    const recruitmentRepliesObj = lodashGet(
      formattedCommentsAndRepliesObj,
      ["recruitmentRepliesObj"],
      {}
    );

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - findRecruitments
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   threadPage: {green ${threadPage}}
    //   threadLimit: {green ${threadLimit}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
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
    //   Return
    // --------------------------------------------------

    return {
      recruitmentThreadsObj,
      recruitmentCommentsObj,
      recruitmentRepliesObj,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * ??????????????????????????????????????????????????????????????????????????? / ????????????ID???????????????ID?????????ID???????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ???????????????????????????ID
 * @param {string} recruitmentID - ????????????ID / ????????????ID / ??????ID
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Array} ???????????????
 */
const findRecruitmentByRecruitmentID = async ({
  req,
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  recruitmentID,
  threadPage = 1,
  threadLimit = process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Parse
    // --------------------------------------------------

    // const intThreadLimit = parseInt(threadLimit, 10);
    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);

    // --------------------------------------------------
    //   DB find / ????????????ID???????????????
    // --------------------------------------------------

    let type = "thread";

    let recruitmentThreads_id = "";
    let recruitmentComments_id = "";
    let recruitmentReplies_id = "";

    const threadsObj = await findOne({
      conditionObj: {
        _id: recruitmentID,
        gameCommunities_id,
      },
    });

    recruitmentThreads_id = lodashGet(threadsObj, ["_id"], "");

    // --------------------------------------------------
    //   DB find / ??????????????????????????????ID???????????????
    // --------------------------------------------------

    if (!recruitmentThreads_id) {
      const commentsObj = await ModelRecruitmentComments.findOne({
        conditionObj: {
          _id: recruitmentID,
          gameCommunities_id,
        },
      });

      recruitmentThreads_id = lodashGet(
        commentsObj,
        ["recruitmentThreads_id"],
        ""
      );
      recruitmentComments_id = lodashGet(commentsObj, ["_id"], "");

      type = "comment";
    }

    // --------------------------------------------------
    //   DB find / ????????????????????????ID???????????????
    // --------------------------------------------------

    if (!recruitmentThreads_id) {
      const repliesObj = await ModelRecruitmentReplies.findOne({
        conditionObj: {
          _id: recruitmentID,
          gameCommunities_id,
        },
      });

      recruitmentThreads_id = lodashGet(
        repliesObj,
        ["recruitmentThreads_id"],
        ""
      );
      recruitmentComments_id = lodashGet(
        repliesObj,
        ["recruitmentComments_id"],
        ""
      );
      recruitmentReplies_id = lodashGet(repliesObj, ["_id"], "");

      type = "reply";
    }

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [];

    matchConditionArr = [
      {
        $match: {
          _id: recruitmentThreads_id,
        },
      },
    ];

    // --------------------------------------------------
    //   Aggregate
    // --------------------------------------------------

    const docArr = await findRecruitmentCommon({
      req,
      localeObj,
      loginUsers_id,
      matchConditionArr,
      threadPage: 1,
      threadLimit: 1,
    });

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const formattedThreadsObj = formatRecruitmentThreadsArr({
      req,
      localeObj,
      loginUsers_id,
      arr: docArr,
      threadPage: 1,
      threadLimit: 1,
    });

    const recruitmentThreadsObj = lodashGet(
      formattedThreadsObj,
      ["recruitmentThreadsObj"],
      {}
    );
    recruitmentThreadsObj.count = 0;

    // ------------------------------------------------------------
    //   ????????????????????????????????????
    // ------------------------------------------------------------

    let recruitmentCommentsObj = {};
    let recruitmentRepliesObj = {};
    let formattedCommentsAndRepliesObj = {};

    // --------------------------------------------------
    //   recruitmentID ????????????????????????
    // --------------------------------------------------

    if (type === "thread") {
      // --------------------------------------------------
      //   DB find / Forum Comments & Replies
      // --------------------------------------------------

      formattedCommentsAndRepliesObj = await ModelRecruitmentComments.findCommentsAndReplies(
        {
          req,
          localeObj,
          loginUsers_id,
          recruitmentThreads_idsArr: lodashGet(
            formattedThreadsObj,
            ["recruitmentThreads_idsArr"],
            []
          ),
          recruitmentThreadsObj,
          commentPage,
          commentLimit: intCommentLimit,
          replyPage,
          replyLimit: intReplyLimit,
        }
      );

      // --------------------------------------------------
      //   recruitmentID ????????????????????????
      // --------------------------------------------------
    } else if (type === "comment") {
      // --------------------------------------------------
      //   DB / ?????????????????????????????????????????????
      // --------------------------------------------------

      const pageObj = await ModelRecruitmentComments.getPage({
        recruitmentThreads_id,
        recruitmentComments_id,
        commentLimit,
      });

      // --------------------------------------------------
      //   DB find / Forum Comments & Replies
      // --------------------------------------------------

      formattedCommentsAndRepliesObj = await ModelRecruitmentComments.findCommentsAndReplies(
        {
          req,
          localeObj,
          loginUsers_id,
          recruitmentThreads_idsArr: lodashGet(
            formattedThreadsObj,
            ["recruitmentThreads_idsArr"],
            []
          ),
          recruitmentThreadsObj,
          commentPage: lodashGet(pageObj, ["commentPage"], 1),
          commentLimit: intCommentLimit,
          replyPage: 1,
          replyLimit: intReplyLimit,
        }
      );

      //   console.log(`
      //   ----- formattedCommentsAndRepliesObj -----\n
      //   ${util.inspect(formattedCommentsAndRepliesObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   recruitmentID ??????????????????
      // --------------------------------------------------
    } else if (type === "reply") {
      // --------------------------------------------------
      //   DB / ??????????????????????????????????????????????????????
      // --------------------------------------------------

      const pageObj = await ModelRecruitmentReplies.getPage({
        recruitmentThreads_id,
        recruitmentComments_id,
        recruitmentReplies_id,
        commentLimit,
        replyLimit,
      });

      // --------------------------------------------------
      //   DB find / Forum Comments & Replies
      // --------------------------------------------------

      formattedCommentsAndRepliesObj = await ModelRecruitmentComments.findCommentsAndReplies(
        {
          req,
          localeObj,
          loginUsers_id,
          recruitmentThreads_idsArr: lodashGet(
            formattedThreadsObj,
            ["recruitmentThreads_idsArr"],
            []
          ),
          recruitmentThreadsObj,
          commentPage: lodashGet(pageObj, ["commentPage"], 1),
          commentLimit: intCommentLimit,
          replyPage: lodashGet(pageObj, ["replyPage"], 1),
          replyLimit: intReplyLimit,
        }
      );
    }

    recruitmentCommentsObj = lodashGet(
      formattedCommentsAndRepliesObj,
      ["recruitmentCommentsObj"],
      {}
    );
    recruitmentRepliesObj = lodashGet(
      formattedCommentsAndRepliesObj,
      ["recruitmentRepliesObj"],
      {}
    );

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - findRecruitmentByRecruitmentID
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   recruitmentID: {green ${recruitmentID}}
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   recruitmentReplies_id: {green ${recruitmentReplies_id}}
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   threadPage: {green ${threadPage}}
    //   threadLimit: {green ${threadLimit}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(docArr, { colors: true, depth: null })}\n
    //   --------------------\n
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
    //   Return
    // --------------------------------------------------

    return {
      recruitmentThreadsObj,
      recruitmentCommentsObj,
      recruitmentRepliesObj,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * ???????????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ???????????????????????????ID
 * @param {Array} hardwareIDsArr - DB hardwares _id / ??????????????????ID??????????????????
 * @param {Array} categoriesArr - ???????????????No??????????????????
 * @param {string} keyword - ???????????????
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Array} ???????????????
 */
const findRecruitmentsForSearch = async ({
  req,
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  hardwareIDsArr = [],
  categoriesArr = [],
  keyword,
  threadPage = 1,
  threadLimit = process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Parse
    // --------------------------------------------------

    const intThreadLimit = parseInt(threadLimit, 10);
    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [];

    // ---------------------------------------------
    //   - andArr???????????????????????????????????? & threadCountConditionObj????????????????????????
    // ---------------------------------------------

    const andArr = [
      {
        gameCommunities_id,
      },
    ];

    const threadCountConditionObj = {
      gameCommunities_id,
    };

    // ---------------------------------------------
    //   - ????????????
    // ---------------------------------------------

    if (hardwareIDsArr.length > 0) {
      andArr.push({
        hardwareIDsArr: { $in: hardwareIDsArr },
      });

      threadCountConditionObj.hardwareIDsArr = { $in: hardwareIDsArr };
    }

    if (categoriesArr.length > 0) {
      andArr.push({
        category: { $in: categoriesArr },
      });

      threadCountConditionObj.category = { $in: categoriesArr };
    }

    if (keyword) {
      andArr.push({
        $or: [
          { "localesArr.title": { $regex: keyword } },
          { "localesArr.comment": { $regex: keyword } },
        ],
      });

      threadCountConditionObj.$or = [
        { "localesArr.title": { $regex: keyword } },
        { "localesArr.comment": { $regex: keyword } },
      ];
    }

    // ---------------------------------------------
    //   - ??????????????????
    // ---------------------------------------------

    matchConditionArr = [
      {
        $match: {
          $and: andArr,
        },
      },
    ];

    // console.log(`
    //   ----- andArr -----\n
    //   ${util.inspect(andArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- matchConditionArr -----\n
    //   ${util.inspect(matchConditionArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- threadCountConditionObj -----\n
    //   ${util.inspect(threadCountConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Aggregate
    // --------------------------------------------------

    const docArr = await findRecruitmentCommon({
      req,
      localeObj,
      loginUsers_id,
      matchConditionArr,
      threadPage,
      threadLimit,
    });

    // --------------------------------------------------
    //   ????????????????????????????????? & ????????????????????????????????????
    // --------------------------------------------------

    let recruitmentThreadsObj = {};
    let recruitmentCommentsObj = {};
    let recruitmentRepliesObj = {};

    if (docArr.length > 0) {
      // --------------------------------------------------
      //   threadCount??????????????????????????? ??????
      // --------------------------------------------------

      const threadCount = await count({
        conditionObj: threadCountConditionObj,
      });

      // console.log(chalk`
      //   threadCount: {green ${threadCount}}
      // `);

      // --------------------------------------------------
      //   threadCount ?????????????????????????????????????????????????????????????????????????????????????????????????????????
      // --------------------------------------------------

      lodashSet(
        docArr,
        [0, "gameCommunitiesObj", "recruitmentObj", "threadCount"],
        threadCount
      );

      // --------------------------------------------------
      //   Format
      // --------------------------------------------------

      const formattedThreadsObj = formatRecruitmentThreadsArr({
        req,
        localeObj,
        loginUsers_id,
        arr: docArr,
        threadPage,
        threadLimit: intThreadLimit,
      });

      recruitmentThreadsObj = lodashGet(
        formattedThreadsObj,
        ["recruitmentThreadsObj"],
        {}
      );

      // --------------------------------------------------
      //   DB find / Comments & Replies
      // --------------------------------------------------

      const formattedCommentsAndRepliesObj = await ModelRecruitmentComments.findCommentsAndReplies(
        {
          req,
          localeObj,
          loginUsers_id,
          recruitmentThreads_idsArr: lodashGet(
            formattedThreadsObj,
            ["recruitmentThreads_idsArr"],
            []
          ),
          recruitmentThreadsObj,
          commentPage,
          commentLimit: intCommentLimit,
          replyPage,
          replyLimit: intReplyLimit,
        }
      );

      recruitmentCommentsObj = lodashGet(
        formattedCommentsAndRepliesObj,
        ["recruitmentCommentsObj"],
        {}
      );
      recruitmentRepliesObj = lodashGet(
        formattedCommentsAndRepliesObj,
        ["recruitmentRepliesObj"],
        {}
      );
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - findRecruitmentsForSearch
    // `);

    // console.log(`
    //   ----- localeObj -----\n
    //   ${util.inspect(localeObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- hardwareIDsArr -----\n
    //   ${util.inspect(hardwareIDsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- categoriesArr -----\n
    //   ${util.inspect(categoriesArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id} / ${typeof loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id} / ${typeof gameCommunities_id}}
    //   keyword: {green ${keyword} / ${typeof keyword}}
    //   threadPage: {green ${threadPage} / ${typeof threadPage}}
    //   threadLimit: {green ${threadLimit} / ${typeof threadLimit}}
    //   commentPage: {green ${commentPage} / ${typeof commentPage}}
    //   commentLimit: {green ${commentLimit} / ${typeof commentLimit}}
    //   replyPage: {green ${replyPage} / ${typeof replyPage}}
    //   replyLimit: {green ${replyLimit} / ${typeof replyLimit}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(docArr, { colors: true, depth: null })}\n
    //   --------------------\n
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
    //   Return
    // --------------------------------------------------

    return {
      recruitmentThreadsObj,
      recruitmentCommentsObj,
      recruitmentRepliesObj,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * ???????????????????????????????????????????????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ???????????????????????????ID
 * @param {Array} recruitmentThreads_idsArr - DB recruitment-threads _id / ????????????ID
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Array} ???????????????
 */
// const findRecruitmentsForFollowContents = async ({

//   req,
//   localeObj,
//   loginUsers_id,
//   gameCommunities_id,
//   gameCommunities_idsArr = [],
//   period,
//   recruitmentThreads_idsArr = [],
//   threadPage = 1,
//   threadLimit = process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT,
//   commentPage = 1,
//   commentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
//   replyPage = 1,
//   replyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,

// }) => {

//   try {

//     // --------------------------------------------------
//     //   Parse
//     // --------------------------------------------------

//     const intThreadLimit = parseInt(threadLimit, 10);
//     const intCommentLimit = parseInt(commentLimit, 10);
//     const intReplyLimit = parseInt(replyLimit, 10);

//     // --------------------------------------------------
//     //   Match Condition Array
//     // --------------------------------------------------

//     let matchConditionArr = [];

//     matchConditionArr = [
//       {
//         $match: { gameCommunities_id }
//       },
//     ];

//     // ---------------------------------------------
//     //   - ?????????????????????
//     // ---------------------------------------------

//     if (recruitmentThreads_idsArr.length > 0) {

//       matchConditionArr = [
//         {
//           $match: {
//             $and:
//               [
//                 { gameCommunities_id },
//                 { _id: { $in: recruitmentThreads_idsArr } }
//               ]
//           }
//         },
//       ];

//     }

//     // ---------------------------------------------
//     //   - Follow Contents
//     // ---------------------------------------------

//     if (gameCommunities_idsArr.length > 0) {

//       // ---------------------------------------------
//       //   ?????????????????????????????????????????????????????????????????????????????????????????????
//       // ---------------------------------------------

//       const dateTimeLimit = moment().utc().add(-(period), 'minutes').toDate();

//       conditionObj = {

//         gameCommunities_id: { $in: gameCommunities_idsArr },
//         updatedDate: { $gte: dateTimeLimit }
//         // updatedDate: { $gt: new Date("2021-02-05T12:00:00.000Z") }

//       }

//       // ---------------------------------------------
//       //   matchConditionArr
//       // ---------------------------------------------

//       matchConditionArr = [
//         {
//           $match: conditionObj
//         }
//       ];

//       // ---------------------------------------------
//       //   - threadCount
//       // ---------------------------------------------

//       threadCount = await count({
//         conditionObj
//       });

//     }

//     // --------------------------------------------------
//     //   Aggregate
//     // --------------------------------------------------

//     const docArr = await findRecruitmentCommon({

//       req,
//       localeObj,
//       loginUsers_id,
//       matchConditionArr,
//       threadPage,
//       threadLimit: intThreadLimit,

//     });

//     // --------------------------------------------------
//     //   Format
//     // --------------------------------------------------

//     const formattedThreadsObj = formatRecruitmentThreadsArr({

//       req,
//       localeObj,
//       loginUsers_id,
//       arr: docArr,
//       threadPage,
//       threadLimit: intThreadLimit,

//     });

//     const recruitmentThreadsObj = lodashGet(formattedThreadsObj, ['recruitmentThreadsObj'], {});

//     // --------------------------------------------------
//     //   DB find / Comments & Replies
//     // --------------------------------------------------

//     const formattedCommentsAndRepliesObj = await ModelRecruitmentComments.findCommentsAndReplies({

//       req,
//       localeObj,
//       loginUsers_id,
//       recruitmentThreads_idsArr: lodashGet(formattedThreadsObj, ['recruitmentThreads_idsArr'], []),
//       recruitmentThreadsObj,
//       commentPage,
//       commentLimit: intCommentLimit,
//       replyPage,
//       replyLimit: intReplyLimit,

//     });

//     const recruitmentCommentsObj = lodashGet(formattedCommentsAndRepliesObj, ['recruitmentCommentsObj'], {});
//     const recruitmentRepliesObj = lodashGet(formattedCommentsAndRepliesObj, ['recruitmentRepliesObj'], {});

//     // --------------------------------------------------
//     //   console.log
//     // --------------------------------------------------

//     // console.log(`
//     //   ----------------------------------------\n
//     //   /app/@database/recruitment-threads/model.js - findRecruitments
//     // `);

//     // console.log(chalk`
//     //   loginUsers_id: {green ${loginUsers_id}}
//     //   gameCommunities_id: {green ${gameCommunities_id}}
//     //   threadPage: {green ${threadPage}}
//     //   threadLimit: {green ${threadLimit}}
//     //   commentPage: {green ${commentPage}}
//     //   commentLimit: {green ${commentLimit}}
//     //   replyPage: {green ${replyPage}}
//     //   replyLimit: {green ${replyLimit}}
//     // `);

//     // console.log(`
//     //   ----- matchConditionArr -----\n
//     //   ${util.inspect(JSON.parse(JSON.stringify(matchConditionArr)), { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     // console.log(`
//     //   ----- docArr -----\n
//     //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     // console.log(`
//     //   ----- recruitmentThreadsObj -----\n
//     //   ${util.inspect(recruitmentThreadsObj, { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     // console.log(`
//     //   ----- recruitmentCommentsObj -----\n
//     //   ${util.inspect(recruitmentCommentsObj, { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     // console.log(`
//     //   ----- recruitmentRepliesObj -----\n
//     //   ${util.inspect(recruitmentRepliesObj, { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     // --------------------------------------------------
//     //   Return
//     // --------------------------------------------------

//     return {

//       recruitmentThreadsObj,
//       recruitmentCommentsObj,
//       recruitmentRepliesObj,

//     };

//   } catch (err) {

//     throw err;

//   }

// };

/**
 * aggregate / ?????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {Array} matchConditionArr - ????????????
 * @param {number} threadPage - ????????????????????????
 * @param {number} threadLimit - ???????????????????????????
 * @return {Array} ???????????????
 */
// const aggregate = async ({

//   req,
//   localeObj,
//   loginUsers_id,
//   matchConditionArr = [],
//   threadPage = 1,
//   threadLimit = process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT,

// }) => {

//   try {

//     // --------------------------------------------------
//     //   Language & Country
//     // --------------------------------------------------

//     const language = lodashGet(localeObj, ['language'], '');
//     const country = lodashGet(localeObj, ['country'], '');

//     // --------------------------------------------------
//     //   Limit
//     // --------------------------------------------------

//     const intThreadLimit = parseInt((threadLimit || process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT), 10);
//     const errorLimit = parseInt(process.env.WEB_PUSH_ERROR_LIMIT, 10);

//     // console.log(chalk`
//     //   aggregate
//     //   threadLimit: {green ${threadLimit} / ${typeof threadLimit}}
//     //   process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT: {green ${process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT} / ${typeof process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT}}
//     //   intThreadLimit: {green ${intThreadLimit}}
//     // `);

//     // --------------------------------------------------
//     //   Aggregation
//     // --------------------------------------------------

//     const docArr = await SchemaRecruitmentThreads.aggregate([

//       // --------------------------------------------------
//       //   Match Condition Array
//       // --------------------------------------------------

//       ...matchConditionArr,

//       // --------------------------------------------------
//       //   $sort / $skip / $limit
//       // --------------------------------------------------

//       { $sort: { updatedDate: -1 } },
//       { $skip: (threadPage - 1) * intThreadLimit },
//       { $limit: intThreadLimit },

//       // --------------------------------------------------
//       //   games
//       // --------------------------------------------------

//       {
//         $lookup:
//           {
//             from: 'games',
//             let: { letGameCommunities_id: '$gameCommunities_id' },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ['$language', language] },
//                       { $eq: ['$country', country] },
//                       { $eq: ['$gameCommunities_id', '$$letGameCommunities_id'] }
//                     ]
//                   },
//                 }
//               },

//               {
//                 $project: {
//                   _id: 0,
//                   twitterHashtagsArr: 1,
//                 }
//               }
//             ],
//             as: 'gamesObj'
//           }
//       },

//       {
//         $unwind: {
//           path: '$gamesObj',
//           preserveNullAndEmptyArrays: true,
//         }
//       },

//       // --------------------------------------------------
//       //   game-communities / threadCount ?????????
//       // --------------------------------------------------

//       {
//         $lookup:
//           {
//             from: 'game-communities',
//             let: { letGameCommunities_id: '$gameCommunities_id' },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $eq: ['$_id', '$$letGameCommunities_id']
//                   },
//                 }
//               },
//               {
//                 $project: {
//                   _id: 0,
//                   recruitmentObj: 1,
//                 }
//               }
//             ],
//             as: 'gameCommunitiesObj'
//           }
//       },

//       {
//         $unwind: {
//           path: '$gameCommunitiesObj',
//           preserveNullAndEmptyArrays: true,
//         }
//       },

//       // --------------------------------------------------
//       //   card-players / ????????????????????????????????????????????????????????????????????????????????????
//       // --------------------------------------------------

//       {
//         $lookup:
//           {
//             from: 'card-players',
//             let: { letUsers_id: '$users_id' },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ['$language', language] },
//                       { $eq: ['$users_id', '$$letUsers_id'] },
//                     ]
//                   },
//                 }
//               },

//               // --------------------------------------------------
//               //   card-players / images-and-videos / ????????????????????????
//               // --------------------------------------------------

//               {
//                 $lookup:
//                   {
//                     from: 'images-and-videos',
//                     let: { letImagesAndVideosThumbnail_id: '$imagesAndVideosThumbnail_id' },
//                     pipeline: [
//                       {
//                         $match: {
//                           $expr: {
//                             $eq: ['$_id', '$$letImagesAndVideosThumbnail_id']
//                           },
//                         }
//                       },
//                       {
//                         $project: {
//                           createdDate: 0,
//                           updatedDate: 0,
//                           users_id: 0,
//                           __v: 0,
//                         }
//                       }
//                     ],
//                     as: 'imagesAndVideosThumbnailObj'
//                   }
//               },

//               {
//                 $unwind: {
//                   path: '$imagesAndVideosThumbnailObj',
//                   preserveNullAndEmptyArrays: true,
//                 }
//               },

//               {
//                 $project: {
//                   name: 1,
//                   status: 1,
//                   imagesAndVideosThumbnailObj: 1,
//                 }
//               }
//             ],
//             as: 'cardPlayersObj'
//           }
//       },

//       {
//         $unwind: {
//           path: '$cardPlayersObj',
//           preserveNullAndEmptyArrays: true,
//         }
//       },

//       // --------------------------------------------------
//       //   web-pushes
//       // --------------------------------------------------

//       {
//         $lookup:
//           {
//             from: 'web-pushes',
//             let: { letWebPushes_id: '$webPushes_id' },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ['$_id', '$$letWebPushes_id'] },
//                       { $lt: ['$errorCount', errorLimit] },
//                     ]
//                   },

//                 }
//               },
//               {
//                 $project: {
//                   _id: 1,
//                   users_id: 1,
//                   subscriptionObj: 1,
//                   sendTodayCount: 1,
//                 }
//               }
//             ],
//             as: 'webPushesObj'
//           }
//       },

//       {
//         $unwind: {
//           path: '$webPushesObj',
//           preserveNullAndEmptyArrays: true,
//         }
//       },

//       // --------------------------------------------------
//       //   users
//       // --------------------------------------------------

//       {
//         $lookup:
//           {
//             from: 'users',
//             let: { letUsers_id: '$users_id' },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $eq: ['$_id', '$$letUsers_id']
//                   },
//                 }
//               },

//               {
//                 $project: {
//                   _id: 0,
//                   accessDate: 1,
//                   exp: 1,
//                   userID: 1,
//                 }
//               }
//             ],
//             as: 'usersObj'
//           }
//       },

//       {
//         $unwind: {
//           path: '$usersObj',
//           preserveNullAndEmptyArrays: true,
//         }
//       },

//       // --------------------------------------------------
//       //   images-and-videos
//       // --------------------------------------------------

//       {
//         $lookup:
//           {
//             from: 'images-and-videos',
//             let: { letImagesAndVideos_id: '$imagesAndVideos_id' },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $eq: ['$_id', '$$letImagesAndVideos_id']
//                   },
//                 }
//               },
//               {
//                 $project: {
//                   createdDate: 0,
//                   updatedDate: 0,
//                   users_id: 0,
//                   __v: 0,
//                 }
//               }
//             ],
//             as: 'imagesAndVideosObj'
//           }
//       },

//       {
//         $unwind: {
//           path: '$imagesAndVideosObj',
//           preserveNullAndEmptyArrays: true,
//         }
//       },

//       // --------------------------------------------------
//       //   hardwares
//       // --------------------------------------------------

//       {
//         $lookup:
//           {
//             from: 'hardwares',
//             let: { letHardwareIDsArr: '$hardwareIDsArr' },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ['$language', language] },
//                       { $eq: ['$country', country] },
//                       { $in: ['$hardwareID', '$$letHardwareIDsArr'] }
//                     ]
//                   },
//                 }
//               },
//               {
//                 $project: {
//                   _id: 0,
//                   hardwareID: 1,
//                   name: 1,
//                 }
//               }
//             ],
//             as: 'hardwaresArr'
//           }
//       },

//       // --------------------------------------------------
//       //   ids
//       // --------------------------------------------------

//       {
//         $lookup:
//           {
//             from: 'ids',
//             let: {
//               letIDs_idArr: '$ids_idsArr',
//               letUsers_id: '$users_id',
//             },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ['$users_id', '$$letUsers_id'] },
//                       { $in: ['$_id', '$$letIDs_idArr'] }
//                     ]
//                   },
//                 }
//               },

//               // --------------------------------------------------
//               //   ids / games
//               // --------------------------------------------------

//               {
//                 $lookup:
//                   {
//                     from: 'games',
//                     let: { letGameCommunities_id: '$gameCommunities_id' },
//                     pipeline: [
//                       {
//                         $match: {
//                           $expr: {
//                             $and: [
//                               { $eq: ['$language', language] },
//                               { $eq: ['$country', country] },
//                               { $eq: ['$gameCommunities_id', '$$letGameCommunities_id'] }
//                             ]
//                           },
//                         }
//                       },

//                       // --------------------------------------------------
//                       //   ids / games / images-and-videos / ??????????????????
//                       // --------------------------------------------------

//                       {
//                         $lookup:
//                           {
//                             from: 'images-and-videos',
//                             let: { letImagesAndVideosThumbnail_id: '$imagesAndVideosThumbnail_id' },
//                             pipeline: [
//                               {
//                                 $match: {
//                                   $expr: {
//                                     $eq: ['$_id', '$$letImagesAndVideosThumbnail_id']
//                                   },
//                                 }
//                               },
//                               {
//                                 $project: {
//                                   createdDate: 0,
//                                   updatedDate: 0,
//                                   users_id: 0,
//                                   __v: 0,
//                                 }
//                               }
//                             ],
//                             as: 'imagesAndVideosThumbnailObj'
//                           }
//                       },

//                       {
//                         $unwind: {
//                           path: '$imagesAndVideosThumbnailObj',
//                           preserveNullAndEmptyArrays: true,
//                         }
//                       },

//                       {
//                         $project: {
//                           _id: 1,
//                           gameCommunities_id: 1,
//                           name: 1,
//                           imagesAndVideosThumbnailObj: 1,
//                         }
//                       }
//                     ],
//                     as: 'gamesObj'
//                   }
//               },

//               {
//                 $unwind:
//                   {
//                     path: '$gamesObj',
//                     preserveNullAndEmptyArrays: true
//                   }
//               },

//               {
//                 $project: {
//                   createdDate: 0,
//                   updatedDate: 0,
//                   users_id: 0,
//                   search: 0,
//                   __v: 0,
//                 }
//               }
//             ],
//             as: 'idsArr'
//           }
//       },

//       // --------------------------------------------------
//       //   $project
//       // --------------------------------------------------

//       {
//         $project: {
//           imagesAndVideos_id: 0,
//           webPushes_id: 0,
//           acceptLanguage: 0,
//           __v: 0,
//         }
//       },

//     ]).exec();

//     // --------------------------------------------------
//     //   console.log
//     // --------------------------------------------------

//     // console.log(`
//     //   ----------------------------------------\n
//     //   /app/@database/recruitment-threads/model.js - findRecruitments
//     // `);

//     // console.log(chalk`
//     //   loginUsers_id: {green ${loginUsers_id}}
//     //   gameCommunities_id: {green ${gameCommunities_id}}
//     //   threadPage: {green ${threadPage}}
//     //   threadLimit: {green ${threadLimit}}
//     //   commentPage: {green ${commentPage}}
//     //   commentLimit: {green ${commentLimit}}
//     //   replyPage: {green ${replyPage}}
//     //   replyLimit: {green ${replyLimit}}
//     // `);

//     // console.log(`
//     //   ----- docArr -----\n
//     //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     // --------------------------------------------------
//     //   Return
//     // --------------------------------------------------

//     return docArr;

//   } catch (err) {

//     throw err;

//   }

// };

/**
 * ????????????????????????????????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} recruitmentThreads_id - DB recruitment-threads _id / ????????????ID
 * @return {Array} ???????????????
 */
const findOneForEdit = async ({
  req,
  localeObj,
  loginUsers_id,
  recruitmentThreads_id,
}) => {
  try {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Web Push Error Limit
    // --------------------------------------------------

    const webPushErrorLimit = parseInt(process.env.WEB_PUSH_ERROR_LIMIT, 10);

    // --------------------------------------------------
    //   Find
    // --------------------------------------------------

    const docRecruitmentThreadsArr = await SchemaRecruitmentThreads.aggregate([
      // --------------------------------------------------
      //   Match
      // --------------------------------------------------

      {
        $match: { _id: recruitmentThreads_id },
      },

      // --------------------------------------------------
      //   images-and-videos
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: { recruitmentThreadsImagesAndVideos_id: "$imagesAndVideos_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$recruitmentThreadsImagesAndVideos_id"],
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
      //   hardwares
      // --------------------------------------------------

      {
        $lookup: {
          from: "hardwares",
          let: { recruitmentThreadsHardwareIDsArr: "$hardwareIDsArr" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    {
                      $in: [
                        "$hardwareID",
                        "$$recruitmentThreadsHardwareIDsArr",
                      ],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                hardwareID: 1,
                name: 1,
              },
            },
          ],
          as: "hardwaresArr",
        },
      },

      // --------------------------------------------------
      //   ids
      // --------------------------------------------------

      {
        $lookup: {
          from: "ids",
          let: {
            recruitmentThreadsIDs_idArr: "$ids_idsArr",
            recruitmentThreadsUsers_id: "$users_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$users_id", "$$recruitmentThreadsUsers_id"] },
                    { $in: ["$_id", "$$recruitmentThreadsIDs_idArr"] },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   ids / games
            // --------------------------------------------------

            {
              $lookup: {
                from: "games",
                let: { idsGameCommunities_id: "$gameCommunities_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$language", language] },
                          { $eq: ["$country", country] },
                          {
                            $eq: [
                              "$gameCommunities_id",
                              "$$idsGameCommunities_id",
                            ],
                          },
                        ],
                      },
                    },
                  },

                  // --------------------------------------------------
                  //   ids / games / images-and-videos / ??????????????????
                  // --------------------------------------------------

                  {
                    $lookup: {
                      from: "images-and-videos",
                      let: {
                        gamesImagesAndVideosThumbnail_id:
                          "$imagesAndVideosThumbnail_id",
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: [
                                "$_id",
                                "$$gamesImagesAndVideosThumbnail_id",
                              ],
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
                      as: "imagesAndVideosThumbnailObj",
                    },
                  },

                  {
                    $unwind: {
                      path: "$imagesAndVideosThumbnailObj",
                      preserveNullAndEmptyArrays: true,
                    },
                  },

                  {
                    $project: {
                      _id: 1,
                      gameCommunities_id: 1,
                      name: 1,
                      imagesAndVideosThumbnailObj: 1,
                    },
                  },
                ],
                as: "gamesObj",
              },
            },

            {
              $unwind: {
                path: "$gamesObj",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                createdDate: 0,
                updatedDate: 0,
                users_id: 0,
                search: 0,
                __v: 0,
              },
            },
          ],
          as: "idsArr",
        },
      },

      // --------------------------------------------------
      //   web-pushes
      // --------------------------------------------------

      {
        $lookup: {
          from: "web-pushes",
          let: { letWebPushes_id: "$webPushes_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$letWebPushes_id"] },
                    { $lt: ["$errorCount", webPushErrorLimit] },
                  ],
                },
              },
            },
            {
              $project: {
                // _id: 1,
                // users_id: 1,
                subscriptionObj: 1,
                // sendTodayCount: 1,
              },
            },
          ],
          as: "webPushesObj",
        },
      },

      {
        $unwind: {
          path: "$webPushesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          createdDate: 0,
          imagesAndVideos_id: 0,
          hardwareIDsArr: 0,
          ids_idsArr: 0,
          publicCommentsUsers_idsArr: 0,
          publicApprovalUsers_idsArrr: 0,
          comments: 0,
          replies: 0,
          images: 0,
          videos: 0,
          ip: 0,
          userAgent: 0,
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   ????????????????????????????????????
    // --------------------------------------------------

    if (docRecruitmentThreadsArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "acvBaS9ri", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   ??????????????????????????????????????????
    // --------------------------------------------------

    const editable = verifyAuthority({
      req,
      users_id: lodashGet(docRecruitmentThreadsArr, [0, "users_id"], ""),
      loginUsers_id,
      ISO8601: lodashGet(docRecruitmentThreadsArr, [0, "createdDate"], ""),
      _id: lodashGet(docRecruitmentThreadsArr, [0, "_id"], ""),
    });

    if (!editable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "ccO1brrau", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const formattedObj = docRecruitmentThreadsArr[0];

    // --------------------------------------------------
    //   ?????????????????????ID
    // --------------------------------------------------

    const publicIDsArr = lodashGet(formattedObj, ["publicIDsArr"], []);

    for (const [index, valueObj] of publicIDsArr.entries()) {
      if (index === 0) {
        lodashSet(formattedObj, ["platform1"], valueObj.platform);
        lodashSet(formattedObj, ["id1"], valueObj.id);
      } else if (index === 1) {
        lodashSet(formattedObj, ["platform2"], valueObj.platform);
        lodashSet(formattedObj, ["id2"], valueObj.id);
      } else if (index === 2) {
        lodashSet(formattedObj, ["platform3"], valueObj.platform);
        lodashSet(formattedObj, ["id3"], valueObj.id);
      }
    }

    // --------------------------------------------------
    //   ??????
    // --------------------------------------------------

    const publicInformationsArr = lodashGet(
      formattedObj,
      ["publicInformationsArr"],
      []
    );

    for (const [index, valueObj] of publicInformationsArr.entries()) {
      if (index === 0) {
        lodashSet(formattedObj, ["informationTitle1"], valueObj.title);
        lodashSet(formattedObj, ["information1"], valueObj.information);
      } else if (index === 1) {
        lodashSet(formattedObj, ["informationTitle2"], valueObj.title);
        lodashSet(formattedObj, ["information2"], valueObj.information);
      } else if (index === 2) {
        lodashSet(formattedObj, ["informationTitle3"], valueObj.title);
        lodashSet(formattedObj, ["information3"], valueObj.information);
      } else if (index === 3) {
        lodashSet(formattedObj, ["informationTitle4"], valueObj.title);
        lodashSet(formattedObj, ["information4"], valueObj.information);
      } else if (index === 4) {
        lodashSet(formattedObj, ["informationTitle5"], valueObj.title);
        lodashSet(formattedObj, ["information5"], valueObj.information);
      }
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = formattedObj;

    // --------------------------------------------------
    //   ???????????????????????????
    // --------------------------------------------------

    delete returnObj.publicIDsArr;
    delete returnObj.publicInformationsArr;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - findOneForEdit
    // `);

    // console.log(chalk`
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   editable: {green ${editable} / ${typeof editable}}
    // `);

    // console.log(`
    //   ----- docRecruitmentThreadsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docRecruitmentThreadsArr)), { colors: true, depth: null })}\n
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
 * ????????????????????????????????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} recruitmentThreads_id - DB recruitment-threads _id / ????????????ID
 * @return {Array} ???????????????
 */
const findForDelete = async ({
  req,
  localeObj,
  loginUsers_id,
  recruitmentThreads_id,
}) => {
  try {
    // --------------------------------------------------
    //   Aggregate
    // --------------------------------------------------

    const docArr = await SchemaRecruitmentThreads.aggregate([
      // --------------------------------------------------
      //   Match
      // --------------------------------------------------

      {
        $match: { _id: recruitmentThreads_id },
      },

      // --------------------------------------------------
      //   images-and-videos
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: { letImagesAndVideos_id: "$imagesAndVideos_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$letImagesAndVideos_id"] } } },
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
      //   ????????????
      // --------------------------------------------------

      {
        $lookup: {
          from: "recruitment-comments",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$recruitmentThreads_id", "$$let_id"] },
              },
            },

            // --------------------------------------------------
            //   recruitment-replies / images-and-videos - ???????????????
            // --------------------------------------------------

            {
              $lookup: {
                from: "images-and-videos",
                let: { letImagesAndVideos_id: "$imagesAndVideos_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$letImagesAndVideos_id"] },
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
                imagesAndVideos_id: 1,
                imagesAndVideosObj: 1,
              },
            },
          ],
          as: "recruitmentCommentsArr",
        },
      },

      // --------------------------------------------------
      //   ??????
      // --------------------------------------------------

      {
        $lookup: {
          from: "recruitment-replies",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$recruitmentThreads_id", "$$let_id"] },
              },
            },

            // --------------------------------------------------
            //   recruitment-replies / images-and-videos - ???????????????
            // --------------------------------------------------

            {
              $lookup: {
                from: "images-and-videos",
                let: { letImagesAndVideos_id: "$imagesAndVideos_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$letImagesAndVideos_id"] },
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
                imagesAndVideos_id: 1,
                imagesAndVideosObj: 1,
              },
            },
          ],
          as: "recruitmentRepliesArr",
        },
      },

      {
        $project: {
          _id: 1,
          createdDate: 1,
          gameCommunities_id: 1,
          recruitmentThreads_id: 1,
          users_id: 1,
          imagesAndVideos_id: 1,
          imagesAndVideosObj: 1,
          recruitmentCommentsArr: 1,
          recruitmentRepliesArr: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   ????????????????????????????????????
    // --------------------------------------------------

    if (docArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "uRvA1Pc9A", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const docThreadObj = lodashGet(docArr, [0], {});

    const gameCommunities_id = lodashGet(
      docThreadObj,
      ["gameCommunities_id"],
      ""
    );

    const recruitmentCommentsArr = lodashGet(
      docThreadObj,
      ["recruitmentCommentsArr"],
      []
    );
    const recruitmentRepliesArr = lodashGet(
      docThreadObj,
      ["recruitmentRepliesArr"],
      []
    );

    // --------------------------------------------------
    //   ??????????????????????????????????????????
    // --------------------------------------------------

    const editable = verifyAuthority({
      req,
      users_id: lodashGet(docThreadObj, ["users_id"], ""),
      loginUsers_id,
      ISO8601: lodashGet(docThreadObj, ["createdDate"], ""),
      _id: lodashGet(docThreadObj, ["_id"], ""),
    });

    if (!editable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "r94PLmRoY", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   ???????????????
    //   ??????????????????????????????????????????????????????????????????
    // --------------------------------------------------

    const comments = -recruitmentCommentsArr.length;
    const replies = -recruitmentRepliesArr.length;

    const imagesAndVideos_id = lodashGet(
      docThreadObj,
      ["imagesAndVideos_id"],
      ""
    );
    const imagesAndVideos_idsArr = [];

    if (imagesAndVideos_id) {
      imagesAndVideos_idsArr.push(imagesAndVideos_id);
    }

    let images = -lodashGet(docThreadObj, ["imagesAndVideosObj", "images"], 0);
    let videos = -lodashGet(docThreadObj, ["imagesAndVideosObj", "videos"], 0);

    // ---------------------------------------------
    //   - Comments
    // ---------------------------------------------

    for (let valueObj of recruitmentCommentsArr.values()) {
      if (valueObj.imagesAndVideos_id) {
        imagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }

      images -= lodashGet(valueObj, ["imagesAndVideosObj", "images"], 0);
      videos -= lodashGet(valueObj, ["imagesAndVideosObj", "videos"], 0);
    }

    // ---------------------------------------------
    //   - Replies
    // ---------------------------------------------

    for (let valueObj of recruitmentRepliesArr.values()) {
      if (valueObj.imagesAndVideos_id) {
        imagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }

      images -= lodashGet(valueObj, ["imagesAndVideosObj", "images"], 0);
      videos -= lodashGet(valueObj, ["imagesAndVideosObj", "videos"], 0);
    }

    const returnObj = {
      gameCommunities_id,
      comments,
      replies,
      imagesAndVideos_idsArr,
      images,
      videos,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - findForDelete
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   imagesAndVideos_id: {green ${imagesAndVideos_id}}
    //   editable: {green ${editable} / ${typeof editable}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(docArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docThreadObj -----\n
    //   ${util.inspect(docThreadObj, { colors: true, depth: null })}\n
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
  } catch (err) {
    throw err;
  }
};

/**
 * ???????????????????????????
 * @param {string} _id - DB recruitment-threads _id / ????????????ID
 * @return {Array} ???????????????
 */
const findForNotification = async ({ _id }) => {
  try {
    // --------------------------------------------------
    //   recruitmentThreadsObj / Locale ???
    // --------------------------------------------------

    const recruitmentThreadsObj = await findOne({
      conditionObj: {
        _id,
      },
    });

    // --------------------------------------------------
    //   Locale
    // --------------------------------------------------

    const localeObj = locale({
      acceptLanguage: lodashGet(recruitmentThreadsObj, ["language"], ""),
    });

    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Error Limit
    // --------------------------------------------------

    const errorLimit = parseInt(process.env.WEB_PUSH_ERROR_LIMIT, 10);

    // console.log(chalk`
    //   errorLimit: {green ${errorLimit}}
    // `);

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaRecruitmentThreads.aggregate([
      // --------------------------------------------------
      //   Match Condition
      // --------------------------------------------------

      {
        $match: { _id },
      },

      // --------------------------------------------------
      //   games
      // --------------------------------------------------

      {
        $lookup: {
          from: "games",
          let: { letGameCommunities_id: "$gameCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    { $eq: ["$gameCommunities_id", "$$letGameCommunities_id"] },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   games / images-and-videos / ??????????????????
            // --------------------------------------------------

            {
              $lookup: {
                from: "images-and-videos",
                let: {
                  letImagesAndVideosThumbnail_id:
                    "$imagesAndVideosThumbnail_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$letImagesAndVideosThumbnail_id"],
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
                as: "imagesAndVideosThumbnailObj",
              },
            },

            {
              $unwind: {
                path: "$imagesAndVideosThumbnailObj",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                gameCommunities_id: 1,
                urlID: 1,
                name: 1,
                imagesAndVideosThumbnailObj: 1,
              },
            },
          ],
          as: "gamesObj",
        },
      },

      {
        $unwind: {
          path: "$gamesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   web-pushes
      // --------------------------------------------------

      {
        $lookup: {
          from: "web-pushes",
          let: { letWebPushes_id: "$webPushes_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$letWebPushes_id"] },
                    { $lt: ["$errorCount", errorLimit] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                users_id: 1,
                subscriptionObj: 1,
                sendTodayCount: 1,
              },
            },
          ],
          as: "webPushesObj",
        },
      },

      {
        $unwind: {
          path: "$webPushesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          localesArr: 1,
          gamesObj: 1,
          webPushesObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   Return Object
    // --------------------------------------------------

    const returnObj = {
      _id,
    };

    const docObj = lodashGet(docArr, [0], {});

    // --------------------------------------------------
    //   ????????????????????????????????????????????????
    // --------------------------------------------------

    if (Object.keys(docObj).length === 0) {
      return {};
    }

    // --------------------------------------------------
    //   urlID
    // --------------------------------------------------

    returnObj.urlID = lodashGet(docObj, ["gamesObj", "urlID"], "");

    // --------------------------------------------------
    //   subscriptionObj
    // --------------------------------------------------

    const webPushAvailable = lodashGet(
      recruitmentThreadsObj,
      ["webPushAvailable"],
      false
    );

    if (webPushAvailable) {
      returnObj.webPushes_id = lodashGet(docObj, ["webPushesObj", "_id"], "");
      returnObj.users_id = lodashGet(docObj, ["webPushesObj", "users_id"], "");
      returnObj.subscriptionObj = lodashGet(
        docObj,
        ["webPushesObj", "subscriptionObj"],
        {}
      );
      returnObj.sendTodayCount = lodashGet(
        docObj,
        ["webPushesObj", "sendTodayCount"],
        0
      );
    }

    // --------------------------------------------------
    //   Title
    // --------------------------------------------------

    const filteredArr = docObj.localesArr.filter((filterObj) => {
      return filterObj.language === language;
    });

    if (lodashHas(filteredArr, [0])) {
      returnObj.title = lodashGet(filteredArr, [0, "title"], "");
    } else {
      returnObj.title = lodashGet(docObj, ["localesArr", 0, "title"], "");
    }

    // --------------------------------------------------
    //   Format - ?????????????????????
    // --------------------------------------------------

    const imagesAndVideosThumbnailObj = lodashGet(
      docObj,
      ["gamesObj", "imagesAndVideosThumbnailObj"],
      {}
    );

    const formattedThumbnailObj = formatImagesAndVideosObj({
      localeObj,
      obj: imagesAndVideosThumbnailObj,
    });

    if (Object.keys(formattedThumbnailObj).length !== 0) {
      returnObj.icon = lodashGet(formattedThumbnailObj, ["arr", 0, "src"], "");
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - findForNotification
    // `);

    // console.log(chalk`
    //   _id: {green ${_id}}
    // `);

    // console.log(`
    //   ----- recruitmentThreadsObj -----\n
    //   ${util.inspect(recruitmentThreadsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(docArr, { colors: true, depth: null })}\n
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
  } catch (err) {
    throw err;
  }
};

/**
 * ??????????????????????????? / Twitter?????????
 * @param {string} _id - DB recruitment-threads _id / ????????????ID
 * @return {Array} ???????????????
 */
const findNotificationForTwitter = async ({ _id }) => {
  try {
    // --------------------------------------------------
    //   recruitmentThreadsObj / Locale ???
    // --------------------------------------------------

    const recruitmentThreadsObj = await findOne({
      conditionObj: {
        _id,
      },
    });

    // --------------------------------------------------
    //   Locale
    // --------------------------------------------------

    const localeObj = locale({
      acceptLanguage: lodashGet(recruitmentThreadsObj, ["language"], ""),
    });

    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaRecruitmentThreads.aggregate([
      // --------------------------------------------------
      //   Match Condition
      // --------------------------------------------------

      {
        $match: { _id },
      },

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
      //   games
      // --------------------------------------------------

      {
        $lookup: {
          from: "games",
          let: { letGameCommunities_id: "$gameCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    { $eq: ["$gameCommunities_id", "$$letGameCommunities_id"] },
                  ],
                },
              },
            },

            {
              $project: {
                _id: 1,
                gameCommunities_id: 1,
                urlID: 1,
                name: 1,
                twitterHashtagsArr: 1,
              },
            },
          ],
          as: "gamesObj",
        },
      },

      {
        $unwind: {
          path: "$gamesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          category: 1,
          localesArr: 1,
          gamesObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   docObj
    // --------------------------------------------------

    const docObj = lodashGet(docArr, [0], {});

    // --------------------------------------------------
    //   ????????????????????????????????????????????????
    // --------------------------------------------------

    if (Object.keys(docObj).length === 0) {
      return {};
    }

    // --------------------------------------------------
    //   ???????????????????????????
    // --------------------------------------------------

    const categoryNo = lodashGet(docObj, ["category"], "");
    const title = lodashGet(docObj, ["localesArr", 0, "title"], "");
    let comment = lodashGet(docObj, ["localesArr", 0, "comment"], "");
    const gameUrlID = lodashGet(docObj, ["gamesObj", "urlID"], "");
    const gameName = lodashGet(docObj, ["gamesObj", "name"], "");
    const gameTwitterHashtagsArr = lodashGet(
      docObj,
      ["gamesObj", "twitterHashtagsArr"],
      []
    );

    // ---------------------------------------------
    //   - category
    // ---------------------------------------------

    let category = `[${gameName}]\n`;

    if (categoryNo === 1) {
      category = `[${gameName} / ??????????????????]`;
    } else if (categoryNo === 2) {
      category = `[${gameName} / ??????????????????]`;
    } else if (categoryNo === 3) {
      category = `[${gameName} / ???????????????????????????]`;
    }

    // ---------------------------------------------
    //   - twitter hashtags
    // ---------------------------------------------

    let twitterHashtags = "";

    for (const [index, value] of gameTwitterHashtagsArr.entries()) {
      if (index === 0) {
        twitterHashtags += `#${value}`;
      } else {
        twitterHashtags += ` #${value}`;
      }
    }

    // ---------------------------------------------
    //   - comment
    // ---------------------------------------------

    // URL???22??????????????????????????????
    const length = title.length + category.length + twitterHashtags.length + 22;
    const limit = 130 - length;

    comment = comment.replace(/\r?\n/g, "");

    if (comment.length > limit) {
      comment = comment.substr(0, limit) + "???";
    }

    // ---------------------------------------------
    //   - twitter text
    // ---------------------------------------------

    let twitterText = `${title}\n${comment}`;

    if (twitterHashtags) {
      twitterText += ` ${twitterHashtags}\n`;
    }

    twitterText += `${category}\n`;

    // console.log(chalk`
    //   twitterText.length + 22: {green ${twitterText.length + 22}}
    // `);

    twitterText += `${process.env.NEXT_PUBLIC_URL_BASE}gc/${gameUrlID}/rec/${_id}`;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - findNotificationForTwitter
    // `);

    // console.log(chalk`
    //   _id: {green ${_id}}
    //   twitterText: {green ${twitterText}}
    //   length: {green ${length}}
    //   limit: {green ${limit}}
    // `);

    // console.log(`
    //   ----- docObj -----\n
    //   ${util.inspect(docObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return twitterText;
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Transaction
// --------------------------------------------------

/**
 * Transaction ?????? / ????????????
 *
 * @param {Object} recruitmentThreadsConditionObj - DB recruitment-threads ????????????
 * @param {Object} recruitmentThreadsSaveObj - DB recruitment-threads ???????????????
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos ????????????
 * @param {Object} imagesAndVideosSaveObj - DB images-and-videos ???????????????
 * @param {Object} gameCommunitiesConditionObj - DB game-communities ????????????
 * @param {Object} gameCommunitiesSaveObj - DB game-communities ???????????????
 * @param {Object} webPushesConditionObj - DB web-pushes ????????????
 * @param {Object} webPushesSaveObj - DB web-pushes ???????????????
 * @param {Object} usersConditionObj - DB users ????????????
 * @param {Object} usersSaveObj - DB users ???????????????
 * @param {Object} notificationsConditionObj - DB notifications ????????????
 * @param {Object} notificationsSaveObj - DB notifications ???????????????
 * @return {Object}
 */
const transactionForUpsert = async ({
  recruitmentThreadsConditionObj,
  recruitmentThreadsSaveObj,
  imagesAndVideosConditionObj = {},
  imagesAndVideosSaveObj = {},
  gameCommunitiesConditionObj = {},
  gameCommunitiesSaveObj = {},
  webPushesConditionObj = {},
  webPushesSaveObj = {},
  usersConditionObj = {},
  usersSaveObj = {},
  notificationsConditionObj = {},
  notificationsSaveObj = {},
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaRecruitmentThreads.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // ---------------------------------------------
    //   - recruitment-threads
    // ---------------------------------------------

    await SchemaRecruitmentThreads.updateOne(
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
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
    //   - web-pushes
    // ---------------------------------------------

    if (
      Object.keys(webPushesConditionObj).length !== 0 &&
      Object.keys(webPushesSaveObj).length !== 0
    ) {
      await SchemaWebPushes.updateOne(webPushesConditionObj, webPushesSaveObj, {
        session,
        upsert: true,
      });
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

    // ---------------------------------------------
    //   - notifications
    // ---------------------------------------------

    if (
      Object.keys(notificationsConditionObj).length !== 0 &&
      Object.keys(notificationsSaveObj).length !== 0
    ) {
      await SchemaNotifications.updateOne(
        notificationsConditionObj,
        notificationsSaveObj,
        { session, upsert: true }
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
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - transactionForUpsert
    // `);

    // console.log(`
    //   ----- recruitmentThreadsConditionObj -----\n
    //   ${util.inspect(recruitmentThreadsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentThreadsSaveObj -----\n
    //   ${util.inspect(recruitmentThreadsSaveObj, { colors: true, depth: null })}\n
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
    //   ----- webPushesConditionObj -----\n
    //   ${util.inspect(webPushesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- webPushesSaveObj -----\n
    //   ${util.inspect(webPushesSaveObj, { colors: true, depth: null })}\n
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
    // console.log('--------??????????????????-----------');

    session.endSession();

    throw errorObj;
  }
};

/**
 * Transaction ???????????????????????????
 * @param {Object} recruitmentThreadsConditionObj - DB recruitment-threads ????????????
 * @param {Object} recruitmentCommentsConditionObj - DB recruitment-comments ????????????
 * @param {Object} recruitmentRepliesConditionObj - DB recruitment-replies ????????????
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos ????????????
 * @param {Object} gameCommunitiesConditionObj - DB game-communities ????????????
 * @param {Object} gameCommunitiesSaveObj - DB game-communities ???????????????
 * @return {Object}
 */
const transactionForDelete = async ({
  recruitmentThreadsConditionObj,
  recruitmentCommentsConditionObj,
  recruitmentRepliesConditionObj,
  imagesAndVideosConditionObj = {},
  gameCommunitiesConditionObj = {},
  gameCommunitiesSaveObj = {},
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaRecruitmentThreads.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // ---------------------------------------------
    //   - recruitment-threads / updateOne
    // ---------------------------------------------

    await SchemaRecruitmentThreads.deleteOne(recruitmentThreadsConditionObj, {
      session,
    });

    // ---------------------------------------------
    //   - recruitment-comments / deleteMany
    // ---------------------------------------------

    await SchemaRecruitmentComments.deleteMany(
      recruitmentCommentsConditionObj,
      { session }
    );

    // --------------------------------------------------
    //   - recruitment-replies / deleteMany
    // --------------------------------------------------

    await SchemaRecruitmentReplies.deleteMany(recruitmentRepliesConditionObj, {
      session,
    });

    // ---------------------------------------------
    //   - images-and-videos / deleteMany
    // ---------------------------------------------

    if (Object.keys(imagesAndVideosConditionObj).length !== 0) {
      await SchemaImagesAndVideos.deleteMany(imagesAndVideosConditionObj, {
        session,
      });
    }

    // ---------------------------------------------
    //   - game-communities / updateOne
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
    //   ----------------------------------------\n
    //   /app/@database/recruitment-threads/model.js - transactionForDelete
    // `);

    // console.log(`
    //   ----- recruitmentThreadsConditionObj -----\n
    //   ${util.inspect(recruitmentThreadsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentCommentsConditionObj -----\n
    //   ${util.inspect(recruitmentCommentsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentRepliesConditionObj -----\n
    //   ${util.inspect(recruitmentRepliesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosConditionObj -----\n
    //   ${util.inspect(imagesAndVideosConditionObj, { colors: true, depth: null })}\n
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

  findRecruitmentCommon,
  findRecruitments,
  findRecruitmentByRecruitmentID,
  findRecruitmentsForSearch,
  findOneForEdit,
  findForDelete,
  findForNotification,
  findNotificationForTwitter,

  transactionForUpsert,
  transactionForDelete,
};

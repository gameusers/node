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

const SchemaRecruitmentReplies = require("./schema.js");

const SchemaRecruitmentThreads = require("../recruitment-threads/schema.js");
const SchemaRecruitmentComments = require("../recruitment-comments/schema.js");
const SchemaImagesAndVideos = require("../images-and-videos/schema.js");
const SchemaGameCommunities = require("../game-communities/schema.js");
const SchemaNotifications = require("../notifications/schema.js");

const ModelRecruitmentComments = require("../../@database/recruitment-comments/model.js");

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

const { formatRecruitmentRepliesArr } = require("./format.js");

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

    return await SchemaRecruitmentReplies.findOne(conditionObj).exec();
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

    return await SchemaRecruitmentReplies.find(conditionObj).exec();
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

    return await SchemaRecruitmentReplies.countDocuments(conditionObj).exec();
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

    return await SchemaRecruitmentReplies.findOneAndUpdate(
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

    return await SchemaRecruitmentReplies.insertMany(saveArr);
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

    return await SchemaRecruitmentReplies.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * ?????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ???????????????????????????ID
 * @param {Array} recruitmentComments_idsArr - DB recruitment-comments _id / ?????????????????????ID??????????????????
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Array} ???????????????
 */
const findReplies = async ({
  req,
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  recruitmentComments_idsArr,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Replies ???????????????
    //   $in, sort, limit ????????????????????????????????????????????????????????????????????? limit ??????????????????????????????
    //   ???????????????????????????????????????????????????????????????????????????????????????????????????
    //   ???????????? for ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // --------------------------------------------------

    let resultArr = [];

    // --------------------------------------------------
    //   Parse
    // --------------------------------------------------

    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);

    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Loop
    // --------------------------------------------------

    for (let recruitmentComments_id of recruitmentComments_idsArr.values()) {
      // --------------------------------------------------
      //   Aggregation
      // --------------------------------------------------

      const docArr = await SchemaRecruitmentReplies.aggregate([
        // --------------------------------------------------
        //   Match
        // --------------------------------------------------

        {
          $match: {
            recruitmentComments_id,
          },
        },

        // --------------------------------------------------
        //   $sort / $skip / $limit
        // --------------------------------------------------

        { $sort: { createdDate: 1 } },
        { $skip: (replyPage - 1) * intReplyLimit },
        { $limit: intReplyLimit },

        // --------------------------------------------------
        //   recruitment-comments / replies ?????????
        // --------------------------------------------------

        {
          $lookup: {
            from: "recruitment-comments",
            let: { letRecruitmentComments_id: "$recruitmentComments_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$letRecruitmentComments_id"],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  replies: 1,
                },
              },
            ],
            as: "recruitmentCommentsObj",
          },
        },

        {
          $unwind: {
            path: "$recruitmentCommentsObj",
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
        //   users / ????????????????????????????????????????????????????????????????????????ID??????
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
        //   recruitment-replies / recruitment-replies - replyTo ?????????????????????
        // --------------------------------------------------

        {
          $lookup: {
            from: "recruitment-replies",
            let: {
              letReplyToRecruitmentReplies_id: "$replyToRecruitmentReplies_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$letReplyToRecruitmentReplies_id"],
                  },
                },
              },

              // --------------------------------------------------
              //   recruitment-replies / recruitment-replies / card-players - ?????????????????????????????????????????????
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

                    {
                      $project: {
                        name: 1,
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

              {
                $project: {
                  _id: 0,
                  localesArr: 1,
                  cardPlayersObj: 1,
                },
              },
            ],
            as: "replyToObj",
          },
        },

        {
          $unwind: {
            path: "$replyToObj",
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

      // console.log(chalk`
      //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
      // `);

      // console.log(`
      //   ----- docArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   ?????????????????????
      // --------------------------------------------------

      if (docArr.length > 0) {
        resultArr = resultArr.concat(docArr);
      }
    }

    // --------------------------------------------------
    //   Format - Reply
    // --------------------------------------------------

    const recruitmentRepliesObj = formatRecruitmentRepliesArr({
      req,
      localeObj,
      loginUsers_id,
      arr: resultArr,
      replyPage,
      ISO8601: moment().utc().toISOString(),
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-replies/model.js - findRecruitments
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(`
    //   ----- recruitmentComments_idsArr -----\n
    //   ${util.inspect(recruitmentComments_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- resultArr -----\n
    //   ${util.inspect(resultArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentRepliesObj -----\n
    //   ${util.inspect(recruitmentRepliesObj, { colors: true, depth: null })}\n
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

    return recruitmentRepliesObj;
  } catch (err) {
    throw err;
  }
};

/**
 * ????????????????????? / ??????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} gameCommunities_id - DB game-communities _id / ???????????????????????????ID
 * @param {string} recruitmentThreads_id - DB recruitment-threads _id / ????????????ID
 * @param {string} recruitmentComments_id - DB recruitment-comments _id / ????????????ID
 * @param {string} recruitmentReplies_id - DB recruitment-replies _id / ??????ID
 * @param {number} commentPage - ????????????????????????
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyPage - ??????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Object} ???????????????
 */
const findRepliesForUpsert = async ({
  req,
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  recruitmentThreads_id,
  recruitmentComments_id,
  recruitmentReplies_id,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    let replyPage = 1;

    // --------------------------------------------------
    //   ??????
    //   ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    //   ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
    //   ???????????????????????????????????????
    //   limit ??????????????????????????????????????????
    // --------------------------------------------------

    if (recruitmentReplies_id) {
      // --------------------------------------------------
      //   Aggregation
      // --------------------------------------------------

      const docRecruitmentRepliesArr = await SchemaRecruitmentReplies.aggregate(
        [
          // --------------------------------------------------
          //   Match
          // --------------------------------------------------

          {
            $match: {
              gameCommunities_id,
              recruitmentThreads_id,
              recruitmentComments_id,
            },
          },

          { $sort: { createdDate: 1 } },

          {
            $project: {
              _id: 1,
            },
          },
        ]
      ).exec();

      const index = docRecruitmentRepliesArr.findIndex((valueObj) => {
        return valueObj._id === recruitmentReplies_id;
      });

      // const replies = docRecruitmentRepliesArr.length;
      replyPage = Math.ceil((index + 1) / replyLimit);

      // console.log(`
      //   ----------------------------------------\n
      //   Update
      // `);

      // console.log(`
      //   ----- docRecruitmentRepliesArr -----\n
      //   ${util.inspect(docRecruitmentRepliesArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(chalk`
      //   index: {green ${index}}
      //   replies: {green ${replies}}
      // `);

      // --------------------------------------------------
      //   ????????????
      //   ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      //   ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      //   ??????????????????????????????????????????????????????
      //   limit ?????????????????????????????????????????????
      // --------------------------------------------------
    } else {
      const docRecruitmentCommentsObj = await ModelRecruitmentComments.findOne({
        conditionObj: {
          _id: recruitmentComments_id,
          gameCommunities_id,
          recruitmentThreads_id,
        },
      });

      const replies = lodashGet(docRecruitmentCommentsObj, ["replies"], 1);
      replyPage = replies ? Math.ceil(replies / replyLimit) : 1;

      // console.log(`
      //   ----------------------------------------\n
      //   Insert
      // `);

      // console.log(`
      //   ----- docRecruitmentCommentsObj -----\n
      //   ${util.inspect(docRecruitmentCommentsObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(chalk`
      //   replies: {green ${replies}}
      //   replyPage: {green ${replyPage}}
      // `);
    }

    // --------------------------------------------------
    //   findReplies
    // --------------------------------------------------

    const recruitmentRepliesObj = await findReplies({
      req,
      localeObj,
      loginUsers_id,
      gameCommunities_id,
      recruitmentComments_idsArr: [recruitmentComments_id],
      commentPage: 1,
      commentLimit,
      replyPage,
      replyLimit,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-replies/model.js - findRepliesForUpsert
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   recruitmentReplies_id: {green ${recruitmentReplies_id}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
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
  } catch (err) {
    throw err;
  }
};

/**
 * ????????????????????????????????????????????????????????????
 * @param {Object} req - ???????????????
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} recruitmentReplies_id - DB recruitment-replies _id / ??????ID
 * @param {string} type - ?????????????????? edit / delete
 * @return {Array} ???????????????
 */
const findOneForEdit = async ({
  req,
  localeObj,
  loginUsers_id,
  recruitmentReplies_id,
  type = "edit",
}) => {
  try {
    // --------------------------------------------------
    //   Find
    // --------------------------------------------------

    const docRecruitmentRepliesArr = await SchemaRecruitmentReplies.aggregate([
      // --------------------------------------------------
      //   Match
      // --------------------------------------------------

      {
        $match: { _id: recruitmentReplies_id },
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
      //   recruitment-threads
      // --------------------------------------------------

      {
        $lookup: {
          from: "recruitment-threads",
          let: { letRecruitmentThreads_id: "$recruitmentThreads_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$letRecruitmentThreads_id"],
                },
              },
            },
            {
              $project: {
                createdDate: 1,
                users_id: 1,
              },
            },
          ],
          as: "recruitmentThreadsObj",
        },
      },

      {
        $unwind: {
          path: "$recruitmentThreadsObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          // createdDate: 0,
          imagesAndVideos_id: 0,
          ip: 0,
          userAgent: 0,
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   ????????????????????????????????????
    // --------------------------------------------------

    if (docRecruitmentRepliesArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "_gR81wvbv", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = lodashGet(docRecruitmentRepliesArr, [0], {});

    //   console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   ??????????????????????????????????????????
    // --------------------------------------------------

    let editable = false;

    // ???????????????????????????????????????
    editable = verifyAuthority({
      req,
      users_id: lodashGet(returnObj, ["users_id"], ""),
      loginUsers_id,
      ISO8601: lodashGet(returnObj, ["createdDate"], ""),
      _id: lodashGet(returnObj, ["_id"], ""),
    });

    // ???????????????????????????????????????
    if (type === "delete" && !editable) {
      editable = verifyAuthority({
        req,
        users_id: lodashGet(
          returnObj,
          ["recruitmentThreadsObj", "users_id"],
          ""
        ),
        loginUsers_id,
        ISO8601: lodashGet(
          returnObj,
          ["recruitmentThreadsObj", "createdDate"],
          ""
        ),
        _id: lodashGet(returnObj, ["recruitmentThreadsObj", "_id"], ""),
      });
    }

    if (!editable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "_IC6Tou9F", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-comments/model.js - findOneForEdit
    // `);

    // console.log(chalk`
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   editable: {green ${editable} / ${typeof editable}}
    // `);

    // console.log(`
    //   ----- docRecruitmentRepliesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docRecruitmentRepliesArr)), { colors: true, depth: null })}\n
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
 * ?????????????????????????????????????????????????????? / ?????????????????????????????????????????????????????????https://dev-1.gameusers.org/gc/Dead-by-Daylight/rec/bq215vgzyr
 * @param {string} recruitmentThreads_id - DB recruitment-threads _id / ????????????ID
 * @param {string} recruitmentComments_id - DB recruitment-comments _id / ????????????ID
 * @param {string} recruitmentReplies_id - DB recruitment-replies _id / ??????ID
 * @param {number} commentLimit - ???????????????????????????
 * @param {number} replyLimit - ?????????????????????
 * @return {Object} ???????????????
 */
const getPage = async ({
  recruitmentThreads_id,
  recruitmentComments_id,
  recruitmentReplies_id,
  commentLimit,
  replyLimit,
}) => {
  try {
    // ------------------------------------------------------------
    //   ???????????? _id ????????????????????????
    // ------------------------------------------------------------

    const recruitmentComments_idsArr = await SchemaRecruitmentComments.aggregate(
      [
        {
          $match: {
            recruitmentThreads_id,
          },
        },

        { $sort: { updatedDate: -1 } },

        {
          $project: {
            _id: 1,
          },
        },
      ]
    ).exec();

    // --------------------------------------------------
    //   ?????????????????????????????????????????????
    // --------------------------------------------------

    const commentIndex = recruitmentComments_idsArr.findIndex((valueObj) => {
      return valueObj._id === recruitmentComments_id;
    });

    const commentPage = Math.ceil((commentIndex + 1) / commentLimit);
    // let commentPage = Math.ceil(commentIndex / commentLimit) + 1;

    // if (commentPage === 0) {

    //   commentPage = 1;

    // }

    // ------------------------------------------------------------
    //   ?????? _id ????????????????????????
    // ------------------------------------------------------------

    const recruitmentReplies_idsArr = await SchemaRecruitmentReplies.aggregate([
      {
        $match: {
          recruitmentComments_id,
        },
      },

      { $sort: { createdDate: 1 } },

      {
        $project: {
          _id: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   ???????????????????????????????????????
    // --------------------------------------------------

    const replyIndex = recruitmentReplies_idsArr.findIndex((valueObj) => {
      return valueObj._id === recruitmentReplies_id;
    });

    const replyPage = Math.ceil((replyIndex + 1) / replyLimit);
    // let replyPage = Math.ceil(replyIndex / replyLimit) + 1;

    // if (replyPage === 0) {

    //   replyPage = 1;

    // }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----- recruitmentComments_idsArr -----\n
    //   ${util.inspect(recruitmentComments_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   commentIndex: {green ${commentIndex}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    // `);

    // console.log(`
    //   ----- recruitmentReplies_idsArr -----\n
    //   ${util.inspect(recruitmentReplies_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   recruitmentReplies_id: {green ${recruitmentReplies_id}}
    //   replyIndex: {green ${replyIndex}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return {
      commentPage,
      replyPage,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * ???????????????????????????
 * @param {string} _id - DB recruitment-comments _id / ????????????ID
 * @return {Array} ???????????????
 */
const findForNotification = async ({ _id }) => {
  try {
    // --------------------------------------------------
    //   recruitmentRepliesObj / Locale ???
    // --------------------------------------------------

    const recruitmentRepliesObj = await findOne({
      conditionObj: {
        _id,
      },
    });

    // --------------------------------------------------
    //   Locale
    // --------------------------------------------------

    const localeObj = locale({
      acceptLanguage: lodashGet(recruitmentRepliesObj, ["language"], ""),
    });

    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaRecruitmentReplies.aggregate([
      // --------------------------------------------------
      //   Match Condition
      // --------------------------------------------------

      {
        $match: { _id },
      },

      {
        $project: {
          localesArr: 1,
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
    //   webPushSubscriptionObj
    // --------------------------------------------------

    // if (docObj.webPush) {

    //   returnObj.webPushSubscriptionObj = lodashGet(docObj, ['webPushSubscriptionObj'], {});

    //   if (lodashHas(docObj, ['usersObj', 'webPushSubscriptionObj'])) {
    //     returnObj.webPushSubscriptionObj = lodashGet(docObj, ['usersObj', 'webPushSubscriptionObj'], {});
    //   }

    // }

    // --------------------------------------------------
    //   Comment
    // --------------------------------------------------

    const filteredArr = docObj.localesArr.filter((filterObj) => {
      return filterObj.language === language;
    });

    if (lodashHas(filteredArr, [0])) {
      returnObj.comment = lodashGet(filteredArr, [0, "comment"], "");
    } else {
      returnObj.comment = lodashGet(docObj, ["localesArr", 0, "comment"], "");
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-replies/model.js - findForNotification
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

// --------------------------------------------------
//   Transaction
// --------------------------------------------------

/**
 * Transaction ?????? / ????????????
 *
 * @param {Object} recruitmentThreadsConditionObj - DB recruitment-threads ????????????
 * @param {Object} recruitmentThreadsSaveObj - DB recruitment-threads ???????????????
 * @param {Object} recruitmentCommentsConditionObj - DB recruitment-comments ????????????
 * @param {Object} recruitmentCommentsSaveObj - DB recruitment-comments ???????????????
 * @param {Object} recruitmentRepliesConditionObj - DB recruitment-replies ????????????
 * @param {Object} recruitmentRepliesSaveObj - DB recruitment-replies ???????????????
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos ????????????
 * @param {Object} imagesAndVideosSaveObj - DB images-and-videos ???????????????
 * @param {Object} gameCommunitiesConditionObj - DB game-communities ????????????
 * @param {Object} gameCommunitiesSaveObj - DB game-communities ???????????????
 * @param {Object} notificationsConditionObj - DB notifications ????????????
 * @param {Object} notificationsSaveObj - DB notifications ???????????????
 * @return {Object}
 */
const transactionForUpsert = async ({
  recruitmentThreadsConditionObj,
  recruitmentThreadsSaveObj,
  recruitmentCommentsConditionObj,
  recruitmentCommentsSaveObj,
  recruitmentRepliesConditionObj,
  recruitmentRepliesSaveObj,
  imagesAndVideosConditionObj = {},
  imagesAndVideosSaveObj = {},
  gameCommunitiesConditionObj = {},
  gameCommunitiesSaveObj = {},
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

  const session = await SchemaRecruitmentReplies.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // ---------------------------------------------
    //   - recruitment-replies
    // ---------------------------------------------

    await SchemaRecruitmentReplies.updateOne(
      recruitmentRepliesConditionObj,
      recruitmentRepliesSaveObj,
      { session, upsert: true }
    );

    // ---------------------------------------------
    //   - recruitment-comments
    // ---------------------------------------------

    await SchemaRecruitmentComments.updateOne(
      recruitmentCommentsConditionObj,
      recruitmentCommentsSaveObj,
      { session }
    );

    // ---------------------------------------------
    //   - recruitment-threads
    // ---------------------------------------------

    await SchemaRecruitmentThreads.updateOne(
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
      { session }
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
    //   /app/@database/recruitment-replies/model.js - transactionForUpsert
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
    //   ----- notificationsConditionObj -----\n
    //   ${util.inspect(notificationsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- notificationsSaveObj -----\n
    //   ${util.inspect(notificationsSaveObj, { colors: true, depth: null })}\n
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
 * Transaction ?????????????????????
 * ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
 *
 * @param {Object} recruitmentThreadsConditionObj - DB recruitment-threads ????????????
 * @param {Object} recruitmentThreadsSaveObj - DB recruitment-threads ???????????????
 * @param {Object} recruitmentCommentsConditionObj - DB recruitment-comments ????????????
 * @param {Object} recruitmentCommentsSaveObj - DB recruitment-comments ???????????????
 * @param {Object} recruitmentRepliesConditionObj - DB recruitment-replies ????????????
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos ????????????
 * @param {Object} gameCommunitiesConditionObj - DB game-communities ????????????
 * @param {Object} gameCommunitiesSaveObj - DB game-communities ???????????????
 * @return {Object}
 */
const transactionForDelete = async ({
  recruitmentThreadsConditionObj,
  recruitmentThreadsSaveObj,
  recruitmentCommentsConditionObj,
  recruitmentCommentsSaveObj,
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

  const session = await SchemaRecruitmentReplies.startSession();

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

    await SchemaRecruitmentThreads.updateOne(
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
      { session }
    );

    // ---------------------------------------------
    //   - recruitment-comments / updateOne
    // ---------------------------------------------

    await SchemaRecruitmentComments.updateOne(
      recruitmentCommentsConditionObj,
      recruitmentCommentsSaveObj,
      { session }
    );

    // --------------------------------------------------
    //   - recruitment-replies / deleteOne
    // --------------------------------------------------

    await SchemaRecruitmentReplies.deleteOne(recruitmentRepliesConditionObj, {
      session,
    });

    // ---------------------------------------------
    //   - images-and-videos / deleteOne
    // ---------------------------------------------

    if (Object.keys(imagesAndVideosConditionObj).length !== 0) {
      await SchemaImagesAndVideos.deleteOne(imagesAndVideosConditionObj, {
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
    //   /app/@database/recruitment-replies/model.js - transactionForDelete
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

  findReplies,
  findRepliesForUpsert,
  findOneForEdit,
  getPage,
  findForNotification,

  transactionForUpsert,
  transactionForDelete,
};

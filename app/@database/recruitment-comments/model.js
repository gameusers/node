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

const SchemaRecruitmentComments = require("./schema.js");

const SchemaRecruitmentThreads = require("../recruitment-threads/schema.js");
const SchemaRecruitmentReplies = require("../recruitment-replies/schema.js");
const SchemaImagesAndVideos = require("../images-and-videos/schema.js");
const SchemaGameCommunities = require("../game-communities/schema.js");
const SchemaWebPushes = require("../web-pushes/schema.js");
const SchemaUsers = require("../users/schema.js");
const SchemaNotifications = require("../notifications/schema.js");

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

const { formatRecruitmentCommentsAndRepliesArr } = require("./format.js");

// --------------------------------------------------
//   Common
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

    return await SchemaRecruitmentComments.findOne(conditionObj).exec();
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

    return await SchemaRecruitmentComments.find(conditionObj).exec();
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

    return await SchemaRecruitmentComments.countDocuments(conditionObj).exec();
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

    return await SchemaRecruitmentComments.findOneAndUpdate(
      conditionObj,
      saveObj,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
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

    return await SchemaRecruitmentComments.insertMany(saveArr);
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

    return await SchemaRecruitmentComments.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   find
// --------------------------------------------------

/**
 * コメントと返信を取得する - recruitmentThreads_idsArr で検索
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} recruitmentThreads_idsArr - DB recruitment-threads _id / _idが入っている配列
 * @param {Object} recruitmentThreadsObj - スレッド情報の入ったオブジェクト / カウントの取得に使う
 * @param {number} commentPage - コメントのページ
 * @param {number} commentLimit - コメントのリミット
 * @param {number} replyPage - 返信のページ
 * @param {number} replyLimit - 返信のリミット
 * @return {Array} 取得データ
 */
const findCommentsAndReplies = async ({
  req,
  localeObj,
  loginUsers_id,
  recruitmentThreads_idsArr,
  recruitmentThreadsObj,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Forum Comments & Replies データ取得
    //   $in, sort, limit を使って最新のコメントを取得すると、古いコメントが limit で削られてしまうため
    //   あるスレッドでは古いコメントが表示されないという事態になってしまう
    //   そのため for のループで検索している　ただ良くない書き方だと思うので可能なら改善した方がいい
    // --------------------------------------------------

    let resultArr = [];

    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   parseInt
    // --------------------------------------------------

    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);
    const webPushErrorLimit = parseInt(process.env.WEB_PUSH_ERROR_LIMIT, 10);

    // const obj = await count({
    //   conditionObj: {
    //     recruitmentThreads_id: 'WrHXI4EtIuYY'
    //   }
    // });

    // const commentsArr = await SchemaRecruitmentComments.aggregate([

    //   {
    //     $match: {
    //       recruitmentThreads_id: 'WrHXI4EtIuYY'
    //     },
    //   },

    // ]);

    // const repliesArr = await SchemaRecruitmentReplies.aggregate([

    //   {
    //     $match: {
    //       recruitmentThreads_id: 'WrHXI4EtIuYY'
    //     },
    //   },

    // ]);

    // console.log(`
    //   ----- commentsArr -----\n
    //   ${util.inspect(commentsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- repliesArr -----\n
    //   ${util.inspect(repliesArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    // commentsArr.length: {green ${commentsArr.length}}
    // repliesArr.length: {green ${repliesArr.length}}
    // `);

    // --------------------------------------------------
    //   Loop
    // --------------------------------------------------

    for (let recruitmentThreads_id of recruitmentThreads_idsArr.values()) {
      const docArr = await SchemaRecruitmentComments.aggregate([
        // --------------------------------------------------
        //   コメント
        // --------------------------------------------------

        // --------------------------------------------------
        //   Match
        // --------------------------------------------------

        {
          $match: {
            recruitmentThreads_id,
          },
        },

        // --------------------------------------------------
        //   $sort / $skip / $limit
        // --------------------------------------------------

        { $sort: { updatedDate: -1 } },
        { $skip: (commentPage - 1) * intCommentLimit },
        { $limit: intCommentLimit },

        // --------------------------------------------------
        //   card-players - 名前＆ステータス＆サムネイル用
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
              //   card-players / images-and-videos - サムネイル画像
              // --------------------------------------------------

              {
                $lookup: {
                  from: "images-and-videos",
                  let: {
                    letCardPlayersImagesAndVideosThumbnail_id:
                      "$imagesAndVideosThumbnail_id",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: [
                            "$_id",
                            "$$letCardPlayersImagesAndVideosThumbnail_id",
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
                      { $lt: ["$errorCount", webPushErrorLimit] },
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
        //   images-and-videos - 画像
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
        //   ids
        // --------------------------------------------------

        {
          $lookup: {
            from: "ids",
            let: {
              letUsers_id: "$users_id",
              letIDs_idArr: "$ids_idsArr",
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
                    //   ids / games / images-and-videos / サムネイル用
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
                                $eq: [
                                  "$_id",
                                  "$$letImagesAndVideosThumbnail_id",
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

        {
          $project: {
            imagesAndVideos_id: 0,
            __v: 0,
          },
        },

        // --------------------------------------------------
        //   返信
        // --------------------------------------------------

        {
          $lookup: {
            from: "recruitment-replies",
            let: { let_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$recruitmentComments_id", "$$let_id"],
                  },
                },
              },

              // --------------------------------------------------
              //   $sort / $skip / $limit
              // --------------------------------------------------

              { $sort: { createdDate: 1 } },
              { $skip: (replyPage - 1) * intReplyLimit },
              { $limit: intReplyLimit },

              // --------------------------------------------------
              //   recruitment-replies / card-players - 名前＆ステータス＆サムネイル用
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
                    //   recruitment-replies / card-players / images-and-videos - サムネイル画像
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
                                $eq: [
                                  "$_id",
                                  "$$letImagesAndVideosThumbnail_id",
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
              //   recruitment-replies / users - アクセス日時＆経験値＆プレイヤーID用
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
                        webPushSubscriptionObj: 1,
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
              //   recruitment-replies / images-and-videos - メイン画像
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
              //   recruitment-replies / recruitment-replies - replyTo 用のデータ取得
              // --------------------------------------------------

              {
                $lookup: {
                  from: "recruitment-replies",
                  let: {
                    letReplyToRecruitmentReplies_id:
                      "$replyToRecruitmentReplies_id",
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
                    //   recruitment-replies / recruitment-replies / card-players - 名前＆ステータス＆サムネイル用
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

              {
                $project: {
                  imagesAndVideos_id: 0,
                  __v: 0,
                },
              },
            ],
            as: "recruitmentRepliesArr",
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

      // console.log(chalk`
      //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
      //   docArr.length: {green ${docArr.length}}
      // `);

      // console.log(`
      //   ----- docArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   配列を結合する
      // --------------------------------------------------

      if (docArr.length > 0) {
        resultArr = resultArr.concat(docArr);
      }
    }

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const formattedObj = formatRecruitmentCommentsAndRepliesArr({
      req,
      localeObj,
      loginUsers_id,
      arr: resultArr,
      recruitmentThreadsObj,
      commentPage,
      commentLimit: intCommentLimit,
      replyPage,
      replyLimit: intReplyLimit,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-comments/model.js - findCommentsAndReplies
    // `);

    // console.log(`
    //   ----- localeObj -----\n
    //   ${util.inspect(localeObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentThreads_idsArr -----\n
    //   ${util.inspect(recruitmentThreads_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentThreadsObj -----\n
    //   ${util.inspect(recruitmentThreadsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(`
    //   ----- resultArr -----\n
    //   ${util.inspect(resultArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- formattedObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(formattedObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return formattedObj;
  } catch (err) {
    throw err;
  }
};

/**
 * 編集用データを取得する（権限もチェック）
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} recruitmentComments_id - DB recruitment-comments _id / スレッドID
 * @return {Array} 取得データ
 */
const findOneForEdit = async ({
  req,
  localeObj,
  loginUsers_id,
  recruitmentComments_id,
}) => {
  try {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Find
    // --------------------------------------------------

    const docRecruitmentCommentsArr = await SchemaRecruitmentComments.aggregate(
      [
        // --------------------------------------------------
        //   Match
        // --------------------------------------------------

        {
          $match: { _id: recruitmentComments_id },
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
        //   ids
        // --------------------------------------------------

        {
          $lookup: {
            from: "ids",
            let: {
              letUsers_id: "$users_id",
              letIDs_idArr: "$ids_idsArr",
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
                    //   ids / games / images-and-videos / サムネイル用
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
                                $eq: [
                                  "$_id",
                                  "$$letImagesAndVideosThumbnail_id",
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
        //   $project
        // --------------------------------------------------

        {
          $project: {
            createdDate: 0,
            imagesAndVideos_id: 0,
            ids_idsArr: 0,
            webPushSubscriptionObj: 0,
            ip: 0,
            userAgent: 0,
            __v: 0,
          },
        },
      ]
    ).exec();

    // --------------------------------------------------
    //   配列が空の場合は処理停止
    // --------------------------------------------------

    if (docRecruitmentCommentsArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "T-kp_548w", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   編集権限がない場合は処理停止
    // --------------------------------------------------

    const editable = verifyAuthority({
      req,
      users_id: lodashGet(docRecruitmentCommentsArr, [0, "users_id"], ""),
      loginUsers_id,
      ISO8601: lodashGet(docRecruitmentCommentsArr, [0, "createdDate"], ""),
      _id: lodashGet(docRecruitmentCommentsArr, [0, "_id"], ""),
    });

    if (!editable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "qWgemV6ra", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const formattedObj = docRecruitmentCommentsArr[0];

    // --------------------------------------------------
    //   非ログイン時のID
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
    //   情報
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
    //   不要なデータを削除
    // --------------------------------------------------

    delete returnObj.publicIDsArr;
    delete returnObj.publicInformationsArr;

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
    //   ----- docRecruitmentCommentsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docRecruitmentCommentsArr)), { colors: true, depth: null })}\n
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
 * 削除用データを取得する（権限もチェック）
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} recruitmentComments_id - DB recruitment-comments _id / スレッドID
 * @param {string} type - 編集か削除か edit / delete
 * @return {Array} 取得データ
 */
const findForDelete = async ({
  req,
  localeObj,
  loginUsers_id,
  recruitmentComments_id,
  type = "edit",
}) => {
  try {
    // --------------------------------------------------
    //   Aggregate
    // --------------------------------------------------

    const docArr = await SchemaRecruitmentComments.aggregate([
      // --------------------------------------------------
      //   Match
      // --------------------------------------------------

      {
        $match: { _id: recruitmentComments_id },
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
      //   返信
      // --------------------------------------------------

      {
        $lookup: {
          from: "recruitment-replies",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$recruitmentComments_id", "$$let_id"],
                },
              },
            },

            // --------------------------------------------------
            //   recruitment-replies / images-and-videos - メイン画像
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
          _id: 1,
          createdDate: 1,
          gameCommunities_id: 1,
          recruitmentThreads_id: 1,
          users_id: 1,
          imagesAndVideos_id: 1,
          imagesAndVideosObj: 1,
          recruitmentRepliesArr: 1,
          recruitmentThreadsObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   配列が空の場合は処理停止
    // --------------------------------------------------

    if (docArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "I9zrbWcOD", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const docCommentObj = lodashGet(docArr, [0], {});
    const recruitmentRepliesArr = lodashGet(
      docCommentObj,
      ["recruitmentRepliesArr"],
      []
    );
    const users_id = lodashGet(docCommentObj, ["users_id"], "");
    const gameCommunities_id = lodashGet(
      docCommentObj,
      ["gameCommunities_id"],
      ""
    );
    const recruitmentThreads_id = lodashGet(
      docCommentObj,
      ["recruitmentThreads_id"],
      ""
    );
    //   console.log(`
    //   ----- docCommentObj -----\n
    //   ${util.inspect(docCommentObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
    // --------------------------------------------------
    //   編集権限がない場合は処理停止
    // --------------------------------------------------

    let editable = false;

    // 投稿した本人の権限チェック
    editable = verifyAuthority({
      req,
      users_id: lodashGet(docCommentObj, ["users_id"], ""),
      loginUsers_id,
      ISO8601: lodashGet(docCommentObj, ["createdDate"], ""),
      _id: lodashGet(docCommentObj, ["_id"], ""),
    });

    // 募集の投稿者が削除する場合
    if (type === "delete" && !editable) {
      editable = verifyAuthority({
        req,
        users_id: lodashGet(
          docCommentObj,
          ["recruitmentThreadsObj", "users_id"],
          ""
        ),
        loginUsers_id,
        ISO8601: lodashGet(
          docCommentObj,
          ["recruitmentThreadsObj", "createdDate"],
          ""
        ),
        _id: lodashGet(docCommentObj, ["recruitmentThreadsObj", "_id"], ""),
      });
    }

    if (!editable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "Y5gWhUpcc", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   データ作成
    // --------------------------------------------------

    const replies = -recruitmentRepliesArr.length;

    const imagesAndVideos_id = lodashGet(
      docCommentObj,
      ["imagesAndVideos_id"],
      ""
    );
    const imagesAndVideos_idsArr = [];

    if (imagesAndVideos_id) {
      imagesAndVideos_idsArr.push(imagesAndVideos_id);
    }

    let images = 0;
    let videos = 0;

    images -= lodashGet(docCommentObj, ["imagesAndVideosObj", "images"], 0);
    videos -= lodashGet(docCommentObj, ["imagesAndVideosObj", "videos"], 0);

    for (let valueObj of recruitmentRepliesArr.values()) {
      if (valueObj.imagesAndVideos_id) {
        imagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }

      images -= lodashGet(valueObj, ["imagesAndVideosObj", "images"], 0);
      videos -= lodashGet(valueObj, ["imagesAndVideosObj", "videos"], 0);
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = {
      users_id,
      gameCommunities_id,
      recruitmentThreads_id,
      replies,
      imagesAndVideos_idsArr,
      images,
      videos,
    };

    // console.log(chalk`
    //   return
    //   images: {green ${images} / ${typeof images}}
    //   videos: {green ${videos} / ${typeof videos}}
    // `);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-comments/model.js - findForDelete
    // `);

    // console.log(chalk`
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   editable: {green ${editable} / ${typeof editable}}
    // `);

    // console.log(`
    //   ----- docCommentObj -----\n
    //   ${util.inspect(docCommentObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentRepliesArr -----\n
    //   ${util.inspect(recruitmentRepliesArr, { colors: true, depth: null })}\n
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
 * コメントのページ番号を取得する / 個別の募集を読み込む際に利用する　例）https://dev-1.gameusers.org/gc/Dead-by-Daylight/rec/bq215vgzyr
 * @param {string} recruitmentThreads_id - DB recruitment-threads _id / スレッドID
 * @param {string} recruitmentComments_id - DB recruitment-comments _id / コメントID
 * @param {number} commentLimit - コメントのリミット
 * @return {Object} 結果データ
 */
const getPage = async ({
  recruitmentThreads_id,
  recruitmentComments_id,
  commentLimit,
}) => {
  try {
    // ------------------------------------------------------------
    //   コメント _id をすべて取得する
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
    //   コメントのページ番号を計算する
    // --------------------------------------------------

    const commentIndex = recruitmentComments_idsArr.findIndex((valueObj) => {
      return valueObj._id === recruitmentComments_id;
    });

    const commentPage = Math.ceil((commentIndex + 1) / commentLimit);
    // let commentPage = Math.ceil(commentIndex / commentLimit) + 1;

    // if (commentPage === 0) {

    //   commentPage = 1;

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

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return {
      commentPage,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * 通知用のデータ取得
 * @param {string} _id - DB recruitment-comments _id / コメントID
 * @return {Array} 取得データ
 */
const findForNotification = async ({ _id }) => {
  try {
    // --------------------------------------------------
    //   recruitmentCommentsObj / Locale 用
    // --------------------------------------------------

    const recruitmentCommentsObj = await findOne({
      conditionObj: {
        _id,
      },
    });

    // --------------------------------------------------
    //   Locale
    // --------------------------------------------------

    const localeObj = locale({
      acceptLanguage: lodashGet(recruitmentCommentsObj, ["language"], ""),
    });

    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Web Push Error Limit
    // --------------------------------------------------

    const webPushErrorLimit = parseInt(process.env.WEB_PUSH_ERROR_LIMIT, 10);

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaRecruitmentComments.aggregate([
      // --------------------------------------------------
      //   Match Condition
      // --------------------------------------------------

      {
        $match: { _id },
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
    //   データが存在しない場合は処理停止
    // --------------------------------------------------

    if (Object.keys(docObj).length === 0) {
      return {};
    }

    // console.log(chalk`
    //   Object.keys(docObj).length: {green ${Object.keys(docObj).length}}
    // `);

    // console.log(`
    //   ----- docObj -----\n
    //   ${util.inspect(docArr, { docObj: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   subscriptionObj
    // --------------------------------------------------

    const webPushAvailable = lodashGet(
      recruitmentCommentsObj,
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
    //   /app/@database/recruitment-comments/model.js - findForNotification
    // `);

    // console.log(chalk`
    //   _id: {green ${_id}}
    // `);

    // console.log(`
    //   ----- recruitmentCommentsObj -----\n
    //   ${util.inspect(recruitmentCommentsObj, { colors: true, depth: null })}\n
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
 * Transaction 挿入 / 更新する
 *
 * @param {Object} recruitmentThreadsConditionObj - DB recruitment-threads 検索条件
 * @param {Object} recruitmentThreadsSaveObj - DB recruitment-threads 保存データ
 * @param {Object} recruitmentCommentsConditionObj - DB recruitment-comments 検索条件
 * @param {Object} recruitmentCommentsSaveObj - DB recruitment-comments 保存データ
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件
 * @param {Object} imagesAndVideosSaveObj - DB images-and-videos 保存データ
 * @param {Object} gameCommunitiesConditionObj - DB game-communities 検索条件
 * @param {Object} gameCommunitiesSaveObj - DB game-communities 保存データ
 * @param {Object} webPushesConditionObj - DB web-pushes 検索条件
 * @param {Object} webPushesSaveObj - DB web-pushes 保存データ
 * @param {Object} usersConditionObj - DB users 検索条件
 * @param {Object} usersSaveObj - DB users 保存データ
 * @param {Object} notificationsConditionObj - DB notifications 検索条件
 * @param {Object} notificationsSaveObj - DB notifications 保存データ
 * @return {Object}
 */
const transactionForUpsert = async ({
  recruitmentThreadsConditionObj,
  recruitmentThreadsSaveObj,
  recruitmentCommentsConditionObj,
  recruitmentCommentsSaveObj,
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

  const session = await SchemaRecruitmentComments.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // ---------------------------------------------
    //   - recruitment-comments
    // ---------------------------------------------

    await SchemaRecruitmentComments.updateOne(
      recruitmentCommentsConditionObj,
      recruitmentCommentsSaveObj,
      { session, upsert: true }
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
      //   画像＆動画を削除する
      // --------------------------------------------------

      const arr = lodashGet(imagesAndVideosSaveObj, ["arr"], []);

      if (arr.length === 0) {
        await SchemaImagesAndVideos.deleteOne(imagesAndVideosConditionObj, {
          session,
        });

        // --------------------------------------------------
        //   画像＆動画を保存
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
    // console.log('--------コミット-----------');

    session.endSession();

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-comments/model.js - transactionForUpsert
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
    // console.log('--------ロールバック-----------');

    session.endSession();

    throw errorObj;
  }
};

/**
 * Transaction コメントを削除する
 * @param {Object} recruitmentThreadsConditionObj - DB recruitment-threads 検索条件
 * @param {Object} recruitmentThreadsSaveObj - DB recruitment-threads 保存データ
 * @param {Object} recruitmentCommentsConditionObj - DB recruitment-comments 検索条件
 * @param {Object} recruitmentRepliesConditionObj - DB recruitment-replies 検索条件
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件
 * @param {Object} gameCommunitiesConditionObj - DB game-communities 検索条件
 * @param {Object} gameCommunitiesSaveObj - DB game-communities 保存データ
 * @return {Object}
 */
const transactionForDelete = async ({
  recruitmentThreadsConditionObj,
  recruitmentThreadsSaveObj,
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

  const session = await SchemaRecruitmentComments.startSession();

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
    //   - recruitment-comments / deleteOne
    // ---------------------------------------------

    await SchemaRecruitmentComments.deleteOne(recruitmentCommentsConditionObj, {
      session,
    });

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
    // console.log('--------コミット-----------');

    session.endSession();

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/recruitment-comments/model.js - transactionForDelete
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
  deleteMany,

  findCommentsAndReplies,
  findOneForEdit,
  findForDelete,
  getPage,
  findForNotification,

  transactionForUpsert,
  transactionForDelete,
};

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
const lodashMerge = require("lodash/merge");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const SchemaForumComments = require("./schema.js");
const SchemaForumThreads = require("../forum-threads/schema.js");
const SchemaGameCommunities = require("../game-communities/schema.js");
const SchemaUserCommunities = require("../user-communities/schema.js");
const SchemaImagesAndVideos = require("../images-and-videos/schema.js");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../@modules/error/custom.js");
const { verifyAuthority } = require("../../@modules/authority.js");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const {
  formatImagesAndVideosObj,
  formatImagesAndVideosArr,
} = require("../images-and-videos/format.js");

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

    return await SchemaForumComments.findOne(conditionObj).exec();
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

    return await SchemaForumComments.find(conditionObj).exec();
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

    return await SchemaForumComments.countDocuments(conditionObj).exec();
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

    return await SchemaForumComments.findOneAndUpdate(conditionObj, saveObj, {
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

    return await SchemaForumComments.insertMany(saveArr);
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

    return await SchemaForumComments.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   find
// --------------------------------------------------

/**
 * コメントと返信を取得する - forumThreads_idsArr で検索
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} forumThreads_idsArr - DB forum-threads _id / _idが入っている配列
 * @param {Object} forumThreadsObj - スレッド情報の入ったオブジェクト / カウントの取得に使う
 * @param {number} commentPage - コメントのページ
 * @param {number} commentLimit - コメントのリミット
 * @param {number} replyPage - 返信のページ
 * @param {number} replyLimit - 返信のリミット
 * @return {Array} 取得データ
 */
const findCommentsAndRepliesByForumThreads_idsArr = async ({
  req,
  localeObj,
  loginUsers_id,
  forumThreads_idsArr,
  forumThreadsObj,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
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

    const intCommentLimit = parseInt(commentLimit, 10);
    const intReplyLimit = parseInt(replyLimit, 10);

    // --------------------------------------------------
    //   Forum Comments & Replies データ取得
    //   $in, sort, limit を使って最新のコメントを取得すると、古いコメントが limit で削られてしまうため
    //   あるスレッドでは古いコメントが表示されないという事態になってしまう
    //   そのため for のループで検索している　ただ良くない書き方だと思うので可能なら改善した方がいい
    // --------------------------------------------------

    let resultArr = [];

    for (let value of forumThreads_idsArr.values()) {
      const docArr = await SchemaForumComments.aggregate([
        // --------------------------------------------------
        //   コメント
        //   forumComments_id: '' この場合は親のコメントがないので、返信ではなくコメントということ
        // --------------------------------------------------

        {
          $match: {
            $and: [{ forumThreads_id: value }, { forumComments_id: "" }],
          },
        },

        // --------------------------------------------------
        //   $sort / $skip / $limit
        // --------------------------------------------------

        { $sort: { updatedDate: -1 } },
        { $skip: (commentPage - 1) * intCommentLimit },
        { $limit: intCommentLimit },

        // --------------------------------------------------
        //   card-players
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
              //   card-players / images-and-videos / サムネイル画像
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
        //   experiences
        // --------------------------------------------------

        {
          $lookup: {
            from: "experiences",
            let: { letUsers_id: "$users_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$users_id", "$$letUsers_id"],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  exp: 1,
                },
              },
            ],
            as: "experiencesObj",
          },
        },

        {
          $unwind: {
            path: "$experiencesObj",
            preserveNullAndEmptyArrays: true,
          },
        },

        // --------------------------------------------------
        //   images-and-videos / メイン画像
        // --------------------------------------------------

        {
          $lookup: {
            from: "images-and-videos",
            let: { letImagesAndVideos_id: "$imagesAndVideos_id" },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$letImagesAndVideos_id"] } },
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
        //   返信（内部の処理は上記コメントと同じ）
        // --------------------------------------------------

        // --------------------------------------------------
        //   forum-comments
        // --------------------------------------------------

        {
          $lookup: {
            from: "forum-comments",
            let: { let_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$forumComments_id", "$$let_id"],
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
              //   forum-comments / card-players
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
                    //   forum-comments / card-players / images-and-videos / サムネイル画像
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
              //   forum-comments / users
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
              //   forum-comments / experiences
              // --------------------------------------------------

              {
                $lookup: {
                  from: "experiences",
                  let: { letUsers_id: "$users_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$users_id", "$$letUsers_id"],
                        },
                      },
                    },
                    {
                      $project: {
                        _id: 0,
                        exp: 1,
                      },
                    },
                  ],
                  as: "experiencesObj",
                },
              },

              {
                $unwind: {
                  path: "$experiencesObj",
                  preserveNullAndEmptyArrays: true,
                },
              },

              // --------------------------------------------------
              //   forum-comments / images-and-videos - メイン画像
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
              //   forum-comments / forum-comments - replyTo 用のデータ取得
              // --------------------------------------------------

              {
                $lookup: {
                  from: "forum-comments",
                  let: {
                    letReplyToForumComments_id: "$replyToForumComments_id",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$letReplyToForumComments_id"],
                        },
                      },
                    },

                    // --------------------------------------------------
                    //   forum-comments / forum-comments / card-players
                    // --------------------------------------------------

                    {
                      $lookup: {
                        from: "card-players",
                        let: { letReplyToUsers_id: "$users_id" },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  { $eq: ["$language", language] },
                                  {
                                    $eq: ["$users_id", "$$letReplyToUsers_id"],
                                  },
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
                        anonymity: 1,
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
            ],
            as: "forumRepliesArr",
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
      //   value: {green ${value}}
      // `);

      // console.log(chalk`
      //   commentPage2: {green ${commentPage}}
      //   commentLimit2: {green ${commentLimit}}
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

    const formattedObj = formatVer2({
      req,
      localeObj,
      loginUsers_id,
      arr: resultArr,
      forumThreadsObj,
      commentPage,
      commentLimit: intCommentLimit,
      replyPage,
      replyLimit: intReplyLimit,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----- resultArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(resultArr)), { colors: true, depth: null })}\n
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
 * 返信を取得する - forumComments_idsArr で検索
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} forumComments_idsArr - DB forum-comments _id / コメントIDが入った配列
 * @param {number} commentPage - コメントのページ
 * @param {number} commentLimit - コメントのリミット
 * @param {number} replyPage - 返信のページ
 * @param {number} replyLimit - 返信のリミット
 * @return {Array} 取得データ
 */
const findRepliesByForumComments_idsArr = async ({
  req,
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  userCommunities_id,
  forumComments_idsArr = [],
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
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

    const intCommentLimit = forumComments_idsArr.length;
    const intReplyLimit = parseInt(replyLimit, 10);

    // const intCommentLimit = parseInt(commentLimit, 10);
    // const intReplyLimit = parseInt(replyLimit, 10);

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [];

    // --------------------------------------------------
    //   Game Community
    // --------------------------------------------------

    if (gameCommunities_id) {
      matchConditionArr = [
        {
          $match: {
            $and: [
              { _id: { $in: forumComments_idsArr } },
              { gameCommunities_id },
            ],
          },
        },
      ];

      // --------------------------------------------------
      //   User Community
      // --------------------------------------------------
    } else if (userCommunities_id) {
      matchConditionArr = [
        {
          $match: {
            $and: [
              { _id: { $in: forumComments_idsArr } },
              { userCommunities_id },
            ],
          },
        },
      ];
    }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaForumComments.aggregate([
      // --------------------------------------------------
      //   matchConditionArr
      // --------------------------------------------------

      ...matchConditionArr,

      // --------------------------------------------------
      //   $sort / $skip /$limit
      // --------------------------------------------------

      { $sort: { updatedDate: -1 } },
      { $skip: (commentPage - 1) * intCommentLimit },
      { $limit: intCommentLimit },

      // --------------------------------------------------
      //   card-players
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
      //   experiences
      // --------------------------------------------------

      {
        $lookup: {
          from: "experiences",
          let: { letUsers_id: "$users_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$users_id", "$$letUsers_id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                exp: 1,
              },
            },
          ],
          as: "experiencesObj",
        },
      },

      {
        $unwind: {
          path: "$experiencesObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   images-and-videos - メイン画像
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
      //   forum-comments - 返信
      // --------------------------------------------------

      {
        $lookup: {
          from: "forum-comments",
          let: { forumComments_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$forumComments_id", "$$forumComments_id"],
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
            //   forum-comments / card-players
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
                  //   forum-comments / card-players / images-and-videos - サムネイル画像
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
            //   forum-comments / users
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
            //   forum-comments / experiences
            // --------------------------------------------------

            {
              $lookup: {
                from: "experiences",
                let: { letUsers_id: "$users_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$users_id", "$$letUsers_id"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      exp: 1,
                    },
                  },
                ],
                as: "experiencesObj",
              },
            },

            {
              $unwind: {
                path: "$experiencesObj",
                preserveNullAndEmptyArrays: true,
              },
            },

            // --------------------------------------------------
            //   forum-comments / images-and-videos
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
            //   forum-comments / forum-comments - replyTo 用のデータ取得
            // --------------------------------------------------

            {
              $lookup: {
                from: "forum-comments",
                let: { letReplyToForumComments_id: "$replyToForumComments_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$letReplyToForumComments_id"],
                      },
                    },
                  },

                  // --------------------------------------------------
                  //   forum-comments / forum-comments / card-players
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
                      anonymity: 1,
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
                __v: 0,
              },
            },
          ],
          as: "forumRepliesArr",
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          imagesAndVideos_id: 0,
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const formattedObj = formatVer2({
      req,
      localeObj,
      loginUsers_id,
      arr: docArr,
      forumThreadsObj: {},
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
    //   /app/@database/forum-comments/model.js - findRepliesByForumComments_idsArr
    // `);

    // console.log(chalk`
    //   userCommunities_id: {green ${userCommunities_id}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(`
    //   ----- forumComments_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumComments_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
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

    return lodashGet(formattedObj, ["forumRepliesObj"], {});
  } catch (err) {
    throw err;
  }
};

/**
 * DBから取得した情報をフォーマットする
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} arr - コメントと返信情報の入った配列
 * @param {Object} forumThreadsObj - スレッド情報の入ったオブジェクト / カウントの取得に使う
 * @param {number} commentPage - コメントのページ
 * @param {number} commentLimit - コメントのリミット
 * @param {number} replyPage - 返信のページ
 * @param {number} replyLimit - 返信のリミット
 * @return {Array} フォーマット後のデータ
 */
const formatVer2 = ({
  req,
  localeObj,
  loginUsers_id,
  arr,
  forumThreadsObj,
  commentPage,
  commentLimit,
  replyPage,
  replyLimit,
}) => {
  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  const forumCommentsObj = {
    limit: commentLimit,
    dataObj: {},
  };

  const forumRepliesObj = {
    limit: replyLimit,
    dataObj: {},
  };

  // --------------------------------------------------
  //   コメントと返信に分離
  // --------------------------------------------------

  let commentsArr = [];
  let repliesArr = [];

  for (let valueObj of arr.values()) {
    if (lodashHas(valueObj, ["forumRepliesArr"])) {
      const tempArr = lodashGet(valueObj, ["forumRepliesArr"], []);
      repliesArr = repliesArr.concat(tempArr);
    }

    delete valueObj.forumRepliesArr;

    commentsArr.push(valueObj);
  }

  // console.log(`
  //   ----- commentsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(commentsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- repliesArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(repliesArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   function
  // --------------------------------------------------

  const loopFormat = ({ arr, ISO8601 }) => {
    const returnObj = {};

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
      //   画像と動画の処理
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
      //   画像と動画の処理 - ユーザーサムネイル
      // --------------------------------------------------

      if (
        lodashHas(valueObj, ["cardPlayersObj", "imagesAndVideosThumbnailObj"])
      ) {
        const imagesAndVideosThumbnailObj = lodashGet(
          valueObj,
          ["cardPlayersObj", "imagesAndVideosThumbnailObj"],
          {}
        );

        // console.log(`
        //   ----- imagesAndVideosThumbnailObj -----\n
        //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosThumbnailObj)), { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        const formattedThumbnailObj = formatImagesAndVideosObj({
          localeObj,
          obj: imagesAndVideosThumbnailObj,
        });

        if (Object.keys(formattedThumbnailObj).length !== 0) {
          lodashSet(
            clonedObj,
            ["cardPlayersObj", "imagesAndVideosThumbnailObj"],
            formattedThumbnailObj
          );
        } else {
          delete clonedObj.cardPlayersObj.imagesAndVideosThumbnailObj;
        }
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

      let filteredArr = valueObj.localesArr.filter((filterObj) => {
        return filterObj.language === localeObj.language;
      });

      if (lodashHas(filteredArr, [0])) {
        clonedObj.name = lodashGet(filteredArr, [0, "name"], "");
        clonedObj.comment = lodashGet(filteredArr, [0, "comment"], "");
      } else {
        clonedObj.name = lodashGet(valueObj, ["localesArr", 0, "name"], "");
        clonedObj.comment = lodashGet(
          valueObj,
          ["localesArr", 0, "comment"],
          ""
        );
      }

      // --------------------------------------------------
      //   Reply to: Name
      // --------------------------------------------------

      if (valueObj.replyToObj) {
        // console.log(`
        //   ----- valueObj.replyToObj -----\n
        //   ${util.inspect(valueObj.replyToObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        const anonymity = lodashGet(
          valueObj,
          ["replyToObj", "anonymity"],
          false
        );

        clonedObj.replyToName = lodashGet(
          valueObj,
          ["replyToObj", "cardPlayersObj", "name"],
          ""
        );

        if (anonymity) {
          clonedObj.replyToName = "";
        } else if (!clonedObj.replyToName) {
          const localesArr = lodashGet(
            valueObj,
            ["replyToObj", "localesArr"],
            []
          );

          filteredArr = localesArr.filter((filterObj) => {
            return filterObj.language === localeObj.language;
          });

          if (lodashHas(filteredArr, [0])) {
            clonedObj.replyToName = lodashGet(filteredArr, [0, "name"], "");
          } else {
            clonedObj.replyToName = lodashGet(localesArr, [0, "name"], "");
          }
        }

        // console.log(chalk`
        //   valueObj.replyToForumComments_id: {green ${valueObj.replyToForumComments_id}}
        //   clonedObj.replyToName: {green ${clonedObj.replyToName}}
        // `);
      }

      // console.log(`
      //   ----- filteredArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(filteredArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   exp
      // --------------------------------------------------

      const exp = lodashGet(valueObj, ["experiencesObj", "exp"], 0);

      lodashSet(clonedObj, ["usersObj", "exp"], exp);

      // --------------------------------------------------
      //   匿名の場合の処理 - Card Players
      // --------------------------------------------------

      if (valueObj.anonymity) {
        delete clonedObj.cardPlayersObj;
        delete clonedObj.usersObj;
      }

      // } else if (lodashHas(valueObj, ['cardPlayersObj', 'imagesAndVideosObj', 'thumbnailArr'])) {

      //   // --------------------------------------------------
      //   //   サムネイル画像の処理 - Card Players
      //   // --------------------------------------------------

      //   const thumbnailArr = lodashGet(valueObj, ['cardPlayersObj', 'imagesAndVideosObj', 'thumbnailArr'], []);
      //   lodashSet(clonedObj, ['cardPlayersObj', 'imagesAndVideosObj', 'thumbnailArr'], formatImagesAndVideosArr({ arr: thumbnailArr }));

      // }

      // --------------------------------------------------
      //   不要な項目を削除する
      // --------------------------------------------------

      delete clonedObj._id;
      delete clonedObj.createdDate;
      delete clonedObj.users_id;
      delete clonedObj.localesArr;
      delete clonedObj.anonymity;
      delete clonedObj.experiencesObj;
      delete clonedObj.forumRepliesArr;
      delete clonedObj.replyToObj;
      delete clonedObj.ip;
      delete clonedObj.userAgent;
      delete clonedObj.__v;

      // console.log(`\n---------- clonedObj ----------\n`);
      // console.dir(clonedObj);
      // console.log(`\n-----------------------------------\n`);

      // --------------------------------------------------
      //   オブジェクトに追加 - dataObj用
      // --------------------------------------------------

      returnObj[valueObj._id] = clonedObj;

      // --------------------------------------------------
      //   forumCommentsObj & forumRepliesPageArr 作成
      // --------------------------------------------------

      const forumThreads_id = valueObj.forumThreads_id;
      const forumComments_id = valueObj.forumComments_id;

      if (forumComments_id) {
        const replyCount = lodashGet(
          formattedCommentsObj,
          [forumComments_id, "replies"],
          0
        );

        const forumRepliesPageArr = lodashGet(
          forumRepliesObj,
          [forumComments_id, `page${replyPage}Obj`, "arr"],
          []
        );
        forumRepliesPageArr.push(valueObj._id);

        forumRepliesObj[forumComments_id] = {
          page: replyPage,
          count: replyCount,
        };

        forumRepliesObj[forumComments_id][`page${replyPage}Obj`] = {
          loadedDate: ISO8601,
          arr: forumRepliesPageArr,
        };
      } else {
        const commentCount = lodashGet(
          forumThreadsObj,
          ["dataObj", forumThreads_id, "comments"],
          0
        );

        const forumCommentsPageArr = lodashGet(
          forumCommentsObj,
          [forumThreads_id, `page${commentPage}Obj`, "arr"],
          []
        );
        forumCommentsPageArr.push(valueObj._id);

        forumCommentsObj[forumThreads_id] = {
          page: commentPage,
          count: commentCount,
        };

        forumCommentsObj[forumThreads_id][`page${commentPage}Obj`] = {
          loadedDate: ISO8601,
          arr: forumCommentsPageArr,
        };
      }
    }

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return returnObj;
  };

  // --------------------------------------------------
  //   完成
  // --------------------------------------------------

  const ISO8601 = moment().utc().toISOString();

  const formattedCommentsObj = loopFormat({ arr: commentsArr, ISO8601 });
  const formattedRepliesObj = loopFormat({ arr: repliesArr, ISO8601 });

  forumCommentsObj.dataObj = formattedCommentsObj;
  forumRepliesObj.dataObj = formattedRepliesObj;

  // console.log(`
  //   ----- formattedCommentsObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(formattedCommentsObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- formattedRepliesObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(formattedRepliesObj)), { colors: true, depth: null })}\n
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
    forumCommentsObj,
    forumRepliesObj,
  };
};

/**
 * コメントのページ番号を取得する
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} forumThreads_idsArr - DB forum-threads _id / _idが入っている配列
 * @param {Object} forumThreadsObj - スレッド情報の入ったオブジェクト / カウントの取得に使う
 * @param {number} commentPage - コメントのページ
 * @param {number} commentLimit - コメントのリミット
 * @param {number} replyPage - 返信のページ
 * @param {number} replyLimit - 返信のリミット
 * @return {Array} 取得データ
 */
const getPage = async ({
  // req,
  // localeObj,
  // loginUsers_id,
  forumThreads_id,
  forumComments_id,
  forumReplies_id,
  commentLimit,
  replyLimit,
}) => {
  try {
    // ------------------------------------------------------------
    //   コメントのページ番号を取得する
    // ------------------------------------------------------------

    // --------------------------------------------------
    //   _idをすべて取得する
    // --------------------------------------------------

    const comment_idsArr = await SchemaForumComments.aggregate([
      // --------------------------------------------------
      //   コメント
      // --------------------------------------------------

      // forumComments_id: '' この場合は親のコメントがないので、返信ではなくコメントということ
      {
        $match: {
          $and: [{ forumThreads_id }, { forumComments_id: "" }],
        },
      },

      { $sort: { updatedDate: -1 } },

      {
        $project: {
          _id: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   page 計算
    // --------------------------------------------------

    const commentIndex = comment_idsArr.findIndex((valueObj) => {
      return valueObj._id === forumComments_id;
    });

    const commentPage = Math.ceil((commentIndex + 1) / commentLimit);

    // ------------------------------------------------------------
    //   返信のページ番号を取得する
    // ------------------------------------------------------------

    let replyPage = 1;

    if (forumReplies_id) {
      // --------------------------------------------------
      //   _idをすべて取得する
      // --------------------------------------------------

      const reply_idsArr = await SchemaForumComments.aggregate([
        // --------------------------------------------------
        //   コメント
        // --------------------------------------------------

        {
          $match: {
            $and: [{ forumThreads_id }, { forumComments_id }],
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
      //   page 計算
      // --------------------------------------------------

      const replyIndex = reply_idsArr.findIndex((valueObj) => {
        return valueObj._id === forumReplies_id;
      });

      replyPage = Math.ceil((replyIndex + 1) / replyLimit);

      // if (replyPage === 0) {
      //   replyPage = 1;
      // }

      // console.log(chalk`
      //   replyIndex: {green ${replyIndex}}
      //   replyPage: {green ${replyPage}}
      // `);

      // console.log(`
      //   ----- reply_idsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(reply_idsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   app/@database/forum-comments/model.js - getPage
    // `);

    // console.log(chalk`
    //   forumThreads_id: {green ${forumThreads_id}}
    //   forumComments_id: {green ${forumComments_id}}
    //   forumReplies_id: {green ${forumReplies_id}}
    //   commentLimit: {green ${commentLimit}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(chalk`
    //   commentIndex: {green ${commentIndex}}
    //   commentPage: {green ${commentPage}}
    // `);

    // for (let i = 1; i <= 20; i++) {

    //   for (let j = 1; j <= 20; j++) {

    //     const index = j;
    //     const limit = i;

    //     console.log('index: ' + index, 'limit: ' + limit, 'result: ' + Math.ceil(index / limit));

    //   }

    // }

    // console.log(chalk`
    //   commentIndex + 1: {green ${commentIndex + 1}}
    //   commentIndex: {green ${commentIndex} / ${typeof commentIndex}}
    //   commentLimit: {green ${commentLimit} / ${typeof commentLimit}}
    //   Math.ceil(commentIndex + 1 / commentLimit): {green ${Math.ceil((commentIndex + 1) / commentLimit)}}
    //   Math.ceil(commentIndex + 1 / commentLimit): {green ${Math.ceil(5 / 10)}}
    //   commentPage: {green ${commentPage}}
    // `);

    // console.log(`
    //   ----- comment_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(comment_idsArr)), { colors: true, depth: null })}\n
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

    return {
      commentPage,
      replyPage,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * コメント＆返信データを取得する　編集用
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} forumComments_id - DB forum-comments _id / コメントのID
 * @return {Array} 取得データ
 */
const findForEdit = async ({
  req,
  localeObj,
  loginUsers_id,
  forumComments_id,
}) => {
  try {
    // --------------------------------------------------
    //   Aggregate
    // --------------------------------------------------

    const docArr = await SchemaForumComments.aggregate([
      // --------------------------------------------------
      //   $match
      // --------------------------------------------------

      {
        $match: { _id: forumComments_id },
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
                // _id: 0,
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
    ]).exec();

    // --------------------------------------------------
    //   配列が空の場合は処理停止
    // --------------------------------------------------

    if (docArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "hSZgl_T02", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   編集権限がない場合は処理停止
    // --------------------------------------------------

    const editable = verifyAuthority({
      req,
      users_id: lodashGet(docArr, [0, "users_id"], ""),
      loginUsers_id,
      ISO8601: lodashGet(docArr, [0, "createdDate"], ""),
      _id: lodashGet(docArr, [0, "_id"], ""),
    });

    // console.log(chalk`
    //   editable: {green ${editable}}
    // `);

    if (!editable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "IRZhSgQnt", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const _id = lodashGet(docArr, [0, "_id"], "");
    const anonymity = lodashGet(docArr, [0, "anonymity"], false);
    const imagesAndVideosObj = lodashGet(docArr, [0, "imagesAndVideosObj"], {});
    let name = "";
    let comment = "";

    // --------------------------------------------------
    //   Name & Comment
    // --------------------------------------------------

    const filteredArr = docArr.filter((filterObj) => {
      return filterObj.language === localeObj.language;
    });

    if (lodashHas(filteredArr, [0])) {
      name = lodashGet(filteredArr, [0, "name"], "");
      comment = lodashGet(filteredArr, [0, "comment"], "");
    } else {
      name = lodashGet(docArr, [0, "localesArr", 0, "name"], "");
      comment = lodashGet(docArr, [0, "localesArr", 0, "comment"], "");
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = {
      _id,
      name,
      anonymity,
      comment,
      imagesAndVideosObj,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/forum-comments/model.js - findForEdit
    // `);

    // console.log(chalk`
    //   forumComments_id: {green ${forumComments_id}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
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
 * 返信を取得する / 投稿＆編集後のデータ / 2020/5/2
 * @param {Object} req - リクエスト
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} gameCommunities_id - DB game-communities _id / ゲームコミュニティID
 * @param {string} userCommunities_id - DB user-communities _id / ユーザーコミュニティID
 * @param {string} forumThreads_id - DB forum-threads _id / スレッドID
 * @param {string} forumComments_id - DB forum-comments _id / コメントID
 * @param {string} forumReplies_id - DB forum-comments _id / 返信ID
 * @param {number} commentPage - コメントのページ
 * @param {number} commentLimit - コメントのリミット
 * @param {number} replyPage - 返信のページ
 * @param {number} replyLimit - 返信のリミット
 * @return {Object} 取得データ
 */
const findRepliesForUpsert = async ({
  req,
  localeObj,
  loginUsers_id,
  gameCommunities_id,
  userCommunities_id,
  forumThreads_id,
  forumComments_id,
  forumReplies_id,
  commentPage = 1,
  commentLimit = process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
  replyPage = 1,
  replyLimit = process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
}) => {
  try {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    let replyPage = 1;

    // --------------------------------------------------
    //   編集
    //   返信は投稿順（昇順）で表示されるため、一番新しいページを単純に表示すれば編集した返信が表示されるわけではない
    //   そのため、編集した返信を表示する場合、返信の表示順を計算しなければならない
    //   返信の総数から順番を取得し
    //   limit で割って表示ページを取得する
    // --------------------------------------------------

    if (forumReplies_id) {
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      let matchConditionArr = [];

      // --------------------------------------------------
      //   Game Community
      // --------------------------------------------------

      if (gameCommunities_id) {
        matchConditionArr = [
          {
            $match: {
              gameCommunities_id,
              forumThreads_id,
              forumComments_id,
            },
          },
        ];

        // --------------------------------------------------
        //   User Community
        // --------------------------------------------------
      } else if (userCommunities_id) {
        matchConditionArr = [
          {
            $match: {
              userCommunities_id,
              forumThreads_id,
              forumComments_id,
            },
          },
        ];
      }

      // --------------------------------------------------
      //   Aggregation
      // --------------------------------------------------

      const docForumRepliesArr = await SchemaForumComments.aggregate([
        // --------------------------------------------------
        //   matchConditionArr
        // --------------------------------------------------

        ...matchConditionArr,

        { $sort: { createdDate: 1 } },

        {
          $project: {
            _id: 1,
          },
        },
      ]).exec();

      const index = docForumRepliesArr.findIndex((valueObj) => {
        return valueObj._id === forumReplies_id;
      });

      // const replies = docForumRepliesArr.length;
      replyPage = Math.ceil((index + 1) / replyLimit);

      // console.log(`
      //   ----------------------------------------\n
      //   Update
      // `);

      // console.log(`
      //   ----- docForumRepliesArr -----\n
      //   ${util.inspect(docForumRepliesArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(chalk`
      //   index: {green ${index}}
      //   replies: {green ${replies}}
      // `);

      // --------------------------------------------------
      //   新規投稿
      //   返信は投稿順（昇順）で表示されるため、新規投稿した返信は順番的に最後に表示される
      //   そのため、新規投稿した返信を表示する場合は、返信の最後のページを表示しなければならない
      //   コメントの情報から返信の総数を取得し
      //   limit で割って最後のページを取得する
      // --------------------------------------------------
    } else {
      let docForumCommentsObj = {};

      // --------------------------------------------------
      //   Game Community
      // --------------------------------------------------

      if (gameCommunities_id) {
        docForumCommentsObj = await findOne({
          conditionObj: {
            _id: forumComments_id,
            gameCommunities_id,
            forumThreads_id,
          },
        });

        // --------------------------------------------------
        //   User Community
        // --------------------------------------------------
      } else if (userCommunities_id) {
        docForumCommentsObj = await findOne({
          conditionObj: {
            _id: forumComments_id,
            userCommunities_id,
            forumThreads_id,
          },
        });
      }

      const replies = lodashGet(docForumCommentsObj, ["replies"], 1);
      replyPage = Math.ceil(replies / replyLimit);

      // console.log(`
      //   ----------------------------------------\n
      //   Insert
      // `);

      // console.log(`
      //   ----- docForumCommentsObj -----\n
      //   ${util.inspect(docForumCommentsObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // --------------------------------------------------
    //   findReplies
    // --------------------------------------------------

    const forumRepliesObj = await findRepliesByForumComments_idsArr({
      req,
      localeObj,
      loginUsers_id,
      gameCommunities_id,
      userCommunities_id,
      forumComments_idsArr: [forumComments_id],
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
    //   /app/@database/forum-comments/model.js - findRepliesForUpsert
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   forumThreads_id: {green ${forumThreads_id}}
    //   forumComments_id: {green ${forumComments_id}}
    //   forumReplies_id: {green ${forumReplies_id}}
    //   commentPage: {green ${commentPage}}
    //   commentLimit: {green ${commentLimit}}
    //   replyPage: {green ${replyPage}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(`
    //   ----- forumRepliesObj -----\n
    //   ${util.inspect(forumRepliesObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return forumRepliesObj;
  } catch (err) {
    throw err;
  }
};

/**
 * コメントを削除する際に、同時に削除する画像の _id、返信数、画像数、動画数を取得する
 * @param {Object} req - リクエスト
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} forumComments_id - DB forum-comments _id / コメントのID
 * @return {Array} 取得データ
 */
const findForDeleteComment = async ({
  req,
  loginUsers_id,
  forumComments_id,
}) => {
  try {
    // --------------------------------------------------
    //   Aggregate
    // --------------------------------------------------

    const docArr = await SchemaForumComments.aggregate([
      // --------------------------------------------------
      //   $match
      // --------------------------------------------------

      {
        $match: {
          $or: [{ _id: forumComments_id }, { forumComments_id }],
        },
      },

      // --------------------------------------------------
      //   images-and-videos
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: { forumCommentsImagesAndVideos_id: "$imagesAndVideos_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$forumCommentsImagesAndVideos_id"],
                },
              },
            },
            {
              $project: {
                images: 1,
                videos: 1,
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
          replies: 1,
          imagesAndVideos_id: 1,
          imagesAndVideosObj: 1,
          userCommunitiesObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   配列が空の場合は処理停止
    // --------------------------------------------------

    if (docArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "jiSBn7Gb-", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   権限のチェック
    // --------------------------------------------------

    let deletable = false;

    // ---------------------------------------------
    //   - 削除権限（ユーザーコミュニティの作者かどうか）
    // ---------------------------------------------

    const userCommunitiesUsers_id = lodashGet(
      docArr,
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
    //   - 編集権限（サイト管理者か投稿者）
    // ---------------------------------------------

    const users_id = lodashGet(docArr, [0, "users_id"], "");

    const editable = verifyAuthority({
      req,
      users_id,
      loginUsers_id,
      ISO8601: lodashGet(docArr, [0, "createdDate"], ""),
      _id: lodashGet(docArr, [0, "_id"], ""),
    });

    if (editable) {
      deletable = true;
    }

    // console.log(chalk`
    // deletable: {green ${deletable} typeof ${typeof deletable}}
    // editable: {green ${editable} typeof ${typeof editable}}
    // `);

    // ---------------------------------------------
    //   権限がない場合は処理停止
    // ---------------------------------------------

    if (!deletable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "IRZhSgQnt", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    let replies = 0;
    let imagesAndVideos_idsArr = [];
    let images = 0;
    let videos = 0;

    for (let valueObj of docArr.values()) {
      if (valueObj.imagesAndVideos_id) {
        imagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }

      const reply = lodashGet(valueObj, ["replies"], 0);
      const image = lodashGet(valueObj, ["imagesAndVideosObj", "images"], 0);
      const video = lodashGet(valueObj, ["imagesAndVideosObj", "videos"], 0);

      replies -= reply;
      images -= image;
      videos -= video;
    }

    const returnObj = {
      users_id,
      replies,
      imagesAndVideos_idsArr,
      images,
      videos,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   forumComments_id: {green ${forumComments_id}}
    //   images: {green ${images}}
    //   videos: {green ${videos}}
    // `);

    // console.log(`
    //   ----- imagesAndVideos_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideos_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
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
 * 返信を削除する際に、同時に削除する画像の _id、画像数、動画数を取得する
 * @param {Object} req - リクエスト
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} gameCommunities_id - DB game-communities _id / ゲームコミュニティのID
 * @param {string} userCommunities_id - DB user-communities _id / ユーザーコミュニティのID
 * @param {string} forumThreads_id - DB forum-threads _id / スレッドのID
 * @param {string} forumComments_id - DB forum-comments _id / コメントのID
 * @param {string} forumReplies_id - DB forum-comments _id / 返信のID
 * @return {Array} 取得データ
 */
const findForDeleteReply = async ({
  req,
  loginUsers_id,
  gameCommunities_id,
  userCommunities_id,
  forumThreads_id,
  forumComments_id,
  forumReplies_id,
}) => {
  try {
    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [];

    // --------------------------------------------------
    //   Game Community
    // --------------------------------------------------

    if (gameCommunities_id) {
      matchConditionArr = [
        {
          $match: {
            _id: forumReplies_id,
            gameCommunities_id,
            forumThreads_id,
            forumComments_id,
          },
        },
      ];

      // --------------------------------------------------
      //   User Community
      // --------------------------------------------------
    } else if (userCommunities_id) {
      matchConditionArr = [
        {
          $match: {
            _id: forumReplies_id,
            userCommunities_id,
            forumThreads_id,
            forumComments_id,
          },
        },
      ];
    }

    // --------------------------------------------------
    //   Aggregate
    // --------------------------------------------------

    const docArr = await SchemaForumComments.aggregate([
      // --------------------------------------------------
      //   matchConditionArr
      // --------------------------------------------------

      ...matchConditionArr,

      // --------------------------------------------------
      //   images-and-videos - 画像と動画を取得
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: { forumCommentsImagesAndVideos_id: "$imagesAndVideos_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$forumCommentsImagesAndVideos_id"],
                },
              },
            },
            {
              $project: {
                images: 1,
                videos: 1,
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
          imagesAndVideosObj: 1,
          userCommunitiesObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   配列が空の場合は処理停止
    // --------------------------------------------------

    if (docArr.length === 0) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "VsOOpVMYg", messageID: "cvS0qSAlE" }],
      });
    }

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   権限のチェック
    // --------------------------------------------------

    let deletable = false;

    // ---------------------------------------------
    //   - 削除権限（ユーザーコミュニティの作者かどうか）
    // ---------------------------------------------

    const userCommunitiesUsers_id = lodashGet(
      docArr,
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
    //   - 編集権限（サイト管理者か投稿者）
    // ---------------------------------------------

    const users_id = lodashGet(docArr, [0, "users_id"], "");

    const editable = verifyAuthority({
      req,
      users_id,
      loginUsers_id,
      ISO8601: lodashGet(docArr, [0, "createdDate"], ""),
      _id: lodashGet(docArr, [0, "_id"], ""),
    });

    if (editable) {
      deletable = true;
    }

    // console.log(chalk`
    // deletable: {green ${deletable} typeof ${typeof deletable}}
    // editable: {green ${editable} typeof ${typeof editable}}
    // `);

    // ---------------------------------------------
    //   権限がない場合は処理停止
    // ---------------------------------------------

    if (!deletable) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "HdsQle2ZZ", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const imagesAndVideos_id = lodashGet(docArr, [0, "imagesAndVideos_id"], "");
    const images = -lodashGet(docArr, [0, "imagesAndVideosObj", "images"], 0);
    const videos = -lodashGet(docArr, [0, "imagesAndVideosObj", "videos"], 0);

    const returnObj = {
      users_id,
      imagesAndVideos_id,
      images,
      videos,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   forumComments_id: {green ${forumComments_id}}
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
//   transaction
// --------------------------------------------------

/**
 * Transaction 挿入 / 更新する
 * コメント、スレッド、画像＆動画、コミュニティを同時に更新する
 *
 * @param {Object} forumThreadsConditionObj - DB forum-threads 検索条件
 * @param {Object} forumThreadsSaveObj - DB forum-threads 保存データ
 * @param {Object} forumCommentsConditionObj - DB forum-comments 検索条件
 * @param {Object} forumCommentsSaveObj - DB forum-comments 保存データ
 * @param {Object} forumRepliesConditionObj - DB forum-comments 検索条件
 * @param {Object} forumRepliesSaveObj - DB forum-comments 保存データ
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件
 * @param {Object} imagesAndVideosSaveObj - DB images-and-videos 保存データ
 * @param {Object} gameCommunitiesConditionObj - DB game-communities 検索条件
 * @param {Object} gameCommunitiesSaveObj - DB game-communities 保存データ
 * @param {Object} userCommunitiesConditionObj - DB user-communities 検索条件
 * @param {Object} userCommunitiesSaveObj - DB user-communities 保存データ
 * @return {Object}
 */
const transactionForUpsert = async ({
  forumThreadsConditionObj = {},
  forumThreadsSaveObj = {},
  forumCommentsConditionObj = {},
  forumCommentsSaveObj = {},
  forumRepliesConditionObj = {},
  forumRepliesSaveObj = {},
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
    //   - forum-threads / Thread
    // ---------------------------------------------

    if (
      Object.keys(forumThreadsConditionObj).length !== 0 &&
      Object.keys(forumThreadsSaveObj).length !== 0
    ) {
      await SchemaForumThreads.updateOne(
        forumThreadsConditionObj,
        forumThreadsSaveObj,
        { session, upsert: true }
      );
    }

    // ---------------------------------------------
    //   - forum-comments / Comment
    // ---------------------------------------------

    if (
      Object.keys(forumCommentsConditionObj).length !== 0 &&
      Object.keys(forumCommentsSaveObj).length !== 0
    ) {
      await SchemaForumComments.updateOne(
        forumCommentsConditionObj,
        forumCommentsSaveObj,
        { session, upsert: true }
      );
    }

    // ---------------------------------------------
    //   - forum-comments / Reply
    // ---------------------------------------------

    if (
      Object.keys(forumRepliesConditionObj).length !== 0 &&
      Object.keys(forumRepliesSaveObj).length !== 0
    ) {
      await SchemaForumComments.updateOne(
        forumRepliesConditionObj,
        forumRepliesSaveObj,
        { session, upsert: true }
      );
    }

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
    // console.log('--------コミット-----------');

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
    //   ----- forumRepliesSaveObj -----\n
    //   ${util.inspect(forumRepliesSaveObj, { colors: true, depth: null })}\n
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
    // console.log('--------ロールバック-----------');

    session.endSession();

    throw errorObj;
  }
};

/**
 * Transaction コメントを削除する
 * コメントと返信を削除して、スレッド、画像＆動画、コミュニティを同時に更新する
 * @param {Object} forumThreadsConditionObj - DB forum-threads 検索条件
 * @param {Object} forumThreadsSaveObj - DB forum-threads 保存データ
 * @param {Object} forumCommentsConditionObj - DB forum-comments 検索条件
 * @param {Object} forumRepliesConditionObj - DB forum-comments 検索条件
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件
 * @param {Object} gameCommunitiesConditionObj - DB game-communities 検索条件
 * @param {Object} gameCommunitiesSaveObj - DB game-communities 保存データ
 * @param {Object} userCommunitiesConditionObj - DB user-communities 検索条件
 * @param {Object} userCommunitiesSaveObj - DB user-communities 保存データ
 * @return {Object}
 */
const transactionForDeleteComment = async ({
  forumThreadsConditionObj,
  forumThreadsSaveObj,
  forumCommentsConditionObj,
  forumRepliesConditionObj,
  imagesAndVideosConditionObj,
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
    //   DB
    // --------------------------------------------------

    await SchemaForumComments.deleteMany(forumRepliesConditionObj, { session });
    await SchemaForumComments.deleteOne(forumCommentsConditionObj, { session });
    await SchemaForumThreads.updateOne(
      forumThreadsConditionObj,
      forumThreadsSaveObj,
      { session }
    );

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
    // console.log('--------コミット-----------');

    session.endSession();

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----- forumCommentsConditionObj -----\n
    //   ${util.inspect(forumCommentsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosConditionObj -----\n
    //   ${util.inspect(imagesAndVideosConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

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
    // console.log('--------ロールバック-----------');

    session.endSession();

    throw errorObj;
  }
};

/**
 * Transaction 返信を削除する
 * 返信を削除して、コメント、スレッド、画像＆動画、ユーザーコミュニティを同時に更新する
 *
 * @param {Object} forumRepliesConditionObj - DB forum-comments 検索条件
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件
 * @param {Object} forumCommentsConditionObj - DB forum-comments 検索条件
 * @param {Object} forumCommentsSaveObj - DB forum-comments 保存データ
 * @param {Object} forumThreadsConditionObj - DB forum-threads 検索条件
 * @param {Object} forumThreadsSaveObj - DB forum-threads 保存データ
 * @param {Object} gameCommunitiesConditionObj - DB game-communities 検索条件
 * @param {Object} gameCommunitiesSaveObj - DB game-communities 保存データ
 * @param {Object} userCommunitiesConditionObj - DB user-communities 検索条件
 * @param {Object} userCommunitiesSaveObj - DB user-communities 保存データ
 * @return {Object}
 */
const transactionForDeleteReply = async ({
  forumRepliesConditionObj,
  imagesAndVideosConditionObj,
  forumCommentsConditionObj,
  forumCommentsSaveObj,
  forumThreadsConditionObj,
  forumThreadsSaveObj,
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
    //   - forum-comments (reply) / Delete
    // --------------------------------------------------

    await SchemaForumComments.deleteOne(forumRepliesConditionObj, { session });

    // ---------------------------------------------
    //   - forum-comments & forum-threads / Update
    // ---------------------------------------------

    await SchemaForumComments.updateOne(
      forumCommentsConditionObj,
      forumCommentsSaveObj,
      { session }
    );
    await SchemaForumThreads.updateOne(
      forumThreadsConditionObj,
      forumThreadsSaveObj,
      { session }
    );

    // ---------------------------------------------
    //   - images-and-videos / Delete
    // ---------------------------------------------

    if (Object.keys(imagesAndVideosConditionObj).length !== 0) {
      await SchemaImagesAndVideos.deleteOne(imagesAndVideosConditionObj, {
        session,
      });
    }

    // ---------------------------------------------
    //   - game-communities / Update
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
    //   - user-communities / Update
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
    // console.log('--------コミット-----------');

    session.endSession();

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/forum-comments/model.js - transactionForDeleteReply
    // `);

    // console.log(`
    //   ----- forumRepliesConditionObj -----\n
    //   ${util.inspect(forumRepliesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosConditionObj -----\n
    //   ${util.inspect(imagesAndVideosConditionObj, { colors: true, depth: null })}\n
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

  findCommentsAndRepliesByForumThreads_idsArr,
  findRepliesByForumComments_idsArr,
  getPage,
  findForEdit,
  findRepliesForUpsert,
  findForDeleteComment,
  findForDeleteReply,

  transactionForUpsert,
  transactionForDeleteComment,
  transactionForDeleteReply,
};

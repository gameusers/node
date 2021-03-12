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

const SchemaUserCommunities = require("./schema.js");
const SchemaForumThreads = require("../forum-threads/schema.js");
const SchemaForumComments = require("../forum-comments/schema.js");
const SchemaImagesAndVideos = require("../images-and-videos/schema.js");
const SchemaFollows = require("../follows/schema.js");

const ModelImagesAndVideos = require("../images-and-videos/model.js");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const {
  formatImagesAndVideosArr,
  formatImagesAndVideosObj,
} = require("../images-and-videos/format.js");
const { formatFollowsObj } = require("../follows/format.js");

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

    return await SchemaUserCommunities.findOne(conditionObj).exec();
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

    return await SchemaUserCommunities.find(conditionObj).exec();
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

    return await SchemaUserCommunities.countDocuments(conditionObj).exec();
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

    return await SchemaUserCommunities.findOneAndUpdate(conditionObj, saveObj, {
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

    return await SchemaUserCommunities.insertMany(saveArr);
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

    return await SchemaUserCommunities.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * ヘッダーの更新用  2020/9/3
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} userCommunities_id - DB user-communities ユーザーコミュニティID
 * @return {Object} 取得データ
 */
const findHeader = async ({ localeObj, loginUsers_id, userCommunities_id }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   DB users / ユーザー情報を取得する
    // --------------------------------------------------

    const docUserCommunityObj = await findForUserCommunity({
      localeObj,
      loginUsers_id,
      userCommunities_id,
    });

    const returnObj = lodashGet(docUserCommunityObj, ["headerObj"], {});

    // --------------------------------------------------
    //   対象のユーザーがユーザーページのトップ画像をアップロードしていない場合
    //   ランダム取得の画像を代わりに利用する
    // --------------------------------------------------
    //
    if (!lodashHas(returnObj, ["imagesAndVideosObj"])) {
      // --------------------------------------------------
      //   DB images-and-videos / ヘッダーヒーローイメージ用
      // --------------------------------------------------

      const imagesAndVideosObj = await ModelImagesAndVideos.findHeroImage({
        localeObj,
      });
      lodashSet(returnObj, ["imagesAndVideosObj"], imagesAndVideosObj);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   app/@database/user-communities/model.js - findHeader
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   language: {green ${language}}
    //   country: {green ${country}}
    // `);

    // console.log(`
    //   ----- docUserCommunityObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docUserCommunityObj)), { colors: true, depth: null })}\n
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
 * 検索してデータを取得する / For User Community
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} userCommunities_id - DB user-communities _id
 * @param {string} userCommunityID - DB user-communities userCommunityID / コミュニティID
 * @return {Array} 取得データ
 */
const findForUserCommunity = async ({
  localeObj,
  loginUsers_id,
  userCommunities_id,
  userCommunityID,
}) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [
      {
        $match: { _id: userCommunities_id },
      },
    ];

    if (userCommunityID) {
      matchConditionArr = [
        {
          $match: { userCommunityID },
        },
      ];
    }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaUserCommunities.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      ...matchConditionArr,

      // --------------------------------------------------
      //   games - 関連するゲーム
      // --------------------------------------------------

      {
        $lookup: {
          from: "games",
          let: { letGameCommunities_idsArr: "$gameCommunities_idsArr" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    {
                      $in: [
                        "$gameCommunities_id",
                        "$$letGameCommunities_idsArr",
                      ],
                    },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   games / images-and-videos / サムネイル用
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
                gameCommunities_id: 1,
                urlID: 1,
                name: 1,
                subtitle: 1,
                imagesAndVideosThumbnailObj: 1,
              },
            },
          ],
          as: "gamesArr",
        },
      },

      // --------------------------------------------------
      //   images-and-videos / トップ画像
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
      //   follows
      // --------------------------------------------------

      {
        $lookup: {
          from: "follows",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userCommunities_id", "$$let_id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                approval: 1,
                followedArr: 1,
                approvalArr: 1,
                blockArr: 1,
                followedCount: 1,
              },
            },
          ],
          as: "followsObj",
        },
      },

      {
        $unwind: {
          path: "$followsObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          users_id: 1,
          createdDate: 1,
          updatedDateObj: 1,
          localesArr: 1,
          communityType: 1,
          anonymity: 1,
          imagesAndVideosObj: 1,
          gamesArr: 1,
          followsObj: 1,
          gameCommunities_idsArr: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   Format
    // --------------------------------------------------

    const returnObj = lodashGet(docArr, [0], {});
    const headerObj = {};

    // --------------------------------------------------
    //   画像の処理
    // --------------------------------------------------

    if (returnObj.imagesAndVideosObj) {
      headerObj.imagesAndVideosObj = formatImagesAndVideosObj({
        localeObj,
        obj: returnObj.imagesAndVideosObj,
      });
    }

    // --------------------------------------------------
    //   関連するゲーム
    // --------------------------------------------------

    if (returnObj.gamesArr) {
      // --------------------------------------------------
      //   gamesArr - 元の配列の順番通りに並べなおす
      // --------------------------------------------------

      const sortedGamesArr = [];
      const gameCommunities_idsArr = lodashGet(
        returnObj,
        ["gameCommunities_idsArr"],
        []
      );
      const gamesArr = lodashGet(returnObj, ["gamesArr"], []);

      for (let gameCommunities_id of gameCommunities_idsArr) {
        const index = gamesArr.findIndex((valueObj) => {
          return valueObj.gameCommunities_id === gameCommunities_id;
        });

        if (index !== -1) {
          sortedGamesArr.push(gamesArr[index]);
        }
      }

      // --------------------------------------------------
      //   画像の処理
      // --------------------------------------------------

      headerObj.gamesArr = formatImagesAndVideosArr({ arr: sortedGamesArr });
    }

    // console.log(`
    //   ----- gameCommunities_idsArr -----\n
    //   ${util.inspect(gameCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- gamesArr -----\n
    //   ${util.inspect(gamesArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- sortedGamesArr -----\n
    //   ${util.inspect(sortedGamesArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Locale / name & description
    // --------------------------------------------------

    const localesArr = lodashGet(returnObj, ["localesArr"], []);

    const filteredArr = localesArr.filter((filterObj) => {
      return filterObj.language === localeObj.language;
    });

    if (lodashHas(filteredArr, [0])) {
      returnObj.name = lodashGet(filteredArr, [0, "name"], "");
      returnObj.description = lodashGet(filteredArr, [0, "description"], "");
      returnObj.descriptionShort = lodashGet(
        filteredArr,
        [0, "descriptionShort"],
        ""
      );
    } else {
      returnObj.name = lodashGet(localesArr, [0, "name"], "");
      returnObj.description = lodashGet(localesArr, [0, "description"], "");
      returnObj.descriptionShort = lodashGet(
        localesArr,
        [0, "descriptionShort"],
        ""
      );
    }

    // --------------------------------------------------
    //   follow フォーマット
    // --------------------------------------------------

    const followsObj = lodashGet(returnObj, ["followsObj"], {});
    const adminUsers_id = lodashGet(returnObj, ["users_id"], "");

    headerObj.followsObj = formatFollowsObj({
      followsObj,
      adminUsers_id,
      loginUsers_id,
    });

    // --------------------------------------------------
    //   headerObj
    // --------------------------------------------------

    headerObj.userCommunities_id = returnObj._id;
    headerObj.type = "uc";
    headerObj.createdDate = returnObj.createdDate;
    headerObj.name = returnObj.name;
    headerObj.communityType = returnObj.communityType;

    returnObj.headerObj = headerObj;

    // --------------------------------------------------
    //   不要な項目を削除する
    // --------------------------------------------------

    delete returnObj.localesArr;
    delete returnObj.gamesArr;
    delete returnObj.imagesAndVideosObj;
    delete returnObj.followsObj;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/user-communities/model.js - findForUserCommunity
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunityID: {green ${userCommunityID}}
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
 * 設定用データを取得する
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} userCommunities_id - DB user-communities _id
 * @param {string} userCommunityID - DB user-communities userCommunityID / コミュニティID
 * @return {Array} 取得データ
 */
const findForUserCommunitySettings = async ({
  localeObj,
  loginUsers_id,
  userCommunities_id,
  userCommunityID,
}) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [
      {
        $match: {
          _id: userCommunities_id,
          users_id: loginUsers_id,
        },
      },
    ];

    if (userCommunityID) {
      matchConditionArr = [
        {
          $match: {
            userCommunityID,
            users_id: loginUsers_id,
          },
        },
      ];
    }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaUserCommunities.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      ...matchConditionArr,

      // --------------------------------------------------
      //   games - 関連するゲーム
      // --------------------------------------------------

      {
        $lookup: {
          from: "games",
          let: { letGameCommunities_idsArr: "$gameCommunities_idsArr" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    {
                      $in: [
                        "$gameCommunities_id",
                        "$$letGameCommunities_idsArr",
                      ],
                    },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   games / images-and-videos / サムネイル用
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
                gameCommunities_id: 1,
                urlID: 1,
                name: 1,
                imagesAndVideosThumbnailObj: 1,
              },
            },
          ],
          as: "gamesArr",
        },
      },

      // --------------------------------------------------
      //   images-and-videos / トップ画像
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
      //   images-and-videos / サムネイル用
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: {
            letImagesAndVideosThumbnail_id: "$imagesAndVideosThumbnail_id",
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

      // --------------------------------------------------
      //   follows
      // --------------------------------------------------

      {
        $lookup: {
          from: "follows",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userCommunities_id", "$$let_id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                approval: 1,
                followedArr: 1,
                approvalArr: 1,
                blockArr: 1,
                followedCount: 1,
              },
            },
          ],
          as: "followsObj",
        },
      },

      {
        $unwind: {
          path: "$followsObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          users_id: 1,
          createdDate: 1,
          updatedDateObj: 1,
          userCommunityID: 1,
          localesArr: 1,
          communityType: 1,
          anonymity: 1,
          imagesAndVideosObj: 1,
          imagesAndVideosThumbnailObj: 1,
          gamesArr: 1,
          followsObj: 1,
          gameCommunities_idsArr: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = lodashGet(docArr, [0], {});
    const headerObj = {};

    // --------------------------------------------------
    //   画像の処理
    // --------------------------------------------------

    if (returnObj.imagesAndVideosObj) {
      headerObj.imagesAndVideosObj = formatImagesAndVideosObj({
        localeObj,
        obj: returnObj.imagesAndVideosObj,
      });
    }

    // --------------------------------------------------
    //   関連するゲーム
    // --------------------------------------------------

    if (returnObj.gamesArr) {
      // --------------------------------------------------
      //   gamesArr - 元の配列の順番通りに並べなおす
      // --------------------------------------------------

      const sortedGamesArr = [];
      const gameCommunities_idsArr = lodashGet(
        returnObj,
        ["gameCommunities_idsArr"],
        []
      );
      const gamesArr = lodashGet(returnObj, ["gamesArr"], []);

      for (let gameCommunities_id of gameCommunities_idsArr) {
        const index = gamesArr.findIndex((valueObj) => {
          return valueObj.gameCommunities_id === gameCommunities_id;
        });

        if (index !== -1) {
          sortedGamesArr.push(gamesArr[index]);
        }
      }

      // --------------------------------------------------
      //   画像の処理
      // --------------------------------------------------

      headerObj.gamesArr = formatImagesAndVideosArr({ arr: sortedGamesArr });
    }

    // --------------------------------------------------
    //   Locale / name & description
    // --------------------------------------------------

    const localesArr = lodashGet(returnObj, ["localesArr"], []);

    const filteredArr = localesArr.filter((filterObj) => {
      return filterObj.language === localeObj.language;
    });

    if (lodashHas(filteredArr, [0])) {
      returnObj.name = lodashGet(filteredArr, [0, "name"], "");
      returnObj.description = lodashGet(filteredArr, [0, "description"], "");
      returnObj.descriptionShort = lodashGet(
        filteredArr,
        [0, "descriptionShort"],
        ""
      );
    } else {
      returnObj.name = lodashGet(localesArr, [0, "name"], "");
      returnObj.description = lodashGet(localesArr, [0, "description"], "");
      returnObj.descriptionShort = lodashGet(
        localesArr,
        [0, "descriptionShort"],
        ""
      );
    }

    // --------------------------------------------------
    //   follow フォーマット
    // --------------------------------------------------

    const followsObj = lodashGet(returnObj, ["followsObj"], {});
    const adminUsers_id = lodashGet(returnObj, ["users_id"], "");

    headerObj.followsObj = formatFollowsObj({
      followsObj,
      adminUsers_id,
      loginUsers_id,
    });

    // --------------------------------------------------
    //   headerObj
    // --------------------------------------------------

    headerObj.userCommunities_id = returnObj._id;
    headerObj.type = "uc";
    headerObj.createdDate = returnObj.createdDate;
    headerObj.name = returnObj.name;
    headerObj.communityType = returnObj.communityType;

    returnObj.headerObj = headerObj;

    // --------------------------------------------------
    //   不要な項目を削除する
    // --------------------------------------------------

    delete returnObj.localesArr;
    delete returnObj.gamesArr;
    delete returnObj.followsObj;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/user-communities/model.js - findForUserCommunity
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunityID: {green ${userCommunityID}}
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
 * データを取得する / フォーラム＆募集の更新日時取得用
 * @param {string} userCommunities_id - DB user-communities _id / ID
 * @return {Object} 取得データ
 */
const findForUserCommunityByUserCommunities_id = async ({
  localeObj,
  userCommunities_id,
}) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    const matchConditionArr = [
      {
        $match: {
          _id: userCommunities_id,
        },
      },
    ];

    // --------------------------------------------------
    //   Aggregation - user-communities
    // --------------------------------------------------

    const docArr = await SchemaUserCommunities.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      ...matchConditionArr,

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          createdDate: 0,
          updatedDate: 0,
          gameCommunities_idsArr: 0,
          userCommunityID: 0,
          imagesAndVideos_id: 0,
          imagesAndVideosThumbnail_id: 0,
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = lodashGet(docArr, [0], {});

    // --------------------------------------------------
    //   Locale / name & description
    // --------------------------------------------------

    const localesArr = lodashGet(returnObj, ["localesArr"], []);

    const filteredArr = localesArr.filter((filterObj) => {
      return filterObj.language === localeObj.language;
    });

    if (lodashHas(filteredArr, [0])) {
      returnObj.name = lodashGet(filteredArr, [0, "name"], "");
      returnObj.description = lodashGet(filteredArr, [0, "description"], "");
    } else {
      returnObj.name = lodashGet(localesArr, [0, "name"], "");
      returnObj.description = lodashGet(localesArr, [0, "description"], "");
    }

    // --------------------------------------------------
    //   不要な項目を削除する
    // --------------------------------------------------

    delete returnObj.localesArr;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/user-communities/model.js - findForUserCommunityByUserCommunities_id
    // `);

    // console.log(chalk`
    //   userCommunities_id: {green ${userCommunities_id}}
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
 * ユーザーコミュニティ一覧のデータを取得する / uc/list
 * @param {Object} localeObj - ロケール
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @param {string} keyword - 検索キーワード
 * @return {Array} 取得データ
 */
const findUserCommunitiesList = async ({
  localeObj,
  page = 1,
  limit = process.env.NEXT_PUBLIC_COMMUNITY_LIST_LIMIT,
  keyword,
}) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   parseInt
    // --------------------------------------------------

    let intLimit = parseInt(limit, 10);

    // --------------------------------------------------
    //   $match（ドキュメントの検索用） & count（総数の検索用）の条件作成
    // --------------------------------------------------

    const conditionObj = {
      _id: { $exists: true },
    };

    const pattern = new RegExp(`.*${keyword}.*`);

    if (keyword) {
      lodashSet(conditionObj, ["localesArr.name"], {
        $regex: pattern,
        $options: "i",
      });
    }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaUserCommunities.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      {
        $match: conditionObj,
      },

      // --------------------------------------------------
      //   $sort / $skip / $limit
      // --------------------------------------------------

      { $sort: { updatedDate: -1 } },
      { $skip: (page - 1) * intLimit },
      { $limit: intLimit },

      // --------------------------------------------------
      //   games - 関連するゲーム
      // --------------------------------------------------

      {
        $lookup: {
          from: "games",
          let: { letGameCommunities_idsArr: "$gameCommunities_idsArr" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    {
                      $in: [
                        "$gameCommunities_id",
                        "$$letGameCommunities_idsArr",
                      ],
                    },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   games / images-and-videos / サムネイル用
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
                gameCommunities_id: 1,
                urlID: 1,
                name: 1,
                imagesAndVideosThumbnailObj: 1,
              },
            },
          ],
          as: "gamesArr",
        },
      },

      // --------------------------------------------------
      //   images-and-videos / サムネイル用
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: {
            letImagesAndVideosThumbnail_id: "$imagesAndVideosThumbnail_id",
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

      // --------------------------------------------------
      //   follows
      // --------------------------------------------------

      {
        $lookup: {
          from: "follows",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userCommunities_id", "$$let_id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                approval: 1,
                followedArr: 1,
                approvalArr: 1,
                blockArr: 1,
                followedCount: 1,
              },
            },
          ],
          as: "followsObj",
        },
      },

      {
        $unwind: {
          path: "$followsObj",
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
          updatedDate: 1,
          userCommunityID: 1,
          localesArr: 1,
          communityType: 1,
          gameCommunities_idsArr: 1,
          gamesArr: 1,
          imagesAndVideosThumbnailObj: 1,
          followsObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   Count
    // --------------------------------------------------

    const listCount = await count({
      conditionObj,
    });

    // ---------------------------------------------
    //   Return Value
    // ---------------------------------------------

    const returnObj = {
      page,
      limit: intLimit,
      count: listCount,
      dataObj: {},
    };

    const ISO8601 = moment().utc().toISOString();
    // const daysLimit = parseInt(process.env.NEXT_PUBLIC_COMMUNITY_LIST_UPDATED_DATE_DAYS_LOWER_LIMIT, 10);
    // const followersLimit = parseInt(process.env.NEXT_PUBLIC_COMMUNITY_LIST_FOLLOWERS_LOWER_LIMIT, 10);

    // --------------------------------------------------
    //   Loop
    // --------------------------------------------------

    for (let value1Obj of docArr.values()) {
      // --------------------------------------------------
      //   object
      // --------------------------------------------------

      const obj = {};

      // --------------------------------------------------
      //   Data
      // --------------------------------------------------

      const _id = lodashGet(value1Obj, ["_id"], "");

      obj._id = _id;
      obj.userCommunityID = lodashGet(value1Obj, ["userCommunityID"], "");
      obj.communityType = lodashGet(value1Obj, ["communityType"], "open");
      obj.approval = lodashGet(value1Obj, ["followsObj", "approval"], false);
      // obj.anonymity = lodashGet(value1Obj, ['anonymity'], false);
      obj.followedCount = lodashGet(
        value1Obj,
        ["followsObj", "followedCount"],
        0
      );

      // if (followedCount >= followersLimit) {
      //   obj.followedCount = followedCount;
      // }

      // --------------------------------------------------
      //   createdDate
      // --------------------------------------------------

      const createdDate = lodashGet(value1Obj, ["createdDate"], "");
      obj.createdDate = moment(createdDate).utc().format("YYYY/MM/DD");

      // --------------------------------------------------
      //   画像と動画の処理
      // --------------------------------------------------

      const imagesAndVideosThumbnailObj = lodashGet(
        value1Obj,
        ["imagesAndVideosThumbnailObj"],
        {}
      );

      if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
        const formattedThumbnailObj = formatImagesAndVideosObj({
          localeObj,
          obj: imagesAndVideosThumbnailObj,
        });
        obj.src = lodashGet(
          formattedThumbnailObj,
          ["arr", 0, "src"],
          "/img/common/thumbnail/none-game.jpg"
        );
        obj.srcSet = lodashGet(formattedThumbnailObj, ["arr", 0, "srcSet"], "");
      }

      // --------------------------------------------------
      //   関連するゲーム
      // --------------------------------------------------

      const gamesArr = lodashGet(value1Obj, ["gamesArr"], []);

      if (gamesArr.length > 0) {
        // --------------------------------------------------
        //   gamesArr - 元の配列の順番通りに並べなおす
        // --------------------------------------------------

        const sortedGamesArr = [];
        const gameCommunities_idsArr = lodashGet(
          value1Obj,
          ["gameCommunities_idsArr"],
          []
        );
        const gamesArr = lodashGet(value1Obj, ["gamesArr"], []);

        for (let gameCommunities_id of gameCommunities_idsArr) {
          const index = gamesArr.findIndex((value2Obj) => {
            return value2Obj.gameCommunities_id === gameCommunities_id;
          });

          if (index !== -1) {
            sortedGamesArr.push(gamesArr[index]);
          }
        }

        // --------------------------------------------------
        //   画像の処理
        // --------------------------------------------------

        obj.gamesArr = formatImagesAndVideosArr({ arr: sortedGamesArr });
      }

      // console.log(`
      //   ----- gameCommunities_idsArr -----\n
      //   ${util.inspect(gameCommunities_idsArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- gamesArr -----\n
      //   ${util.inspect(gamesArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- sortedGamesArr -----\n
      //   ${util.inspect(sortedGamesArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   Locale / name & description
      // --------------------------------------------------

      const localesArr = lodashGet(value1Obj, ["localesArr"], []);

      const filteredArr = localesArr.filter((filterObj) => {
        return filterObj.language === localeObj.language;
      });

      if (lodashHas(filteredArr, [0])) {
        obj.name = lodashGet(filteredArr, [0, "name"], "");
        obj.descriptionShort = lodashGet(
          filteredArr,
          [0, "descriptionShort"],
          ""
        );
      } else {
        obj.name = lodashGet(localesArr, [0, "name"], "");
        obj.descriptionShort = lodashGet(
          localesArr,
          [0, "descriptionShort"],
          ""
        );
      }

      // --------------------------------------------------
      //   Set Data
      // --------------------------------------------------

      lodashSet(returnObj, ["dataObj", _id], obj);

      // --------------------------------------------------
      //   Pages Array
      // --------------------------------------------------

      const pagesArr = lodashGet(returnObj, [`page${page}Obj`, "arr"], []);
      pagesArr.push(_id);

      returnObj[`page${page}Obj`] = {
        loadedDate: ISO8601,
        arr: pagesArr,
      };
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/user-communities/model.js - findUserCommunitiesList
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunityID: {green ${userCommunityID}}
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
 * ユーザーコミュニティ一覧のデータを取得する / 共通
 * @param {string} commonType - タイプ / matchConditionArr & sortSkipLimitArr に影響する
 * @param {Object} localeObj - ロケール
 * @param {Array} matchConditionArr - 検索条件
 * @param {Array} sortSkipLimitArr - 並び替えとページャーの条件
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @return {Array} 取得データ
 */
const findUserCommunitiesListCommon = async ({
  commonType = "default",
  localeObj,
  loginUsers_id,
  matchConditionArr = [],
  sortSkipLimitArr = [],
  page = 1,
  limit = process.env.NEXT_PUBLIC_COMMUNITY_LIST_LIMIT,
}) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   parseInt
    // --------------------------------------------------

    const intPage = parseInt(page, 10);
    const intLimit = parseInt(limit, 10);

    // --------------------------------------------------
    //   matchConditionArr & sortSkipLimitArr
    // --------------------------------------------------

    let mcArr = matchConditionArr;
    let sslArr = sortSkipLimitArr;

    if (commonType === "default") {
      sslArr = [
        { $sort: { updatedDate: -1 } },
        { $skip: (intPage - 1) * intLimit },
        { $limit: intLimit },
      ];
    }

    // --------------------------------------------------
    //   $match（ドキュメントの検索用） & count（総数の検索用）の条件作成
    // --------------------------------------------------

    // const conditionObj = {};

    // // ---------------------------------------------
    // //   - 検索条件
    // // ---------------------------------------------

    // if (userCommunities_idsArr.length > 0) {

    //   conditionObj._id = {
    //     $in: userCommunities_idsArr
    //   }

    // }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaUserCommunities.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      ...mcArr,

      // --------------------------------------------------
      //   $sort / $skip / $limit
      // --------------------------------------------------

      ...sslArr,

      // --------------------------------------------------
      //   games - 関連するゲーム
      // --------------------------------------------------

      {
        $lookup: {
          from: "games",
          let: { letGameCommunities_idsArr: "$gameCommunities_idsArr" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    {
                      $in: [
                        "$gameCommunities_id",
                        "$$letGameCommunities_idsArr",
                      ],
                    },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   games / images-and-videos / サムネイル用
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
                gameCommunities_id: 1,
                urlID: 1,
                name: 1,
                imagesAndVideosThumbnailObj: 1,
              },
            },
          ],
          as: "gamesArr",
        },
      },

      // --------------------------------------------------
      //   images-and-videos / サムネイル用
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: {
            letImagesAndVideosThumbnail_id: "$imagesAndVideosThumbnail_id",
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

      // --------------------------------------------------
      //   follows
      // --------------------------------------------------

      {
        $lookup: {
          from: "follows",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userCommunities_id", "$$let_id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                approval: 1,
                followedArr: 1,
                approvalArr: 1,
                blockArr: 1,
                followedCount: 1,
              },
            },
          ],
          as: "followsObj",
        },
      },

      {
        $unwind: {
          path: "$followsObj",
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
          updatedDate: 1,
          userCommunityID: 1,
          users_id: 1,
          localesArr: 1,
          communityType: 1,
          anonymity: 1,
          gameCommunities_idsArr: 1,
          gamesArr: 1,
          imagesAndVideosThumbnailObj: 1,
          followsObj: 1,
        },
      },
    ]).exec();

    // ---------------------------------------------
    //   Return Value
    // ---------------------------------------------

    const returnObj = {};

    // const ISO8601 = moment().utc().toISOString();

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(docArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Loop
    // --------------------------------------------------

    for (let value1Obj of docArr.values()) {
      // --------------------------------------------------
      //   object
      // --------------------------------------------------

      const obj = {};

      // --------------------------------------------------
      //   Data
      // --------------------------------------------------

      const _id = lodashGet(value1Obj, ["_id"], "");

      obj._id = _id;
      obj.userCommunityID = lodashGet(value1Obj, ["userCommunityID"], "");
      obj.communityType = lodashGet(value1Obj, ["communityType"], "open");
      obj.anonymity = lodashGet(value1Obj, ["anonymity"], false);
      obj.approval = lodashGet(value1Obj, ["followsObj", "approval"], false);
      obj.followedCount = lodashGet(
        value1Obj,
        ["followsObj", "followedCount"],
        0
      );

      // ---------------------------------------------
      //   deletable
      // ---------------------------------------------

      obj.deletable = value1Obj.users_id === loginUsers_id ? true : false;

      // --------------------------------------------------
      //   createdDate
      // --------------------------------------------------

      const createdDate = lodashGet(value1Obj, ["createdDate"], "");
      obj.createdDate = moment(createdDate).utc().format("YYYY/MM/DD");

      // --------------------------------------------------
      //   画像と動画の処理
      // --------------------------------------------------

      const imagesAndVideosThumbnailObj = lodashGet(
        value1Obj,
        ["imagesAndVideosThumbnailObj"],
        {}
      );

      if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
        const formattedThumbnailObj = formatImagesAndVideosObj({
          localeObj,
          obj: imagesAndVideosThumbnailObj,
        });
        obj.src = lodashGet(
          formattedThumbnailObj,
          ["arr", 0, "src"],
          "/img/common/thumbnail/none-game.jpg"
        );
        obj.srcSet = lodashGet(formattedThumbnailObj, ["arr", 0, "srcSet"], "");
      }

      // --------------------------------------------------
      //   関連するゲーム
      // --------------------------------------------------

      const gamesArr = lodashGet(value1Obj, ["gamesArr"], []);

      if (gamesArr.length > 0) {
        // --------------------------------------------------
        //   gamesArr - 元の配列の順番通りに並べなおす
        // --------------------------------------------------

        const sortedGamesArr = [];
        const gameCommunities_idsArr = lodashGet(
          value1Obj,
          ["gameCommunities_idsArr"],
          []
        );
        const gamesArr = lodashGet(value1Obj, ["gamesArr"], []);

        for (let gameCommunities_id of gameCommunities_idsArr) {
          const index = gamesArr.findIndex((value2Obj) => {
            return value2Obj.gameCommunities_id === gameCommunities_id;
          });

          if (index !== -1) {
            sortedGamesArr.push(gamesArr[index]);
          }
        }

        // --------------------------------------------------
        //   画像の処理
        // --------------------------------------------------

        obj.gamesArr = formatImagesAndVideosArr({ arr: sortedGamesArr });
      }

      // console.log(`
      //   ----- gameCommunities_idsArr -----\n
      //   ${util.inspect(gameCommunities_idsArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- gamesArr -----\n
      //   ${util.inspect(gamesArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- sortedGamesArr -----\n
      //   ${util.inspect(sortedGamesArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   Locale / name & description
      // --------------------------------------------------

      const localesArr = lodashGet(value1Obj, ["localesArr"], []);

      const filteredArr = localesArr.filter((filterObj) => {
        return filterObj.language === localeObj.language;
      });

      if (lodashHas(filteredArr, [0])) {
        obj.name = lodashGet(filteredArr, [0, "name"], "");
        obj.descriptionShort = lodashGet(
          filteredArr,
          [0, "descriptionShort"],
          ""
        );
      } else {
        obj.name = lodashGet(localesArr, [0, "name"], "");
        obj.descriptionShort = lodashGet(
          localesArr,
          [0, "descriptionShort"],
          ""
        );
      }

      // --------------------------------------------------
      //   Set Data
      // --------------------------------------------------

      lodashSet(returnObj, [_id], obj);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/user-communities/model.js - findUserCommunitiesList
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunityID: {green ${userCommunityID}}
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
 * ユーザーコミュニティ、フォロー、画像＆動画を同時に更新する
 *
 * @param {Object} userCommunitiesConditionObj - DB user-communities 検索条件
 * @param {Object} userCommunitiesSaveObj - DB user-communities 保存データ
 * @param {Object} followsConditionObj - DB follows 検索条件
 * @param {Object} followsSaveObj - DB follows 保存データ
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件 / トップ画像
 * @param {Object} imagesAndVideosSaveObj - DB images-and-videos 保存データ / トップ画像
 * @param {Object} imagesAndVideosThumbnailConditionObj - DB images-and-videos 検索条件 / サムネイル画像
 * @param {Object} imagesAndVideosThumbnailSaveObj - DB images-and-videos 保存データ / サムネイル画像
 * @return {Object}
 */
const transactionForUpsertSettings = async ({
  userCommunitiesConditionObj,
  userCommunitiesSaveObj,
  followsConditionObj,
  followsSaveObj,
  imagesAndVideosConditionObj = {},
  imagesAndVideosSaveObj = {},
  imagesAndVideosThumbnailConditionObj = {},
  imagesAndVideosThumbnailSaveObj = {},
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaUserCommunities.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // --------------------------------------------------
    //   DB user-communities
    // --------------------------------------------------

    await SchemaUserCommunities.updateOne(
      userCommunitiesConditionObj,
      userCommunitiesSaveObj,
      { session, upsert: true }
    );

    // --------------------------------------------------
    //   DB follows
    // --------------------------------------------------

    await SchemaFollows.updateOne(followsConditionObj, followsSaveObj, {
      session,
      upsert: true,
    });

    // --------------------------------------------------
    //   DB images-and-videos / トップ画像
    // --------------------------------------------------

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

    // --------------------------------------------------
    //   DB images-and-videos / サムネイル画像
    // --------------------------------------------------

    if (
      Object.keys(imagesAndVideosThumbnailConditionObj).length !== 0 &&
      Object.keys(imagesAndVideosThumbnailSaveObj).length !== 0
    ) {
      // --------------------------------------------------
      //   画像＆動画を削除する
      // --------------------------------------------------

      const arr = lodashGet(imagesAndVideosThumbnailSaveObj, ["arr"], []);

      if (arr.length === 0) {
        await SchemaImagesAndVideos.deleteOne(
          imagesAndVideosThumbnailConditionObj,
          { session }
        );

        // --------------------------------------------------
        //   画像＆動画を保存
        // --------------------------------------------------
      } else {
        await SchemaImagesAndVideos.updateOne(
          imagesAndVideosThumbnailConditionObj,
          imagesAndVideosThumbnailSaveObj,
          { session, upsert: true }
        );
      }
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
    //   ----- userCommunitiesConditionObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(userCommunitiesConditionObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunitiesSaveObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(userCommunitiesSaveObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsConditionObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(followsConditionObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsSaveObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(followsSaveObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosConditionObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosConditionObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosSaveObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosSaveObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosThumbnailConditionObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosThumbnailConditionObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosThumbnailSaveObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosThumbnailSaveObj)), { colors: true, depth: null })}\n
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
 * Transaction 削除する
 * スレッド、コメント、返信、画像＆動画を削除して、ユーザーコミュニティを更新する
 * @param {Object} forumCommentsConditionObj - DB forum-comments 検索条件
 * @param {Object} forumThreadsConditionObj - DB forum-threads 検索条件
 * @param {Object} followsConditionObj - DB follows 検索条件
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件
 * @param {Object} userCommunitiesConditionObj - DB user-communities 検索条件
 * @return {Object}
 */
const transactionForDelete = async ({
  forumCommentsConditionObj,
  forumThreadsConditionObj,
  followsConditionObj,
  imagesAndVideosConditionObj = {},
  userCommunitiesConditionObj = {},
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaUserCommunities.startSession();

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

    await SchemaForumComments.deleteMany(forumCommentsConditionObj, {
      session,
    });

    // --------------------------------------------------
    //   - forum-threads / deleteMany
    // --------------------------------------------------

    await SchemaForumThreads.deleteMany(forumThreadsConditionObj, { session });

    // --------------------------------------------------
    //   - follows / deleteOne
    // --------------------------------------------------

    await SchemaFollows.deleteOne(followsConditionObj, { session });

    // ---------------------------------------------
    //   - images-and-videos / deleteMany
    // ---------------------------------------------

    if (Object.keys(imagesAndVideosConditionObj).length !== 0) {
      await SchemaImagesAndVideos.deleteMany(imagesAndVideosConditionObj, {
        session,
      });
    }

    // ---------------------------------------------
    //   - user-communities / deleteOne
    // ---------------------------------------------

    if (Object.keys(userCommunitiesConditionObj).length !== 0) {
      await SchemaUserCommunities.deleteOne(userCommunitiesConditionObj, {
        session,
      });
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
    //   app/@database/user-communities/model.js - transactionForDelete
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
    //   ----- followsConditionObj -----\n
    //   ${util.inspect(followsConditionObj, { colors: true, depth: null })}\n
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

  findHeader,
  findForUserCommunity,
  findForUserCommunitySettings,
  findForUserCommunityByUserCommunities_id,
  findUserCommunitiesList,
  findUserCommunitiesListCommon,

  transactionForUpsertSettings,
  transactionForDelete,
};

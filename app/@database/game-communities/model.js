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

const SchemaGameCommunities = require("./schema.js");
const SchemaGames = require("../games/schema.js");

const ModelGames = require("../games/model.js");
const ModelDevelopersPublishers = require("../developers-publishers/model.js");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const { formatImagesAndVideosObj } = require("../images-and-videos/format.js");
const { formatFollowsObj } = require("../follows/format.js");

// ---------------------------------------------
//   Moment Locale
// ---------------------------------------------

moment.locale("ja");

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

    return await SchemaGameCommunities.findOne(conditionObj).exec();
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

    return await SchemaGameCommunities.find(conditionObj).exec();
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

    return await SchemaGameCommunities.countDocuments(conditionObj).exec();
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

    return await SchemaGameCommunities.findOneAndUpdate(conditionObj, saveObj, {
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

    return await SchemaGameCommunities.insertMany(saveArr);
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

    return await SchemaGameCommunities.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * 検索してデータを取得する / For Game Community
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} urlID - DB game-communities urlID
 * @param {string} gameCommunities_id - DB game-communities ゲームコミュニティ固有ID
 * @return {Object} 取得データ
 */
const findForGameCommunity = async ({
  localeObj,
  loginUsers_id,
  urlID,
  gameCommunities_id,
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
          language,
          country,
          urlID,
        },
      },
    ];

    if (gameCommunities_id) {
      matchConditionArr = [
        {
          $match: {
            language,
            country,
            gameCommunities_id,
          },
        },
      ];
    }

    // --------------------------------------------------
    //   Aggregation - games
    // --------------------------------------------------

    const docGamesArr = await SchemaGames.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      ...matchConditionArr,

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
      //   hardwares / ハードウェア
      // --------------------------------------------------

      {
        $lookup: {
          from: "hardwares",
          let: { letHardwareID: "$hardwareArr.hardwareID" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    { $in: ["$hardwareID", "$$letHardwareID"] },
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
      //   game-genres / ジャンル
      // --------------------------------------------------

      {
        $lookup: {
          from: "game-genres",
          let: { letGenreArr: "$genreArr" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$country", country] },
                    { $in: ["$genreID", "$$letGenreArr"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                genreID: 1,
                name: 1,
              },
            },
          ],
          as: "gameGenresArr",
        },
      },

      // --------------------------------------------------
      //   developers-publishers / 開発＆パブリッシャー
      // --------------------------------------------------

      // {
      //   $lookup:
      //     {
      //       from: 'developers-publishers',
      //       let: {
      //         letPublisherIDsArr: '$hardwareArr.publisherIDsArr',
      //         letDeveloperIDsArr: '$hardwareArr.developerIDsArr',
      //       },
      //       pipeline: [
      //         {
      //           $match: {
      //             $expr: {
      //               $or: [
      //                 {
      //                   $and: [
      //                     { $eq: ['$language', language] },
      //                     { $eq: ['$country', country] },
      //                     { $in: ['$developerPublisherID', '$$letPublisherIDsArr'] }
      //                     // { $in: ['$developerPublisherID', ['YtKRcK3Ar']] }
      //                   ]
      //                 },
      //                 {
      //                   $and: [
      //                     { $eq: ['$language', language] },
      //                     { $eq: ['$country', country] },
      //                     { $in: ['$developerPublisherID', '$$letDeveloperIDsArr'] }
      //                     // { $in: ['$developerPublisherID', 'zXOweU_0y'] }
      //                   ]
      //                 }
      //               ]
      //             },
      //           }
      //         },
      //         {
      //           $project: {
      //             _id: 0,
      //             developerPublisherID: 1,
      //             name: 1,
      //             // letPublisherIDsArr: 1,
      //           }
      //         }
      //       ],
      //       as: 'developersPublishersArr'
      //     }
      // },

      // --------------------------------------------------
      //   follows
      // --------------------------------------------------

      {
        $lookup: {
          from: "follows",
          let: { letGameCommunities_id: "$gameCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$gameCommunities_id", "$$letGameCommunities_id"],
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
      //   game-communities
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
                createdDate: 0,
                updatedDate: 0,
                __v: 0,
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
      //   $project
      // --------------------------------------------------

      {
        $project: {
          gameCommunities_id: 1,
          urlID: 1,
          imagesAndVideosObj: 1,
          imagesAndVideosThumbnailObj: 1,
          name: 1,
          subtitle: 1,
          hardwareArr: 1,
          genreArr: 1,
          linkArr: 1,
          hardwaresArr: 1,
          gameGenresArr: 1,
          // developersPublishersArr: 1,
          followsObj: 1,
          gameCommunitiesObj: 1,
        },
      },
    ]).exec();

    // console.log(`
    //   ----- docGamesArr -----\n
    //   ${util.inspect(docGamesArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   docGamesObj
    // --------------------------------------------------

    const docGamesObj = lodashGet(docGamesArr, [0], {});

    // --------------------------------------------------
    //   follow フォーマット
    // --------------------------------------------------

    const followsObj = formatFollowsObj({
      followsObj: lodashGet(docGamesObj, ["followsObj"], {}),
      adminUsers_id: "",
      loginUsers_id,
    });

    // --------------------------------------------------
    //   Developers Publishers
    // --------------------------------------------------

    const hardwareArr = lodashGet(docGamesObj, ["hardwareArr"], []);
    let developerPublisherIDsArr = [];

    // ---------------------------------------------
    //   - Loop
    // ---------------------------------------------

    for (let valueObj of hardwareArr.values()) {
      const developerIDsArr = lodashGet(valueObj, ["developerIDsArr"], []);
      const publisherIDsArr = lodashGet(valueObj, ["publisherIDsArr"], []);

      developerPublisherIDsArr = developerPublisherIDsArr.concat(
        developerIDsArr,
        publisherIDsArr
      );
    }

    // ---------------------------------------------
    //   - 配列の重複している値を削除
    // ---------------------------------------------

    developerPublisherIDsArr = Array.from(new Set(developerPublisherIDsArr));

    // ---------------------------------------------
    //   - find
    // ---------------------------------------------

    const docDevelopersPublishersArr = await ModelDevelopersPublishers.find({
      conditionObj: {
        language,
        country,
        developerPublisherID: { $in: developerPublisherIDsArr },
      },
    });

    // ---------------------------------------------
    //   - 名前だけ配列に入れる
    // ---------------------------------------------

    const developersPublishersArr = [];

    for (let value of developerPublisherIDsArr.values()) {
      const resultObj = docDevelopersPublishersArr.find((valueObj) => {
        return valueObj.developerPublisherID === value;
      });

      if (resultObj) {
        developersPublishersArr.push(resultObj.name);
      }
    }

    docGamesObj.developersPublishersArr = developersPublishersArr;

    // console.log(`
    //   ----- developerPublisherIDsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(developerPublisherIDsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docDevelopersPublishersArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docDevelopersPublishersArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- developersPublishersArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(developersPublishersArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   name
    // --------------------------------------------------

    let name = docGamesObj.name;

    if (docGamesObj.subtitle) {
      name = `${docGamesObj.name}${docGamesObj.subtitle}`;
    }

    // --------------------------------------------------
    //   Locale / name & description
    // --------------------------------------------------

    const headerObj = {
      type: "gc",
      gameCommunities_id: docGamesObj.gameCommunities_id,
      urlID: docGamesObj.urlID,
      name,
      hardwareArr: docGamesObj.hardwareArr,
      genreArr: docGamesObj.genreArr,
      linkArr: docGamesObj.linkArr,
      hardwaresArr: docGamesObj.hardwaresArr,
      gameGenresArr: docGamesObj.gameGenresArr,
      developersPublishersArr: docGamesObj.developersPublishersArr,
      imagesAndVideosObj: formatImagesAndVideosObj({
        localeObj,
        obj: docGamesObj.imagesAndVideosObj,
      }),
      imagesAndVideosThumbnailObj: formatImagesAndVideosObj({
        localeObj,
        obj: docGamesObj.imagesAndVideosThumbnailObj,
      }),
      followsObj,
    };

    // --------------------------------------------------
    //   ヒーローイメージがランダムに表示されるように並び替える
    // --------------------------------------------------

    // const imagesAndVideosObj = lodashGet(headerObj, ['imagesAndVideosObj'], {});

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    if (lodashHas(headerObj, ["imagesAndVideosObj", "arr"])) {
      const arr = lodashGet(headerObj, ["imagesAndVideosObj", "arr"], []);

      // 並び替え
      for (let i = arr.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = arr[i];
        arr[i] = arr[r];
        arr[r] = tmp;
      }

      lodashSet(headerObj, ["imagesAndVideosObj", "arr"], arr);
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = {
      gameCommunitiesObj: docGamesObj.gameCommunitiesObj,
      headerObj,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/game-communities/model.js - findForGameCommunity
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   urlID: {green ${urlID}}
    // `);

    // console.log(`
    //   ----- docGamesArr -----\n
    //   ${util.inspect(docGamesArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docGamesObj -----\n
    //   ${util.inspect(docGamesObj, { colors: true, depth: null })}\n
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
 * @param {string} gameCommunities_id - DB game-communities _id / ID
 * @return {Object} 取得データ
 */
const findForGameCommunityByGameCommunities_id = async ({
  gameCommunities_id,
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
          _id: gameCommunities_id,
        },
      },
    ];

    // --------------------------------------------------
    //   Aggregation - game-communities
    // --------------------------------------------------

    const docArr = await SchemaGameCommunities.aggregate([
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
          __v: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = lodashGet(docArr, [0], {});

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/game-communities/model.js - findForGameCommunityByGameCommunities_id
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
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
 * ゲーム一覧のデータを取得する / gc/list
 * @param {Object} localeObj - ロケール
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @param {Array} hardwareIDsArr - DB hardwares hardwareID の入った配列
 * @param {string} keyword - 検索キーワード
 * @return {Object} 取得データ
 */
const findGamesList = async ({
  localeObj,
  page = 1,
  limit = process.env.NEXT_PUBLIC_COMMUNITY_LIST_LIMIT,
  hardwareIDsArr = [],
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
    // let intLimit = 3;

    // ---------------------------------------------
    //   $match（ドキュメントの検索用） & count（総数の検索用）の条件作成
    // ---------------------------------------------

    const conditionObj = {
      language,
      country,
    };

    // ---------------------------------------------
    //   - 検索条件
    // ---------------------------------------------

    if (hardwareIDsArr.length > 0) {
      lodashSet(conditionObj, ["hardwareArr"], {
        $elemMatch: {
          hardwareID: {
            $in: hardwareIDsArr,
          },
        },
      });
    }

    if (keyword) {
      const pattern = new RegExp(`.*${keyword}.*`);

      const orArr = [
        { name: { $regex: pattern, $options: "i" } },
        { subtitle: { $regex: pattern, $options: "i" } },
        { searchKeywordsArr: { $regex: pattern, $options: "i" } },
      ];
      // lodashSet(conditionObj, ['name'], { $regex: pattern, $options: 'i' });
      // lodashSet(conditionObj, ['searchKeywordsArr'], { $regex: pattern, $options: 'i' });

      lodashSet(conditionObj, ["$or"], orArr);
    }

    // --------------------------------------------------
    //   Aggregation - games
    // --------------------------------------------------

    const docArr = await SchemaGames.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      {
        $match: conditionObj,
      },

      // --------------------------------------------------
      //   game-communities
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
                updatedDate: 1,
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
      //   $sort / $skip / $limit
      // --------------------------------------------------

      { $sort: { "gameCommunitiesObj.updatedDate": -1 } },
      { $skip: (page - 1) * intLimit },
      { $limit: intLimit },

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
          let: { letGameCommunities_id: "$gameCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$gameCommunities_id", "$$letGameCommunities_id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
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
          gameCommunities_id: 1,
          urlID: 1,
          imagesAndVideosThumbnailObj: 1,
          name: 1,
          subtitle: 1,
          hardwareArr: 1,
          followsObj: 1,
          gameCommunitiesObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   Count
    // --------------------------------------------------

    const listCount = await ModelGames.count({
      conditionObj,
    });

    // ---------------------------------------------
    //   - Return Value
    // ---------------------------------------------

    const returnObj = {
      page,
      limit: intLimit,
      count: listCount,
      dataObj: {},
    };

    const ISO8601 = moment().utc().toISOString();
    const daysLimit = parseInt(
      process.env.NEXT_PUBLIC_COMMUNITY_LIST_UPDATED_DATE_DAYS_LOWER_LIMIT,
      10
    );
    const followersLimit = parseInt(
      process.env.NEXT_PUBLIC_COMMUNITY_LIST_FOLLOWERS_LOWER_LIMIT,
      10
    );

    // ---------------------------------------------
    //   - Loop
    // ---------------------------------------------

    for (let valueObj of docArr.values()) {
      // console.log(`
      //   ----- valueObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(valueObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   Deep Copy
      // --------------------------------------------------

      const obj = {};

      // --------------------------------------------------
      //   Data
      // --------------------------------------------------

      const _id = lodashGet(valueObj, ["_id"], "");
      const gameCommunities_id = lodashGet(
        valueObj,
        ["gameCommunities_id"],
        ""
      );
      const updatedDate = lodashGet(
        valueObj,
        ["gameCommunitiesObj", "updatedDate"],
        ""
      );
      const imagesAndVideosThumbnailObj = lodashGet(
        valueObj,
        ["imagesAndVideosThumbnailObj"],
        {}
      );
      const followedCount = lodashGet(
        valueObj,
        ["followsObj", "followedCount"],
        0
      );

      obj._id = _id;
      obj.urlID = lodashGet(valueObj, ["urlID"], "");
      obj.name = lodashGet(valueObj, ["name"], "");
      obj.subtitle = lodashGet(valueObj, ["subtitle"], "");

      if (followedCount >= followersLimit) {
        obj.followedCount = followedCount;
      }

      // --------------------------------------------------
      //   Datetime
      // --------------------------------------------------

      let datetimeCurrent = ISO8601;
      const datetimeUpdated = moment(updatedDate);

      if (datetimeUpdated.isAfter(datetimeCurrent)) {
        datetimeCurrent = datetimeUpdated;
      }

      const days = moment().diff(datetimeUpdated, "days");

      if (days <= daysLimit) {
        obj.datetimeFrom = datetimeUpdated.from(datetimeCurrent);
      }

      // console.log(chalk`
      //   days: {green ${days}}
      // `);

      // --------------------------------------------------
      //   Developers Publishers
      // --------------------------------------------------

      const hardwareArr = lodashGet(valueObj, ["hardwareArr"], []);
      let developerPublisherIDsArr = [];

      // ---------------------------------------------
      //   - Loop
      // ---------------------------------------------

      for (let value2Obj of hardwareArr.values()) {
        const developerIDsArr = lodashGet(value2Obj, ["developerIDsArr"], []);
        const publisherIDsArr = lodashGet(value2Obj, ["publisherIDsArr"], []);

        developerPublisherIDsArr = developerPublisherIDsArr.concat(
          developerIDsArr,
          publisherIDsArr
        );
      }

      // ---------------------------------------------
      //   - 配列の重複している値を削除
      // ---------------------------------------------

      developerPublisherIDsArr = Array.from(new Set(developerPublisherIDsArr));

      // ---------------------------------------------
      //   - find
      // ---------------------------------------------

      const docDevelopersPublishersArr = await ModelDevelopersPublishers.find({
        conditionObj: {
          language,
          country,
          developerPublisherID: { $in: developerPublisherIDsArr },
        },
      });

      // ---------------------------------------------
      //   - 名前だけ配列に入れる
      // ---------------------------------------------

      const developersPublishersArr = [];

      for (let value of developerPublisherIDsArr.values()) {
        const resultObj = docDevelopersPublishersArr.find((value2Obj) => {
          return value2Obj.developerPublisherID === value;
        });

        if (resultObj) {
          developersPublishersArr.push(resultObj.name);
        }
      }

      obj.developersPublishers = developersPublishersArr.join(", ");

      // console.log(`
      //   ----- developerPublisherIDsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(developerPublisherIDsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- docDevelopersPublishersArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(docDevelopersPublishersArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- developersPublishersArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(developersPublishersArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   画像と動画の処理
      // --------------------------------------------------

      const formattedThumbnailObj = formatImagesAndVideosObj({
        localeObj,
        obj: imagesAndVideosThumbnailObj,
      });

      if (Object.keys(formattedThumbnailObj).length !== 0) {
        obj.src = lodashGet(
          formattedThumbnailObj,
          ["arr", 0, "src"],
          "/img/common/thumbnail/none-game.jpg"
        );
        obj.srcSet = lodashGet(formattedThumbnailObj, ["arr", 0, "srcSet"], "");
      }

      // --------------------------------------------------
      //   Set Data
      // --------------------------------------------------

      lodashSet(returnObj, ["dataObj", gameCommunities_id], obj);

      // --------------------------------------------------
      //   Pages Array
      // --------------------------------------------------

      const pagesArr = lodashGet(returnObj, [`page${page}Obj`, "arr"], []);
      pagesArr.push(gameCommunities_id);

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
    //   /app/@database/game-communities/model.js - findGamesList
    // `);

    // console.log(chalk`
    //   page: {green ${page} / ${typeof page}}
    //   intLimit: {green ${intLimit} / ${typeof intLimit}}
    //   (page - 1) * intLimit: {green ${(page - 1) * intLimit} / ${typeof (page - 1) * intLimit}}
    //   keyword: {green ${keyword} / ${typeof keyword}}
    // `);

    // console.log(`
    //   ----- hardwareIDsArr -----\n
    //   ${util.inspect(hardwareIDsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(conditionObj, { colors: true, depth: null })}\n
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
    // return {};
  } catch (err) {
    throw err;
  }
};

/**
 * ゲーム一覧のデータを取得する / 共通
 * @param {string} commonType - タイプ / matchConditionArr & sortSkipLimitArr に影響する
 * @param {Object} localeObj - ロケール
 * @param {Array} matchConditionArr - 検索条件
 * @param {Array} sortSkipLimitArr - 並び替えとページャーの条件
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @return {Object} 取得データ
 */
const findGamesListCommon = async ({
  commonType = "default",
  localeObj,
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
                  updatedDate: 1,
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

        { $sort: { "gameCommunitiesObj.updatedDate": -1 } },
        { $skip: (intPage - 1) * intLimit },
        { $limit: intLimit },
      ];
    }

    // --------------------------------------------------
    //   Aggregation - games
    // --------------------------------------------------

    const docArr = await SchemaGames.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      ...mcArr,

      // --------------------------------------------------
      //   $sort / $skip / $limit
      // --------------------------------------------------

      ...sslArr,

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
          let: { letGameCommunities_id: "$gameCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$gameCommunities_id", "$$letGameCommunities_id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
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
          gameCommunities_id: 1,
          urlID: 1,
          imagesAndVideosThumbnailObj: 1,
          name: 1,
          subtitle: 1,
          hardwareArr: 1,
          followsObj: 1,
          gameCommunitiesObj: 1,
        },
      },
    ]).exec();

    // ---------------------------------------------
    //   - Return Value
    // ---------------------------------------------

    const returnObj = {};

    const ISO8601 = moment().utc().toISOString();
    const daysLimit = parseInt(
      process.env.NEXT_PUBLIC_COMMUNITY_LIST_UPDATED_DATE_DAYS_LOWER_LIMIT,
      10
    );
    const followersLimit = parseInt(
      process.env.NEXT_PUBLIC_COMMUNITY_LIST_FOLLOWERS_LOWER_LIMIT,
      10
    );

    // ---------------------------------------------
    //   - Loop
    // ---------------------------------------------

    for (let valueObj of docArr.values()) {
      // console.log(`
      //   ----- valueObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(valueObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   Deep Copy
      // --------------------------------------------------

      const obj = {};

      // --------------------------------------------------
      //   Data
      // --------------------------------------------------

      const _id = lodashGet(valueObj, ["_id"], "");
      const gameCommunities_id = lodashGet(
        valueObj,
        ["gameCommunities_id"],
        ""
      );
      const updatedDate = lodashGet(
        valueObj,
        ["gameCommunitiesObj", "updatedDate"],
        ""
      );
      const imagesAndVideosThumbnailObj = lodashGet(
        valueObj,
        ["imagesAndVideosThumbnailObj"],
        {}
      );
      const followedCount = lodashGet(
        valueObj,
        ["followsObj", "followedCount"],
        0
      );

      obj._id = _id;
      obj.urlID = lodashGet(valueObj, ["urlID"], "");
      obj.name = lodashGet(valueObj, ["name"], "");
      obj.subtitle = lodashGet(valueObj, ["subtitle"], "");

      if (followedCount >= followersLimit) {
        obj.followedCount = followedCount;
      }

      // --------------------------------------------------
      //   Datetime
      // --------------------------------------------------

      let datetimeCurrent = ISO8601;
      const datetimeUpdated = moment(updatedDate);

      if (datetimeUpdated.isAfter(datetimeCurrent)) {
        datetimeCurrent = datetimeUpdated;
      }

      const days = moment().diff(datetimeUpdated, "days");

      if (days <= daysLimit) {
        obj.datetimeFrom = datetimeUpdated.from(datetimeCurrent);
      }

      // console.log(chalk`
      //   days: {green ${days}}
      // `);

      // --------------------------------------------------
      //   Developers Publishers
      // --------------------------------------------------

      const hardwareArr = lodashGet(valueObj, ["hardwareArr"], []);
      let developerPublisherIDsArr = [];

      // ---------------------------------------------
      //   - Loop
      // ---------------------------------------------

      for (let value2Obj of hardwareArr.values()) {
        const developerIDsArr = lodashGet(value2Obj, ["developerIDsArr"], []);
        const publisherIDsArr = lodashGet(value2Obj, ["publisherIDsArr"], []);

        developerPublisherIDsArr = developerPublisherIDsArr.concat(
          developerIDsArr,
          publisherIDsArr
        );
      }

      // ---------------------------------------------
      //   - 配列の重複している値を削除
      // ---------------------------------------------

      developerPublisherIDsArr = Array.from(new Set(developerPublisherIDsArr));

      // ---------------------------------------------
      //   - find
      // ---------------------------------------------

      const docDevelopersPublishersArr = await ModelDevelopersPublishers.find({
        conditionObj: {
          language,
          country,
          developerPublisherID: { $in: developerPublisherIDsArr },
        },
      });

      // ---------------------------------------------
      //   - 名前だけ配列に入れる
      // ---------------------------------------------

      const developersPublishersArr = [];

      for (let value of developerPublisherIDsArr.values()) {
        const resultObj = docDevelopersPublishersArr.find((value2Obj) => {
          return value2Obj.developerPublisherID === value;
        });

        if (resultObj) {
          developersPublishersArr.push(resultObj.name);
        }
      }

      obj.developersPublishers = developersPublishersArr.join(", ");

      // console.log(`
      //   ----- developerPublisherIDsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(developerPublisherIDsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- docDevelopersPublishersArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(docDevelopersPublishersArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- developersPublishersArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(developersPublishersArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   画像と動画の処理
      // --------------------------------------------------

      const formattedThumbnailObj = formatImagesAndVideosObj({
        localeObj,
        obj: imagesAndVideosThumbnailObj,
      });

      if (Object.keys(formattedThumbnailObj).length !== 0) {
        obj.src = lodashGet(
          formattedThumbnailObj,
          ["arr", 0, "src"],
          "/img/common/thumbnail/none-game.jpg"
        );
        obj.srcSet = lodashGet(formattedThumbnailObj, ["arr", 0, "srcSet"], "");
      }

      // --------------------------------------------------
      //   Set Data
      // --------------------------------------------------

      lodashSet(returnObj, [gameCommunities_id], obj);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/game-communities/model.js - findGamesListCommon
    // `);

    // console.log(chalk`
    //   page: {green ${page} / ${typeof page}}
    //   intLimit: {green ${intLimit} / ${typeof intLimit}}
    //   (page - 1) * intLimit: {green ${(page - 1) * intLimit} / ${typeof (page - 1) * intLimit}}
    //   keyword: {green ${keyword} / ${typeof keyword}}
    // `);

    // console.log(`
    //   ----- hardwareIDsArr -----\n
    //   ${util.inspect(hardwareIDsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(conditionObj, { colors: true, depth: null })}\n
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
    // return {};
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
  insertMany,
  deleteMany,

  findForGameCommunity,
  findForGameCommunityByGameCommunities_id,
  findGamesList,
  findGamesListCommon,
};

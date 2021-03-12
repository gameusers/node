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

const SchemaFollows = require("./schema");
const SchemaForumThreads = require("../forum-threads/schema.js");
const SchemaForumComments = require("../forum-comments/schema.js");
const SchemaRecruitmentThreads = require("../recruitment-threads/schema.js");
const SchemaRecruitmentComments = require("../recruitment-comments/schema.js");
// const SchemaImagesAndVideos = require('../images-and-videos/schema.js');
const SchemaGameCommunities = require("../game-communities/schema.js");
const SchemaUserCommunities = require("../user-communities/schema.js");

const ModelForumThreads = require("../forum-threads/model.js");
const ModelRecruitmentThreads = require("../recruitment-threads/model.js");
const ModelGameCommunities = require("../game-communities/model.js");
const ModelUserCommunities = require("../user-communities/model.js");

const ModelDevelopersPublishers = require("../developers-publishers/model.js");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const {
  formatImagesAndVideosObj,
  formatImagesAndVideosArr,
} = require("../images-and-videos/format");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

// const { CustomError } = require('../../@modules/error/custom');
// const { verifyAuthority } = require('../../@modules/authority');

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

    return await SchemaFollows.findOne(conditionObj).exec();
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

    return await SchemaFollows.find(conditionObj).exec();
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

    return await SchemaFollows.countDocuments(conditionObj).exec();
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

    return await SchemaFollows.findOneAndUpdate(conditionObj, saveObj, {
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

    return await SchemaFollows.insertMany(saveArr);
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

    return await SchemaFollows.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * フォローしているゲームコミュニティの一覧データを取得する / pages/api/v2/ur/[userID]/follow/list.js
 * @param {Object} localeObj - ロケール
 * @param {string} users_id - DB users _id / ユーザーID
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @return {Object} 取得データ
 */
const findFollowListGc = async ({
  localeObj,
  users_id,
  page = 1,
  limit = process.env.NEXT_PUBLIC_FOLLOW_LIST_LIMIT,
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

    let intPage = parseInt(page, 10);
    let intLimit = parseInt(limit, 10);

    // ---------------------------------------------
    //   $match（ドキュメントの検索用） & count（総数の検索用）の条件作成
    // ---------------------------------------------

    const conditionObj = {
      followedArr: { $in: [users_id] },
      gameCommunities_id: { $exists: true },
      userCommunities_id: "",
      users_id: "",
    };

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaFollows.aggregate([
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
          // preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $sort / $skip / $limit
      // --------------------------------------------------

      { $sort: { "gameCommunitiesObj.updatedDate": -1 } },
      { $skip: (intPage - 1) * intLimit },
      { $limit: intLimit },

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
            //   games / images-and-videos / サムネイル画像
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
                _id: 0,
                urlID: 1,
                name: 1,
                subtitle: 1,
                hardwareArr: 1,
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
      //   $project
      // --------------------------------------------------

      {
        $project: {
          gameCommunities_id: 1,
          followedCount: 1,
          gameCommunitiesObj: 1,
          gamesObj: 1,
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

    for (let value1Obj of docArr.values()) {
      // console.log(`
      //   ----- value1Obj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(value1Obj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   Deep Copy
      // --------------------------------------------------

      const obj = {};

      // --------------------------------------------------
      //   Data
      // --------------------------------------------------

      const gameCommunities_id = lodashGet(
        value1Obj,
        ["gameCommunities_id"],
        ""
      );
      const updatedDate = lodashGet(
        value1Obj,
        ["gameCommunitiesObj", "updatedDate"],
        ""
      );
      const imagesAndVideosThumbnailObj = lodashGet(
        value1Obj,
        ["gamesObj", "imagesAndVideosThumbnailObj"],
        {}
      );
      const followedCount = lodashGet(value1Obj, ["followedCount"], 0);

      obj.urlID = lodashGet(value1Obj, ["gamesObj", "urlID"], "");
      obj.name = lodashGet(value1Obj, ["gamesObj", "name"], "");
      obj.subtitle = lodashGet(value1Obj, ["gamesObj", "subtitle"], "");

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

      const hardwareArr = lodashGet(value1Obj, ["gamesObj", "hardwareArr"], []);
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
    //   app/@database/follows/model.js - findFollowListGc
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id} / ${typeof loginUsers_id}}
    //   page: {green ${page} / ${typeof page}}
    //   limit: {green ${limit} / ${typeof limit}}
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
  } catch (err) {
    throw err;
  }
};

/**
 * 参加しているユーザーコミュニティ一覧のデータを取得する /
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} users_id - DB users _id / ユーザーID
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @return {Object} 取得データ
 */
const findFollowListUc = async ({
  localeObj,
  loginUsers_id,
  users_id,
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

    let intPage = parseInt(page, 10);
    let intLimit = parseInt(limit, 10);

    // --------------------------------------------------
    //   $match（ドキュメントの検索用） & count（総数の検索用）の条件作成
    // --------------------------------------------------

    const conditionObj = {
      followedArr: { $in: [users_id] },
      gameCommunities_id: "",
      userCommunities_id: { $exists: true },
      users_id: "",
      // userCommunities_id: { $ne: null },
      // userCommunities_id: { $ne: ''},
    };

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaFollows.aggregate([
      // --------------------------------------------------
      //   Match Condition Array
      // --------------------------------------------------

      {
        $match: conditionObj,
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
                  $eq: ["$_id", "$$letUserCommunities_id"],
                },
              },
            },

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
                createdDate: 1,
                updatedDate: 1,
                userCommunityID: 1,
                users_id: 1,
                localesArr: 1,
                communityType: 1,
                gameCommunities_idsArr: 1,
                gamesArr: 1,
                imagesAndVideosThumbnailObj: 1,
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
      //   $sort / $skip / $limit
      // --------------------------------------------------

      // { $sort: { 'userCommunitiesObj.updatedDate': -1 } },
      // { $skip: (intPage - 1) * intLimit },
      // { $limit: intLimit },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          userCommunitiesObj: 1,
          followedCount: 1,
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

      const userCommunities_id = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "_id"],
        ""
      );
      const users_id = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "users_id"],
        ""
      );

      obj.userCommunityID = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "userCommunityID"],
        ""
      );
      obj.communityType = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "communityType"],
        "open"
      );
      obj.approval = lodashGet(value1Obj, ["approval"], false);
      obj.followedCount = lodashGet(value1Obj, ["followedCount"], 0);
      obj.owner = loginUsers_id === users_id ? true : false;

      // --------------------------------------------------
      //   createdDate
      // --------------------------------------------------

      const createdDate = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "createdDate"],
        ""
      );
      obj.createdDate = moment(createdDate).utc().format("YYYY/MM/DD");

      // --------------------------------------------------
      //   画像と動画の処理
      // --------------------------------------------------

      const imagesAndVideosThumbnailObj = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "imagesAndVideosThumbnailObj"],
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

      const gamesArr = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "gamesArr"],
        []
      );

      if (gamesArr.length > 0) {
        // --------------------------------------------------
        //   gamesArr - 元の配列の順番通りに並べなおす
        // --------------------------------------------------

        const sortedGamesArr = [];
        const gameCommunities_idsArr = lodashGet(
          value1Obj,
          ["userCommunitiesObj", "gameCommunities_idsArr"],
          []
        );

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

      const localesArr = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "localesArr"],
        []
      );

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

      lodashSet(returnObj, ["dataObj", userCommunities_id], obj);

      // --------------------------------------------------
      //   Pages Array
      // --------------------------------------------------

      const pagesArr = lodashGet(returnObj, [`page${page}Obj`, "arr"], []);
      pagesArr.push(userCommunities_id);

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
    //   app/@database/follows/model.js - findFollowListUc
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
 *
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @return {Object} 取得データ
 */
const findFollowContents = async ({
  req,
  localeObj,
  loginUsers_id,
  users_id,
  category = "all",
  contents = "all",
  period = process.env.NEXT_PUBLIC_FOLLOW_CONTENTS_PERIOD,
  page = 1,
  limit = process.env.NEXT_PUBLIC_FOLLOW_CONTENTS_LIMIT,
  forumCommentLimit = process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
  forumReplyLimit = process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
  recruitmentCommentLimit = process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
  recruitmentReplyLimit = process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
}) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   parseInt
    // --------------------------------------------------

    const intPeriod = parseInt(period, 10);
    const intPage = parseInt(page, 10);
    const intLimit = parseInt(limit, 10);

    // --------------------------------------------------
    //   Period
    // --------------------------------------------------

    // const datePeriod = new Date("2018-02-05T12:00:00.000Z");
    const datePeriod = moment().utc().add(-intPeriod, "minutes").toDate();

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = {
      pageObj: {
        page: intPage,
        limit: intLimit,
        count: 0,
        arr: [],
      },
      forumObj: {},
      recruitmentObj: {},
      gameCommunityObj: {},
      userCommunityObj: {},
    };

    // --------------------------------------------------
    //   _id を取得する
    // --------------------------------------------------

    const docFollowsArr = await find({
      conditionObj: {
        followedArr: { $in: [users_id] },
      },
    });

    let gameCommunities_idsArr = [];
    let userCommunities_idsArr = [];
    let users_idsArr = [];
    let checkUnauthorizedUserCommunities_idsArr = [];

    for (let valueObj of docFollowsArr.values()) {
      if (valueObj.gameCommunities_id) {
        gameCommunities_idsArr.push(valueObj.gameCommunities_id);
      } else if (valueObj.userCommunities_id) {
        userCommunities_idsArr.push(valueObj.userCommunities_id);
        checkUnauthorizedUserCommunities_idsArr.push(
          valueObj.userCommunities_id
        );
      } else if (valueObj.users_id) {
        users_idsArr.push(valueObj.users_id);
      }
    }

    // --------------------------------------------------
    //   category の指定がある場合は、必要のない _id の入った配列を空にする
    // --------------------------------------------------

    if (category === "gc") {
      userCommunities_idsArr = [];
      users_idsArr = [];
    } else if (category === "uc") {
      gameCommunities_idsArr = [];
      users_idsArr = [];
    } else if (category === "ur") {
      gameCommunities_idsArr = [];
      userCommunities_idsArr = [];
    }

    // --------------------------------------------------
    //  フォローしたユーザーのコンテンツを取得する
    //  フォーラム＆募集の最新投稿から forumThreads_id を recruitmentThreads_id を取得する
    //   本人のみに表示する
    // --------------------------------------------------

    let docContentsIdsUrArr = [];

    if (
      (category === "all" || category === "ur") &&
      loginUsers_id &&
      users_id &&
      loginUsers_id === users_id
    ) {
      // --------------------------------------------------
      //   All
      // --------------------------------------------------

      if (contents === "all") {
        docContentsIdsUrArr = await SchemaForumComments.aggregate([
          // --------------------------------------------------
          //   $unionWith
          // --------------------------------------------------

          { $unionWith: "recruitment-comments" },
          { $unionWith: "recruitment-replies" },

          // --------------------------------------------------
          //   Match Condition Array
          // --------------------------------------------------

          {
            $match: {
              users_id: { $in: users_idsArr },
              anonymity: { $ne: true },
              updatedDate: { $gte: datePeriod },
            },
          },

          // --------------------------------------------------
          //   $project
          // --------------------------------------------------

          {
            $project: {
              _id: 0,
              userCommunities_id: 1,
              forumThreads_id: 1,
              recruitmentThreads_id: 1,
            },
          },
        ]).exec();

        // --------------------------------------------------
        //   Forum
        // --------------------------------------------------
      } else if (contents === "forum") {
        docContentsIdsUrArr = await SchemaForumComments.aggregate([
          // --------------------------------------------------
          //   Match Condition Array
          // --------------------------------------------------

          {
            $match: {
              users_id: { $in: users_idsArr },
              anonymity: { $ne: true },
              updatedDate: { $gte: datePeriod },
            },
          },

          // --------------------------------------------------
          //   $project
          // --------------------------------------------------

          {
            $project: {
              _id: 0,
              userCommunities_id: 1,
              forumThreads_id: 1,
            },
          },
        ]).exec();

        // --------------------------------------------------
        //   Recruitment
        // --------------------------------------------------
      } else if (contents === "rec") {
        docContentsIdsUrArr = await SchemaRecruitmentComments.aggregate([
          // --------------------------------------------------
          //   $unionWith
          // --------------------------------------------------

          { $unionWith: "recruitment-replies" },

          // --------------------------------------------------
          //   Match Condition Array
          // --------------------------------------------------

          {
            $match: {
              users_id: { $in: users_idsArr },
              updatedDate: { $gte: datePeriod },
            },
          },

          // --------------------------------------------------
          //   $project
          // --------------------------------------------------

          {
            $project: {
              _id: 0,
              recruitmentThreads_id: 1,
            },
          },
        ]).exec();
      }

      // --------------------------------------------------
      //   checkUnauthorizedUserCommunities_idsArr に userCommunities_id を追加する
      //   これはクローズドユーザーコミュニティの表示権限を調べるための配列
      // --------------------------------------------------

      for (let valueObj of docContentsIdsUrArr.values()) {
        if (valueObj.userCommunities_id) {
          checkUnauthorizedUserCommunities_idsArr.push(
            valueObj.userCommunities_id
          );
        }
      }

      // --------------------------------------------------
      //   配列の重複している値を削除
      // --------------------------------------------------

      checkUnauthorizedUserCommunities_idsArr = Array.from(
        new Set(checkUnauthorizedUserCommunities_idsArr)
      );
    }

    // --------------------------------------------------
    //   ログインしているユーザーが同じクローズドコミュニティに入っていない場合は
    //   コンテンツを表示する権限がないため userCommunities_idsArr 配列から userCommunities_id を削除する
    // --------------------------------------------------

    const unauthorizedUserCommunities_idsArr = [];

    if (checkUnauthorizedUserCommunities_idsArr.length > 0) {
      // --------------------------------------------------
      //   Aggregation
      // --------------------------------------------------

      const docUserCommunitiesArr = await SchemaUserCommunities.aggregate([
        // --------------------------------------------------
        //   Match Condition Array
        // --------------------------------------------------

        {
          $match: {
            _id: { $in: checkUnauthorizedUserCommunities_idsArr },
            communityType: "closed",
          },
        },

        // --------------------------------------------------
        //   follows
        // --------------------------------------------------

        {
          $lookup: {
            from: "follows",
            let: { letUserCommunities_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$userCommunities_id", "$$letUserCommunities_id"],
                      },
                    ],
                  },
                },
              },

              {
                $project: {
                  _id: 0,
                  followedArr: 1,
                },
              },
            ],
            as: "followsObj",
          },
        },

        {
          $unwind: {
            path: "$followsObj",
          },
        },

        // --------------------------------------------------
        //   $project
        // --------------------------------------------------

        {
          $project: {
            _id: 1,
            followsObj: 1,
          },
        },
      ]).exec();

      // --------------------------------------------------
      //   ログインしていない、または同じクローズドコミュニティに参加していない場合、userCommunities_id を削除
      // --------------------------------------------------

      for (let valueObj of docUserCommunitiesArr.values()) {
        const followedArr = lodashGet(
          valueObj,
          ["followsObj", "followedArr"],
          []
        );

        if (!loginUsers_id || !followedArr.includes(loginUsers_id)) {
          const index = userCommunities_idsArr.indexOf(valueObj._id);

          if (index !== 1) {
            userCommunities_idsArr.splice(index, 1);
          }

          unauthorizedUserCommunities_idsArr.push(valueObj._id);
        }

        // console.log(`
        //   ----- followedArr -----\n
        //   ${util.inspect(followedArr, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }
    }

    // --------------------------------------------------
    //   ループで forumThreads_idsArr と recruitmentThreads_idsArr に追加する
    //   表示する権限がないユーザーコミュニティのコンテンツは除く
    // --------------------------------------------------

    const forumRecruitmentThreads_idsArr = [];

    for (let valueObj of docContentsIdsUrArr.values()) {
      // console.log(`
      //   ----- valueObj -----\n
      //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      if (
        !unauthorizedUserCommunities_idsArr.includes(
          valueObj.userCommunities_id
        )
      ) {
        if (valueObj.forumThreads_id) {
          forumRecruitmentThreads_idsArr.push(valueObj.forumThreads_id);
        } else if (valueObj.recruitmentThreads_id) {
          forumRecruitmentThreads_idsArr.push(valueObj.recruitmentThreads_id);
        }
      }
    }

    // console.log(chalk`
    // loginUsers_id: {green ${loginUsers_id}}
    // users_id: {green ${users_id}}
    // category: {green ${category}}
    // contents: {green ${contents}}
    // period: {green ${period}}
    // page: {green ${page}}
    // limit: {green ${limit}}
    // forumCommentLimit: {green ${forumCommentLimit}}
    // forumReplyLimit: {green ${forumReplyLimit}}
    // recruitmentCommentLimit: {green ${recruitmentCommentLimit}}
    // recruitmentReplyLimit: {green ${recruitmentReplyLimit}}
    // `);

    // console.log(`
    //   ----- checkUnauthorizedUserCommunities_idsArr -----\n
    //   ${util.inspect(checkUnauthorizedUserCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- unauthorizedUserCommunities_idsArr -----\n
    //   ${util.inspect(unauthorizedUserCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- gameCommunities_idsArr -----\n
    //   ${util.inspect(gameCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunities_idsArr -----\n
    //   ${util.inspect(userCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumRecruitmentThreads_idsArr -----\n
    //   ${util.inspect(forumRecruitmentThreads_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   フォーラムと募集を結合して、更新日時で並び替えてから _id を取得する
    // --------------------------------------------------

    // ---------------------------------------------
    //   検索条件
    // ---------------------------------------------

    const orArr = [];

    if (gameCommunities_idsArr.length > 0) {
      orArr.push({
        gameCommunities_id: { $in: gameCommunities_idsArr },
      });
    }

    if (userCommunities_idsArr.length > 0) {
      orArr.push({
        userCommunities_id: { $in: userCommunities_idsArr },
      });
    }

    if (forumRecruitmentThreads_idsArr.length > 0) {
      orArr.push({
        _id: { $in: forumRecruitmentThreads_idsArr },
      });
    }

    const conditionObj = {
      $or: orArr,
      updatedDate: { $gte: datePeriod },
    };

    // --------------------------------------------------
    //   検索条件がない場合は処理停止
    // --------------------------------------------------

    if (orArr.length === 0) {
      return returnObj;
    }

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(conditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   コンテンツ取得
    // --------------------------------------------------

    let threadCountObj = {};
    let docContentsIdsArr = [];

    // --------------------------------------------------
    //   すべて
    // --------------------------------------------------

    if (contents === "all") {
      // --------------------------------------------------
      //   総数を取得
      // --------------------------------------------------

      threadCountObj = await SchemaForumThreads.aggregate([
        // --------------------------------------------------
        //   $unionWith
        // --------------------------------------------------

        { $unionWith: "recruitment-threads" },

        // --------------------------------------------------
        //   Match Condition Array
        // --------------------------------------------------

        {
          $match: conditionObj,
        },

        // --------------------------------------------------
        //   $group
        // --------------------------------------------------

        { $group: { _id: null, n: { $sum: 1 } } },
      ]).exec();

      // --------------------------------------------------
      //   _id を取得するためのデータ
      // --------------------------------------------------

      docContentsIdsArr = await SchemaForumThreads.aggregate([
        // --------------------------------------------------
        //   $unionWith
        // --------------------------------------------------

        { $unionWith: "recruitment-threads" },

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
        { $skip: (intPage - 1) * intLimit },
        { $limit: intLimit },

        // --------------------------------------------------
        //   $project
        // --------------------------------------------------

        {
          $project: {
            _id: 1,
            gameCommunities_id: 1,
            userCommunities_id: 1,
            publicInformationsArr: 1,
          },
        },
      ]).exec();

      // --------------------------------------------------
      //   スレッド
      // --------------------------------------------------
    } else if (contents === "forum") {
      // --------------------------------------------------
      //   総数を取得
      // --------------------------------------------------

      threadCountObj = await SchemaForumThreads.aggregate([
        // --------------------------------------------------
        //   Match Condition Array
        // --------------------------------------------------

        {
          $match: conditionObj,
        },

        // --------------------------------------------------
        //   $group
        // --------------------------------------------------

        { $group: { _id: null, n: { $sum: 1 } } },
      ]).exec();

      // --------------------------------------------------
      //   _id を取得するためのデータ
      // --------------------------------------------------

      docContentsIdsArr = await SchemaForumThreads.aggregate([
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
        { $skip: (intPage - 1) * intLimit },
        { $limit: intLimit },

        // --------------------------------------------------
        //   $project
        // --------------------------------------------------

        {
          $project: {
            _id: 1,
            gameCommunities_id: 1,
            userCommunities_id: 1,
            publicInformationsArr: 1,
          },
        },
      ]).exec();

      // --------------------------------------------------
      //   募集
      // --------------------------------------------------
    } else if (contents === "rec") {
      // --------------------------------------------------
      //   総数を取得
      // --------------------------------------------------

      threadCountObj = await SchemaRecruitmentThreads.aggregate([
        // --------------------------------------------------
        //   Match Condition Array
        // --------------------------------------------------

        {
          $match: conditionObj,
        },

        // --------------------------------------------------
        //   $group
        // --------------------------------------------------

        { $group: { _id: null, n: { $sum: 1 } } },
      ]).exec();

      // --------------------------------------------------
      //   _id を取得するためのデータ
      // --------------------------------------------------

      docContentsIdsArr = await SchemaRecruitmentThreads.aggregate([
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
        { $skip: (intPage - 1) * intLimit },
        { $limit: intLimit },

        // --------------------------------------------------
        //   $project
        // --------------------------------------------------

        {
          $project: {
            _id: 1,
            gameCommunities_id: 1,
            userCommunities_id: 1,
            publicInformationsArr: 1,
          },
        },
      ]).exec();
    }

    // --------------------------------------------------
    //   _id を分配する
    // --------------------------------------------------

    const arr = [];

    const forumThreads_idsArr = [];
    const recruitmentThreads_idsArr = [];

    gameCommunities_idsArr = [];
    userCommunities_idsArr = [];

    for (let valueObj of docContentsIdsArr.values()) {
      // --------------------------------------------------
      //   forumThreads_id & recruitmentThreads_id
      // --------------------------------------------------

      if (valueObj.publicInformationsArr) {
        arr.push({
          _id: valueObj._id,
          type: "recruitment",
        });

        recruitmentThreads_idsArr.push(valueObj._id);
      } else {
        arr.push({
          _id: valueObj._id,
          type: "forum",
        });

        forumThreads_idsArr.push(valueObj._id);
      }

      // --------------------------------------------------
      //   gameCommunities_id & userCommunities_id
      // --------------------------------------------------

      if (valueObj.gameCommunities_id) {
        gameCommunities_idsArr.push(valueObj.gameCommunities_id);
      } else if (valueObj.userCommunities_id) {
        userCommunities_idsArr.push(valueObj.userCommunities_id);
      }
    }

    // --------------------------------------------------
    //   count & arr
    // --------------------------------------------------

    returnObj.pageObj.count = lodashGet(threadCountObj, [0, "n"], 0);
    returnObj.pageObj.arr = arr;

    // console.log(`
    //   ----- docContentsIdsArr -----\n
    //   ${util.inspect(docContentsIdsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- gameCommunities_idsArr -----\n
    //   ${util.inspect(gameCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunities_idsArr -----\n
    //   ${util.inspect(userCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- users_idsArr -----\n
    //   ${util.inspect(users_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumThreads_idsArr -----\n
    //   ${util.inspect(forumThreads_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- recruitmentThreads_idsArr -----\n
    //   ${util.inspect(recruitmentThreads_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- gameCommunities_idsArr -----\n
    //   ${util.inspect(gameCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunities_idsArr -----\n
    //   ${util.inspect(userCommunities_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   コンテンツ取得
    // --------------------------------------------------

    // ---------------------------------------------
    //   フォーラム
    // ---------------------------------------------

    if (forumThreads_idsArr.length > 0) {
      returnObj.forumObj = await ModelForumThreads.findForumCommon({
        req,
        localeObj,
        loginUsers_id,
        matchConditionArr: [
          {
            $match: {
              _id: { $in: forumThreads_idsArr },
            },
          },
        ],
        sortSkipLimitArr: [],
        commentLimit: forumCommentLimit,
        replyLimit: forumReplyLimit,
      });
    }

    // ---------------------------------------------
    //   募集
    // ---------------------------------------------

    if (recruitmentThreads_idsArr.length > 0) {
      returnObj.recruitmentObj = await ModelRecruitmentThreads.findRecruitmentCommon(
        {
          req,
          localeObj,
          loginUsers_id,
          matchConditionArr: [
            {
              $match: {
                _id: { $in: recruitmentThreads_idsArr },
              },
            },
          ],
          sortSkipLimitArr: [],
          format: true,
          commentLimit: recruitmentCommentLimit,
          replyLimit: recruitmentReplyLimit,
        }
      );
    }

    // --------------------------------------------------
    //   コミュニティ一覧取得
    // --------------------------------------------------

    // ---------------------------------------------
    //   ゲームコミュニティ
    // ---------------------------------------------

    if (gameCommunities_idsArr.length > 0) {
      // ---------------------------------------------
      //   - 配列の重複している値を削除
      // ---------------------------------------------

      gameCommunities_idsArr = Array.from(new Set(gameCommunities_idsArr));

      // --------------------------------------------------
      //   Language & Country
      // --------------------------------------------------

      const language = lodashGet(localeObj, ["language"], "");
      const country = lodashGet(localeObj, ["country"], "");

      // ---------------------------------------------
      //   - データ取得
      // ---------------------------------------------

      returnObj.gameCommunityObj = await ModelGameCommunities.findGamesListCommon(
        {
          commonType: "followContents",
          localeObj,
          matchConditionArr: [
            {
              $match: {
                language,
                country,
                gameCommunities_id: {
                  $in: gameCommunities_idsArr,
                },
              },
            },
          ],
          page: intPage,
          limit: intLimit,
        }
      );
    }

    // ---------------------------------------------
    //   ユーザーコミュニティ
    // ---------------------------------------------

    if (userCommunities_idsArr.length > 0) {
      // ---------------------------------------------
      //   - 配列の重複している値を削除
      // ---------------------------------------------

      userCommunities_idsArr = Array.from(new Set(userCommunities_idsArr));

      // ---------------------------------------------
      //   - データ取得
      // ---------------------------------------------

      returnObj.userCommunityObj = await ModelUserCommunities.findUserCommunitiesListCommon(
        {
          commonType: "followContents",
          localeObj,
          loginUsers_id,
          matchConditionArr: [
            {
              $match: {
                _id: {
                  $in: userCommunities_idsArr,
                },
              },
            },
          ],
          page: intPage,
          limit: intLimit,
        }
      );
    }

    // console.log(`
    //   ----- returnObj.forumObj.forumThreadsObj -----\n
    //   ${util.inspect(returnObj.forumObj.forumThreadsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj.recruitmentObj -----\n
    //   ${util.inspect(returnObj.recruitmentObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj.recruitmentObj.recruitmentThreadsObj -----\n
    //   ${util.inspect(returnObj.recruitmentObj.recruitmentThreadsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj.gameCommunityObj -----\n
    //   ${util.inspect(returnObj.gameCommunityObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj.userCommunityObj -----\n
    //   ${util.inspect(returnObj.userCommunityObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   app/@database/follows/model.js - findFollowContents
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id} / ${typeof loginUsers_id}}
    //   users_id: {green ${users_id} / ${typeof users_id}}
    //   period: {green ${period} / ${typeof period}}
    //   page: {green ${page} / ${typeof page}}
    //   limit: {green ${limit} / ${typeof limit}}
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
 * フォローしているゲームコミュニティのフォーラムを取得する /
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {number} page - ページ
 * @param {number} limit - リミット
 * @return {Object} 取得データ
 */
// const findFollowContentsAll = async ({

//   localeObj,
//   loginUsers_id,
//   period,
//   gameCommunities_idsArr,
//   userCommunities_idsArr,
//   users_idsArr,
//   page = 1,
//   limit = process.env.NEXT_PUBLIC_FOLLOW_LIST_LIMIT,

// }) => {

//   // --------------------------------------------------
//   //   Database
//   // --------------------------------------------------

//   try {

//     // --------------------------------------------------
//     //   Language & Country
//     // --------------------------------------------------

//     // const docFollowsArr = await find({

//     //   conditionObj: {

//     //   }

//     // });

//     const intPage = 1;
//     const intLimit = 10;

//     // --------------------------------------------------
//     //   Aggregation
//     // --------------------------------------------------

//     const docArr = await SchemaForumThreads.aggregate([

//       { $unionWith: "recruitment-threads" },

//       // --------------------------------------------------
//       //   Match Condition Array
//       // --------------------------------------------------

//       {
//         $match: {

//           $or: [
//             { gameCommunities_id: { $in: gameCommunities_idsArr } },
//             { userCommunities_id: { $in: userCommunities_idsArr } },
//             // { users_id: { $in: users_idsArr } },
//           ],

//           // updatedDate: { $gte: dateTimeLimit }
//           updatedDate: { $gte: new Date("2021-02-05T12:00:00.000Z") }

//         }
//       },
//       // ...matchConditionArr,

//       // --------------------------------------------------
//       //   $sort / $skip / $limit
//       // --------------------------------------------------

//       // { $sort: { updatedDate: -1 } },
//       // { $skip: (1 - 1) * 3 },
//       // { $limit: 3 },

//       { $sort: { updatedDate: -1 } },
//       { $skip: (intPage - 1) * intLimit },
//       { $limit: intLimit },

//       // --------------------------------------------------
//       //   images-and-videos
//       // --------------------------------------------------

//       // {
//       //   $lookup:
//       //     {
//       //       from: 'images-and-videos',
//       //       let: { letImagesAndVideos_id: '$imagesAndVideos_id' },
//       //       pipeline: [
//       //         {
//       //           $match: {
//       //             $expr: {
//       //               $eq: ['$_id', '$$letImagesAndVideos_id']
//       //             },
//       //           }
//       //         },
//       //         {
//       //           $project: {
//       //             createdDate: 0,
//       //             updatedDate: 0,
//       //             users_id: 0,
//       //             __v: 0,
//       //           }
//       //         }
//       //       ],
//       //       as: 'imagesAndVideosObj'
//       //     }
//       // },

//       // {
//       //   $unwind: {
//       //     path: '$imagesAndVideosObj',
//       //     preserveNullAndEmptyArrays: true,
//       //   }
//       // },

//       // --------------------------------------------------
//       //   $project
//       // --------------------------------------------------

//       {
//         $project: {
//           _id: 1,
//           publicInformationsArr: 1,

//           // contentsType: {
//           //   $ifNull: ['$A', '$B']
//           //   // $cond: { if: { $exists: ["$webPushes_id", true ] }, then: "rec", else: "forum" }
//           //   // $cond: { if: { $gte: [ "$amount", 10 ] }, then: 1, else: 0 } }
//           // },

//           // __v: 0,
//         }
//       },

//       // {
//       //   $project: {
//       //     imagesAndVideos_id: 0,
//       //     acceptLanguage: 0,

//       //     contentsType: {
//       //       $ifNull: ['$A', '$B']
//       //       // $cond: { if: { $exists: ["$webPushes_id", true ] }, then: "rec", else: "forum" }
//       //       // $cond: { if: { $gte: [ "$amount", 10 ] }, then: 1, else: 0 } }
//       //     },

//       //     __v: 0,
//       //   }
//       // },

//     ]).exec();

//     // --------------------------------------------------
//     //   console.log
//     // --------------------------------------------------

//     console.log(`
//       ----------------------------------------\n
//       app/@database/follows/model.js - findFollowContentsAll
//     `);

//     // console.log(chalk`
//     //   loginUsers_id: {green ${loginUsers_id} / ${typeof loginUsers_id}}
//     //   page: {green ${page} / ${typeof page}}
//     //   limit: {green ${limit} / ${typeof limit}}
//     // `);

//     // console.log(`
//     //   ----- hardwareIDsArr -----\n
//     //   ${util.inspect(hardwareIDsArr, { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     // console.log(`
//     //   ----- conditionObj -----\n
//     //   ${util.inspect(conditionObj, { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     console.log(`
//       ----- docArr -----\n
//       ${util.inspect(docArr, { colors: true, depth: null })}\n
//       --------------------\n
//     `);

//     // console.log(`
//     //   ----- returnObj -----\n
//     //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
//     //   --------------------\n
//     // `);

//     // --------------------------------------------------
//     //   Return
//     // --------------------------------------------------

//     // return returnObj;

//   } catch (err) {

//     throw err;

//   }

// };

// --------------------------------------------------
//   Transaction
// --------------------------------------------------

/**
 * Transaction 挿入 / 更新する
 * フォローを同時に更新する
 *
 * @param {Object} followsCondition1Obj - DB follows 検索条件
 * @param {Object} followsSave1Obj - DB follows 保存データ
 * @param {Object} followsCondition2Obj - DB follows 検索条件
 * @param {Object} followsSave2Obj - DB follows 保存データ
 * @return {Object}
 */
const transactionForUpsert = async ({
  followsCondition1Obj,
  followsSave1Obj,
  followsCondition2Obj,
  followsSave2Obj,
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaFollows.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // --------------------------------------------------
    //   Follows
    // --------------------------------------------------

    await SchemaFollows.updateOne(followsCondition1Obj, followsSave1Obj, {
      session,
      upsert: true,
    });
    await SchemaFollows.updateOne(followsCondition2Obj, followsSave2Obj, {
      session,
      upsert: true,
    });

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
    //   /app/@database/follows/model.js - transactionForUpsert
    // `);

    // console.log(`
    //   ----- followsCondition1Obj -----\n
    //   ${util.inspect(followsCondition1Obj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsSave1Obj -----\n
    //   ${util.inspect(followsSave1Obj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsCondition2Obj -----\n
    //   ${util.inspect(followsCondition2Obj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsSave2Obj -----\n
    //   ${util.inspect(followsSave2Obj, { colors: true, depth: null })}\n
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

  findFollowListGc,
  findFollowListUc,
  findFollowContents,
  // findFollowForumGc,
  transactionForUpsert,
};

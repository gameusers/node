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

    return await SchemaFollows.findOne(conditionObj).exec();
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

    return await SchemaFollows.find(conditionObj).exec();
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

    return await SchemaFollows.countDocuments(conditionObj).exec();
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

    return await SchemaFollows.insertMany(saveArr);
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

    return await SchemaFollows.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * ???????????????????????????????????????????????????????????????????????????????????? / pages/api/v2/ur/[userID]/follow/list.js
 * @param {Object} localeObj - ????????????
 * @param {string} users_id - DB users _id / ????????????ID
 * @param {number} page - ?????????
 * @param {number} limit - ????????????
 * @return {Object} ???????????????
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
    //   $match???????????????????????????????????? & count???????????????????????????????????????
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
            //   games / images-and-videos / ?????????????????????
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
      //   - ???????????????????????????????????????
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
      //   - ??????????????????????????????
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
      //   ????????????????????????
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
 * ????????????????????????????????????????????????????????????????????????????????? /
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {string} users_id - DB users _id / ????????????ID
 * @param {number} page - ?????????
 * @param {number} limit - ????????????
 * @return {Object} ???????????????
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
    //   $match???????????????????????????????????? & count???????????????????????????????????????
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
            //   games - ?????????????????????
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
            //   images-and-videos / ??????????????????
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
      //   ????????????????????????
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
      //   ?????????????????????
      // --------------------------------------------------

      const gamesArr = lodashGet(
        value1Obj,
        ["userCommunitiesObj", "gamesArr"],
        []
      );

      if (gamesArr.length > 0) {
        // --------------------------------------------------
        //   gamesArr - ?????????????????????????????????????????????
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
        //   ???????????????
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
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {number} page - ?????????
 * @param {number} limit - ????????????
 * @return {Object} ???????????????
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
    //   _id ???????????????
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
    //   category ????????????????????????????????????????????? _id ?????????????????????????????????
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
    //  ???????????????????????????????????????????????????????????????
    //  ????????????????????????????????????????????? forumThreads_id ??? recruitmentThreads_id ???????????????
    //   ???????????????????????????
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
      //   checkUnauthorizedUserCommunities_idsArr ??? userCommunities_id ???????????????
      //   ????????????????????????????????????????????????????????????????????????????????????????????????
      // --------------------------------------------------

      for (let valueObj of docContentsIdsUrArr.values()) {
        if (valueObj.userCommunities_id) {
          checkUnauthorizedUserCommunities_idsArr.push(
            valueObj.userCommunities_id
          );
        }
      }

      // --------------------------------------------------
      //   ???????????????????????????????????????
      // --------------------------------------------------

      checkUnauthorizedUserCommunities_idsArr = Array.from(
        new Set(checkUnauthorizedUserCommunities_idsArr)
      );
    }

    // --------------------------------------------------
    //   ????????????????????????????????????????????????????????????????????????????????????????????????????????????
    //   ??????????????????????????????????????????????????? userCommunities_idsArr ???????????? userCommunities_id ???????????????
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
      //   ???????????????????????????????????????????????????????????????????????????????????????????????????????????????userCommunities_id ?????????
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
    //   ???????????? forumThreads_idsArr ??? recruitmentThreads_idsArr ???????????????
    //   ????????????????????????????????????????????????????????????????????????????????????
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
    //   ?????????????????????????????????????????????????????????????????????????????? _id ???????????????
    // --------------------------------------------------

    // ---------------------------------------------
    //   ????????????
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
    //   ??????????????????????????????????????????
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
    //   ?????????????????????
    // --------------------------------------------------

    let threadCountObj = {};
    let docContentsIdsArr = [];

    // --------------------------------------------------
    //   ?????????
    // --------------------------------------------------

    if (contents === "all") {
      // --------------------------------------------------
      //   ???????????????
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
      //   _id ?????????????????????????????????
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
      //   ????????????
      // --------------------------------------------------
    } else if (contents === "forum") {
      // --------------------------------------------------
      //   ???????????????
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
      //   _id ?????????????????????????????????
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
      //   ??????
      // --------------------------------------------------
    } else if (contents === "rec") {
      // --------------------------------------------------
      //   ???????????????
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
      //   _id ?????????????????????????????????
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
    //   _id ???????????????
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
    //   ?????????????????????
    // --------------------------------------------------

    // ---------------------------------------------
    //   ???????????????
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
    //   ??????
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
    //   ??????????????????????????????
    // --------------------------------------------------

    // ---------------------------------------------
    //   ???????????????????????????
    // ---------------------------------------------

    if (gameCommunities_idsArr.length > 0) {
      // ---------------------------------------------
      //   - ???????????????????????????????????????
      // ---------------------------------------------

      gameCommunities_idsArr = Array.from(new Set(gameCommunities_idsArr));

      // --------------------------------------------------
      //   Language & Country
      // --------------------------------------------------

      const language = lodashGet(localeObj, ["language"], "");
      const country = lodashGet(localeObj, ["country"], "");

      // ---------------------------------------------
      //   - ???????????????
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
    //   ??????????????????????????????
    // ---------------------------------------------

    if (userCommunities_idsArr.length > 0) {
      // ---------------------------------------------
      //   - ???????????????????????????????????????
      // ---------------------------------------------

      userCommunities_idsArr = Array.from(new Set(userCommunities_idsArr));

      // ---------------------------------------------
      //   - ???????????????
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
 * ???????????????????????????????????????????????????????????????????????????????????? /
 * @param {Object} localeObj - ????????????
 * @param {string} loginUsers_id - DB users _id / ??????????????????????????????ID
 * @param {number} page - ?????????
 * @param {number} limit - ????????????
 * @return {Object} ???????????????
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
 * Transaction ?????? / ????????????
 * ????????????????????????????????????
 *
 * @param {Object} followsCondition1Obj - DB follows ????????????
 * @param {Object} followsSave1Obj - DB follows ???????????????
 * @param {Object} followsCondition2Obj - DB follows ????????????
 * @param {Object} followsSave2Obj - DB follows ???????????????
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
    // console.log('--------????????????-----------');

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

  findFollowListGc,
  findFollowListUc,
  findFollowContents,
  // findFollowForumGc,
  transactionForUpsert,
};

// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

const chalk = require("chalk");
const util = require("util");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");
const lodashHas = require("lodash/has");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const SchemaUsers = require("./schema.js");
const SchemaCardPlayers = require("../card-players/schema.js");
const SchemaExperiences = require("../experiences/schema.js");
const SchemaFollows = require("../follows/schema.js");
const SchemaIDs = require("../ids/schema.js");
const SchemaEmailConfirmations = require("../email-confirmations/schema.js");
const SchemaImagesAndVideos = require("../images-and-videos/schema.js");
const SchemaForumComments = require("../forum-comments/schema.js");
const SchemaForumThreads = require("../forum-threads/schema.js");
const SchemaUserCommunities = require("../user-communities/schema.js");
const SchemaWebPushes = require("../web-pushes/schema.js");

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

    return await SchemaUsers.findOne(conditionObj).exec();
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

    return await SchemaUsers.find(conditionObj).exec();
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

    return await SchemaUsers.countDocuments(conditionObj).exec();
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

    return await SchemaUsers.findOneAndUpdate(conditionObj, saveObj, {
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

    return await SchemaUsers.insertMany(saveArr);
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

    return await SchemaUsers.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * ユーザーページ用のデータを取得する / ヘッダーの更新にも利用する
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} userID - DB users userID / ユーザーID
 * @return {Array} 取得データ
 */
const findOneForUser = async ({
  localeObj,
  loginUsers_id,
  users_id,
  userID,
}) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    const country = lodashGet(localeObj, ["country"], "");

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [];

    if (users_id) {
      matchConditionArr = [
        {
          $match: {
            _id: users_id,
          },
        },
      ];
    } else if (userID) {
      matchConditionArr = [
        {
          $match: {
            userID,
          },
        },
      ];
    }

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaUsers.aggregate([
      // --------------------------------------------------
      //   Match Condition
      // --------------------------------------------------

      ...matchConditionArr,

      // --------------------------------------------------
      //   card-players / プレイヤーカードを取得（名前＆ステータス）
      // --------------------------------------------------

      {
        $lookup: {
          from: "card-players",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$users_id", "$$let_id"] },
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
                status: 1,
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
      //   images-and-videos / 画像と動画を取得 - pagesObj トップ画像
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: { letImagesAndVideos_id: "$pagesObj.imagesAndVideos_id" },
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
          as: "pagesImagesAndVideosObj",
        },
      },

      {
        $unwind: {
          path: "$pagesImagesAndVideosObj",
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
                  $eq: ["$users_id", "$$let_id"],
                },
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
      //   experiences
      // --------------------------------------------------

      {
        $lookup: {
          from: "experiences",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$users_id", "$$let_id"],
                },
              },
            },

            // --------------------------------------------------
            //   experiences / titles
            // --------------------------------------------------

            {
              $lookup: {
                from: "titles",
                let: {
                  letSelectedTitles_idsArr: "$selectedTitles_idsArr",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$language", language] },
                          { $in: ["$_id", "$$letSelectedTitles_idsArr"] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      urlID: 1,
                      name: 1,
                    },
                  },
                ],
                as: "titlesArr",
              },
            },

            // --------------------------------------------------
            //   $project
            // --------------------------------------------------

            {
              $project: {
                __v: 0,
                _id: 0,
                createdDate: 0,
                updatedDate: 0,
                users_id: 0,
                achievementsArr: 0,
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
      //   $project
      // --------------------------------------------------

      {
        $project: {
          cardPlayersObj: 1,
          pagesObj: 1,
          pagesImagesAndVideosObj: 1,
          followsObj: 1,
          experiencesObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //
    // --------------------------------------------------

    const returnObj = lodashGet(docArr, [0], {});
    const headerObj = {};

    // --------------------------------------------------
    //   画像の処理
    // --------------------------------------------------

    if (returnObj.pagesImagesAndVideosObj) {
      const pagesImagesAndVideosObj = formatImagesAndVideosObj({
        localeObj,
        obj: returnObj.pagesImagesAndVideosObj,
      });
      lodashSet(headerObj, ["imagesAndVideosObj"], pagesImagesAndVideosObj);

      delete returnObj.pagesObj.imagesAndVideos_id;
      delete returnObj.pagesObj.imagesAndVideosObj;
    }

    // --------------------------------------------------
    //   follow フォーマット
    // --------------------------------------------------

    const followsObj = lodashGet(returnObj, ["followsObj"], {});
    const adminUsers_id = lodashGet(returnObj, ["_id"], "");

    headerObj.followsObj = formatFollowsObj({
      followsObj,
      adminUsers_id,
      loginUsers_id,
    });

    // --------------------------------------------------
    //   experiences / titlesArr
    // --------------------------------------------------

    const exp = lodashGet(returnObj, ["experiencesObj", "exp"], 0);
    const acquiredTitles_idsArr = lodashGet(
      returnObj,
      ["experiencesObj", "acquiredTitles_idsArr"],
      []
    );
    const selectedTitles_idsArr = lodashGet(
      returnObj,
      ["experiencesObj", "selectedTitles_idsArr"],
      []
    );
    const titlesArr = lodashGet(returnObj, ["experiencesObj", "titlesArr"], []);
    const sortedTitlesArr = [];

    for (let titles_id of selectedTitles_idsArr.values()) {
      // ---------------------------------------------
      //   - $in で取得したデータを元の配列の順番通りに並び替え
      // ---------------------------------------------

      const findObj = titlesArr.find((valueObj) => {
        return valueObj._id === titles_id;
      });

      // ---------------------------------------------
      //   - 獲得した称号の中に選択した称号が存在する場合のみ、配列に追加する
      // ---------------------------------------------

      if (acquiredTitles_idsArr.includes(titles_id)) {
        sortedTitlesArr.push(findObj);
      }
    }

    // --------------------------------------------------
    //   headerObj
    // --------------------------------------------------

    headerObj.users_id = returnObj._id;
    headerObj.type = "ur";
    headerObj.exp = exp;
    headerObj.titlesArr = sortedTitlesArr;
    headerObj.name = lodashGet(returnObj, ["cardPlayersObj", "name"], "");
    headerObj.status = lodashGet(returnObj, ["cardPlayersObj", "status"], "");

    returnObj.headerObj = headerObj;

    // --------------------------------------------------
    //   delete
    // --------------------------------------------------

    delete returnObj.pagesImagesAndVideosObj;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/users/model.js - findOneForUser
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   language: {green ${language}}
    //   country: {green ${country}}
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunityID: {green ${userCommunityID}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
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
 * ユーザーページ / 設定用のデータを取得する
 * @param {string} users_id - DB users _id / ユーザーの固有ID
 * @return {Object} 取得データ
 */
const findSetting = async ({ users_id }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const webPushErrorLimit = parseInt(process.env.WEB_PUSH_ERROR_LIMIT, 10);

    // --------------------------------------------------
    //   Match Condition Array
    // --------------------------------------------------

    let matchConditionArr = [
      {
        $match: {
          _id: users_id,
        },
      },
    ];

    // --------------------------------------------------
    //   Aggregation
    // --------------------------------------------------

    const docArr = await SchemaUsers.aggregate([
      // --------------------------------------------------
      //   Match Condition
      // --------------------------------------------------

      ...matchConditionArr,

      // --------------------------------------------------
      //   images-and-videos / 画像と動画を取得 - pagesObj トップ画像
      // --------------------------------------------------

      {
        $lookup: {
          from: "images-and-videos",
          let: { letImagesAndVideos_id: "$pagesObj.imagesAndVideos_id" },
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
          as: "pagesImagesAndVideosObj",
        },
      },

      {
        $unwind: {
          path: "$pagesImagesAndVideosObj",
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
                subscriptionObj: 1,
                errorCount: 1,
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
          pagesObj: 1,
          pagesImagesAndVideosObj: 1,
          webPushesObj: 1,
          loginID: 1,
          emailObj: 1,
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
    //   /app/@database/users/model.js - findSetting
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   language: {green ${language}}
    //   country: {green ${country}}
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunityID: {green ${userCommunityID}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docArr)), { colors: true, depth: null })}\n
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
 * ヘッダーの更新用  2020/9/1
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} users_id - DB users ユーザー固有ID
 * @return {Object} 取得データ
 */
const findHeader = async ({ localeObj, loginUsers_id, users_id }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   DB users / ユーザー情報を取得する
    // --------------------------------------------------

    const docUsersObj = await findOneForUser({
      localeObj,
      loginUsers_id,
      users_id,
    });

    const returnObj = lodashGet(docUsersObj, ["headerObj"], {});

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
    //   /app/@database/users/model.js - findHeader
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   language: {green ${language}}
    //   country: {green ${country}}
    // `);

    // console.log(`
    //   ----- docUsersObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docUsersObj)), { colors: true, depth: null })}\n
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
 * 検索してデータを取得する / ログインしているユーザーのデータ用（サムネイル・ハンドルネーム・ステータス）
 * 2020/8/13
 * @param {string} users_id - DB users _id / ログイン中のユーザーID
 * @return {Object} 取得データ
 */
const findOneForLoginUsersObj = async ({ users_id }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   データ取得
    // --------------------------------------------------

    const docUsersArr = await SchemaUsers.aggregate([
      // --------------------------------------------------
      //   Match Condition
      // --------------------------------------------------

      {
        $match: {
          _id: users_id,
        },
      },

      // --------------------------------------------------
      //   card-players
      // --------------------------------------------------

      {
        $lookup: {
          from: "card-players",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$users_id", "$$let_id"],
                },
              },
            },

            // --------------------------------------------------
            //   card-players / images-and-videos / サムネイル用
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
                name: 1,
                status: 1,
                imagesAndVideosThumbnailObj: 1,
              },
            },
          ],
          as: "cardPlayerObj",
        },
      },

      {
        $unwind: {
          path: "$cardPlayerObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          __v: 0,
          createdDate: 0,
          updatedDate: 0,
          countriesArr: 0,
          userIDInitial: 0,
          pagesObj: 0,
          termsOfServiceAgreedVersion: 0,
          loginID: 0,
          loginPassword: 0,
          emailObj: 0,
          webPushes_id: 0,
          country: 0,
          acceptLanguage: 0,
          webPushSubscriptionObj: 0,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    let returnObj = {};

    if (docUsersArr.length > 0) {
      returnObj = docUsersArr[0];
    }

    // --------------------------------------------------
    //   Format - Images And Videos
    // --------------------------------------------------

    const imagesAndVideosThumbnailObj = lodashGet(
      returnObj,
      ["cardPlayerObj", "imagesAndVideosThumbnailObj"],
      ""
    );

    if (imagesAndVideosThumbnailObj) {
      const formattedImagesAndVideosThumbnailObj = formatImagesAndVideosObj({
        obj: imagesAndVideosThumbnailObj,
      });
      lodashSet(
        returnObj,
        ["cardPlayerObj", "imagesAndVideosThumbnailObj"],
        formattedImagesAndVideosThumbnailObj
      );
    } else {
      delete returnObj.imagesAndVideosThumbnailObj;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/users/model.js - findOneForLoginUsersObj
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
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
 * ユーザーコミュニティのAbout用のデータを取得する
 * create: 2021/3/4
 * @param {Object} localeObj - ロケール
 * @param {string} users_id - DB users _id / ユーザーID
 * @return {Object} 取得データ
 */
const findOneForAbout = async ({ localeObj, users_id }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Language & Country
    // --------------------------------------------------

    const language = lodashGet(localeObj, ["language"], "");
    // const country = lodashGet(localeObj, ['country'], '');

    // --------------------------------------------------
    //   データ取得
    // --------------------------------------------------

    const docUsersArr = await SchemaUsers.aggregate([
      // --------------------------------------------------
      //   Match Condition
      // --------------------------------------------------

      {
        $match: {
          _id: users_id,
        },
      },

      // --------------------------------------------------
      //   card-players
      // --------------------------------------------------

      {
        $lookup: {
          from: "card-players",
          let: { let_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", language] },
                    { $eq: ["$users_id", "$$let_id"] },
                  ],
                },
              },
            },

            // --------------------------------------------------
            //   card-players / images-and-videos / サムネイル用
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
                name: 1,
                status: 1,
                imagesAndVideosThumbnailObj: 1,
              },
            },
          ],
          as: "cardPlayerObj",
        },
      },

      {
        $unwind: {
          path: "$cardPlayerObj",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      //   $project
      // --------------------------------------------------

      {
        $project: {
          _id: 0,
          userID: 1,
          cardPlayerObj: 1,
        },
      },
    ]).exec();

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    let returnObj = {};

    if (docUsersArr.length > 0) {
      returnObj = docUsersArr[0];
    }

    // --------------------------------------------------
    //   Format - Images And Videos
    // --------------------------------------------------

    const imagesAndVideosThumbnailObj = lodashGet(
      returnObj,
      ["cardPlayerObj", "imagesAndVideosThumbnailObj"],
      ""
    );

    if (imagesAndVideosThumbnailObj) {
      const formattedImagesAndVideosThumbnailObj = formatImagesAndVideosObj({
        obj: imagesAndVideosThumbnailObj,
      });
      lodashSet(
        returnObj,
        ["cardPlayerObj", "imagesAndVideosThumbnailObj"],
        formattedImagesAndVideosThumbnailObj
      );
    } else {
      delete returnObj.imagesAndVideosThumbnailObj;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/users/model.js - findOneForAbout
    // `);

    // console.log(chalk`
    // users_id: {green ${users_id}}
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
//   transaction
// --------------------------------------------------

/**
 * 挿入 / 更新する  アカウント情報編集用
 * @param {Object} usersConditionObj - DB users 検索条件
 * @param {Object} usersSaveObj - DB users 保存データ
 * @param {Object} emailConfirmationsConditionObj - DB email-confirmations 検索条件
 * @param {Object} emailConfirmationsSaveObj - DB email-confirmations 保存データ
 * @return {Object}
 */
const transactionForEditAccount = async ({
  usersConditionObj,
  usersSaveObj,
  emailConfirmationsConditionObj,
  emailConfirmationsSaveObj,
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaUsers.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // --------------------------------------------------
    //   DB Insert
    // --------------------------------------------------

    await SchemaUsers.updateOne(usersConditionObj, usersSaveObj, {
      session,
      upsert: true,
    });
    await SchemaEmailConfirmations.updateOne(
      emailConfirmationsConditionObj,
      emailConfirmationsSaveObj,
      { session, upsert: true }
    );

    // await SchemaUsers.create(usersSaveArr, { session });
    // throw new Error('Dy16VjjQL');
    // throw new Error();
    // await SchemaCardPlayers.create(cardPlayersSaveArr, { session: session });

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
    //   ----- emailConfirmationsConditionObj -----\n
    //   ${util.inspect(emailConfirmationsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- emailConfirmationsSaveObj -----\n
    //   ${util.inspect(emailConfirmationsSaveObj, { colors: true, depth: null })}\n
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
 * Transaction 挿入 / 更新する
 * 2020/3/4
 * @param {Object} usersConditionObj - DB users 検索条件
 * @param {Object} usersSaveObj - DB users 保存データ
 * @param {Object} cardPlayersConditionObj - DB card-players 検索条件
 * @param {Object} cardPlayersSaveObj - DB card-players 保存データ
 * @param {Object} emailConfirmationsConditionObj - DB email-confirmations 検索条件
 * @param {Object} emailConfirmationsSaveObj - DB email-confirmations 保存データ
 * @param {Object} experiencesConditionObj - DB experiences 検索条件
 * @param {Object} experiencesSaveObj - DB experiences 保存データ
 * @param {Object} followsConditionObj - DB follows 検索条件
 * @param {Object} followsSaveObj - DB follows 保存データ
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件
 * @param {Object} imagesAndVideosSaveObj - DB images-and-videos 保存データ
 * @param {Object} webPushesConditionObj - DB web-pushes 検索条件
 * @param {Object} webPushesSaveObj - DB web-pushes 保存データ
 * @return {Object}
 */
const transactionForUpsert = async ({
  usersConditionObj,
  usersSaveObj,
  cardPlayersConditionObj = {},
  cardPlayersSaveObj = {},
  emailConfirmationsConditionObj = {},
  emailConfirmationsSaveObj = {},
  experiencesConditionObj = {},
  experiencesSaveObj = {},
  followsConditionObj = {},
  followsSaveObj = {},
  imagesAndVideosConditionObj = {},
  imagesAndVideosSaveObj = {},
  webPushesConditionObj = {},
  webPushesSaveObj = {},
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaUsers.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // --------------------------------------------------
    //   users
    // --------------------------------------------------

    await SchemaUsers.updateOne(usersConditionObj, usersSaveObj, {
      session,
      upsert: true,
    });

    // --------------------------------------------------
    //   card-players
    // --------------------------------------------------

    if (
      Object.keys(cardPlayersConditionObj).length !== 0 &&
      Object.keys(cardPlayersSaveObj).length !== 0
    ) {
      await SchemaCardPlayers.updateOne(
        cardPlayersConditionObj,
        cardPlayersSaveObj,
        { session, upsert: true }
      );
    }

    // --------------------------------------------------
    //   email-confirmations
    // --------------------------------------------------

    if (
      Object.keys(emailConfirmationsConditionObj).length !== 0 &&
      Object.keys(emailConfirmationsSaveObj).length !== 0
    ) {
      await SchemaEmailConfirmations.updateOne(
        emailConfirmationsConditionObj,
        emailConfirmationsSaveObj,
        { session, upsert: true }
      );
    }

    // --------------------------------------------------
    //   experiences
    // --------------------------------------------------

    if (
      Object.keys(experiencesConditionObj).length !== 0 &&
      Object.keys(experiencesSaveObj).length !== 0
    ) {
      await SchemaExperiences.updateOne(
        experiencesConditionObj,
        experiencesSaveObj,
        { session, upsert: true }
      );
    }

    // --------------------------------------------------
    //   follows
    // --------------------------------------------------

    if (
      Object.keys(followsConditionObj).length !== 0 &&
      Object.keys(followsSaveObj).length !== 0
    ) {
      await SchemaFollows.updateOne(followsConditionObj, followsSaveObj, {
        session,
        upsert: true,
      });
    }

    // --------------------------------------------------
    //   web-pushes
    // --------------------------------------------------

    if (
      Object.keys(webPushesConditionObj).length !== 0 &&
      Object.keys(webPushesSaveObj).length !== 0
    ) {
      await SchemaWebPushes.updateOne(webPushesConditionObj, webPushesSaveObj, {
        session,
        upsert: true,
      });
    }

    // --------------------------------------------------
    //   images-and-videos - メイン画像
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
    //   /app/@database/users/model.js
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
    //   ----- cardPlayersConditionObj -----\n
    //   ${util.inspect(cardPlayersConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- cardPlayersSaveObj -----\n
    //   ${util.inspect(cardPlayersSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- emailConfirmationsConditionObj -----\n
    //   ${util.inspect(emailConfirmationsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- emailConfirmationsSaveObj -----\n
    //   ${util.inspect(emailConfirmationsSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- experiencesConditionObj -----\n
    //   ${util.inspect(experiencesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- experiencesSaveObj -----\n
    //   ${util.inspect(experiencesSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsConditionObj -----\n
    //   ${util.inspect(followsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsSaveObj -----\n
    //   ${util.inspect(followsSaveObj, { colors: true, depth: null })}\n
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
 * Transaction 削除する
 * 2020/10/24
 * @param {Object} usersConditionObj - DB users 検索条件
 * @param {Object} cardPlayersConditionObj - DB card-players 検索条件
 * @param {Object} experiencesConditionObj - DB experiences 検索条件
 * @param {Object} followsConditionObj - DB follows 検索条件
 * @param {Object} forumCommentsConditionObj - DB forum-comments 検索条件
 * @param {Object} forumThreadsConditionObj - DB forum-threads 検索条件
 * @param {Object} idsConditionObj - DB ids 検索条件
 * @param {Object} imagesAndVideosConditionObj - DB images-and-videos 検索条件
 * @param {Object} userCommunitiesConditionObj - DB user-communities 検索条件
 * @param {Object} webPushesConditionObj - DB web-pushes 検索条件
 * @return {Object}
 */
const transactionForDelete = async ({
  usersConditionObj,
  cardPlayersConditionObj,
  experiencesConditionObj,
  followsConditionObj,
  forumCommentsConditionObj,
  forumThreadsConditionObj,
  idsConditionObj,
  imagesAndVideosConditionObj,
  userCommunitiesConditionObj,
  webPushesConditionObj,
}) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};

  // --------------------------------------------------
  //   Transaction / Session
  // --------------------------------------------------

  const session = await SchemaUsers.startSession();

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Transaction / Start
    // --------------------------------------------------

    await session.startTransaction();

    // --------------------------------------------------
    //   - users
    // --------------------------------------------------

    await SchemaUsers.deleteOne(usersConditionObj, { session });

    // --------------------------------------------------
    //   - card-players
    // --------------------------------------------------

    await SchemaCardPlayers.deleteMany(cardPlayersConditionObj, { session });

    // --------------------------------------------------
    //   - experiences
    // --------------------------------------------------

    await SchemaExperiences.deleteOne(experiencesConditionObj, { session });

    // --------------------------------------------------
    //   - follows
    // --------------------------------------------------

    await SchemaFollows.deleteMany(followsConditionObj, { session });

    // --------------------------------------------------
    //   - forum-comments / Comments & Replies
    // --------------------------------------------------

    await SchemaForumComments.deleteMany(forumCommentsConditionObj, {
      session,
    });

    // --------------------------------------------------
    //   - forum-threads
    // --------------------------------------------------

    await SchemaForumThreads.deleteMany(forumThreadsConditionObj, { session });

    // --------------------------------------------------
    //   - ids
    // --------------------------------------------------

    await SchemaIDs.deleteMany(idsConditionObj, { session });

    // ---------------------------------------------
    //   - images-and-videos
    // ---------------------------------------------

    if (Object.keys(imagesAndVideosConditionObj).length !== 0) {
      await SchemaImagesAndVideos.deleteMany(imagesAndVideosConditionObj, {
        session,
      });
    }

    // ---------------------------------------------
    //   - user-communities
    // ---------------------------------------------

    await SchemaUserCommunities.deleteMany(userCommunitiesConditionObj, {
      session,
    });

    // ---------------------------------------------
    //   - web-pushes
    // ---------------------------------------------

    await SchemaWebPushes.deleteOne(webPushesConditionObj, { session });

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
    //   app/@database/users/model.js - transactionForDelete
    // `);

    // console.log(`
    //   ----- usersConditionObj -----\n
    //   ${util.inspect(usersConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- cardPlayersConditionObj -----\n
    //   ${util.inspect(cardPlayersConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- experiencesConditionObj -----\n
    //   ${util.inspect(experiencesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsConditionObj -----\n
    //   ${util.inspect(followsConditionObj, { colors: true, depth: null })}\n
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
    //   ----- idsConditionObj -----\n
    //   ${util.inspect(idsConditionObj, { colors: true, depth: null })}\n
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
    //   ----- webPushesConditionObj -----\n
    //   ${util.inspect(webPushesConditionObj, { colors: true, depth: null })}\n
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

  findOneForUser,
  findSetting,
  findHeader,
  findOneForLoginUsersObj,
  findOneForAbout,

  transactionForEditAccount,
  transactionForUpsert,
  transactionForDelete,
};

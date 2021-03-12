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

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");
const lodashHas = require("lodash/has");
const lodashCloneDeep = require("lodash/cloneDeep");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const Schema = require("./schema");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { formatImagesAndVideosObj } = require("../images-and-videos/format");

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

    return await Schema.findOne(conditionObj).exec();
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

    return await Schema.find(conditionObj).exec();
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

    return await Schema.countDocuments(conditionObj).exec();
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

    return await Schema.findOneAndUpdate(conditionObj, saveObj, {
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

    return await Schema.insertMany(saveArr);
  } catch (err) {
    throw err;
  }
};

/**
 * データを削除する / 1件だけ
 * @param {Object} conditionObj - 検索条件
 * @return {Object} 取得データ
 */
const deleteOne = async ({ conditionObj }) => {
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

    return await Schema.deleteOne(conditionObj).exec();
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

    return await Schema.deleteMany(conditionObj);
  } catch (err) {
    throw err;
  }
};

/**
 * _id が入った配列を利用して、まとめてデータを取得し
 * 利用しやすくフォーマットされたオブジェクトを返す
 * @param {Object} argumentsObj - 引数
 * @return {Object} 取得データ
 */
const findForCardPlayer = async ({ localeObj, loginUsers_id, ids_idsArr }) => {
  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   ID データを取得
    // --------------------------------------------------

    const resultIDsArr = await findBy_idsArr({
      localeObj,
      ids_idsArr,
    });

    // --------------------------------------------------
    //   フォーマット
    // --------------------------------------------------

    const returnObj = formatToObject({
      localeObj,
      arr: resultIDsArr,
      loginUsers_id,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    // `);

    // console.log(`
    //   ----- ids_idsArr -----\n
    //   ${util.inspect(ids_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- resultIDsArr -----\n
    //   ${util.inspect(resultIDsArr, { colors: true, depth: null })}\n
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
 * users_id を利用して、まとめてデータを取得し、利用しやすくフォーマットされたオブジェクトを返す
 * フォーム用
 * @param {Object} localeObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @return {Object} 取得データ
 */
const findBy_Users_idForForm = async ({ localeObj, loginUsers_id }) => {
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
    //   ID データを取得
    // --------------------------------------------------

    let resultIDsArr = await Schema.aggregate([
      {
        $match: { users_id: loginUsers_id },
      },

      // ゲーム
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
                    { $eq: ["$gameCommunities_id", "$$idsGameCommunities_id"] },
                  ],
                },
              },
            },

            // 画像と動画を取得 - サムネイル用
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
                        $eq: ["$_id", "$$gamesImagesAndVideosThumbnail_id"],
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
    ]).exec();

    // --------------------------------------------------
    //   フォーマット
    // --------------------------------------------------

    const returnArr = [];

    for (let valueObj of resultIDsArr) {
      let tempObj = {
        _id: valueObj._id,
        platform: valueObj.platform,
        label: valueObj.label,
        id: valueObj.id,
        publicSetting: valueObj.publicSetting,
        search: valueObj.search,
      };

      if ("gamesObj" in valueObj) {
        tempObj.gamesObj = valueObj.gamesObj;

        const imagesAndVideosThumbnailObj = formatImagesAndVideosObj({
          localeObj,
          obj: valueObj.gamesObj.imagesAndVideosThumbnailObj,
        });

        if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
          tempObj.gamesObj.imagesAndVideosThumbnailObj = imagesAndVideosThumbnailObj;
        }
      }

      returnArr.push(tempObj);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/ids/model.js - findBy_Users_idForForm
    // `);

    // console.log(`
    //   ----- resultIDsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(resultIDsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnArr -----\n
    //   ${util.inspect(returnArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   language: {green ${language}}
    //   country: {green ${country}}
    //   loginUsers_id: {green ${loginUsers_id}}
    // `);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return returnArr;
  } catch (err) {
    throw err;
  }
};

/**
 * DBから取得した情報をオブジェクトにフォーマットする
 * @param {Object} localeObj - ロケール
 * @param {Object} argumentsObj - 引数
 * @return {Object} フォーマット後のデータ
 */
const formatToObject = ({ localeObj, arr, loginUsers_id }) => {
  // --------------------------------------------------
  //   Format
  // --------------------------------------------------

  let formattedObj = {};

  for (let valueObj of arr) {
    // --------------------------------------------------
    //   Deep Copy
    // --------------------------------------------------

    const clonedObj = lodashCloneDeep(valueObj);

    // --------------------------------------------------
    //   Follow の処理
    //   follow 自分が相手をフォローしている場合、true
    //   followed 自分が相手にフォローされている場合、true
    // --------------------------------------------------

    lodashSet(clonedObj, ["usersObj", "follow"], false);
    lodashSet(clonedObj, ["usersObj", "followed"], false);

    const followArr = lodashGet(clonedObj, ["usersObj", "followArr"], []);
    const followedArr = lodashGet(clonedObj, ["usersObj", "followedArr"], []);

    if (loginUsers_id) {
      if (clonedObj.users_id !== loginUsers_id) {
        if (followArr.includes(loginUsers_id)) {
          lodashSet(clonedObj, ["usersObj", "follow"], true);
        }

        if (followedArr.includes(loginUsers_id)) {
          lodashSet(clonedObj, ["usersObj", "followed"], true);
        }
      }
    }

    // --------------------------------------------------
    //   表示する ID を選択する
    //   publicSetting の番号で ID の表示方法を指定している
    //
    //   1.誰にでも表示する
    //   2.自分をフォローしているユーザーに表示する
    //   3.自分がフォローしているユーザーに表示する
    //   4.相互フォローで表示する
    //   5.自分以外には表示しない
    // --------------------------------------------------

    if (
      clonedObj.users_id === loginUsers_id ||
      valueObj.publicSetting === 1 ||
      (valueObj.publicSetting === 2 && clonedObj.usersObj.followed) ||
      (valueObj.publicSetting === 3 && clonedObj.usersObj.follow) ||
      (valueObj.publicSetting === 4 &&
        clonedObj.usersObj.follow &&
        clonedObj.usersObj.followed)
      // valueObj.publicSetting === 5 && copiedObj.users_id === loginUsers_id
    ) {
      let tempObj = {
        _id: valueObj._id,
        platform: valueObj.platform,
        label: valueObj.label,
        id: valueObj.id,
      };

      if ("gamesObj" in valueObj) {
        tempObj.gamesObj = valueObj.gamesObj;

        const imagesAndVideosThumbnailObj = formatImagesAndVideosObj({
          localeObj,
          obj: valueObj.gamesObj.imagesAndVideosThumbnailObj,
        });

        if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
          tempObj.gamesObj.imagesAndVideosThumbnailObj = imagesAndVideosThumbnailObj;
        }
      }

      formattedObj[valueObj._id] = tempObj;
    }
  }

  // --------------------------------------------------
  //   元の配列の順番通りに並べなおす
  // --------------------------------------------------

  // let returnArr = [];

  // for (let value of ids_idsArr) {
  //   if (value in formattedObj) {
  //     returnArr.push(formattedObj[value]);
  //   }
  // }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/@database/ids/model.js - formatToObject
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
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
};

/**
 * 取得する
 * @param {Object} localeObj - ロケール
 * @param {Array} ids_idsArr - DB ids _id の入った配列
 * @return {Array} 取得データ
 */
const findBy_idsArr = async ({ localeObj, ids_idsArr }) => {
  // --------------------------------------------------
  //   配列の重複している値を削除
  // --------------------------------------------------

  const removedDuplicatesArr = Array.from(new Set(ids_idsArr));

  // --------------------------------------------------
  //   Database
  // --------------------------------------------------

  try {
    // --------------------------------------------------
    //   Aggregate
    // --------------------------------------------------

    let resultArr = await Schema.aggregate([
      {
        $match: { _id: { $in: removedDuplicatesArr } },
      },

      // ユーザー
      {
        $lookup: {
          from: "users",
          let: { idsUsers_id: "$users_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$idsUsers_id"] } } },
            {
              $project: {
                _id: 0,
                accessDate: 1,
                exp: 1,
                userID: 1,
                followArr: 1,
                followedArr: 1,
                followedCount: 1,
              },
            },
          ],
          as: "usersObj",
        },
      },

      {
        $unwind: "$usersObj",
      },

      // ゲーム
      {
        $lookup: {
          from: "games",
          let: { idsGameCommunities_id: "$gameCommunities_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$language", localeObj.language] },
                    { $eq: ["$country", localeObj.country] },
                    { $eq: ["$gameCommunities_id", "$$idsGameCommunities_id"] },
                  ],
                },
              },
            },

            // 画像と動画を取得 - サムネイル用
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
                        $eq: ["$_id", "$$gamesImagesAndVideosThumbnail_id"],
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
    ]).exec();

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return resultArr;
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
  deleteOne,
  deleteMany,

  findForCardPlayer,
  findBy_Users_idForForm,
};

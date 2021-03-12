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

const validator = require("validator");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const Model = require("../model");
const ModelFollows = require("../../follows/model");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom");

/**
 * _id
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationUserCommunities_idServer = async ({ value }) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;

  const resultObj = {
    value: data,
    numberOfCharacters,
  };

  // ---------------------------------------------
  //   文字数チェック
  // ---------------------------------------------

  if (!validator.isLength(data, { min: minLength, max: maxLength })) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "l8-myxsT5", messageID: "Pp_CFyt_3" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "YWcSSkio6", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在していない場合、エラー
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      _id: value,
    },
  });

  if (count === 0) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "FFauG_RbE", messageID: "cvS0qSAlE" }],
    });
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return resultObj;
};

/**
 * _id と権限
 * @param {string} value - 値
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @return {Object} バリデーション結果
 */
const validationUserCommunities_idAndAuthorityServer = async ({
  value,
  loginUsers_id,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;

  const resultObj = {
    value: data,
    numberOfCharacters,
  };

  // ---------------------------------------------
  //   文字数チェック
  // ---------------------------------------------

  if (!validator.isLength(data, { min: minLength, max: maxLength })) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "l8-myxsT5", messageID: "Pp_CFyt_3" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "YWcSSkio6", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在していない場合、エラー
  // ---------------------------------------------

  const docUserCommunitiesObj = await Model.findOne({
    conditionObj: {
      _id: value,
    },
  });

  if (!docUserCommunitiesObj) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "FFauG_RbE", messageID: "cvS0qSAlE" }],
    });
  }

  const communityType = lodashGet(
    docUserCommunitiesObj,
    ["communityType"],
    "open"
  );

  // ---------------------------------------------
  //   メンバーかどうか
  // ---------------------------------------------

  if (communityType === "closed") {
    const docFollowsObj = await ModelFollows.findOne({
      conditionObj: {
        userCommunities_id: value,
      },
    });

    const followedArr = lodashGet(docFollowsObj, ["followedArr"], []);

    // console.log(`
    //   ----- docFollowsObj -----\n
    //   ${util.inspect(docFollowsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followedArr -----\n
    //   ${util.inspect(followedArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   value: {green ${value}}
    //   loginUsers_id: {green ${loginUsers_id}}
    //   followedArr.includes(loginUsers_id): {green ${followedArr.includes(loginUsers_id)}}
    // `);

    if (!followedArr.includes(loginUsers_id)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "oMsVg7jXy", messageID: "DSRlEoL29" }],
      });
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/@database/user-communities/validations/_id-server.js - validationUserCommunities_idAndAuthorityServer
  // `);

  // console.log(`
  //   ----- docUserCommunitiesObj -----\n
  //   ${util.inspect(docUserCommunitiesObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   value: {green ${value}}
  //   communityType: {green ${communityType}}
  // `);

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return resultObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  validationUserCommunities_idServer,
  validationUserCommunities_idAndAuthorityServer,
};

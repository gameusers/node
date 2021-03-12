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
//   Model
// ---------------------------------------------

const Model = require("../model");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom");

/**
 * User Community ID
 * @param {string} value - 値
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @return {Object} バリデーション結果
 */
const validationUserCommunitiesUserCommunityIDServer = async ({
  value,
  loginUsers_id,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 3;
  const maxLength = 32;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;

  let resultObj = {
    value: data,
    numberOfCharacters,
  };

  // ---------------------------------------------
  //   文字数チェック
  // ---------------------------------------------

  if (!validator.isLength(data, { min: minLength, max: maxLength })) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "QHBt-kVty", messageID: "ilE2NcYjI" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "3q6PXZ0mj", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在しているかチェック
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      users_id: { $ne: loginUsers_id },
      userCommunityID: value,
    },
  });

  // console.log(chalk`
  //   /app/@database/user-communities/validations/user-community-id-server.js
  //   count: {green ${count}}
  // `);

  if (count === 1) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "RGwUrzEPY", messageID: "sxyL1EamN" }],
    });
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return resultObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  validationUserCommunitiesUserCommunityIDServer,
};

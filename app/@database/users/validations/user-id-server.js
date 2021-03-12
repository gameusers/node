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

const { CustomError } = require("../../../@modules/error/custom.js");

/**
 * User ID
 * @param {string} value - 値
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @return {Object} バリデーション結果
 */
const validationUsersUserIDServer = async ({ value, loginUsers_id }) => {
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
      errorsArr: [{ code: "oqrqupZ3J", messageID: "ilE2NcYjI" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "JQLZtHZ49", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在しているかチェック
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      _id: { $ne: loginUsers_id },
      userID: value,
    },
  });

  if (count === 1) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "aCaDRxR2g", messageID: "Xt11v41pR" }],
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
  validationUsersUserIDServer,
};

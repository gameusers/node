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
 * _id
 * @param {string} value - 値
 * @param {string} loginUsers_id - DB users _id ログインしているユーザーの_id
 * @return {Object} バリデーション結果
 */
const validationCardPlayers_idServer = async ({ value, loginUsers_id }) => {
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
      errorsArr: [{ code: "DkKNsqL-1", messageID: "Pp_CFyt_3" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "AYQO0s8Bp", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在していない場合、エラー
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      _id: value,
      users_id: loginUsers_id,
    },
  });

  if (count === 0) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "N-u9ycUzf", messageID: "cvS0qSAlE" }],
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
  validationCardPlayers_idServer,
};

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
 * emailConfirmationID
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationEmailConfirmationsEmailConfirmationIDServer = async ({
  value,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 21;
  const maxLength = 42;

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
      errorsArr: [{ code: "OkacnTHUE", messageID: "ilE2NcYjI" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "1vJnIRLgu", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在しているかチェック
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      emailConfirmationID: value,
    },
  });

  if (count === 0) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "FbtOHKatU", messageID: "Xt11v41pR" }],
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
  validationEmailConfirmationsEmailConfirmationIDServer,
};

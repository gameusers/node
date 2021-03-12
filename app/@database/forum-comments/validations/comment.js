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
const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom");

/**
 * Comment
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationForumCommentsComment = ({ throwError = false, value }) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 1;
  const maxLength = 3000;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;

  const resultObj = {
    value: data,
    numberOfCharacters,
    messageID: "Error",
    error: false,
  };

  try {
    // ---------------------------------------------
    //   文字数チェック
    // ---------------------------------------------

    if (!validator.isLength(data, { min: minLength, max: maxLength })) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "VT9ny7ovX", messageID: "pLES2ZGM2" }],
      });
    }
  } catch (errorObj) {
    // ---------------------------------------------
    //   Throw Error
    // ---------------------------------------------

    if (throwError) {
      throw errorObj;
    }

    // ---------------------------------------------
    //   Result Error
    // ---------------------------------------------

    resultObj.error = true;

    if (errorObj instanceof CustomError) {
      resultObj.messageID = lodashGet(
        errorObj,
        ["errorsArr", 0, "messageID"],
        "Error"
      );
    } else {
      resultObj.messageID = "qnWsuPcrJ";
    }
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
  validationForumCommentsComment,
};

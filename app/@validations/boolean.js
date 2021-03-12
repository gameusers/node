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
//   Modules
// ---------------------------------------------

const { CustomError } = require("../@modules/error/custom.js");

/**
 * Boolean
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {boolean} value - 値
 * @return {Object} バリデーション結果
 */
const validationBoolean = ({ throwError = false, required = false, value }) => {
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
    //   空の場合、処理停止
    // ---------------------------------------------

    if (validator.isEmpty(data)) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "K9D1fwzSP", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   Booleanチェック
    // ---------------------------------------------

    if (!validator.isBoolean(data)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "6LhHyZWR_", messageID: "PH8jcw-VF" }],
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
  validationBoolean,
};

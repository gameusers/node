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

const { CustomError } = require("../@modules/error/custom");

/**
 * 整数
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationInteger = ({ throwError = false, required = false, value }) => {
  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const intValue = parseInt(value, 10);
  const numberOfCharacters = data ? data.length : 0;

  const resultObj = {
    value: intValue,
    numberOfCharacters,
    messageID: "Error",
    error: false,
  };

  // console.log(chalk`
  //   value: {green ${value} / ${typeof value}}
  //   data: {green ${data} / ${typeof data}}
  //   validator.isEmpty(data): {green ${validator.isEmpty(data)}}
  //   Number.isInteger(value): {green ${Number.isInteger(value)}}
  // `);

  try {
    // ---------------------------------------------
    //   空の場合、処理停止
    // ---------------------------------------------

    if (validator.isEmpty(data)) {
      // console.log('empty');
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "HmFa7vdKa", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   整数チェック
    // ---------------------------------------------

    if (!Number.isInteger(intValue)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "2dSCYnE7M", messageID: "f_YBnQcfW" }],
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
  validationInteger,
};

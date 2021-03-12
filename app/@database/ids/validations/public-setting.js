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
 * Platform
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationIDsPublicSetting = ({
  throwError = false,
  required = false,
  value,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minNumber = 1;
  const maxNumber = 5;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;

  let resultObj = {
    value: data,
    numberOfCharacters,
    messageID: "TogSfI8lD",
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
          errorsArr: [{ code: "Slo-DCOZO", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   数字が範囲内に収まっているかチェック
    // ---------------------------------------------

    if (!validator.isInt(data, { min: minNumber, max: maxNumber })) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "wibWQJaPV", messageID: "TogSfI8lD" }],
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
  validationIDsPublicSetting,
};

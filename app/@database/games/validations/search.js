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
 * 検索キーワードの配列
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} arr - 値の入った配列
 * @return {Object} バリデーション結果
 */
const validationGamesSearchKeywordsArr = async ({
  throwError = false,
  required = false,
  arr = [],
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 1;
  const maxLength = 100;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const resultObj = {
    value: arr,
  };

  try {
    // ---------------------------------------------
    //   配列チェック
    // ---------------------------------------------

    if (!Array.isArray(arr)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "WWYqoPmbF", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   配列が空の場合、処理停止
    // ---------------------------------------------

    const length = arr.length;

    if (length === 0) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "8kprxXsV9", messageID: "Error" }],
        });
      }

      return;
    }

    // ---------------------------------------------
    //   ループ
    // ---------------------------------------------

    for (let value of arr.values()) {
      // ---------------------------------------------
      //   文字数チェック
      // ---------------------------------------------

      if (!validator.isLength(value, { min: minLength, max: maxLength })) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "lnhNeuyAj", messageID: "Uh3rnK7Dk" }],
        });
      }
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
  validationGamesSearchKeywordsArr,
};

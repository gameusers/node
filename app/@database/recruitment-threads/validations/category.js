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

const { CustomError } = require("../../../@modules/error/custom.js");

/**
 * Category
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationRecruitmentThreadsCategory = ({
  throwError = false,
  required = false,
  value,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minNumber = 1;
  const maxNumber = 3;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;

  const resultObj = {
    value: data,
    numberOfCharacters,
    messageID: "Nbu_IqorV",
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
          errorsArr: [{ code: "67sSDd3ZE", messageID: "cFbXmuFVh" }],
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
        errorsArr: [{ code: "v2Ns_ue8Z", messageID: "Nbu_IqorV" }],
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

/**
 * category の配列
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {Array} arr - 値
 * @return {Object} バリデーション結果
 */
const validationRecruitmentThreadsCategoriesArr = async ({
  throwError = false,
  arr,
}) => {
  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const resultObj = {
    value: arr,
    messageID: "Error",
    error: false,
  };

  try {
    // ---------------------------------------------
    //   配列チェック
    // ---------------------------------------------

    if (!Array.isArray(arr)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "SfXL8LOe0", messageID: "3mDvfqZHV" }],
      });
    }

    // ---------------------------------------------
    //   配列が空の場合、処理停止
    // ---------------------------------------------

    const length = arr.length;

    if (length === 0) {
      return;
    }

    // ---------------------------------------------
    //   ループ
    // ---------------------------------------------

    for (let value of arr.values()) {
      // ---------------------------------------------
      //   適切な値が選択されているかチェック
      // ---------------------------------------------

      if (!validator.isIn(String(value), ["1", "2", "3"])) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "9gbvNTrGP", messageID: "PH8jcw-VF" }],
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

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(arr, { colors: true, depth: null })}\n
  //   --------------------\n
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
  validationRecruitmentThreadsCategory,
  validationRecruitmentThreadsCategoriesArr,
};

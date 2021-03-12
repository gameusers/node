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
const zxcvbn = require("zxcvbn");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom.js");

/**
 * Login Password
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {string} value - 値
 * @param {string} loginID - Login ID
 */
const validationUsersLoginPassword = ({
  throwError = false,
  required = false,
  value,
  loginID,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 8;
  const maxLength = 32;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;
  const strengthScore = zxcvbn(data).score;

  const resultObj = {
    value: data,
    numberOfCharacters,
    messageID: "gJz51M8Pf",
    error: false,
    strengthScore,
  };

  try {
    // ---------------------------------------------
    //   空の場合、バリデーションスルー
    // ---------------------------------------------

    if (validator.isEmpty(data)) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "yb5NVHn9Q", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   文字数チェック
    // ---------------------------------------------

    if (!validator.isLength(data, { min: minLength, max: maxLength })) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "amAKxmNis", messageID: "_BnyJl8Xz" }],
      });
    }

    // ---------------------------------------------
    //   英数と -_ のみ
    // ---------------------------------------------

    if (data.match(/^[\w\-]+$/) === null) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "jSqs5J_a8", messageID: "JBkjlGQMh" }],
      });
    }

    // ---------------------------------------------
    //   パスワードの強度
    // ---------------------------------------------

    if (strengthScore < 2) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "6PM5lQzCA", messageID: "tmEi1Es0v" }],
      });
    }

    // ---------------------------------------------
    //   IDとパスワードを同じ文字列にできない
    // ---------------------------------------------

    if (data === loginID) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "Pt74iKMWF", messageID: "NHTq1_JhE" }],
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
 * Login Password Confirmation
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {string} value - 値
 * @param {string} loginPassword - パスワード
 * @return {Object} バリデーション結果
 */
const validationUsersLoginPasswordConfirmation = ({
  throwError = false,
  required = false,
  value,
  loginPassword,
}) => {
  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;

  const resultObj = {
    value: data,
    numberOfCharacters,
    messageID: "KBFOZp6kv",
    error: false,
  };

  try {
    // ---------------------------------------------
    //   空の場合、バリデーションスルー
    // ---------------------------------------------

    if (validator.isEmpty(data)) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "JVjz5HxhU", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   パスワードとパスワード確認が同じ文字列でない
    // ---------------------------------------------

    if (data !== loginPassword) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "sNtN2doNl", messageID: "9jFs2LU6e" }],
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
  validationUsersLoginPassword,
  validationUsersLoginPasswordConfirmation,
};

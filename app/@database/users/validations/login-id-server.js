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
 * Login ID
 * @param {string} value - 値
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @return {Object} バリデーション結果
 */
const validationUsersLoginIDServer = async ({ value, loginUsers_id }) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 6;
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
      errorsArr: [{ code: "e4g-rZvGD", messageID: "yKjojKAxy" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "6po2zu3If", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在しているかチェック
  // ---------------------------------------------

  // ---------------------------------------------
  //   - 編集の場合
  // ---------------------------------------------

  if (loginUsers_id) {
    const count = await Model.count({
      conditionObj: {
        _id: { $ne: loginUsers_id },
        loginID: value,
      },
    });

    if (count === 1) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "2R5M5lNLA", messageID: "Y1J-vK0hW" }],
      });
    }

    // ---------------------------------------------
    //   - 新規の場合
    // ---------------------------------------------
  } else {
    const count = await Model.count({
      conditionObj: {
        loginID: value,
      },
    });

    if (count === 1) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "fi1EoNmKH", messageID: "Y1J-vK0hW" }],
      });
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
  validationUsersLoginIDServer,
};

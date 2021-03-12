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
 * E-Mail
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {string} value - 値
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {string} encryptedEmail - 暗号化されたメールアドレス
 * @return {Object} バリデーション結果
 */
const validationUsersEmailServer = async ({
  required = false,
  value,
  loginUsers_id,
  encryptedEmail,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 3;
  const maxLength = 100;

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
  //   空の場合、処理停止
  // ---------------------------------------------

  if (validator.isEmpty(data)) {
    if (required) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "XIn-aRGHD", messageID: "cFbXmuFVh" }],
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
      errorsArr: [{ code: "M4fBF4b4P", messageID: "ilE2NcYjI" }],
    });
  }

  // ---------------------------------------------
  //   メールアドレスチェック
  // ---------------------------------------------

  if (!validator.isEmail(data, { allow_utf8_local_part: false })) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "yX8i4gekS", messageID: "5O4K1an7k" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在しているかチェック
  // ---------------------------------------------

  // ---------------------------------------------
  //   編集の場合
  // ---------------------------------------------

  if (loginUsers_id) {
    // 現在登録している、確認済みのメールアドレスをもう一度登録しようとした場合、エラー
    const count1 = await Model.count({
      conditionObj: {
        _id: loginUsers_id,
        "emailObj.value": encryptedEmail,
        "emailObj.confirmation": true,
      },
    });

    if (count1 === 1) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "PIfteQDcZ", messageID: "FQgx7kEJN" }],
      });
    }

    // 他のユーザーが利用しているメールアドレスを登録しようとした場合、エラー
    const count2 = await Model.count({
      conditionObj: {
        _id: { $ne: loginUsers_id },
        "emailObj.value": encryptedEmail,
      },
    });

    if (count2 === 1) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "Tq6BYP4Fz", messageID: "5H8rr53kE" }],
      });
    }

    // ---------------------------------------------
    //   新規の場合
    // ---------------------------------------------
  } else {
    const count = await Model.count({
      conditionObj: {
        "emailObj.value": encryptedEmail,
      },
    });

    if (count === 1) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "V33-9qy9_", messageID: "5H8rr53kE" }],
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
  validationUsersEmailServer,
};

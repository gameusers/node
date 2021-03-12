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
//   Model
// ---------------------------------------------

const Model = require("../model");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom");

/**
 * _id の配列
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} arr - 値の入った配列
 * @return {Object} バリデーション結果
 */
const validationGameGenres_idsArrServer = async ({
  required = false,
  localeObj,
  arr = [],
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const resultObj = {
    value: arr,
  };

  // ---------------------------------------------
  //   配列チェック
  // ---------------------------------------------

  if (!Array.isArray(arr)) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "s2i3N1sRM", messageID: "qnWsuPcrJ" }],
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
        errorsArr: [{ code: "wxilDwCR6", messageID: "Error" }],
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
        errorsArr: [{ code: "JUjLl3JNE", messageID: "Pp_CFyt_3" }],
      });
    }
  }

  // ---------------------------------------------
  //   データベースに存在していない場合、エラー
  // ---------------------------------------------

  // --------------------------------------------------
  //   Language & Country
  // --------------------------------------------------

  const language = lodashGet(localeObj, ["language"], "");
  const country = lodashGet(localeObj, ["country"], "");

  const count = await Model.count({
    conditionObj: {
      language,
      country,
      genreID: { $in: arr },
    },
  });

  // console.log(chalk`
  //   app/@database/game-genres/validations/_id-server.js
  //   count: {green ${count}}
  //   length: {green ${length}}
  // `);

  if (count !== length) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "rHZFMRkW0", messageID: "cvS0qSAlE" }],
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
  validationGameGenres_idsArrServer,
};

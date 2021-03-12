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
 * _id
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationGameCommunities_idServer = async ({ value }) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

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
      errorsArr: [{ code: "7azwAsn2J", messageID: "Pp_CFyt_3" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "ZOunxdwnK", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在していない場合、エラー
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      _id: value,
    },
  });

  if (count === 0) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "fo7x4T1hk", messageID: "cvS0qSAlE" }],
    });
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return resultObj;
};

/**
 * _id の配列
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} arr - 値の入った配列
 * @return {Object} バリデーション結果
 */
const validationGameCommunities_idsArrServer = async ({
  required = false,
  arr = [],
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;
  // console.log(arr);

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const resultObj = {
    value: arr,
  };
  // arr.push('aaa189we');

  // ---------------------------------------------
  //   配列チェック
  // ---------------------------------------------

  if (!Array.isArray(arr)) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "jZ68fyeyE", messageID: "qnWsuPcrJ" }],
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
        errorsArr: [{ code: "Wgi6vjqT5", messageID: "Error" }],
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
        errorsArr: [{ code: "Vgfqs0KL-", messageID: "Pp_CFyt_3" }],
      });
    }

    // ---------------------------------------------
    //   英数と -_ のみ
    // ---------------------------------------------

    if (value.match(/^[\w\-]+$/) === null) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "PQP2AX4uG", messageID: "JBkjlGQMh" }],
      });
    }

    // console.log(value);
  }

  // ---------------------------------------------
  //   データベースに存在していない場合、エラー
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      _id: { $in: arr },
    },
  });

  // console.log(chalk`
  //   /app/@database/game-communities/validations/_id-server.js
  //   count: {green ${count}}
  //   length: {green ${length}}
  // `);

  if (count !== length) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "GVJ2NWGXe", messageID: "cvS0qSAlE" }],
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
  validationGameCommunities_idServer,
  validationGameCommunities_idsArrServer,
};

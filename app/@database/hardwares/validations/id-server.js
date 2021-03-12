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

const Model = require("../model.js");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom.js");

/**
 * hardwareID の配列
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationHardwareIDsArrServer = async ({ arr }) => {
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
      errorsArr: [{ code: "_QkNkmz_P", messageID: "3mDvfqZHV" }],
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
  //   データベースから取得
  // ---------------------------------------------

  const docArr = await Model.find({
    conditionObj: {
      hardwareID: { $in: arr },
    },
  });

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
        errorsArr: [{ code: "hL4FvV-qW", messageID: "Pp_CFyt_3" }],
      });
    }

    // ---------------------------------------------
    //   英数と -_ のみ
    // ---------------------------------------------

    if (value.match(/^[\w\-]+$/) === null) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "iPhoN03Bb", messageID: "JBkjlGQMh" }],
      });
    }

    // ---------------------------------------------
    //   存在する hardwareID かチェックする
    // ---------------------------------------------

    const index = docArr.findIndex((valueObj) => {
      return valueObj.hardwareID === value;
    });

    // console.log(chalk`
    //   index: {green ${index}}
    // `);

    if (index === -1) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "t_RvzHXAA", messageID: "3mDvfqZHV" }],
      });
    }
  }

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(arr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- docArr -----\n
  //   ${util.inspect(docArr, { colors: true, depth: null })}\n
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
  validationHardwareIDsArrServer,
};

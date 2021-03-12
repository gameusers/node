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
 * _id の配列
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationTitles_idsArrServer = async ({ arr }) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const resultObj = {
    valueArr: [],
  };

  // ---------------------------------------------
  //   配列チェック
  // ---------------------------------------------

  if (!Array.isArray(arr)) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "UoOzTieo-", messageID: "3mDvfqZHV" }],
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
      _id: { $in: arr },
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
        errorsArr: [{ code: "3didaI31_", messageID: "Pp_CFyt_3" }],
      });
    }

    // ---------------------------------------------
    //   英数と -_ のみ
    // ---------------------------------------------

    if (value.match(/^[\w\-]+$/) === null) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "qqXNOf2nO", messageID: "JBkjlGQMh" }],
      });
    }

    // ---------------------------------------------
    //   存在する _id かチェックする
    // ---------------------------------------------

    const index = docArr.findIndex((valueObj) => {
      return valueObj._id === value;
    });

    // console.log(chalk`
    //   index: {green ${index}}
    // `);

    if (index !== -1) {
      resultObj.valueArr.push(value);
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
  validationTitles_idsArrServer,
};

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
 * _id
 * @param {string} value - 値
 * @param {string} loginUsers_id - DB users _id ログインしているユーザーの_id
 * @return {Object} バリデーション結果
 */
const validationIDs_idServer = async ({ value, loginUsers_id }) => {
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
      errorsArr: [{ code: "s6_dxRYRq", messageID: "Pp_CFyt_3" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "cTVQ385BV", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在しているか＆編集権限チェック
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      _id: value,
      users_id: loginUsers_id,
    },
  });

  if (count !== 1) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "QgZ0D1z-H", messageID: "cvS0qSAlE" }],
    });
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return resultObj;
};

/**
 * _id / 配列で検索
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} valueArr - 配列
 * @return {Object} バリデーション結果
 */
const validationIDsArrServer = async ({
  required = false,
  valueArr,
  loginUsers_id,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const _idsArr = [];

  const resultObj = {
    valueArr: [],
    messageID: "Error",
  };

  try {
    // ---------------------------------------------
    //   配列チェック
    // ---------------------------------------------

    if (!Array.isArray(valueArr)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "SZ_1gq_l-", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   空の場合、処理停止
    // ---------------------------------------------

    if (valueArr.length === 0) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "g4qvICdhA", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   Loop
    // ---------------------------------------------

    for (let dataObj of valueArr.values()) {
      const _id = dataObj._id;

      // ---------------------------------------------
      //   文字数チェック
      // ---------------------------------------------

      if (!validator.isLength(_id, { min: minLength, max: maxLength })) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "DPijzWxpl", messageID: "Pp_CFyt_3" }],
        });
      }

      // ---------------------------------------------
      //   英数と -_ のみ
      // ---------------------------------------------

      if (_id.match(/^[\w\-]+$/) === null) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "snLJ8V3Dg", messageID: "JBkjlGQMh" }],
        });
      }

      _idsArr.push(_id);
    }

    // ---------------------------------------------
    //   Database
    // ---------------------------------------------

    if (_idsArr.length > 0) {
      // ---------------------------------------------
      //   find
      // ---------------------------------------------

      const docArr = await Model.find({
        conditionObj: {
          _id: { $in: _idsArr },
          users_id: loginUsers_id,
        },
      });

      // console.log(`
      //   ----- docArr -----\n
      //   ${util.inspect(docArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   ループしてデータベースに存在している _id のみ resultObj.valueArr に追加する
      // ---------------------------------------------

      for (let value of _idsArr.values()) {
        const tempObj = docArr.find((valueObj) => {
          return valueObj._id === value;
        });

        if (tempObj) {
          resultObj.valueArr.push(tempObj._id);
        }
      }
    }
  } catch (errorObj) {
    // ---------------------------------------------
    //   Throw Error
    // ---------------------------------------------

    throw errorObj;
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
  validationIDs_idServer,
  validationIDsArrServer,
};

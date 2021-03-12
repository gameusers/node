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

const shortid = require("shortid");
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
 * Activity Time Object / Value Array
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} valueArr - 配列
 * @return {Object} バリデーション結果
 */
const validationCardPlayersActivityTimeArr = ({
  throwError = false,
  required = false,
  valueArr,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minNumber = 1;
  const maxNumber = 7;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const resultObj = {
    valueArr: [],
    formArr: [],
    messageID: "Error",
    error: false,
  };

  try {
    // ---------------------------------------------
    //   配列チェック
    // ---------------------------------------------

    if (!Array.isArray(valueArr)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "3NAm-ySR8", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   保存できる最大数を超えているかチェック
    // ---------------------------------------------

    const limit = parseInt(
      process.env.NEXT_PUBLIC_CARD_PLAYER_ACTIVITY_TIME_LIMIT,
      10
    );

    // console.log(chalk`
    //   valueArr.length: {green ${valueArr.length}}
    //   limit: {green ${limit}}
    //   valueArr.length > limit: {green ${valueArr.length > limit}}
    // `);

    if (valueArr.length > limit) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "rqjdqvF11", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   空の場合、処理停止
    // ---------------------------------------------

    if (valueArr.length === 0) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "-_L7KAmti", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   Loop
    // ---------------------------------------------

    for (let valueObj of valueArr.values()) {
      let error = false;

      const _id = lodashGet(valueObj, ["_id"], shortid.generate());
      const beginTime = lodashGet(valueObj, ["beginTime"], "");
      const endTime = lodashGet(valueObj, ["endTime"], "");
      const weekArr = lodashGet(valueObj, ["weekArr"], []);

      const formObj = {
        beginTimeObj: {
          messageID: "vKhuy_98i",
          error: false,
        },
        endTimeObj: {
          messageID: "h7yr2vkyk",
          error: false,
        },
        weekObj: {
          messageID: "vplWXcVvo",
          error: false,
        },
      };

      // ---------------------------------------------
      //   _id / 英数と -_ のみ
      // ---------------------------------------------

      if (_id.match(/^[\w\-]+$/) === null) {
        error = true;
      }

      // ---------------------------------------------
      //   開始時間
      // ---------------------------------------------

      // 時間チェック
      if (beginTime.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]+$/) === null) {
        formObj.beginTimeObj.error = true;
        formObj.beginTimeObj.messageID = "McbWUO45b";
        error = true;
      }

      // 存在チェック
      if (validator.isEmpty(beginTime)) {
        formObj.beginTimeObj.error = true;
        formObj.beginTimeObj.messageID = "cFbXmuFVh";
        error = true;
      }

      // ---------------------------------------------
      //   終了時間
      // ---------------------------------------------

      // 時間チェック
      if (endTime.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]+$/) === null) {
        formObj.endTimeObj.error = true;
        formObj.endTimeObj.messageID = "McbWUO45b";
        error = true;
      }

      // 存在チェック
      if (validator.isEmpty(endTime)) {
        formObj.endTimeObj.error = true;
        formObj.endTimeObj.messageID = "cFbXmuFVh";
        error = true;
      }

      // ---------------------------------------------
      //   曜日
      // ---------------------------------------------

      // 配列の値が数字の範囲内に収まっているか
      if (weekArr.length > 0) {
        for (let week of weekArr.values()) {
          if (
            !validator.isInt(String(week), { min: minNumber, max: maxNumber })
          ) {
            formObj.weekObj.error = true;
            formObj.weekObj.messageID = "PH8jcw-VF";
            error = true;
          }
        }

        // 曜日が選ばれていない場合
      } else {
        formObj.weekObj.error = true;
        formObj.weekObj.messageID = "dmja16xDh";
        error = true;
      }

      // ---------------------------------------------
      //   データ代入
      // ---------------------------------------------

      // フォーム用
      resultObj.formArr.push(formObj);

      // データベース更新用
      if (!error) {
        resultObj.valueArr.push({
          _id,
          beginTime,
          endTime,
          weekArr,
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
  validationCardPlayersActivityTimeArr,
};

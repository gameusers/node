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
// const moment = require('moment');

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom.js");

/**
 * 募集の締め切り日
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {string} value - 値
 * @return {Object} バリデーション結果
 */
const validationRecruitmentThreadsDeadlineDate = ({
  throwError = false,
  required = false,
  value,
}) => {
  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = value ? String(value) : "";
  const numberOfCharacters = data ? data.length : 0;

  const resultObj = {
    value: data,
    numberOfCharacters,
    messageID: "SFC7guhlr",
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
          errorsArr: [{ code: "tQGCaPEVr", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   日付チェック
    // ---------------------------------------------

    if (!validator.isISO8601(data)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "N-xewnatz", messageID: "bT9TGtVck" }],
      });
    }

    // ---------------------------------------------
    //   今日より前の場合はエラー
    // ---------------------------------------------

    // const ISO8601Today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
    // const ISO8601Deadline = moment(data);

    // // console.log(chalk`
    // //   ISO8601Today: {green ${ISO8601Today.toISOString()}}
    // //   ISO8601Deadline: {green ${ISO8601Deadline.toISOString()}}
    // //   ISO8601Deadline.isBefore(ISO8601Today): {green ${ISO8601Deadline.isBefore(ISO8601Today)}}
    // // `);

    // if (ISO8601Deadline.isBefore(ISO8601Today)) {
    //   throw new CustomError({ level: 'warn', errorsArr: [{ code: 'z3Omz57WQ', messageID: 'zZBe6dTLB' }] });
    // }
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
  validationRecruitmentThreadsDeadlineDate,
};

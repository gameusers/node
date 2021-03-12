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

const moment = require("moment");
const shortid = require("shortid");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../error/custom");

// ---------------------------------------------
//   Logger
// ---------------------------------------------

const logger = require("./logger");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * Error 情報の入ったオブジェクトを返してログを記録する
 * @param {Object} errorObj - catchで取得したエラーオブジェクト
 * @param {string} endpointID - エンドポイントを特定するID
 * @param {string} users_id - ログインしていユーザーの DB users _id
 * @param {string} ip - アクセスしたクライアントのIP
 * @param {string} userAgent - アクセスしたクライアントのユーザーエージェント
 * @param {Object} requestParametersObj - GET / POSTのリクエストパラメーター
 * @return {Object} エラーオブジェクト
 */
const returnErrorsArr = ({
  errorObj = {},
  endpointID,
  users_id,
  ip,
  userAgent = "",
  requestParametersObj,
}) => {
  // ---------------------------------------------
  //   Property
  // ---------------------------------------------

  let errorsArr = [];
  let codeArr = [];
  const logID = shortid.generate();
  const level = lodashGet(errorObj, ["level"], "error");
  const message = lodashGet(errorObj, ["message"], "");

  // console.log(chalk`
  //   level: {green ${level}}
  //   message: {green ${message}}
  // `);

  // console.log(`\n---------- errorObj ----------\n`);
  // console.dir(JSON.parse(JSON.stringify(errorObj)));
  // console.log(`\n-----------------------------------\n`);

  // ---------------------------------------------
  //   Custom Error
  // ---------------------------------------------

  if (errorObj instanceof CustomError) {
    errorsArr = lodashGet(errorObj, ["errorsArr"], []);

    // ---------------------------------------------
    //   Loop
    // ---------------------------------------------

    for (let valueObj of errorsArr) {
      codeArr.push(valueObj.code);
    }

    // ---------------------------------------------
    //   Default Error
    // ---------------------------------------------
  } else {
    errorsArr = [{ code: logID, messageID: "Error" }];
  }

  // ---------------------------------------------
  //   Log Object
  // ---------------------------------------------

  const logObj = {
    logID,
    date: moment().utc().toISOString(),
    endpointID,
    users_id,
    ip,
    userAgent,
    requestParametersObj,
    errorsArr,
  };

  // ---------------------------------------------
  //   Log
  // ---------------------------------------------

  logger.log(level, message, logObj);

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return { errorsArr };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  returnErrorsArr,
};

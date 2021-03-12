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

// ---------------------------------------------
//   Logger
// ---------------------------------------------

const logger = require("../logger");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * Error 情報の入ったオブジェクトを返してログを記録する
 * @param {string} fileID - ファイル固有のID
 * @param {string} functionID - 関数固有のID
 * @param {string} messageCode - メッセージコード
 * @param {Array} errorCodeArr - エラーコードが入っている配列
 * @param {Object} errorObj - catchで取得したエラーオブジェクト
 * @param {string} loginUsers_id - ログインしていユーザーの DB users _id
 * @return {Object} エラーオブジェクト
 */
const errorCodeIntoErrorObj = ({
  fileID,
  functionID,
  messageCode,
  errorCodeArr,
  errorObj,
  loginUsers_id,
}) => {
  // ---------------------------------------------
  //   Property
  // ---------------------------------------------

  let errorsArr = [];
  let logArr = [];

  // ---------------------------------------------
  //   Loop
  // ---------------------------------------------

  for (let value of errorCodeArr) {
    // ---------------------------------------------
    //   Errors Arr
    // ---------------------------------------------

    let tempObj = {
      code: `${fileID}@${functionID}@${value}`,
      messageCode,
    };

    errorsArr.push(tempObj);

    // ---------------------------------------------
    //   Log Array
    // ---------------------------------------------

    logArr.push(
      `${moment().utc().toISOString()}\nCode: ${
        tempObj.code
      }\nLogin User: ${loginUsers_id}\nMessage: ${errorObj.message}`
    );
  }

  // ---------------------------------------------
  //   Log
  // ---------------------------------------------

  logger.log("error", `${logArr.join(" / ")}`);

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return {
    errorsArr,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  errorCodeIntoErrorObj,
};

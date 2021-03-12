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

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { CustomError } from "./custom";

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * Error Message を返す
 * @param {Object} intl - intl.formatMessage 用
 * @param {Object} localeObj - Locale Object
 * @param {Object} errorObj - Error Object
 * @return {string} Error Message
 */
const returnErrorMessage = ({ intl, localeObj, errorObj }) => {
  // ---------------------------------------------
  //   Loop
  // ---------------------------------------------

  let message = "";

  if (errorObj instanceof CustomError) {
    // console.log('Custom Error');

    // console.log(`\n---------- errorObj.errorsArr ----------\n`);
    // console.dir(errorObj.errorsArr);
    // console.log(`\n-----------------------------------\n`);

    // console.log(chalk`
    //   lodashGet(errorObj, ['errorsArr', 0, 'messageCode'], 'Error'): {green ${lodashGet(errorObj, ['errorsArr', 0, 'messageCode'], 'Error')}}
    // `);

    let id = lodashGet(errorObj, ["errorsArr", 0, "messageID"], "Error");
    let code = lodashGet(errorObj, ["errorsArr", 0, "code"], "Error");

    if (!id) {
      id = "Error";
    }

    if (!code) {
      code = "Error";
    }

    message = intl.formatMessage({ id }, { code });
  } else {
    // console.log('Default Error');

    message = errorObj.message;
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return message;
};

/**
 * Snackbar用のメッセージオブジェクトを返す
 * @param {Object} errorObj - Error Object
 * @return {Object} Message Object
 */
const returnMessageObjectFromErrorObject = ({ errorObj }) => {
  // ---------------------------------------------
  //   Loop
  // ---------------------------------------------

  let returnObj = {
    message: "",
    messageID: "",
  };

  if (errorObj instanceof CustomError) {
    // console.log('Custom Error');

    // console.log(`\n---------- errorObj.errorsArr ----------\n`);
    // console.dir(errorObj.errorsArr);
    // console.log(`\n-----------------------------------\n`);

    // console.log(chalk`
    //   lodashGet(errorObj, ['errorsArr', 0, 'messageCode'], 'Error'): {green ${lodashGet(errorObj, ['errorsArr', 0, 'messageCode'], 'Error')}}
    // `);

    returnObj.message = lodashGet(errorObj, ["errorsArr", 0, "code"], "Error");
    returnObj.messageID = lodashGet(
      errorObj,
      ["errorsArr", 0, "messageID"],
      "Error"
    );

    // if (!returnObj.messageID) {
    //   returnObj.messageID = 'Error';
    // }

    // if (!code) {
    //   code = 'Error';
    // }

    // message = intl.formatMessage(
    //   { id },
    //   { code },
    // );
  } else {
    // console.log('Default Error');
    returnObj.message = errorObj.message;
    returnObj.messageID = "Error";
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return returnObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  returnErrorMessage,
  returnMessageObjectFromErrorObject,
};

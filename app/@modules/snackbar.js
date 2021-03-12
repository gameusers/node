// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { CustomError } from "app/@modules/error/custom.js";

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * Snackbar を表示する
 * @param {} enqueueSnackbar -
 * @param {} intl -
 * @param {Array} arr - 表示する情報が入った配列
 * @param {Object} experienceObj -
 */
const showSnackbar = async ({
  enqueueSnackbar,
  intl,
  arr = [],
  experienceObj = {},
  errorObj,
}) => {
  try {
    // console.log(`
    //   ----- errorObj -----\n
    //   ${util.inspect(errorObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   experience
    // --------------------------------------------------

    const messageExp = lodashGet(experienceObj, ["exp"], 0);
    const messageLevel = lodashGet(experienceObj, ["level"], 0);
    const titlesArr = lodashGet(experienceObj, ["titlesArr"], []);

    const loopArr = arr;

    if (messageExp) {
      loopArr.push({
        messageExp,
      });
    }

    if (messageLevel) {
      loopArr.push({
        messageLevel,
      });
    }

    for (let messageTitle of titlesArr.values()) {
      loopArr.push({
        messageTitle,
      });
    }

    // --------------------------------------------------
    //   Error
    // --------------------------------------------------

    if (errorObj instanceof CustomError) {
      const code = lodashGet(errorObj, ["errorsArr", 0, "code"], "");
      const messageID = lodashGet(errorObj, ["errorsArr", 0, "messageID"], "");

      if (messageID === "Error") {
        // console.log('AAA');
        loopArr.push({
          variant: "error",
          message: `Error Code: ${code}`,
        });
      } else if (messageID) {
        // console.log('BBB');
        loopArr.push({
          variant: "error",
          messageID,
        });
      }

      // console.log(chalk`
      //   code: {green ${code}}
      //   messageID: {green ${messageID}}
      // `);
    } else if (errorObj instanceof Error) {
      loopArr.push({
        variant: "error",
        message: `Error: ${errorObj.message}`,
      });
      // console.log('CCC');
    }

    // console.log(`
    //   ----- experienceObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(experienceObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(errorObj);
    // console.log(typeof errorObj);

    // console.log(`
    //   ----- errorObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(errorObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- loopArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(loopArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Loop
    // --------------------------------------------------

    for (const [index, valueObj] of loopArr.entries()) {
      // --------------------------------------------------
      //   Property
      // --------------------------------------------------

      const message = lodashGet(valueObj, ["message"], "");
      const messageID = lodashGet(valueObj, ["messageID"], "");
      const messageExp = lodashGet(valueObj, ["messageExp"], 0);
      const messageLevel = lodashGet(valueObj, ["messageLevel"], 0);
      const messageTitle = lodashGet(valueObj, ["messageTitle"], "");

      let variant = lodashGet(valueObj, ["variant"], "");
      const anchorOrigin = lodashGet(valueObj, ["anchorOrigin"], {
        horizontal: "left",
        vertical: "bottom",
      });
      const autoHideDuration = lodashGet(valueObj, ["autoHideDuration"], 5000);

      // --------------------------------------------------
      //   Message
      // --------------------------------------------------

      let sendMessage = "";

      if (messageID) {
        sendMessage = intl.formatMessage({ id: messageID });
      } else if (messageExp) {
        let exp = `+ ${messageExp}`;
        variant = "info";

        if (Math.sign(messageExp) === -1) {
          exp = `- ${-messageExp}`;
          variant = "warning";
        }

        sendMessage = intl.formatMessage({ id: "WGCqmLUca" }, { exp });
      } else if (messageLevel) {
        variant = "info";
        sendMessage = intl.formatMessage(
          { id: "FBVZHpPKN" },
          { level: messageLevel }
        );
      } else if (messageTitle) {
        variant = "success";
        sendMessage = intl.formatMessage(
          { id: "vbNIsVv4w" },
          { title: messageTitle }
        );
      } else if (message) {
        sendMessage = message;
      }

      // ---------------------------------------------
      //   一定時間後に実行するためにミリ秒を設定する
      // ---------------------------------------------

      const millisecond = 2000 * index;

      // console.log(chalk`
      //   message: {green ${message}}
      //   messageID: {green ${messageID}}
      //   millisecond: {green ${millisecond}}
      // `);

      // ---------------------------------------------
      //   enqueueSnackbar
      // ---------------------------------------------

      setTimeout(
        () =>
          enqueueSnackbar(sendMessage, {
            variant,
            anchorOrigin,
            autoHideDuration,
          }),
        millisecond
      );
    }

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/snackbar.js - showSnackbar
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  } catch (errorObj) {
    throw errorObj;
  }
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  showSnackbar,
};

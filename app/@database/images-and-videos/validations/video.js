// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

const chalk = require("chalk");
const util = require("util");

// ---------------------------------------------
//   Validation
// ---------------------------------------------

const validator = require("validator");
const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom");

/**
 * Video Channel
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {string} videoChannel - チャンネル / youtube
 * @param {string} videoID - Video ID / PeEjT4vmG
 * @return {Object} バリデーション結果
 */
const validationVideo = ({ throwError = false, videoChannel, videoID }) => {
  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  let resultObj = {
    messageID: "Error",
    error: false,
  };

  try {
    // ---------------------------------------------
    //   videoChannel / 適切な値が選択されているかチェック
    // ---------------------------------------------

    if (!validator.isIn(videoChannel, ["youtube"])) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "P9AI5L2nd", messageID: "PH8jcw-VF" }],
      });
    }

    // ---------------------------------------------
    //   YouTube
    // ---------------------------------------------

    if (videoChannel === "youtube") {
      // ---------------------------------------------
      //   videoID / 文字数チェック
      // ---------------------------------------------

      if (!validator.isLength(videoID, { min: 7, max: 14 })) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "SLkXcjg5V", messageID: "Pp_CFyt_3" }],
        });
      }

      // ---------------------------------------------
      //   videoID / 英数と -_ のみ
      // ---------------------------------------------

      if (videoID.match(/^[\w\-]+$/) === null) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "OCP1jOfmG", messageID: "JBkjlGQMh" }],
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
  validationVideo,
};

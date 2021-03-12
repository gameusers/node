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
 * Link Array
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} valueArr - 配列
 * @return {Object} バリデーション結果
 */
const validationCardPlayersLinkArr = ({
  throwError = false,
  required = false,
  valueArr,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLengthLabel = 1;
  const maxLengthLabel = 20;

  const minLengthURL = 1;
  const maxLengthURL = 500;

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
        errorsArr: [{ code: "UoiTVF_8o", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   保存できる最大数を超えているかチェック
    // ---------------------------------------------

    const limit = parseInt(process.env.NEXT_PUBLIC_CARD_PLAYER_LINK_LIMIT, 10);

    // console.log(chalk`
    //   valueArr.length: {green ${valueArr.length}}
    //   limit: {green ${limit}}
    //   valueArr.length > limit: {green ${valueArr.length > limit}}
    // `);

    if (valueArr.length > limit) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "TjlRB7EP6", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   空の場合、処理停止
    // ---------------------------------------------

    if (valueArr.length === 0) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "BJq93I2jz", messageID: "cFbXmuFVh" }],
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
      const type = lodashGet(valueObj, ["type"], "");
      const label = lodashGet(valueObj, ["label"], "");
      const url = lodashGet(valueObj, ["url"], "");
      const search = lodashGet(valueObj, ["search"], true);

      const formObj = {
        typeObj: {
          messageID: "Error",
          error: false,
        },
        labelObj: {
          messageID: "sOgKU3gS9",
          error: false,
        },
        urlObj: {
          messageID: "CAhUTCx7B",
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
      //   Type
      // ---------------------------------------------

      if (
        !validator.isIn(type, [
          "Twitter",
          "Facebook",
          "Instagram",
          "YouTube",
          "Twitch",
          "Steam",
          "Discord",
          "Flickr",
          "Tumblr",
          "Pinterest",
          "Other",
        ])
      ) {
        formObj.typeObj.error = true;
        formObj.typeObj.messageID = "PH8jcw-VF";
        error = true;
      }

      // ---------------------------------------------
      //   Label
      // ---------------------------------------------

      // Type が Other の場合、Label の入力が必要
      if (type === "Other" && validator.isEmpty(label)) {
        formObj.endTimeObj.error = true;
        formObj.endTimeObj.messageID = "cFbXmuFVh";
        error = true;
      }

      // 文字数チェック
      if (
        !validator.isEmpty(label) &&
        !validator.isLength(label, { min: minLengthLabel, max: maxLengthLabel })
      ) {
        formObj.endTimeObj.error = true;
        formObj.endTimeObj.messageID = "xdAU7SgoO";
        error = true;
      }

      // ---------------------------------------------
      //   URL
      // ---------------------------------------------

      // 文字数チェック
      if (!validator.isLength(url, { min: minLengthURL, max: maxLengthURL })) {
        formObj.urlObj.error = true;
        formObj.urlObj.messageID = "eASl8OdnD";
        error = true;
      }

      // URLチェック
      if (!validator.isURL(url)) {
        formObj.urlObj.error = true;
        formObj.urlObj.messageID = "Bv79Cmo2s";
        error = true;
      }

      // ---------------------------------------------
      //   Search
      // ---------------------------------------------

      // Booleanチェック
      if (!validator.isBoolean(String(search))) {
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
          type,
          label,
          url,
          search,
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
  validationCardPlayersLinkArr,
};

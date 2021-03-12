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
//   Model
// ---------------------------------------------

const ModelHardwares = require("../../hardwares/model.js");
const ModelDevelopersPublishers = require("../../developers-publishers/model.js");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom.js");

/**
 * ハードウェア
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} valueArr - 配列
 * @return {Object} バリデーション結果
 */
const validationGamesHardwareArrServer = async ({
  required = false,
  localeObj,
  valueArr,
}) => {
  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const resultObj = {
    valueArr: [],
    formArr: [],
    messageID: "Error",
    error: false,
  };

  // ---------------------------------------------
  //   配列チェック
  // ---------------------------------------------

  if (!Array.isArray(valueArr)) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "Gkrk8HeRT", messageID: "qnWsuPcrJ" }],
    });
  }

  // ---------------------------------------------
  //   保存できる最大数を超えているかチェック
  // ---------------------------------------------

  const limit = parseInt(process.env.NEXT_PUBLIC_GAMES_HARDWARES_LIMIT, 10);

  // console.log(chalk`
  //   valueArr.length: {green ${valueArr.length}}
  //   limit: {green ${limit}}
  //   valueArr.length > limit: {green ${valueArr.length > limit}}
  // `);

  if (valueArr.length > limit) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "wdXYPnkw3", messageID: "qnWsuPcrJ" }],
    });
  }

  // ---------------------------------------------
  //   空の場合、処理停止
  // ---------------------------------------------

  if (valueArr.length === 0) {
    if (required) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "AI9tF19ZX", messageID: "cFbXmuFVh" }],
      });
    }

    return resultObj;
  }

  // ---------------------------------------------
  //   Loop
  // ---------------------------------------------

  let hardwareIDsArr = [];
  let developerPublisherIDsArr = [];

  for (let valueObj of valueArr.values()) {
    // const _id = lodashGet(valueObj, ['_id'], shortid.generate());
    const hardwareID = lodashGet(valueObj, ["hardwareID"], "");
    const playersMin = parseInt(lodashGet(valueObj, ["playersMin"], 1), 10);
    const playersMax = parseInt(lodashGet(valueObj, ["playersMax"], 1), 10);
    const publisherIDsArr = lodashGet(valueObj, ["publisherIDsArr"], []);
    const developerIDsArr = lodashGet(valueObj, ["developerIDsArr"], []);

    // ---------------------------------------------
    //   整数チェック
    // ---------------------------------------------

    if (!Number.isInteger(playersMin)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "TwguaNB7k", messageID: "f_YBnQcfW" }],
      });
    }

    if (!Number.isInteger(playersMax)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "uIj9Oezb2", messageID: "f_YBnQcfW" }],
      });
    }

    // ---------------------------------------------
    //   配列追加・結合
    // ---------------------------------------------

    hardwareIDsArr.push(hardwareID);
    developerPublisherIDsArr = publisherIDsArr.concat(developerIDsArr);
  }

  // ---------------------------------------------
  //   - 配列の重複している値を削除
  // ---------------------------------------------

  developerPublisherIDsArr = Array.from(new Set(developerPublisherIDsArr));

  // ---------------------------------------------
  //   データベースに存在していない _id を含んでいる場合、エラー
  // ---------------------------------------------

  // ---------------------------------------------
  //   - Language & Country
  // ---------------------------------------------

  const language = lodashGet(localeObj, ["language"], "");
  const country = lodashGet(localeObj, ["country"], "");

  // ---------------------------------------------
  //   - hardwares
  // ---------------------------------------------

  const countHardwares = await ModelHardwares.count({
    conditionObj: {
      language,
      country,
      hardwareID: { $in: hardwareIDsArr },
    },
  });

  if (countHardwares !== hardwareIDsArr.length) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "kAbHkNUZy", messageID: "PH8jcw-VF" }],
    });
  }

  // ---------------------------------------------
  //   - developers-publishers
  // ---------------------------------------------

  const countDevelopersPublishers = await ModelDevelopersPublishers.count({
    conditionObj: {
      language,
      country,
      developerPublisherID: { $in: developerPublisherIDsArr },
    },
  });

  if (countDevelopersPublishers !== developerPublisherIDsArr.length) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "F65GeHeFQ", messageID: "PH8jcw-VF" }],
    });
  }

  // console.log(`
  //   ----- hardwareIDsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(hardwareIDsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- developerPublisherIDsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(developerPublisherIDsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   countHardwares: {green ${countHardwares}}
  //   hardwareIDsArr.length: {green ${hardwareIDsArr.length}}
  //   countDevelopersPublishers: {green ${countDevelopersPublishers}}
  //   developerPublisherIDsArr.length: {green ${developerPublisherIDsArr.length}}
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
  validationGamesHardwareArrServer,
};

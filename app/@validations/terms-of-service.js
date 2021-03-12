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
const moment = require("moment");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../@modules/error/custom.js");

/**
 * Terms of Service
 * @param {boolean} throwError - エラーを投げる true / resultObjを返す false
 * @param {boolean} agree - 同意しているかどうか
 * @param {string} agreedVersion - 同意したバージョン
 * @return {Object} バリデーション結果
 */
const validationTermsOfService = ({
  throwError = false,
  agree,
  agreedVersion,
}) => {
  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const resultObj = {
    value: agree,
    numberOfCharacters: 0,
    messageID: "Gn_vVgSFY",
    error: false,
  };

  try {
    // console.log(chalk`
    // agree: {green ${agree} typeof ${typeof agree}}
    // agreedVersion: {green ${agreedVersion} typeof ${typeof agreedVersion}}
    // `);

    // ---------------------------------------------
    //   Booleanチェック
    // ---------------------------------------------

    if (!validator.isBoolean(String(agree))) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "eQyXgxrXo", messageID: "PH8jcw-VF" }],
      });
    }

    // ---------------------------------------------
    //   同意していない場合
    // ---------------------------------------------

    if (!agree) {
      // ---------------------------------------------
      //   同意するチェックボックスが表示されなかった場合
      //   Cookie に保存されている同意したバージョンと現在のバージョンを比較する
      // ---------------------------------------------

      if (agreedVersion) {
        const datetimeConfirmed = moment(agreedVersion).utc();
        const datetimeCurrent = moment(
          process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_VERSION
        ).utc();

        if (datetimeConfirmed.isBefore(datetimeCurrent)) {
          throw new CustomError({
            level: "warn",
            errorsArr: [{ code: "PklwqOLIC", messageID: "Uh3rnK7Dk" }],
          });
        }

        // ---------------------------------------------
        //   同意してない場合はエラー
        // ---------------------------------------------
      } else {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "kD87Pnp1p", messageID: "Uh3rnK7Dk" }],
        });
      }
    }
  } catch (errorObj) {
    // console.log(`
    //   ----- errorObj -----\n
    //   ${util.inspect(errorObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

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
  validationTermsOfService,
};

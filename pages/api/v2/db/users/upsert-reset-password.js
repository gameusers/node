// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

import moment from "moment";
import bcrypt from "bcryptjs";

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelUsers from "app/@database/users/model.js";
import ModelEmailConfirmations from "app/@database/email-confirmations/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { verifyRecaptcha } from "app/@modules/recaptcha.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

import { validationEmailConfirmationsEmailConfirmationIDServer } from "app/@database/email-confirmations/validations/email-confirmation-id-server.js";
import { validationUsersLoginID } from "app/@database/users/validations/login-id.js";
import { validationUsersLoginPassword } from "app/@database/users/validations/login-password.js";

// --------------------------------------------------
//   endpointID: eqWZBA5qi
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const returnObj = {};
  const requestParametersObj = {};
  const loginUsers_id = lodashGet(req, ["user", "_id"], "");

  // --------------------------------------------------
  //   Language & IP & User Agent
  // --------------------------------------------------

  const acceptLanguage = lodashGet(req, ["headers", "accept-language"], "");
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = lodashGet(req, ["headers", "user-agent"], "");

  try {
    // --------------------------------------------------
    //   POST Data
    // --------------------------------------------------

    const bodyObj = JSON.parse(req.body);

    const { emailConfirmationID, loginID, loginPassword, response } = bodyObj;

    lodashSet(
      requestParametersObj,
      ["emailConfirmationID"],
      emailConfirmationID
    );
    lodashSet(requestParametersObj, ["loginID"], loginID ? "******" : "");
    lodashSet(
      requestParametersObj,
      ["loginPassword"],
      loginPassword ? "******" : ""
    );
    lodashSet(requestParametersObj, ["response"], response ? "******" : "");

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Login Check / ログイン状態ではエラー
    // --------------------------------------------------

    if (req.isAuthenticated()) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "AN2EYJq5E", messageID: "V9vI1Cl1S" }],
      });
    }

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationEmailConfirmationsEmailConfirmationIDServer({
      value: emailConfirmationID,
    });
    await validationUsersLoginID({
      throwError: true,
      required: true,
      value: loginID,
    });
    await validationUsersLoginPassword({
      throwError: true,
      required: true,
      value: loginPassword,
      loginID,
    });

    // ---------------------------------------------
    //   Verify reCAPTCHA
    // ---------------------------------------------

    await verifyRecaptcha({ response, remoteip: ip });

    // --------------------------------------------------
    //   DB email-confirmations
    // --------------------------------------------------

    // --------------------------------------------------
    //   30分前の時間を取得し、その時間内にアクセスしたかチェック
    // --------------------------------------------------

    const dateTimeLimit = moment().utc().add(-30, "minutes").toISOString();

    // --------------------------------------------------
    //   DB findOne / Email Confirmations
    // --------------------------------------------------

    const docEmailConfirmationsObj = await ModelEmailConfirmations.findOne({
      conditionObj: {
        emailConfirmationID,
        createdDate: { $gte: dateTimeLimit },
        type: "password",
        isSuccess: false,
      },
    });

    // --------------------------------------------------
    //   必要な情報がない場合、エラー
    // --------------------------------------------------

    if (!docEmailConfirmationsObj) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "1vh_wx7G-", messageID: "i2zOr6U2O" }],
      });
    }

    const emailConfirmations_id = lodashGet(
      docEmailConfirmationsObj,
      ["_id"],
      ""
    );

    // --------------------------------------------------
    //   DB users
    // --------------------------------------------------

    const users_id = lodashGet(docEmailConfirmationsObj, ["users_id"], "");

    // --------------------------------------------------
    //   DB findOne / Email Confirmations
    // --------------------------------------------------

    const docUsersObj = await ModelUsers.findOne({
      conditionObj: {
        _id: users_id,
        loginID,
      },
    });

    // --------------------------------------------------
    //   必要な情報がない場合、エラー
    // --------------------------------------------------

    if (!docUsersObj) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "uxPBw_XPi", messageID: "tPur_2KkX" }],
      });
    }

    // --------------------------------------------------
    //   Hash Password
    // --------------------------------------------------

    const hashedPassword = bcrypt.hashSync(loginPassword, 10);

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   - users
    // --------------------------------------------------

    const usersConditionObj = {
      _id: users_id,
    };

    const usersSaveObj = {
      $set: {
        updatedDate: ISO8601,
        loginPassword: hashedPassword,
      },
    };

    // --------------------------------------------------
    //   - email-confirmations
    // --------------------------------------------------

    const emailConfirmationsConditionObj = {
      _id: emailConfirmations_id,
    };

    const emailConfirmationsSaveObj = {
      $set: {
        isSuccess: true,
      },
    };

    // --------------------------------------------------
    //   - upsert
    // --------------------------------------------------

    await ModelUsers.transactionForUpsert({
      usersConditionObj,
      usersSaveObj,
      emailConfirmationsConditionObj,
      emailConfirmationsSaveObj,
    });

    // --------------------------------------------------
    //   セッションデータ格納
    //   パスワードリセット後のログインでは１度だけ reCAPTCHA のチェックをしない（すでにチェックされているため）
    // --------------------------------------------------

    req.session.passVerifyRecaptchaLoginID = loginID;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/users/upsert-reset-password.js
    // `);

    // console.log(chalk`
    //   emailConfirmationID: {green ${emailConfirmationID}}
    //   loginID: {green ${loginID}}
    //   loginPassword: {green ${loginPassword}}
    //   response: {green ${response}}

    //   emailConfirmations_id: {green ${emailConfirmations_id}}
    //   users_id: {green ${users_id}}
    // `);

    // console.log(`
    //   ----- docEmailConfirmationsObj -----\n
    //   ${util.inspect(docEmailConfirmationsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docUsersObj -----\n
    //   ${util.inspect(docUsersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- usersConditionObj -----\n
    //   ${util.inspect(usersConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- usersSaveObj -----\n
    //   ${util.inspect(usersSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- emailConfirmationsConditionObj -----\n
    //   ${util.inspect(emailConfirmationsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- emailConfirmationsSaveObj -----\n
    //   ${util.inspect(emailConfirmationsSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Success
    // ---------------------------------------------

    return res.status(200).json(returnObj);
  } catch (errorObj) {
    // ---------------------------------------------
    //   Log
    // ---------------------------------------------

    const resultErrorObj = returnErrorsArr({
      errorObj,
      endpointID: "eqWZBA5qi",
      users_id: loginUsers_id,
      ip,
      userAgent,
      requestParametersObj,
    });

    // --------------------------------------------------
    //   Return JSON Object / Error
    // --------------------------------------------------

    return res.status(statusCode).json(resultErrorObj);
  }
};

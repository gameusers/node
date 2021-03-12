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
import shortid from "shortid";

// ---------------------------------------------
//   Lodash
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
import { encrypt, decrypt } from "app/@modules/crypto.js";
import { sendMailResetPassword } from "app/@modules/email.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

import { validationUsersLoginID } from "app/@database/users/validations/login-id.js";
import { validationUsersEmail } from "app/@database/users/validations/email.js";

// --------------------------------------------------
//   endpointID: jH--xmn-y
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

    const { loginID, email, response } = bodyObj;

    // --------------------------------------------------
    //   Log Data
    // --------------------------------------------------

    lodashSet(requestParametersObj, ["loginID"], loginID ? "******" : "");
    lodashSet(requestParametersObj, ["email"], email ? "******" : "");
    lodashSet(requestParametersObj, ["response"], response ? "******" : "");

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // ---------------------------------------------
    //   Verify reCAPTCHA
    // ---------------------------------------------

    await verifyRecaptcha({ response, remoteip: ip });

    // --------------------------------------------------
    //   Login Check / ログイン状態ではエラー
    // --------------------------------------------------

    if (req.isAuthenticated()) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "M-Clzy2kt", messageID: "V9vI1Cl1S" }],
      });
    }

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationUsersLoginID({
      throwError: true,
      required: true,
      value: loginID,
    });
    await validationUsersEmail({
      throwError: true,
      required: true,
      value: email,
    });

    // --------------------------------------------------
    //   docUsersObj
    // --------------------------------------------------

    const docUsersObj = await ModelUsers.findOne({
      conditionObj: {
        loginID,
        "emailObj.value": encrypt(email),
        "emailObj.confirmation": true,
      },
    });

    // --------------------------------------------------
    //   必要な情報が存在しない場合はエラー
    // --------------------------------------------------

    const users_id = lodashGet(docUsersObj, ["_id"], "");
    const encryptedEmail = lodashGet(docUsersObj, ["emailObj", "value"], "");

    if (!users_id || !encryptedEmail) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "9ceO4dnQ0", messageID: "rhU9utPzZ" }],
      });
    }

    // --------------------------------------------------
    //   Find One / DB email-confirmations
    // --------------------------------------------------

    const docEmailConfirmationsObj = await ModelEmailConfirmations.findOne({
      conditionObj: {
        users_id,
        type: "password",
      },
    });

    const emailConfirmations_id = lodashGet(
      docEmailConfirmationsObj,
      ["_id"],
      shortid.generate()
    );
    const emailConfirmationsCount = lodashGet(
      docEmailConfirmationsObj,
      ["count"],
      0
    );

    // --------------------------------------------------
    //   メールを送れるのは1日に3回まで、それ以上はエラーにする
    // --------------------------------------------------

    if (emailConfirmationsCount >= 3) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "_5i0q63mE", messageID: "EAvJztLfH" }],
      });
    }

    // --------------------------------------------------
    //   Upsert
    //   メール確認用データベースに保存する
    // --------------------------------------------------

    // ---------------------------------------------
    //   - Datetime
    // ---------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // ---------------------------------------------
    //   - email-confirmations
    // ---------------------------------------------

    const conditionObj = {
      _id: emailConfirmations_id,
    };

    const emailConfirmationID = `${shortid.generate()}${shortid.generate()}${shortid.generate()}`;

    const saveObj = {
      $set: {
        createdDate: ISO8601,
        users_id,
        emailConfirmationID,
        type: "password",
        email: encryptedEmail,
        count: emailConfirmationsCount + 1,
        isSuccess: false,
        ip,
        userAgent,
      },
    };

    // ---------------------------------------------
    //   - upsert
    // ---------------------------------------------

    await ModelEmailConfirmations.upsert({
      conditionObj,
      saveObj,
    });

    // --------------------------------------------------
    //   Decrypt E-Mail
    // --------------------------------------------------

    const decryptedEmail = decrypt(encryptedEmail);

    // --------------------------------------------------
    //   確認メール送信
    // --------------------------------------------------

    sendMailResetPassword({
      to: decryptedEmail,
      emailConfirmationID,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/email-confirmations/reset-password.js
    // `);

    // console.log(chalk`
    //   loginID: {green ${loginID}}
    //   email: {green ${email}}
    //   response: {green ${response}}

    //   users_id: {green ${users_id}}
    //   encryptedEmail: {green ${encryptedEmail}}
    //   decryptedEmail: {green ${decryptedEmail}}

    //   emailConfirmations_id: {green ${emailConfirmations_id}}
    //   emailConfirmationsCount: {green ${emailConfirmationsCount}}
    // `);

    // console.log(`
    //   ----- docUsersObj -----\n
    //   ${util.inspect(docUsersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(conditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- saveObj -----\n
    //   ${util.inspect(saveObj, { colors: true, depth: null })}\n
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
      endpointID: "jH--xmn-y",
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

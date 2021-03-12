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
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { encrypt } from "app/@modules/crypto.js";
import { sendMailConfirmation } from "app/@modules/email.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

import { validationUsersEmailServer } from "app/@database/users/validations/email-server.js";

// --------------------------------------------------
//   endpointID: WTuGEDQ-V
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

    const { email } = bodyObj;

    // --------------------------------------------------
    //   Log Data
    // --------------------------------------------------

    lodashSet(requestParametersObj, ["email"], email ? "******" : "");

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Login Check
    // --------------------------------------------------

    if (!req.isAuthenticated()) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "7dsG5-m_i", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Encrypt E-Mail
    // --------------------------------------------------

    const encryptedEmail = email ? encrypt(email) : "";

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationUsersEmailServer({
      value: email,
      loginUsers_id,
      encryptedEmail,
    });

    // --------------------------------------------------
    //   Find One / DB email-confirmations
    // --------------------------------------------------

    const docEmailConfirmationsObj = await ModelEmailConfirmations.findOne({
      conditionObj: {
        users_id: loginUsers_id,
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
        errorsArr: [{ code: "XzR7k_Fh3", messageID: "EAvJztLfH" }],
      });
    }

    // --------------------------------------------------
    //   Upsert
    //   E-Mailアドレスを変更して、メール確認用データベースにも保存する
    // --------------------------------------------------

    // ---------------------------------------------
    //   - Datetime
    // ---------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // ---------------------------------------------
    //   - users
    // ---------------------------------------------

    const usersConditionObj = {
      _id: loginUsers_id,
    };

    const usersSaveObj = {
      $set: {
        updatedDate: ISO8601,
        emailObj: {
          value: encryptedEmail,
          confirmation: false,
        },
      },
    };

    // ---------------------------------------------
    //   - email-confirmations
    // ---------------------------------------------

    const emailConfirmationsConditionObj = {
      _id: emailConfirmations_id,
    };

    const emailConfirmationID = `${shortid.generate()}${shortid.generate()}${shortid.generate()}`;

    const emailConfirmationsSaveObj = {
      $set: {
        createdDate: ISO8601,
        users_id: loginUsers_id,
        emailConfirmationID,
        type: "email",
        email: encryptedEmail,
        count: emailConfirmationsCount + 1,
        isSuccess: false,
        ip,
        userAgent: lodashGet(req, ["headers", "user-agent"], ""),
      },
    };

    // ---------------------------------------------
    //   - transaction
    // ---------------------------------------------

    await ModelUsers.transactionForEditAccount({
      usersConditionObj,
      usersSaveObj,
      emailConfirmationsConditionObj,
      emailConfirmationsSaveObj,
    });

    // --------------------------------------------------
    //   確認メール送信
    // --------------------------------------------------

    sendMailConfirmation({
      to: email,
      emailConfirmationID,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/users/upsert-settings-email.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   email: {green ${email}}
    //   emailConfirmationID: {green ${emailConfirmationID}}
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
      endpointID: "WTuGEDQ-V",
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

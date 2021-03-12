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
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { sendMailAccount } from "app/@modules/email.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

import { validationHandleName } from "app/@validations/name.js";
import { validationComment } from "app/@validations/comment.js";
import { validationUsersEmail } from "app/@database/users/validations/email.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: H7PJx34dE
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const requestParametersObj = {};
  const loginUsers_id = lodashGet(req, ["user", "_id"], "");

  // --------------------------------------------------
  //   Language & IP & User Agent
  // --------------------------------------------------

  const acceptLanguage = lodashGet(req, ["headers", "accept-language"], "");
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = lodashGet(req, ["headers", "user-agent"], "");

  // --------------------------------------------------
  //   Locale
  // --------------------------------------------------

  const localeObj = locale({
    acceptLanguage,
  });

  try {
    // --------------------------------------------------
    //   POST Data
    // --------------------------------------------------

    const bodyObj = JSON.parse(req.body);

    const {
      name,
      email,
      url,
      loginID,
      social,
      provider,
      device,
      browser,
      comment,
    } = bodyObj;

    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["email"], "*****");
    lodashSet(requestParametersObj, ["url"], url);
    lodashSet(requestParametersObj, ["loginID"], "*****");
    lodashSet(requestParametersObj, ["social"], "*****");
    lodashSet(requestParametersObj, ["provider"], "*****");
    lodashSet(requestParametersObj, ["device"], "*****");
    lodashSet(requestParametersObj, ["browser"], "*****");
    lodashSet(requestParametersObj, ["comment"], "*****");

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationHandleName({
      throwError: true,
      required: true,
      value: name,
    });
    await validationUsersEmail({
      throwError: true,
      required: true,
      value: email,
    });
    await validationComment({ throwError: true, value: comment });

    // --------------------------------------------------
    //   メールフォーム送信
    // --------------------------------------------------

    sendMailAccount({
      name,
      email,
      url,
      loginID,
      social,
      provider,
      device,
      browser,
      comment,
      loginUsers_id,
      ip,
      userAgent,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/inquiry/form/inquiry.js
    // `);

    // console.log(chalk`
    //   name: {green ${name}}
    //   email: {green ${email}}
    //   comment: {green ${comment}}
    // `);

    // ---------------------------------------------
    //   Success
    // ---------------------------------------------

    return res.status(200).json({});
  } catch (errorObj) {
    // ---------------------------------------------
    //   Log
    // ---------------------------------------------

    const resultErrorObj = returnErrorsArr({
      errorObj,
      endpointID: "H7PJx34dE",
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

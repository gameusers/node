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

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelEmailConfirmations from "app/@database/email-confirmations/model.js";
import ModelFeeds from "app/@database/feeds/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import { validationEmailConfirmationsEmailConfirmationIDServer } from "app/@database/email-confirmations/validations/email-confirmation-id-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// ---------------------------------------------
//   API
// ---------------------------------------------

import { initialProps } from "app/@api/v2/common.js";

// --------------------------------------------------
//   endpointID: pcxJ8fHJu
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code / 400ではなく404にしている
  // --------------------------------------------------

  let statusCode = 404;

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
    //   GET Data
    // --------------------------------------------------

    const emailConfirmationID = lodashGet(
      req,
      ["query", "emailConfirmationID"],
      ""
    );

    lodashSet(
      requestParametersObj,
      ["emailConfirmationID"],
      emailConfirmationID
    );

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationEmailConfirmationsEmailConfirmationIDServer({
      value: emailConfirmationID,
    });

    // --------------------------------------------------
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj });

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
        errorsArr: [{ code: "k2tZAvdLe", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   DB find / Feed
    // --------------------------------------------------

    returnObj.feedObj = await ModelFeeds.findFeed({
      localeObj,
      arr: ["all"],
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/confirm/reset-password/[emailConfirmationID].js
    // `);

    // console.log(chalk`
    //   emailConfirmationID: {green ${emailConfirmationID}}
    //   dateTimeLimit: {green ${dateTimeLimit}}
    // `);

    // console.log(`
    //   ----- docEmailConfirmationsObj -----\n
    //   ${util.inspect(docEmailConfirmationsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
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
      endpointID: "pcxJ8fHJu",
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

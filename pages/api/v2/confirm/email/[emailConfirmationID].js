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
import ModelUsers from "app/@database/users/model.js";
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
//   endpointID: YDW8_PLF3
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
    //   DB findOne / Email Confirmations
    // --------------------------------------------------

    const docEmailConfirmationsObj = await ModelEmailConfirmations.findOne({
      conditionObj: {
        emailConfirmationID,
      },
    });

    const createdDate = lodashGet(
      docEmailConfirmationsObj,
      ["createdDate"],
      ""
    );
    const email = lodashGet(docEmailConfirmationsObj, ["email"], "");
    const users_id = lodashGet(docEmailConfirmationsObj, ["users_id"], "");
    const isSuccess = lodashGet(docEmailConfirmationsObj, ["isSuccess"], false);

    // --------------------------------------------------
    //   DB findOne / Users
    // --------------------------------------------------

    const docUsersCount = await ModelUsers.count({
      conditionObj: {
        "emailObj.value": email,
      },
    });

    // --------------------------------------------------
    //   必要な情報がない場合、エラー
    // --------------------------------------------------

    if (!createdDate || !email || !users_id || docUsersCount === 0) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "8JJ4_hJyz", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   24時間以内にアクセスしたかチェック
    // --------------------------------------------------

    const dateTimeLimit = moment(createdDate).utc().add(1, "day");
    const dateTimeNow = moment().utc();

    if (dateTimeLimit.isBefore(dateTimeNow)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "qmu7nkZxS", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    if (isSuccess === false) {
      // ---------------------------------------------
      //   - Datetime
      // ---------------------------------------------

      const ISO8601 = moment().utc().toISOString();

      // ---------------------------------------------
      //   - users
      // ---------------------------------------------

      const usersConditionObj = {
        _id: users_id,
        "emailObj.value": email,
      };

      const usersSaveObj = {
        $set: {
          updatedDate: ISO8601,
          emailObj: {
            value: email,
            confirmation: true,
          },
        },
      };

      // ---------------------------------------------
      //   - email-confirmations
      // ---------------------------------------------

      const emailConfirmationsConditionObj = {
        emailConfirmationID,
      };

      const emailConfirmationsSaveObj = {
        $set: {
          isSuccess: true,
        },
      };

      // ---------------------------------------------
      //   - transaction
      // ---------------------------------------------

      await ModelEmailConfirmations.transactionForEmailConfirmation({
        usersConditionObj,
        usersSaveObj,
        emailConfirmationsConditionObj,
        emailConfirmationsSaveObj,
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
    //   /pages/api/v2/confirm/email/[emailConfirmationID].js
    // `);

    // console.log(chalk`
    //   emailConfirmationID: {green ${emailConfirmationID}}
    //   docUsersCount: {green ${docUsersCount}}
    // `);

    // console.log(`
    //   ----- docEmailConfirmationsObj -----\n
    //   ${util.inspect(docEmailConfirmationsObj, { colors: true, depth: null })}\n
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
      endpointID: "YDW8_PLF3",
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

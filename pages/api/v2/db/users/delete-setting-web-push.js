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

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelUsers from "app/@database/users/model.js";
import ModelWebPushes from "app/@database/web-pushes/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

// --------------------------------------------------
//   endpointID: VfBJS7Mz2
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
        errorsArr: [{ code: "ZvxgUyzpC", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // ---------------------------------------------
    //   webPushes_id
    // ---------------------------------------------

    const docUsersObj = await ModelUsers.findOne({
      conditionObj: {
        _id: loginUsers_id,
      },
    });

    const webPushes_id = docUsersObj.webPushes_id;

    // --------------------------------------------------
    //   Upsert
    // --------------------------------------------------

    if (webPushes_id) {
      // ---------------------------------------------
      //   - Datetime
      // ---------------------------------------------

      const ISO8601 = moment().utc().toISOString();

      // ---------------------------------------------
      //   - web-push
      // ---------------------------------------------

      const conditionObj = {
        _id: webPushes_id,
      };

      const saveObj = {
        $set: {
          updatedDate: ISO8601,
          sendDate: "",
          subscriptionObj: {
            endpoint: "",
            keys: {
              p256dh: "",
              auth: "",
            },
          },
          sendTotalCount: 0,
          sendTodayCount: 0,
          errorCount: 0,
        },
      };

      // console.log('AAA');
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
      //   - update
      // ---------------------------------------------

      await ModelWebPushes.upsert({
        conditionObj,
        saveObj,
      });
      // console.log('BBB');
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/users/delete-setting-web-push.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
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
      endpointID: "VfBJS7Mz2",
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

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

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelGamesTemps from "app/@database/games-temps/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: CsdAP7mOD
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};
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

    const { gamesTemps_idsArr } = bodyObj;

    lodashSet(requestParametersObj, ["gamesTemps_idsArr"], gamesTemps_idsArr);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Role
    // --------------------------------------------------

    const role = lodashGet(req, ["user", "role"], "user");
    const administrator = role === "administrator" ? true : false;

    // --------------------------------------------------
    //   Administrator Check
    // --------------------------------------------------

    if (!administrator) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "OiO8GNTVD", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // --------------------------------------------------
    //   DB find
    // --------------------------------------------------

    const docGamesTempsArr = await ModelGamesTemps.find({
      conditionObj: {
        _id: { $in: gamesTemps_idsArr },
      },
    });

    // --------------------------------------------------
    //   Experience
    // --------------------------------------------------

    for (let valueObj of docGamesTempsArr.values()) {
      // ---------------------------------------------
      //   approval & targetUsers_id
      // ---------------------------------------------

      const approval = lodashGet(valueObj, ["approval"], false);
      const targetUsers_id = lodashGet(valueObj, ["users_id"], "");

      // ---------------------------------------------
      //   experienceCalculate
      // ---------------------------------------------

      if (!approval && targetUsers_id) {
        await experienceCalculate({
          req,
          localeObj,
          loginUsers_id,
          targetUsers_id,
          arr: [
            {
              type: "gc-register",
              calculation: "addition",
            },
          ],
        });
      }
    }

    // --------------------------------------------------
    //   DB upsert
    // --------------------------------------------------

    const conditionObj = {
      _id: { $in: gamesTemps_idsArr },
    };

    const saveObj = {
      approval: true,
    };

    returnObj = await ModelGamesTemps.updateMany({
      conditionObj,
      saveObj,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/games-temps/approval.js
    // `);

    // console.log(`
    //   ----- gamesTemps_idsArr -----\n
    //   ${util.inspect(gamesTemps_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docGamesTempsArr -----\n
    //   ${util.inspect(docGamesTempsArr, { colors: true, depth: null })}\n
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
      endpointID: "CsdAP7mOD",
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

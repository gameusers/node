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

import ModelGames from "app/@database/games/model.js";
import ModelGamesTemps from "app/@database/games-temps/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

// ---------------------------------------------
//   Format
// ---------------------------------------------

// import { formatImagesAndVideosArr } from 'app/@database/images-and-videos/format.js';

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: xbUW2UGOe
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

    const { games_id, gamesTemps_id } = bodyObj;

    lodashSet(requestParametersObj, ["games_id"], games_id);
    lodashSet(requestParametersObj, ["gamesTemps_id"], gamesTemps_id);

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
        errorsArr: [{ code: "Z2CTGzy0m", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // --------------------------------------------------
    //   データを取得
    // --------------------------------------------------

    // ---------------------------------------------
    //   - 仮登録
    // ---------------------------------------------

    if (gamesTemps_id) {
      returnObj = await ModelGamesTemps.findEditData({
        localeObj,
        gamesTemps_id,
      });

      // ---------------------------------------------
      //   - 本登録
      // ---------------------------------------------
    } else if (games_id) {
      returnObj = await ModelGames.findEditData({
        localeObj,
        games_id,
      });
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    // const returnObj = lodashGet(docArr, [0], {});

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/games-temps/get-edit-data.js
    // `);

    // console.log(chalk`
    //   games_id: {green ${games_id}}
    //   gamesTemps_id: {green ${gamesTemps_id}}
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
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
      endpointID: "xbUW2UGOe",
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

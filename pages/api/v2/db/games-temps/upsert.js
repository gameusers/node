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

import shortid from "shortid";
import moment from "moment";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelGameTemps from "app/@database/games-temps/model.js";

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
import {
  validationLanguage,
  validationCountry,
} from "app/@validations/language.js";

import { validationGamesName } from "app/@database/games/validations/name.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: 8mHi5ZjYn
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
      games_id,
      language,
      country,
      name,
      subtitle,
      sortKeyword,
      urlID,
      twitterHashtagsArr,
      searchKeywordsArr,
      genreArr = [],
      hardwareArr = [],
      linkArr,
    } = bodyObj;

    lodashSet(requestParametersObj, ["games_id"], games_id);
    lodashSet(requestParametersObj, ["language"], language);
    lodashSet(requestParametersObj, ["country"], country);
    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["subtitle"], subtitle);
    lodashSet(requestParametersObj, ["sortKeyword"], sortKeyword);
    lodashSet(requestParametersObj, ["urlID"], urlID);
    lodashSet(requestParametersObj, ["twitterHashtagsArr"], twitterHashtagsArr);
    lodashSet(requestParametersObj, ["searchKeywordsArr"], searchKeywordsArr);
    lodashSet(requestParametersObj, ["genreArr"], genreArr);
    lodashSet(requestParametersObj, ["hardwareArr"], hardwareArr);
    lodashSet(requestParametersObj, ["linkArr"], linkArr);

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
        errorsArr: [{ code: "GQ5rGPUrS", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationLanguage({ throwError: true, value: language });
    await validationCountry({ throwError: true, value: country });

    await validationGamesName({ throwError: true, value: name });

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   Insert
    // --------------------------------------------------

    const conditionObj = {
      _id: shortid.generate(),
    };

    const saveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      approval: false,
      users_id: loginUsers_id,
      games_id,
      urlID,
      language,
      country,
      name,
      subtitle,
      searchKeywordsArr,
      sortKeyword,
      twitterHashtagsArr,
      genreArr,
      genreSubArr: [],
      genreTagArr: [],
      hardwareArr,
      linkArr,
    };

    // --------------------------------------------------
    //   DB upsert
    // --------------------------------------------------

    await ModelGameTemps.upsert({
      conditionObj,
      saveObj,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/games/upsert.js
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   language: {green ${language}}
    //   country: {green ${country}}
    //   name: {green ${name}}
    //   subtitle: {green ${subtitle}}
    //   sortKeyword: {green ${sortKeyword}}
    //   urlID: {green ${urlID}}
    // `);

    // console.log(`
    //   ----- twitterHashtagsArr -----\n
    //   ${util.inspect(twitterHashtagsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- searchKeywordsArr -----\n
    //   ${util.inspect(searchKeywordsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- genreArr -----\n
    //   ${util.inspect(genreArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- hardwareArr -----\n
    //   ${util.inspect(hardwareArr, { colors: true, depth: null })}\n
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
      endpointID: "8mHi5ZjYn",
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

// --------------------------------------------------
//   config
// --------------------------------------------------

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '25mb',
//     },
//   },
// };

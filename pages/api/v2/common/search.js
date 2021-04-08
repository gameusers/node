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

import ModelGameCommunities from "app/@database/game-communities/model.js";
import ModelUserCommunities from "app/@database/user-communities/model.js";
import ModelCardPlayers from "app/@database/card-players/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import { validationInteger } from "app/@validations/integer.js";
import { validationKeyword } from "app/@validations/keyword.js";

// ---------------------------------------------
//   Format
// ---------------------------------------------

import { formatImagesAndVideosArr } from "app/@database/images-and-videos/format.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: WcBejFm41
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

    const type = lodashGet(bodyObj, ["type"], "");
    const keyword = lodashGet(bodyObj, ["keyword"], "");
    const page = lodashGet(bodyObj, ["page"], "");

    lodashSet(requestParametersObj, ["type"], type);
    lodashSet(requestParametersObj, ["keyword"], keyword);
    lodashSet(requestParametersObj, ["page"], page);

    // --------------------------------------------------
    //   Verify CSRF
    // --------------------------------------------------

    verifyCsrfToken(req, res);

    // ---------------------------------------------
    //   引数
    // ---------------------------------------------

    const argumentsObj = {
      localeObj,
      loginUsers_id,
      // keyword: "",
      keyword,
    };

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    validationIP({ throwError: true, required: true, value: ip });

    validationKeyword({
      throwError: true,
      required: true,
      value: keyword,
    });

    if (
      validationInteger({
        throwError: false,
        required: true,
        value: page,
      }).error === false
    ) {
      argumentsObj.page = parseInt(page, 10);
    }

    argumentsObj.limit = parseInt(process.env.NEXT_PUBLIC_SEARCH_LIMIT, 10);

    // --------------------------------------------------
    //   データを取得
    // --------------------------------------------------

    if (type === "gc") {
      returnObj.gcListObj = await ModelGameCommunities.findGamesList(
        argumentsObj
      );
    } else if (type === "uc") {
      returnObj.ucListObj = await ModelUserCommunities.findUserCommunitiesList(
        argumentsObj
      );
    } else if (type === "ur") {
      returnObj.urListObj = await ModelCardPlayers.findForSearch(argumentsObj);
    }

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/common/search.js
    // `);

    // console.log(chalk`
    //   type: {green ${type} / ${typeof type}}
    //   keyword: {green ${keyword} / ${typeof keyword}}
    //   page: {green ${page} / ${typeof page}}
    // `);

    // console.log(`
    //   ----- argumentsObj -----\n
    //   ${util.inspect(argumentsObj, { colors: true, depth: null })}\n
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
      endpointID: "WcBejFm41",
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

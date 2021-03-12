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
//   Model
// ---------------------------------------------

import ModelUserCommunities from "app/@database/user-communities/model.js";
import ModelFeeds from "app/@database/feeds/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationInteger } from "app/@validations/integer.js";
import { validationKeyword } from "app/@validations/keyword.js";

import { validationCommunitiesListLimit } from "app/@database/game-communities/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// ---------------------------------------------
//   API
// ---------------------------------------------

import { initialProps } from "app/@api/v2/common.js";

// --------------------------------------------------
//   endpointID: WTMqeyRjP
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
    //   GET Data
    // --------------------------------------------------

    const page = parseInt(lodashGet(req, ["query", "page"], 1), 10);
    const limit = parseInt(lodashGet(req, ["query", "limit"], ""), 10);
    const keyword = lodashGet(req, ["query", "keyword"], "");

    lodashSet(
      requestParametersObj,
      ["page"],
      lodashGet(req, ["query", "page"], "")
    );
    lodashSet(
      requestParametersObj,
      ["limit"],
      lodashGet(req, ["query", "limit"], "")
    );
    lodashSet(requestParametersObj, ["keyword"], keyword);

    // --------------------------------------------------
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj });

    // --------------------------------------------------
    //   DB find / Game Communities List
    // --------------------------------------------------

    // ---------------------------------------------
    //   - 引数
    // ---------------------------------------------

    const argumentsObj = {
      localeObj,
    };

    // ---------------------------------------------
    //   - page & limit
    // ---------------------------------------------

    if (
      (await validationInteger({
        throwError: false,
        required: true,
        value: page,
      }).error) === false
    ) {
      argumentsObj.page = page;
    }

    if (
      (await validationCommunitiesListLimit({
        throwError: false,
        required: true,
        value: limit,
      }).error) === false
    ) {
      argumentsObj.limit = limit;
    }

    // ---------------------------------------------
    //   - keyword
    // ---------------------------------------------

    if (
      (await validationKeyword({
        throwError: false,
        required: true,
        value: keyword,
      }).error) === false
    ) {
      argumentsObj.keyword = keyword;
    }

    returnObj.ucListObj = await ModelUserCommunities.findUserCommunitiesList(
      argumentsObj
    );

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
    //   pages/api/v2/uc/list/index.js
    // `);

    // console.log(chalk`
    // page: {green ${page}}
    // limit: {green ${limit}}
    // hardwares: {green ${hardwares}}
    // keyword: {green ${keyword}}
    // `);

    // console.log(`
    //   ----- returnObj.gcListObj -----\n
    //   ${util.inspect(returnObj.gcListObj, { colors: true, depth: null })}\n
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
      endpointID: "WTMqeyRjP",
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

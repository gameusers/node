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

import ModelUsers from "app/@database/users/model.js";
import ModelCardPlayers from "app/@database/card-players/model.js";
import ModelFeeds from "app/@database/feeds/model.js";
import ModelFollows from "app/@database/follows/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationInteger } from "app/@validations/integer.js";
import { validationFollowListLimit } from "app/@database/follows/validations/follow-limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// ---------------------------------------------
//   API
// ---------------------------------------------

import { initialProps } from "app/@api/v2/common.js";

// --------------------------------------------------
//   endpointID: jmqJRn8sY
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

    const userID = lodashGet(req, ["query", "userID"], "");
    const category = lodashGet(req, ["query", "category"], "");
    const page = parseInt(lodashGet(req, ["query", "page"], 1), 10);
    const limit = parseInt(
      lodashGet(req, ["query", "limit"], "") ||
        process.env.NEXT_PUBLIC_FOLLOW_LIST_LIMIT,
      10
    );

    lodashSet(requestParametersObj, ["userID"], userID);
    lodashSet(requestParametersObj, ["category"], category);
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

    // --------------------------------------------------
    //   Login Check
    // --------------------------------------------------

    if (!req.isAuthenticated() && category === "ur") {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "CTObVauuz", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   category ????????????????????????????????????
    // --------------------------------------------------

    if (!category) {
      statusCode = 404;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "s0_x1UM-3", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   ??????????????? / Users
    //   ?????????????????????????????????????????????????????????
    //   users_id ??????????????????????????????
    // --------------------------------------------------

    const usersObj = await ModelUsers.findOneForUser({
      localeObj,
      loginUsers_id,
      userID,
    });

    // --------------------------------------------------
    //   ??????????????????????????????????????????????????????
    // --------------------------------------------------

    const users_id = lodashGet(usersObj, ["_id"], "");

    if (!users_id) {
      statusCode = 404;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "9zuH0jxcO", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   ????????????????????????????????????????????????
    // --------------------------------------------------

    if (users_id !== loginUsers_id && category === "ur") {
      statusCode = 401;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "gWL-VLRft", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj, type: "other" });

    // --------------------------------------------------
    //   users_id & pagesObj
    // --------------------------------------------------

    returnObj.users_id = users_id;
    returnObj.pagesObj = lodashGet(usersObj, ["pagesObj"], []);

    // --------------------------------------------------
    //   headerObj
    //   ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // --------------------------------------------------

    const imagesAndVideosObj = lodashGet(
      returnObj,
      ["headerObj", "imagesAndVideosObj"],
      {}
    );
    const usersImagesAndVideosObj = lodashGet(
      usersObj,
      ["headerObj", "imagesAndVideosObj"],
      {}
    );

    if (Object.keys(usersImagesAndVideosObj).length === 0) {
      lodashSet(
        usersObj,
        ["headerObj", "imagesAndVideosObj"],
        imagesAndVideosObj
      );
    }

    returnObj.headerObj = usersObj.headerObj;

    // --------------------------------------------------
    //   DB find / Feed
    // --------------------------------------------------

    returnObj.feedObj = await ModelFeeds.findFeed({
      localeObj,
      arr: ["all"],
    });

    // --------------------------------------------------
    //   ?????????????????????
    // --------------------------------------------------

    // ---------------------------------------------
    //   - ??????
    // ---------------------------------------------

    const argumentsObj = {
      localeObj,
      loginUsers_id,
      users_id,
    };

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
      (await validationFollowListLimit({
        throwError: false,
        required: true,
        value: limit,
      }).error) === false
    ) {
      argumentsObj.limit = limit;
    }

    // ---------------------------------------------
    //   - ???????????????????????????
    // ---------------------------------------------

    if (category === "gc") {
      returnObj.followListGcObj = await ModelFollows.findFollowListGc(
        argumentsObj
      );

      // ---------------------------------------------
      //   - ??????????????????????????????
      // ---------------------------------------------
    } else if (category === "uc") {
      returnObj.followListUcObj = await ModelFollows.findFollowListUc(
        argumentsObj
      );

      // ---------------------------------------------
      //   - ????????????
      // ---------------------------------------------
    } else {
      // --------------------------------------------------
      //   DB find / Card Players
      // --------------------------------------------------

      argumentsObj.adminUsers_id = users_id;
      argumentsObj.users_id = users_id;
      argumentsObj.controlType = "follow";

      const resultFollowersObj = await ModelCardPlayers.findForFollowers(
        argumentsObj
      );

      returnObj.cardPlayersObj = resultFollowersObj.cardPlayersObj;
      returnObj.followListUrObj = resultFollowersObj.followMembersObj;

      // console.log(`
      //   ----- resultFollowersObj -----\n
      //   ${util.inspect(resultFollowersObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // --------------------------------------------------
    //   ??????
    //   0: ????????????????????????????????????
    //   1: ???????????????????????????
    //   2: ??????????????????????????????????????????????????????????????????
    //   3: ??????????????????????????????????????????????????????
    //   4: ?????????????????????????????????????????????
    //   5: ???????????????????????????????????????
    //   50: ????????????????????????????????????????????????
    //   100: ??????????????????
    // --------------------------------------------------

    returnObj.accessLevel = 1;

    // ---------------------------------------------
    //   - ????????????
    // ---------------------------------------------

    if (users_id === loginUsers_id) {
      returnObj.accessLevel = 50;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/ur/[userID]/follow/list.js
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   category: {green ${category}}
    //   page: {green ${page} / ${typeof page}}
    //   limit: {green ${limit} / ${typeof limit}}
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
      endpointID: "jmqJRn8sY",
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

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

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// ---------------------------------------------
//   API
// ---------------------------------------------

import { initialProps } from "app/@api/v2/common.js";

// --------------------------------------------------
//   endpointID: CuUwo1avA
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

    lodashSet(requestParametersObj, ["userID"], userID);

    // --------------------------------------------------
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj, type: "other" });

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
      // ---------------------------------------------
      //   ??????????????????????????????????????????
      // ---------------------------------------------

      const redirectionUsersObj = await ModelUsers.findOne({
        conditionObj: {
          userIDInitial: userID,
        },
      });

      // ---------------------------------------------
      //   ??????????????????????????????????????????404?????????
      // ---------------------------------------------

      if (!redirectionUsersObj) {
        statusCode = 404;
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "QGUc_L0d1", messageID: "Error" }],
        });
      }

      // ---------------------------------------------
      //   ?????????????????????
      // ---------------------------------------------

      returnObj.redirectObj = {
        userID: redirectionUsersObj.userID,
      };

      // console.log(`
      //   ----- redirectionUsersObj -----\n
      //   ${util.inspect(redirectionUsersObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // ---------------------------------------------
    //   - headerObj
    //   ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // ---------------------------------------------

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
    //   pagesObj - ?????????????????????????????????????????????????????????
    // --------------------------------------------------

    returnObj.pagesObj = lodashGet(usersObj, ["pagesObj"], []);

    // --------------------------------------------------
    //   ??????????????? / Card Players
    //   ?????????????????????????????????????????????????????????????????????
    // --------------------------------------------------

    const resultCardPlayersObj = await ModelCardPlayers.findForCardPlayers({
      localeObj,
      users_id,
      loginUsers_id,
    });

    returnObj.cardPlayersObj = resultCardPlayersObj.cardPlayersObj;
    returnObj.cardPlayers_idsArr = resultCardPlayersObj.cardPlayers_idsArr;

    // --------------------------------------------------
    //   DB find / Feed
    // --------------------------------------------------

    returnObj.feedObj = await ModelFeeds.findFeed({
      localeObj,
      arr: ["all"],
    });

    // --------------------------------------------------
    //   ??????
    //   0: ????????????????????????????????????
    //   1: ???????????????????????????
    //   2: ??????????????????????????????????????????????????????????????????
    //   3: ??????????????????????????????????????????????????????
    //   4: ?????????????????????????????????????????????
    //   5: ???????????????????????????????????????
    //   50: ????????????
    //   100: ??????????????????
    // --------------------------------------------------

    returnObj.accessLevel = 1;

    // ---------------------------------------------
    //   - ????????????
    // ---------------------------------------------

    if (users_id && loginUsers_id && users_id === loginUsers_id) {
      returnObj.accessLevel = 50;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/ur/[userID]/index.js
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   users_id???{green ${users_id}}
    // `);

    // console.log(`
    //   ----- localeObj -----\n
    //   ${util.inspect(localeObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj.headerObj -----\n
    //   ${util.inspect(returnObj.headerObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- usersObj -----\n
    //   ${util.inspect(usersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- resultCardPlayersObj -----\n
    //   ${util.inspect(resultCardPlayersObj, { colors: true, depth: null })}\n
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
      endpointID: "CuUwo1avA",
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

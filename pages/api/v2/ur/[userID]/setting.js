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

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelUsers from "app/@database/users/model.js";
import ModelFeeds from "app/@database/feeds/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { decrypt } from "app/@modules/crypto.js";
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
//   endpointID: Rounc2BcR
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Locale
  // --------------------------------------------------

  const localeObj = locale({
    acceptLanguage: req.headers["accept-language"],
  });

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

  try {
    // --------------------------------------------------
    //   POST Data
    // --------------------------------------------------

    const bodyObj = JSON.parse(req.body);

    const { userID } = bodyObj;

    lodashSet(requestParametersObj, ["userID"], userID);

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
        errorsArr: [{ code: "-A7OeA6CQ", messageID: "xLLNIpo6a" }],
      });
    }

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

    const users_id = lodashGet(usersObj, ["_id"], "");

    // --------------------------------------------------
    //   ??????????????????????????????????????????????????????
    // --------------------------------------------------

    if (!users_id) {
      statusCode = 404;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "WILn3VVWP", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   ??????????????????????????????????????????????????????
    // --------------------------------------------------

    if (users_id !== loginUsers_id) {
      statusCode = 401;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "RZuemJfef", messageID: "Error" }],
      });
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
    //   pagesObj
    // --------------------------------------------------

    returnObj.pagesObj = lodashGet(usersObj, ["pagesObj"], {});

    // --------------------------------------------------
    //   approval
    // --------------------------------------------------

    returnObj.approval = lodashGet(usersObj, ["followsObj", "approval"], false);

    // --------------------------------------------------
    //   ??????????????? / Users
    //   ???????????????????????????????????????2??????????????????????????????????????????
    //   ??????????????????????????????????????????
    // --------------------------------------------------

    const docUsersObj = await ModelUsers.findSetting({
      users_id,
    });

    // --------------------------------------------------
    //   ???????????????
    // --------------------------------------------------

    returnObj.pagesImagesAndVideosObj = lodashGet(
      docUsersObj,
      ["pagesImagesAndVideosObj"],
      {}
    );

    // --------------------------------------------------
    //   Login ID
    // --------------------------------------------------

    returnObj.loginID = lodashGet(docUsersObj, ["loginID"], "");

    // --------------------------------------------------
    //   E-Mail
    // --------------------------------------------------

    const emailValue = lodashGet(docUsersObj, ["emailObj", "value"], "");
    returnObj.email = emailValue ? decrypt(emailValue) : "";
    returnObj.emailConfirmation = lodashGet(
      docUsersObj,
      ["emailObj", "confirmation"],
      false
    );

    // --------------------------------------------------
    //   Web Push
    // --------------------------------------------------

    returnObj.webPushAvailable = false;

    const webPushes_id = lodashGet(docUsersObj, ["webPushesObj", "_id"], "");

    if (webPushes_id) {
      const subscriptionObj = lodashGet(
        docUsersObj,
        ["webPushesObj", "subscriptionObj"],
        {}
      );
      const errorCount = lodashGet(
        docUsersObj,
        ["webPushesObj", "errorCount"],
        0
      );

      if (subscriptionObj.endpoint && errorCount < 5) {
        returnObj.webPushAvailable = true;
      }

      // console.log(`
      //   ----- subscriptionObj -----\n
      //   ${util.inspect(subscriptionObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(chalk`
      //   errorCount: {green ${errorCount}}
      //   returnObj.webPushAvailable: {green ${returnObj.webPushAvailable}}
      // `);
    }

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

    if (users_id === loginUsers_id) {
      returnObj.accessLevel = 50;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/ur/[userID]/setting.js
    // `);

    // console.log(chalk`
    //   {green ur/player/api/player / initial-props}
    //   userID: {green ${userID}}
    //   users_id???{green ${users_id}}
    // `);

    // console.log(`
    //   ----- localeObj -----\n
    //   ${util.inspect(localeObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- usersObj -----\n
    //   ${util.inspect(usersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docUsersObj -----\n
    //   ${util.inspect(docUsersObj, { colors: true, depth: null })}\n
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
      endpointID: "Rounc2BcR",
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

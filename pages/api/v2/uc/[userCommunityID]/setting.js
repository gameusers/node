// --------------------------------------------------
//   Require
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

import { verifyCsrfToken } from "app/@modules/csrf.js";
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
//   endpointID: 5GMP5E__4
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
    //   POST Data
    // --------------------------------------------------

    const bodyObj = JSON.parse(req.body);

    const { userCommunityID } = bodyObj;

    lodashSet(requestParametersObj, ["userCommunityID"], userCommunityID);

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
        errorsArr: [{ code: "xWkmN-gAs", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj, type: "other" });

    // --------------------------------------------------
    //   DB find / User Community
    // --------------------------------------------------

    const userCommunityObj = await ModelUserCommunities.findForUserCommunitySettings(
      {
        localeObj,
        loginUsers_id,
        userCommunityID,
      }
    );

    const userCommunities_id = lodashGet(userCommunityObj, ["_id"], "");
    const userCommunitiesUsers_id = lodashGet(
      userCommunityObj,
      ["users_id"],
      ""
    );

    // --------------------------------------------------
    //   コミュニティが存在しない場合はエラー
    // --------------------------------------------------

    if (!userCommunities_id) {
      statusCode = 404;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "fppwXm8iV", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   コミュニティのオーナーでない場合はエラー
    // --------------------------------------------------

    if (userCommunitiesUsers_id !== loginUsers_id) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "5rP5wjjRU", messageID: "Error" }],
      });
    }

    // ---------------------------------------------
    //   - headerObj
    //   ユーザーがトップ画像をアップロードしていない場合は、ランダム取得の画像を代わりに利用する
    // ---------------------------------------------

    const imagesAndVideosObj = lodashGet(
      returnObj,
      ["headerObj", "imagesAndVideosObj"],
      {}
    );
    const userCommunityImagesAndVideosObj = lodashGet(
      userCommunityObj,
      ["headerObj", "imagesAndVideosObj"],
      {}
    );

    if (Object.keys(userCommunityImagesAndVideosObj).length === 0) {
      lodashSet(
        userCommunityObj,
        ["headerObj", "imagesAndVideosObj"],
        imagesAndVideosObj
      );
    }

    returnObj.headerObj = userCommunityObj.headerObj;

    delete userCommunityObj.headerObj;

    // ---------------------------------------------
    //   - userCommunityObj
    // ---------------------------------------------

    returnObj.userCommunityObj = userCommunityObj;

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
    //   /pages/api/v2/uc/[userCommunityID]/settings/index.js
    // `);

    // console.log(chalk`
    //   /pages/api/v2/uc/[userCommunityID]/settings/index.js
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunitiesUsers_id: {green ${userCommunitiesUsers_id}}
    //   userCommunityID: {green ${userCommunityID}}
    //   userCommunities_id：{green ${userCommunities_id}}
    // `);

    // console.log(`
    //   ----- userCommunityObj -----\n
    //   ${util.inspect(userCommunityObj, { colors: true, depth: null })}\n
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
      endpointID: "5GMP5E__4",
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

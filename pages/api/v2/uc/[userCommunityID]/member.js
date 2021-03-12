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
import ModelCardPlayers from "app/@database/card-players/model.js";
import ModelFeeds from "app/@database/feeds/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationInteger } from "app/@validations/integer.js";
import { validationFollowLimit } from "app/@database/follows/validations/follow-limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// ---------------------------------------------
//   API
// ---------------------------------------------

import { initialProps } from "app/@api/v2/common.js";

// --------------------------------------------------
//   endpointID: K3yzgjQpD
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
  const loginUsersRole = lodashGet(req, ["user", "role"], "");

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

    const userCommunityID = lodashGet(req, ["query", "userCommunityID"], "");
    const page = parseInt(lodashGet(req, ["query", "page"], 1), 10);
    const limit = parseInt(
      lodashGet(req, ["query", "limit"], "") ||
        process.env.NEXT_PUBLIC_FOLLOW_LIST_LIMIT,
      10
    );

    lodashSet(requestParametersObj, ["userCommunityID"], userCommunityID);
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
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj, type: "other" });

    // --------------------------------------------------
    //   DB find / User Community
    // --------------------------------------------------

    const userCommunityObj = await ModelUserCommunities.findForUserCommunity({
      localeObj,
      loginUsers_id,
      userCommunityID,
    });

    // ---------------------------------------------
    //   - コミュニティのデータがない場合はエラー
    // ---------------------------------------------

    if (userCommunityObj.name === "") {
      statusCode = 404;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "X0Y2qe9V8", messageID: "Error" }],
      });
    }

    // ---------------------------------------------
    //   - userCommunities_id & adminUsers_id
    // ---------------------------------------------

    const userCommunities_id = lodashGet(userCommunityObj, ["_id"], "");
    const adminUsers_id = lodashGet(userCommunityObj, ["users_id"], "");

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

    // ---------------------------------------------
    //   - コンテンツを表示するかどうか
    // ---------------------------------------------

    const communityType = lodashGet(
      userCommunityObj,
      ["communityType"],
      "open"
    );
    const followsAdmin = lodashGet(
      returnObj,
      ["headerObj", "followsObj", "admin"],
      false
    );
    const followsFollow = lodashGet(
      returnObj,
      ["headerObj", "followsObj", "follow"],
      false
    );
    const followsBlocked = lodashGet(
      returnObj,
      ["headerObj", "followsObj", "followBlocked"],
      false
    );

    if (communityType === "closed" && !followsFollow) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "zoqcOuILt", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //    DB find / Card Players
    // --------------------------------------------------

    const argumentsObj = {
      localeObj,
      loginUsers_id,
      adminUsers_id,
      userCommunities_id,
      controlType: "followed",
    };

    if (
      validationInteger({ throwError: false, required: true, value: page })
        .error === false
    ) {
      argumentsObj.page = page;
    }

    if (
      validationFollowLimit({ throwError: false, required: true, value: limit })
        .error === false
    ) {
      argumentsObj.limit = limit;
    }

    const resultFollowersObj = await ModelCardPlayers.findForFollowers(
      argumentsObj
    );

    returnObj.cardPlayersObj = resultFollowersObj.cardPlayersObj;
    returnObj.followMembersObj = resultFollowersObj.followMembersObj;

    // --------------------------------------------------
    //   DB find / Feed
    // --------------------------------------------------

    returnObj.feedObj = await ModelFeeds.findFeed({
      localeObj,
      arr: ["all"],
    });

    // --------------------------------------------------
    //   権限
    //   0: ブロックしているユーザー
    //   1: 非ログインユーザー
    //   2: ログインユーザー（以下ログイン済みユーザー）
    //   3: コミュニティのメンバー
    //   50: コミュニティの管理者
    //   100: サイト運営
    // --------------------------------------------------

    returnObj.accessLevel = 1;

    // ---------------------------------------------
    //   - サイト運営
    // ---------------------------------------------

    if (loginUsersRole === "administrator") {
      returnObj.accessLevel = 100;

      // ---------------------------------------------
      //   - コミュニティの管理者
      // ---------------------------------------------
    } else if (followsAdmin) {
      returnObj.accessLevel = 50;

      // ---------------------------------------------
      //   - コミュニティのメンバー
      // ---------------------------------------------
    } else if (followsFollow) {
      returnObj.accessLevel = 3;

      // ---------------------------------------------
      //   - ブロックしているユーザー
      // ---------------------------------------------
    } else if (followsBlocked) {
      returnObj.accessLevel = 0;

      // ---------------------------------------------
      //   - ログインユーザー
      // ---------------------------------------------
    } else if (loginUsersRole === "user") {
      returnObj.accessLevel = 2;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/uc/[userCommunityID]/members.js
    // `);

    // console.log(chalk`
    //   userCommunityID: {green ${userCommunityID}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   communityType: {green ${communityType}}
    //   member: {green ${member}}
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
      endpointID: "K3yzgjQpD",
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

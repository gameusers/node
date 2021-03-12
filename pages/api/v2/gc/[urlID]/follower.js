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

import ModelGameCommunities from "app/@database/game-communities/model.js";
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
//   endpointID: d3GXlJYcJ
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

    const urlID = lodashGet(req, ["query", "urlID"], "");
    const page = parseInt(lodashGet(req, ["query", "page"], 1), 10);
    const limit = parseInt(
      lodashGet(req, ["query", "limit"], "") ||
        process.env.NEXT_PUBLIC_FOLLOW_LIST_LIMIT,
      10
    );

    lodashSet(requestParametersObj, ["urlID"], urlID);
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

    const returnObj = await initialProps({ req, localeObj });

    // --------------------------------------------------
    //   DB find / Game Community
    // --------------------------------------------------

    const gameCommunityObj = await ModelGameCommunities.findForGameCommunity({
      localeObj,
      loginUsers_id,
      urlID,
    });

    // ---------------------------------------------
    //   - コミュニティのデータがない場合はエラー
    // ---------------------------------------------

    if (!lodashHas(gameCommunityObj, ["gameCommunitiesObj", "_id"])) {
      statusCode = 404;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "mb7-816Fu", messageID: "Error" }],
      });
    }

    // ---------------------------------------------
    //   - gameCommunities_id
    // ---------------------------------------------

    const gameCommunities_id = lodashGet(
      gameCommunityObj,
      ["gameCommunitiesObj", "_id"],
      ""
    );

    // ---------------------------------------------
    //   - headerObj
    // ---------------------------------------------

    returnObj.headerObj = gameCommunityObj.headerObj;

    // ---------------------------------------------
    //   - gameCommunityObj
    // ---------------------------------------------

    returnObj.gameCommunityObj = gameCommunityObj.gameCommunitiesObj;

    // --------------------------------------------------
    //   DB find / Card Players
    // --------------------------------------------------

    const argumentsObj = {
      localeObj,
      loginUsers_id,
      gameCommunities_id,
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
    //   3: フォロワー
    //   100: サイト運営
    // --------------------------------------------------

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

    returnObj.accessLevel = 1;

    // ---------------------------------------------
    //   - サイト運営
    // ---------------------------------------------

    if (loginUsersRole === "administrator") {
      returnObj.accessLevel = 100;

      // ---------------------------------------------
      //   - フォロワー
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
    //   /pages/api/v2/gc/[urlID]/index.js
    // `);

    // console.log(chalk`
    //   urlID: {green ${urlID}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
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
      endpointID: "d3GXlJYcJ",
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

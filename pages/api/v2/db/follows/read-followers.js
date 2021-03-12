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

import moment from "moment";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelUserCommunities from "app/@database/user-communities/model.js";
import ModelUsers from "app/@database/users/model.js";
import ModelCardPlayers from "app/@database/card-players/model.js";
import ModelFollows from "app/@database/follows/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationInteger } from "app/@validations/integer.js";

import { validationUsers_idServer } from "app/@database/users/validations/_id-server.js";
import { validationUserCommunities_idServer } from "app/@database/user-communities/validations/_id-server.js";
import { validationFollowLimit } from "app/@database/follows/validations/follow-limit.js";
import { validationFollowType } from "app/@database/follows/validations/follow-type.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: X_pq2A_of
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
    // console.log(`
    //   ----- req.body -----\n
    //   ${util.inspect(req.body, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
    const bodyObj = JSON.parse(req.body);

    const {
      users_id,
      gameCommunities_id,
      userCommunities_id,
      controlType,
      page,
      limit,
    } = bodyObj;

    lodashSet(requestParametersObj, ["users_id"], users_id);
    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["userCommunities_id"], userCommunities_id);
    lodashSet(requestParametersObj, ["controlType"], controlType);
    lodashSet(requestParametersObj, ["page"], page);
    lodashSet(requestParametersObj, ["limit"], limit);

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/follows/read-followers.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}

    //   users_id: {green ${users_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   controlType: {green ${controlType} / ${typeof controlType}}
    //   page: {green ${page} / ${typeof page}}
    //   limit: {green ${limit} / ${typeof limit}}
    // `);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    // verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    // ---------------------------------------------
    //   - Game Community
    // ---------------------------------------------

    if (gameCommunities_id) {
      // ---------------------------------------------
      //   - User Community
      // ---------------------------------------------
    } else if (userCommunities_id) {
      await validationUserCommunities_idServer({ value: userCommunities_id });

      // ---------------------------------------------
      //   - User
      // ---------------------------------------------
    } else {
      await validationUsers_idServer({ value: users_id });

      // --------------------------------------------------
      //   権限がないのに approval や block を表示しようとした場合はエラー
      // --------------------------------------------------

      if (
        (controlType === "approval" || controlType === "block") &&
        users_id !== loginUsers_id
      ) {
        statusCode = 401;
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "AvTRjcmIi", messageID: "DSRlEoL29" }],
        });
      }
    }

    await validationInteger({ throwError: true, required: true, value: page });
    await validationFollowType({
      throwError: true,
      required: true,
      value: controlType,
    });
    await validationFollowLimit({
      throwError: true,
      required: true,
      value: limit,
    });

    // --------------------------------------------------
    //   Game Community
    // --------------------------------------------------

    if (gameCommunities_id) {
      // --------------------------------------------------
      //    DB find / Card Players
      // --------------------------------------------------

      const resultFollowersObj = await ModelCardPlayers.findForFollowers({
        localeObj,
        loginUsers_id,
        adminUsers_id: "",
        gameCommunities_id,
        controlType,
        page,
        limit,
      });

      returnObj.cardPlayersObj = resultFollowersObj.cardPlayersObj;
      returnObj.followMembersObj = resultFollowersObj.followMembersObj;

      // --------------------------------------------------
      //   User Community
      // --------------------------------------------------
    } else if (userCommunities_id) {
      // --------------------------------------------------
      //   DB find / User Community
      // --------------------------------------------------

      const userCommunityObj = await ModelUserCommunities.findForUserCommunity({
        localeObj,
        loginUsers_id,
        userCommunities_id,
      });

      const adminUsers_id = lodashGet(userCommunityObj, ["users_id"], "");

      // console.log(`
      //   ----- userCommunityObj -----\n
      //   ${util.inspect(userCommunityObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   - コンテンツを表示するかどうか
      // ---------------------------------------------

      const communityType = lodashGet(
        userCommunityObj,
        ["communityType"],
        "open"
      );
      const follow = lodashGet(
        userCommunityObj,
        ["headerObj", "followsObj", "follow"],
        false
      );

      if (communityType === "closed" && !follow) {
        statusCode = 403;
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "MN_BH-td8", messageID: "Error" }],
        });
      }

      // --------------------------------------------------
      //    DB find / Card Players
      // --------------------------------------------------

      const resultFollowersObj = await ModelCardPlayers.findForFollowers({
        localeObj,
        loginUsers_id,
        adminUsers_id,
        userCommunities_id,
        controlType,
        page,
        limit,
      });

      returnObj.cardPlayersObj = resultFollowersObj.cardPlayersObj;
      returnObj.followMembersObj = resultFollowersObj.followMembersObj;

      // --------------------------------------------------
      //   User
      // --------------------------------------------------
    } else {
      // --------------------------------------------------
      //   DB find / Card Players
      // --------------------------------------------------

      const resultFollowersObj = await ModelCardPlayers.findForFollowers({
        localeObj,
        loginUsers_id,
        adminUsers_id: users_id,
        users_id,
        controlType,
        page,
        limit,
      });

      returnObj.cardPlayersObj = resultFollowersObj.cardPlayersObj;
      returnObj.followMembersObj = resultFollowersObj.followMembersObj;

      // console.log(`
      //   ----- resultFollowersObj -----\n
      //   ${util.inspect(resultFollowersObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

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
      endpointID: "X_pq2A_of",
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

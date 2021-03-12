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

import ModelForumThreads from "app/@database/forum-threads/model.js";
import ModelGameCommunities from "app/@database/game-communities/model.js";
import ModelUserCommunities from "app/@database/user-communities/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationInteger } from "app/@validations/integer.js";
import { validationGameCommunities_idServer } from "app/@database/game-communities/validations/_id-server.js";
import { validationUserCommunities_idAndAuthorityServer } from "app/@database/user-communities/validations/_id-server.js";
import { validationForumThreadsListLimit } from "app/@database/forum-threads/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: WqUdtMoNi
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

    const { gameCommunities_id, userCommunities_id, page, limit } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["userCommunities_id"], userCommunities_id);
    lodashSet(requestParametersObj, ["page"], page);
    lodashSet(requestParametersObj, ["limit"], limit);

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(chalk`
    //   /pages/api/v2/db/forum-threads/read-threads-list.js

    //   loginUsers_id: {green ${loginUsers_id}}

    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   page: {green ${page} / ${typeof page}}
    //   limit: {green ${limit} / ${typeof limit}}
    // `);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    // verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    if (gameCommunities_id) {
      await validationGameCommunities_idServer({ value: gameCommunities_id });
    } else {
      await validationUserCommunities_idAndAuthorityServer({
        value: userCommunities_id,
        loginUsers_id,
      });
    }

    await validationInteger({ throwError: true, required: true, value: page });
    await validationForumThreadsListLimit({
      throwError: true,
      required: true,
      value: limit,
    });

    // --------------------------------------------------
    //   DB find / Forum Threads List
    // --------------------------------------------------

    returnObj.forumThreadsForListObj = await ModelForumThreads.findForThreadsList(
      {
        localeObj,
        loginUsers_id,
        gameCommunities_id,
        userCommunities_id,
        page,
        limit,
      }
    );

    // --------------------------------------------------
    //   DB find / Game Community
    // --------------------------------------------------

    if (gameCommunities_id) {
      returnObj.gameCommunityObj = await ModelGameCommunities.findForGameCommunityByGameCommunities_id(
        {
          gameCommunities_id,
        }
      );

      // --------------------------------------------------
      //   DB find / User Community
      // --------------------------------------------------
    } else {
      returnObj.userCommunityObj = await ModelUserCommunities.findForUserCommunityByUserCommunities_id(
        {
          localeObj,
          userCommunities_id,
        }
      );
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
      endpointID: "WqUdtMoNi",
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

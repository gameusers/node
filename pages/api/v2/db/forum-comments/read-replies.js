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
import ModelForumComments from "app/@database/forum-comments/model.js";

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
import {
  validationForumCommentsLimit,
  validationForumRepliesLimit,
} from "app/@database/forum-comments/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: AQOnS_hsz
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

    const {
      gameCommunities_id,
      userCommunities_id,
      forumComments_idsArr,
      commentPage,
      commentLimit,
      replyPage,
      replyLimit,
    } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["userCommunities_id"], userCommunities_id);
    lodashSet(
      requestParametersObj,
      ["forumComments_idsArr"],
      forumComments_idsArr
    );
    lodashSet(requestParametersObj, ["commentPage"], commentPage);
    lodashSet(requestParametersObj, ["commentLimit"], commentLimit);
    lodashSet(requestParametersObj, ["replyPage"], replyPage);
    lodashSet(requestParametersObj, ["replyLimit"], replyLimit);

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

    // Comment Page & Limit
    await validationInteger({
      throwError: true,
      required: true,
      value: commentPage,
    });
    await validationForumCommentsLimit({
      throwError: true,
      required: true,
      value: commentLimit,
    });

    // Reply Page & Limit
    await validationInteger({
      throwError: true,
      required: true,
      value: replyPage,
    });
    await validationForumRepliesLimit({
      throwError: true,
      required: true,
      value: replyLimit,
    });

    // --------------------------------------------------
    //   DB find / Forum Comments - Replies
    // --------------------------------------------------

    returnObj.forumRepliesObj = await ModelForumComments.findRepliesByForumComments_idsArr(
      {
        req,
        localeObj,
        loginUsers_id,
        gameCommunities_id,
        userCommunities_id,
        forumComments_idsArr,
        commentPage,
        commentLimit,
        replyPage,
        replyLimit,
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

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   /pages/api/v2/db/forum-comments/read-replies.js

    //   loginUsers_id: {green ${loginUsers_id}}

    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   commentPage: {green ${commentPage} / ${typeof commentPage}}
    //   commentLimit: {green ${commentLimit} / ${typeof commentLimit}}
    //   replyPage: {green ${replyPage} / ${typeof replyPage}}
    //   replyLimit: {green ${replyLimit} / ${typeof replyLimit}}
    // `);

    // console.log(`
    //   ----- forumComments_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumComments_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
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
      endpointID: "AQOnS_hsz",
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

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
import ModelForumThreads from "app/@database/forum-threads/model.js";

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
import { validationForumThreadsLimit } from "app/@database/forum-threads/validations/limit.js";
import {
  validationForumCommentsLimit,
  validationForumRepliesLimit,
} from "app/@database/forum-comments/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: xo-pMg2cf
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

    // console.log(chalk`
    //   /pages/api/v2/db/forum-comments/read-comments.js
    // `);

    // console.log(req.body);

    const bodyObj = JSON.parse(req.body);

    // console.log(bodyObj);

    const {
      gameCommunities_id,
      userCommunities_id,
      forumThreads_idsArr,
      threadPage,
      threadLimit,
      commentPage,
      commentLimit,
      replyPage,
      replyLimit,
    } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["userCommunities_id"], userCommunities_id);
    lodashSet(
      requestParametersObj,
      ["forumThreads_idsArr"],
      forumThreads_idsArr
    );
    lodashSet(requestParametersObj, ["threadPage"], threadPage);
    lodashSet(requestParametersObj, ["threadLimit"], threadLimit);
    lodashSet(requestParametersObj, ["commentPage"], commentPage);
    lodashSet(requestParametersObj, ["commentLimit"], commentLimit);
    lodashSet(requestParametersObj, ["replyPage"], replyPage);
    lodashSet(requestParametersObj, ["replyLimit"], replyLimit);

    // console.log(chalk`
    //   /pages/api/v2/db/forum-comments/read-comments.js

    //   loginUsers_id: {green ${loginUsers_id}}

    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   threadPage: {green ${threadPage} / ${typeof threadPage}}
    //   threadLimit: {green ${threadLimit} / ${typeof threadLimit}}
    //   commentPage: {green ${commentPage} / ${typeof commentPage}}
    //   commentLimit: {green ${commentLimit} / ${typeof commentLimit}}
    //   replyPage: {green ${replyPage} / ${typeof replyPage}}
    //   replyLimit: {green ${replyLimit} / ${typeof replyLimit}}
    // `);

    // console.log(`
    //   ----- forumThreads_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(forumThreads_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
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

    await validationInteger({
      throwError: true,
      required: true,
      value: threadPage,
    });
    await validationForumThreadsLimit({
      throwError: true,
      required: true,
      value: threadLimit,
    });

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
    //   DB find / Forum Threads
    // --------------------------------------------------

    const forumObj = await ModelForumThreads.findForForum({
      req,
      localeObj,
      loginUsers_id,
      userCommunities_id,
      forumThreads_idsArr,
      threadPage,
      threadLimit,
      commentPage,
      commentLimit,
      replyPage,
      replyLimit,
    });

    returnObj.forumThreadsObj = forumObj.forumThreadsObj;
    returnObj.forumCommentsObj = forumObj.forumCommentsObj;
    returnObj.forumRepliesObj = forumObj.forumRepliesObj;

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
      endpointID: "xo-pMg2cf",
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

// --------------------------------------------------
//   config
// --------------------------------------------------

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

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
import ModelRecruitmentThreads from "app/@database/recruitment-threads/model.js";

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
import { validationRecruitmentThreadsLimit } from "app/@database/recruitment-threads/validations/limit.js";
import { validationRecruitmentCommentsLimit } from "app/@database/recruitment-comments/validations/limit.js";
import { validationRecruitmentRepliesLimit } from "app/@database/recruitment-replies/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: aCv-xLGqx
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
      recruitmentThreads_idsArr,
      threadPage,
      threadLimit,
      commentPage,
      commentLimit,
      replyPage,
      replyLimit,
    } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(
      requestParametersObj,
      ["recruitmentThreads_idsArr"],
      recruitmentThreads_idsArr
    );
    lodashSet(requestParametersObj, ["threadPage"], threadPage);
    lodashSet(requestParametersObj, ["threadLimit"], threadLimit);
    lodashSet(requestParametersObj, ["commentPage"], commentPage);
    lodashSet(requestParametersObj, ["commentLimit"], commentLimit);
    lodashSet(requestParametersObj, ["replyPage"], replyPage);
    lodashSet(requestParametersObj, ["replyLimit"], replyLimit);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    // verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationGameCommunities_idServer({ value: gameCommunities_id });

    // Thread Page & Limit
    await validationInteger({
      throwError: true,
      required: true,
      value: threadPage,
    });
    await validationRecruitmentThreadsLimit({
      throwError: true,
      required: true,
      value: threadLimit,
    });

    // Comment Page & Limit
    await validationInteger({
      throwError: true,
      required: true,
      value: commentPage,
    });
    await validationRecruitmentCommentsLimit({
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
    await validationRecruitmentRepliesLimit({
      throwError: true,
      required: true,
      value: replyLimit,
    });

    // --------------------------------------------------
    //   DB find / Forum Threads
    // --------------------------------------------------

    const recruitmentObj = await ModelRecruitmentThreads.findRecruitments({
      req,
      localeObj,
      loginUsers_id,
      gameCommunities_id,
      recruitmentThreads_idsArr,
      threadPage,
      threadLimit,
      commentPage,
      commentLimit,
      replyPage,
      replyLimit,
    });

    returnObj.recruitmentThreadsObj = recruitmentObj.recruitmentThreadsObj;
    returnObj.recruitmentCommentsObj = recruitmentObj.recruitmentCommentsObj;
    returnObj.recruitmentRepliesObj = recruitmentObj.recruitmentRepliesObj;

    // --------------------------------------------------
    //   DB find / Game Community
    // --------------------------------------------------

    returnObj.gameCommunityObj = await ModelGameCommunities.findForGameCommunityByGameCommunities_id(
      {
        gameCommunities_id,
      }
    );

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/recruitment-comments/read-comments.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   threadPage: {green ${threadPage} / ${typeof threadPage}}
    //   threadLimit: {green ${threadLimit} / ${typeof threadLimit}}
    //   commentPage: {green ${commentPage} / ${typeof commentPage}}
    //   commentLimit: {green ${commentLimit} / ${typeof commentLimit}}
    //   replyPage: {green ${replyPage} / ${typeof replyPage}}
    //   replyLimit: {green ${replyLimit} / ${typeof replyLimit}}
    // `);

    // console.log(`
    //   ----- recruitmentThreads_idsArr -----\n
    //   ${util.inspect(recruitmentThreads_idsArr, { colors: true, depth: null })}\n
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
      endpointID: "aCv-xLGqx",
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

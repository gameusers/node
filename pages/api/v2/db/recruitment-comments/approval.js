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
// import rimraf from 'rimraf';

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
import ModelRecruitmentComments from "app/@database/recruitment-comments/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
// import { experienceCalculate } from 'app/@modules/experience.js';

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import { validationInteger } from "app/@validations/integer.js";

import { validationRecruitmentThreadsLimit } from "app/@database/recruitment-threads/validations/limit.js";
import { validationRecruitmentCommentsLimit } from "app/@database/recruitment-comments/validations/limit.js";
import { validationRecruitmentRepliesLimit } from "app/@database/recruitment-replies/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: 6ADaP7iPi
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
      recruitmentComments_id,
      threadPage,
      threadLimit,
      commentLimit,
      replyLimit,
    } = bodyObj;

    lodashSet(
      requestParametersObj,
      ["recruitmentComments_id"],
      recruitmentComments_id
    );

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
        errorsArr: [{ code: "5WMnTPCRk", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

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

    // Comment Limit
    await validationRecruitmentCommentsLimit({
      throwError: true,
      required: true,
      value: commentLimit,
    });

    // Reply Limit
    await validationRecruitmentRepliesLimit({
      throwError: true,
      required: true,
      value: replyLimit,
    });

    // --------------------------------------------------
    //   データ取得
    // --------------------------------------------------

    // recruitment-comments
    const docCommentsObj = await ModelRecruitmentComments.findOne({
      conditionObj: {
        _id: recruitmentComments_id,
      },
    });

    const gameCommunities_id = lodashGet(
      docCommentsObj,
      ["gameCommunities_id"],
      ""
    );
    const recruitmentThreads_id = lodashGet(
      docCommentsObj,
      ["recruitmentThreads_id"],
      ""
    );
    const users_id = lodashGet(docCommentsObj, ["users_id"], "");

    // recruitment-threads
    const docThreadsObj = await ModelRecruitmentThreads.findOne({
      conditionObj: {
        _id: recruitmentThreads_id,
        users_id: loginUsers_id,
      },
    });

    const publicApprovalUsers_idsArrr = lodashGet(
      docThreadsObj,
      ["publicApprovalUsers_idsArrr"],
      []
    );

    // --------------------------------------------------
    //   データが空の場合は処理停止
    // --------------------------------------------------

    if (!docThreadsObj) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "K9GOSRWbN", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   配列にユーザーを追加・削減する
    // --------------------------------------------------

    // const arrayIndex = publicApprovalUsers_idsArrr.indexOf(users_id);

    // if (arrayIndex === -1) {
    //   publicApprovalUsers_idsArrr.push(users_id);
    // } else {
    //   publicApprovalUsers_idsArrr.splice(arrayIndex, 1);
    // }

    // --------------------------------------------------
    //   配列にユーザーを追加する、すでに追加されている場合はエラー
    // --------------------------------------------------

    if (publicApprovalUsers_idsArrr.includes(users_id)) {
      throw new CustomError({
        level: "error",
        errorsArr: [{ code: "AXpO0iGpq", messageID: "3mDvfqZHV" }],
      });
    } else {
      publicApprovalUsers_idsArrr.push(users_id);
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   Approval
    // --------------------------------------------------

    // ---------------------------------------------
    //   - recruitment-threads / 更新日時の変更 & publicApprovalUsers_idsArrr
    // ---------------------------------------------

    const recruitmentThreadsConditionObj = {
      _id: recruitmentThreads_id,
    };

    const recruitmentThreadsSaveObj = {
      $set: {
        updatedDate: ISO8601,
        publicApprovalUsers_idsArrr,
      },
    };

    // ---------------------------------------------
    //   - game-communities / 更新日時の変更
    // ---------------------------------------------

    const gameCommunitiesConditionObj = {
      _id: gameCommunities_id,
    };

    const gameCommunitiesSaveObj = {
      $set: {
        updatedDate: ISO8601,
      },
    };

    // --------------------------------------------------
    //   DB insert Transaction
    // --------------------------------------------------

    await ModelRecruitmentThreads.transactionForUpsert({
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
    });

    // --------------------------------------------------
    //   DB find / Recruitments
    // --------------------------------------------------

    const recruitmentObj = await ModelRecruitmentThreads.findRecruitments({
      req,
      localeObj,
      loginUsers_id,
      gameCommunities_id,
      threadPage,
      threadLimit,
      commentPage: 1,
      commentLimit,
      replyPage: 1,
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

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/recruitment-comments/approval.js
    // `);

    // console.log(chalk`
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   threadPage: {green ${threadPage}}
    //   threadLimit: {green ${threadLimit}}
    //   commentLimit: {green ${commentLimit}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(`
    //   ----- docCommentsObj -----\n
    //   ${util.inspect(docCommentsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docThreadsObj -----\n
    //   ${util.inspect(docThreadsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- publicApprovalUsers_idsArrr -----\n
    //   ${util.inspect(publicApprovalUsers_idsArrr, { colors: true, depth: null })}\n
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
      endpointID: "6ADaP7iPi",
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

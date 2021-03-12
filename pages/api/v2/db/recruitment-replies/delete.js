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
import rimraf from "rimraf";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelGameCommunities from "app/@database/game-communities/model.js";
// import ModelRecruitmentThreads from 'app/@database/recruitment-threads/model.js';
import ModelRecruitmentReplies from "app/@database/recruitment-replies/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { experienceCalculate } from "app/@modules/experience.js";
import { verifyAuthority } from "app/@modules/authority.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: 1mV1It1qK
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

    const { recruitmentReplies_id } = bodyObj;

    lodashSet(
      requestParametersObj,
      ["recruitmentReplies_id"],
      recruitmentReplies_id
    );

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // --------------------------------------------------
    //   データ取得
    //   データが存在しない、編集権限がない場合はエラーが投げられる
    // --------------------------------------------------

    const docRepliesObj = await ModelRecruitmentReplies.findOneForEdit({
      req,
      localeObj,
      loginUsers_id,
      recruitmentReplies_id,
      type: "delete",
    });

    const users_id = lodashGet(docRepliesObj, ["users_id"], "");
    const gameCommunities_id = lodashGet(
      docRepliesObj,
      ["gameCommunities_id"],
      ""
    );
    const recruitmentThreads_id = lodashGet(
      docRepliesObj,
      ["recruitmentThreads_id"],
      ""
    );
    const recruitmentComments_id = lodashGet(
      docRepliesObj,
      ["recruitmentComments_id"],
      ""
    );
    const imagesAndVideos_id = lodashGet(
      docRepliesObj,
      ["imagesAndVideosObj", "_id"],
      ""
    );

    let images = 0;
    let videos = 0;
    images -= lodashGet(docRepliesObj, ["imagesAndVideosObj", "images"], 0);
    videos -= lodashGet(docRepliesObj, ["imagesAndVideosObj", "videos"], 0);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/recruitment-replies/delete.js
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   recruitmentReplies_id: {green ${recruitmentReplies_id}}
    //   threadLimit: {green ${threadLimit}}
    //   commentLimit: {green ${commentLimit}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(chalk`
    //   imagesAndVideos_id: {green ${imagesAndVideos_id}}
    //   images: {green ${images}}
    //   videos: {green ${videos}}
    // `);

    // console.log(chalk`
    // loginUsers_id: {green ${loginUsers_id}}
    // users_id: {green ${users_id}}
    // `);

    // console.log(`
    //   ----- docRepliesObj -----\n
    //   ${util.inspect(docRepliesObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   Delete
    // --------------------------------------------------

    // ---------------------------------------------
    //   - recruitment-replies / 返信
    // ---------------------------------------------

    const recruitmentRepliesConditionObj = {
      _id: recruitmentReplies_id,
    };

    // ---------------------------------------------
    //   - recruitment-comments / 更新日時の変更 & 返信総数 - 1
    // ---------------------------------------------

    const recruitmentCommentsConditionObj = {
      _id: recruitmentComments_id,
    };

    let recruitmentCommentsSaveObj = {
      updatedDate: ISO8601,
      $inc: { replies: -1 },
    };

    // ---------------------------------------------
    //   - recruitment-threads / 更新日時の変更 & 返信総数 - 1 & 画像数と動画数の変更
    // ---------------------------------------------

    const recruitmentThreadsConditionObj = {
      _id: recruitmentThreads_id,
    };

    let recruitmentThreadsSaveObj = {
      updatedDate: ISO8601,
      $inc: { replies: -1, images, videos },
    };

    // ---------------------------------------------
    //   - images-and-videos
    // ---------------------------------------------

    let imagesAndVideosConditionObj = {};

    if (imagesAndVideos_id) {
      imagesAndVideosConditionObj = {
        _id: imagesAndVideos_id,
      };
    }

    // ---------------------------------------------
    //   - game-communities / 更新日時の変更
    // ---------------------------------------------

    const gameCommunitiesConditionObj = {
      _id: gameCommunities_id,
    };

    const gameCommunitiesSaveObj = {
      updatedDate: ISO8601,
      "updatedDateObj.recruitment": ISO8601,
    };

    // --------------------------------------------------
    //   DB insert Transaction
    // --------------------------------------------------

    await ModelRecruitmentReplies.transactionForDelete({
      recruitmentRepliesConditionObj,
      imagesAndVideosConditionObj,
      recruitmentCommentsConditionObj,
      recruitmentCommentsSaveObj,
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
    });

    // ---------------------------------------------
    //   画像を削除する
    // ---------------------------------------------

    const dirPath = `public/img/recruitment/${imagesAndVideos_id}`;

    if (imagesAndVideos_id) {
      // console.log(dirPath);

      rimraf(dirPath, (err) => {
        if (err) {
          throw new CustomError({
            level: "error",
            errorsArr: [{ code: "_hHEiJ08h", messageID: "Error" }],
          });
        }
      });
    }

    // --------------------------------------------------
    //   DB find / Game Community
    // --------------------------------------------------

    returnObj.gameCommunityObj = await ModelGameCommunities.findForGameCommunityByGameCommunities_id(
      {
        gameCommunities_id,
      }
    );

    // --------------------------------------------------
    //   experience
    // --------------------------------------------------

    if (loginUsers_id && users_id && loginUsers_id === users_id) {
      const experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: [
          {
            type: "recruitment-count-post",
            calculation: "subtraction",
          },
        ],
      });

      if (Object.keys(experienceObj).length !== 0) {
        returnObj.experienceObj = experienceObj;
      }
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
      endpointID: "1mV1It1qK",
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

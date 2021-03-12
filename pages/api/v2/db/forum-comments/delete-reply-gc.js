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
import ModelForumComments from "app/@database/forum-comments/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

import { validationGameCommunities_idServer } from "app/@database/game-communities/validations/_id-server.js";
import { validationForumThreads_idServerGC } from "app/@database/forum-threads/validations/_id-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: R2LO0M-Ru
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
      forumThreads_id,
      forumComments_id,
      forumReplies_id,
    } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["forumThreads_id"], forumThreads_id);
    lodashSet(requestParametersObj, ["forumComments_id"], forumComments_id);
    lodashSet(requestParametersObj, ["forumReplies_id"], forumReplies_id);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationGameCommunities_idServer({ value: gameCommunities_id });
    await validationForumThreads_idServerGC({
      forumThreads_id,
      gameCommunities_id,
    });

    // --------------------------------------------------
    //   データ取得
    //   データが存在しない、編集権限がない場合はエラーが投げられる
    // --------------------------------------------------

    const docForumCommentsObj = await ModelForumComments.findForDeleteReply({
      req,
      loginUsers_id,
      gameCommunities_id,
      forumThreads_id,
      forumComments_id,
      forumReplies_id,
    });

    const users_id = lodashGet(docForumCommentsObj, ["users_id"], "");
    const imagesAndVideos_id = lodashGet(
      docForumCommentsObj,
      ["imagesAndVideos_id"],
      ""
    );
    const images = lodashGet(docForumCommentsObj, ["images"], 0);
    const videos = lodashGet(docForumCommentsObj, ["images"], 0);

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   Delete
    // --------------------------------------------------

    // ---------------------------------------------
    //   - forum-comments / 返信
    // ---------------------------------------------

    const forumRepliesConditionObj = {
      _id: forumReplies_id,
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
    //   - forum-comments / 更新日時の変更 & 返信数 - 1
    // ---------------------------------------------

    const forumCommentsConditionObj = {
      _id: forumComments_id,
    };

    let forumCommentsSaveObj = {
      updatedDate: ISO8601,
      $inc: { replies: -1 },
    };

    // ---------------------------------------------
    //   - forum-threads / 更新日時の変更 & 返信数 - 1 & 画像数と動画数の変更
    // ---------------------------------------------

    const forumThreadsConditionObj = {
      _id: forumThreads_id,
    };

    let forumThreadsSaveObj = {
      updatedDate: ISO8601,
      $inc: { replies: -1, images, videos },
    };

    // ---------------------------------------------
    //   - game-communities / 更新日時の変更
    // ---------------------------------------------

    const gameCommunitiesConditionObj = {
      _id: gameCommunities_id,
    };

    const gameCommunitiesSaveObj = {
      updatedDate: ISO8601,
      "updatedDateObj.forum": ISO8601,
    };

    // --------------------------------------------------
    //   DB insert Transaction
    // --------------------------------------------------

    await ModelForumComments.transactionForDeleteReply({
      forumRepliesConditionObj,
      imagesAndVideosConditionObj,
      forumCommentsConditionObj,
      forumCommentsSaveObj,
      forumThreadsConditionObj,
      forumThreadsSaveObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
    });

    // ---------------------------------------------
    //   画像を削除する
    // ---------------------------------------------

    const dirPath = `public/img/forum/${imagesAndVideos_id}`;

    if (imagesAndVideos_id && images !== 0) {
      rimraf(dirPath, (err) => {
        if (err) {
          throw new CustomError({
            level: "error",
            errorsArr: [{ code: "P6BqPw3cY", messageID: "Error" }],
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
    //   experience / 投稿者の場合のみ
    // --------------------------------------------------

    if (loginUsers_id && users_id && loginUsers_id === users_id) {
      const experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: [
          {
            type: "forum-count-post",
            calculation: "subtraction",
          },
        ],
      });

      if (Object.keys(experienceObj).length !== 0) {
        returnObj.experienceObj = experienceObj;
      }
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/forum-comments/delete-reply-gc.js
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   forumThreads_id: {green ${forumThreads_id}}
    //   forumComments_id: {green ${forumComments_id}}
    //   forumReplies_id: {green ${forumReplies_id}}

    //   imagesAndVideos_id: {green ${imagesAndVideos_id}}
    //   images: {green ${images}}
    //   videos: {green ${videos}}
    // `);

    // console.log(`
    //   ----- docForumCommentsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docForumCommentsObj)), { colors: true, depth: null })}\n
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
      endpointID: "R2LO0M-Ru",
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

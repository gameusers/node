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
//   endpointID: IB5ETD3kZ
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

    const { gameCommunities_id, forumThreads_id, forumComments_id } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["forumThreads_id"], forumThreads_id);
    lodashSet(requestParametersObj, ["forumComments_id"], forumComments_id);

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

    const docForumCommentsObj = await ModelForumComments.findForDeleteComment({
      req,
      loginUsers_id,
      forumComments_id,
    });

    const users_id = lodashGet(docForumCommentsObj, ["users_id"], "");
    const replies = lodashGet(docForumCommentsObj, ["replies"], 0);
    const imagesAndVideos_idsArr = lodashGet(
      docForumCommentsObj,
      ["imagesAndVideos_idsArr"],
      []
    );
    const images = lodashGet(docForumCommentsObj, ["images"], 0);
    const videos = lodashGet(docForumCommentsObj, ["videos"], 0);

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   Delete
    // --------------------------------------------------

    // ---------------------------------------------
    //   - forum-replies / 返信削除
    // ---------------------------------------------

    const forumRepliesConditionObj = {
      forumComments_id,
    };

    // ---------------------------------------------
    //   - forum-comments / コメント削除
    // ---------------------------------------------

    const forumCommentsConditionObj = {
      _id: forumComments_id,
    };

    // ---------------------------------------------
    //   - images-and-videos / 削除
    // ---------------------------------------------

    let imagesAndVideosConditionObj = {};

    if (imagesAndVideos_idsArr.length > 0) {
      imagesAndVideosConditionObj = {
        _id: { $in: imagesAndVideos_idsArr },
      };
    }

    // ---------------------------------------------
    //   - forum-threads / 更新日時の変更 & コメント数 - 1 & 返信数 - ○○ & 画像数と動画数の変更
    // ---------------------------------------------

    const forumThreadsConditionObj = {
      _id: forumThreads_id,
    };

    const forumThreadsSaveObj = {
      updatedDate: ISO8601,
      $inc: { comments: -1, replies, images, videos },
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

    await ModelForumComments.transactionForDeleteComment({
      forumThreadsConditionObj,
      forumThreadsSaveObj,
      forumCommentsConditionObj,
      forumRepliesConditionObj,
      imagesAndVideosConditionObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
    });

    // ---------------------------------------------
    //   画像を削除する
    // ---------------------------------------------

    for (let value of imagesAndVideos_idsArr.values()) {
      const dirPath = `public/img/forum/${value}`;
      // console.log(dirPath);

      rimraf(dirPath, (err) => {
        if (err) {
          throw new CustomError({
            level: "error",
            errorsArr: [{ code: "9Nv0_OQQG", messageID: "Error" }],
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
    //   experiencee / 投稿者の場合のみ
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

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   forumThreads_id: {green ${forumThreads_id}}
    //   forumComments_id: {green ${forumComments_id}}
    //   anonymity: {green ${anonymity} / ${typeof anonymity}}
    //   IP: {green ${ip}}
    //   User Agent: {green ${req.headers['user-agent']}}
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
      endpointID: "IB5ETD3kZ",
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

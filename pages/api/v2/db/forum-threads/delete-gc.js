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
import ModelForumThreads from "app/@database/forum-threads/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

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
//   endpointID: 2yY9Z0oq0
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

    const { gameCommunities_id, forumThreads_id } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["forumThreads_id"], forumThreads_id);

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

    const findForDeleteThreadObj = await ModelForumThreads.findForDeleteThread({
      req,
      loginUsers_id,
      forumThreads_id,
    });

    const imagesAndVideos_idsArr = lodashGet(
      findForDeleteThreadObj,
      ["imagesAndVideos_idsArr"],
      []
    );

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   Delete
    // --------------------------------------------------

    // ---------------------------------------------
    //   - forum-comments / 返信削除
    // ---------------------------------------------

    const forumRepliesConditionObj = {
      forumThreads_id,
    };

    // ---------------------------------------------
    //   - forum-comments / コメント削除
    // ---------------------------------------------

    const forumCommentsConditionObj = {
      forumThreads_id,
    };

    // ---------------------------------------------
    //   - forum-threads / スレッド削除
    // ---------------------------------------------

    const forumThreadsConditionObj = {
      _id: forumThreads_id,
    };

    // ---------------------------------------------
    //   - images-and-videos 削除
    // ---------------------------------------------

    let imagesAndVideosConditionObj = {};

    if (imagesAndVideos_idsArr.length > 0) {
      imagesAndVideosConditionObj = {
        _id: { $in: imagesAndVideos_idsArr },
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
      "updatedDateObj.forum": ISO8601,
      $inc: { "forumObj.threadCount": -1 },
    };

    // --------------------------------------------------
    //   DB insert Transaction
    // --------------------------------------------------

    await ModelForumThreads.transactionForDeleteThread({
      forumRepliesConditionObj,
      forumCommentsConditionObj,
      forumThreadsConditionObj,
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
            errorsArr: [{ code: "5nYm0RKGN", messageID: "Error" }],
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
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   userCommunities_id: {green ${userCommunities_id}}
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
      endpointID: "2yY9Z0oq0",
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

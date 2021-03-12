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

import shortid from "shortid";
import moment from "moment";

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
import ModelForumComments from "app/@database/forum-comments/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { formatAndSave } from "app/@modules/image/save.js";
import { setAuthority } from "app/@modules/authority.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import { validationBoolean } from "app/@validations/boolean.js";

import { validationGameCommunities_idServer } from "app/@database/game-communities/validations/_id-server.js";
import { validationForumThreads_idServerGC } from "app/@database/forum-threads/validations/_id-server.js";
import { validationForumCommentsName } from "app/@database/forum-comments/validations/name.js";
import { validationForumCommentsComment } from "app/@database/forum-comments/validations/comment.js";
import {
  validationForumThreadsListLimit,
  validationForumThreadsLimit,
} from "app/@database/forum-threads/validations/limit.js";
import {
  validationForumCommentsLimit,
  validationForumRepliesLimit,
} from "app/@database/forum-comments/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: ViCtroXyq
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
      name,
      comment,
      anonymity,
      imagesAndVideosObj,
      threadListLimit,
      threadLimit,
      commentLimit,
      replyLimit,
    } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["forumThreads_id"], forumThreads_id);
    lodashSet(requestParametersObj, ["forumComments_id"], forumComments_id);
    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["comment"], comment);
    lodashSet(requestParametersObj, ["anonymity"], anonymity);
    lodashSet(requestParametersObj, ["imagesAndVideosObj"], {});
    lodashSet(requestParametersObj, ["threadListLimit"], threadListLimit);
    lodashSet(requestParametersObj, ["threadLimit"], threadLimit);
    lodashSet(requestParametersObj, ["commentLimit"], commentLimit);
    lodashSet(requestParametersObj, ["replyLimit"], replyLimit);

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
    await validationForumCommentsName({ throwError: true, value: name });
    await validationForumCommentsComment({ throwError: true, value: comment });
    await validationBoolean({ throwError: true, value: anonymity });

    await validationForumThreadsListLimit({
      throwError: true,
      required: true,
      value: threadListLimit,
    });
    await validationForumThreadsLimit({
      throwError: true,
      required: true,
      value: threadLimit,
    });
    await validationForumCommentsLimit({
      throwError: true,
      required: true,
      value: commentLimit,
    });
    await validationForumRepliesLimit({
      throwError: true,
      required: true,
      value: replyLimit,
    });

    // --------------------------------------------------
    //   編集の場合 - 編集するコメントが存在していない場合はエラー
    // --------------------------------------------------

    let oldImagesAndVideosObj = {};

    if (forumComments_id) {
      // --------------------------------------------------
      //   データが存在しない、編集権限がない場合はエラーが投げられる
      // --------------------------------------------------

      const forumCommentsObj = await ModelForumComments.findForEdit({
        req,
        localeObj,
        loginUsers_id,
        forumComments_id,
      });

      // console.log(`
      //   ----- forumCommentsObj -----\n
      //   ${util.inspect(forumCommentsObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      oldImagesAndVideosObj = lodashGet(
        forumCommentsObj,
        ["imagesAndVideosObj"],
        {}
      );

      // --------------------------------------------------
      //   新規の場合 - 同じIPで、同じコメントが10分以内に投稿されている場合はエラー
      // --------------------------------------------------
    } else {
      const dateTimeLimit = moment().utc().add(-10, "minutes");

      const count = await ModelForumComments.count({
        conditionObj: {
          gameCommunities_id,
          forumThreads_id,
          "localesArr.comment": comment,
          createdDate: { $gt: dateTimeLimit },
          ip,
        },
      });

      // console.log(chalk`
      //   dateTimeLimit: {green ${dateTimeLimit}}
      //   count: {green ${count}}
      // `);

      if (count > 0) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "GhO9a3n1M", messageID: "ffNAq3wYT" }],
        });
      }
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   DB findOne / Game Communities / 匿名
    // --------------------------------------------------

    const docGameCommunitiesObj = await ModelGameCommunities.findOne({
      conditionObj: {
        _id: gameCommunities_id,
      },
    });

    const enableAnonymity = lodashGet(
      docGameCommunitiesObj,
      ["anonymity"],
      false
    );

    // 匿名での投稿ができないのに匿名にしようとした場合、エラー
    if (!enableAnonymity && anonymity) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "A2aYwNx-X", messageID: "qnWsuPcrJ" }],
      });
    }

    // console.log(chalk`
    //   enableAnonymity: {green ${enableAnonymity}}
    //   anonymity: {green ${anonymity}}
    // `);

    // console.log(`
    //   ----- docGameCommunitiesObj -----\n
    //   ${util.inspect(docGameCommunitiesObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   画像と動画の処理
    // --------------------------------------------------

    let imagesAndVideosConditionObj = {};
    let imagesAndVideosSaveObj = {};
    let imagesAndVideos_id = "";
    let images = 0;
    let videos = 0;

    if (imagesAndVideosObj) {
      // --------------------------------------------------
      //   画像を保存する
      // --------------------------------------------------

      const formatAndSaveObj = await formatAndSave({
        newObj: imagesAndVideosObj,
        oldObj: oldImagesAndVideosObj,
        loginUsers_id,
        ISO8601,
      });

      // --------------------------------------------------
      //   imagesAndVideosSaveObj
      // --------------------------------------------------

      imagesAndVideosSaveObj = lodashGet(
        formatAndSaveObj,
        ["imagesAndVideosObj"],
        {}
      );

      // --------------------------------------------------
      //   画像数＆動画数
      // --------------------------------------------------

      images = lodashGet(formatAndSaveObj, ["images"], 0);
      videos = lodashGet(formatAndSaveObj, ["videos"], 0);

      // --------------------------------------------------
      //   画像＆動画がすべて削除されている場合は imagesAndVideos_id を空にする
      // --------------------------------------------------

      const arr = lodashGet(imagesAndVideosSaveObj, ["arr"], []);

      if (arr.length === 0) {
        imagesAndVideos_id = "";
      } else {
        imagesAndVideos_id = lodashGet(imagesAndVideosSaveObj, ["_id"], "");
      }

      // --------------------------------------------------
      //   imagesAndVideosConditionObj
      // --------------------------------------------------

      imagesAndVideosConditionObj = {
        _id: lodashGet(imagesAndVideosSaveObj, ["_id"], ""),
      };
    }

    // --------------------------------------------------
    //   Insert
    // --------------------------------------------------

    // ---------------------------------------------
    //   - forum-comments
    // ---------------------------------------------

    const forumCommentsConditionObj = {
      _id: shortid.generate(),
    };

    const forumCommentsSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      gameCommunities_id,
      userCommunities_id: "",
      forumThreads_id,
      forumComments_id: "",
      replyToForumComments_id: "",
      users_id: loginUsers_id,
      localesArr: [
        {
          _id: shortid.generate(),
          language: localeObj.language,
          name,
          comment,
        },
      ],
      imagesAndVideos_id,
      anonymity,
      goods: 0,
      replies: 0,
      acceptLanguage,
      ip,
      userAgent,
    };

    // ---------------------------------------------
    //   - forum-threads / コメント数 + 1
    // ---------------------------------------------

    const forumThreadsConditionObj = {
      _id: forumThreads_id,
    };

    let forumThreadsSaveObj = {
      updatedDate: ISO8601,
      $inc: { comments: 1, images, videos },
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
    //   Update
    // --------------------------------------------------

    if (forumComments_id) {
      // ---------------------------------------------
      //   - forum-comments
      // ---------------------------------------------

      forumCommentsConditionObj._id = forumComments_id;

      delete forumCommentsSaveObj.createdDate;
      delete forumCommentsSaveObj.gameCommunities_id;
      delete forumCommentsSaveObj.userCommunities_id;
      delete forumCommentsSaveObj.forumThreads_id;
      delete forumCommentsSaveObj.forumComments_id;
      delete forumCommentsSaveObj.replyToForumComments_id;
      delete forumCommentsSaveObj.users_id;
      delete forumCommentsSaveObj.goods;
      delete forumCommentsSaveObj.replies;

      // ---------------------------------------------
      //   - forum-threads / 更新日時の変更 & 画像数と動画数の変更
      // ---------------------------------------------

      forumThreadsSaveObj = {
        updatedDate: ISO8601,
        $inc: { images, videos },
      };
    }

    // --------------------------------------------------
    //   DB insert Transaction
    // --------------------------------------------------

    await ModelForumComments.transactionForUpsert({
      forumThreadsConditionObj,
      forumThreadsSaveObj,
      forumCommentsConditionObj,
      forumCommentsSaveObj,
      imagesAndVideosConditionObj,
      imagesAndVideosSaveObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
    });

    // --------------------------------------------------
    //   Set Authority
    // --------------------------------------------------

    if (!loginUsers_id && !forumComments_id) {
      setAuthority({ req, _id: forumCommentsConditionObj._id });
    }

    // --------------------------------------------------
    //   DB find / Forum Threads List
    // --------------------------------------------------

    returnObj.forumThreadsForListObj = await ModelForumThreads.findForThreadsList(
      {
        localeObj,
        loginUsers_id,
        gameCommunities_id,
        page: 1,
        limit: threadListLimit,
      }
    );

    // --------------------------------------------------
    //   DB find / Forum Threads
    // --------------------------------------------------

    const forumObj = await ModelForumThreads.findForForum({
      req,
      localeObj,
      loginUsers_id,
      gameCommunities_id,
      threadPage: 1,
      threadLimit,
      commentPage: 1,
      commentLimit,
      replyPage: 1,
      replyLimit,
    });

    returnObj.forumThreadsObj = forumObj.forumThreadsObj;
    returnObj.forumCommentsObj = forumObj.forumCommentsObj;
    returnObj.forumRepliesObj = forumObj.forumRepliesObj;

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

    if (!forumComments_id) {
      const experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: [
          {
            type: "forum-count-post",
            calculation: "addition",
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
    //   userCommunities_id: {green ${userCommunities_id}}
    //   forumThreads_id: {green ${forumThreads_id}}
    //   forumComments_id: {green ${forumComments_id}}
    //   name: {green ${name} / ${typeof name}}
    //   comment: {green ${comment} / ${typeof comment}}
    //   anonymity: {green ${anonymity} / ${typeof anonymity}}
    //   IP: {green ${ip}}
    //   User Agent: {green ${req.headers['user-agent']}}
    // `);

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosObj)), { colors: true, depth: null })}\n
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
      endpointID: "ViCtroXyq",
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

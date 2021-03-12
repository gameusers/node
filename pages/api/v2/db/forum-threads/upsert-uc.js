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

import ModelUserCommunities from "app/@database/user-communities/model.js";
import ModelForumThreads from "app/@database/forum-threads/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { formatAndSave } from "app/@modules/image/save.js";
import { setAuthority } from "app/@modules/authority.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

import { validationUserCommunities_idAndAuthorityServer } from "app/@database/user-communities/validations/_id-server.js";
import { validationForumThreadsName } from "app/@database/forum-threads/validations/name.js";
import { validationForumThreadsComment } from "app/@database/forum-threads/validations/comment.js";
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
//   endpointID: XfDc_r3br
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
      userCommunities_id,
      forumThreads_id,
      name,
      comment,
      imagesAndVideosObj,
      threadListLimit,
      threadLimit,
      commentLimit,
      replyLimit,
    } = bodyObj;

    lodashSet(requestParametersObj, ["userCommunities_id"], userCommunities_id);
    lodashSet(requestParametersObj, ["forumThreads_id"], forumThreads_id);
    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["comment"], comment);
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

    await validationUserCommunities_idAndAuthorityServer({
      value: userCommunities_id,
      loginUsers_id,
    });
    await validationForumThreadsName({ throwError: true, value: name });
    await validationForumThreadsComment({ throwError: true, value: comment });
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
    //   スレッドが存在するかチェック
    // --------------------------------------------------

    let oldImagesAndVideosObj = {};

    // --------------------------------------------------
    //   編集の場合
    // --------------------------------------------------

    if (forumThreads_id) {
      // --------------------------------------------------
      //   データが存在しない　【編集権限】がない場合はエラーが投げられる
      // --------------------------------------------------

      const tempOldObj = await ModelForumThreads.findForEdit({
        req,
        localeObj,
        loginUsers_id,
        forumThreads_id,
      });

      // console.log(`
      //   ----- tempOldObj -----\n
      //   ${util.inspect(tempOldObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      oldImagesAndVideosObj = lodashGet(tempOldObj, ["imagesAndVideosObj"], {});

      // --------------------------------------------------
      //   新規の場合
      // --------------------------------------------------
    } else {
      // --------------------------------------------------
      //   同じ名前のスレッドが存在するかチェック
      //   count が 0 の場合は、同じ名前のスレッドは存在しない
      // --------------------------------------------------

      const count = await ModelForumThreads.count({
        conditionObj: {
          userCommunities_id,
          "localesArr.name": name,
        },
      });

      // console.log(chalk`
      //   count: {green ${count}}
      // `);

      if (count > 0) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "SLheO9BQf", messageID: "8ObqNYJ85" }],
        });
      }
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

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
    //   - forum-threads
    // ---------------------------------------------

    const forumThreadsConditionObj = {
      _id: shortid.generate(),
    };

    const forumThreadsSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      userCommunities_id,
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
      comments: 0,
      replies: 0,
      images,
      videos,
      acceptLanguage,
      ip,
      userAgent: lodashGet(req, ["headers", "user-agent"], ""),
    };

    // ---------------------------------------------
    //   - user-communities / 更新日時の変更＆スレッド数 + 1
    // ---------------------------------------------

    const userCommunitiesConditionObj = {
      _id: userCommunities_id,
    };

    const userCommunitiesSaveObj = {
      updatedDate: ISO8601,
      "updatedDateObj.forum": ISO8601,
      $inc: { "forumObj.threadCount": 1 },
    };

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    if (forumThreads_id) {
      // ---------------------------------------------
      //   - forum-threads
      // ---------------------------------------------

      forumThreadsConditionObj._id = forumThreads_id;

      delete forumThreadsSaveObj.createdDate;
      delete forumThreadsSaveObj.userCommunities_id;
      delete forumThreadsSaveObj.users_id;
      delete forumThreadsSaveObj.comments;
      delete forumThreadsSaveObj.images;
      delete forumThreadsSaveObj.videos;

      forumThreadsSaveObj.$inc = { images, videos };

      // ---------------------------------------------
      //   - user-communities / 更新日時の変更
      // ---------------------------------------------

      delete userCommunitiesSaveObj.$inc;
    }

    // --------------------------------------------------
    //   DB insert Transaction / Forum Threads & Images And Videos & User Communities
    // --------------------------------------------------

    await ModelForumThreads.transactionForUpsertThread({
      forumThreadsConditionObj,
      forumThreadsSaveObj,
      imagesAndVideosConditionObj,
      imagesAndVideosSaveObj,
      userCommunitiesConditionObj,
      userCommunitiesSaveObj,
    });

    // --------------------------------------------------
    //   Set Authority / 非ログインユーザーに時間制限のある編集権限を与える
    // --------------------------------------------------

    if (!loginUsers_id) {
      setAuthority({ req, _id: forumThreadsConditionObj._id });
    }

    // --------------------------------------------------
    //   DB find / Forum Threads List
    // --------------------------------------------------

    returnObj.forumThreadsForListObj = await ModelForumThreads.findForThreadsList(
      {
        localeObj,
        loginUsers_id,
        userCommunities_id,
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
      userCommunities_id,
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
    //   DB find / User Community
    // --------------------------------------------------

    returnObj.userCommunityObj = await ModelUserCommunities.findForUserCommunityByUserCommunities_id(
      {
        localeObj,
        userCommunities_id,
      }
    );

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   userCommunities_id: {green ${userCommunities_id}}
    //   forumThreads_id: {green ${forumThreads_id}}
    //   name: {green ${name} / ${typeof name}}
    //   comment: {green ${comment} / ${typeof comment}}
    //   IP: {green ${req.ip}}
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
      endpointID: "XfDc_r3br",
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

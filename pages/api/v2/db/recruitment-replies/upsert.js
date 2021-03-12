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

import ModelRecruitmentReplies from "app/@database/recruitment-replies/model.js";
import ModelGameCommunities from "app/@database/game-communities/model.js";

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
import { validationHandleName } from "app/@validations/name.js";

import { validationGameCommunities_idServer } from "app/@database/game-communities/validations/_id-server.js";

import { validationRecruitmentThreadsComment } from "app/@database/recruitment-threads/validations/comment.js";
import { validationRecruitmentThreadsLimit } from "app/@database/recruitment-threads/validations/limit.js";
import { validationRecruitmentCommentsLimit } from "app/@database/recruitment-comments/validations/limit.js";
import { validationRecruitmentRepliesLimit } from "app/@database/recruitment-replies/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: Xp-NFh_gZ
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
      recruitmentThreads_id,
      recruitmentComments_id,
      recruitmentReplies_id = "",
      replyToRecruitmentReplies_id = "",
      comment,
      imagesAndVideosObj,
      threadLimit,
      commentLimit,
      replyLimit,
    } = bodyObj;

    let { name } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(
      requestParametersObj,
      ["recruitmentThreads_id"],
      recruitmentThreads_id
    );
    lodashSet(
      requestParametersObj,
      ["recruitmentComments_id"],
      recruitmentComments_id
    );
    lodashSet(
      requestParametersObj,
      ["recruitmentReplies_id"],
      recruitmentReplies_id
    );
    lodashSet(
      requestParametersObj,
      ["replyToRecruitmentReplies_id"],
      replyToRecruitmentReplies_id
    );
    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["comment"], comment);
    lodashSet(requestParametersObj, ["imagesAndVideosObj"], {});
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
    await validationHandleName({ throwError: true, value: name });
    await validationRecruitmentThreadsComment({
      throwError: true,
      value: comment,
    });

    await validationRecruitmentThreadsLimit({
      throwError: true,
      required: true,
      value: threadLimit,
    });
    await validationRecruitmentCommentsLimit({
      throwError: true,
      required: true,
      value: commentLimit,
    });
    await validationRecruitmentRepliesLimit({
      throwError: true,
      required: true,
      value: replyLimit,
    });

    // --------------------------------------------------
    //   返信が存在するかチェック
    // --------------------------------------------------

    let oldImagesAndVideosObj = {};

    // --------------------------------------------------
    //   編集の場合
    // --------------------------------------------------

    if (recruitmentReplies_id) {
      // --------------------------------------------------
      //   データが存在しない　【編集権限】がない場合はエラーが投げられる
      // --------------------------------------------------

      const tempOldObj = await ModelRecruitmentReplies.findOneForEdit({
        req,
        localeObj,
        loginUsers_id,
        recruitmentReplies_id,
        type: "edit",
      });

      // console.log(`
      //   ----- tempOldObj -----\n
      //   ${util.inspect(tempOldObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   recruitmentThreads_id & recruitmentComments_id が不正な値の場合はエラー
      // --------------------------------------------------

      if (
        tempOldObj.recruitmentThreads_id !== recruitmentThreads_id ||
        tempOldObj.recruitmentComments_id !== recruitmentComments_id
      ) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "v_u14HJN3", messageID: "3mDvfqZHV" }],
        });
      }

      oldImagesAndVideosObj = lodashGet(tempOldObj, ["imagesAndVideosObj"], {});

      // --------------------------------------------------
      //   新規の場合 - 同じIPで、同じコメントが10分以内に投稿されている場合はエラー
      // --------------------------------------------------
    } else {
      const dateTimeLimit = moment().utc().add(-10, "minutes");

      const count = await ModelRecruitmentReplies.count({
        conditionObj: {
          gameCommunities_id,
          recruitmentThreads_id,
          recruitmentComments_id,
          "localesArr.comment": comment,
          createdDate: { $gt: dateTimeLimit },
          ip,
        },
      });

      // console.log(chalk`
      //   count: {green ${count}}
      // `);

      if (count > 0) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "obigos3Zu", messageID: "xkbq0REwt" }],
        });
      }
    }

    // --------------------------------------------------
    //   ReplyTo（返信対象が存在する場合）返信が存在するか確認する
    // --------------------------------------------------

    if (replyToRecruitmentReplies_id) {
      const count = await ModelRecruitmentReplies.count({
        conditionObj: {
          _id: replyToRecruitmentReplies_id,
          gameCommunities_id,
          recruitmentThreads_id,
          recruitmentComments_id,
        },
      });

      // console.log(chalk`
      //   replyTo count: {green ${count}}
      // `);

      if (count === 0) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "IS8eJWbRC", messageID: "3mDvfqZHV" }],
        });
      }
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   値の強制：ログインしている場合
    // --------------------------------------------------

    if (loginUsers_id) {
      name = "";
    }

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
      //   画像＆動画がすべて削除されている場合は、imagesAndVideos_idを空にする
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
    //   - recruitment-replies
    // ---------------------------------------------

    const recruitmentRepliesConditionObj = {
      _id: shortid.generate(),
    };

    const recruitmentRepliesSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      gameCommunities_id,
      recruitmentThreads_id,
      recruitmentComments_id,
      replyToRecruitmentReplies_id,
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
      goods: 0,
      acceptLanguage,
      ip,
      userAgent,
    };

    // ---------------------------------------------
    //   - recruitment-threads / 返信総数 + 1
    // ---------------------------------------------

    const recruitmentThreadsConditionObj = {
      _id: recruitmentThreads_id,
    };

    let recruitmentThreadsSaveObj = {
      updatedDate: ISO8601,
      $inc: { replies: 1, images, videos },
    };

    // ---------------------------------------------
    //   - recruitment-comments / 返信総数 + 1
    // ---------------------------------------------

    const recruitmentCommentsConditionObj = {
      _id: recruitmentComments_id,
    };

    let recruitmentCommentsSaveObj = {
      updatedDate: ISO8601,
      $inc: { replies: 1 },
    };

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

    // ---------------------------------------------
    //   - notifications / 新規挿入の場合のみ
    // ---------------------------------------------

    let notificationsConditionObj = {};
    let notificationsSaveObj = {};

    if (!recruitmentReplies_id) {
      notificationsConditionObj = {
        _id: shortid.generate(),
      };

      notificationsSaveObj = {
        createdDate: ISO8601,
        done: false,
        type: "recruitment-replies",
        arr: [
          {
            _id: recruitmentThreadsConditionObj._id,
            type: "target",
            db: "recruitment-threads",
          },
          {
            _id: recruitmentCommentsConditionObj._id,
            type: "target",
            db: "recruitment-comments",
          },
          {
            _id: recruitmentRepliesConditionObj._id,
            type: "source",
            db: "recruitment-replies",
          },
        ],
      };
    }

    // --------------------------------------------------
    //   Update - 編集の場合、更新しない方がいいフィールドを削除する
    // --------------------------------------------------

    if (recruitmentReplies_id) {
      // ---------------------------------------------
      //   - recruitment-replies
      // ---------------------------------------------

      recruitmentRepliesConditionObj._id = recruitmentReplies_id;

      delete recruitmentRepliesSaveObj.createdDate;
      delete recruitmentRepliesSaveObj.gameCommunities_id;
      delete recruitmentRepliesSaveObj.recruitmentThreads_id;
      delete recruitmentRepliesSaveObj.recruitmentComments_id;
      delete recruitmentRepliesSaveObj.replyToRecruitmentReplies_id;
      delete recruitmentRepliesSaveObj.users_id;
      delete recruitmentRepliesSaveObj.goods;

      // ---------------------------------------------
      //   - recruitment-threads / replies（スレッドに記録する返信総数）を増やさない
      // ---------------------------------------------

      delete recruitmentThreadsSaveObj.$inc.replies;

      // ---------------------------------------------
      //   - recruitment-comments / replies（コメントに記録する返信総数）を増やさない
      // ---------------------------------------------

      delete recruitmentCommentsSaveObj.$inc;
    }

    // --------------------------------------------------
    //   DB upsert Transaction
    // --------------------------------------------------

    await ModelRecruitmentReplies.transactionForUpsert({
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
      recruitmentCommentsConditionObj,
      recruitmentCommentsSaveObj,
      recruitmentRepliesConditionObj,
      recruitmentRepliesSaveObj,
      imagesAndVideosConditionObj,
      imagesAndVideosSaveObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
      notificationsConditionObj,
      notificationsSaveObj,
    });

    // --------------------------------------------------
    //   Set Authority / 非ログインユーザーに時間制限のある編集権限を与える
    // --------------------------------------------------

    if (!loginUsers_id) {
      setAuthority({ req, _id: recruitmentRepliesConditionObj._id });
    }

    // -------------------------------------------------------
    //   新規投稿後または編集後の返信を表示するために、データを取得する
    // -------------------------------------------------------

    returnObj.recruitmentRepliesObj = await ModelRecruitmentReplies.findRepliesForUpsert(
      {
        req,
        localeObj,
        loginUsers_id,
        gameCommunities_id,
        recruitmentThreads_id,
        recruitmentComments_id,
        recruitmentReplies_id,
        commentLimit,
        replyLimit,
      }
    );

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

    if (!recruitmentReplies_id) {
      const experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: [
          {
            type: "recruitment-count-post",
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

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/recruitment-replies/upsert.js
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   recruitmentReplies_id: {green ${recruitmentReplies_id}}
    //   replyToRecruitmentReplies_id: {green ${replyToRecruitmentReplies_id}}
    //   name: {green ${name}}
    //   comment: {green ${comment}}
    //   threadLimit: {green ${threadLimit}}
    //   commentLimit: {green ${commentLimit}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
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
      endpointID: "Xp-NFh_gZ",
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

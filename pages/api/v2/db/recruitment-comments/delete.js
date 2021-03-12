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
import ModelRecruitmentThreads from "app/@database/recruitment-threads/model.js";
import ModelRecruitmentComments from "app/@database/recruitment-comments/model.js";

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

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: RSY182oR_
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

    const { recruitmentComments_id } = bodyObj;

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
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // --------------------------------------------------
    //   データ取得
    //   データが存在しない、編集権限がない場合はエラーが投げられる
    // --------------------------------------------------

    const docObj = await ModelRecruitmentComments.findForDelete({
      req,
      localeObj,
      loginUsers_id,
      recruitmentComments_id,
      type: "delete",
    });

    const users_id = lodashGet(docObj, ["users_id"], "");
    const gameCommunities_id = lodashGet(docObj, ["gameCommunities_id"], "");
    const recruitmentThreads_id = lodashGet(
      docObj,
      ["recruitmentThreads_id"],
      ""
    );
    const replies = lodashGet(docObj, ["replies"], 0);
    const imagesAndVideos_idsArr = lodashGet(
      docObj,
      ["imagesAndVideos_idsArr"],
      []
    );
    const images = lodashGet(docObj, ["images"], 0);
    const videos = lodashGet(docObj, ["videos"], 0);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/recruitment-comments/delete.js
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   recruitmentComments_id: {green ${recruitmentComments_id}}
    //   threadLimit: {green ${threadLimit}}
    //   commentLimit: {green ${commentLimit}}
    //   replyLimit: {green ${replyLimit}}
    // `);

    // console.log(`
    //   ----- docObj -----\n
    //   ${util.inspect(docObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    // loginUsers_id: {green ${loginUsers_id}}
    // users_id: {green ${users_id}}
    // `);

    // console.log(chalk`
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   replies: {green ${replies}}
    //   images: {green ${images}}
    //   videos: {green ${videos}}
    // `);

    // console.log(`
    //   ----- imagesAndVideos_idsArr -----\n
    //   ${util.inspect(imagesAndVideos_idsArr, { colors: true, depth: null })}\n
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
    //   - recruitment-threads / 更新日時の変更 & コメント数 - 1 & 返信数 - ○○ & 画像数と動画数の変更
    // ---------------------------------------------

    const recruitmentThreadsConditionObj = {
      _id: recruitmentThreads_id,
    };

    let recruitmentThreadsSaveObj = {
      updatedDate: ISO8601,
      $inc: { comments: -1, replies, images, videos },
    };

    // ---------------------------------------------
    //   - publicCommentsUsers_idsArr
    // ---------------------------------------------

    // ログインしている場合
    if (loginUsers_id) {
      const count = await ModelRecruitmentComments.count({
        conditionObj: {
          users_id: loginUsers_id,
        },
      });

      if (count - 1 === 0) {
        const recruitmentThreadsObj = await ModelRecruitmentThreads.findOne({
          conditionObj: {
            _id: recruitmentThreads_id,
          },
        });

        const publicCommentsUsers_idsArr = lodashGet(
          recruitmentThreadsObj,
          ["publicCommentsUsers_idsArr"],
          []
        );

        const arrayIndex = publicCommentsUsers_idsArr.indexOf(loginUsers_id);

        if (arrayIndex !== -1) {
          publicCommentsUsers_idsArr.splice(arrayIndex, 1);
          recruitmentThreadsSaveObj.publicCommentsUsers_idsArr = publicCommentsUsers_idsArr;
        }

        // console.log(chalk`
        //   count: {green ${count}}
        // `);

        // console.log(`
        //   ----- publicCommentsUsers_idsArr -----\n
        //   ${util.inspect(publicCommentsUsers_idsArr, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }
    }

    // ---------------------------------------------
    //   - recruitment-comments / コメント削除
    // ---------------------------------------------

    const recruitmentCommentsConditionObj = {
      _id: recruitmentComments_id,
    };

    // ---------------------------------------------
    //   - recruitment-replies / 返信削除
    // ---------------------------------------------

    const recruitmentRepliesConditionObj = {
      recruitmentComments_id,
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

    await ModelRecruitmentComments.transactionForDelete({
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
      recruitmentCommentsConditionObj,
      recruitmentRepliesConditionObj,
      imagesAndVideosConditionObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
    });

    // ---------------------------------------------
    //   画像を削除する
    // ---------------------------------------------

    for (let value of imagesAndVideos_idsArr.values()) {
      const dirPath = `public/img/recruitment/${value}`;
      // console.log(dirPath);

      rimraf(dirPath, (err) => {
        if (err) {
          throw new CustomError({
            level: "error",
            errorsArr: [{ code: "7eE0VckQr", messageID: "Error" }],
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
      endpointID: "RSY182oR_",
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

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

import rimraf from "rimraf";

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
import ModelForumComments from "app/@database/forum-comments/model.js";

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
import { validationUserCommunities_idAndAuthorityServer } from "app/@database/user-communities/validations/_id-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: cX7sZ1J14
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

    const { userCommunities_id } = bodyObj;

    lodashSet(requestParametersObj, ["userCommunities_id"], userCommunities_id);

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

    // --------------------------------------------------
    //   imagesAndVideos_idsArr
    // --------------------------------------------------

    const userCommunitiesImagesAndVideos_idsArr = [];
    const forumImagesAndVideos_idsArr = [];

    // ---------------------------------------------
    //   - user-communities
    // ---------------------------------------------

    const docUserCommunitiesObj = await ModelUserCommunities.findOne({
      conditionObj: {
        _id: userCommunities_id,
      },
    });

    if (docUserCommunitiesObj.imagesAndVideos_id) {
      userCommunitiesImagesAndVideos_idsArr.push(
        docUserCommunitiesObj.imagesAndVideos_id
      );
    }

    if (docUserCommunitiesObj.imagesAndVideosThumbnail_id) {
      userCommunitiesImagesAndVideos_idsArr.push(
        docUserCommunitiesObj.imagesAndVideosThumbnail_id
      );
    }

    // ---------------------------------------------
    //   - forum-threads
    // ---------------------------------------------

    const docThreadsArr = await ModelForumThreads.find({
      conditionObj: {
        userCommunities_id,
      },
    });

    for (let valueObj of docThreadsArr.values()) {
      if (valueObj.imagesAndVideos_id) {
        forumImagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }
    }

    // ---------------------------------------------
    //   - forum-comments
    // ---------------------------------------------

    const docCommentsArr = await ModelForumComments.find({
      conditionObj: {
        userCommunities_id,
      },
    });

    for (let valueObj of docCommentsArr.values()) {
      if (valueObj.imagesAndVideos_id) {
        forumImagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }
    }

    // --------------------------------------------------
    //   配列を結合する
    // --------------------------------------------------

    const imagesAndVideos_idsArr = userCommunitiesImagesAndVideos_idsArr.concat(
      forumImagesAndVideos_idsArr
    );

    // --------------------------------------------------
    //   Delete
    // --------------------------------------------------

    // ---------------------------------------------
    //   - forum-comments / コメント＆返信
    // ---------------------------------------------

    const forumCommentsConditionObj = {
      userCommunities_id,
    };

    // ---------------------------------------------
    //   - forum-threads
    // ---------------------------------------------

    const forumThreadsConditionObj = {
      userCommunities_id,
    };

    // ---------------------------------------------
    //   - follows
    // ---------------------------------------------

    const followsConditionObj = {
      userCommunities_id,
    };

    // ---------------------------------------------
    //   - images-and-videos
    // ---------------------------------------------

    let imagesAndVideosConditionObj = {};

    if (imagesAndVideos_idsArr.length > 0) {
      imagesAndVideosConditionObj = {
        _id: { $in: imagesAndVideos_idsArr },
      };
    }

    // ---------------------------------------------
    //   - user-communities
    // ---------------------------------------------

    const userCommunitiesConditionObj = {
      _id: userCommunities_id,
    };

    // --------------------------------------------------
    //   DB insert Transaction
    // --------------------------------------------------

    await ModelUserCommunities.transactionForDelete({
      forumCommentsConditionObj,
      forumThreadsConditionObj,
      followsConditionObj,
      imagesAndVideosConditionObj,
      userCommunitiesConditionObj,
    });

    // ---------------------------------------------
    //   画像を削除する
    // ---------------------------------------------

    for (let value of userCommunitiesImagesAndVideos_idsArr.values()) {
      const dirPath = `public/img/uc/${value}`;

      // console.log(chalk`
      //   delete images: {green ${dirPath}}
      // `);

      rimraf(dirPath, (err) => {
        if (err) {
          throw new CustomError({
            level: "error",
            errorsArr: [{ code: "Ki2ln4CnW", messageID: "Error" }],
          });
        }
      });
    }

    for (let value of forumImagesAndVideos_idsArr.values()) {
      const dirPath = `public/img/forum/${value}`;

      // console.log(chalk`
      //   delete images: {green ${dirPath}}
      // `);

      rimraf(dirPath, (err) => {
        if (err) {
          throw new CustomError({
            level: "error",
            errorsArr: [{ code: "RSYocBCDB", messageID: "Error" }],
          });
        }
      });
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/user-communities/delete.js
    // `);

    // console.log(chalk`
    //   userCommunities_id: {green ${userCommunities_id}}
    // `);

    // console.log(`
    //   ----- docUserCommunitiesObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docUserCommunitiesObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docThreadsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docThreadsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docCommentsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docCommentsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideos_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideos_idsArr)), { colors: true, depth: null })}\n
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
      endpointID: "cX7sZ1J14",
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

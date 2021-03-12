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

import ModelUsers from "app/@database/users/model.js";
import ModelCardPlayers from "app/@database/card-players/model.js";
import ModelUserCommunities from "app/@database/user-communities/model.js";
import ModelForumThreads from "app/@database/forum-threads/model.js";
import ModelForumComments from "app/@database/forum-comments/model.js";
// import ModelFollows from 'app/@database/follows/model.js';

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

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: C_SMbjq6W
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
        errorsArr: [{ code: "Or7iiaDm7", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // --------------------------------------------------
    //   DB
    // --------------------------------------------------

    const userCommunities_idsArr = [];

    const usersImagesAndVideos_idsArr = [];
    const userCommunitiesImagesAndVideos_idsArr = [];
    const forumImagesAndVideos_idsArr = [];

    // ---------------------------------------------
    //   - users
    // ---------------------------------------------

    const docUsersObj = await ModelUsers.findOne({
      conditionObj: {
        _id: loginUsers_id,
      },
    });

    const pagesImagesAndVideos_id = lodashGet(
      docUsersObj,
      ["pagesObj", "imagesAndVideos_id"],
      ""
    );

    if (pagesImagesAndVideos_id) {
      usersImagesAndVideos_idsArr.push(pagesImagesAndVideos_id);
    }

    // const webPushes_id = lodashGet(docUsersObj, ['webPushes_id'], '');

    // ---------------------------------------------
    //   - card-players
    // ---------------------------------------------

    const docCardPlayersArr = await ModelCardPlayers.find({
      conditionObj: {
        users_id: loginUsers_id,
      },
    });

    for (let valueObj of docCardPlayersArr.values()) {
      if (valueObj.imagesAndVideos_id) {
        usersImagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }

      if (valueObj.imagesAndVideosThumbnail_id) {
        usersImagesAndVideos_idsArr.push(valueObj.imagesAndVideosThumbnail_id);
      }
    }

    // ---------------------------------------------
    //   - user-communities
    // ---------------------------------------------

    const docUserCommunitiesArr = await ModelUserCommunities.find({
      conditionObj: {
        users_id: loginUsers_id,
      },
    });

    for (let valueObj of docUserCommunitiesArr.values()) {
      userCommunities_idsArr.push(valueObj._id);

      if (valueObj.imagesAndVideos_id) {
        userCommunitiesImagesAndVideos_idsArr.push(valueObj.imagesAndVideos_id);
      }

      if (valueObj.imagesAndVideosThumbnail_id) {
        userCommunitiesImagesAndVideos_idsArr.push(
          valueObj.imagesAndVideosThumbnail_id
        );
      }
    }

    // ---------------------------------------------
    //   - forum-threads
    // ---------------------------------------------

    const docThreadsArr = await ModelForumThreads.find({
      conditionObj: {
        userCommunities_id: { $in: userCommunities_idsArr },
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
        userCommunities_id: { $in: userCommunities_idsArr },
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

    const imagesAndVideos_idsArr = usersImagesAndVideos_idsArr.concat(
      userCommunitiesImagesAndVideos_idsArr,
      forumImagesAndVideos_idsArr
    );

    // --------------------------------------------------
    //   Delete
    // --------------------------------------------------

    // ---------------------------------------------
    //   - users
    // ---------------------------------------------

    const usersConditionObj = {
      _id: loginUsers_id,
    };

    // ---------------------------------------------
    //   - card-players
    // ---------------------------------------------

    const cardPlayersConditionObj = {
      users_id: loginUsers_id,
    };

    // ---------------------------------------------
    //   - experiences
    // ---------------------------------------------

    const experiencesConditionObj = {
      users_id: loginUsers_id,
    };

    // ---------------------------------------------
    //   - follows
    // ---------------------------------------------

    const followsConditionObj = {
      $or: [
        { users_id: loginUsers_id },
        { userCommunities_id: { $in: userCommunities_idsArr } },
      ],
    };

    // ---------------------------------------------
    //   - forum-comments / コメント＆返信
    // ---------------------------------------------

    const forumCommentsConditionObj = {
      userCommunities_id: { $in: userCommunities_idsArr },
    };

    // ---------------------------------------------
    //   - forum-threads
    // ---------------------------------------------

    const forumThreadsConditionObj = {
      userCommunities_id: { $in: userCommunities_idsArr },
    };

    // ---------------------------------------------
    //   - ids
    // ---------------------------------------------

    const idsConditionObj = {
      users_id: loginUsers_id,
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
      _id: { $in: userCommunities_idsArr },
    };

    // ---------------------------------------------
    //   - web-pushes
    // ---------------------------------------------

    const webPushesConditionObj = {
      users_id: loginUsers_id,
    };

    // const docFollowsObj = await ModelFollows.find({

    //   conditionObj: followsConditionObj

    // });

    // console.log(`
    //   ----- docFollowsObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docFollowsObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   DB insert Transaction
    // --------------------------------------------------

    await ModelUsers.transactionForDelete({
      usersConditionObj,
      cardPlayersConditionObj,
      experiencesConditionObj,
      followsConditionObj,
      forumCommentsConditionObj,
      forumThreadsConditionObj,
      idsConditionObj,
      imagesAndVideosConditionObj,
      userCommunitiesConditionObj,
      webPushesConditionObj,
    });

    // ---------------------------------------------
    //   画像を削除する
    // ---------------------------------------------

    for (let value of usersImagesAndVideos_idsArr.values()) {
      const dirPath = `public/img/ur/${value}`;

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

    // ---------------------------------------------
    //   Logout
    // ---------------------------------------------

    req.logout();

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/users/delete-setting-account.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   webPushes_id: {green ${webPushes_id}}
    // `);

    // console.log(`
    //   ----- docUsersObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docUsersObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docUserCommunitiesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(docUserCommunitiesArr)), { colors: true, depth: null })}\n
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
      endpointID: "C_SMbjq6W",
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

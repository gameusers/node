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

import ModelUserCommunities from "app/@database/user-communities/model";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { formatAndSave } from "app/@modules/image/save.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import { validationBoolean } from "app/@validations/boolean.js";

import { validationUserCommunities_idServer } from "app/@database/user-communities/validations/_id-server.js";
import { validationUserCommunitiesName } from "app/@database/user-communities/validations/name.js";
import { validationUserCommunitiesDescription } from "app/@database/user-communities/validations/description.js";
import { validationUserCommunitiesDescriptionShort } from "app/@database/user-communities/validations/description-short.js";
import { validationUserCommunitiesUserCommunityIDServer } from "app/@database/user-communities/validations/user-community-id-server.js";
import { validationUserCommunitiesCommunityType } from "app/@database/user-communities/validations/community-type.js";
import { validationGameCommunities_idsArrServer } from "app/@database/game-communities/validations/_id-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: _3Qu8jodI
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
      name,
      description,
      descriptionShort,
      userCommunityID,
      gamesArr,
      communityType,
      approval,
      anonymity,
      imagesAndVideosObj,
      imagesAndVideosThumbnailObj,
    } = bodyObj;

    // --------------------------------------------------
    //   Log Data
    // --------------------------------------------------

    lodashSet(requestParametersObj, ["userCommunities_id"], userCommunities_id);
    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["description"], description);
    lodashSet(requestParametersObj, ["descriptionShort"], descriptionShort);
    lodashSet(requestParametersObj, ["userCommunityID"], userCommunityID);
    lodashSet(requestParametersObj, ["gamesArr"], gamesArr);
    lodashSet(requestParametersObj, ["communityType"], communityType);
    lodashSet(requestParametersObj, ["approval"], approval);
    lodashSet(requestParametersObj, ["anonymity"], anonymity);

    // --------------------------------------------------
    //   Verify CSRF
    // --------------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Login Check
    // --------------------------------------------------

    if (!req.isAuthenticated()) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "fG0jzFl5Y", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   gameCommunities_idsArr
    // --------------------------------------------------

    const gameCommunities_idsArr = [];

    for (let valueObj of gamesArr.values()) {
      gameCommunities_idsArr.push(valueObj.gameCommunities_id);
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    if (userCommunities_id) {
      await validationUserCommunities_idServer({ value: userCommunities_id });
    }

    await validationUserCommunitiesName({ throwError: true, value: name });
    await validationUserCommunitiesDescription({
      throwError: true,
      value: description,
    });
    await validationUserCommunitiesDescriptionShort({
      throwError: true,
      value: descriptionShort,
    });
    await validationUserCommunitiesUserCommunityIDServer({
      value: userCommunityID,
      loginUsers_id,
    });
    await validationGameCommunities_idsArrServer({
      required: true,
      arr: gameCommunities_idsArr,
    });
    await validationUserCommunitiesCommunityType({
      throwError: true,
      value: communityType,
    });
    await validationBoolean({ throwError: true, value: approval });
    await validationBoolean({ throwError: true, value: anonymity });

    // --------------------------------------------------
    //   現在のデータ＆画像・動画
    // --------------------------------------------------

    let oldImagesAndVideosObj = {};
    let oldImagesAndVideosThumbnailObj = {};

    // --------------------------------------------------
    //   更新の場合
    // --------------------------------------------------

    if (userCommunities_id) {
      // --------------------------------------------------
      //   現在のデータ取得
      // --------------------------------------------------

      const userCommunityObj = await ModelUserCommunities.findForUserCommunitySettings(
        { localeObj, loginUsers_id, userCommunities_id }
      );

      oldImagesAndVideosObj = lodashGet(
        userCommunityObj,
        ["imagesAndVideosObj"],
        {}
      );
      oldImagesAndVideosThumbnailObj = lodashGet(
        userCommunityObj,
        ["imagesAndVideosThumbnailObj"],
        {}
      );

      // --------------------------------------------------
      //   Page Transition
      // --------------------------------------------------

      if (userCommunityObj.userCommunityID !== userCommunityID) {
        returnObj.pageTransition = true;
      }
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   画像を保存する - Top 画像
    // --------------------------------------------------

    let imagesAndVideosConditionObj = {};
    let imagesAndVideosSaveObj = {};
    let imagesAndVideos_id = "";

    if (imagesAndVideosObj) {
      const formatAndSaveObj = await formatAndSave({
        newObj: imagesAndVideosObj,
        oldObj: oldImagesAndVideosObj,
        loginUsers_id,
        ISO8601,
        heroImage: true,
      });

      imagesAndVideosSaveObj = lodashGet(
        formatAndSaveObj,
        ["imagesAndVideosObj"],
        {}
      );

      // 画像＆動画がすべて削除されている場合は、imagesAndVideos_idを空にする
      const arr = lodashGet(imagesAndVideosSaveObj, ["arr"], []);

      if (arr.length === 0) {
        imagesAndVideos_id = "";
      } else {
        imagesAndVideos_id = lodashGet(imagesAndVideosSaveObj, ["_id"], "");
      }

      imagesAndVideosConditionObj = {
        _id: lodashGet(imagesAndVideosSaveObj, ["_id"], ""),
      };
    }

    // --------------------------------------------------
    //   画像を保存する - サムネイル画像
    // --------------------------------------------------

    let imagesAndVideosThumbnailConditionObj = {};
    let imagesAndVideosThumbnailSaveObj = {};
    let imagesAndVideosThumbnail_id = "";

    if (imagesAndVideosThumbnailObj) {
      const formatAndSaveObj = await formatAndSave({
        newObj: imagesAndVideosThumbnailObj,
        oldObj: oldImagesAndVideosThumbnailObj,
        loginUsers_id,
        ISO8601,
      });

      imagesAndVideosThumbnailSaveObj = lodashGet(
        formatAndSaveObj,
        ["imagesAndVideosObj"],
        {}
      );

      // 画像＆動画がすべて削除されている場合は、imagesAndVideos_idを空にする
      const arr = lodashGet(imagesAndVideosThumbnailSaveObj, ["arr"], []);

      if (arr.length === 0) {
        imagesAndVideosThumbnail_id = "";
      } else {
        imagesAndVideosThumbnail_id = lodashGet(
          imagesAndVideosThumbnailSaveObj,
          ["_id"],
          ""
        );
      }

      imagesAndVideosThumbnailConditionObj = {
        _id: lodashGet(imagesAndVideosThumbnailSaveObj, ["_id"], ""),
      };
    }

    // --------------------------------------------------
    //   Insert
    // --------------------------------------------------

    // ---------------------------------------------
    //   User Communities
    // ---------------------------------------------

    const newUserCommunities_id = shortid.generate();

    let userCommunitiesConditionObj = {
      _id: newUserCommunities_id,
    };

    let userCommunitiesSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      userCommunityID,
      users_id: loginUsers_id,
      localesArr: [
        {
          _id: shortid.generate(),
          language: "ja",
          name,
          description,
          descriptionShort,
        },
      ],
      imagesAndVideos_id,
      imagesAndVideosThumbnail_id,
      gameCommunities_idsArr,
      forumObj: {
        threadCount: 0,
      },
      updatedDateObj: {
        forum: 0,
      },
      communityType,
      anonymity,
    };

    // ---------------------------------------------
    //   Follows
    // ---------------------------------------------

    let followsConditionObj = {
      _id: shortid.generate(),
    };

    let followsSaveObj = {
      updatedDate: ISO8601,
      gameCommunities_id: "",
      userCommunities_id: newUserCommunities_id,
      users_id: "",
      approval: false,
      followArr: [],
      followCount: 0,
      followedArr: [loginUsers_id],
      followedCount: 1,
      approvalArr: [],
      approvalCount: 0,
      blockArr: [],
      blockCount: 0,
    };

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    if (userCommunities_id) {
      // ---------------------------------------------
      //   User Communities
      // ---------------------------------------------

      userCommunitiesConditionObj = {
        _id: userCommunities_id,
      };

      userCommunitiesSaveObj = {
        $set: {
          userCommunityID,
          localesArr: [
            {
              _id: shortid.generate(),
              language: "ja",
              name,
              description,
              descriptionShort,
            },
          ],
          imagesAndVideos_id,
          imagesAndVideosThumbnail_id,
          gameCommunities_idsArr,
          communityType,
          anonymity,
        },
      };

      // ---------------------------------------------
      //   Follows
      // ---------------------------------------------

      followsConditionObj = {
        userCommunities_id,
      };

      followsSaveObj = {
        $set: {
          approval,
        },
      };
    }

    // --------------------------------------------------
    //   DB Insert & Update
    // --------------------------------------------------

    await ModelUserCommunities.transactionForUpsertSettings({
      userCommunitiesConditionObj,
      userCommunitiesSaveObj,
      followsConditionObj,
      followsSaveObj,
      imagesAndVideosConditionObj,
      imagesAndVideosSaveObj,
      imagesAndVideosThumbnailConditionObj,
      imagesAndVideosThumbnailSaveObj,
    });

    // --------------------------------------------------
    //   ヘッダー取得
    // --------------------------------------------------

    returnObj.headerObj = await ModelUserCommunities.findHeader({
      localeObj,
      loginUsers_id,
      userCommunities_id,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/user-communities/upsert-settings.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userCommunities_id: {green ${userCommunities_id}}
    //   name: {green ${name}}
    //   description: {green ${description}}
    //   descriptionShort: {green ${descriptionShort}}
    //   userCommunityID: {green ${userCommunityID}}
    //   communityType: {green ${communityType}}
    //   approval: {green ${approval}} / {green ${typeof approval}}
    //   anonymity: {green ${anonymity}} / {green ${typeof anonymity}}
    // `);

    // console.log(`
    //   ----- gameCommunities_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(gameCommunities_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosThumbnailObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosThumbnailObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunityObj -----\n
    //   ${util.inspect(userCommunityObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- oldImagesAndVideosObj -----\n
    //   ${util.inspect(oldImagesAndVideosObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- oldImagesAndVideosThumbnailObj -----\n
    //   ${util.inspect(oldImagesAndVideosThumbnailObj, { colors: true, depth: null })}\n
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
      endpointID: "_3Qu8jodI",
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

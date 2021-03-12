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

import ModelUsers from "app/@database/users/model.js";
import ModelImagesAndVideos from "app/@database/images-and-videos/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { formatAndSave } from "app/@modules/image/save.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
// import { validationBoolean } from 'app/@validations/boolean.js';

import { validationUsersUserIDServer } from "app/@database/users/validations/user-id-server.js";
import {
  validationUsersPagesType,
  validationUsersPagesTitle,
  validationUsersPagesLanguage,
} from "app/@database/users/validations/pages.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: 0qiGkIA99
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
  const experienceCalculateArr = [];

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
      imagesAndVideosObj,
      userID,
      pagesArr,
      // approval,
    } = bodyObj;

    // --------------------------------------------------
    //   Log Data
    // --------------------------------------------------

    lodashSet(requestParametersObj, ["userID"], userID);
    lodashSet(requestParametersObj, ["pagesArr"], pagesArr);
    // lodashSet(requestParametersObj, ['approval'], approval);
    lodashSet(requestParametersObj, ["imagesAndVideosObj"], {});

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
        errorsArr: [{ code: "V5Ww_uLNM", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationUsersUserIDServer({
      throwError: true,
      value: userID,
      loginUsers_id,
    });
    // await validationBoolean({ throwError: true, value: approval });

    // --------------------------------------------------
    //   Validation / Pages
    // --------------------------------------------------

    const newPagesArr = [];

    for (let valueObj of pagesArr.values()) {
      if (
        !validationUsersPagesType({ value: valueObj.type }).error &&
        !validationUsersPagesTitle({ value: valueObj.title, required: true })
          .error &&
        !validationUsersPagesLanguage({ value: valueObj.language }).error
      ) {
        newPagesArr.push({
          _id: shortid.generate(),
          type: valueObj.type,
          title: valueObj.title,
          language: valueObj.language,
        });
      }
    }

    // --------------------------------------------------
    //   Find One - userID が変更された場合はページを再読み込みする
    // --------------------------------------------------

    const docUsersObj = await ModelUsers.findOne({
      conditionObj: {
        _id: loginUsers_id,
      },
    });

    if (docUsersObj.userID !== userID) {
      returnObj.pageTransition = true;
    }

    // console.log(chalk`
    // userID: {green ${userID}}
    // docUsersObj.userID: {green ${docUsersObj.userID}}
    // `);

    // console.log(`
    //   ----- docUsersObj -----\n
    //   ${util.inspect(docUsersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   experience / user-page-change-url
    // --------------------------------------------------

    if (docUsersObj.userIDInitial !== userID) {
      experienceCalculateArr.push({
        type: "user-page-change-url",
        calculation: "addition",
      });
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   メイン画像を保存する
    // --------------------------------------------------

    let imagesAndVideosConditionObj = {};
    let imagesAndVideosSaveObj = {};
    let imagesAndVideos_id = lodashGet(
      docUsersObj,
      ["pagesObj", "imagesAndVideos_id"],
      ""
    );

    if (imagesAndVideosObj) {
      // --------------------------------------------------
      //   現在の画像データを取得する
      // --------------------------------------------------

      const oldImagesAndVideosObj = await ModelImagesAndVideos.findOne({
        conditionObj: {
          _id: imagesAndVideos_id,
        },
      });

      // --------------------------------------------------
      //   保存する
      // --------------------------------------------------

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

      // --------------------------------------------------
      //   画像＆動画がすべて削除されている場合は、newImagesAndVideos_id を空にする
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

      // --------------------------------------------------
      //   ページを再読み込みする
      // --------------------------------------------------

      const oldImagesAndVideos_id = lodashGet(
        imagesAndVideosSaveObj,
        ["_id"],
        ""
      );

      if (imagesAndVideos_id === oldImagesAndVideos_id) {
        returnObj.pageTransition = true;
      }

      // --------------------------------------------------
      //   experience / user-page-upload-image-main
      // --------------------------------------------------

      experienceCalculateArr.push({
        type: "user-page-upload-image-main",
      });

      // if (imagesAndVideos_id) {

      //   experienceCalculateArr.push({
      //     type: 'user-page-upload-image-main',
      //   });

      // }

      // console.log(chalk`
      // imagesAndVideos_id: {green ${imagesAndVideos_id}}
      // loginUsers_id: {green ${loginUsers_id}}
      // `);

      // console.log(`
      //   ----- imagesAndVideosObj -----\n
      //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- oldImagesAndVideosObj -----\n
      //   ${util.inspect(oldImagesAndVideosObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- imagesAndVideosConditionObj -----\n
      //   ${util.inspect(imagesAndVideosConditionObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- imagesAndVideosSaveObj -----\n
      //   ${util.inspect(imagesAndVideosSaveObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // --------------------------------------------------
    //   Users
    // --------------------------------------------------

    const usersConditionObj = {
      _id: loginUsers_id,
    };

    const usersSaveObj = {
      $set: {
        updatedDate: ISO8601,
        userID,
        pagesObj: {
          imagesAndVideos_id,
          arr: newPagesArr,
        },
      },
    };

    // --------------------------------------------------
    //   Follows / ユーザー承認制をやめたためコメントアウト 2021/3/4
    // --------------------------------------------------

    // const followsConditionObj = {

    //   users_id: loginUsers_id

    // };

    // const followsSaveObj = {

    //   $set: {
    //     approval
    //   }

    // };

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    await ModelUsers.transactionForUpsert({
      usersConditionObj,
      usersSaveObj,
      // followsConditionObj,
      // followsSaveObj,
      imagesAndVideosConditionObj,
      imagesAndVideosSaveObj,
    });

    // --------------------------------------------------
    //   experiences
    // --------------------------------------------------

    let experienceObj = {};

    if (experienceCalculateArr.length > 0) {
      experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: experienceCalculateArr,
      });
    }

    // ---------------------------------------------
    //   - 経験値が増減した場合のみヘッダーを更新する
    // ---------------------------------------------

    if (Object.keys(experienceObj).length !== 0) {
      returnObj.experienceObj = experienceObj;

      const headerObj = await ModelUsers.findHeader({
        localeObj,
        loginUsers_id,
        users_id: loginUsers_id,
      });

      returnObj.headerObj = headerObj;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/users/upsert-setting-pages.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   userID: {green ${userID}}
    // `);

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- pagesArr -----\n
    //   ${util.inspect(pagesArr, { colors: true, depth: null })}\n
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
      endpointID: "0qiGkIA99",
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

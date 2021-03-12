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

import ModelIDs from "app/@database/ids/model.js";

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
import { validationBoolean } from "app/@validations/boolean.js";

import { validationIDs_idServer } from "app/@database/ids/validations/_id-server.js";
import { validationIDsPlatform } from "app/@database/ids/validations/platform.js";
import { validationIDsLabel } from "app/@database/ids/validations/label.js";
import { validationIDsID } from "app/@database/ids/validations/id.js";
import { validationIDsPublicSetting } from "app/@database/ids/validations/public-setting.js";
import { validationGameCommunities_idServer } from "app/@database/game-communities/validations/_id-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: bqaZQRkex
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let returnObj = {};
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
      _id,
      platform,
      gameCommunities_id,
      label,
      id,
      publicSetting,
      search,
    } = bodyObj;

    lodashSet(requestParametersObj, ["_id"], _id);
    lodashSet(requestParametersObj, ["platform"], platform);
    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(requestParametersObj, ["label"], label);
    lodashSet(requestParametersObj, ["id"], id);
    lodashSet(requestParametersObj, ["publicSetting"], publicSetting);
    lodashSet(requestParametersObj, ["search"], search);

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
        errorsArr: [{ code: "_vxAycKLo", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationIDsPlatform({ throwError: true, value: platform });
    await validationIDsLabel({ throwError: true, value: label });
    await validationIDsID({ throwError: true, value: id });
    await validationIDsPublicSetting({
      throwError: true,
      value: publicSetting,
    });
    await validationBoolean({ throwError: true, value: search });

    if (_id) {
      await validationIDs_idServer({ value: _id, loginUsers_id });
    }

    if (gameCommunities_id) {
      await validationGameCommunities_idServer({ value: gameCommunities_id });
    }

    // --------------------------------------------------
    //   Save Object
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    let saveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      users_id: loginUsers_id,
      platform,
      gameCommunities_id: gameCommunities_id || "",
      label: label || "",
      id,
      publicSetting,
      search,
    };

    // --------------------------------------------------
    //   プラットフォームが以下の配列に含まれている場合は、gameCommunities_id は不要なので削除する
    // --------------------------------------------------

    if (
      [
        "PlayStation",
        "Xbox",
        "Nintendo",
        "Steam",
        "Origin",
        "Discord",
        "Skype",
        "ICQ",
        "Line",
      ].indexOf(platform) !== -1
    ) {
      saveObj.gameCommunities_id = "";
    }

    // --------------------------------------------------
    //   保存可能件数のチェック
    //   オーバーしている場合はエラー
    // --------------------------------------------------

    const count = await ModelIDs.count({
      conditionObj: {
        users_id: loginUsers_id,
      },
    });

    if (count > parseInt(process.env.NEXT_PUBLIC_ID_INSERT_LIMIT, 10)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "8XcKQ7hce", messageID: "NRO3Y1hnC" }],
      });
    }

    // --------------------------------------------------
    //   データベースに保存
    // --------------------------------------------------

    let conditionObj = {};

    // ---------------------------------------------
    //   - Update
    // ---------------------------------------------

    if (_id) {
      conditionObj = {
        _id,
      };

      delete saveObj.createdDate;
      delete saveObj.users_id;

      saveObj = {
        $set: saveObj,
      };

      // ---------------------------------------------
      //   - Insert
      // ---------------------------------------------
    } else {
      conditionObj = {
        _id: shortid.generate(),
      };
    }

    await ModelIDs.upsert({
      conditionObj,
      saveObj,
    });

    // --------------------------------------------------
    //   DB find / IDs
    //   ログインしているユーザーの登録IDデータ
    // --------------------------------------------------

    returnObj = await ModelIDs.findBy_Users_idForForm({
      localeObj,
      loginUsers_id,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/ids/upsert.js
    // `);

    // console.log(chalk`
    //   _id: {green ${_id}}
    //   platform: {green ${platform}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   label: {green ${label}}
    //   id: {green ${id}}
    //   publicSetting: {green ${publicSetting}}
    //   search: {green ${search}}
    // `);

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(conditionObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- saveObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(saveObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
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
      endpointID: "bqaZQRkex",
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

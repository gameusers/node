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

import bcrypt from "bcryptjs";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelUsers from "app/@database/users/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import { validationUsersLoginID } from "app/@database/users/validations/login-id.js";
// import { validationUsersLoginIDServer } from 'app/@database/users/validations/login-id-server.js';
import { validationUsersLoginPassword } from "app/@database/users/validations/login-password.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: Jfor6ujRx
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const requestParametersObj = {};
  const loginUsers_id = lodashGet(req, ["user", "_id"], "");
  const loginUsersRole = lodashGet(req, ["user", "role"], "");

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

    const { userID, loginID, loginPassword } = bodyObj;

    lodashSet(requestParametersObj, ["userID"], userID);
    lodashSet(requestParametersObj, ["loginID"], "*****");
    lodashSet(requestParametersObj, ["loginPassword"], "*****");

    // --------------------------------------------------
    //   Administrator Check
    // --------------------------------------------------

    if (loginUsersRole !== "administrator") {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "96usIrIdY", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationUsersLoginID({
      throwError: true,
      required: true,
      value: loginID,
    });
    // await validationUsersLoginIDServer({ value: loginID });
    await validationUsersLoginPassword({
      throwError: true,
      required: true,
      value: loginPassword,
      loginID,
    });

    // --------------------------------------------------
    //   DB find / Users
    // --------------------------------------------------

    const usersObj = await ModelUsers.findOne({
      conditionObj: {
        $or: [{ userID }, { userIDInitial: userID }],
      },
    });

    // ユーザーが存在しない場合はエラー
    if (!usersObj) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "Gq2VpBWU8", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   upsert
    // --------------------------------------------------

    const conditionObj = {
      _id: lodashGet(usersObj, ["_id"], ""),
    };

    const saveObj = {
      $set: {
        loginID,
        loginPassword: bcrypt.hashSync(loginPassword, 10),
      },
    };

    await ModelUsers.upsert({ conditionObj, saveObj });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/administration/index.js
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   loginID: {green ${loginID}}
    //   loginPassword: {green ${loginPassword}}
    // `);

    // console.log(`
    //   ----- usersObj -----\n
    //   ${util.inspect(usersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(conditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- saveObj -----\n
    //   ${util.inspect(saveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Success
    // ---------------------------------------------

    return res.status(200).json({});
  } catch (errorObj) {
    // ---------------------------------------------
    //   Log
    // ---------------------------------------------

    const resultErrorObj = returnErrorsArr({
      errorObj,
      endpointID: "Jfor6ujRx",
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

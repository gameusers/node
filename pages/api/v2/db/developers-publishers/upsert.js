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

import ModelDevelopersPublishers from "app/@database/developers-publishers/model.js";

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
import {
  validationLanguage,
  validationCountry,
} from "app/@validations/language.js";
import { validation_id } from "app/@validations/_id.js";
import { validationKeyword } from "app/@validations/keyword.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: yEWM6Zn0i
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
      editDeveloperPublisherID,
      language,
      country,
      developerPublisherID,
      urlID,
      name,
    } = bodyObj;

    lodashSet(
      requestParametersObj,
      ["editDeveloperPublisherID"],
      editDeveloperPublisherID
    );
    lodashSet(requestParametersObj, ["language"], language);
    lodashSet(requestParametersObj, ["country"], country);
    lodashSet(
      requestParametersObj,
      ["developerPublisherID"],
      developerPublisherID
    );
    lodashSet(requestParametersObj, ["urlID"], urlID);
    lodashSet(requestParametersObj, ["name"], name);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Role
    // --------------------------------------------------

    const role = lodashGet(req, ["user", "role"], "user");
    const administrator = role === "administrator" ? true : false;

    // --------------------------------------------------
    //   Administrator Check
    // --------------------------------------------------

    if (!administrator) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "EacibsVQF", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validation_id({ throwError: true, value: editDeveloperPublisherID });
    await validationLanguage({ throwError: true, value: language });
    await validationCountry({ throwError: true, value: country });
    await validation_id({ throwError: true, value: developerPublisherID });
    await validationKeyword({ throwError: true, value: urlID });
    await validationKeyword({ throwError: true, value: name });

    // --------------------------------------------------
    //   新規の場合、同じ名前が登録されていないかチェック
    // --------------------------------------------------

    if (!editDeveloperPublisherID) {
      const count = await ModelDevelopersPublishers.count({
        conditionObj: {
          name,
        },
      });

      // console.log(chalk`
      // count: {green ${count}}
      // `);

      if (count !== 0) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "nHu2qQAkf", messageID: "7B6RuzZGZ" }],
        });
      }
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   Insert
    // --------------------------------------------------

    let conditionObj = {
      _id: shortid.generate(),
    };

    let saveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      language,
      country,
      developerPublisherID,
      urlID,
      name,
    };

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    if (editDeveloperPublisherID) {
      conditionObj = {
        language,
        country,
        developerPublisherID: editDeveloperPublisherID,
      };

      saveObj = {
        updatedDate: ISO8601,
        language,
        country,
        developerPublisherID,
        urlID,
        name,
      };
    }

    // --------------------------------------------------
    //   DB upsert
    // --------------------------------------------------

    await ModelDevelopersPublishers.upsert({
      conditionObj,
      saveObj,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/developers-publishers/upsert.js
    // `);

    // console.log(chalk`
    //   editDeveloperPublisherID: {green ${editDeveloperPublisherID}}
    //   language: {green ${language}}
    //   country: {green ${country}}
    //   developerPublisherID: {green ${developerPublisherID}}
    //   urlID: {green ${urlID}}
    //   name: {green ${name}}
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

    return res.status(200).json(returnObj);
  } catch (errorObj) {
    // ---------------------------------------------
    //   Log
    // ---------------------------------------------

    const resultErrorObj = returnErrorsArr({
      errorObj,
      endpointID: "yEWM6Zn0i",
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

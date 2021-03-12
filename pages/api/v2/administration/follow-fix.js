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
import shortid from "shortid";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import SchemaFollows from "app/@database/follows/schema.js";
import ModelFollows from "app/@database/follows/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

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
//   endpointID: kwgfR4u_-
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

    // const bodyObj = JSON.parse(req.body);

    // const {

    //   userID,
    //   loginID,
    //   loginPassword,

    // } = bodyObj;

    // lodashSet(requestParametersObj, ['userID'], userID);
    // lodashSet(requestParametersObj, ['loginID'], '*****');
    // lodashSet(requestParametersObj, ['loginPassword'], '*****');

    // --------------------------------------------------
    //   Administrator Check
    // --------------------------------------------------

    if (loginUsersRole !== "administrator") {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "-cSYb7i-y", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   DB / Follows
    // --------------------------------------------------

    const conditionObj = {
      userCommunities_id: { $exists: false },
      approval: { $exists: false },
    };

    const docArr = await SchemaFollows.find(conditionObj);

    // ---------------------------------------------
    //   Save Array
    // ---------------------------------------------

    const saveArr = [];

    for (let valueObj of docArr.values()) {
      const _id = shortid.generate();
      const updatedDate = lodashGet(valueObj, ["updatedDate"], ISO8601);
      const gameCommunities_id = lodashGet(
        valueObj,
        ["gameCommunities_id"],
        ""
      );
      const userCommunities_id = lodashGet(
        valueObj,
        ["userCommunities_id"],
        ""
      );
      const users_id = lodashGet(valueObj, ["users_id"], "");
      const approval = lodashGet(valueObj, ["approval"], false);
      const followArr = lodashGet(valueObj, ["followArr"], []);
      const followedArr = lodashGet(valueObj, ["followedArr"], []);
      const approvalArr = lodashGet(valueObj, ["approvalArr"], []);
      const blockArr = lodashGet(valueObj, ["blockArr"], []);

      saveArr.push({
        _id,
        updatedDate,
        gameCommunities_id,
        userCommunities_id,
        users_id,
        approval,
        followArr,
        followCount: followArr.length,
        followedArr,
        followedCount: followedArr.length,
        approvalArr,
        approvalCount: approvalArr.length,
        blockArr,
        blockCount: blockArr.length,
      });
    }

    // --------------------------------------------------
    //   Delete & Insert
    // --------------------------------------------------

    await ModelFollows.deleteMany({ conditionObj });
    await ModelFollows.insertMany({ saveArr });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/administration/follow-fix.js
    // `);

    // console.log(chalk`
    // docArr.length: {green ${docArr.length}}
    // `);

    // console.log(`
    //   ----- docArr -----\n
    //   ${util.inspect(docArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(conditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- saveArr -----\n
    //   ${util.inspect(saveArr, { colors: true, depth: null })}\n
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
      endpointID: "kwgfR4u_-",
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

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

// import moment from 'moment';

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// ---------------------------------------------
//   API
// ---------------------------------------------

import { initialProps } from "app/@api/v2/common.js";

// --------------------------------------------------
//   endpointID: h9TUU6Doa
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
    //   GET Data
    // --------------------------------------------------

    // const urlID = lodashGet(req, ['query', 'urlID'], '');
    // const forumID = lodashGet(req, ['query', 'forumID'], '');
    // const threadListPage = parseInt(lodashGet(req, ['query', 'threadListPage'], 1), 10);
    // const threadListLimit = parseInt(lodashGet(req, ['query', 'threadListLimit'], ''), 10);
    // const threadPage = parseInt(lodashGet(req, ['query', 'threadPage'], 1), 10);
    // const threadLimit = parseInt(lodashGet(req, ['query', 'threadLimit'], ''), 10);
    // const commentLimit = parseInt(lodashGet(req, ['query', 'commentLimit'], ''), 10);
    // const replyLimit = parseInt(lodashGet(req, ['query', 'replyLimit'], ''), 10);

    // lodashSet(requestParametersObj, ['urlID'], urlID);
    // lodashSet(requestParametersObj, ['forumID'], forumID);
    // lodashSet(requestParametersObj, ['threadListPage'], threadListPage);
    // lodashSet(requestParametersObj, ['threadListLimit'], threadListLimit);
    // lodashSet(requestParametersObj, ['threadPage'], threadPage);
    // lodashSet(requestParametersObj, ['threadLimit'], threadLimit);
    // lodashSet(requestParametersObj, ['commentLimit'], commentLimit);
    // lodashSet(requestParametersObj, ['replyLimit'], replyLimit);

    // --------------------------------------------------
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj });

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

    // console.log(chalk`
    // moment('2021-02-02').utc(): {green ${moment('2021-02-02').utc().toISOString()}}
    // moment('2021-02-02'): {green ${moment('2021-02-02').toISOString()}}
    // moment.utc('2021-02-02'): {green ${moment.utc('2021-02-02').toISOString()}}
    // `);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/administration/index.js
    // `);

    // console.log(chalk`
    //   urlID: {green ${urlID}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
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
      endpointID: "h9TUU6Doa",
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

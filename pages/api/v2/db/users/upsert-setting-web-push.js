// --------------------------------------------------
//   Require
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

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { sendNotifications } from "app/@modules/web-push.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip";
import {
  validationWebPushesSubscriptionObjEndpointServer,
  validationWebPushesSubscriptionObjKeysP256dhServer,
  validationWebPushesSubscriptionObjKeysAuthServer,
} from "app/@database/web-pushes/validations/subscription-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: uVdh-Q9Y9
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

    const { subscriptionObj } = bodyObj;

    // --------------------------------------------------
    //   Log Data
    // --------------------------------------------------

    lodashSet(
      requestParametersObj,
      ["subscriptionObj"],
      subscriptionObj ? "******" : {}
    );

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
        errorsArr: [{ code: "R_M1YZU-c", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const endpoint = lodashGet(subscriptionObj, ["endpoint"], "");
    const p256dh = lodashGet(subscriptionObj, ["keys", "p256dh"], "");
    const auth = lodashGet(subscriptionObj, ["keys", "auth"], "");

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationWebPushesSubscriptionObjEndpointServer({
      required: true,
      value: endpoint,
    });
    await validationWebPushesSubscriptionObjKeysP256dhServer({
      required: true,
      value: p256dh,
    });
    await validationWebPushesSubscriptionObjKeysAuthServer({
      required: true,
      value: auth,
    });

    // --------------------------------------------------
    //   webPushSubscriptionObj
    // --------------------------------------------------

    const webPushSubscriptionObj = {
      endpoint,
      keys: {
        p256dh,
        auth,
      },
    };

    // ---------------------------------------------
    //   webPushes_id
    // ---------------------------------------------

    const docUsersObj = await ModelUsers.findOne({
      conditionObj: {
        _id: loginUsers_id,
      },
    });

    const webPushes_id = docUsersObj.webPushes_id || shortid.generate();

    // --------------------------------------------------
    //   Upsert
    // --------------------------------------------------

    // ---------------------------------------------
    //   - Datetime
    // ---------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // ---------------------------------------------
    //   - users
    // ---------------------------------------------

    const usersConditionObj = {
      _id: loginUsers_id,
    };

    const usersSaveObj = {
      $set: {
        webPushes_id,
      },
    };

    // ---------------------------------------------
    //   - web-pushes
    // ---------------------------------------------

    const webPushesConditionObj = {
      _id: webPushes_id,
    };

    const webPushesSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      sendDate: "",
      users_id: loginUsers_id,
      subscriptionObj: webPushSubscriptionObj,
      sendTotalCount: 0,
      sendTodayCount: 0,
      errorCount: 0,
    };

    // ---------------------------------------------
    //   - transaction
    // ---------------------------------------------

    await ModelUsers.transactionForUpsert({
      usersConditionObj,
      usersSaveObj,
      webPushesConditionObj,
      webPushesSaveObj,
    });

    // --------------------------------------------------
    //   確認用の通知送信
    // --------------------------------------------------

    const arr = [
      {
        subscriptionObj: webPushSubscriptionObj,
        title: "Game Users",
        body: "通知を許可しました",
        icon: "/img/common/icons/icon-128x128.png",
        tag: "web-push-subscription",
        url: "",
        TTL: 120,
      },
    ];

    sendNotifications({ arr });

    // --------------------------------------------------
    //   experience
    // --------------------------------------------------

    const experienceObj = await experienceCalculate({
      req,
      localeObj,
      loginUsers_id,
      arr: [
        {
          type: "web-push-permission",
        },
      ],
    });

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
    //   /pages/api/v2/db/users/upsert-setting-web-push.js
    // `);

    // console.log(`
    //   ----- subscriptionObj -----\n
    //   ${util.inspect(subscriptionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   webPushes_id: {green ${webPushes_id}}
    // `);

    // console.log(`
    //   ----- docUsersObj -----\n
    //   ${util.inspect(docUsersObj, { colors: true, depth: null })}\n
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

    return res.status(200).json(returnObj);
  } catch (errorObj) {
    // ---------------------------------------------
    //   Log
    // ---------------------------------------------

    const resultErrorObj = returnErrorsArr({
      errorObj,
      endpointID: "uVdh-Q9Y9",
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

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

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelFollows from "app/@database/follows/model.js";
import ModelCardPlayers from "app/@database/card-players/model.js";
import ModelUsers from "app/@database/users/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

import { validationUsers_idServer } from "app/@database/users/validations/_id-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: q4zqhmELq
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

    const { users_id, updateHeader } = bodyObj;

    // --------------------------------------------------
    //   Log Data
    // --------------------------------------------------

    lodashSet(requestParametersObj, ["users_id"], users_id);

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
        errorsArr: [{ code: "PqgFA9jl8", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationUsers_idServer({ throwError: true, value: users_id });

    // --------------------------------------------------
    //   自分自身を操作しようとした場合はエラー
    // --------------------------------------------------

    if (users_id === loginUsers_id) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "1dW7m8DUI", messageID: "qnWsuPcrJ" }],
      });
    }

    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();
    let calculation = "";

    // --------------------------------------------------
    //   データ取得
    // --------------------------------------------------

    const followsCondition1Obj = {
      users_id,
    };

    const resultObj = await ModelFollows.findOne({
      conditionObj: followsCondition1Obj,
    });

    const followsCondition2Obj = {
      users_id: loginUsers_id,
    };

    const resultSelfObj = await ModelFollows.findOne({
      conditionObj: followsCondition2Obj,
    });

    // console.log(`
    //   ----- resultObj -----\n
    //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- resultSelfObj -----\n
    //   ${util.inspect(resultSelfObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   メンバーの追加、削除
    // --------------------------------------------------

    let followedArr = lodashGet(resultObj, ["followedArr"], []);
    let followedCount = lodashGet(resultObj, ["followedCount"], 1);
    let approvalArr = lodashGet(resultObj, ["approvalArr"], []);
    let approvalCount = lodashGet(resultObj, ["approvalCount"], 0);
    const blockArr = lodashGet(resultObj, ["blockArr"], []);

    // const approval = lodashGet(resultObj, ['approval'], false);

    let followSelfArr = lodashGet(resultSelfObj, ["followArr"], []);
    let followSelfCount = lodashGet(resultSelfObj, ["followCount"], 1);

    // ---------------------------------------------
    //   - ブロックされている場合はエラー
    // ---------------------------------------------

    if (blockArr.includes(loginUsers_id)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "LOfGkiv9b", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   - 承認制
    // ---------------------------------------------

    // if (approval && followedArr.includes(loginUsers_id) === false) {

    //   // ---------------------------------------------
    //   //   フォロー申請取り消し
    //   //   承認申請がすでに行われている場合は、配列から削除する
    //   // ---------------------------------------------
    //   //
    //   if (approvalArr.includes(loginUsers_id)) {

    //     approvalArr = approvalArr.filter(value => value !== loginUsers_id);
    //     returnObj.followApproval = false;

    //   // ---------------------------------------------
    //   //   フォロー申請
    //   //   承認申請がまだ行われていない場合は、配列に追加する
    //   // ---------------------------------------------

    //   } else {

    //     approvalArr.push(loginUsers_id);
    //     returnObj.followApproval = true;

    //   }

    //   approvalCount = approvalArr.length;

    // // ---------------------------------------------
    // //   - 誰でも参加できる
    // // ---------------------------------------------

    // } else {

    //   // ---------------------------------------------
    //   //   フォロー解除
    //   //   すでにメンバーである場合は、配列から削除する
    //   // ---------------------------------------------

    //   if (followedArr.includes(loginUsers_id)) {

    //     // ---------------------------------------------
    //     //   相手 / フォローされているユーザーの配列から自分の users_id を削除する
    //     // ---------------------------------------------

    //     followedArr = followedArr.filter(value => value !== loginUsers_id);
    //     returnObj.follow = false;

    //     // ---------------------------------------------
    //     //   自分 / フォローしているユーザーの配列から相手の users_id を削除する
    //     // ---------------------------------------------

    //     followSelfArr = followSelfArr.filter(value => value !== users_id);

    //     // ---------------------------------------------
    //     //   経験値減算
    //     // ---------------------------------------------

    //     calculation = 'subtraction';

    //   // ---------------------------------------------
    //   //   フォロー
    //   //   まだメンバーでない場合は、配列に追加する
    //   // ---------------------------------------------

    //   } else {

    //     // ---------------------------------------------
    //     //   相手 / フォローされているユーザーの配列に自分の users_id を追加する
    //     // ---------------------------------------------

    //     followedArr.push(loginUsers_id);
    //     returnObj.follow = true;

    //     // ---------------------------------------------
    //     //   自分 / フォローしているユーザーの配列に相手の users_id を追加する
    //     // ---------------------------------------------

    //     followSelfArr.push(users_id);

    //     // ---------------------------------------------
    //     //   経験値加算
    //     // ---------------------------------------------

    //     calculation = 'addition';

    //   }

    //   // 相手
    //   followedCount = followedArr.length;
    //   returnObj.followedCount = followedCount;

    //   // 自分
    //   followSelfCount = followSelfArr.length;

    // }

    // ---------------------------------------------
    //   フォロー解除
    //   すでにメンバーである場合は、配列から削除する
    // ---------------------------------------------

    if (followedArr.includes(loginUsers_id)) {
      // ---------------------------------------------
      //   相手 / フォローされているユーザーの配列から自分の users_id を削除する
      // ---------------------------------------------

      followedArr = followedArr.filter((value) => value !== loginUsers_id);
      returnObj.follow = false;

      // ---------------------------------------------
      //   自分 / フォローしているユーザーの配列から相手の users_id を削除する
      // ---------------------------------------------

      followSelfArr = followSelfArr.filter((value) => value !== users_id);

      // ---------------------------------------------
      //   経験値減算
      // ---------------------------------------------

      calculation = "subtraction";

      // ---------------------------------------------
      //   フォロー
      //   まだメンバーでない場合は、配列に追加する
      // ---------------------------------------------
    } else {
      // ---------------------------------------------
      //   相手 / フォローされているユーザーの配列に自分の users_id を追加する
      // ---------------------------------------------

      followedArr.push(loginUsers_id);
      returnObj.follow = true;

      // ---------------------------------------------
      //   自分 / フォローしているユーザーの配列に相手の users_id を追加する
      // ---------------------------------------------

      followSelfArr.push(users_id);

      // ---------------------------------------------
      //   経験値加算
      // ---------------------------------------------

      calculation = "addition";
    }

    // 相手
    followedCount = followedArr.length;
    returnObj.followedCount = followedCount;

    // 自分
    followSelfCount = followSelfArr.length;

    // --------------------------------------------------
    //   Save Object
    // --------------------------------------------------

    const followsSave1Obj = {
      $set: {
        followedArr,
        followedCount,
        approvalArr,
        approvalCount,
        blockArr,
        updatedDate: ISO8601,
      },
    };

    const followsSave2Obj = {
      $set: {
        followArr: followSelfArr,
        followCount: followSelfCount,
        updatedDate: ISO8601,
      },
    };

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    await ModelFollows.transactionForUpsert({
      followsCondition1Obj,
      followsSave1Obj,
      followsCondition2Obj,
      followsSave2Obj,
    });

    // --------------------------------------------------
    //   DB card-players cardPlayers_id を取得する
    // --------------------------------------------------

    returnObj.cardPlayers_idsArr = [];

    const docCardPlayersArr = await ModelCardPlayers.find({
      conditionObj: {
        users_id,
      },
    });

    for (let valueObj of docCardPlayersArr.values()) {
      returnObj.cardPlayers_idsArr.push(valueObj._id);
    }

    // --------------------------------------------------
    //   experience
    // --------------------------------------------------

    if (calculation) {
      // ---------------------------------------------
      //   - 自分のフォロー
      // ---------------------------------------------

      const experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: [
          {
            type: "follow-count",
            calculation,
          },
        ],
      });

      if (Object.keys(experienceObj).length !== 0) {
        returnObj.experienceObj = experienceObj;
      }

      // ---------------------------------------------
      //   - フォローされた相手
      // ---------------------------------------------

      await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        targetUsers_id: users_id,
        arr: [
          {
            type: "followed-count",
            calculation,
          },
        ],
      });
    }

    // ---------------------------------------------
    //   フォロー相手のヘッダーを取得する
    // ---------------------------------------------

    if (updateHeader) {
      const headerObj = await ModelUsers.findHeader({
        localeObj,
        loginUsers_id,
        users_id,
      });

      returnObj.headerObj = headerObj;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/follows/upsert-follow-ur.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   users_id: {green ${users_id}}
    // `);

    // console.log(`
    //   ----- followsCondition1Obj -----\n
    //   ${util.inspect(followsCondition1Obj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsSave1Obj -----\n
    //   ${util.inspect(followsSave1Obj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsCondition2Obj -----\n
    //   ${util.inspect(followsCondition2Obj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsSave2Obj -----\n
    //   ${util.inspect(followsSave2Obj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docCardPlayersArr -----\n
    //   ${util.inspect(docCardPlayersArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj.cardPlayers_idsArr -----\n
    //   ${util.inspect(returnObj.cardPlayers_idsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- resultObj -----\n
    //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
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
      endpointID: "q4zqhmELq",
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

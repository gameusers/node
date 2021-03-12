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
import { validationManageFollowersType } from "app/@database/follows/validations/manage-followers-type.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: F_U9YxzJx
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

    const { targetUsers_id, type } = bodyObj;

    lodashSet(requestParametersObj, ["targetUsers_id"], targetUsers_id);
    lodashSet(requestParametersObj, ["type"], type);

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
        errorsArr: [{ code: "19fl8iCK5", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationUsers_idServer({ throwError: true, value: targetUsers_id });
    await validationManageFollowersType({
      throwError: true,
      required: true,
      value: type,
    });

    // --------------------------------------------------
    //   管理者が管理者自身を操作しようとした場合はエラー
    // --------------------------------------------------

    if (targetUsers_id === loginUsers_id) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "OfYk9neNl", messageID: "qnWsuPcrJ" }],
      });
    }

    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    let calculation = "";

    // --------------------------------------------------
    //   データ取得 - follows
    // --------------------------------------------------

    const followsCondition1Obj = {
      users_id: loginUsers_id,
    };

    const docFollowsSelfObj = await ModelFollows.findOne({
      conditionObj: followsCondition1Obj,
    });

    const followsCondition2Obj = {
      users_id: targetUsers_id,
    };

    const docFollowsTargetObj = await ModelFollows.findOne({
      conditionObj: followsCondition2Obj,
    });

    // --------------------------------------------------
    //   メンバーの追加、削除
    // --------------------------------------------------

    const selfObj = {
      followArr: lodashGet(docFollowsSelfObj, ["followArr"], []),
      followCount: lodashGet(docFollowsSelfObj, ["followCount"], 0),
      followedArr: lodashGet(docFollowsSelfObj, ["followedArr"], []),
      followedCount: lodashGet(docFollowsSelfObj, ["followedCount"], 0),
      approvalArr: lodashGet(docFollowsSelfObj, ["approvalArr"], []),
      approvalCount: lodashGet(docFollowsSelfObj, ["approvalCount"], 0),
      blockArr: lodashGet(docFollowsSelfObj, ["blockArr"], []),
      blockCount: lodashGet(docFollowsSelfObj, ["blockCount"], 0),
    };

    const targetObj = {
      followArr: lodashGet(docFollowsTargetObj, ["followArr"], []),
      followCount: lodashGet(docFollowsTargetObj, ["followCount"], 0),
      followedArr: lodashGet(docFollowsTargetObj, ["followedArr"], []),
      followedCount: lodashGet(docFollowsTargetObj, ["followedCount"], 0),
      approvalArr: lodashGet(docFollowsTargetObj, ["approvalArr"], []),
      approvalCount: lodashGet(docFollowsTargetObj, ["approvalCount"], 0),
      blockArr: lodashGet(docFollowsTargetObj, ["blockArr"], []),
      blockCount: lodashGet(docFollowsTargetObj, ["blockCount"], 0),
    };

    // --------------------------------------------------
    //   フォロー解除
    // --------------------------------------------------

    if (type === "unfollow") {
      if (
        selfObj.followArr.includes(targetUsers_id) &&
        targetObj.followedArr.includes(loginUsers_id)
      ) {
        // ---------------------------------------------
        //   自分 / フォローしているユーザーの配列から相手の users_id を削除する
        // ---------------------------------------------

        selfObj.followArr = selfObj.followArr.filter(
          (value) => value !== targetUsers_id
        );
        selfObj.followCount = selfObj.followArr.length;

        // ---------------------------------------------
        //   相手 / フォローされているユーザーの配列から自分の users_id を削除する
        // ---------------------------------------------

        targetObj.followedArr = targetObj.followedArr.filter(
          (value) => value !== loginUsers_id
        );
        targetObj.followedCount = targetObj.followedArr.length;

        // ---------------------------------------------
        //   経験値減算
        // ---------------------------------------------

        calculation = "subtraction";
      }

      // --------------------------------------------------
      //   フォロー承認
      // --------------------------------------------------
    } else if (type === "approval") {
      if (selfObj.approvalArr.includes(targetUsers_id)) {
        // ---------------------------------------------
        //   自分
        //   自分に対してフォローの承認申請をしているユーザーの配列から相手の users_id を削除する
        //   自分をフォローしているユーザーの配列に相手の users_id を追加する
        // ---------------------------------------------

        selfObj.approvalArr = selfObj.approvalArr.filter(
          (value) => value !== targetUsers_id
        );
        selfObj.approvalCount = selfObj.approvalArr.length;
        selfObj.followedCount = selfObj.followedArr.push(targetUsers_id);

        // ---------------------------------------------
        //   相手
        //   相手がフォローしているユーザーの配列に自分の users_id を追加する
        // ---------------------------------------------

        targetObj.followCount = targetObj.followArr.push(loginUsers_id);

        // ---------------------------------------------
        //   経験値加算
        // ---------------------------------------------

        calculation = "addition";
      }

      // --------------------------------------------------
      //   フォロー拒否
      // --------------------------------------------------
    } else if (type === "unapproval") {
      if (selfObj.approvalArr.includes(targetUsers_id)) {
        // ---------------------------------------------
        //   自分 / 自分に対してフォローの承認申請をしているユーザーの配列から相手の users_id を削除する
        // ---------------------------------------------

        selfObj.approvalArr = selfObj.approvalArr.filter(
          (value) => value !== targetUsers_id
        );
        selfObj.approvalCount = selfObj.approvalArr.length;
      }

      // --------------------------------------------------
      //   ブロック
      // --------------------------------------------------
    } else if (type === "block") {
      // ---------------------------------------------
      //   経験値減算 - フォローしている相手をブロックする、またはフォローされている相手をブロックする
      // ---------------------------------------------

      if (
        (selfObj.followArr.includes(targetUsers_id) &&
          targetObj.followedArr.includes(loginUsers_id)) ||
        (selfObj.followedArr.includes(targetUsers_id) &&
          targetObj.followArr.includes(loginUsers_id))
      ) {
        calculation = "subtraction";
      }

      // ---------------------------------------------
      //   自分
      //   フォロー、フォロワー、承認配列から相手の users_id を削除する
      //   ブロックしているユーザーの配列に相手の users_id を追加する
      // ---------------------------------------------

      selfObj.followArr = selfObj.followArr.filter(
        (value) => value !== targetUsers_id
      );
      selfObj.followCount = selfObj.followArr.length;
      selfObj.followedArr = selfObj.followedArr.filter(
        (value) => value !== targetUsers_id
      );
      selfObj.followedCount = selfObj.followedArr.length;
      selfObj.approvalArr = selfObj.approvalArr.filter(
        (value) => value !== targetUsers_id
      );
      selfObj.approvalCount = selfObj.approvalArr.length;
      selfObj.blockCount = selfObj.blockArr.push(targetUsers_id);

      // ---------------------------------------------
      //   相手
      //   相手のフォロー、フォロワー、承認配列から自分の users_id を削除する
      // ---------------------------------------------

      targetObj.followArr = targetObj.followArr.filter(
        (value) => value !== loginUsers_id
      );
      targetObj.followCount = targetObj.followArr.length;
      targetObj.followedArr = targetObj.followedArr.filter(
        (value) => value !== loginUsers_id
      );
      targetObj.followedCount = targetObj.followedArr.length;
      targetObj.approvalArr = targetObj.approvalArr.filter(
        (value) => value !== loginUsers_id
      );
      targetObj.approvalCount = targetObj.approvalArr.length;

      // --------------------------------------------------
      //   ブロック解除
      // --------------------------------------------------
    } else if (type === "unblock") {
      if (selfObj.blockArr.includes(targetUsers_id)) {
        // ---------------------------------------------
        //   自分 / ブロックしているユーザーの配列から相手の users_id を削除する
        // ---------------------------------------------

        selfObj.blockArr = selfObj.blockArr.filter(
          (value) => value !== targetUsers_id
        );
        selfObj.blockCount = selfObj.blockArr.length;
      }
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   Save Object
    // --------------------------------------------------

    const followsSave1Obj = {
      $set: {
        followArr: selfObj.followArr,
        followCount: selfObj.followCount,
        followedArr: selfObj.followedArr,
        followedCount: selfObj.followedCount,
        approvalArr: selfObj.approvalArr,
        approvalCount: selfObj.approvalCount,
        blockArr: selfObj.blockArr,
        blockCount: selfObj.blockCount,
        updatedDate: ISO8601,
      },
    };

    const followsSave2Obj = {
      $set: {
        followArr: targetObj.followArr,
        followCount: targetObj.followCount,
        followedArr: targetObj.followedArr,
        followedCount: targetObj.followedCount,
        approvalArr: targetObj.approvalArr,
        approvalCount: targetObj.approvalCount,
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
        targetUsers_id,
        arr: [
          {
            type: "followed-count",
            calculation,
          },
        ],
      });

      // ---------------------------------------------
      //   ヘッダーを取得する
      // ---------------------------------------------

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
    //   /pages/api/v2/db/follows/upsert-manage-followers-ur.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id} / ${typeof loginUsers_id}}
    //   targetUsers_id: {green ${targetUsers_id} / ${typeof targetUsers_id}}
    //   type: {green ${type} / ${typeof type}}
    // `);

    // console.log(`
    //   ----- followsSelfConditionObj -----\n
    //   ${util.inspect(followsSelfConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docFollowsSelfObj -----\n
    //   ${util.inspect(docFollowsSelfObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- followsTargetConditionObj -----\n
    //   ${util.inspect(followsTargetConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docFollowsTargetObj -----\n
    //   ${util.inspect(docFollowsTargetObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- selfObj -----\n
    //   ${util.inspect(selfObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- targetObj -----\n
    //   ${util.inspect(targetObj, { colors: true, depth: null })}\n
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
      endpointID: "F_U9YxzJx",
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

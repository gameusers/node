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
import ModelUserCommunities from "app/@database/user-communities/model.js";

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

import { validationUserCommunities_idServer } from "app/@database/user-communities/validations/_id-server.js";
import { validationUsers_idServer } from "app/@database/users/validations/_id-server.js";
import { validationManageFollowersType } from "app/@database/follows/validations/manage-followers-type.js";

// --------------------------------------------------
//   endpointID: YHBSX4zKR
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

  try {
    // --------------------------------------------------
    //   POST Data
    // --------------------------------------------------

    const bodyObj = JSON.parse(req.body);

    const { userCommunities_id, targetUsers_id, type } = bodyObj;

    // --------------------------------------------------
    //   Log Data
    // --------------------------------------------------

    lodashSet(requestParametersObj, ["userCommunities_id"], userCommunities_id);
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
        errorsArr: [{ code: "zyF4tIxev", messageID: "xLLNIpo6a" }],
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
    await validationUserCommunities_idServer({ value: userCommunities_id });

    // --------------------------------------------------
    //   データ取得 - user-communities
    // --------------------------------------------------

    const docUserCommunitiesObj = await ModelUserCommunities.findOne({
      conditionObj: {
        _id: userCommunities_id,
      },
    });

    const adminUsers_id = lodashGet(docUserCommunitiesObj, ["users_id"], "");

    // --------------------------------------------------
    //   管理権限がない場合はエラー
    // --------------------------------------------------

    if (adminUsers_id !== loginUsers_id) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "prS38d43e", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   管理者が管理者自身を操作しようとした場合はエラー
    // --------------------------------------------------

    if (targetUsers_id === adminUsers_id) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "HA6uOYVxo", messageID: "qnWsuPcrJ" }],
      });
    }

    // --------------------------------------------------
    //   データ取得 - follows
    // --------------------------------------------------

    const conditionObj = {
      userCommunities_id,
    };

    const docFollowsObj = await ModelFollows.findOne({ conditionObj });

    // --------------------------------------------------
    //   メンバーの追加、削除
    // --------------------------------------------------

    let followedArr = lodashGet(docFollowsObj, ["followedArr"], []);
    let followedCount = lodashGet(docFollowsObj, ["followedCount"], 1);
    let approvalArr = lodashGet(docFollowsObj, ["approvalArr"], []);
    let approvalCount = lodashGet(docFollowsObj, ["approvalCount"], 0);
    let blockArr = lodashGet(docFollowsObj, ["blockArr"], []);
    let blockCount = lodashGet(docFollowsObj, ["blockCount"], 0);

    // --------------------------------------------------
    //   退会
    // --------------------------------------------------

    if (type === "unfollow") {
      followedArr = followedArr.filter((value) => value !== targetUsers_id);
      followedCount = followedArr.length;

      // --------------------------------------------------
      //   参加承認
      // --------------------------------------------------
    } else if (type === "approval") {
      followedCount = followedArr.push(targetUsers_id);
      // followedCount = followedArr.length;

      approvalArr = approvalArr.filter((value) => value !== targetUsers_id);
      approvalCount = approvalArr.length;

      // --------------------------------------------------
      //   参加拒否
      // --------------------------------------------------
    } else if (type === "unapproval") {
      approvalArr = approvalArr.filter((value) => value !== targetUsers_id);
      approvalCount = approvalArr.length;

      // --------------------------------------------------
      //   ブロック
      // --------------------------------------------------
    } else if (type === "block") {
      followedArr = followedArr.filter((value) => value !== targetUsers_id);
      followedCount = followedArr.length;

      approvalArr = approvalArr.filter((value) => value !== targetUsers_id);
      approvalCount = approvalArr.length;

      blockCount = blockArr.push(targetUsers_id);
      // blockCount = blockArr.length;

      // --------------------------------------------------
      //   ブロック解除
      // --------------------------------------------------
    } else if (type === "unblock") {
      blockArr = blockArr.filter((value) => value !== targetUsers_id);
      blockCount = blockArr.length;
    }

    // --------------------------------------------------
    //   Save Object
    // --------------------------------------------------

    const saveObj = {
      $set: {
        followedArr,
        followedCount,
        approvalArr,
        approvalCount,
        blockArr,
        blockCount,
        updatedDate: moment().utc().toISOString(),
      },
    };

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    await ModelFollows.upsert({
      conditionObj,
      saveObj,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/follows/upsert-manage-followers-uc.js
    // `);

    // console.log(chalk`
    //   userCommunities_id: {green ${userCommunities_id} / ${typeof userCommunities_id}}
    //   targetUsers_id: {green ${targetUsers_id} / ${typeof targetUsers_id}}
    //   type: {green ${type} / ${typeof type}}
    // `);

    // console.log(`
    //   ----- docFollowsObj -----\n
    //   ${util.inspect(docFollowsObj, { colors: true, depth: null })}\n
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
      endpointID: "YHBSX4zKR",
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

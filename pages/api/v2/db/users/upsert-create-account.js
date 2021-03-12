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

import moment from "moment";
import shortid from "shortid";
import bcrypt from "bcryptjs";

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
import { verifyRecaptcha } from "app/@modules/recaptcha.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { encrypt } from "app/@modules/crypto.js";
import { sendMailConfirmation } from "app/@modules/email.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

import { validationUsersLoginIDServer } from "app/@database/users/validations/login-id-server.js";
import { validationUsersLoginPassword } from "app/@database/users/validations/login-password.js";
import { validationUsersEmailServer } from "app/@database/users/validations/email-server.js";

// --------------------------------------------------
//   endpointID: fmVLqHFfj
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

    const { loginID, loginPassword, email, response } = bodyObj;

    // --------------------------------------------------
    //   Log Data
    // --------------------------------------------------

    lodashSet(requestParametersObj, ["loginID"], loginID ? "******" : "");
    lodashSet(
      requestParametersObj,
      ["loginPassword"],
      loginPassword ? "******" : ""
    );
    lodashSet(requestParametersObj, ["email"], email ? "******" : "");
    lodashSet(requestParametersObj, ["response"], response ? "******" : "");

    // console.log(chalk`
    // loginID: {green ${loginID} typeof ${typeof loginID}}
    // response: {green ${response} typeof ${typeof response}}
    // `);

    // console.log(bodyObj);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // ---------------------------------------------
    //   Verify reCAPTCHA
    // ---------------------------------------------

    await verifyRecaptcha({ response, remoteip: ip });

    // throw new CustomError({ level: 'warn', errorsArr: [{ code: 'Rnt_ekIjT', messageID: 'qnWsuPcrJ' }] });

    // --------------------------------------------------
    //   Login Check / ログイン状態ではアカウントを作成させない
    // --------------------------------------------------

    if (req.isAuthenticated()) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "Pc90koKsJ", messageID: "V9vI1Cl1S" }],
      });
    }

    // --------------------------------------------------
    //   Encrypt E-Mail
    // --------------------------------------------------

    const encryptedEmail = email ? encrypt(email) : "";

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationUsersLoginIDServer({ value: loginID, loginUsers_id });
    await validationUsersLoginPassword({
      throwError: true,
      required: true,
      value: loginPassword,
      loginID,
    });
    await validationUsersEmailServer({
      value: email,
      loginUsers_id,
      encryptedEmail,
    });

    // --------------------------------------------------
    //   Hash Password
    // --------------------------------------------------

    const hashedPassword = bcrypt.hashSync(loginPassword, 10);

    // --------------------------------------------------
    //   Insert
    // --------------------------------------------------

    // ---------------------------------------------
    //   -
    // ---------------------------------------------

    const ISO8601 = moment().utc().toISOString();
    const users_id = shortid.generate();
    const userID = shortid.generate();
    const emailConfirmationID = `${shortid.generate()}${shortid.generate()}${shortid.generate()}`;

    // ---------------------------------------------
    //   - users
    // ---------------------------------------------

    const usersConditionObj = {
      _id: users_id,
    };

    const usersSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      accessDate: ISO8601,
      userID,
      userIDInitial: shortid.generate(),
      pagesObj: {
        imagesAndVideos_id: "",
        arr: [],
      },
      loginID,
      loginPassword: hashedPassword,
      emailObj: {
        value: encryptedEmail,
        confirmation: false,
      },
      acceptLanguage,
      countriesArr: ["JP"],
      termsOfServiceAgreedVersion:
        process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_VERSION,
      webPushes_id: "",
      role: "user",
    };

    // ---------------------------------------------
    //   - card-players
    // ---------------------------------------------

    const cardPlayersConditionObj = {
      _id: shortid.generate(),
    };

    const cardPlayersSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      users_id,
      language: "ja",
      name: "Name",
      status: "Status",
      imagesAndVideos_id: "",
      imagesAndVideosThumbnail_id: "",
      comment: "",
      age: "",
      ageAlternativeText: "",
      sex: "",
      sexAlternativeText: "",
      address: "",
      addressAlternativeText: "",
      gamingExperience: "",
      gamingExperienceAlternativeText: "",
      hobbiesArr: [],
      specialSkillsArr: [],
      smartphoneModel: "",
      smartphoneComment: ``,
      tabletModel: "",
      tabletComment: ``,
      pcModel: "",
      pcComment: ``,
      pcSpecsObj: {
        os: "",
        cpu: "",
        cpuCooler: "",
        motherboard: "",
        memory: "",
        storage: "",
        graphicsCard: "",
        opticalDrive: "",
        powerSupply: "",
        pcCase: "",
        monitor: "",
        mouse: "",
        keyboard: "",
      },
      hardwareActiveArr: [],
      hardwareInactiveArr: [],
      ids_idsArr: [],
      activityTimeArr: [],
      lookingForFriends: true,
      lookingForFriendsIcon: "emoji_u263a",
      lookingForFriendsComment: "",
      voiceChat: true,
      voiceChatComment: "",
      linkArr: [],
      search: true,
    };

    // ---------------------------------------------
    //   - email-confirmations
    // ---------------------------------------------

    let emailConfirmationsConditionObj = {};
    let emailConfirmationsSaveObj = {};

    if (email) {
      emailConfirmationsConditionObj = {
        _id: shortid.generate(),
      };

      emailConfirmationsSaveObj = {
        createdDate: ISO8601,
        users_id,
        emailConfirmationID,
        type: "email",
        email: encryptedEmail,
        count: 1,
        isSuccess: false,
        ip,
        userAgent,
      };
    }

    // ---------------------------------------------
    //   - experiences
    // ---------------------------------------------

    const experiencesConditionObj = {
      _id: shortid.generate(),
    };

    const experiencesSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      users_id,
      exp: 0,
      historiesArr: [],
      acquiredTitles_idsArr: [],
      selectedTitles_idsArr: [],
    };

    // ---------------------------------------------
    //   - follows
    // ---------------------------------------------

    const followsConditionObj = {
      _id: shortid.generate(),
    };

    const followsSaveObj = {
      updatedDate: ISO8601,
      gameCommunities_id: "",
      userCommunities_id: "",
      users_id,
      approval: false,
      followArr: [],
      followCount: 0,
      followedArr: [],
      followedCount: 0,
      approvalArr: [],
      approvalCount: 0,
      blockArr: [],
      blockCount: 0,
    };

    // ---------------------------------------------
    //   Insert
    // ---------------------------------------------

    await ModelUsers.transactionForUpsert({
      usersConditionObj,
      usersSaveObj,
      cardPlayersConditionObj,
      cardPlayersSaveObj,
      emailConfirmationsConditionObj,
      emailConfirmationsSaveObj,
      experiencesConditionObj,
      experiencesSaveObj,
      followsConditionObj,
      followsSaveObj,
    });

    // --------------------------------------------------
    //   セッションデータ格納
    //   アカウント作成後のログインでは１度だけ reCAPTCHA のチェックをしない（すでにチェックされているため）
    // --------------------------------------------------

    req.session.passVerifyRecaptchaLoginID = loginID;

    // --------------------------------------------------
    //   確認メール送信
    // --------------------------------------------------

    sendMailConfirmation({
      to: email,
      emailConfirmationID,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/users/upsert-create-account.js
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   loginID: {green ${loginID}}
    //   loginPassword: {green ${loginPassword}}
    //   email: {green ${email}}
    //   response: {green ${response}}
    // `);

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
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
      endpointID: "fmVLqHFfj",
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

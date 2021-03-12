// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

const chalk = require("chalk");
const util = require("util");

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "public/" });
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { verifyCsrfToken } = require("../../@modules/csrf.js");
const { verifyRecaptcha } = require("../../@modules/recaptcha.js");
const { returnErrorsArr } = require("../../@modules/log/log.js");
const { CustomError } = require("../../@modules/error/custom.js");

// ---------------------------------------------
//   Validations
// ---------------------------------------------

const { validationIP } = require("../../@validations/ip.js");
const {
  validationUsersLoginID,
} = require("../../@database/users/validations/login-id.js");
const {
  validationUsersLoginPassword,
} = require("../../@database/users/validations/login-password.js");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const ModelUsers = require("../../@database/users/model.js");
const SchemaUsers = require("../../@database/users/schema.js");

// --------------------------------------------------
//   Router
// --------------------------------------------------

const router = express.Router();

// --------------------------------------------------
//   Status Code & Error Arguments Object
// --------------------------------------------------

let statusCode = 400;

// --------------------------------------------------
//   ログイン Passport：Local（ID & Password） / endpointID: ZVCmdUTHQ
//
//   参考：
//  　 http://www.passportjs.org/docs/username-password/
//
//   参考 カスタムコールバック：
//     http://www.passportjs.org/docs/authenticate/
//     http://knimon-software.github.io/www.passportjs.org/guide/authenticate/
// --------------------------------------------------

router.post("/login", upload.none(), (req, res, next) => {
  // --------------------------------------------------
  //   Language & IP & User Agent
  // --------------------------------------------------

  const acceptLanguage = lodashGet(req, ["headers", "accept-language"], "");
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = lodashGet(req, ["headers", "user-agent"], "");

  passport.authenticate("local", async (err, user, info) => {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const requestParametersObj = {};

    try {
      // --------------------------------------------------
      //   POST Data
      // --------------------------------------------------

      const { loginID, loginPassword, response } = req.body;

      lodashSet(requestParametersObj, ["loginID"], loginID ? "******" : "");
      lodashSet(
        requestParametersObj,
        ["loginPassword"],
        loginPassword ? "******" : ""
      );

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(chalk`
      //   loginID: {green ${loginID}}
      //   loginPassword: {green ${loginPassword}}
      //   response: {green ${response}}
      //   req.session.passVerifyRecaptchaLoginID: {green ${req.session.passVerifyRecaptchaLoginID}}
      //   req.isAuthenticated(): {green ${req.isAuthenticated()}}
      // `);

      // ---------------------------------------------
      //   Verify CSRF
      // ---------------------------------------------

      verifyCsrfToken(req, res);

      // ---------------------------------------------
      //   Verify reCAPTCHA
      // ---------------------------------------------

      if (
        req.session.passVerifyRecaptchaLoginID &&
        req.session.passVerifyRecaptchaLoginID === loginID
      ) {
        // --------------------------------------------------
        //   セッションデータ削除
        //   アカウント作成後、パスワードリセット後のログインでは１度だけ reCAPTCHA のチェックをしない（すでにチェックされているため）
        // --------------------------------------------------

        delete req.session.passVerifyRecaptchaLoginID;
      } else {
        await verifyRecaptcha({ response, remoteip: ip });
      }

      // --------------------------------------------------
      //   Login Check
      // --------------------------------------------------

      if (req.isAuthenticated()) {
        statusCode = 403;
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "yyaAiB5f-", messageID: "V9vI1Cl1S" }],
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
      await validationUsersLoginPassword({
        throwError: true,
        required: true,
        value: loginPassword,
        loginID,
      });

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if (err) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "BBoMlwE0o-", messageID: "Error" }],
        });
      }

      if (!user) {
        statusCode = 401;
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "H0eMuApu6", messageID: "RIj4SCt_s" }],
        });
      }

      // ---------------------------------------------
      //   req.logIn - この記述はカスタムコールバックに必要らしい
      // ---------------------------------------------

      req.logIn(user, function (err) {
        // ---------------------------------------------
        //   Error
        // ---------------------------------------------

        if (err) {
          throw new CustomError({
            level: "warn",
            errorsArr: [{ code: "5PzzF23_V", messageID: "Error" }],
          });
        }

        // ---------------------------------------------
        //   Success
        // ---------------------------------------------

        return res.status(200).json({
          userID: req.user.userID,
        });
      });
    } catch (errorObj) {
      // ---------------------------------------------
      //   Log
      // ---------------------------------------------

      const resultErrorObj = returnErrorsArr({
        errorObj,
        endpointID: "ZVCmdUTHQ",
        users_id: "",
        ip,
        userAgent,
        requestParametersObj,
      });

      // --------------------------------------------------
      //   Return JSON Object / Error
      // --------------------------------------------------

      return res.status(statusCode).json(resultErrorObj);
    }
  })(req, res, next);
});

// --------------------------------------------------
//   Passport Local：ID & Password 認証
// --------------------------------------------------

passport.use(
  new LocalStrategy(
    {
      usernameField: "loginID",
      passwordField: "loginPassword",
    },
    (username, password, done) => {
      // console.log(chalk`
      //   username: {green ${username}}
      //   password: {green ${password}}
      // `);

      SchemaUsers.findOne({ loginID: username }, (err, user) => {
        // --------------------------------------------------
        //   Error
        // --------------------------------------------------

        if (err) {
          return done(err);
        }

        // --------------------------------------------------
        //   Error：ユーザーが存在しない
        // --------------------------------------------------

        if (!user) {
          return done(null, false, {});
        }

        // --------------------------------------------------
        //   bcrypt でハッシュ化したパスワードを検証する
        //   参照：https://github.com/kelektiv/node.bcrypt.js#to-check-a-password-1
        // --------------------------------------------------

        if (bcrypt.compareSync(password, user.loginPassword) === false) {
          return done(null, false, {});
        }

        return done(null, user);
      });
    }
  )
);

// --------------------------------------------------
//   シリアライズ
//   認証時、DB/users コレクションの _id をセッションに保存する
//   _id は req.session.passport.user に入っている
// --------------------------------------------------

passport.serializeUser((user, done) => {
  done(null, user._id);
});

// --------------------------------------------------
//   デシリアライズ
//   セッション変数を受け取って中身を検証する
//   データベースからログインユーザーデータを取得して返す
//   返ってきたユーザーデータは各 router の req.user から参照できる
// --------------------------------------------------

passport.deserializeUser(async (id, done) => {
  // --------------------------------------------------
  //   データ取得 / Users
  //   ログインユーザー情報
  // --------------------------------------------------

  const docUsersObj = await ModelUsers.findOneForLoginUsersObj({
    users_id: id,
  });

  // console.log(`
  //   ----- docUsersObj -----\n
  //   ${util.inspect(docUsersObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  done(null, docUsersObj);
});

// --------------------------------------------------
//   Logout / endpointID: lpePrqvT4
// --------------------------------------------------

router.post("/logout", upload.none(), function (req, res, next) {
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
    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // ---------------------------------------------
    //   Logout
    // ---------------------------------------------

    req.logout();

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
      endpointID: "lpePrqvT4",
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
});

// --------------------------------------------------
//   exports
// --------------------------------------------------

module.exports = router;

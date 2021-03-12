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

const Tokens = require("csrf");
const tokens = new Tokens();

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { setCookie } = require("./cookie");

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * CSRF対策でトークンを発行する
 * @param {Object} req - リクエスト
 * @param {Object} res - レスポンス
 */
const createCsrfToken = (req, res) => {
  // --------------------------------------------------
  //   トークン発行
  // --------------------------------------------------

  if (req) {
    const secret = tokens.secretSync();
    const token = tokens.create(secret);

    // セッションに保存
    req.session._csrf = secret;

    // クッキーに保存
    setCookie({ key: "_csrf", value: token, expires: 0, httpOnly: true, res });

    // console.log(chalk`
    //   createCsrfToken
    //   secret: {green ${secret}}
    //   token: {green ${token}}
    // `);
  }
};

/**
 * CSRF対策でトークンを検証する。また同時にトークンを再発行する。
 * @param {Object} req - リクエスト
 * @param {Object} res - レスポンス
 * @return {boolean} 検証結果を真偽値で返す
 *
 * 参考：https://garafu.blogspot.com/2017/04/nodejs-express-csrfprotection.html
 */
const verifyCsrfToken = (req, res) => {
  // --------------------------------------------------
  //   製品版 / VERIFY_CSRF === '1' のときは検証する
  // --------------------------------------------------

  if (
    process.env.NODE_ENV === "production" ||
    process.env.VERIFY_CSRF === "1"
  ) {
    // --------------------------------------------------
    //   トークンの検証
    // --------------------------------------------------

    const secret = req.session._csrf;
    const token = req.cookies._csrf;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/csrf.js - verifyCsrfToken
    // `);

    // console.log(chalk`
    //   session.secret: {green ${secret}}
    //   cookies.token: {green ${token}}
    //   tokens.verify(secret, token): {rgb(255,131,0) ${tokens.verify(secret, token)}}
    // `);

    // console.log(req.session);

    // 秘密文字 と トークン の組み合わせが正しいか検証
    if (tokens.verify(secret, token) === false) {
      throw new Error("CSRF: Invalid Token");
    }

    // --------------------------------------------------
    //   トークン再発行
    // --------------------------------------------------

    createCsrfToken(req, res);

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    return true;
  }

  // console.log(`verifyCsrfToken 検証スルー`);

  // --------------------------------------------------
  //   開発時、VERIFY_CSRF === '0' のときは検証スルー
  // --------------------------------------------------

  return true;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  verifyCsrfToken,
  createCsrfToken,
};

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

const moment = require("moment");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * 権限をセット / _id を配列に追加してセッションに格納する
 * @param {Object} req - リクエスト
 * @param {string} _id - _id
 */
const setAuthority = ({ req, _id }) => {
  // console.log(chalk`
  //   _id: {green ${_id}}
  // `);

  if (req && _id) {
    let authorityArr = lodashGet(req, ["session", "authorityArr"], []);

    if (!Array.isArray(authorityArr)) {
      authorityArr = [];
    }

    if (!authorityArr.includes(_id)) {
      authorityArr.push(_id);
      req.session.authorityArr = authorityArr;
    }

    // console.log(`
    //   ----- setAuthority / authorityArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(authorityArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- req.session.authorityArr -----\n
    //   ${util.inspect(req.session.authorityArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  }
};

/**
 * 権限を確認
 * ログインユーザーの場合、サイト運営、または作成したコンテンツの作者のユーザーIDをログインユーザーIDと比較して同じだった場合、権限あり
 * 非ログインユーザーの場合、セッションに格納されている配列に _id が含まれているかチェックする
 * @param {Object} req - リクエスト
 * @param {string} users_id - 作者のユーザーID
 * @param {string} loginUsers_id - ログインしているユーザーID
 * @param {string} ISO8601 - 投稿日時など
 * @param {string} _id - 検証する_id
 * @return {boolean} 検証結果を真偽値で返す
 */
const verifyAuthority = ({ req, users_id, loginUsers_id, ISO8601, _id }) => {
  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/@modules/authority.js - verifyAuthority
  // `);

  // console.log(`
  //   ----- req.user -----\n
  //   ${util.inspect(req.user, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   users_id: {green ${users_id}}
  //   loginUsers_id: {green ${loginUsers_id}}
  //   ISO8601: {green ${ISO8601}}
  //   _id: {green ${_id}}
  // `);

  // --------------------------------------------------
  //   Role - サイト運営
  // --------------------------------------------------

  const role = lodashGet(req, ["user", "role"], "user");

  if (role === "administrator") {
    return true;
  }

  // --------------------------------------------------
  //   ログイン中
  //   ユーザーIDで検証
  // --------------------------------------------------

  if (users_id && loginUsers_id && users_id === loginUsers_id) {
    // console.log('true / 作者がログインしているユーザーの場合');
    return true;
  }

  // --------------------------------------------------
  //   ログインしていない
  //   投稿後、1時間経った場合は編集権限を失う
  //   （Game Usersではログインしていなくても一時間以内にアクセスした場合は、編集が行える）
  // --------------------------------------------------

  if (ISO8601) {
    const dateTimeLimit = moment(ISO8601).utc().add(1, "hour");
    const dateTimeNow = moment().utc();

    // console.log(chalk`
    //   dateTimeLimit: {green ${dateTimeLimit}}
    //   dateTimeNow: {green ${dateTimeNow}}
    // `);

    if (dateTimeNow.isAfter(dateTimeLimit)) {
      // console.log('false / 1時間以内にアクセスしていない');
      return false;
    }
  }

  // --------------------------------------------------
  //   ログインしていない
  //   非ログイン時はコメントなどの投稿時に、ID（スレッドID、コメントIDなど）がセッションに格納される
  //   セッションに該当するIDが含まれているかどうかを確認して、作者かどうかを判定する
  // --------------------------------------------------

  if (req && _id) {
    let authorityArr = lodashGet(req, ["session", "authorityArr"], []);

    if (!Array.isArray(authorityArr)) {
      authorityArr = [];
    }

    // console.log(`
    //   ----- authorityArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(authorityArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    if (authorityArr.includes(_id)) {
      // console.log('true / セッションにIDが含まれている');
      return true;
    }
  }

  // --------------------------------------------------
  //   それ以外は編集権限なし
  // --------------------------------------------------

  // console.log('false / それ以外');

  return false;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  setAuthority,
  verifyAuthority,
};

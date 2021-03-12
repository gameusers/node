// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

// import chalk from 'chalk';
// import util from 'util';

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

const Cookies = require("js-cookie");
// import Cookies from 'js-cookie';

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * Cookie からデータを取得する / 2020/12/23
 * @param {string} key - 取得するキー
 * @param {string} reqHeadersCookie - サーバー側で受信したクッキーのデータ
 * @param {boolean} decode - デコードする場合はtrue
 * @param {string} defaultValue - サーバー側で受信したクッキーのデータ
 */
const getCookie = ({
  key,
  reqHeadersCookie = "",
  decode = false,
  defaultValue,
}) => {
  // --------------------------------------------------
  //   データを取得する
  // --------------------------------------------------

  // let returnValue = Cookies.get(key) || ((reqHeadersCookie + ';').match(key + '=([^¥S;]*)')||[])[1];
  let returnValue = Cookies.get(key);

  // --------------------------------------------------
  //   サーバー側
  // --------------------------------------------------

  if (!returnValue && reqHeadersCookie) {
    const tempArr = reqHeadersCookie.split("; ");

    for (let i = 0; i < tempArr.length; i++) {
      const dataArr = tempArr[i].split("=");

      if (key === dataArr[0]) {
        returnValue = decodeURIComponent(dataArr[1]);
        break;
      }
    }
  }

  // --------------------------------------------------
  //   デコード
  // --------------------------------------------------

  if (decode && returnValue) {
    returnValue = decodeURIComponent(returnValue);
  }

  // --------------------------------------------------
  //   undefined を '' または defaultValue にする
  // --------------------------------------------------

  if (!returnValue) {
    returnValue = "";

    if (defaultValue) {
      returnValue = defaultValue;
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/@modules/cookie.js - getCookie
  // `);

  // console.log(chalk`
  //   key: {green ${key}}
  //   reqHeadersCookie: {green ${reqHeadersCookie}}
  //   decode: {green ${decode}}
  //   returnValue: {green ${returnValue} / ${typeof returnValue}}
  // `);

  // console.log(chalk`
  //   Cookies.get(key): {green ${Cookies.get(key)}}
  //   ((reqHeadersCookie + ';').match(key + '=([^¥S;]*)')||[])[1]: {green ${((reqHeadersCookie + ';').match(key + '=([^¥S;]*)')||[])[1]}}
  //   returnValue: {green ${returnValue}}
  // `);

  // console.log(chalk`
  //   key: {green ${key}}
  //   reqHeadersCookie: {green ${reqHeadersCookie}}
  //   Cookies.get(key): {green ${Cookies.get(key)}}
  //   ((reqHeadersCookie + ';').match(key + '=([^¥S;]*)')||[])[1]: {green ${((reqHeadersCookie + ';').match(key + '=([^¥S;]*)')||[])[1]}}
  //   returnValue: {green ${returnValue}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return returnValue;
};

/**
 * Cookie にデータをセットする / 2021/1/21
 * @param {string} key - キー
 * @param {string} value - 値
 * @param {number} expires - 有効期限
 * @param {string} path - パス
 */
const setCookie = ({ key, value, expires, path, httpOnly, res }) => {
  // --------------------------------------------------
  //   データを取得する
  // --------------------------------------------------

  let attributesObj = {
    path: "/",
  };

  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_URL_BASE === "https://gameusers.org/"
  ) {
    attributesObj = {
      expires: 365,
      domain: "gameusers.org",
      path: "/",
      secure: true,
      sameSite: "strict",
    };
  }

  if (expires) {
    attributesObj.expires = expires;
  } else if (expires === 0) {
    delete attributesObj.expires;
  }

  if (path) {
    attributesObj.path = path;
  }

  if (httpOnly) {
    attributesObj.httpOnly = true;
  }

  // console.log(attributesObj);

  // --------------------------------------------------
  //   セット
  // --------------------------------------------------

  // ---------------------------------------------
  //   - サーバー側
  // ---------------------------------------------

  if (res) {
    res.cookie(key, value, attributesObj);

    // ---------------------------------------------
    //   - クライアント側
    // ---------------------------------------------
  } else {
    Cookies.set(key, value, attributesObj);
  }
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  getCookie,
  setCookie,
};

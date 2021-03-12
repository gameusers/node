// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

// const chalk = require('chalk');
// const util = require('util');

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

// const acceptLanguageParser = require('accept-language-parser');

// ---------------------------------------------
//   Locales
// ---------------------------------------------

const locale_en = require("../../app/@locales/en.json");
const locale_ja = require("../../app/@locales/ja.json");

// import locale_ja from 'app/@locales/ja.json';
// import locale_en from 'app/@locales/en.json';

// const en_US = require('../../app/@locales/en-us');
// const ja_JP = require('../../app/@locales/ja-jp');

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * 取得する
 * @param {Object} argumentsObj - 引数
 * @return {Object} フォーマットされたデータ
 */
const locale = (argumentsObj) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  // const { acceptLanguage } = argumentsObj;

  // --------------------------------------------------
  //   Return Object
  // --------------------------------------------------

  let returnObj = {};
  let language = "ja";
  let country = "JP";
  let languageArr = ["ja"];
  let countryArr = ["JP"];
  // let dataObj = ja_JP;

  // --------------------------------------------------
  //   Language & Country
  // --------------------------------------------------

  // const resultArr = acceptLanguageParser.parse(acceptLanguage);

  // if (resultArr.length > 0) {

  //   returnObj.language = resultArr[0].code;
  //   returnObj.country = resultArr[0].region;

  //   if (returnObj.language === 'ja') {
  //     returnObj.country = 'JP';
  //   }

  // } else {

  //   returnObj.language = 'ja';
  //   returnObj.country = 'JP';

  // }

  // --------------------------------------------------
  //   Locale Data
  // --------------------------------------------------

  // if (language === 'en') {

  //   dataObj = en_US;

  // } else if (language === 'ja') {

  //   dataObj = ja_JP;

  // }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  returnObj.language = language;
  returnObj.country = country;
  returnObj.languageArr = languageArr;
  returnObj.countryArr = countryArr;
  // returnObj.dataObj = dataObj;

  return returnObj;
};

/**
 * データを取得する
 * @param {string} locale - [ja, en]
 * @return {Object} JSONデータ
 */
const loadLocaleData = ({ locale }) => {
  switch (locale) {
    case "en":
      return locale_en;

    default:
      return locale_ja;
  }
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  locale,
  loadLocaleData,
};

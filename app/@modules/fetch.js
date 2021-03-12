// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

const chalk = require("chalk");
const util = require("util");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * Fetch のラッパー
 * @param {string} urlApi - 送信するAPIのURL
 * @param {string} methodType - GET, POST, PUT, DELETE, etc.
 * @param {Object} formData - FormDataオブジェクト
 * @param {string} reqHeadersCookie - サーバー側のときに req.headers.cookie（クッキー情報）を送信　例）'_csrf=hBPvLY8t-lYCwH-dpFTXzjlCLLJQvp9-mOik'
 * @param {string} reqAcceptLanguage - サーバー側のときに req.headers['accept-language'] を送信　例）ja,en-US;q=0.9,en;q=0.8
 * @return {Object} 取得したデータまたはエラーオブジェクト
 */
const fetchWrapper = ({
  urlApi,
  methodType,
  formData,
  reqHeadersCookie,
  reqAcceptLanguage,
}) => {
  // ---------------------------------------------
  //   Property
  // ---------------------------------------------

  const resultObj = {
    statusCode: 400,
  };

  // const urlApi = argumentsObj.urlApi;
  // const methodType = argumentsObj.methodType;
  // const formData = argumentsObj.formData;
  // const reqHeadersCookie = argumentsObj.reqHeadersCookie;
  // const reqAcceptLanguage = argumentsObj.reqAcceptLanguage;

  // console.log(chalk`
  // fetchWrapper

  // urlApi: {green ${urlApi}}
  // methodType: {green ${methodType}}
  // reqHeadersCookie: {green ${reqHeadersCookie}}
  // reqAcceptLanguage: {green ${reqAcceptLanguage}}
  // `);

  // console.log(`
  //   ----- formData -----\n
  //   ${util.inspect(formData, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // ---------------------------------------------
  //   Fetch
  // ---------------------------------------------

  // ----------------------------------------
  //   Headers
  // ----------------------------------------

  const headersObj = {
    Accept: "application/json",
  };

  if (reqHeadersCookie) {
    headersObj["Cookie"] = reqHeadersCookie;
  }

  if (reqAcceptLanguage) {
    headersObj["accept-language"] = reqAcceptLanguage;
  }

  return fetch(urlApi, {
    method: methodType,
    credentials: "same-origin",
    mode: "same-origin",
    headers: headersObj,
    body: formData,
  })
    .then((response) => {
      // console.log(`
      //   ----- response -----\n
      //   ${util.inspect(response, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      resultObj.statusCode = response.status;
      return response.json();
    })
    .then((jsonObj) => {
      // console.log(`
      //   ----- jsonObj -----\n
      //   ${util.inspect(jsonObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      if ("errorsArr" in jsonObj) {
        resultObj.errorsArr = jsonObj.errorsArr;
      } else {
        resultObj.data = jsonObj;
      }

      return resultObj;
    })
    .catch((error) => {
      resultObj.errorsArr = [
        {
          code: 0,
          message: error.message,
        },
      ];

      return resultObj;
    });
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  fetchWrapper,
};

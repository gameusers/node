// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelUsers from "app/@database/users/model.js";
import ModelCardPlayers from "app/@database/card-players/model.js";
import ModelFeeds from "app/@database/feeds/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// ---------------------------------------------
//   API
// ---------------------------------------------

import { initialProps } from "app/@api/v2/common.js";

// --------------------------------------------------
//   endpointID: CuUwo1avA
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

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
    //   GET Data
    // --------------------------------------------------

    const userID = lodashGet(req, ["query", "userID"], "");

    lodashSet(requestParametersObj, ["userID"], userID);

    // --------------------------------------------------
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj, type: "other" });

    // --------------------------------------------------
    //   データ取得 / Users
    //   アクセスしたページ所有者のユーザー情報
    //   users_id を取得するために利用
    // --------------------------------------------------

    const usersObj = await ModelUsers.findOneForUser({
      localeObj,
      loginUsers_id,
      userID,
    });

    // --------------------------------------------------
    //   ユーザー情報が存在しない場合はエラー
    // --------------------------------------------------

    const users_id = lodashGet(usersObj, ["_id"], "");

    if (!users_id) {
      // ---------------------------------------------
      //   リダイレクト先があるか調べる
      // ---------------------------------------------

      const redirectionUsersObj = await ModelUsers.findOne({
        conditionObj: {
          userIDInitial: userID,
        },
      });

      // ---------------------------------------------
      //   リダイレクト先がない場合は、404エラー
      // ---------------------------------------------

      if (!redirectionUsersObj) {
        statusCode = 404;
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "QGUc_L0d1", messageID: "Error" }],
        });
      }

      // ---------------------------------------------
      //   リダイレクト先
      // ---------------------------------------------

      returnObj.redirectObj = {
        userID: redirectionUsersObj.userID,
      };

      // console.log(`
      //   ----- redirectionUsersObj -----\n
      //   ${util.inspect(redirectionUsersObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // ---------------------------------------------
    //   - headerObj
    //   ユーザーがトップ画像をアップロードしていない場合は、ランダム取得の画像を代わりに利用する
    // ---------------------------------------------

    const imagesAndVideosObj = lodashGet(
      returnObj,
      ["headerObj", "imagesAndVideosObj"],
      {}
    );
    const usersImagesAndVideosObj = lodashGet(
      usersObj,
      ["headerObj", "imagesAndVideosObj"],
      {}
    );

    if (Object.keys(usersImagesAndVideosObj).length === 0) {
      lodashSet(
        usersObj,
        ["headerObj", "imagesAndVideosObj"],
        imagesAndVideosObj
      );
    }

    returnObj.headerObj = usersObj.headerObj;

    // --------------------------------------------------
    //   pagesObj - ユーザー各自が設定したページのタイトル
    // --------------------------------------------------

    returnObj.pagesObj = lodashGet(usersObj, ["pagesObj"], []);

    // --------------------------------------------------
    //   データ取得 / Card Players
    //   アクセスしたページ所有者のプレイヤーカード情報
    // --------------------------------------------------

    const resultCardPlayersObj = await ModelCardPlayers.findForCardPlayers({
      localeObj,
      users_id,
      loginUsers_id,
    });

    returnObj.cardPlayersObj = resultCardPlayersObj.cardPlayersObj;
    returnObj.cardPlayers_idsArr = resultCardPlayersObj.cardPlayers_idsArr;

    // --------------------------------------------------
    //   DB find / Feed
    // --------------------------------------------------

    returnObj.feedObj = await ModelFeeds.findFeed({
      localeObj,
      arr: ["all"],
    });

    // --------------------------------------------------
    //   権限
    //   0: ブロックしているユーザー
    //   1: 非ログインユーザー
    //   2: ログインユーザー（以下ログイン済みユーザー）
    //   3: 自分のことをフォローしているユーザー
    //   4: 自分がフォローしているユーザー
    //   5: 相互フォロー状態のユーザー
    //   50: 自分自身
    //   100: サイト管理者
    // --------------------------------------------------

    returnObj.accessLevel = 1;

    // ---------------------------------------------
    //   - 自分自身
    // ---------------------------------------------

    if (users_id && loginUsers_id && users_id === loginUsers_id) {
      returnObj.accessLevel = 50;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/ur/[userID]/index.js
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   users_id：{green ${users_id}}
    // `);

    // console.log(`
    //   ----- localeObj -----\n
    //   ${util.inspect(localeObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj.headerObj -----\n
    //   ${util.inspect(returnObj.headerObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- usersObj -----\n
    //   ${util.inspect(usersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- resultCardPlayersObj -----\n
    //   ${util.inspect(resultCardPlayersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
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
      endpointID: "CuUwo1avA",
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

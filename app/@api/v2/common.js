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

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelGames from "app/@database/games/model.js";
import ModelImagesAndVideos from "app/@database/images-and-videos/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { updateAccessDate } from "app/@modules/access-date.js";

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * ページにアクセスしたときの共通の処理
 * @param {Object} req - リクエスト
 * @param {Object} res - レスポンス
 * @param {boolean} getHeroImage - ヒーローイメージを取得する場合、true
 */
const initialProps = async ({ req, localeObj, type }) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const returnObj = {
    login: false,
    experienceObj: {},
  };

  // --------------------------------------------------
  //   ログインしているユーザー情報＆ログインチェック
  // --------------------------------------------------

  if (req.isAuthenticated() && req.user) {
    returnObj.loginUsersObj = req.user;
    returnObj.login = true;
  }

  // --------------------------------------------------
  //   Update Access Date & Login Count
  // --------------------------------------------------

  const loginUsers_id = lodashGet(returnObj, ["loginUsersObj", "_id"], "");

  if (loginUsers_id) {
    const accessDate = lodashGet(
      returnObj,
      ["loginUsersObj", "accessDate"],
      ""
    );

    const resultUpdatedAccessDateObj = await updateAccessDate({
      req,
      localeObj,
      loginUsers_id,
      accessDate,
    });

    returnObj.experienceObj = lodashGet(
      resultUpdatedAccessDateObj,
      ["experienceObj"],
      {}
    );
    const updatedAccessDate = lodashGet(
      resultUpdatedAccessDateObj,
      ["updatedAccessDate"],
      ""
    );

    if (updatedAccessDate) {
      lodashSet(returnObj, ["loginUsersObj", "accessDate"], updatedAccessDate);
    }
  }

  // --------------------------------------------------
  //   データ取得：ヘッダーヒーローイメージ用
  // --------------------------------------------------

  // ランダム画像
  if (type === "other") {
    const imagesAndVideosObj = await ModelImagesAndVideos.findHeroImage({
      localeObj,
    });
    lodashSet(
      returnObj,
      ["headerObj", "imagesAndVideosObj"],
      imagesAndVideosObj
    );

    // ゲーム画像
  } else {
    const headerObj = await ModelGames.findForHeroImage({ localeObj });
    lodashSet(returnObj, ["headerObj"], headerObj);
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return returnObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  initialProps,
};

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

const validator = require("validator");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const Model = require("../model");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom");

/**
 * _id - ユーザーコミュニティ用
 * @param {string} forumComments_id - DB forum-comments _id
 * @param {string} userCommunities_id - DB user-community _id
 * @return {Object} バリデーション結果
 */
const validationForumComments_idServerUC = async ({
  forumComments_id,
  forumThreads_id,
  userCommunities_id,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const data = String(forumComments_id);
  const numberOfCharacters = data ? data.length : 0;

  let resultObj = {
    value: data,
    numberOfCharacters,
  };

  // ---------------------------------------------
  //   文字数チェック
  // ---------------------------------------------

  if (!validator.isLength(data, { min: minLength, max: maxLength })) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "XqKteMWhD", messageID: "Pp_CFyt_3" }],
    });
  }

  // ---------------------------------------------
  //   英数と -_ のみ
  // ---------------------------------------------

  if (data.match(/^[\w\-]+$/) === null) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "LvpynfO4n", messageID: "JBkjlGQMh" }],
    });
  }

  // ---------------------------------------------
  //   データベースに存在していない場合はエラー
  // ---------------------------------------------

  const count = await Model.count({
    conditionObj: {
      _id: forumComments_id,
      forumThreads_id,
      userCommunities_id,
    },
  });

  if (count !== 1) {
    throw new CustomError({
      level: "warn",
      errorsArr: [{ code: "a4iFJPINd", messageID: "cvS0qSAlE" }],
    });
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return resultObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  validationForumComments_idServerUC,
};

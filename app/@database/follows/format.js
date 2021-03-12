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

// const shortid = require('shortid');
const lodashGet = require("lodash/get");
// const lodashSet = require('lodash/set');
// const lodashHas = require('lodash/has');
// const lodashCloneDeep = require('lodash/cloneDeep');

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * フォーマットする
 *
 * @param {Object} followsObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @return {Array} フォーマットされたオブジェクト
 */
const formatFollowsObj = ({ followsObj, adminUsers_id, loginUsers_id }) => {
  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const approval = lodashGet(followsObj, ["approval"], false);
  const followCount = lodashGet(followsObj, ["followCount"], 0);
  const followedCount = lodashGet(followsObj, ["followedCount"], 0);

  let admin = false;
  let follow = false;
  let followed = false;
  let followApproval = false;
  let followBlocked = false;

  // --------------------------------------------------
  //   Login
  // --------------------------------------------------

  if (loginUsers_id) {
    const followArr = lodashGet(followsObj, ["followArr"], []);
    const followedArr = lodashGet(followsObj, ["followedArr"], []);
    const approvalArr = lodashGet(followsObj, ["approvalArr"], []);
    const blockArr = lodashGet(followsObj, ["blockArr"], []);

    if (adminUsers_id === loginUsers_id) {
      admin = true;
    }

    // 相手がフォローしているユーザーの配列に自分のIDが含まれている場合は、フォローされているということ
    if (followArr.includes(loginUsers_id)) {
      followed = true;
    }

    // 相手をフォローしているユーザーの配列に自分のIDが含まれている場合は、フォローしているということ
    if (followedArr.includes(loginUsers_id)) {
      follow = true;
    }

    if (approvalArr.includes(loginUsers_id)) {
      followApproval = true;
    }

    if (blockArr.includes(loginUsers_id)) {
      followBlocked = true;
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/@database/follows/format.js
  // `);

  // console.log(chalk`
  //   adminUsers_id: {green ${adminUsers_id}}
  //   loginUsers_id: {green ${loginUsers_id}}
  // `);

  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  return {
    approval,
    followCount,
    followedCount,
    admin,
    follow,
    followed,
    followApproval,
    followBlocked,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  formatFollowsObj,
};

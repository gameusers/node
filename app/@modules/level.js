// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * レベルを計算する
 * @param {number} exp - 経験値
 */
const calculateLevel = ({ exp }) => {
  const requiredExp = parseInt(
    process.env.NEXT_PUBLIC_LEVEL_UP_REQUIRED_EXP,
    10
  );
  const level = Math.floor(exp / requiredExp) + 1;

  // console.log(chalk`
  //   exp: {green ${exp}}
  //   requiredExp：{green ${requiredExp}}
  //   level：{green ${level}}
  // `);

  return level;
};

/**
 * 次のレベルまでの経験値を計算する
 * @param {number} exp - 経験値
 */
const calculateToNextLevel = ({ exp }) => {
  const requiredExp = parseInt(
    process.env.NEXT_PUBLIC_LEVEL_UP_REQUIRED_EXP,
    10
  );
  const tnl = requiredExp - (exp % requiredExp);

  return tnl;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  calculateLevel,
  calculateToNextLevel,
};

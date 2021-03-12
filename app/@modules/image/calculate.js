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
 * 画像のサイズを計算する、リサイズする場合などに利用
 * @param {number} width - 横幅
 * @param {number} height - 高さ
 * @param {number} specifiedWidth - 横幅指定
 * @param {number} specifiedHeight - 高さ指定
 * @param {number} minSize - リサイズする最小サイズ指定　横幅、または高さ
 * @param {number} maxSize - リサイズする最大サイズ指定　横幅、または高さ
 * @param {boolean} square - 正方形にする場合 true
 * @return {Object} 横幅、高さの入ったオブジェクト
 */
const imageCalculateSize = ({
  width,
  height,
  specifiedWidth,
  specifiedHeight,
  minSize,
  maxSize,
  square,
}) => {
  // ---------------------------------------------
  //   比率を計算する
  // ---------------------------------------------

  let ratio = height / width;

  if (width < height) {
    ratio = width / height;
  }

  // ---------------------------------------------
  //   横幅・高さを計算する
  // ---------------------------------------------

  let resizedWidth = 0;
  let resizedHeight = 0;

  // ---------------------------------------------
  //   正方形＆最大サイズ指定
  // ---------------------------------------------

  if (square && minSize && maxSize) {
    if (width < minSize || height < minSize) {
      resizedWidth = minSize;
      resizedHeight = minSize;
    } else if (width < maxSize && height < maxSize) {
      if (width > height) {
        resizedWidth = width;
        resizedHeight = width;
      } else {
        resizedWidth = height;
        resizedHeight = height;
      }
    } else if (width < maxSize && height > maxSize) {
      resizedWidth = width;
      resizedHeight = width;
    } else if (width > maxSize && height < maxSize) {
      resizedWidth = height;
      resizedHeight = height;
    } else {
      resizedWidth = maxSize;
      resizedHeight = maxSize;
    }

    // ---------------------------------------------
    //   最小サイズ指定
    // ---------------------------------------------

    // } else if (minSize) {
    //   console.log('最小サイズ指定');
    //   if (width > minSize && height > minSize) {

    //     resizedWidth = width;
    //     resizedHeight = height;

    //   } else if (width > height) {

    //     resizedWidth = Math.round(minSize * ratio);
    //     resizedHeight = minSize;

    //   } else {

    //     resizedWidth = minSize;
    //     resizedHeight = Math.round(minSize * ratio);

    //   }

    // ---------------------------------------------
    //   最大サイズ指定
    // ---------------------------------------------
  } else if (maxSize) {
    if (width < maxSize && height < maxSize) {
      resizedWidth = width;
      resizedHeight = height;
    } else if (width > height) {
      resizedWidth = maxSize;
      resizedHeight = Math.round(maxSize * ratio);
    } else {
      resizedWidth = Math.round(maxSize * ratio);
      resizedHeight = maxSize;
    }

    // ---------------------------------------------
    //   横幅指定
    // ---------------------------------------------
  } else if (specifiedWidth) {
    ratio = specifiedWidth / width;

    resizedWidth = specifiedWidth;
    resizedHeight = Math.round(height * ratio);

    // ---------------------------------------------
    //   縦幅指定
    // ---------------------------------------------
  } else if (specifiedHeight) {
    ratio = specifiedHeight / height;

    resizedWidth = Math.round(width * ratio);
    resizedHeight = specifiedHeight;
    // console.log('縦幅指定');
    // console.log(chalk`
    //   resizedWidth: {green ${resizedWidth}}
    //   resizedHeight: {green ${resizedHeight}}
    // `);
  }

  // ---------------------------------------------
  //   console.log
  // ---------------------------------------------

  // console.log(chalk`
  //   ratio: {green ${ratio}}
  //   width: {green ${width}}
  //   height: {green ${height}}
  //   specifiedWidth: {green ${specifiedWidth}}
  //   specifiedHeight: {green ${specifiedHeight}}
  //   minSize: {green ${minSize}}
  //   maxSize: {green ${maxSize}}
  //   square: {green ${square}}
  //   resizedWidth: {green ${resizedWidth}}
  //   resizedHeight: {green ${resizedHeight}}
  // `);

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return { width: resizedWidth, height: resizedHeight };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  imageCalculateSize,
};

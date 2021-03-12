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
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const ModelHardwares = require("../../hardwares/model.js");

// ---------------------------------------------
//   Modules
// ---------------------------------------------

const { CustomError } = require("../../../@modules/error/custom.js");

/**
 * ハードウェア
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} valueArr - 配列
 * @return {Object} バリデーション結果
 */
const validationCardPlayersHardwareArrServer = async ({
  required = false,
  valueArr,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const hardwareIDArr = [];

  let resultObj = {
    valueArr: [],
    messageID: "Error",
  };

  try {
    // ---------------------------------------------
    //   配列チェック
    // ---------------------------------------------

    if (!Array.isArray(valueArr)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "qmbxqcNfu", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   空の場合、処理停止
    // ---------------------------------------------

    if (valueArr.length === 0) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "yWiqPYgmc", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   Loop
    // ---------------------------------------------

    for (let valueObj of valueArr.values()) {
      // ---------------------------------------------
      //   hardwareID
      // ---------------------------------------------

      const hardwareID = valueObj.hardwareID;
      // console.log(chalk`
      //   hardwareID: {green ${hardwareID}}
      // `);

      // ---------------------------------------------
      //   文字数チェック
      // ---------------------------------------------

      if (!validator.isLength(hardwareID, { min: minLength, max: maxLength })) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "NLlPVoAFH", messageID: "Pp_CFyt_3" }],
        });
      }

      // ---------------------------------------------
      //   英数と -_ のみ
      // ---------------------------------------------

      if (hardwareID.match(/^[\w\-]+$/) === null) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "Mtpgc1ixH", messageID: "JBkjlGQMh" }],
        });
      }

      hardwareIDArr.push(hardwareID);
    }

    // ---------------------------------------------
    //   Database
    // ---------------------------------------------

    if (hardwareIDArr.length > 0) {
      // ---------------------------------------------
      //   find
      // ---------------------------------------------

      const docArr = await ModelHardwares.find({
        conditionObj: {
          hardwareID: { $in: hardwareIDArr },
        },
      });

      // ---------------------------------------------
      //   ループしてデータベースに存在している hardwareID のみ resultObj.valueArr に追加する
      // ---------------------------------------------

      for (let value of hardwareIDArr.values()) {
        const tempObj = docArr.find((valueObj) => {
          return valueObj.hardwareID === value;
        });

        if (tempObj) {
          resultObj.valueArr.push(tempObj.hardwareID);
        }
      }
    }
  } catch (errorObj) {
    // ---------------------------------------------
    //   Throw Error
    // ---------------------------------------------

    throw errorObj;
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return resultObj;
};

/**
 * 所有ハードウェア
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} valueArr - 配列
 * @return {Object} バリデーション結果
 */
const validationCardPlayersHardwareActiveArrServer = async ({
  required = false,
  valueArr,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const hardwareIDArr = [];

  let resultObj = {
    valueArr: [],
    messageID: "Error",
  };

  try {
    // ---------------------------------------------
    //   配列チェック
    // ---------------------------------------------

    if (!Array.isArray(valueArr)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "qmbxqcNfu", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   空の場合、処理停止
    // ---------------------------------------------

    if (valueArr.length === 0) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "yWiqPYgmc", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   Loop
    // ---------------------------------------------

    for (let valueObj of valueArr.values()) {
      // ---------------------------------------------
      //   hardwareID
      // ---------------------------------------------

      const hardwareID = valueObj.hardwareID;
      // console.log(chalk`
      //   hardwareID: {green ${hardwareID}}
      // `);

      // ---------------------------------------------
      //   文字数チェック
      // ---------------------------------------------

      if (!validator.isLength(hardwareID, { min: minLength, max: maxLength })) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "NLlPVoAFH", messageID: "Pp_CFyt_3" }],
        });
      }

      // ---------------------------------------------
      //   英数と -_ のみ
      // ---------------------------------------------

      if (hardwareID.match(/^[\w\-]+$/) === null) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "Mtpgc1ixH", messageID: "JBkjlGQMh" }],
        });
      }

      hardwareIDArr.push(hardwareID);
    }

    // console.log('validationCardPlayersHardwareActiveArrServer');

    // ---------------------------------------------
    //   Database
    // ---------------------------------------------

    if (hardwareIDArr.length > 0) {
      // ---------------------------------------------
      //   find
      // ---------------------------------------------

      const docArr = await ModelHardwares.find({
        conditionObj: {
          hardwareID: { $in: hardwareIDArr },
        },
      });

      // ---------------------------------------------
      //   ループしてデータベースに存在している hardwareID のみ resultObj.valueArr に追加する
      // ---------------------------------------------

      for (let value of hardwareIDArr.values()) {
        const tempObj = docArr.find((valueObj) => {
          return valueObj.hardwareID === value;
        });

        if (tempObj) {
          resultObj.valueArr.push(tempObj.hardwareID);
        }
      }
    }
  } catch (errorObj) {
    // ---------------------------------------------
    //   Throw Error
    // ---------------------------------------------

    throw errorObj;
  }

  // ---------------------------------------------
  //   Return
  // ---------------------------------------------

  return resultObj;
};

/**
 * 昔、所有していたハードウェア
 * @param {boolean} required - 必須 true / 必須でない false
 * @param {Array} valueArr - 配列
 * @return {Object} バリデーション結果
 */
const validationCardPlayersHardwareInactiveArrServer = async ({
  required = false,
  valueArr,
}) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 7;
  const maxLength = 14;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const hardwareIDArr = [];

  let resultObj = {
    valueArr: [],
    messageID: "Error",
  };

  try {
    // ---------------------------------------------
    //   配列チェック
    // ---------------------------------------------

    if (!Array.isArray(valueArr)) {
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "wQR9x-6zw", messageID: "qnWsuPcrJ" }],
      });
    }

    // ---------------------------------------------
    //   空の場合、処理停止
    // ---------------------------------------------

    if (valueArr.length === 0) {
      if (required) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "mojXqeQ7N", messageID: "cFbXmuFVh" }],
        });
      }

      return resultObj;
    }

    // ---------------------------------------------
    //   Loop
    // ---------------------------------------------

    for (let hardwareID of valueArr.values()) {
      // ---------------------------------------------
      //   文字数チェック
      // ---------------------------------------------

      if (!validator.isLength(hardwareID, { min: minLength, max: maxLength })) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "jrMILi8Qk", messageID: "Pp_CFyt_3" }],
        });
      }

      // ---------------------------------------------
      //   英数と -_ のみ
      // ---------------------------------------------

      if (hardwareID.match(/^[\w\-]+$/) === null) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "0HVY-JnkI", messageID: "JBkjlGQMh" }],
        });
      }

      hardwareIDArr.push(hardwareID);
    }

    // ---------------------------------------------
    //   Database
    // ---------------------------------------------

    if (hardwareIDArr.length > 0) {
      // ---------------------------------------------
      //   find
      // ---------------------------------------------

      const docArr = await ModelHardwares.find({
        conditionObj: {
          hardwareID: { $in: hardwareIDArr },
        },
      });

      // ---------------------------------------------
      //   ループしてデータベースに存在している hardwareID のみ resultObj.valueArr に追加する
      // ---------------------------------------------

      for (let value of hardwareIDArr.values()) {
        const tempObj = docArr.find((valueObj) => {
          return valueObj.hardwareID === value;
        });

        if (tempObj) {
          resultObj.valueArr.push(tempObj.hardwareID);
        }
      }
    }
  } catch (errorObj) {
    // ---------------------------------------------
    //   Throw Error
    // ---------------------------------------------

    throw errorObj;
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
  validationCardPlayersHardwareArrServer,
  // validationCardPlayersHardwareActiveArrServer,
  // validationCardPlayersHardwareInactiveArrServer,
};

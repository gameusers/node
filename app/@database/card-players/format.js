// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

const chalk = require("chalk");
const util = require("util");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");
// const lodashSet = require('lodash/set');
// const lodashHas = require('lodash/has');
const lodashCloneDeep = require("lodash/cloneDeep");

// ---------------------------------------------
//   Format
// ---------------------------------------------

const { formatImagesAndVideosObj } = require("../images-and-videos/format");
const { formatFollowsObj } = require("../follows/format");
const { formatIDsArr } = require("../ids/format");

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * フォーマットする
 * @param {Object} followsObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} arr - データの入った配列
 * @return {Object} フォーマットされたオブジェクトと cardPlayers_id の入った配列
 */
const formatCardPlayersArr = ({ localeObj, loginUsers_id, arr }) => {
  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  const returnObj = {};
  const returnArr = [];
  const return_idsArr = [];

  // --------------------------------------------------
  //   Loop
  // --------------------------------------------------

  for (let valueObj of arr) {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const exp = lodashGet(valueObj, ["experiencesObj", "exp"], 0);
    const accessDate = lodashGet(valueObj, ["accessDate"], "");
    const userID = lodashGet(valueObj, ["userID"], "");

    const cardPlayerObj = lodashGet(valueObj, ["cardPlayerObj"], {});

    const cardPlayers_id = lodashGet(valueObj, ["cardPlayerObj", "_id"], "");
    const users_id = lodashGet(valueObj, ["cardPlayerObj", "users_id"], "");
    const imagesAndVideosObj = lodashGet(
      valueObj,
      ["cardPlayerObj", "imagesAndVideosObj"],
      {}
    );
    const imagesAndVideosThumbnailObj = lodashGet(
      valueObj,
      ["cardPlayerObj", "imagesAndVideosThumbnailObj"],
      {}
    );
    const hardwareActiveArr = lodashGet(
      valueObj,
      ["cardPlayerObj", "hardwareActiveArr"],
      []
    );
    const hardwareInactiveArr = lodashGet(
      valueObj,
      ["cardPlayerObj", "hardwareInactiveArr"],
      []
    );
    const hardwaresArr = lodashGet(
      valueObj,
      ["cardPlayerObj", "hardwaresArr"],
      []
    );
    const followsObj = lodashGet(valueObj, ["cardPlayerObj", "followsObj"], {});
    const idsArr = lodashGet(valueObj, ["cardPlayerObj", "idsArr"], []);

    // --------------------------------------------------
    //   Deep Copy
    // --------------------------------------------------

    const clonedObj = lodashCloneDeep(cardPlayerObj);

    // --------------------------------------------------
    //   Format - 画像
    // --------------------------------------------------

    const formattedObj = formatImagesAndVideosObj({
      localeObj,
      obj: imagesAndVideosObj,
    });

    if (Object.keys(formattedObj).length !== 0) {
      clonedObj.imagesAndVideosObj = formattedObj;
    } else {
      delete clonedObj.imagesAndVideosObj;
    }

    // --------------------------------------------------
    //   Format - サムネイル画像
    // --------------------------------------------------

    const formattedThumbnailObj = formatImagesAndVideosObj({
      localeObj,
      obj: imagesAndVideosThumbnailObj,
    });

    // if (formattedThumbnailObj) {
    if (Object.keys(formattedThumbnailObj).length !== 0) {
      clonedObj.imagesAndVideosThumbnailObj = formattedThumbnailObj;
    } else {
      delete clonedObj.imagesAndVideosThumbnailObj;
    }

    // --------------------------------------------------
    //   hardwareActive
    // --------------------------------------------------

    clonedObj.hardwareActiveArr = [];

    for (let value of hardwareActiveArr) {
      const obj = hardwaresArr.find((value2Obj) => {
        return value2Obj.hardwareID === value;
      });

      if (obj && "name" in obj) {
        clonedObj.hardwareActiveArr.push({
          name: obj.name,
        });
      }
    }

    // --------------------------------------------------
    //   hardwareInactive
    // --------------------------------------------------

    clonedObj.hardwareInactiveArr = [];

    for (let value of hardwareInactiveArr) {
      const obj = hardwaresArr.find((value2Obj) => {
        return value2Obj.hardwareID === value;
      });

      if (obj && "name" in obj) {
        clonedObj.hardwareInactiveArr.push({
          name: obj.name,
        });
      }
    }

    // --------------------------------------------------
    //   Format - Follows
    // --------------------------------------------------

    clonedObj.followsObj = formatFollowsObj({
      followsObj,
      adminUsers_id: users_id,
      loginUsers_id,
    });

    // --------------------------------------------------
    //   Format - IDs
    // --------------------------------------------------

    clonedObj.idsArr = formatIDsArr({
      localeObj,
      loginUsers_id,
      followsObj: clonedObj.followsObj,
      arr: idsArr,
    });

    // --------------------------------------------------
    //   usersObj
    // --------------------------------------------------

    clonedObj.usersObj = {
      exp,
      accessDate,
      userID,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/card-players/format.js - formatCardPlayersArr
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   pathname: {green ${pathname}}
    // `);

    // console.log(`
    //   ----- clonedObj -----\n
    //   ${util.inspect(clonedObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   不要な項目を削除する
    // --------------------------------------------------

    delete clonedObj.ids_idsArr;
    // delete clonedObj.hardwareActiveObj;
    // delete clonedObj.hardwareInactiveObj;
    delete clonedObj.hardwaresArr;
    delete clonedObj.imagesAndVideos_id;
    delete clonedObj.imagesAndVideosThumbnail_id;

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    // returnObj[valueObj._id] = clonedObj;
    // returnArr.push(valueObj._id);
    // returnObj[cardPlayers_id] = clonedObj;
    // returnArr.push(cardPlayers_id);

    returnObj[cardPlayers_id] = clonedObj;
    returnArr.push(clonedObj);
    return_idsArr.push(cardPlayers_id);
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  // return returnArr;

  return {
    obj: returnObj,
    arr: returnArr,
    _idsArr: return_idsArr,
  };
};

/**
 * フォーマットする / findFromSchemaCardPlayers で使用 [2020/04/08]
 * @param {Object} followsObj - ロケール
 * @param {string} loginUsers_id - DB users _id / ログイン中のユーザーID
 * @param {Array} arr - データの入った配列
 * @return {Object} フォーマットされたオブジェクト
 */
const formatCardPlayersArrFromSchemaCardPlayers = ({
  localeObj,
  loginUsers_id,
  arr,
}) => {
  // --------------------------------------------------
  //   Return Value
  // --------------------------------------------------

  const returnObj = {};
  // const returnArr = [];

  // --------------------------------------------------
  //   Loop
  // --------------------------------------------------

  for (let valueObj of arr) {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const exp = lodashGet(valueObj, ["usersObj", "exp"], 0);
    const accessDate = lodashGet(valueObj, ["usersObj", "accessDate"], "");
    const userID = lodashGet(valueObj, ["usersObj", "userID"], "");

    // const cardPlayerObj = lodashGet(valueObj, ['cardPlayerObj'], {});

    const cardPlayers_id = lodashGet(valueObj, ["_id"], "");
    const users_id = lodashGet(valueObj, ["users_id"], "");
    const imagesAndVideosObj = lodashGet(valueObj, ["imagesAndVideosObj"], {});
    const imagesAndVideosThumbnailObj = lodashGet(
      valueObj,
      ["imagesAndVideosThumbnailObj"],
      {}
    );
    const hardwareActiveArr = lodashGet(valueObj, ["hardwareActiveArr"], []);
    const hardwareInactiveArr = lodashGet(
      valueObj,
      ["hardwareInactiveArr"],
      []
    );
    const hardwaresArr = lodashGet(valueObj, ["hardwaresArr"], []);
    const followsObj = lodashGet(valueObj, ["followsObj"], {});
    const idsArr = lodashGet(valueObj, ["idsArr"], []);

    // --------------------------------------------------
    //   Deep Copy
    // --------------------------------------------------

    const clonedObj = lodashCloneDeep(valueObj);

    // --------------------------------------------------
    //   Format - 画像
    // --------------------------------------------------

    const formattedObj = formatImagesAndVideosObj({
      localeObj,
      obj: imagesAndVideosObj,
    });

    if (Object.keys(formattedObj).length !== 0) {
      clonedObj.imagesAndVideosObj = formattedObj;
    } else {
      delete clonedObj.imagesAndVideosObj;
    }

    // --------------------------------------------------
    //   Format - サムネイル画像
    // --------------------------------------------------

    const formattedThumbnailObj = formatImagesAndVideosObj({
      localeObj,
      obj: imagesAndVideosThumbnailObj,
    });

    if (Object.keys(formattedThumbnailObj).length !== 0) {
      clonedObj.imagesAndVideosThumbnailObj = formattedThumbnailObj;
    } else {
      delete clonedObj.imagesAndVideosThumbnailObj;
    }

    // --------------------------------------------------
    //   hardwareActive
    // --------------------------------------------------

    clonedObj.hardwareActiveArr = [];

    for (let value of hardwareActiveArr) {
      const obj = hardwaresArr.find((value2Obj) => {
        return value2Obj.hardwareID === value;
      });

      if (obj && "name" in obj) {
        clonedObj.hardwareActiveArr.push({
          name: obj.name,
        });
      }
    }

    // --------------------------------------------------
    //   hardwareInactive
    // --------------------------------------------------

    clonedObj.hardwareInactiveArr = [];

    for (let value of hardwareInactiveArr) {
      const obj = hardwaresArr.find((value2Obj) => {
        return value2Obj.hardwareID === value;
      });

      if (obj && "name" in obj) {
        clonedObj.hardwareInactiveArr.push({
          name: obj.name,
        });
      }
    }

    // --------------------------------------------------
    //   Format - Follows
    // --------------------------------------------------

    clonedObj.followsObj = formatFollowsObj({
      followsObj,
      adminUsers_id: users_id,
      loginUsers_id,
    });

    // --------------------------------------------------
    //   Format - IDs
    // --------------------------------------------------

    clonedObj.idsArr = formatIDsArr({
      localeObj,
      loginUsers_id,
      followsObj: clonedObj.followsObj,
      arr: idsArr,
    });

    // --------------------------------------------------
    //   usersObj
    // --------------------------------------------------

    clonedObj.usersObj = {
      exp,
      accessDate,
      userID,
    };

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@database/card-players/format.js - format
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   pathname: {green ${pathname}}
    // `);

    // console.log(`
    //   ----- clonedObj -----\n
    //   ${util.inspect(clonedObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   不要な項目を削除する
    // --------------------------------------------------

    delete clonedObj.ids_idsArr;
    // delete clonedObj.hardwareActiveObj;
    // delete clonedObj.hardwareInactiveObj;
    delete clonedObj.hardwaresArr;
    delete clonedObj.imagesAndVideos_id;
    delete clonedObj.imagesAndVideosThumbnail_id;

    // --------------------------------------------------
    //   Return
    // --------------------------------------------------

    returnObj[cardPlayers_id] = clonedObj;
    // returnArr.push(cardPlayers_id);
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return returnObj;

  // return {

  //   obj: returnObj,
  //   arr: returnArr,

  // };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  formatCardPlayersArr,
  formatCardPlayersArrFromSchemaCardPlayers,
};

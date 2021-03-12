// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

import shortid from "shortid";
import moment from "moment";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelGames from "app/@database/games/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { formatAndSave } from "app/@modules/image/save.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import {
  validationLanguage,
  validationCountry,
} from "app/@validations/language.js";

import { validationGames_idServer } from "app/@database/games/validations/_id-server.js";
import {
  validationGamesName,
  validationGamesSubtitle,
  validationGamesSortKeyword,
} from "app/@database/games/validations/name.js";
import { validationGamesURLID } from "app/@database/games/validations/url.js";
import { validationGamesTwitterHashtagsArr } from "app/@database/games/validations/twitter.js";
import { validationGamesSearchKeywordsArr } from "app/@database/games/validations/search.js";
import { validationGamesHardwareArrServer } from "app/@database/games/validations/hardware.js";
import { validationGamesLinkArr } from "app/@database/games/validations/link.js";

import { validationGameGenres_idsArrServer } from "app/@database/game-genres/validations/_id-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: XK1toMm5Z
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const returnObj = {};
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
    //   POST Data
    // --------------------------------------------------

    const bodyObj = JSON.parse(req.body);

    const {
      games_id,
      language,
      country,
      name,
      subtitle,
      sortKeyword,
      urlID,
      twitterHashtagsArr,
      searchKeywordsArr,
      genreArr = [],
      hardwareArr = [],
      linkArr,
      imagesAndVideosObj,
      imagesAndVideosThumbnailObj,
    } = bodyObj;

    lodashSet(requestParametersObj, ["games_id"], games_id);
    lodashSet(requestParametersObj, ["language"], language);
    lodashSet(requestParametersObj, ["country"], country);
    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["subtitle"], subtitle);
    lodashSet(requestParametersObj, ["sortKeyword"], sortKeyword);
    lodashSet(requestParametersObj, ["urlID"], urlID);
    lodashSet(requestParametersObj, ["twitterHashtagsArr"], twitterHashtagsArr);
    lodashSet(requestParametersObj, ["searchKeywordsArr"], searchKeywordsArr);
    lodashSet(requestParametersObj, ["genreArr"], genreArr);
    lodashSet(requestParametersObj, ["hardwareArr"], hardwareArr);
    lodashSet(requestParametersObj, ["linkArr"], linkArr);
    lodashSet(requestParametersObj, ["imagesAndVideosObj"], {});
    lodashSet(requestParametersObj, ["imagesAndVideosThumbnailObj"], {});

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Role
    // --------------------------------------------------

    const role = lodashGet(req, ["user", "role"], "user");
    const administrator = role === "administrator" ? true : false;

    // --------------------------------------------------
    //   Administrator Check
    // --------------------------------------------------

    if (!administrator) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "tY3zYBTXY", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });
    await validationLanguage({ throwError: true, value: language });
    await validationCountry({ throwError: true, value: country });

    if (games_id) {
      await validationGames_idServer({ value: games_id });
    }

    await validationGamesName({ throwError: true, value: name });
    await validationGamesSubtitle({ throwError: true, value: subtitle });
    await validationGamesSortKeyword({ throwError: true, value: sortKeyword });
    await validationGamesURLID({ throwError: true, value: urlID });
    await validationGamesSearchKeywordsArr({ arr: searchKeywordsArr });
    await validationGamesTwitterHashtagsArr({
      throwError: true,
      arr: twitterHashtagsArr,
    });
    await validationGameGenres_idsArrServer({ localeObj, arr: genreArr });
    await validationGamesHardwareArrServer({
      localeObj,
      valueArr: hardwareArr,
    });
    await validationGamesLinkArr({ throwError: true, valueArr: linkArr });

    // --------------------------------------------------
    //   データ取得　存在しない、または【編集権限】がない場合はエラーが投げられる
    // --------------------------------------------------

    let currentGamesObj = {};
    let oldImagesAndVideosObj = {};
    let oldImagesAndVideosThumbnailObj = {};

    if (games_id) {
      currentGamesObj = await ModelGames.findEditData({
        localeObj,
        games_id,
      });

      oldImagesAndVideosObj = lodashGet(
        currentGamesObj,
        ["imagesAndVideosObj"],
        {}
      );
      oldImagesAndVideosThumbnailObj = lodashGet(
        currentGamesObj,
        ["imagesAndVideosThumbnailObj"],
        {}
      );

      // console.log(`
      //   ----- currentGamesObj -----\n
      //   ${util.inspect(currentGamesObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   画像と動画の処理 - メイン画像
    // --------------------------------------------------

    let imagesAndVideosConditionObj = {};
    let imagesAndVideosSaveObj = {};
    let imagesAndVideos_id = "";

    if (imagesAndVideosObj) {
      // --------------------------------------------------
      //   画像を保存する
      // --------------------------------------------------

      const formatAndSaveObj = await formatAndSave({
        newObj: imagesAndVideosObj,
        oldObj: oldImagesAndVideosObj,
        loginUsers_id,
        ISO8601,
        heroImage: true,
      });

      // --------------------------------------------------
      //   imagesAndVideosSaveObj
      // --------------------------------------------------

      imagesAndVideosSaveObj = lodashGet(
        formatAndSaveObj,
        ["imagesAndVideosObj"],
        {}
      );

      // --------------------------------------------------
      //   画像＆動画がすべて削除されている場合は、imagesAndVideos_idを空にする
      // --------------------------------------------------

      const arr = lodashGet(imagesAndVideosSaveObj, ["arr"], []);

      if (arr.length === 0) {
        imagesAndVideos_id = "";
      } else {
        imagesAndVideos_id = lodashGet(imagesAndVideosSaveObj, ["_id"], "");
      }

      // --------------------------------------------------
      //   imagesAndVideosConditionObj
      // --------------------------------------------------

      imagesAndVideosConditionObj = {
        _id: lodashGet(imagesAndVideosSaveObj, ["_id"], ""),
      };
    }

    // --------------------------------------------------
    //   画像と動画の処理 - サムネイル画像
    // --------------------------------------------------

    let imagesAndVideosThumbnailConditionObj = {};
    let imagesAndVideosThumbnailSaveObj = {};
    let imagesAndVideosThumbnail_id = "";

    if (imagesAndVideosThumbnailObj) {
      // --------------------------------------------------
      //   画像を保存する
      // --------------------------------------------------

      const formatAndSaveObj = await formatAndSave({
        newObj: imagesAndVideosThumbnailObj,
        oldObj: oldImagesAndVideosThumbnailObj,
        loginUsers_id,
        ISO8601,
      });

      // --------------------------------------------------
      //   imagesAndVideosSaveObj
      // --------------------------------------------------

      imagesAndVideosThumbnailSaveObj = lodashGet(
        formatAndSaveObj,
        ["imagesAndVideosObj"],
        {}
      );

      // --------------------------------------------------
      //   画像＆動画がすべて削除されている場合は、imagesAndVideosThumbnail_id を空にする
      // --------------------------------------------------

      const arr = lodashGet(imagesAndVideosThumbnailSaveObj, ["arr"], []);

      if (arr.length === 0) {
        imagesAndVideosThumbnail_id = "";
      } else {
        imagesAndVideosThumbnail_id = lodashGet(
          imagesAndVideosThumbnailSaveObj,
          ["_id"],
          ""
        );
      }

      // --------------------------------------------------
      //   imagesAndVideosThumbnailConditionObj
      // --------------------------------------------------

      imagesAndVideosThumbnailConditionObj = {
        _id: lodashGet(imagesAndVideosThumbnailSaveObj, ["_id"], ""),
      };
    }

    // --------------------------------------------------
    //   hardwareArr
    // --------------------------------------------------

    let newHardwareArr = [];

    for (let valueObj of hardwareArr.values()) {
      let releaseDate = "";

      if (valueObj.releaseDate) {
        releaseDate = moment.utc(valueObj.releaseDate).toISOString();
      }

      newHardwareArr.push({
        _id: shortid.generate(),
        hardwareID: valueObj.hardwareID,
        releaseDate,
        playersMin: valueObj.playersMin,
        playersMax: valueObj.playersMax,
        publisherIDsArr: valueObj.publisherIDsArr,
        developerIDsArr: valueObj.developerIDsArr,
      });
    }

    // --------------------------------------------------
    //   linkArr
    // --------------------------------------------------

    let newLinkArr = [];

    for (let valueObj of linkArr.values()) {
      newLinkArr.push({
        _id: shortid.generate(),
        type: valueObj.type,
        label: valueObj.label,
        url: valueObj.url,
      });
    }

    // --------------------------------------------------
    //   Insert
    // --------------------------------------------------

    const gameCommunities_id = shortid.generate();

    // ---------------------------------------------
    //   - games
    // ---------------------------------------------

    let gamesConditionObj = {
      _id: shortid.generate(),
    };

    let gamesSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      gameCommunities_id,
      urlID,
      language,
      country,
      imagesAndVideos_id,
      imagesAndVideosThumbnail_id,
      name,
      subtitle,
      searchKeywordsArr,
      sortKeyword,
      twitterHashtagsArr,
      genreArr,
      genreSubArr: [],
      genreTagArr: [],
      hardwareArr: newHardwareArr,
      linkArr: newLinkArr,
    };

    // ---------------------------------------------
    //   - game-communities
    // ---------------------------------------------

    let gameCommunitiesConditionObj = {
      _id: gameCommunities_id,
    };

    let gameCommunitiesSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      forumObj: {
        threadCount: 1,
      },
      recruitmentObj: {
        threadCount: 0,
      },
      updatedDateObj: {
        forum: ISO8601,
        recruitment: ISO8601,
      },
      anonymity: false,
    };

    // ---------------------------------------------
    //   - forum-threads
    // ---------------------------------------------

    let forumThreadName = name;

    if (subtitle) {
      forumThreadName = `${name}${subtitle}`;
    }

    let forumThreadsConditionObj = {
      _id: shortid.generate(),
    };

    let forumThreadsSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      gameCommunities_id,
      userCommunities_id: "",
      users_id: "",
      localesArr: [
        {
          _id: shortid.generate(),
          language: "ja",
          name: `${forumThreadName}について語ろう！`,
          comment: "雑談でもなんでもOK！\nみんなで語りましょう！！",
        },
      ],
      imagesAndVideos_id: "",
      comments: 0,
      replies: 0,
      images: 0,
      videos: 0,
      acceptLanguage: "",
      ip: "127.0.0.1",
      userAgent: "",
    };

    // ---------------------------------------------
    //   - 更新
    // ---------------------------------------------

    if (Object.keys(currentGamesObj).length !== 0) {
      // ---------------------------------------------
      //   - games
      // ---------------------------------------------

      gamesConditionObj = {
        _id: games_id,
      };

      gamesSaveObj = {
        updatedDate: ISO8601,
        urlID,
        language,
        country,
        imagesAndVideos_id,
        imagesAndVideosThumbnail_id,
        name,
        subtitle,
        searchKeywordsArr,
        sortKeyword,
        twitterHashtagsArr,
        genreArr,
        genreSubArr: [],
        genreTagArr: [],
        hardwareArr: newHardwareArr,
        linkArr: newLinkArr,
      };

      // ---------------------------------------------
      //   - game-communities
      // ---------------------------------------------

      gameCommunitiesConditionObj = {};
      gameCommunitiesSaveObj = {};

      // ---------------------------------------------
      //   - forum-threads
      // ---------------------------------------------

      forumThreadsConditionObj = {};
      forumThreadsSaveObj = {};
    }

    // --------------------------------------------------
    //   DB upsert Transaction
    // --------------------------------------------------

    await ModelGames.transactionForUpsert({
      gamesConditionObj,
      gamesSaveObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
      forumThreadsConditionObj,
      forumThreadsSaveObj,
      imagesAndVideosConditionObj,
      imagesAndVideosSaveObj,
      imagesAndVideosThumbnailConditionObj,
      imagesAndVideosThumbnailSaveObj,
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/db/games/upsert.js
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   language: {green ${language}}
    //   country: {green ${country}}
    //   name: {green ${name}}
    //   subtitle: {green ${subtitle}}
    //   sortKeyword: {green ${sortKeyword}}
    //   urlID: {green ${urlID}}
    // `);

    // console.log(`
    //   ----- twitterHashtagsArr -----\n
    //   ${util.inspect(twitterHashtagsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- searchKeywordsArr -----\n
    //   ${util.inspect(searchKeywordsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- genreArr -----\n
    //   ${util.inspect(genreArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- hardwareArr -----\n
    //   ${util.inspect(hardwareArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosThumbnailObj -----\n
    //   ${util.inspect(imagesAndVideosThumbnailObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- gamesConditionObj -----\n
    //   ${util.inspect(gamesConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- gamesSaveObj -----\n
    //   ${util.inspect(gamesSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // return;

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
      endpointID: "XK1toMm5Z",
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

// --------------------------------------------------
//   config
// --------------------------------------------------

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

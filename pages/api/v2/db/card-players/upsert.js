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

import ModelCardPlayers from "app/@database/card-players/model.js";
import ModelUsers from "app/@database/users/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { formatAndSave } from "app/@modules/image/save.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import { validationBoolean } from "app/@validations/boolean.js";

import { validationCardPlayersName } from "app/@database/card-players/validations/name.js";
import { validationCardPlayersStatus } from "app/@database/card-players/validations/status.js";
import { validationCardPlayersComment } from "app/@database/card-players/validations/comment.js";
import {
  validationCardPlayersAge,
  validationCardPlayersAgeAlternativeText,
} from "app/@database/card-players/validations/age.js";
import {
  validationCardPlayersSex,
  validationCardPlayersSexAlternativeText,
} from "app/@database/card-players/validations/sex.js";
import { validationCardPlayersAddressAlternativeText } from "app/@database/card-players/validations/address.js";
import {
  validationCardPlayersGamingExperience,
  validationCardPlayersGamingExperienceAlternativeText,
} from "app/@database/card-players/validations/gaming-experience.js";
import { validationCardPlayersHobby } from "app/@database/card-players/validations/hobby.js";
import { validationCardPlayersSpecialSkill } from "app/@database/card-players/validations/special-skill.js";
import {
  validationCardPlayersSmartphoneModel,
  validationCardPlayersSmartphoneComment,
} from "app/@database/card-players/validations/smartphone.js";
import {
  validationCardPlayersTabletModel,
  validationCardPlayersTabletComment,
} from "app/@database/card-players/validations/tablet.js";
import {
  validationCardPlayersPCModel,
  validationCardPlayersPCComment,
  validationCardPlayersPCSpec,
} from "app/@database/card-players/validations/pc.js";
import { validationCardPlayersHardwareArrServer } from "app/@database/card-players/validations/hardware-server.js";
import { validationCardPlayersActivityTimeArr } from "app/@database/card-players/validations/activity-time.js";
import {
  validationCardPlayersLookingForFriendsValue,
  validationCardPlayersLookingForFriendsComment,
  validationCardPlayersLookingForFriendsIcon,
} from "app/@database/card-players/validations/looking-for-friends.js";
import {
  validationCardPlayersVoiceChatValue,
  validationCardPlayersVoiceChatComment,
} from "app/@database/card-players/validations/voice-chat.js";
import { validationCardPlayersLinkArr } from "app/@database/card-players/validations/link.js";

import { validationIDsArrServer } from "app/@database/ids/validations/_id-server.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: DKo69_LP9
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
  const experienceCalculateArr = [];

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
      _id,
      name,
      status,
      comment,
      age,
      ageAlternativeText,
      sex,
      sexAlternativeText,
      addressAlternativeText,
      gamingExperience,
      gamingExperienceAlternativeText,
      hobbiesArr,
      specialSkillsArr,
      smartphoneModel,
      smartphoneComment,
      tabletModel,
      tabletComment,
      pcModel,
      pcComment,
      pcSpecsObj,
      hardwareActiveArr,
      hardwareInactiveArr,
      idsArr,
      activityTimeArr,
      lookingForFriends,
      lookingForFriendsIcon,
      lookingForFriendsComment,
      voiceChat,
      voiceChatComment,
      linkArr,
      search,
      imagesAndVideosObj,
      imagesAndVideosThumbnailObj,
    } = bodyObj;

    lodashSet(requestParametersObj, ["_id"], _id);
    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["status"], status);
    lodashSet(requestParametersObj, ["comment"], comment);
    lodashSet(requestParametersObj, ["age"], age);
    lodashSet(requestParametersObj, ["ageAlternativeText"], ageAlternativeText);
    lodashSet(requestParametersObj, ["sex"], sex);
    lodashSet(requestParametersObj, ["sexAlternativeText"], sexAlternativeText);
    lodashSet(
      requestParametersObj,
      ["addressAlternativeText"],
      addressAlternativeText
    );
    lodashSet(requestParametersObj, ["gamingExperience"], gamingExperience);
    lodashSet(
      requestParametersObj,
      ["gamingExperienceAlternativeText"],
      gamingExperienceAlternativeText
    );
    lodashSet(requestParametersObj, ["hobbiesArr"], hobbiesArr);
    lodashSet(requestParametersObj, ["specialSkillsArr"], specialSkillsArr);
    lodashSet(requestParametersObj, ["smartphoneModel"], smartphoneModel);
    lodashSet(requestParametersObj, ["smartphoneComment"], smartphoneComment);
    lodashSet(requestParametersObj, ["tabletModel"], tabletModel);
    lodashSet(requestParametersObj, ["tabletComment"], tabletComment);
    lodashSet(requestParametersObj, ["pcModel"], pcModel);
    lodashSet(requestParametersObj, ["pcComment"], pcComment);
    lodashSet(requestParametersObj, ["pcSpecsObj"], pcSpecsObj);
    lodashSet(requestParametersObj, ["hardwareActiveArr"], hardwareActiveArr);
    lodashSet(
      requestParametersObj,
      ["hardwareInactiveArr"],
      hardwareInactiveArr
    );
    lodashSet(requestParametersObj, ["idsArr"], []);
    lodashSet(requestParametersObj, ["activityTimeArr"], activityTimeArr);
    lodashSet(requestParametersObj, ["lookingForFriends"], lookingForFriends);
    lodashSet(
      requestParametersObj,
      ["lookingForFriendsIcon"],
      lookingForFriendsIcon
    );
    lodashSet(
      requestParametersObj,
      ["lookingForFriendsComment"],
      lookingForFriendsComment
    );
    lodashSet(requestParametersObj, ["voiceChat"], voiceChat);
    lodashSet(requestParametersObj, ["voiceChatComment"], voiceChatComment);
    lodashSet(requestParametersObj, ["linkArr"], linkArr);
    lodashSet(requestParametersObj, ["search"], search);
    lodashSet(requestParametersObj, ["imagesAndVideosObj"], {});
    lodashSet(requestParametersObj, ["imagesAndVideosThumbnailObj"], {});

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Login Check
    // --------------------------------------------------

    if (!req.isAuthenticated()) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "Dm7DF-nDZ", messageID: "xLLNIpo6a" }],
      });
    }

    // --------------------------------------------------
    //   Validations
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationCardPlayersName({ throwError: true, value: name });
    await validationCardPlayersStatus({ throwError: true, value: status });
    await validationCardPlayersComment({ throwError: true, value: comment });
    await validationCardPlayersAge({ throwError: true, value: age });
    await validationCardPlayersAgeAlternativeText({
      throwError: true,
      value: ageAlternativeText,
    });
    await validationCardPlayersSex({ throwError: true, value: sex });
    await validationCardPlayersSexAlternativeText({
      throwError: true,
      value: sexAlternativeText,
    });
    await validationCardPlayersAddressAlternativeText({
      throwError: true,
      value: addressAlternativeText,
    });
    await validationCardPlayersGamingExperience({
      throwError: true,
      value: gamingExperience,
    });
    await validationCardPlayersGamingExperienceAlternativeText({
      throwError: true,
      value: gamingExperienceAlternativeText,
    });
    await validationCardPlayersHobby({
      throwError: true,
      valueArr: hobbiesArr,
    });
    await validationCardPlayersSpecialSkill({
      throwError: true,
      valueArr: specialSkillsArr,
    });
    await validationCardPlayersSmartphoneModel({
      throwError: true,
      value: smartphoneModel,
    });
    await validationCardPlayersSmartphoneComment({
      throwError: true,
      value: smartphoneComment,
    });
    await validationCardPlayersTabletModel({
      throwError: true,
      value: tabletModel,
    });
    await validationCardPlayersTabletComment({
      throwError: true,
      value: tabletComment,
    });
    await validationCardPlayersPCModel({ throwError: true, value: pcModel });
    await validationCardPlayersPCComment({
      throwError: true,
      value: pcComment,
    });
    await validationCardPlayersPCSpec({
      throwError: true,
      valueObj: pcSpecsObj,
    });

    const validatedHardwareActiveObj = await validationCardPlayersHardwareArrServer(
      { throwError: true, valueArr: hardwareActiveArr }
    );
    const validatedHardwareInactiveObj = await validationCardPlayersHardwareArrServer(
      { throwError: true, valueArr: hardwareInactiveArr }
    );
    const validatedIDsArrObj = await validationIDsArrServer({
      valueArr: idsArr,
      loginUsers_id,
    });

    await validationCardPlayersActivityTimeArr({
      throwError: true,
      valueArr: activityTimeArr,
    });
    await validationCardPlayersLookingForFriendsValue({
      throwError: true,
      value: lookingForFriends,
    });
    await validationCardPlayersLookingForFriendsIcon({
      throwError: true,
      value: lookingForFriendsIcon,
    });
    await validationCardPlayersLookingForFriendsComment({
      throwError: true,
      value: lookingForFriendsComment,
    });
    await validationCardPlayersVoiceChatValue({
      throwError: true,
      value: voiceChat,
    });
    await validationCardPlayersVoiceChatComment({
      throwError: true,
      value: voiceChatComment,
    });
    await validationCardPlayersLinkArr({ throwError: true, valueArr: linkArr });

    await validationBoolean({ throwError: true, value: search });

    // --------------------------------------------------
    //   データ取得　存在しない、または【編集権限】がない場合はエラーが投げられる
    // --------------------------------------------------

    const tempOldObj = await ModelCardPlayers.findOneForEdit({
      localeObj,
      loginUsers_id,
      cardPlayers_id: _id,
    });

    const oldImagesAndVideosObj = lodashGet(
      tempOldObj,
      ["imagesAndVideosObj"],
      {}
    );
    const oldImagesAndVideosThumbnailObj = lodashGet(
      tempOldObj,
      ["imagesAndVideosThumbnailObj"],
      {}
    );

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
      //   画像＆動画がすべて削除されている場合は、imagesAndVideos_id を空にする
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

      // --------------------------------------------------
      //   experience / card-player-upload-image-main
      // --------------------------------------------------

      experienceCalculateArr.push({
        type: "card-player-upload-image-main",
      });

      // if (imagesAndVideos_id) {

      //   experienceCalculateArr.push({
      //     type: 'card-player-upload-image-main',
      //   });

      // }
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

      // --------------------------------------------------
      //   experience / card-player-upload-image-thumbnail
      // --------------------------------------------------

      experienceCalculateArr.push({
        type: "card-player-upload-image-thumbnail",
      });

      // if (imagesAndVideosThumbnail_id) {

      //   experienceCalculateArr.push({
      //     type: 'card-player-upload-image-thumbnail',
      //   });

      // }
    }

    // --------------------------------------------------
    //   Insert
    // --------------------------------------------------

    // ---------------------------------------------
    //   - card-players
    // ---------------------------------------------

    let cardPlayersConditionObj = {};

    let cardPlayersSaveObj = {
      _id: shortid.generate(),
      createdDate: ISO8601,
      updatedDate: ISO8601,
      users_id: loginUsers_id,
      language: "ja",
      name,
      status,
      imagesAndVideos_id,
      imagesAndVideosThumbnail_id,
      comment,
      age,
      ageAlternativeText,
      sex,
      sexAlternativeText,
      address: "",
      addressAlternativeText,
      gamingExperience,
      gamingExperienceAlternativeText,
      hobbiesArr,
      specialSkillsArr,
      smartphoneModel,
      smartphoneComment,
      tabletModel,
      tabletComment,
      pcModel,
      pcComment,
      pcSpecsObj,
      hardwareActiveArr: validatedHardwareActiveObj.valueArr,
      hardwareInactiveArr: validatedHardwareInactiveObj.valueArr,
      ids_idsArr: validatedIDsArrObj.valueArr,
      activityTimeArr,
      lookingForFriends,
      lookingForFriendsIcon,
      lookingForFriendsComment,
      voiceChat,
      voiceChatComment,
      linkArr,
      search,
    };

    // --------------------------------------------------
    //   Update
    // --------------------------------------------------

    if (_id) {
      // --------------------------------------------------
      //   Card Players Condition Object
      // --------------------------------------------------

      cardPlayersConditionObj = {
        _id,
        users_id: loginUsers_id,
      };

      // --------------------------------------------------
      //   Card Players Save Object
      // --------------------------------------------------

      delete cardPlayersSaveObj._id;
      delete cardPlayersSaveObj.createdDate;
      delete cardPlayersSaveObj.users_id;

      cardPlayersSaveObj = {
        $set: cardPlayersSaveObj,
      };

      // --------------------------------------------------
      //   DB upsert Transaction
      // --------------------------------------------------

      await ModelCardPlayers.transactionForUpsert({
        cardPlayersConditionObj,
        cardPlayersSaveObj,
        imagesAndVideosConditionObj,
        imagesAndVideosSaveObj,
        imagesAndVideosThumbnailConditionObj,
        imagesAndVideosThumbnailSaveObj,
      });

      // --------------------------------------------------
      //   Insert
      //   現在、プレイヤーカードを新規追加する機能はないので更新だけ
      // --------------------------------------------------
    } else {
    }

    // --------------------------------------------------
    //   データ取得 / Card Players
    //   更新したプレイヤーカード情報
    // --------------------------------------------------

    const resultCardPlayersObj = await ModelCardPlayers.findForCardPlayers({
      localeObj,
      loginUsers_id,
      users_id: loginUsers_id,
    });

    returnObj.cardPlayersObj = resultCardPlayersObj.cardPlayersObj;

    // --------------------------------------------------
    //   experience
    // --------------------------------------------------

    experienceCalculateArr.push({
      type: "card-player-edit",
      calculation: "addition",
    });

    // experienceCalculateArr.push({
    //   type: 'card-player-upload-image-main',
    // });

    // experienceCalculateArr.push({
    //   type: 'card-player-upload-image-thumbnail',
    // });

    let experienceObj = {};

    if (experienceCalculateArr.length > 0) {
      experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: experienceCalculateArr,
      });
    }

    // ---------------------------------------------
    //   - 経験値が増減した場合のみヘッダーを更新する
    // ---------------------------------------------

    if (Object.keys(experienceObj).length !== 0) {
      returnObj.experienceObj = experienceObj;

      const headerObj = await ModelUsers.findHeader({
        localeObj,
        loginUsers_id,
        users_id: loginUsers_id,
      });

      returnObj.headerObj = headerObj;
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/card-players/upsert.js
    // `);

    // console.log(`
    //   ----- resultCardPlayersObj -----\n
    //   ${util.inspect(resultCardPlayersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
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
      endpointID: "DKo69_LP9",
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

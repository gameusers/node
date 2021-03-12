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

import ModelRecruitmentThreads from "app/@database/recruitment-threads/model.js";
import ModelUsers from "app/@database/users/model.js";
import ModelGameCommunities from "app/@database/game-communities/model.js";
import ModelWebPushes from "app/@database/web-pushes/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { formatAndSave } from "app/@modules/image/save.js";
import { setAuthority } from "app/@modules/authority.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";
import { validationBoolean } from "app/@validations/boolean.js";

import { validationGameCommunities_idServer } from "app/@database/game-communities/validations/_id-server.js";
import { validationHardwareIDsArrServer } from "app/@database/hardwares/validations/id-server.js";
import { validationIDsArrServer } from "app/@database/ids/validations/_id-server.js";
import {
  validationWebPushesSubscriptionObjEndpointServer,
  validationWebPushesSubscriptionObjKeysP256dhServer,
  validationWebPushesSubscriptionObjKeysAuthServer,
} from "app/@database/web-pushes/validations/subscription-server.js";

import { validationRecruitmentThreadsCategory } from "app/@database/recruitment-threads/validations/category.js";
import { validationRecruitmentThreadsTitle } from "app/@database/recruitment-threads/validations/title.js";
import { validationRecruitmentThreadsName } from "app/@database/recruitment-threads/validations/name.js";
import { validationRecruitmentThreadsComment } from "app/@database/recruitment-threads/validations/comment.js";
import {
  validationRecruitmentThreadsPlatform,
  validationRecruitmentThreadsID,
  validationRecruitmentThreadsInformationTitle,
  validationRecruitmentThreadsInformation,
  validationRecruitmentThreadsPublicSetting,
} from "app/@database/recruitment-threads/validations/ids-informations.js";
import { validationRecruitmentThreadsDeadlineDate } from "app/@database/recruitment-threads/validations/deadline.js";
import { validationRecruitmentThreadsLimit } from "app/@database/recruitment-threads/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: muKeCPjlC
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
      gameCommunities_id,
      recruitmentThreads_id,
      hardwareIDsArr,
      category = "",
      title,
      comment,
      imagesAndVideosObj,
      informationTitle1,
      informationTitle2,
      informationTitle3,
      informationTitle4,
      informationTitle5,
      information1,
      information2,
      information3,
      information4,
      information5,
      threadLimit,
      commentLimit,
      replyLimit,
    } = bodyObj;

    let {
      name,
      idsArr,
      platform1,
      platform2,
      platform3,
      id1,
      id2,
      id3,
      publicSetting,
      deadlineDate,
      webPushAvailable,
      webPushSubscriptionObj,
    } = bodyObj;

    // console.log(chalk`
    //   category: {green ${category} / typeof ${category}}
    // `);
    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(
      requestParametersObj,
      ["recruitmentThreads_id"],
      recruitmentThreads_id
    );
    lodashSet(requestParametersObj, ["hardwareIDsArr"], hardwareIDsArr);
    lodashSet(requestParametersObj, ["category"], category);
    lodashSet(requestParametersObj, ["title"], title);
    lodashSet(requestParametersObj, ["name"], name);
    lodashSet(requestParametersObj, ["comment"], comment);
    lodashSet(requestParametersObj, ["imagesAndVideosObj"], {});
    lodashSet(requestParametersObj, ["idsArr"], idsArr);
    lodashSet(requestParametersObj, ["platform1"], platform1);
    lodashSet(requestParametersObj, ["platform2"], platform2);
    lodashSet(requestParametersObj, ["platform3"], platform3);
    lodashSet(requestParametersObj, ["id1"], id1);
    lodashSet(requestParametersObj, ["id2"], id2);
    lodashSet(requestParametersObj, ["id3"], id3);
    lodashSet(requestParametersObj, ["informationTitle1"], informationTitle1);
    lodashSet(requestParametersObj, ["informationTitle2"], informationTitle2);
    lodashSet(requestParametersObj, ["informationTitle3"], informationTitle3);
    lodashSet(requestParametersObj, ["informationTitle4"], informationTitle4);
    lodashSet(requestParametersObj, ["informationTitle5"], informationTitle5);
    lodashSet(requestParametersObj, ["information1"], information1);
    lodashSet(requestParametersObj, ["information2"], information2);
    lodashSet(requestParametersObj, ["information3"], information3);
    lodashSet(requestParametersObj, ["information4"], information4);
    lodashSet(requestParametersObj, ["information5"], information5);
    lodashSet(requestParametersObj, ["publicSetting"], publicSetting);
    lodashSet(requestParametersObj, ["deadlineDate"], deadlineDate);
    lodashSet(requestParametersObj, ["webPushAvailable"], webPushAvailable);
    lodashSet(requestParametersObj, ["webPushSubscriptionObj"], {});
    lodashSet(requestParametersObj, ["threadLimit"], threadLimit);
    lodashSet(requestParametersObj, ["commentLimit"], commentLimit);
    lodashSet(requestParametersObj, ["replyLimit"], replyLimit);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   webPushSubscriptionObj
    // --------------------------------------------------

    const endpoint = lodashGet(webPushSubscriptionObj, ["endpoint"], "");
    const p256dh = lodashGet(webPushSubscriptionObj, ["keys", "p256dh"], "");
    const auth = lodashGet(webPushSubscriptionObj, ["keys", "auth"], "");

    // console.log(chalk`
    //   webPushAvailable: {green ${webPushAvailable}}
    //   endpoint: {green ${endpoint}}
    //   p256dh: {green ${p256dh}}
    //   auth: {green ${auth}}
    // `);

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationGameCommunities_idServer({ value: gameCommunities_id });
    await validationHardwareIDsArrServer({
      throwError: true,
      arr: hardwareIDsArr,
    });
    await validationRecruitmentThreadsCategory({
      throwError: true,
      value: category,
    });
    await validationRecruitmentThreadsTitle({ throwError: true, value: title });
    await validationRecruitmentThreadsName({ throwError: true, value: name });
    await validationRecruitmentThreadsComment({
      throwError: true,
      value: comment,
    });

    await validationRecruitmentThreadsInformationTitle({
      throwError: true,
      value: informationTitle1,
    });
    await validationRecruitmentThreadsInformationTitle({
      throwError: true,
      value: informationTitle2,
    });
    await validationRecruitmentThreadsInformationTitle({
      throwError: true,
      value: informationTitle3,
    });
    await validationRecruitmentThreadsInformationTitle({
      throwError: true,
      value: informationTitle4,
    });
    await validationRecruitmentThreadsInformationTitle({
      throwError: true,
      value: informationTitle5,
    });

    await validationRecruitmentThreadsInformation({
      throwError: true,
      value: information1,
    });
    await validationRecruitmentThreadsInformation({
      throwError: true,
      value: information2,
    });
    await validationRecruitmentThreadsInformation({
      throwError: true,
      value: information3,
    });
    await validationRecruitmentThreadsInformation({
      throwError: true,
      value: information4,
    });
    await validationRecruitmentThreadsInformation({
      throwError: true,
      value: information5,
    });

    await validationRecruitmentThreadsPublicSetting({
      throwError: true,
      value: publicSetting,
    });
    await validationRecruitmentThreadsDeadlineDate({
      throwError: true,
      value: deadlineDate,
    });

    await validationWebPushesSubscriptionObjEndpointServer({ value: endpoint });
    await validationWebPushesSubscriptionObjKeysP256dhServer({ value: p256dh });
    await validationWebPushesSubscriptionObjKeysAuthServer({ value: auth });

    await validationBoolean({ throwError: true, value: webPushAvailable });

    await validationRecruitmentThreadsLimit({
      throwError: true,
      required: true,
      value: threadLimit,
    });

    // --------------------------------------------------
    //   ID
    // --------------------------------------------------

    let validatedIDsArrObj = {};

    if (loginUsers_id) {
      validatedIDsArrObj = await validationIDsArrServer({
        valueArr: idsArr,
        loginUsers_id,
      });
    } else {
      await validationRecruitmentThreadsPlatform({
        throwError: true,
        value: platform1,
      });
      await validationRecruitmentThreadsPlatform({
        throwError: true,
        value: platform2,
      });
      await validationRecruitmentThreadsPlatform({
        throwError: true,
        value: platform3,
      });

      await validationRecruitmentThreadsID({ throwError: true, value: id1 });
      await validationRecruitmentThreadsID({ throwError: true, value: id2 });
      await validationRecruitmentThreadsID({ throwError: true, value: id3 });
    }

    // --------------------------------------------------
    //   スレッドが存在するかチェック
    // --------------------------------------------------

    let oldImagesAndVideosObj = {};
    let currentWebPushes_id = "";

    // --------------------------------------------------
    //   編集の場合
    // --------------------------------------------------

    if (recruitmentThreads_id) {
      // --------------------------------------------------
      //   データが存在しない　【編集権限】がない場合はエラーが投げられる
      // --------------------------------------------------

      const tempOldObj = await ModelRecruitmentThreads.findOneForEdit({
        req,
        localeObj,
        loginUsers_id,
        recruitmentThreads_id,
      });

      // console.log(`
      //   ----- tempOldObj -----\n
      //   ${util.inspect(tempOldObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   gameCommunities_id が不正な値の場合はエラー
      // --------------------------------------------------

      // if (tempOldObj.gameCommunities_id !== gameCommunities_id) {
      //   throw new CustomError({ level: 'warn', errorsArr: [{ code: '07FHI1SbZ', messageID: '3mDvfqZHV' }] });
      // }

      oldImagesAndVideosObj = lodashGet(tempOldObj, ["imagesAndVideosObj"], {});
      currentWebPushes_id = lodashGet(tempOldObj, ["webPushes_id"], "");

      // --------------------------------------------------
      //   新規の場合
      // --------------------------------------------------
    } else {
      // --------------------------------------------------
      //   同じ名前のスレッドが存在するかチェック
      //   count が 0 の場合は、同じ名前のスレッドは存在しない
      // --------------------------------------------------

      const count = await ModelRecruitmentThreads.count({
        conditionObj: {
          gameCommunities_id,
          "localesArr.title": title,
        },
      });

      // console.log(chalk`
      //   count: {green ${count}}
      // `);

      if (count > 0) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "PlYmFNcUT", messageID: "8ObqNYJ85" }],
        });
      }
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   deadlineDate / 締切日
    // --------------------------------------------------

    if (deadlineDate) {
      deadlineDate = moment(deadlineDate).utc().toISOString();
      // deadlineDate = moment(deadlineDate).utc().add(1, 'day').toISOString();
    }

    // --------------------------------------------------
    //   値の強制：ログインしている場合
    // --------------------------------------------------

    let ids_idsArr = [];

    if (loginUsers_id) {
      name = "";

      // Validationで有効なIDだけが抽出される
      ids_idsArr = lodashGet(validatedIDsArrObj, ["valueArr"], []);

      platform1 = "";
      platform2 = "";
      platform3 = "";
      id1 = "";
      id2 = "";
      id3 = "";

      // --------------------------------------------------
      //   値の強制：ログインしていない場合
      // --------------------------------------------------
    } else {
      ids_idsArr = [];
      publicSetting = 1;
    }

    // --------------------------------------------------
    //   ID / publicIDsArr
    // --------------------------------------------------

    const publicIDsArr = [];

    if (platform1 && id1) {
      publicIDsArr.push({
        _id: shortid.generate(),
        platform: platform1,
        id: id1,
      });
    }

    if (platform2 && id2) {
      publicIDsArr.push({
        _id: shortid.generate(),
        platform: platform2,
        id: id2,
      });
    }

    if (platform3 && id3) {
      publicIDsArr.push({
        _id: shortid.generate(),
        platform: platform3,
        id: id3,
      });
    }

    // --------------------------------------------------
    //   情報 / publicInformationsArr
    // --------------------------------------------------

    const publicInformationsArr = [];

    if (informationTitle1 && information1) {
      publicInformationsArr.push({
        _id: shortid.generate(),
        title: informationTitle1,
        information: information1,
      });
    }

    if (informationTitle2 && information2) {
      publicInformationsArr.push({
        _id: shortid.generate(),
        title: informationTitle2,
        information: information2,
      });
    }

    if (informationTitle3 && information3) {
      publicInformationsArr.push({
        _id: shortid.generate(),
        title: informationTitle3,
        information: information3,
      });
    }

    if (informationTitle4 && information4) {
      publicInformationsArr.push({
        _id: shortid.generate(),
        title: informationTitle4,
        information: information4,
      });
    }

    if (informationTitle5 && information5) {
      publicInformationsArr.push({
        _id: shortid.generate(),
        title: informationTitle5,
        information: information5,
      });
    }

    // --------------------------------------------------
    //   画像と動画の処理
    // --------------------------------------------------

    let imagesAndVideosConditionObj = {};
    let imagesAndVideosSaveObj = {};
    let imagesAndVideos_id = "";
    let images = 0;
    let videos = 0;

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
      //   画像数＆動画数
      // --------------------------------------------------

      images = lodashGet(formatAndSaveObj, ["images"], 0);
      videos = lodashGet(formatAndSaveObj, ["videos"], 0);

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
    //   Insert
    // --------------------------------------------------

    // ---------------------------------------------
    //   - users
    // ---------------------------------------------

    let usersConditionObj = {};
    let usersSaveObj = {};

    // ---------------------------------------------
    //   - web-pushes
    // ---------------------------------------------

    let webPushesConditionObj = {
      _id: shortid.generate(),
    };

    let webPushesSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      sendDate: "",
      users_id: loginUsers_id,
      subscriptionObj: {
        endpoint,
        keys: {
          p256dh,
          auth,
        },
      },
      sendTotalCount: 0,
      sendTodayCount: 0,
      errorCount: 0,
    };

    let webPushes_id = "";

    if (webPushAvailable && endpoint && p256dh && auth) {
      // ---------------------------------------------
      //   現在、DB users で使われている webPushes_id を取得する
      // ---------------------------------------------

      let currentUsersWebPushes_id = "";

      if (loginUsers_id) {
        const docUsersObj = await ModelUsers.findOne({
          conditionObj: {
            _id: loginUsers_id,
          },
        });

        currentUsersWebPushes_id = docUsersObj.webPushes_id;
      }

      // ---------------------------------------------
      //   - 更新
      // ---------------------------------------------

      if (currentWebPushes_id || currentUsersWebPushes_id) {
        webPushes_id = currentWebPushes_id || currentUsersWebPushes_id;

        // ---------------------------------------------
        //   既存のドキュメントを取得
        // ---------------------------------------------

        const docWebPushesObj = await ModelWebPushes.findOne({
          conditionObj: {
            _id: webPushes_id,
          },
        });

        // ---------------------------------------------
        //   subscription に変更があった場合のみ更新
        // ---------------------------------------------

        if (
          docWebPushesObj.subscriptionObj.endpoint !== endpoint ||
          docWebPushesObj.subscriptionObj.keys.p256dh !== p256dh ||
          docWebPushesObj.subscriptionObj.keys.auth !== auth
        ) {
          webPushesConditionObj._id = webPushes_id;

          webPushesSaveObj = {
            $set: {
              updatedDate: ISO8601,
              sendDate: "",
              subscriptionObj: {
                endpoint,
                keys: {
                  p256dh,
                  auth,
                },
              },
              sendTotalCount: 0,
              sendTodayCount: 0,
              errorCount: 0,
            },
          };

          // ---------------------------------------------
          //   subscription に変更がない場合は、DB web-pushes のドキュメントは更新しない
          // ---------------------------------------------
        } else {
          webPushesConditionObj = {};
          webPushesSaveObj = {};
        }

        // console.log(chalk`
        //   currentWebPushes_id: {green ${currentWebPushes_id}}
        //   currentUsersWebPushes_id: {green ${currentUsersWebPushes_id}}
        // `);

        // console.log(`
        //   ----------------------------------------\n
        //   web-pushes 更新

        //   ----- docWebPushesObj -----\n
        //   ${util.inspect(docWebPushesObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // ---------------------------------------------
        //   - 挿入
        // ---------------------------------------------
      } else {
        // ---------------------------------------------
        //   既存のデータを取得
        // ---------------------------------------------

        const docWebPushesObj = await ModelWebPushes.findOne({
          conditionObj: {
            "subscriptionObj.endpoint": endpoint,
            "subscriptionObj.keys.p256dh": p256dh,
            "subscriptionObj.keys.auth": auth,
          },
        });

        // ---------------------------------------------
        //   同じ subscription がすでに存在する場合、既存のものを利用し DB web-pushes に挿入はしない
        // ---------------------------------------------

        if (docWebPushesObj) {
          webPushes_id = docWebPushesObj._id;

          webPushesConditionObj = {};
          webPushesSaveObj = {};

          // ---------------------------------------------
          //   同じ subscription が存在しない場合、挿入
          // ---------------------------------------------
        } else {
          webPushes_id = webPushesConditionObj._id;
        }

        // ---------------------------------------------
        //   ログインしている場合、DB users に webPushes_id を保存
        // ---------------------------------------------

        if (loginUsers_id) {
          usersConditionObj = {
            _id: loginUsers_id,
          };

          usersSaveObj = {
            $set: {
              updatedDate: ISO8601,
              webPushes_id,
            },
          };
        }

        // console.log(chalk`
        //   endpoint: {green ${endpoint}}
        //   p256dh: {green ${p256dh}}
        //   auth: {green ${auth}}
        // `);

        // console.log(`
        //   ----------------------------------------\n
        //   web-pushes 挿入

        //   ----- docWebPushesObj -----\n
        //   ${util.inspect(docWebPushesObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }
    } else {
      webPushAvailable = false;
      webPushesConditionObj = {};
      webPushesSaveObj = {};
    }

    // ---------------------------------------------
    //   - recruitment-threads
    // ---------------------------------------------

    const recruitmentThreadsConditionObj = {
      _id: shortid.generate(),
    };

    const recruitmentThreadsSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      gameCommunities_id,
      users_id: loginUsers_id,
      hardwareIDsArr,
      category,
      localesArr: [
        {
          _id: shortid.generate(),
          language: localeObj.language,
          title,
          name,
          comment,
        },
      ],
      imagesAndVideos_id,
      ids_idsArr,
      publicIDsArr,
      publicInformationsArr,
      publicSetting,
      deadlineDate,
      webPushAvailable,
      webPushes_id,
      publicCommentsUsers_idsArr: [],
      publicApprovalUsers_idsArrr: [],
      comments: 0,
      replies: 0,
      images,
      videos,
      acceptLanguage,
      ip,
      userAgent,
    };

    // ---------------------------------------------
    //   - game-communities / 更新日時の変更＆スレッド総数 + 1
    // ---------------------------------------------

    const gameCommunitiesConditionObj = {
      _id: gameCommunities_id,
    };

    const gameCommunitiesSaveObj = {
      updatedDate: ISO8601,
      "updatedDateObj.recruitment": ISO8601,
      $inc: { "recruitmentObj.threadCount": 1 },
    };

    // ---------------------------------------------
    //   - notifications / 新規挿入の場合のみ
    // ---------------------------------------------

    let notificationsConditionObj = {};
    let notificationsSaveObj = {};

    if (!recruitmentThreads_id) {
      notificationsConditionObj = {
        _id: shortid.generate(),
      };

      notificationsSaveObj = {
        createdDate: ISO8601,
        done: false,
        type: "recruitment-threads",
        arr: [
          {
            _id: recruitmentThreadsConditionObj._id,
            type: "source",
            db: "recruitment-threads",
          },
        ],
      };
    }

    // --------------------------------------------------
    //   Update - 編集の場合、更新しない方がいいフィールドを削除する
    // --------------------------------------------------

    if (recruitmentThreads_id) {
      // ---------------------------------------------
      //   - recruitment-threads
      // ---------------------------------------------

      recruitmentThreadsConditionObj._id = recruitmentThreads_id;

      delete recruitmentThreadsSaveObj.createdDate;
      delete recruitmentThreadsSaveObj.gameCommunities_id;
      delete recruitmentThreadsSaveObj.users_id;
      delete recruitmentThreadsSaveObj.comments;
      delete recruitmentThreadsSaveObj.replies;
      delete recruitmentThreadsSaveObj.images;
      delete recruitmentThreadsSaveObj.videos;

      recruitmentThreadsSaveObj.$inc = { images, videos };

      // ---------------------------------------------
      //   - game-communities / $inc を削除して threadCount（ゲームコミュニティに記録するスレッド総数）を増やさない
      // ---------------------------------------------

      delete gameCommunitiesSaveObj.$inc;
    }

    // --------------------------------------------------
    //   DB upsert Transaction
    // --------------------------------------------------

    await ModelRecruitmentThreads.transactionForUpsert({
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
      imagesAndVideosConditionObj,
      imagesAndVideosSaveObj,
      gameCommunitiesConditionObj,
      gameCommunitiesSaveObj,
      webPushesConditionObj,
      webPushesSaveObj,
      usersConditionObj,
      usersSaveObj,
      notificationsConditionObj,
      notificationsSaveObj,
    });

    // --------------------------------------------------
    //   Set Authority / 非ログインユーザーに時間制限のある編集権限を与える
    // --------------------------------------------------

    if (!loginUsers_id) {
      setAuthority({ req, _id: recruitmentThreadsConditionObj._id });
    }

    // --------------------------------------------------
    //   DB find / Recruitments
    // --------------------------------------------------

    const recruitmentObj = await ModelRecruitmentThreads.findRecruitments({
      req,
      localeObj,
      loginUsers_id,
      gameCommunities_id,
      threadPage: 1,
      threadLimit,
      commentPage: 1,
      commentLimit,
      replyPage: 1,
      replyLimit,
    });

    returnObj.recruitmentThreadsObj = recruitmentObj.recruitmentThreadsObj;
    returnObj.recruitmentCommentsObj = recruitmentObj.recruitmentCommentsObj;
    returnObj.recruitmentRepliesObj = recruitmentObj.recruitmentRepliesObj;

    // --------------------------------------------------
    //   DB find / Game Community
    // --------------------------------------------------

    returnObj.gameCommunityObj = await ModelGameCommunities.findForGameCommunityByGameCommunities_id(
      {
        gameCommunities_id,
      }
    );

    // --------------------------------------------------
    //   experience
    // --------------------------------------------------

    if (!recruitmentThreads_id) {
      const experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: [
          {
            type: "recruitment-count-post",
            calculation: "addition",
          },
        ],
      });

      if (Object.keys(experienceObj).length !== 0) {
        returnObj.experienceObj = experienceObj;
      }
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/recruitment-threads/upsert.js
    // `);

    // console.log(`
    //   ----- hardwareIDsArr -----\n
    //   ${util.inspect(hardwareIDsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   gameCommunities_id: {green ${gameCommunities_id}}
    //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
    //   category: {green ${category}}
    //   title: {green ${title}}
    //   name: {green ${name}}
    //   comment: {green ${comment}}

    //   platform1: {green ${platform1}}
    //   id1: {green ${id1}}
    //   platform2: {green ${platform2}}
    //   id2: {green ${id2}}
    //   platform3: {green ${platform3}}
    //   id3: {green ${id3}}

    //   informationTitle1: {green ${informationTitle1}}
    //   information1: {green ${information1}}
    //   informationTitle2: {green ${informationTitle2}}
    //   information2: {green ${information2}}
    //   informationTitle3: {green ${informationTitle3}}
    //   information3: {green ${information3}}
    //   informationTitle4: {green ${informationTitle4}}
    //   information4: {green ${information4}}
    //   informationTitle5: {green ${informationTitle5}}
    //   information5: {green ${information5}}

    //   publicSetting: {green ${publicSetting}}

    //   deadlineDate: {green ${deadlineDate}}

    //   twitter: {green ${twitter}}
    //   webPush: {green ${webPush}}
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
      endpointID: "muKeCPjlC",
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

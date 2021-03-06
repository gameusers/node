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
import ModelRecruitmentComments from "app/@database/recruitment-comments/model.js";
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
import { validationIDsArrServer } from "app/@database/ids/validations/_id-server.js";
import {
  validationWebPushesSubscriptionObjEndpointServer,
  validationWebPushesSubscriptionObjKeysP256dhServer,
  validationWebPushesSubscriptionObjKeysAuthServer,
} from "app/@database/web-pushes/validations/subscription-server.js";

import { validationRecruitmentThreadsName } from "app/@database/recruitment-threads/validations/name.js";
import { validationRecruitmentThreadsComment } from "app/@database/recruitment-threads/validations/comment.js";
import {
  validationRecruitmentThreadsPlatform,
  validationRecruitmentThreadsID,
  validationRecruitmentThreadsInformationTitle,
  validationRecruitmentThreadsInformation,
  validationRecruitmentThreadsPublicSetting,
} from "app/@database/recruitment-threads/validations/ids-informations.js";
import { validationRecruitmentThreadsLimit } from "app/@database/recruitment-threads/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: 1X2JEdmdO
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
      recruitmentComments_id,
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
      webPushAvailable,
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
      webPushSubscriptionObj,
    } = bodyObj;

    lodashSet(requestParametersObj, ["gameCommunities_id"], gameCommunities_id);
    lodashSet(
      requestParametersObj,
      ["recruitmentThreads_id"],
      recruitmentThreads_id
    );
    lodashSet(
      requestParametersObj,
      ["recruitmentComments_id"],
      recruitmentComments_id
    );
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

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    await validationGameCommunities_idServer({ value: gameCommunities_id });
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
    //   ??????????????????????????????????????????
    // --------------------------------------------------

    let oldImagesAndVideosObj = {};
    let currentWebPushes_id = "";

    // --------------------------------------------------
    //   ???????????????
    // --------------------------------------------------

    if (recruitmentComments_id) {
      // --------------------------------------------------
      //   ?????????????????????????????????????????????????????????????????????????????????????????????
      // --------------------------------------------------

      const tempOldObj = await ModelRecruitmentComments.findOneForEdit({
        req,
        localeObj,
        loginUsers_id,
        recruitmentComments_id,
      });

      // console.log(`
      //   ----- tempOldObj -----\n
      //   ${util.inspect(tempOldObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   recruitmentThreads_id ????????????????????????????????????
      // --------------------------------------------------

      if (tempOldObj.recruitmentThreads_id !== recruitmentThreads_id) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "9gonCKlHZ", messageID: "3mDvfqZHV" }],
        });
      }

      oldImagesAndVideosObj = lodashGet(tempOldObj, ["imagesAndVideosObj"], {});
      currentWebPushes_id = lodashGet(tempOldObj, ["webPushes_id"], "");

      // --------------------------------------------------
      //   ??????????????? - ??????IP???????????????????????????10???????????????????????????????????????????????????
      // --------------------------------------------------
    } else {
      const dateTimeLimit = moment().utc().add(-10, "minutes");

      const count = await ModelRecruitmentComments.count({
        conditionObj: {
          gameCommunities_id,
          recruitmentThreads_id,
          "localesArr.comment": comment,
          createdDate: { $gt: dateTimeLimit },
          ip,
        },
      });

      // console.log(chalk`
      //   count: {green ${count}}
      // `);

      if (count > 0) {
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "sdOQZwxlv", messageID: "ffNAq3wYT" }],
        });
      }
    }

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   ?????????????????????????????????????????????
    // --------------------------------------------------

    let ids_idsArr = [];

    if (loginUsers_id) {
      name = "";

      // Validation????????????ID????????????????????????
      ids_idsArr = lodashGet(validatedIDsArrObj, ["valueArr"], []);

      platform1 = "";
      platform2 = "";
      platform3 = "";
      id1 = "";
      id2 = "";
      id3 = "";

      // --------------------------------------------------
      //   ????????????????????????????????????????????????
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
    //   ?????? / publicInformationsArr
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
    //   ????????????????????????
    // --------------------------------------------------

    let imagesAndVideosConditionObj = {};
    let imagesAndVideosSaveObj = {};
    let imagesAndVideos_id = "";
    let images = 0;
    let videos = 0;

    if (imagesAndVideosObj) {
      // --------------------------------------------------
      //   ?????????????????????
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
      //   ?????????????????????
      // --------------------------------------------------

      images = lodashGet(formatAndSaveObj, ["images"], 0);
      videos = lodashGet(formatAndSaveObj, ["videos"], 0);

      // --------------------------------------------------
      //   ????????????????????????????????????????????????????????????imagesAndVideos_id???????????????
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
    //   publicCommentsUsers_idsArr
    // --------------------------------------------------

    let publicCommentsUsers_idsArr = [];

    // ?????????????????????????????????????????????
    if (loginUsers_id && !recruitmentComments_id) {
      const recruitmentThreadsObj = await ModelRecruitmentThreads.findOne({
        conditionObj: {
          _id: recruitmentThreads_id,
        },
      });

      publicCommentsUsers_idsArr = lodashGet(
        recruitmentThreadsObj,
        ["publicCommentsUsers_idsArr"],
        []
      );

      if (!publicCommentsUsers_idsArr.includes(loginUsers_id)) {
        publicCommentsUsers_idsArr.push(loginUsers_id);
      }

      // console.log(`
      //   ----- recruitmentThreadsObj -----\n
      //   ${util.inspect(recruitmentThreadsObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- publicCommentsUsers_idsArr -----\n
      //   ${util.inspect(publicCommentsUsers_idsArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
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
      //   ?????????DB users ????????????????????? webPushes_id ???????????????
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
      //   - ??????
      // ---------------------------------------------

      if (currentWebPushes_id || currentUsersWebPushes_id) {
        webPushes_id = currentWebPushes_id || currentUsersWebPushes_id;

        // ---------------------------------------------
        //   ????????????????????????????????????
        // ---------------------------------------------

        const docWebPushesObj = await ModelWebPushes.findOne({
          conditionObj: {
            _id: webPushes_id,
          },
        });

        // ---------------------------------------------
        //   subscription ???????????????????????????????????????
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
          //   subscription ??????????????????????????????DB web-pushes ???????????????????????????????????????
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
        //   web-pushes ??????

        //   ----- docWebPushesObj -----\n
        //   ${util.inspect(docWebPushesObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // ---------------------------------------------
        //   - ??????
        // ---------------------------------------------
      } else {
        // ---------------------------------------------
        //   ???????????????????????????
        // ---------------------------------------------

        const docWebPushesObj = await ModelWebPushes.findOne({
          conditionObj: {
            "subscriptionObj.endpoint": endpoint,
            "subscriptionObj.keys.p256dh": p256dh,
            "subscriptionObj.keys.auth": auth,
          },
        });

        // ---------------------------------------------
        //   ?????? subscription ???????????????????????????????????????????????????????????? DB web-pushes ?????????????????????
        // ---------------------------------------------

        if (docWebPushesObj) {
          webPushes_id = docWebPushesObj._id;

          webPushesConditionObj = {};
          webPushesSaveObj = {};

          // ---------------------------------------------
          //   ?????? subscription ?????????????????????????????????
          // ---------------------------------------------
        } else {
          webPushes_id = webPushesConditionObj._id;
        }

        // ---------------------------------------------
        //   ?????????????????????????????????DB users ??? webPushes_id ?????????
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
        //   web-pushes ??????

        //   ----- docWebPushesObj -----\n
        //   ${util.inspect(docWebPushesObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }
    } else {
      webPushesConditionObj = {};
      webPushesSaveObj = {};
    }

    // ---------------------------------------------
    //   - recruitment-comments
    // ---------------------------------------------

    const recruitmentCommentsConditionObj = {
      _id: shortid.generate(),
    };

    const recruitmentCommentsSaveObj = {
      createdDate: ISO8601,
      updatedDate: ISO8601,
      gameCommunities_id,
      recruitmentThreads_id,
      users_id: loginUsers_id,
      localesArr: [
        {
          _id: shortid.generate(),
          language: localeObj.language,
          name,
          comment,
        },
      ],
      imagesAndVideos_id,
      ids_idsArr,
      publicIDsArr,
      publicInformationsArr,
      publicSetting,
      webPushAvailable,
      webPushes_id,
      goods: 0,
      replies: 0,
      acceptLanguage,
      ip,
      userAgent,
    };

    // ---------------------------------------------
    //   - recruitment-threads / ?????????????????? + 1
    // ---------------------------------------------

    const recruitmentThreadsConditionObj = {
      _id: recruitmentThreads_id,
    };

    let recruitmentThreadsSaveObj = {
      updatedDate: ISO8601,
      publicCommentsUsers_idsArr,
      $inc: { comments: 1, images, videos },
    };

    // ---------------------------------------------
    //   - game-communities / ?????????????????????
    // ---------------------------------------------

    const gameCommunitiesConditionObj = {
      _id: gameCommunities_id,
    };

    const gameCommunitiesSaveObj = {
      updatedDate: ISO8601,
      "updatedDateObj.recruitment": ISO8601,
    };

    // ---------------------------------------------
    //   - notifications / ???????????????????????????
    // ---------------------------------------------

    let notificationsConditionObj = {};
    let notificationsSaveObj = {};

    if (!recruitmentComments_id) {
      notificationsConditionObj = {
        _id: shortid.generate(),
      };

      notificationsSaveObj = {
        createdDate: ISO8601,
        done: false,
        type: "recruitment-comments",
        arr: [
          {
            _id: recruitmentThreadsConditionObj._id,
            type: "target",
            db: "recruitment-threads",
          },
          {
            _id: recruitmentCommentsConditionObj._id,
            type: "source",
            db: "recruitment-comments",
          },
        ],
      };
    }

    // --------------------------------------------------
    //   Update - ???????????????????????????????????????????????????????????????????????????
    // --------------------------------------------------

    if (recruitmentComments_id) {
      // ---------------------------------------------
      //   - recruitment-comments
      // ---------------------------------------------

      recruitmentCommentsConditionObj._id = recruitmentComments_id;

      delete recruitmentCommentsSaveObj.createdDate;
      delete recruitmentCommentsSaveObj.gameCommunities_id;
      delete recruitmentCommentsSaveObj.recruitmentThreads_id;
      delete recruitmentCommentsSaveObj.users_id;
      delete recruitmentCommentsSaveObj.goods;
      delete recruitmentCommentsSaveObj.replies;

      // ---------------------------------------------
      //   - recruitment-threads
      //   publicCommentsUsers_idsArr ???????????????????????????????????? / comments?????????????????????????????????????????????????????????????????????
      // ---------------------------------------------

      delete recruitmentThreadsSaveObj.publicCommentsUsers_idsArr;
      delete recruitmentThreadsSaveObj.$inc.comments;
    }

    // --------------------------------------------------
    //   DB upsert Transaction
    // --------------------------------------------------

    await ModelRecruitmentComments.transactionForUpsert({
      recruitmentThreadsConditionObj,
      recruitmentThreadsSaveObj,
      recruitmentCommentsConditionObj,
      recruitmentCommentsSaveObj,
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
    //   Set Authority / ???????????????????????????????????????????????????????????????????????????
    // --------------------------------------------------

    if (!loginUsers_id) {
      setAuthority({ req, _id: recruitmentCommentsConditionObj._id });
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

    if (!recruitmentComments_id) {
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
      endpointID: "1X2JEdmdO",
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

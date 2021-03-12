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

import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
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

import ModelGoods from "app/@database/goods/model.js";
import ModelForumComments from "app/@database/forum-comments/model.js";
import ModelRecruitmentComments from "app/@database/recruitment-comments/model.js";
import ModelRecruitmentReplies from "app/@database/recruitment-replies/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { verifyCsrfToken } from "app/@modules/csrf.js";
import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";
import { experienceCalculate } from "app/@modules/experience.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: URZ9Cq9nJ
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

    const { type, target_id } = bodyObj;

    lodashSet(requestParametersObj, ["type"], type);
    lodashSet(requestParametersObj, ["target_id"], target_id);

    // ---------------------------------------------
    //   Verify CSRF
    // ---------------------------------------------

    verifyCsrfToken(req, res);

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // --------------------------------------------------
    //   データを取得する
    // --------------------------------------------------

    let docObj = {};

    // --------------------------------------------------
    //   Forum Comment & Reply
    // --------------------------------------------------

    if (type === "forumComment" || type === "forumReply") {
      docObj = await ModelForumComments.findOne({
        conditionObj: {
          _id: target_id,
        },
      });

      // --------------------------------------------------
      //   Recruitment Comment
      // --------------------------------------------------
    } else if (type === "recruitmentComment") {
      docObj = await ModelRecruitmentComments.findOne({
        conditionObj: {
          _id: target_id,
        },
      });

      // --------------------------------------------------
      //   Recruitment Reply
      // --------------------------------------------------
    } else if (type === "recruitmentReply") {
      docObj = await ModelRecruitmentReplies.findOne({
        conditionObj: {
          _id: target_id,
        },
      });

      // --------------------------------------------------
      //   type が指定以外の値である場合、エラー
      // --------------------------------------------------
    } else {
      throw new CustomError({
        level: "info",
        errorsArr: [{ code: "Scx7-g2EE", messageID: "3mDvfqZHV" }],
      });
    }

    // console.log(`
    //   ----- docObj -----\n
    //   ${util.inspect(docObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   評価対象のデータがデータベースに見つからなかった場合、エラー
    // --------------------------------------------------

    if (!docObj) {
      throw new CustomError({
        level: "info",
        errorsArr: [{ code: "PiEzaVFrX", messageID: "cvS0qSAlE" }],
      });
    }

    // --------------------------------------------------
    //   自分を評価しようとした場合、エラー
    // --------------------------------------------------

    const targetUsers_id = lodashGet(docObj, ["users_id"], "");
    const targetIP = lodashGet(docObj, ["ip"], "");

    if (
      (targetUsers_id && loginUsers_id && targetUsers_id === loginUsers_id) ||
      targetIP === ip
    ) {
      statusCode = 403;
      throw new CustomError({
        level: "info",
        errorsArr: [{ code: "MX3nsHgs6", messageID: "x-g8kaDr7" }],
      });
    }

    // console.log(chalk`
    // type: {green ${type}}
    // target_id: {green ${target_id}}

    // targetIP: {green ${targetIP}}
    // ip: {green ${ip}}
    // targetUsers_id: {green ${targetUsers_id}}
    // loginUsers_id: {green ${loginUsers_id}}: {green ${loginUsers_id}}
    // `);

    // --------------------------------------------------
    //   すでに Good ボタンを押しているかチェックする
    // --------------------------------------------------

    let docGoodsObj = null;

    if (loginUsers_id) {
      docGoodsObj = await ModelGoods.findOne({
        conditionObj: {
          $and: [
            { target_id },
            {
              $or: [{ users_id: loginUsers_id }, { ip }],
            },
          ],
        },
      });

      // docGoodsObj = await ModelGoods.findOne({

      //   conditionObj: {
      //     $and: [
      //       { target_id },
      //       { users_id: loginUsers_id }
      //     ]
      //   }

      // });
    } else {
      docGoodsObj = await ModelGoods.findOne({
        conditionObj: {
          $and: [{ target_id }, { ip }],
        },
      });
    }

    // const docGoodsObj = await ModelGoods.findOne({

    //   conditionObj: {
    //     $and: [
    //       { target_id },
    //       {
    //         $or: [
    //           { users_id: loginUsers_id },
    //           { ip }
    //         ]
    //       }
    //     ]
    //   }

    // });

    const goods_id = lodashGet(docGoodsObj, ["_id"], "");

    // --------------------------------------------------
    //   Datetime
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   DB
    // --------------------------------------------------

    let goodsConditionObj = {};
    let goodsSaveObj = {};
    let forumCommentsConditionObj = {};
    let forumCommentsSaveObj = {};
    let recruitmentCommentsConditionObj = {};
    let recruitmentCommentsSaveObj = {};
    let recruitmentRepliesConditionObj = {};
    let recruitmentRepliesSaveObj = {};

    returnObj.result = true;

    // --------------------------------------------------
    //   減算 - delete
    // --------------------------------------------------

    if (docGoodsObj) {
      // ---------------------------------------------
      //   - goods
      // ---------------------------------------------

      goodsConditionObj = {
        _id: goods_id,
      };

      // ---------------------------------------------
      //   - forum-comments
      // ---------------------------------------------

      if (type === "forumComment" || type === "forumReply") {
        forumCommentsConditionObj = {
          _id: target_id,
        };

        forumCommentsSaveObj = {
          $inc: { goods: -1 },
        };
      }

      // ---------------------------------------------
      //   - recruitment-comments
      // ---------------------------------------------

      if (type === "recruitmentComment") {
        recruitmentCommentsConditionObj = {
          _id: target_id,
        };

        recruitmentCommentsSaveObj = {
          $inc: { goods: -1 },
        };
      }

      // ---------------------------------------------
      //   - recruitment-replies
      // ---------------------------------------------

      if (type === "recruitmentReply") {
        recruitmentRepliesConditionObj = {
          _id: target_id,
        };

        recruitmentRepliesSaveObj = {
          $inc: { goods: -1 },
        };
      }

      // ---------------------------------------------
      //   - result = false
      // ---------------------------------------------

      returnObj.result = false;

      // --------------------------------------------------
      //   加算 - insert
      // --------------------------------------------------
    } else {
      // ---------------------------------------------
      //   - goods
      // ---------------------------------------------

      goodsConditionObj = {
        _id: shortid.generate(),
      };

      goodsSaveObj = {
        createdDate: ISO8601,
        type,
        target_id,
        targetUsers_id,
        users_id: loginUsers_id,
        ip,
        userAgent,
      };

      // ---------------------------------------------
      //   - forum-comments
      // ---------------------------------------------

      if (type === "forumComment" || type === "forumReply") {
        forumCommentsConditionObj = {
          _id: target_id,
        };

        forumCommentsSaveObj = {
          $inc: { goods: +1 },
        };
      }

      // ---------------------------------------------
      //   - recruitment-comments
      // ---------------------------------------------

      if (type === "recruitmentComment") {
        recruitmentCommentsConditionObj = {
          _id: target_id,
        };

        recruitmentCommentsSaveObj = {
          $inc: { goods: +1 },
        };
      }

      // ---------------------------------------------
      //   - recruitment-replies
      // ---------------------------------------------

      if (type === "recruitmentReply") {
        recruitmentRepliesConditionObj = {
          _id: target_id,
        };

        recruitmentRepliesSaveObj = {
          $inc: { goods: +1 },
        };
      }
    }

    // --------------------------------------------------
    //   transaction
    // --------------------------------------------------

    await ModelGoods.transaction({
      goodsConditionObj,
      goodsSaveObj,
      forumCommentsConditionObj,
      forumCommentsSaveObj,
      recruitmentCommentsConditionObj,
      recruitmentCommentsSaveObj,
      recruitmentRepliesConditionObj,
      recruitmentRepliesSaveObj,
    });

    // --------------------------------------------------
    //   experience
    //   加算するときだけ通知を表示する
    // --------------------------------------------------

    if (!docGoodsObj) {
      // ---------------------------------------------
      //   - 自分がGoodボタンを押した
      // ---------------------------------------------

      const experienceObj = await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        arr: [
          {
            type: "good-count-click",
            calculation: "addition",
          },
        ],
      });

      if (Object.keys(experienceObj).length !== 0) {
        returnObj.experienceObj = experienceObj;
      }

      // ---------------------------------------------
      //   - Goodボタンを押された相手
      // ---------------------------------------------

      await experienceCalculate({
        req,
        localeObj,
        loginUsers_id,
        targetUsers_id,
        arr: [
          {
            type: "good-count-clicked",
            calculation: "addition",
          },
        ],
      });
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/db/goods/upsert.js
    // `);

    // console.log(`
    //   ----- docObj -----\n
    //   ${util.inspect(docObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- docGoodsObj -----\n
    //   ${util.inspect(docGoodsObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- goodsConditionObj -----\n
    //   ${util.inspect(goodsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- goodsSaveObj -----\n
    //   ${util.inspect(goodsSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsConditionObj -----\n
    //   ${util.inspect(forumCommentsConditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- forumCommentsSaveObj -----\n
    //   ${util.inspect(forumCommentsSaveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   loginUsers_id: {green ${loginUsers_id}}
    //   type: {green ${type}}
    //   target_id: {green ${target_id}}
    //   targetUsers_id: {green ${targetUsers_id}}
    //   targetIP: {green ${targetIP}}
    //   goods_id: {green ${goods_id}}
    // `);

    // console.log(`
    //   ----- resultObj -----\n
    //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
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
      endpointID: "URZ9Cq9nJ",
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

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '25mb',
//     },
//   },
// };

// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelGameCommunities from "app/@database/game-communities/model.js";
import ModelForumThreads from "app/@database/forum-threads/model.js";
import ModelFeeds from "app/@database/feeds/model.js";
import ModelRedirections from "app/@database/redirections/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationInteger } from "app/@validations/integer.js";
import {
  validationForumThreadsListLimit,
  validationForumThreadsLimit,
} from "app/@database/forum-threads/validations/limit.js";
import {
  validationForumCommentsLimit,
  validationForumRepliesLimit,
} from "app/@database/forum-comments/validations/limit.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// ---------------------------------------------
//   API
// ---------------------------------------------

import { initialProps } from "app/@api/v2/common.js";

// --------------------------------------------------
//   endpointID: 9aMdtckoT
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const requestParametersObj = {};
  const loginUsers_id = lodashGet(req, ["user", "_id"], "");
  const loginUsersRole = lodashGet(req, ["user", "role"], "");

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
    //   GET Data
    // --------------------------------------------------

    const urlID = lodashGet(req, ["query", "urlID"], "");
    const forumID = lodashGet(req, ["query", "forumID"], "");
    const threadListPage = parseInt(
      lodashGet(req, ["query", "threadListPage"], 1),
      10
    );
    const threadListLimit = parseInt(
      lodashGet(req, ["query", "threadListLimit"], ""),
      10
    );
    const threadPage = parseInt(lodashGet(req, ["query", "threadPage"], 1), 10);
    const threadLimit = parseInt(
      lodashGet(req, ["query", "threadLimit"], ""),
      10
    );
    const commentLimit = parseInt(
      lodashGet(req, ["query", "commentLimit"], ""),
      10
    );
    const replyLimit = parseInt(
      lodashGet(req, ["query", "replyLimit"], ""),
      10
    );

    lodashSet(requestParametersObj, ["urlID"], urlID);
    lodashSet(requestParametersObj, ["forumID"], forumID);
    lodashSet(
      requestParametersObj,
      ["threadListPage"],
      lodashGet(req, ["query", "threadListPage"], "")
    );
    lodashSet(
      requestParametersObj,
      ["threadListLimit"],
      lodashGet(req, ["query", "threadListLimit"], "")
    );
    lodashSet(
      requestParametersObj,
      ["threadPage"],
      lodashGet(req, ["query", "threadPage"], "")
    );
    lodashSet(
      requestParametersObj,
      ["threadLimit"],
      lodashGet(req, ["query", "threadLimit"], "")
    );
    lodashSet(
      requestParametersObj,
      ["commentLimit"],
      lodashGet(req, ["query", "commentLimit"], "")
    );
    lodashSet(
      requestParametersObj,
      ["replyLimit"],
      lodashGet(req, ["query", "replyLimit"], "")
    );

    // --------------------------------------------------
    //   Common Initial Props
    // --------------------------------------------------

    const returnObj = await initialProps({ req, localeObj });

    // --------------------------------------------------
    //   DB find / Game Community
    // --------------------------------------------------

    const gameCommunityObj = await ModelGameCommunities.findForGameCommunity({
      localeObj,
      loginUsers_id,
      urlID,
    });

    // console.log(`
    //   ----- gameCommunityObj -----\n
    //   ${util.inspect(gameCommunityObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   - コミュニティのデータがない場合
    // ---------------------------------------------

    if (!lodashHas(gameCommunityObj, ["gameCommunitiesObj", "_id"])) {
      // ---------------------------------------------
      //   リダイレクト先があるか調べる
      // ---------------------------------------------

      const redirectionsArr = await ModelRedirections.find({
        conditionObj: {
          source: { $in: [urlID, forumID] },
        },
      });

      let redirectionsGameUrl = "";
      let redirectionsForumID = "";
      let redirectionsType = "";

      for (let valueObj of redirectionsArr.values()) {
        if (valueObj.type === "gameUrlID") {
          redirectionsGameUrl = valueObj.destination;
        } else {
          redirectionsType = valueObj.type;
          redirectionsForumID = valueObj.destination;
        }
      }

      // console.log(chalk`
      // redirectionsGameUrl: {green ${redirectionsGameUrl}}
      // redirectionsForumID: {green ${redirectionsForumID}}
      // redirectionsType: {green ${redirectionsType}}
      // `);

      // console.log(`
      //   ----- redirectionsArr -----\n
      //   ${util.inspect(redirectionsArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   リダイレクト先がない場合は、404エラー
      // ---------------------------------------------

      const permittedTypesArr = [
        "forumThreadsGc",
        "forumCommentsGc",
        "forumRepliesGc",
      ];

      if (
        !redirectionsGameUrl ||
        (forumID && !redirectionsForumID) ||
        (redirectionsType && !permittedTypesArr.includes(redirectionsType))
      ) {
        statusCode = 404;
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "ZttxcVhNj", messageID: "Error" }],
        });
      }

      // ---------------------------------------------
      //   リダイレクト先
      // ---------------------------------------------

      returnObj.redirectObj = {
        urlID: redirectionsGameUrl,
        forumID: redirectionsForumID,
      };

      // console.log(`
      //   ----- returnObj.redirectObj -----\n
      //   ${util.inspect(returnObj.redirectObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    }

    // ---------------------------------------------
    //   - gameCommunities_id
    // ---------------------------------------------

    const gameCommunities_id = lodashGet(
      gameCommunityObj,
      ["gameCommunitiesObj", "_id"],
      ""
    );

    // ---------------------------------------------
    //   - headerObj
    // ---------------------------------------------

    returnObj.headerObj = gameCommunityObj.headerObj;

    // ---------------------------------------------
    //   - gameCommunityObj
    // ---------------------------------------------

    returnObj.gameCommunityObj = gameCommunityObj.gameCommunitiesObj;

    // --------------------------------------------------
    //   DB find / Feed
    // --------------------------------------------------

    returnObj.feedObj = await ModelFeeds.findFeed({
      localeObj,
      arr: ["all"],
    });

    // --------------------------------------------------
    //   権限
    //   0: ブロックしているユーザー
    //   1: 非ログインユーザー
    //   2: ログインユーザー（以下ログイン済みユーザー）
    //   3: フォロワー
    //   100: サイト運営
    // --------------------------------------------------

    const followsFollow = lodashGet(
      returnObj,
      ["headerObj", "followsObj", "follow"],
      false
    );
    const followsBlocked = lodashGet(
      returnObj,
      ["headerObj", "followsObj", "followBlocked"],
      false
    );

    returnObj.accessLevel = 1;

    // ---------------------------------------------
    //   - サイト運営
    // ---------------------------------------------

    if (loginUsersRole === "administrator") {
      returnObj.accessLevel = 100;

      // ---------------------------------------------
      //   - フォロワー
      // ---------------------------------------------
    } else if (followsFollow) {
      returnObj.accessLevel = 3;

      // ---------------------------------------------
      //   - ブロックしているユーザー
      // ---------------------------------------------
    } else if (followsBlocked) {
      returnObj.accessLevel = 0;

      // ---------------------------------------------
      //   - ログインユーザー
      // ---------------------------------------------
    } else if (loginUsersRole === "user") {
      returnObj.accessLevel = 2;
    }

    // --------------------------------------------------
    //   DB find / Forum Threads For List
    // --------------------------------------------------

    let argumentsObj = {
      localeObj,
      loginUsers_id,
      gameCommunities_id,
    };

    if (
      (await validationInteger({
        throwError: false,
        required: true,
        value: threadListPage,
      }).error) === false
    ) {
      argumentsObj.page = threadListPage;
    }

    if (
      (await validationForumThreadsListLimit({
        throwError: false,
        required: true,
        value: threadListLimit,
      }).error) === false
    ) {
      argumentsObj.limit = threadListLimit;
    }

    returnObj.forumThreadsForListObj = await ModelForumThreads.findForThreadsList(
      argumentsObj
    );

    // --------------------------------------------------
    //   フォーラムデータ取得
    // --------------------------------------------------

    argumentsObj = {
      req,
      localeObj,
      loginUsers_id,
      gameCommunities_id,
    };

    // ---------------------------------------------
    //   - forumID
    // ---------------------------------------------

    if (forumID) {
      argumentsObj.forumID = forumID;
    }

    // ---------------------------------------------
    //   - page & limit
    // ---------------------------------------------

    if (
      (await validationInteger({
        throwError: false,
        required: true,
        value: threadPage,
      }).error) === false
    ) {
      argumentsObj.threadPage = threadPage;
    }

    if (
      (await validationForumThreadsLimit({
        throwError: false,
        required: true,
        value: threadLimit,
      }).error) === false
    ) {
      argumentsObj.threadLimit = threadLimit;
    }

    if (
      (await validationForumCommentsLimit({
        throwError: false,
        required: true,
        value: commentLimit,
      }).error) === false
    ) {
      argumentsObj.commentLimit = commentLimit;
    }

    if (
      (await validationForumRepliesLimit({
        throwError: false,
        required: true,
        value: replyLimit,
      }).error) === false
    ) {
      argumentsObj.replyLimit = replyLimit;
    }

    // --------------------------------------------------
    //   forumIDでデータを取得
    //   この形式のURL http://localhost:8080/gc/Rainbow-Six-Siege/forum/LnmmG7AyXbkhe
    // --------------------------------------------------

    let forumObj = {};

    if (forumID) {
      // --------------------------------------------------
      //   DB find / Forum by forumID
      // --------------------------------------------------

      forumObj = await ModelForumThreads.findForumByforumID(argumentsObj);

      // ---------------------------------------------
      //   スレッドのデータがない場合はエラー
      // ---------------------------------------------

      const threadsDataObj = lodashGet(
        forumObj,
        ["forumThreadsObj", "dataObj"],
        {}
      );

      if (!returnObj.redirectObj && Object.keys(threadsDataObj).length === 0) {
        statusCode = 404;
        throw new CustomError({
          level: "warn",
          errorsArr: [{ code: "tz5ihO_-q", messageID: "Error" }],
        });
      }

      // --------------------------------------------------
      //   フォーラムをページで取得
      // --------------------------------------------------
    } else if (gameCommunities_id) {
      // ---------------------------------------------
      //   DB find / forum
      // ---------------------------------------------

      forumObj = await ModelForumThreads.findForForum(argumentsObj);

      // ---------------------------------------------
      //   2ページ目以降のスレッドのデータがない場合はエラー
      // ---------------------------------------------

      if (threadPage > 1) {
        const threadsDataObj = lodashGet(
          forumObj,
          ["forumThreadsObj", "dataObj"],
          {}
        );

        if (Object.keys(threadsDataObj).length === 0) {
          statusCode = 404;
          throw new CustomError({
            level: "warn",
            errorsArr: [{ code: "bq9lBcsBi", messageID: "Error" }],
          });
        }
      }
    }

    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    returnObj.forumThreadsObj = forumObj.forumThreadsObj;
    returnObj.forumCommentsObj = forumObj.forumCommentsObj;
    returnObj.forumRepliesObj = forumObj.forumRepliesObj;

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/gc/[urlID]/index.js
    // `);

    // console.log(chalk`
    //   urlID: {green ${urlID}}
    //   gameCommunities_id: {green ${gameCommunities_id}}
    // `);

    // console.log(`
    //   ----- returnObj.redirectObj -----\n
    //   ${util.inspect(returnObj.redirectObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(returnObj, { colors: true, depth: null })}\n
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
      endpointID: "9aMdtckoT",
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

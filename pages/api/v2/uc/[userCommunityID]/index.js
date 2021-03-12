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

import ModelUserCommunities from "app/@database/user-communities/model.js";
import ModelForumThreads from "app/@database/forum-threads/model.js";
import ModelUsers from "app/@database/users/model.js";
import ModelCardPlayers from "app/@database/card-players/model.js";
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
//   endpointID: R8-TcJ2vj
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

    const userCommunityID = lodashGet(req, ["query", "userCommunityID"], "");
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

    lodashSet(requestParametersObj, ["userCommunityID"], userCommunityID);
    lodashSet(requestParametersObj, ["forumID"], forumID);
    lodashSet(
      requestParametersObj,
      ["threadListPage"],
      lodashGet(req, ["query", "threadListPage"], 1)
    );
    lodashSet(
      requestParametersObj,
      ["threadListLimit"],
      lodashGet(req, ["query", "threadListLimit"], "")
    );
    lodashSet(
      requestParametersObj,
      ["threadPage"],
      lodashGet(req, ["query", "threadPage"], 1)
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

    const returnObj = await initialProps({ req, localeObj, type: "other" });

    // --------------------------------------------------
    //   DB find / User Community
    // --------------------------------------------------

    const userCommunityObj = await ModelUserCommunities.findForUserCommunity({
      localeObj,
      loginUsers_id,
      userCommunityID,
    });

    // ---------------------------------------------
    //   - コミュニティのデータがない場合はエラー
    // ---------------------------------------------

    if (userCommunityObj.name === "") {
      statusCode = 404;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "retRq6eFo", messageID: "Error" }],
      });
    }

    // ---------------------------------------------
    //   - userCommunities_id
    // ---------------------------------------------

    const userCommunities_id = lodashGet(userCommunityObj, ["_id"], "");

    // ---------------------------------------------
    //   - headerObj
    //   ユーザーがトップ画像をアップロードしていない場合は、ランダム取得の画像を代わりに利用する
    // ---------------------------------------------

    const imagesAndVideosObj = lodashGet(
      returnObj,
      ["headerObj", "imagesAndVideosObj"],
      {}
    );
    const userCommunityImagesAndVideosObj = lodashGet(
      userCommunityObj,
      ["headerObj", "imagesAndVideosObj"],
      {}
    );

    if (Object.keys(userCommunityImagesAndVideosObj).length === 0) {
      lodashSet(
        userCommunityObj,
        ["headerObj", "imagesAndVideosObj"],
        imagesAndVideosObj
      );
    }

    returnObj.headerObj = userCommunityObj.headerObj;

    delete userCommunityObj.headerObj;

    // ---------------------------------------------
    //   - userCommunityObj
    // ---------------------------------------------

    returnObj.userCommunityObj = userCommunityObj;

    // ---------------------------------------------
    //   - コンテンツを表示するかどうか
    // ---------------------------------------------

    const communityType = lodashGet(
      userCommunityObj,
      ["communityType"],
      "open"
    );
    const followsAdmin = lodashGet(
      returnObj,
      ["headerObj", "followsObj", "admin"],
      false
    );
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

    returnObj.accessRightRead = false;

    if (
      communityType === "open" ||
      (communityType === "closed" && followsFollow)
    ) {
      returnObj.accessRightRead = true;
    }

    // console.log(chalk`
    // communityType: {green ${communityType}}
    // followsFollow: {green ${followsFollow}}
    // threadPage: {green ${threadPage}}
    // forumID: {green ${forumID}}
    // returnObj.accessRightRead: {green ${returnObj.accessRightRead}}
    // `);

    // --------------------------------------------------
    //   フォーラムの2ページ以降、または個別のフォーラムを表示する際に、コンテンツの表示権限がない場合はエラー
    // --------------------------------------------------

    if ((threadPage !== 1 || forumID) && !returnObj.accessRightRead) {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "RNzXSgP2P", messageID: "Error" }],
      });
    }

    // --------------------------------------------------
    //   DB find / users / About の管理者情報用
    // --------------------------------------------------

    returnObj.userCommunitiesAdministratorObj = await ModelUsers.findOneForAbout(
      {
        localeObj,
        users_id: userCommunityObj.users_id,
      }
    );

    // console.log(`
    //   ----- returnObj.userCommunitiesAdministratorObj -----\n
    //   ${util.inspect(returnObj.userCommunitiesAdministratorObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

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
    //   3: コミュニティのメンバー
    //   50: コミュニティの管理者
    //   100: サイト運営
    // --------------------------------------------------

    returnObj.accessLevel = 1;

    // ---------------------------------------------
    //   - サイト運営
    // ---------------------------------------------

    if (loginUsersRole === "administrator") {
      returnObj.accessLevel = 100;

      // ---------------------------------------------
      //   - コミュニティの管理者
      // ---------------------------------------------
    } else if (followsAdmin) {
      returnObj.accessLevel = 50;

      // ---------------------------------------------
      //   - コミュニティのメンバー
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
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /pages/api/v2/uc/[userCommunityID]/index.js
    // `);

    // console.log(`
    //   ----- userCommunityObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(userCommunityObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- userCommunityImagesAndVideosObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(userCommunityImagesAndVideosObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   communityType: {green ${communityType}}
    //   member: {green ${member}}
    //   returnObj.accessRightRead: {green ${returnObj.accessRightRead}}
    // `);

    // --------------------------------------------------
    //   コンテンツを表示していい場合はフォーラムのデータを取得
    // --------------------------------------------------

    let forumObj = {};

    if (returnObj.accessRightRead) {
      // --------------------------------------------------
      //   DB find / スレッド一覧取得
      // --------------------------------------------------

      let argumentsObj = {
        localeObj,
        loginUsers_id,
        userCommunities_id,
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
      //   フォーラムのデータ取得
      // --------------------------------------------------

      argumentsObj = {
        req,
        localeObj,
        loginUsers_id,
        userCommunities_id,
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
      //   この形式のURL http://localhost:8080/uc/community1/forum/o7PT5QCC6GwD
      // --------------------------------------------------

      if (forumID) {
        // --------------------------------------------------
        //   DB find / Forum by forumID
        // --------------------------------------------------

        forumObj = await ModelForumThreads.findForumByforumID(argumentsObj);

        // console.log(`
        //   ----- forumObj -----\n
        //   ${util.inspect(forumObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // ---------------------------------------------
        //   フォーラムのデータがない場合はリダイレクト先があるか調べる
        // ---------------------------------------------

        const threadsDataObj = lodashGet(
          forumObj,
          ["forumThreadsObj", "dataObj"],
          {}
        );

        if (Object.keys(threadsDataObj).length === 0) {
          const redirectionsObj = await ModelRedirections.findOne({
            conditionObj: {
              source: forumID,
            },
          });

          // console.log(`
          //   ----- redirectionsObj -----\n
          //   ${util.inspect(redirectionsObj, { colors: true, depth: null })}\n
          //   --------------------\n
          // `);

          // ---------------------------------------------
          //   リダイレクト先がない場合は、404エラー
          // ---------------------------------------------

          if (!redirectionsObj) {
            statusCode = 404;
            throw new CustomError({
              level: "warn",
              errorsArr: [{ code: "moIaMhxro", messageID: "Error" }],
            });
          }

          // ---------------------------------------------
          //   リダイレクト先
          // ---------------------------------------------

          lodashSet(
            returnObj,
            ["redirectObj", "forumID"],
            lodashGet(redirectionsObj, ["destination"], "")
          );

          // console.log(`
          //   ----- returnObj.redirectObj -----\n
          //   ${util.inspect(returnObj.redirectObj, { colors: true, depth: null })}\n
          //   --------------------\n
          // `);
        }

        // --------------------------------------------------
        //   フォーラムをページで取得
        // --------------------------------------------------
      } else {
        // ---------------------------------------------
        //   DB find / forum
        // ---------------------------------------------

        forumObj = await ModelForumThreads.findForForum(argumentsObj);

        // ---------------------------------------------
        //   スレッドのデータがない場合はエラー
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
              errorsArr: [{ code: "zbbRej-eH", messageID: "Error" }],
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
    }

    // console.log(`
    //   ----- returnObj.forumRepliesObj -----\n
    //   ${util.inspect(returnObj.forumRepliesObj, { colors: true, depth: null })}\n
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
      endpointID: "R8-TcJ2vj",
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

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

import React, { useState, useEffect } from "react";
import Error from "next/error";
import moment from "moment";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";
import { ContainerStateCommunity } from "app/@states/community.js";
import { ContainerStateForum } from "app/@states/forum.js";
import { ContainerStateRecruitment } from "app/@states/recruitment.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { createCsrfToken } from "app/@modules/csrf.js";
import { getCookie, setCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Layout from "app/common/layout/v2/layout.js";
import Breadcrumbs from "app/common/layout/v2/breadcrumbs.js";
import FeedSidebar from "app/common/feed/v2/sidebar.js";

import FollowNavigation from "app/common/follow/v2/navigation.js";
import FollowContents from "app/common/follow/v2/contents.js";

// --------------------------------------------------
//   Function Components
//   URL: http://localhost:8080/ur/***/follow
// --------------------------------------------------

/**
 * レイアウト
 * @param {Object} props - Props
 */
const ContainerLayout = (props) => {
  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();
  const stateForum = ContainerStateForum.useContainer();
  const stateRecruitment = ContainerStateRecruitment.useContainer();

  const { handleScrollTo } = stateLayout;
  const {
    setForumThreadsObj,
    setForumCommentsObj,
    setForumRepliesObj,
  } = stateForum;
  const {
    setRecruitmentThreadsObj,
    setRecruitmentCommentsObj,
    setRecruitmentRepliesObj,
  } = stateRecruitment;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  useEffect(() => {
    // --------------------------------------------------
    //   Router.push でページを移動した際の処理
    //   getServerSideProps でデータを取得してからデータを更新する
    // --------------------------------------------------

    setRecruitmentThreadsObj(props.recruitmentThreadsObj);
    setRecruitmentCommentsObj(props.recruitmentCommentsObj);
    setRecruitmentRepliesObj(props.recruitmentRepliesObj);
    setForumThreadsObj(props.forumThreadsObj);
    setForumCommentsObj(props.forumCommentsObj);
    setForumRepliesObj(props.forumRepliesObj);

    // ---------------------------------------------
    //   Scroll To
    // ---------------------------------------------

    // handleScrollTo({

    //   to: 'recruitmentThreads',
    //   duration: 0,
    //   delay: 0,
    //   smooth: 'easeInOutQuart',
    //   offset: -50,

    // });

    // if (props.category === 'page') {

    //   handleScrollTo({

    //     to: 'recruitmentThreads',
    //     duration: 0,
    //     delay: 0,
    //     smooth: 'easeInOutQuart',
    //     offset: -50,

    //   });

    // }
  }, [props.ISO8601]);

  // --------------------------------------------------
  //   Component - Sidebar
  // --------------------------------------------------

  const componentSidebar = (
    <React.Fragment>
      <Breadcrumbs arr={props.breadcrumbsArr} sidebar={true} />

      <FollowNavigation
        accessLevel={props.accessLevel}
        userID={props.userID}
        contentsOrList="contents"
        category={props.category}
        contents={props.contents}
        period={props.period}
      />

      <FeedSidebar feedObj={props.feedObj} />
    </React.Fragment>
  );
  // --------------------------------------------------
  //   Component - Contents
  // --------------------------------------------------

  const componentContent = (
    <React.Fragment>
      <Breadcrumbs arr={props.breadcrumbsArr} />

      <FollowContents
        userID={props.userID}
        category={props.category}
        contents={props.contents}
        pageObj={props.pageObj}
        gameCommunityObj={props.gameCommunityObj}
        userCommunityObj={props.userCommunityObj}
      />
    </React.Fragment>
  );
  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Layout
      metaObj={props.metaObj}
      componentSidebar={componentSidebar}
      componentContent={componentContent}
      headerObj={props.headerObj}
      headerNavMainArr={props.headerNavMainArr}
    />
  );
};

/**
 * コンポーネント / このページ独自のステートを設定する
 * @param {Object} props - Props
 */
const Component = (props) => {
  // --------------------------------------------------
  //   Error
  //   参考：https://nextjs.org/docs/advanced-features/custom-error-page#reusing-the-built-in-error-page
  // --------------------------------------------------

  if (props.statusCode !== 200) {
    return <Error statusCode={props.statusCode} />;
  }

  // --------------------------------------------------
  //   unstated-next - Initial State
  // --------------------------------------------------

  const initialStateObj = {
    forumThreadsObj: props.forumThreadsObj,
    forumCommentsObj: props.forumCommentsObj,
    forumRepliesObj: props.forumRepliesObj,

    recruitmentThreadsObj: props.recruitmentThreadsObj,
    recruitmentCommentsObj: props.recruitmentCommentsObj,
    recruitmentRepliesObj: props.recruitmentRepliesObj,
  };

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <ContainerStateCommunity.Provider initialState={initialStateObj}>
      <ContainerStateForum.Provider initialState={initialStateObj}>
        <ContainerStateRecruitment.Provider initialState={initialStateObj}>
          <ContainerLayout {...props} />
        </ContainerStateRecruitment.Provider>
      </ContainerStateForum.Provider>
    </ContainerStateCommunity.Provider>
  );
};

/**
 * getServerSideProps
 * @param {Object} req - リクエスト
 * @param {Object} res - レスポンス
 * @param {Object} query - クエリー
 */
export async function getServerSideProps({ req, res, query }) {
  // --------------------------------------------------
  //   CSRF
  // --------------------------------------------------

  createCsrfToken(req, res);

  // --------------------------------------------------
  //   Cookie & Accept Language
  // --------------------------------------------------

  const reqHeadersCookie = lodashGet(req, ["headers", "cookie"], "");
  const reqAcceptLanguage = lodashGet(req, ["headers", "accept-language"], "");

  // --------------------------------------------------
  //   Query
  // --------------------------------------------------

  const userID = query.userID;
  const slugsArr = lodashGet(query, ["slug"], []);

  let category = "all";
  let contents = "all";
  let page = 1;

  if (slugsArr[0] === "forum" || slugsArr[0] === "rec") {
    contents = slugsArr[0];
  } else if (
    slugsArr[0] === "gc" ||
    slugsArr[0] === "uc" ||
    slugsArr[0] === "ur"
  ) {
    category = slugsArr[0];

    if (slugsArr[1] === "forum" || slugsArr[1] === "rec") {
      contents = slugsArr[1];
    }
  }

  if (Math.sign(slugsArr[0]) === 1) {
    page = slugsArr[0];
  } else if (Math.sign(slugsArr[1]) === 1) {
    page = slugsArr[1];
  } else if (Math.sign(slugsArr[2]) === 1) {
    page = slugsArr[2];
  }

  // console.log(`
  //   ----- slugsArr -----\n
  //   ${util.inspect(slugsArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  // category: {green ${category}}
  // contents: {green ${contents}}
  // page: {green ${page}}
  // `);

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const ISO8601 = moment().utc().toISOString();

  // --------------------------------------------------
  //   Get Cookie Data
  // --------------------------------------------------

  const termsOfServiceAgreedVersion = getCookie({
    key: "termsOfServiceAgreedVersion",
    reqHeadersCookie,
  });

  const period = getCookie({ key: "followContentsPeriod", reqHeadersCookie });
  const limit = getCookie({ key: "followContentsLimit", reqHeadersCookie });

  const forumCommentLimit = getCookie({
    key: "forumCommentLimit",
    reqHeadersCookie,
  });
  const forumReplyLimit = getCookie({
    key: "forumReplyLimit",
    reqHeadersCookie,
  });

  const recruitmentCommentLimit = getCookie({
    key: "recruitmentCommentLimit",
    reqHeadersCookie,
  });
  const recruitmentReplyLimit = getCookie({
    key: "recruitmentReplyLimit",
    reqHeadersCookie,
  });

  // --------------------------------------------------
  //   Fetch
  // --------------------------------------------------

  const resultObj = await fetchWrapper({
    urlApi: encodeURI(
      `${process.env.NEXT_PUBLIC_URL_API}/v2/ur/${userID}/follow/contents?category=${category}&contents=${contents}&period=${period}&page=${page}&limit=${limit}&forumCommentLimit=${forumCommentLimit}&forumReplyLimit=${forumReplyLimit}&recruitmentCommentLimit=${recruitmentCommentLimit}&recruitmentReplyLimit=${recruitmentReplyLimit}`
    ),
    methodType: "GET",
    reqHeadersCookie,
    reqAcceptLanguage,
  });

  const statusCode = lodashGet(resultObj, ["statusCode"], 400);
  const dataObj = lodashGet(resultObj, ["data"], {});

  // --------------------------------------------------
  //   dataObj
  // --------------------------------------------------

  const login = lodashGet(dataObj, ["login"], false);
  const loginUsersObj = lodashGet(dataObj, ["loginUsersObj"], {});
  const accessLevel = lodashGet(dataObj, ["accessLevel"], 1);
  const headerObj = lodashGet(dataObj, ["headerObj"], {});
  const experienceObj = lodashGet(dataObj, ["experienceObj"], {});
  const feedObj = lodashGet(dataObj, ["feedObj"], {});

  const pagesArr = lodashGet(dataObj, ["pagesObj", "arr"], []);

  const pageObj = lodashGet(dataObj, ["pageObj"], {});

  const forumThreadsObj = lodashGet(
    dataObj,
    ["forumObj", "forumThreadsObj"],
    {}
  );
  const forumCommentsObj = lodashGet(
    dataObj,
    ["forumObj", "forumCommentsObj"],
    {}
  );
  const forumRepliesObj = lodashGet(
    dataObj,
    ["forumObj", "forumRepliesObj"],
    {}
  );

  const recruitmentThreadsObj = lodashGet(
    dataObj,
    ["recruitmentObj", "recruitmentThreadsObj"],
    {}
  );
  const recruitmentCommentsObj = lodashGet(
    dataObj,
    ["recruitmentObj", "recruitmentCommentsObj"],
    {}
  );
  const recruitmentRepliesObj = lodashGet(
    dataObj,
    ["recruitmentObj", "recruitmentRepliesObj"],
    {}
  );

  const gameCommunityObj = lodashGet(dataObj, ["gameCommunityObj"], {});
  const userCommunityObj = lodashGet(dataObj, ["userCommunityObj"], {});

  // --------------------------------------------------
  //   Title
  // --------------------------------------------------

  const pagesObj = pagesArr.find((valueObj) => {
    return valueObj.type === "follow";
  });

  const userName = lodashGet(headerObj, ["name"], "");
  const pageTitle = lodashGet(pagesObj, ["title"], userName);

  const titlesArr = [];

  if (category === "gc") {
    titlesArr.push("ゲームコミュニティ");
  } else if (category === "uc") {
    titlesArr.push("ユーザーコミュニティ");
  } else if (category === "ur") {
    titlesArr.push("ユーザー");
  }

  if (contents === "forum") {
    titlesArr.push("フォーラム");
  } else if (contents === "rec") {
    titlesArr.push("募集");
  }

  const titles = titlesArr.length > 0 ? ` > ${titlesArr.join(" > ")}` : "";
  const title = `フォロー${titles} - ${pageTitle}`;

  const metaObj = {
    title,
    description: `${userName}さんのフォローページです。`,
    type: "article",
    url: `${process.env.NEXT_PUBLIC_URL_BASE}ur/${userID}/follow`,
    image: "",
  };

  // アップロードされた画像がある場合は、OGPの画像に設定する
  const imageSrc = lodashGet(
    headerObj,
    ["imagesAndVideosObj", "arr", 0, "src"],
    ""
  );

  if (imageSrc.indexOf("/img/ur/") !== -1) {
    metaObj.image = `${process.env.NEXT_PUBLIC_URL_BASE}${imageSrc}`.replace(
      "//img",
      "/img"
    );
  }

  // --------------------------------------------------
  //   Header Navigation Link
  // --------------------------------------------------

  const headerNavMainArr = [
    {
      name: "トップ",
      href: `/ur/${userID}`,
      active: false,
    },

    {
      name: "フォロー",
      href: `/ur/${userID}/follow`,
      active: true,
    },
  ];

  if (accessLevel >= 50) {
    headerNavMainArr.push({
      name: "設定",
      href: `/ur/${userID}/setting`,
      active: false,
    });
  }

  // --------------------------------------------------
  //   パンくずリスト
  // --------------------------------------------------

  const breadcrumbsArr = [
    {
      type: "ur",
      anchorText: "",
      href: `/ur/${userID}`,
    },

    {
      type: "ur/follow",
      anchorText: "",
      href: "",
    },
  ];

  // ---------------------------------------------
  //   Set Cookie - recentAccessPage
  // ---------------------------------------------

  setCookie({
    key: "recentAccessPageUrl",
    value: `/ur/${userID}/follow`,
    expires: 0,
    res,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /pages/ur/[userID]/follow/index.js
  // `);

  // console.log(`
  //   ----- resultObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    props: {
      reqAcceptLanguage,
      ISO8601,
      termsOfServiceAgreedVersion,
      statusCode,
      login,
      loginUsersObj,
      metaObj,
      headerObj,
      headerNavMainArr,
      breadcrumbsArr,
      experienceObj,
      feedObj,

      accessLevel,
      userID,
      category,
      contents,
      period,

      pageObj,
      forumThreadsObj,
      forumCommentsObj,
      forumRepliesObj,
      recruitmentThreadsObj,
      recruitmentCommentsObj,
      recruitmentRepliesObj,
      gameCommunityObj,
      userCommunityObj,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

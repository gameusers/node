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

import { ContainerStateCommunity } from "app/@states/community.js";

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

import FollowMembers from "app/common/follow/v2/members.js";

// --------------------------------------------------
//   Function Components
//   URL: http://localhost:8080/uc/***/member
// --------------------------------------------------

/**
 * レイアウト
 * @param {Object} props - Props
 */
const ContainerLayout = (props) => {
  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateCommunity = ContainerStateCommunity.useContainer();

  const { setUserCommunityObj } = stateCommunity;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  useEffect(() => {
    // --------------------------------------------------
    //   Router.push でページを移動した際の処理
    //   getServerSideProps でデータを取得してからデータを更新する
    // --------------------------------------------------

    setUserCommunityObj(props.userCommunityObj);
  }, [props.ISO8601]);

  // --------------------------------------------------
  //   Component - Sidebar
  // --------------------------------------------------

  const componentSidebar = (
    <React.Fragment>
      <Breadcrumbs arr={props.breadcrumbsArr} sidebar={true} />

      <FeedSidebar feedObj={props.feedObj} top={true} />
    </React.Fragment>
  );
  // --------------------------------------------------
  //   Component - Contents
  // --------------------------------------------------

  const componentContent = (
    <React.Fragment>
      <Breadcrumbs arr={props.breadcrumbsArr} />

      <FollowMembers
        pageType="uc"
        userCommunities_id={props.userCommunities_id}
        accessLevel={props.accessLevel}
        cardPlayersObj={props.cardPlayersObj}
        followMembersObj={props.followMembersObj}
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
    userCommunityObj: props.userCommunityObj,
  };

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <ContainerStateCommunity.Provider initialState={initialStateObj}>
      <ContainerLayout {...props} />
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

  const userCommunityID = query.userCommunityID;

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
  const limit = getCookie({ key: "followLimit", reqHeadersCookie });

  // --------------------------------------------------
  //   Fetch
  // --------------------------------------------------

  const resultObj = await fetchWrapper({
    urlApi: encodeURI(
      `${
        process.env.NEXT_PUBLIC_URL_API
      }/v2/uc/${userCommunityID}/member?page=${1}&limit=${limit}`
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

  const userCommunities_id = lodashGet(
    dataObj,
    ["userCommunityObj", "_id"],
    ""
  );
  const userCommunityName = lodashGet(
    dataObj,
    ["userCommunityObj", "name"],
    ""
  );

  const userCommunityObj = lodashGet(dataObj, ["userCommunityObj"], {});
  const cardPlayersObj = lodashGet(dataObj, ["cardPlayersObj"], {});
  const followMembersObj = lodashGet(dataObj, ["followMembersObj"], {});

  // --------------------------------------------------
  //   metaObj
  // --------------------------------------------------

  const metaObj = {
    title: `メンバー - ${userCommunityName}`,
    description: `${userCommunityName}の参加メンバーです。`,
    type: "article",
    url: `${process.env.NEXT_PUBLIC_URL_BASE}uc/${userCommunityID}/member`,
    image: "",
  };

  // アップロードされた画像がある場合は、OGPの画像に設定する
  const imageSrc = lodashGet(
    headerObj,
    ["imagesAndVideosObj", "arr", 0, "src"],
    ""
  );

  if (imageSrc.indexOf("/img/uc/") !== -1) {
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
      href: `/uc/${userCommunityID}`,
      active: false,
    },

    {
      name: "メンバー",
      href: `/uc/${userCommunityID}/member`,
      active: true,
    },
  ];

  if (accessLevel >= 50) {
    headerNavMainArr.push({
      name: "設定",
      href: `/uc/${userCommunityID}/setting`,
      active: false,
    });
  }

  // --------------------------------------------------
  //   パンくずリスト
  // --------------------------------------------------

  const breadcrumbsArr = [
    {
      type: "uc/list",
      anchorText: "",
      href: `/uc/list`,
    },

    {
      type: "uc/index",
      anchorText: userCommunityName,
      href: `/uc/${userCommunityID}`,
    },

    {
      type: "uc/member",
      anchorText: "",
      href: "",
    },
  ];

  // ---------------------------------------------
  //   Set Cookie - recentAccessPage
  // ---------------------------------------------

  setCookie({
    key: "recentAccessPageUrl",
    value: `/uc/${userCommunityID}/member`,
    expires: 0,
    res,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /uc/[userCommunityID]/member/index.js
  // `);

  // console.log(`
  //   ----- resultObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   accessLevel: {green ${accessLevel}}
  // `);

  // console.log(chalk`
  //   threadListPage: {green ${threadListPage}}
  //   threadPage: {green ${threadPage}}

  //   threadListLimit: {green ${threadListLimit}}
  //   threadLimit: {green ${threadLimit}}
  //   commentLimit: {green ${commentLimit}}
  //   replyLimit: {green ${replyLimit}}
  // `);

  // console.log(`
  //   ----- reqHeadersCookie -----\n
  //   ${util.inspect(reqHeadersCookie, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   reqAcceptLanguage: {green ${reqAcceptLanguage}}
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

      userCommunityID,
      userCommunities_id,
      userCommunityObj,
      cardPlayersObj,
      followMembersObj,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

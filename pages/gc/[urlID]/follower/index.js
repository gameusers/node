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
//   URL: http://localhost:8080/gc/***/follower
// --------------------------------------------------

/**
 * レイアウト
 * @param {Object} props - Props
 */
const ContainerLayout = (props) => {
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
        pageType="gc"
        gameCommunities_id={props.gameCommunities_id}
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
  //   Return
  // --------------------------------------------------

  return <ContainerLayout {...props} />;
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

  const urlID = query.urlID;

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
      }/v2/gc/${urlID}/follower?page=${1}&limit=${limit}`
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

  const gameCommunities_id = lodashGet(
    dataObj,
    ["gameCommunityObj", "_id"],
    ""
  );
  const gameName = lodashGet(dataObj, ["headerObj", "name"], "");
  const cardPlayersObj = lodashGet(dataObj, ["cardPlayersObj"], {});
  const followMembersObj = lodashGet(dataObj, ["followMembersObj"], {});

  // --------------------------------------------------
  //   metaObj
  // --------------------------------------------------

  const metaObj = {
    title: `フォロワー - ${gameName}`,
    description: `${gameName}をフォローしているユーザーです。`,
    type: "article",
    url: `${process.env.NEXT_PUBLIC_URL_BASE}gc/${urlID}/follower`,
    image: "",
  };

  // --------------------------------------------------
  //   Header Navigation Link
  // --------------------------------------------------

  const headerNavMainArr = [
    {
      name: "トップ",
      href: `/gc/${urlID}`,
      active: false,
    },

    {
      name: "募集",
      href: `/gc/${urlID}/rec`,
      active: false,
    },

    {
      name: "フォロワー",
      href: `/gc/${urlID}/follower`,
      active: true,
    },
  ];

  if (accessLevel === 100) {
    headerNavMainArr.push({
      name: "設定",
      href: `/gc/${urlID}/settings`,
      active: false,
    });
  }

  // --------------------------------------------------
  //   パンくずリスト
  // --------------------------------------------------

  const breadcrumbsArr = [
    {
      type: "gc/list",
      anchorText: "",
      href: "/gc/list",
    },

    {
      type: "gc/index",
      anchorText: gameName,
      href: `/gc/${urlID}`,
    },

    {
      type: "gc/follower",
      anchorText: "",
      href: "",
    },
  ];

  // ---------------------------------------------
  //   Set Cookie - recentAccessPage
  // ---------------------------------------------

  setCookie({
    key: "recentAccessPageUrl",
    value: `/gc/${urlID}/follower`,
    expires: 0,
    res,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /pages/gc/[urlID]/follower/index.js
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

      urlID,
      gameCommunities_id,
      cardPlayersObj,
      followMembersObj,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

import GcNavigation from "app/gc/list/v2/navigation.js";
import GcList from "app/gc/list/v2/list.js";

// --------------------------------------------------
//   Function Components
//   URL: http://localhost:8080/gc/list
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

      <GcNavigation
        page={props.page}
        hardwaresArr={props.hardwaresArr}
        keyword={props.keyword}
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

      <GcList
        gcListObj={props.gcListObj}
        hardwaresArr={props.hardwaresArr}
        keyword={props.keyword}
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

  let page = lodashGet(query, ["page"], 1);
  const hardwares = lodashGet(query, ["hardwares"], "");
  const keyword = lodashGet(query, ["keyword"], "");
  const slugsArr = lodashGet(query, ["slug"], []);

  let pageType = "";

  if (slugsArr.length === 0) {
    pageType = "index";
  } else if (Math.sign(slugsArr[0]) === 1) {
    pageType = "page";
    page = slugsArr[0];
  } else if (slugsArr[0] === "search") {
    pageType = "search";
  }

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
  const limit = getCookie({ key: "communityListLimit", reqHeadersCookie });

  // --------------------------------------------------
  //   Fetch
  // --------------------------------------------------

  const resultObj = await fetchWrapper({
    urlApi: encodeURI(
      `${process.env.NEXT_PUBLIC_URL_API}/v2/gc/list?page=${page}&limit=${limit}&hardwares=${hardwares}&keyword=${keyword}`
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
  const headerObj = lodashGet(dataObj, ["headerObj"], {});
  const experienceObj = lodashGet(dataObj, ["experienceObj"], {});
  const feedObj = lodashGet(dataObj, ["feedObj"], {});

  const gcListObj = lodashGet(dataObj, ["gcListObj"], {});
  const hardwaresArr = lodashGet(dataObj, ["hardwaresArr"], []);

  // --------------------------------------------------
  //   metaObj
  // --------------------------------------------------

  const metaObj = {
    title: "ゲームコミュニティ - Game Users",
    description: `ゲームコミュニティの一覧です。ゲームコミュニティを検索することもできます。`,
    type: "article",
    url: `${process.env.NEXT_PUBLIC_URL_BASE}gc/list`,
    image: "",
  };

  // --------------------------------------------------
  //   Header Navigation Link
  // --------------------------------------------------

  const headerNavMainArr = [
    {
      name: "トップ",
      href: `/`,
      active: false,
    },

    {
      name: "ゲームC",
      href: "/gc/list",
      active: true,
    },

    {
      name: "ユーザーC",
      href: "/uc/list",
      active: false,
    },
  ];

  // --------------------------------------------------
  //   パンくずリスト
  // --------------------------------------------------

  let breadcrumbsArr = [
    {
      type: "gc/list",
      anchorText: "",
      href: "",
    },
  ];

  // --------------------------------------------------
  //   recentAccessPage
  // --------------------------------------------------

  let recentAccessPageUrl = "/gc/list";

  // --------------------------------------------------
  //   2ページ目以降
  // --------------------------------------------------

  if (pageType === "page") {
    // ---------------------------------------------
    //   - metaObj.title
    // ---------------------------------------------

    metaObj.title = `ゲームコミュニティ: Page ${page} - Game Users`;

    // --------------------------------------------------
    //   - recentAccessPage
    // --------------------------------------------------

    recentAccessPageUrl = `/gc/list/${page}`;

    // --------------------------------------------------
    //   検索
    // --------------------------------------------------
  } else if (pageType === "search") {
    // ---------------------------------------------
    //   - metaObj.title
    // ---------------------------------------------

    metaObj.title = `ゲームコミュニティ検索 - Game Users`;

    // ---------------------------------------------
    //   - パンくずリスト
    // ---------------------------------------------

    breadcrumbsArr = [
      {
        type: "gc/list",
        anchorText: "",
        href: "/gc/list",
      },

      {
        type: "gc/list/search",
        anchorText: "",
        href: "",
      },
    ];

    // --------------------------------------------------
    //   - recentAccessPage
    // --------------------------------------------------

    const urlHardwares = hardwares ? `hardwares=${hardwares}&` : "";
    const urlKeyword = keyword ? `keyword=${encodeURI(keyword)}&` : "";

    recentAccessPageUrl = `/gc/list/search?${urlHardwares}${urlKeyword}page=${page}`;
  }

  // ---------------------------------------------
  //   Set Cookie - recentAccessPage
  // ---------------------------------------------

  setCookie({
    key: "recentAccessPageUrl",
    value: recentAccessPageUrl,
    expires: 0,
    res,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   pages/gc/list/[[...slug]].js
  // `);

  // console.log(`
  //   ----- resultObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   ISO8601: {green ${ISO8601}}
  //   loginUsersObj.accessDate: {green ${loginUsersObj.accessDate}}
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

      page,
      gcListObj,
      hardwaresArr,
      keyword,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

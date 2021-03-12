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
import { getCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Layout from "app/common/layout/v2/layout.js";
import Breadcrumbs from "app/common/layout/v2/breadcrumbs.js";
import FeedSidebar from "app/common/feed/v2/sidebar.js";

import FormPage from "app/ur/setting/v2/form-page.js";
import FormAccount from "app/ur/setting/v2/form-account.js";
import FormEmail from "app/ur/setting/v2/form-email.js";
import FormWebPush from "app/ur/setting/v2/form-web-push.js";
import FormAccountDelete from "app/ur/setting/v2/form-account-delete.js";

// --------------------------------------------------
//   Function Components
//   URL: http://localhost:8080/ur/***/setting
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

      <FormPage
        userID={props.userID}
        pagesImagesAndVideosObj={props.pagesImagesAndVideosObj}
        pagesObj={props.pagesObj}
        approval={props.approval}
      />

      <FormAccount loginID={props.loginID} />

      <FormEmail
        email={props.email}
        emailConfirmation={props.emailConfirmation}
      />

      <FormWebPush webPushAvailable={props.webPushAvailable} />

      <FormAccountDelete defaultExpanded={false} />
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

  const userID = query.userID;

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

  // ---------------------------------------------
  //   FormData
  // ---------------------------------------------

  const formDataObj = {
    userID,
  };

  // --------------------------------------------------
  //   Fetch
  // --------------------------------------------------

  const resultObj = await fetchWrapper({
    urlApi: encodeURI(
      `${process.env.NEXT_PUBLIC_URL_API}/v2/ur/${userID}/setting`
    ),
    methodType: "POST",
    reqHeadersCookie,
    reqAcceptLanguage,
    formData: JSON.stringify(formDataObj),
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

  const pagesImagesAndVideosObj = lodashGet(
    dataObj,
    ["pagesImagesAndVideosObj"],
    {}
  );
  const pagesObj = lodashGet(dataObj, ["pagesObj"], {});
  const approval = lodashGet(dataObj, ["approval"], false);
  const loginID = lodashGet(dataObj, ["loginID"], "");
  const email = lodashGet(dataObj, ["email"], "");
  const emailConfirmation = lodashGet(dataObj, ["emailConfirmation"], false);
  const webPushAvailable = lodashGet(dataObj, ["webPushAvailable"], false);

  // --------------------------------------------------
  //   metaObj
  // --------------------------------------------------

  const userName = lodashGet(headerObj, ["name"], "");

  const metaObj = {
    title: `ユーザー設定 - ${userName}`,
    description: `${userName}さんのユーザー設定ページです。`,
    type: "article",
    url: `${process.env.NEXT_PUBLIC_URL_BASE}ur/${userID}/setting`,
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
      active: false,
    },
  ];

  if (accessLevel >= 50) {
    headerNavMainArr.push({
      name: "設定",
      href: `/ur/${userID}/setting`,
      active: true,
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
      type: "ur/setting",
      anchorText: "",
      href: "",
    },
  ];

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /pages/ur/[userID]/setting/index.js
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
      pagesImagesAndVideosObj,
      pagesObj,
      approval,
      loginID,
      email,
      emailConfirmation,
      webPushAvailable,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

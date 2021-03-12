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

import FollowNavigation from "app/common/follow/v2/navigation.js";
import ListGc from "app/common/follow/v2/list-gc.js";
import ListUc from "app/common/follow/v2/list-uc.js";
import ListUr from "app/common/follow/v2/list-ur.js";

// --------------------------------------------------
//   Function Components
//   URL: http://localhost:8080/ur/***/follow/list/***
// --------------------------------------------------

/**
 * レイアウト
 * @param {Object} props - Props
 */
const ContainerLayout = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [followListGcObj, setFollowListGcObj] = useState(props.followListGcObj);
  const [followListUcObj, setFollowListUcObj] = useState(props.followListUcObj);
  const [cardPlayersObj, setCardPlayersObj] = useState(props.cardPlayersObj);
  const [followListUrObj, setFollowListUrObj] = useState(props.followListUrObj);

  useEffect(() => {
    // --------------------------------------------------
    //   Router.push でページを移動した際の処理
    //   ISO8601に変更があったら（ページを移動したら）更新する
    // --------------------------------------------------

    setFollowListGcObj(props.followListGcObj);
    setFollowListUcObj(props.followListUcObj);
    setCardPlayersObj(props.cardPlayersObj);
    setFollowListUrObj(props.followListUrObj);
  }, [props.ISO8601]);

  // --------------------------------------------------
  //   Component - List
  // --------------------------------------------------

  let componentList = "";

  if (props.category === "gc") {
    componentList = (
      <ListGc
        accessLevel={props.accessLevel}
        userID={props.userID}
        followListGcObj={followListGcObj}
      />
    );
  } else if (props.category === "uc") {
    componentList = (
      <ListUc
        accessLevel={props.accessLevel}
        userID={props.userID}
        followListUcObj={followListUcObj}
      />
    );
  } else if (props.category === "ur") {
    componentList = (
      <ListUr
        accessLevel={props.accessLevel}
        userID={props.userID}
        cardPlayersObj={cardPlayersObj}
        setCardPlayersObj={setCardPlayersObj}
        followListUrObj={followListUrObj}
      />
    );
  }

  // --------------------------------------------------
  //   Component - Sidebar
  // --------------------------------------------------

  const componentSidebar = (
    <React.Fragment>
      <Breadcrumbs arr={props.breadcrumbsArr} sidebar={true} />

      <FollowNavigation
        accessLevel={props.accessLevel}
        contentsOrList="list"
        userID={props.userID}
        category={props.category}
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

      {componentList}
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
  const slugsArr = lodashGet(query, ["slug"], []);

  let category = "";
  let page = 1;

  if (slugsArr[0] === "gc" || slugsArr[0] === "uc" || slugsArr[0] === "ur") {
    category = slugsArr[0];
  }

  if (Math.sign(slugsArr[1]) === 1) {
    page = slugsArr[1];
  }

  // console.log(`
  //   ----- query -----\n
  //   ${util.inspect(query, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- slugsArr -----\n
  //   ${util.inspect(slugsArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const ISO8601 = moment().utc().toISOString();

  // --------------------------------------------------
  //   Get Cookie Data & Temporary Data for Fetch
  // --------------------------------------------------

  const termsOfServiceAgreedVersion = getCookie({
    key: "termsOfServiceAgreedVersion",
    reqHeadersCookie,
  });
  const limit = getCookie({ key: "followListLimit", reqHeadersCookie });

  // --------------------------------------------------
  //   Fetch
  // --------------------------------------------------

  const resultObj = await fetchWrapper({
    urlApi: encodeURI(
      `${process.env.NEXT_PUBLIC_URL_API}/v2/ur/${userID}/follow/list?category=${category}&page=${page}&limit=${limit}`
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
  const followListGcObj = lodashGet(dataObj, ["followListGcObj"], {});
  const followListUcObj = lodashGet(dataObj, ["followListUcObj"], {});
  const cardPlayersObj = lodashGet(dataObj, ["cardPlayersObj"], {});
  const followListUrObj = lodashGet(dataObj, ["followListUrObj"], {});

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

  const titles = titlesArr.length > 0 ? ` ${titlesArr.join(" > ")}` : "";
  const title = `フォロー一覧 > ${titles} - ${pageTitle}`;

  const metaObj = {
    title,
    description: `${userName}さんのフォロー一覧ページです。`,
    type: "article",
    url: `${process.env.NEXT_PUBLIC_URL_BASE}ur/${userID}/follow/list`,
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
      href: "/ur/follow",
    },

    {
      type: "ur/follow/list",
      anchorText: "",
      href: "",
    },
  ];

  // ---------------------------------------------
  //   Set Cookie - recentAccessPage
  // ---------------------------------------------

  setCookie({
    key: "recentAccessPageUrl",
    value: `/ur/${userID}/follow/list`,
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
      page,

      followListGcObj,
      followListUcObj,
      cardPlayersObj,
      followListUrObj,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

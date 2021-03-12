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

import CardPlayer from "app/common/card/v2/card-player.js";

// --------------------------------------------------
//   Function Components
//   URL: http://localhost:8080/ur/***
// --------------------------------------------------

/**
 * レイアウト
 * @param {Object} props - Props
 */
const ContainerLayout = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [cardPlayersObj, setCardPlayersObj] = useState(props.cardPlayersObj);
  const [cardPlayers_idsArr, setCardPlayers_idsArr] = useState(
    props.cardPlayers_idsArr
  );

  useEffect(() => {
    // --------------------------------------------------
    //   Router.push でページを移動した際の処理
    //   getServerSideProps でデータを取得してからデータを更新する
    // --------------------------------------------------

    setCardPlayersObj(props.cardPlayersObj);
    setCardPlayers_idsArr(props.cardPlayers_idsArr);
  }, [props.ISO8601]);

  // --------------------------------------------------
  //   Component - Card Player
  // --------------------------------------------------

  const componentsArr = [];

  for (let cardPlayers_id of cardPlayers_idsArr.values()) {
    componentsArr.push(
      <CardPlayer
        key={cardPlayers_id}
        obj={lodashGet(cardPlayersObj, [cardPlayers_id], {})}
        showFollowButton={false}
        showEditButton={true}
        defaultExpanded={true}
        cardPlayersObj={cardPlayersObj}
        setCardPlayersObj={setCardPlayersObj}
      />
    );
  }

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

      {componentsArr}

      {/* <FeedHorizontal
        feedObj={props.feedObj}
      /> */}
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

  // --------------------------------------------------
  //   Fetch
  // --------------------------------------------------

  const resultObj = await fetchWrapper({
    urlApi: encodeURI(`${process.env.NEXT_PUBLIC_URL_API}/v2/ur/${userID}`),
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
  const cardPlayersObj = lodashGet(dataObj, ["cardPlayersObj"], {});
  const cardPlayers_idsArr = lodashGet(dataObj, ["cardPlayers_idsArr"], []);
  const cardPlayers_id = cardPlayers_idsArr[0];

  const redirectUserID = lodashGet(dataObj, ["redirectObj", "userID"], "");

  // --------------------------------------------------
  //   metaObj
  // --------------------------------------------------

  const pagesObj = pagesArr.find((valueObj) => {
    return valueObj.type === "top";
  });

  const pageTitle = lodashGet(pagesObj, ["title"], "");
  const userName = lodashGet(cardPlayersObj, [cardPlayers_id, "name"], "");

  const metaObj = {
    title: pageTitle ? pageTitle : `${userName} - Game Users`,
    description: `${userName}さんのユーザーページです。`,
    type: "article",
    url: `${process.env.NEXT_PUBLIC_URL_BASE}ur/${userID}`,
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
      active: true,
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
      href: "",
    },
  ];

  // ---------------------------------------------
  //   Set Cookie - recentAccessPage
  // ---------------------------------------------

  setCookie({
    key: "recentAccessPageUrl",
    value: `/ur/${userID}`,
    expires: 0,
    res,
  });

  // --------------------------------------------------
  //   リダイレクト
  // --------------------------------------------------

  if (redirectUserID) {
    const isServer = !process.browser;

    let destination = `/ur/${redirectUserID}`;

    if (isServer && res) {
      res.writeHead(301, {
        Location: destination,
      });

      res.end();
    } else {
      Router.replace(destination);
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /pages/ur/[userID]/index.js
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

      userID,
      cardPlayersObj,
      cardPlayers_idsArr,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

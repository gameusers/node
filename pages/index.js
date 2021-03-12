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

import React from "react";
import Error from "next/error";
import moment from "moment";
import SwiperCore, { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

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
import FeedCard from "app/common/feed/v2/card.js";

// ---------------------------------------------
//   install Swiper components
// ---------------------------------------------

SwiperCore.use([Pagination]);

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cardBox = css`
  position: relative;
  margin: 0 0 10px 0;
`;

const cardCategory = css`
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 2;

  color: white;
  border: solid 2px white;
  padding: 5px 10px 2px 10px;
  border-radius: 0.5em;

  background-color: #000;
  background-color: rgba(0, 0, 0, 0.5);

  font-size: 20px;
  font-weight: normal;

  pointer-events: none;
`;

// --------------------------------------------------
//   Function Components
//   URL: http://localhost:8080/
// --------------------------------------------------

/**
 * レイアウト
 * @param {Object} props - Props
 */
const ContainerLayout = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { feedObj = {} } = props;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /pages/gc/[urlID]/forum/[...slug].js - ContainerLayout
  // `);

  // console.log(`
  //   ----- props -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(props)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Component - Forum Game Community
  // --------------------------------------------------

  let feedDataObj = lodashGet(feedObj, ["forumsGcObj", "dataObj"], {});
  let feedArr = lodashGet(feedObj, ["forumsGcObj", "page1Obj", "arr"], []);

  const componentForumGcArr = [];

  for (const [index, _id] of feedArr.entries()) {
    const obj = feedDataObj[_id];

    componentForumGcArr.push(
      <SwiperSlide key={index}>
        <FeedCard obj={obj} />
      </SwiperSlide>
    );
  }

  // --------------------------------------------------
  //   Component - Recruitment
  // --------------------------------------------------

  feedDataObj = lodashGet(feedObj, ["recruitmentsObj", "dataObj"], {});
  feedArr = lodashGet(feedObj, ["recruitmentsObj", "page1Obj", "arr"], []);

  const componentRecruitmentArr = [];

  for (const [index, _id] of feedArr.entries()) {
    const obj = feedDataObj[_id];

    componentRecruitmentArr.push(
      <SwiperSlide key={index}>
        <FeedCard obj={obj} />
      </SwiperSlide>
    );
  }

  // --------------------------------------------------
  //   Component - Forum User Community
  // --------------------------------------------------

  feedDataObj = lodashGet(feedObj, ["forumsUcObj", "dataObj"], {});
  feedArr = lodashGet(feedObj, ["forumsUcObj", "page1Obj", "arr"], []);

  const componentForumUcArr = [];

  for (const [index, _id] of feedArr.entries()) {
    const obj = feedDataObj[_id];

    componentForumUcArr.push(
      <SwiperSlide key={index}>
        <FeedCard obj={obj} />
      </SwiperSlide>
    );
  }

  // --------------------------------------------------
  //   Component - Contents
  // --------------------------------------------------

  const componentContent = (
    <React.Fragment>
      {/* Contents */}
      <div
        css={css`
          padding: 10px 0 10px 0;
        `}
      >
        <div css={cardBox}>
          <h2 css={cardCategory}>フォーラム</h2>

          <Swiper
            spaceBetween={14}
            slidesPerView={"auto"}
            freeMode={true}
            pagination={{ clickable: false }}
          >
            {componentForumGcArr}
          </Swiper>
        </div>

        <div css={cardBox}>
          <h2 css={cardCategory}>募集</h2>

          <Swiper
            spaceBetween={14}
            slidesPerView={"auto"}
            freeMode={true}
            pagination={{ clickable: false }}
          >
            {componentRecruitmentArr}
          </Swiper>
        </div>

        <div css={cardBox}>
          <h2 css={cardCategory}>ユーザーコミュニティ</h2>

          <Swiper
            spaceBetween={14}
            slidesPerView={"auto"}
            freeMode={true}
            pagination={{ clickable: false }}
          >
            {componentForumUcArr}
          </Swiper>
        </div>
      </div>
    </React.Fragment>
  );
  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Layout
      metaObj={props.metaObj}
      // componentSidebar={}
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
    urlApi: encodeURI(`${process.env.NEXT_PUBLIC_URL_API}/v2/index`),
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
  const feedObj = lodashGet(dataObj, ["feedObj"], {});

  // --------------------------------------------------
  //   metaObj
  // --------------------------------------------------

  const metaObj = {
    type: "website",
  };

  // --------------------------------------------------
  //   Header Navigation Link
  // --------------------------------------------------

  const headerNavMainArr = [
    {
      name: "トップ",
      href: "/",
      active: true,
    },
    {
      name: "ゲームC",
      href: `/gc/list`,
      active: false,
    },
    {
      name: "ユーザーC",
      href: `/uc/list`,
      active: false,
    },
  ];

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /pages/logout/index.js
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

      feedObj,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

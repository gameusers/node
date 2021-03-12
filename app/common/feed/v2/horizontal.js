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
import SwiperCore, { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FeedCard from "app/common/feed/v2/card.js";

// ---------------------------------------------
//   install Swiper components
// ---------------------------------------------

SwiperCore.use([Pagination, Autoplay]);

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { feedObj = {} } = props;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const feedDataObj = lodashGet(feedObj, ["allObj", "dataObj"], {});
  const feedArr = lodashGet(feedObj, ["allObj", "page1Obj", "arr"], []);

  // --------------------------------------------------
  //   カードデータが存在しない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (Object.keys(feedDataObj).length === 0 || feedArr.length === 0) {
    return null;
  }

  // ---------------------------------------------
  //   Component
  // ---------------------------------------------

  const componentFeedsArr = [];

  for (const [index, _id] of feedArr.entries()) {
    const obj = feedDataObj[_id];

    componentFeedsArr.push(
      <SwiperSlide key={index}>
        <FeedCard obj={obj} />
      </SwiperSlide>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/common/feed/sidebar.js
  // `);

  // console.log(`
  //   ----- obj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(obj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   showEditButton: {green ${showEditButton}}
  //   defaultExpanded: {green ${defaultExpanded}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        position: relative;
        margin: 0 0 10px 0;
      `}
    >
      <h2
        css={css`
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
        `}
      >
        最新フィード
      </h2>

      <Swiper
        css={css`
          margin: 24px 0 0 0;
          padding: 0 0 2px 0;
        `}
        direction={"horizontal"}
        spaceBetween={14}
        slidesPerView={"auto"}
        freeMode={true}
        pagination={{ clickable: false }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {componentFeedsArr}
      </Swiper>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

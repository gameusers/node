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

  const { feedObj = {}, top = false } = props;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const feedDataObj = lodashGet(feedObj, ["allObj", "dataObj"], {});
  const feedArr = lodashGet(feedObj, ["allObj", "page1Obj", "arr"], []);
  // const feedArr = lodashGet(feedObj, ['sidebarRandomArr'], []);

  // --------------------------------------------------
  //   カードデータが存在しない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (Object.keys(feedDataObj).length === 0 || feedArr.length === 0) {
    return null;
  }

  // ---------------------------------------------
  //   配列をランダムに並び替える
  //   これがないとどのページも同じカードが最初に表示されて代わり映えがしないため
  //   本当は Swiper の初期表示番号の設定で対応したかったが
  //   direction={'vertical'} の場合、initialSlide={number} が動かない。仕様かバグみたい。2020/12/25 初期表示番号は動くようになった
  // ---------------------------------------------

  // const clonedFeedArr = feedArr.slice();

  // for (let i = clonedFeedArr.length - 1; i > 0; i--){
  //   const rand = Math.floor(Math.random() * (i + 1));
  //   [clonedFeedArr[i], clonedFeedArr[rand]] = [clonedFeedArr[rand], clonedFeedArr[i]];
  // }

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
  //   最初に表示するカードをランダムに決定する
  //   これがないとどのページも同じカードが最初に表示されて代わり映えがしないため
  // --------------------------------------------------

  const min = 0;
  const max = feedArr.length;
  const initialSlide = Math.floor(Math.random() * (max - min) + min);

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/common/feed/sidebar.js
  // `);

  // console.log(`
  //   ----- feedObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(feedObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   initialSlide: {green ${initialSlide}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Swiper
      css={css`
        margin: ${top ? "0" : "18px 0 0 0"};
        padding: 0 0 2px 0;

        @media screen and (max-width: 947px) {
          display: none;
        }
      `}
      direction={"vertical"}
      spaceBetween={14}
      autoHeight={true}
      height={200}
      slidesPerView={"auto"}
      // freeMode={true}
      // centeredSlides={true}
      initialSlide={initialSlide}
      loop={true}
      pagination={{ clickable: false }}
      autoplay={{
        delay: 30000,
        disableOnInteraction: false,
      }}
      // mousewheel={true}
    >
      {componentFeedsArr}
    </Swiper>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

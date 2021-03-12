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

// ---------------------------------------------
//   Components
// ---------------------------------------------

import DataGc from "app/common/layout/v2/header/data-gc.js";
import DataUc from "app/common/layout/v2/header/data-uc.js";
import DataUr from "app/common/layout/v2/header/data-ur.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { headerObj } = stateLayout;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const type = lodashGet(headerObj, ["type"], "gc");
  const name = lodashGet(headerObj, ["name"], "");
  const imagesAndVideosObj = lodashGet(headerObj, ["imagesAndVideosObj"], {});
  const imagesAndVideosThumbnailObj = lodashGet(
    headerObj,
    ["imagesAndVideosThumbnailObj"],
    {}
  );

  let heroImage = false;

  if (Object.keys(imagesAndVideosObj).length !== 0) {
    heroImage = true;
  }

  // --------------------------------------------------
  //   Component - Data
  // --------------------------------------------------

  let componentData = "";

  if (type === "gc") {
    componentData = <DataGc headerObj={headerObj} heroImage={heroImage} />;
  } else if (type === "uc") {
    componentData = <DataUc headerObj={headerObj} heroImage={heroImage} />;
  } else if (type === "ur") {
    componentData = <DataUr headerObj={headerObj} heroImage={heroImage} />;
  }

  // --------------------------------------------------
  //   Hero Image あり
  // --------------------------------------------------

  let component = "";

  if (Object.keys(imagesAndVideosObj).length !== 0) {
    const src = lodashGet(imagesAndVideosObj, ["arr", 0, "src"], "");
    const srcSet = lodashGet(imagesAndVideosObj, ["arr", 0, "srcSet"], "");
    const width = lodashGet(imagesAndVideosObj, ["arr", 0, "width"], 256);

    component = (
      <div
        css={css`
          width: 100%;
          background-color: black;
          position: relative;
        `}
      >
        <img
          css={css`
            min-height: 300px;
            max-width: 100%;
            max-height: 640px;
            object-fit: cover;
            margin: 0 auto;
          `}
          src={src}
          srcSet={srcSet}
          alt={name}
          width={width}
        />

        {componentData}
      </div>
    );

    // --------------------------------------------------
    //   Hero Image がない場合、サムネイルを表示する
    // --------------------------------------------------
  } else {
    const src = lodashGet(
      imagesAndVideosThumbnailObj,
      ["arr", 0, "src"],
      "/img/common/thumbnail/none-game.jpg"
    );
    const srcSet = lodashGet(
      imagesAndVideosThumbnailObj,
      ["arr", 0, "srcSet"],
      ""
    );

    component = (
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: flex-start;
          background: no-repeat center center
            url("/img/common/header/header-back.jpg");
          background-size: cover;
          background-color: #25283d;
          padding: 15px;
        `}
      >
        {/* <div> */}
        <img
          css={css`
            width: 128px;
            border-radius: 8px;
            box-shadow: 4px 4px 10px #383838;
            margin: 0 15px 0 0;

            @media screen and (max-width: 480px) {
              width: 96px;
            }

            @media screen and (max-width: 320px) {
              width: 64px;
            }
          `}
          src={src}
          srcSet={srcSet}
          alt={name}
        />
        {/* </div> */}

        {componentData}
      </div>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/header/hero-image.js
  // `);

  // console.log(`
  //   ----- headerObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(headerObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- imagesAndVideosObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return component;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

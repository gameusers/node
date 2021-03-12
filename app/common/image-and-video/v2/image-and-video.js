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
import { useIntl } from "react-intl";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { imageCalculateSize } from "app/@modules/image/calculate.js";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssPreviewBox = css`
  position: relative;
  margin: 0 4px 4px 0;
`;

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

  const {
    imagesAndVideosObj,
    lightbox = true, // true - 画像をクリックするとLightboxで表示される
    maxHeight, // 画像の最大の高さを指定する、フィードでゲームのサムネイルを表示する場合などに利用
    // setMaxHeight = true
  } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    handleVideoOpen,
    handleNavigationForLightboxShow,
    handleNavigationForLightboxHide,
  } = stateLayout;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const type = lodashGet(imagesAndVideosObj, ["type"], "");
  const arr = lodashGet(imagesAndVideosObj, ["arr"], []);

  // --------------------------------------------------
  //   必要なデータがない場合は処理停止
  // --------------------------------------------------

  if (!type || arr.length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   Component - Images
  // --------------------------------------------------

  let componentBigImage = "";
  const componentsSmallImagesArr = [];

  for (const [index, valueObj] of arr.entries()) {
    // console.log(chalk`
    //   index: {green ${index}}
    // `);

    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(valueObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   最初の画像または動画　大きく表示
    // ---------------------------------------------

    if (index === 0) {
      // ---------------------------------------------
      //   画像
      // ---------------------------------------------

      if (valueObj.type === "image") {
        componentBigImage = (
          <div
            css={css`
              width: 100%;
              // height: 180px;
              background-color: black;
            `}
          >
            <img
              css={css`
                max-width: 100%;
                // min-height: 180px;
                max-height: ${maxHeight ? `${maxHeight}px` : "none"};
                object-fit: contain;
                // object-fit: cover;
                margin: 0 auto;
              `}
              src={valueObj.src}
              srcSet={valueObj.srcSet}
              alt={valueObj.caption}
              width={valueObj.width}
            />
          </div>
        );

        // ---------------------------------------------
        //   動画
        // ---------------------------------------------
      } else if (valueObj.type === "video") {
        componentBigImage = (
          <div
            css={css`
              width: 100%;
              position: relative;
              background-color: black;
            `}
          >
            <img
              css={css`
                // width: 100%;
                max-width: 100%;
                max-height: 300px;
                object-fit: contain;
                margin: 0 auto;
              `}
              src={`https://img.youtube.com/vi/${valueObj.videoID}/mqdefault.jpg`}

              // src={`https://img.youtube.com/vi/${valueObj.videoID}/maxresdefault.jpg`}
              // srcSet={`https://img.youtube.com/vi/${valueObj.videoID}/mqdefault.jpg 480w,heih
              //         https://img.youtube.com/vi/${valueObj.videoID}/maxresdefault.jpg 640w`}
            />

            <div
              css={css`
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 0;
              `}
              onClick={() =>
                handleVideoOpen({
                  videoChannel: valueObj.videoChannel,
                  videoID: valueObj.videoID,
                })
              }
            >
              <div
                css={css`
                  font-size: 46px;
                  position: relative;
                  width: 1.4em;
                  height: 1.4em;
                  border: 0.1em solid white;
                  border-radius: 100%;

                  transition: 0.5s;
                  &:hover {
                    opacity: 0.7;
                  }

                  @media screen and (max-width: 480px) {
                    font-size: 36px;
                  }

                  &:before {
                    content: "";
                    position: absolute;
                    top: 0.3em;
                    left: 0.5em;
                    width: 0;
                    height: 0;
                    border-top: 0.4em solid transparent;
                    border-left: 0.6em solid white;
                    border-bottom: 0.4em solid transparent;
                  }
                `}
              />
            </div>
          </div>
        );
      }

      // ---------------------------------------------
      //   2番目以降の画像または動画　サムネイルで表示
      // ---------------------------------------------
    } else {
      // ---------------------------------------------
      //   画像
      // ---------------------------------------------

      if (valueObj.type === "image") {
        // ---------------------------------------------
        //   横幅・高さを計算する
        // ---------------------------------------------

        // const calculatedObj = imageCalculateSize({ width, height, specifiedHeight: 108 });

        // console.log(`
        //   ----- calculatedObj -----\n
        //   ${util.inspect(calculatedObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        componentsSmallImagesArr.push(
          <div css={cssPreviewBox} key={index}>
            <img
              css={css`
                height: 108px;
                min-height: 108px;
                max-height: 108px;

                @media screen and (max-width: 480px) {
                  height: 68px;
                  min-height: 68px;
                  max-height: 68px;
                }
              `}
              src={valueObj.src}
              alt={valueObj.caption}
            />
          </div>
        );

        // ---------------------------------------------
        //   動画
        // ---------------------------------------------
      } else if (valueObj.type === "video") {
        componentsSmallImagesArr.push(
          <div css={cssPreviewBox} key={`${imagesAndVideosObj._id}-${index}`}>
            <div
              css={css`
                width: 192px;
                height: 108px;
                position: relative;

                @media screen and (max-width: 480px) {
                  width: 120px;
                  height: 68px;
                }
              `}
            >
              {/* Image */}
              <img
                css={css`
                  width: 100%;
                `}
                src={`https://img.youtube.com/vi/${valueObj.videoID}/mqdefault.jpg`}
              />

              {/* Play Button */}
              <div
                css={css`
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: absolute;
                  top: 0;
                `}
                onClick={() =>
                  handleVideoOpen({
                    videoChannel: valueObj.videoChannel,
                    videoID: valueObj.videoID,
                  })
                }
              >
                <div
                  css={css`
                    font-size: 24px;
                    position: relative;
                    width: 1.4em;
                    height: 1.4em;
                    border: 0.1em solid white;
                    border-radius: 100%;

                    transition: 0.5s;
                    &:hover {
                      opacity: 0.7;
                    }

                    @media screen and (max-width: 480px) {
                      font-size: 18px;
                    }

                    &:before {
                      content: "";
                      position: absolute;
                      top: 0.3em;
                      left: 0.5em;
                      width: 0;
                      height: 0;
                      border-top: 0.4em solid transparent;
                      border-left: 0.6em solid white;
                      border-bottom: 0.4em solid transparent;
                    }
                  `}
                />
              </div>
            </div>
          </div>
        );
      }
    }
  }

  // --------------------------------------------------
  //   Small Images
  // --------------------------------------------------

  let componentSmallImages = "";

  if (componentsSmallImagesArr.length !== 0) {
    componentSmallImages = (
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 10px 0 0 0;
        `}
      >
        {componentsSmallImagesArr}
      </div>
    );
  }

  // --------------------------------------------------
  //   Options
  // --------------------------------------------------

  const optionsObj = {
    settings: {
      disablePanzoom: true,
    },
  };

  // 画像がひとつの場合は「サムネイル」と「オートプレイ」「次」「前」「サムネイル」ボタンを非表示にする
  if (arr.length === 1) {
    optionsObj.buttons = {
      showAutoplayButton: false,
      showNextButton: false,
      showPrevButton: false,
      showThumbnailsButton: false,
    };

    optionsObj.thumbnails = {
      showThumbnails: false,
    };
  }

  // --------------------------------------------------
  //   Callbacks
  // --------------------------------------------------

  const callbacksObj = {
    onLightboxOpened: (object) => handleNavigationForLightboxHide(),
    onLightboxClosed: (object) => handleNavigationForLightboxShow(),
  };

  // --------------------------------------------------
  //   Component - Return
  // --------------------------------------------------

  let componentReturn = componentBigImage;

  // Linghtbox あり
  if (lightbox) {
    componentReturn = (
      <SimpleReactLightbox>
        <SRLWrapper
          options={optionsObj}
          callbacks={callbacksObj}
          // key={key}// ページ遷移を行っても最初に表示した画像が表示され続ける状態（バグ？）を防ぐため、key を入れている
        >
          {/* Big Image */}
          {componentBigImage}

          {/* Small Images */}
          {componentSmallImages}
        </SRLWrapper>
      </SimpleReactLightbox>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/image-and-video/components/image-and-video.js
  // `);

  // console.log(`
  //   ----- pathArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(pathArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- imagesAndVideosObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   key: {green ${key}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return componentReturn;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

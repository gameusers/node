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
import Link from "next/link";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconSchedule from "@material-ui/icons/Schedule";
import IconChatBubble from "@material-ui/icons/ChatBubbleOutline";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import ImageAndVideo from "app/common/image-and-video/v2/image-and-video.js";

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

  const { obj = {} } = props;

  // --------------------------------------------------
  //   カードデータが存在しない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (Object.keys(obj).length === 0) {
    return null;
  }

  // ---------------------------------------------
  //   Data
  // ---------------------------------------------

  const type = lodashGet(obj, ["type"], "");
  const _id = lodashGet(obj, ["_id"], "");
  const title = lodashGet(obj, ["title"], "");
  const comment = lodashGet(obj, ["comment"], "");
  const datetimeFrom = lodashGet(obj, ["datetimeFrom"], "");
  const commentsAndReplies = lodashGet(obj, ["commentsAndReplies"], 0);

  // --------------------------------------------------
  //   Game
  // --------------------------------------------------

  const gameUrlID = lodashGet(obj, ["gamesObj", "urlID"], "");
  const gameName = lodashGet(obj, ["gamesObj", "name"], "");
  const gameSubtitle = lodashGet(obj, ["gamesObj", "subtitle"], "");
  const gameImagesAndVideosObj = lodashGet(
    obj,
    ["gamesObj", "imagesAndVideosObj"],
    {}
  );
  // const gameImagesAndVideosArr = lodashGet(obj, ['gamesObj', 'imagesAndVideosObj', 'arr'], []);
  const gameImagesAndVideosThumbnailObj = lodashGet(
    obj,
    ["gamesObj", "imagesAndVideosThumbnailObj"],
    {}
  );
  // const gameImagesAndVideosThumbnailArr = lodashGet(obj, ['gamesObj', 'imagesAndVideosThumbnailObj', 'arr'], []);

  // --------------------------------------------------
  //   User Community
  // --------------------------------------------------

  const userCommunityID = lodashGet(
    obj,
    ["userCommunitiesObj", "userCommunityID"],
    ""
  );
  const ucName = lodashGet(obj, ["userCommunitiesObj", "name"], "");
  const ucImagesAndVideosObj = lodashGet(
    obj,
    ["userCommunitiesObj", "imagesAndVideosObj"],
    {}
  );
  const ucImagesAndVideosThumbnailObj = lodashGet(
    obj,
    ["userCommunitiesObj", "imagesAndVideosThumbnailObj"],
    {}
  );

  // --------------------------------------------------
  //   Images and Videos
  // --------------------------------------------------

  // ---------------------------------------------
  //   - ゲームのサムネイルを表示する
  // ---------------------------------------------

  let imagesAndVideosObj = {};
  let maxHeight = "";
  let imageOrVideo = "image";

  // ---------------------------------------------
  //   - アップロードした画像または動画がある場合、そちらを表示
  // ---------------------------------------------

  if (lodashHas(obj, ["imagesAndVideosObj"])) {
    imagesAndVideosObj = lodashGet(obj, ["imagesAndVideosObj"], {});
    maxHeight = 192;

    const imagesAndVideosType = lodashGet(
      obj,
      ["imagesAndVideosObj", "arr", 0, "type"],
      ""
    );

    if (imagesAndVideosType === "video") {
      imageOrVideo = "video";
    }

    // ---------------------------------------------
    //   - ゲームのヒーローイメージ
    // ---------------------------------------------

    // } else if (gameImagesAndVideosArr.length !== 0) {
  } else if (Object.keys(gameImagesAndVideosObj).length !== 0) {
    imagesAndVideosObj = gameImagesAndVideosObj;
    maxHeight = "";

    // ---------------------------------------------
    //   - ゲームのサムネイル
    // ---------------------------------------------

    // } else if (gameImagesAndVideosThumbnailArr.length !== 0) {
  } else if (Object.keys(gameImagesAndVideosThumbnailObj).length !== 0) {
    imagesAndVideosObj = gameImagesAndVideosThumbnailObj;
    maxHeight = "128";

    // ---------------------------------------------
    //   - ユーザーコミュニティのヒーローイメージ
    // ---------------------------------------------
  } else if (Object.keys(ucImagesAndVideosObj).length !== 0) {
    imagesAndVideosObj = ucImagesAndVideosObj;
    maxHeight = "";

    // ---------------------------------------------
    //   - ユーザーコミュニティのサムネイル
    // ---------------------------------------------
  } else if (Object.keys(ucImagesAndVideosThumbnailObj).length !== 0) {
    imagesAndVideosObj = ucImagesAndVideosThumbnailObj;
    maxHeight = "128";
  }

  // ---------------------------------------------
  //   Link
  // ---------------------------------------------

  let linkHref = "";
  let linkAs = "";
  let communityName = gameName + gameSubtitle;
  let communityLinkHref = `/gc/[urlID]`;
  let communityLinkAs = `/gc/${gameUrlID}`;

  if (type === "forumThreadsGc" || type === "forumCommentsAndRepliesGc") {
    linkHref = `/gc/[urlID]/forum/[[...slug]]`;
    linkAs = `/gc/${gameUrlID}/forum/${_id}`;
  } else if (
    type === "recruitmentThreads" ||
    type === "recruitmentComments" ||
    type === "recruitmentReplies"
  ) {
    linkHref = `/gc/[urlID]/rec/[[...slug]]`;
    linkAs = `/gc/${gameUrlID}/rec/${_id}`;
  } else if (
    type === "forumThreadsUc" ||
    type === "forumCommentsAndRepliesUc"
  ) {
    linkHref = `/uc/[userCommunityID]/forum/[[...slug]]`;
    linkAs = `/uc/${userCommunityID}/forum/${_id}`;
    communityName = ucName;
    communityLinkHref = `/uc/[userCommunityID]`;
    communityLinkAs = `/uc/${userCommunityID}`;
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // if (title === 'PC版R6Sクランメンバー募集') {

  //   console.log(`
  //     ----------------------------------------\n
  //     app/common/feed/card.js
  //   `);

  //   console.log(`
  //     ----- obj -----\n
  //     ${util.inspect(JSON.parse(JSON.stringify(obj)), { colors: true, depth: null })}\n
  //     --------------------\n
  //   `);

  // }

  // console.log(chalk`
  //   showEditButton: {green ${showEditButton}}
  //   defaultExpanded: {green ${defaultExpanded}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Card
      css={css`
        && {
          display: flex;
          flex-flow: column nowrap;
          height: 100%;
          cursor: pointer;
          margin: 0 0 4px 0;
        }
      `}
    >
      {imageOrVideo === "image" ? (
        <Link href={linkHref} as={linkAs}>
          <a className="link">
            <div
              css={css`
                display: flex;
                justify-content: center;
                background-color: black;
              `}
            >
              {Object.keys(imagesAndVideosObj).length === 0 ? (
                <img src="/img/common/thumbnail/none.svg" width="128" />
              ) : (
                <ImageAndVideo
                  imagesAndVideosObj={imagesAndVideosObj}
                  lightbox={false}
                  maxHeight={maxHeight}
                />
              )}
            </div>
          </a>
        </Link>
      ) : (
        <div
          css={css`
            background-color: black;
            // position: relative;
          `}
        >
          <ImageAndVideo
            imagesAndVideosObj={imagesAndVideosObj}
            lightbox={false}
            maxHeight={maxHeight}
          />
        </div>
      )}

      <Link href={linkHref} as={linkAs}>
        <a className="link">
          <div
            css={css`
              && {
                padding: 12px 20px 12px 20px;
              }
            `}
          >
            <h3
              css={css`
                margin: 0 0 10px 0;
              `}
            >
              {title}
            </h3>

            <Typography component="p">{comment}</Typography>
          </div>
        </a>
      </Link>

      <div
        css={css`
          margin-top: auto;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row nowrap;
            font-size: 12px;
            padding: 0 18px 0 18px;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-flow: row nowrap;
            `}
          >
            <IconSchedule
              css={css`
                && {
                  font-size: 20px;
                  margin: 0 0 0 0;
                }
              `}
            />
            <div
              css={css`
                font-size: 12px;
                margin: 0 0 0 4px;
              `}
            >
              {datetimeFrom}
            </div>
          </div>

          <div
            css={css`
              margin: 0 0 0 20px;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-flow: row nowrap;
              `}
            >
              <IconChatBubble
                css={css`
                  && {
                    font-size: 20px;
                    margin: 0 0 0 0;
                  }
                `}
              />
              <div
                css={css`
                  font-size: 12px;
                  margin: 0 0 0 4px;
                `}
              >
                {commentsAndReplies}
              </div>
            </div>
          </div>
        </div>

        <Link href={communityLinkHref} as={communityLinkAs}>
          <a>
            <div
              css={css`
                padding: 6px 10px 8px 10px;
              `}
            >
              <Button
                css={css`
                  text-transform: none !important;
                `}
                // size="small"
                color="primary"
              >
                {communityName}
              </Button>
            </div>
          </a>
        </Link>
      </div>
    </Card>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

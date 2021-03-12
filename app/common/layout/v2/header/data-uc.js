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
import moment from "moment";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { makeStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconKeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import IconKeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FollowButton from "app/common/follow/v2/follow-button.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssTitleBox = css`
  display: flex;
  flex-flow: row nowrap;
  margin: 0 0 2px 0;
  padding: 0 6px 4px 10px;
  border-bottom: #d51a53 solid 1px;
`;

const cssInfo = css`
  padding: 6px 20px 0;
  font-size: 12px;
  line-height: 1.4em;
`;

// --------------------------------------------------
//   Open
// --------------------------------------------------

const cssTitle = css`
  flex-grow: 2;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.4em;
  margin: 6px 0 0 0;
`;

// --------------------------------------------------
//   Closed
// --------------------------------------------------

const cssTitleClosed = css`
  font-size: 14px;
  font-weight: normal;
  line-height: 1.4em;
  margin: 0;
  padding: 4px 4px 4px 10px;
`;

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  tooltip: {
    backgroundColor: "white",
    color: "black",
    fontSize: 11,
  },

  arrow: {
    color: "white",
  },
});

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

const Component = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const classes = useStyles();

  const [open, setOpen] = useState(true);

  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { headerObj, heroImage } = props;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const name = lodashGet(headerObj, ["name"], "");
  const createdDate = moment(lodashGet(headerObj, ["createdDate"], ""))
    .utc()
    .format("YYYY/MM/DD");
  const userCommunities_id = lodashGet(headerObj, ["userCommunities_id"], "");
  const followsObj = lodashGet(headerObj, ["followsObj"], {});
  const followedCount = lodashGet(
    headerObj,
    ["followsObj", "followedCount"],
    0
  );
  const approval = lodashGet(headerObj, ["followsObj", "approval"], false);
  const communityType = lodashGet(headerObj, ["communityType"], "open");

  // --------------------------------------------------
  //   関連するゲーム
  // --------------------------------------------------

  const gamesArr = lodashGet(headerObj, ["gamesArr"], []);

  const codeGames = [];

  for (const [index, valueObj] of gamesArr.entries()) {
    const src = lodashGet(
      valueObj,
      ["imagesAndVideosThumbnailObj", "arr", 0, "src"],
      "/img/common/thumbnail/none-game.jpg"
    );
    const srcSet = lodashGet(
      valueObj,
      ["imagesAndVideosThumbnailObj", "arr", 0, "srcSet"],
      ""
    );

    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    codeGames.push(
      <Link href={"/gc/[urlID]"} as={`/gc/${valueObj.urlID}`} key={index}>
        <a className="link">
          <Tooltip classes={classes} title={valueObj.name} arrow>
            {/* よくわからないが Tooltip の内部は div で囲まないとエラーが出る */}
            <div>
              <IconButton
                css={css`
                  && {
                    margin: 0;
                    padding: 0;
                  }
                `}
              >
                <Avatar
                  css={css`
                    && {
                      width: 24px;
                      height: 24px;
                      margin: 0 4px;
                      cursor: pointer;
                    }
                  `}
                  alt={valueObj.name}
                  src={src}
                  srcSet={srcSet}
                />
              </IconButton>
            </div>
          </Tooltip>
        </a>
      </Link>
    );
  }

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  let component = "";

  // --------------------------------------------------
  //   Hero Image
  // --------------------------------------------------

  if (heroImage) {
    // --------------------------------------------------
    //   Open
    // --------------------------------------------------

    if (open) {
      component = (
        <div
          css={css`
            width: 280px;
            border-radius: 8px;
            background-color: #000;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;

            position: absolute;
            right: 15px;
            bottom: 15px;
            padding: 0 0 6px 0;
          `}
        >
          {/* Name & Open Button */}
          <div css={cssTitleBox}>
            <div css={cssTitle}>{name}</div>

            <IconButton
              css={css`
                && {
                  font-size: 12px;
                  width: 24px;
                  height: 24px;
                  min-width: 24px;
                  min-height: 24px;
                  margin: 2px auto 0;
                  padding: 2px 0 0 0;
                }
              `}
              color="secondary"
              onClick={() => setOpen(false)}
            >
              <IconKeyboardArrowUp />
            </IconButton>
          </div>

          {/* Data */}
          <p css={cssInfo}>開設日 | {createdDate}</p>
          <p css={cssInfo}>メンバー | {followedCount}人</p>
          <p css={cssInfo}>
            公開タイプ | {communityType === "open" ? "オープン" : "クローズド"}
          </p>
          <p css={cssInfo}>
            参加方法 | {approval ? "承認制" : "誰でも参加可能"}
          </p>

          {/* Game */}
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              margin: 12px 8px 2px;
            `}
          >
            {codeGames}
          </div>

          {/* Follow Button */}
          <FollowButton
            type="header"
            userCommunities_id={userCommunities_id}
            followsObj={followsObj}
          />
        </div>
      );

      // --------------------------------------------------
      //   Closed
      // --------------------------------------------------
    } else {
      component = (
        <div
          css={css`
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;

            min-width: 150px;
            max-width: 300px;
            border-radius: 8px;
            background-color: #000;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;

            position: absolute;
            right: 15px;
            bottom: 15px;
            padding: 0 2px 0 0;
          `}
        >
          {/* Name */}
          <div css={cssTitleClosed}>{name}</div>

          {/* Open Button */}
          <IconButton
            css={css`
              && {
                font-size: 12px;
                width: 24px;
                height: 24px;
                min-width: 24px;
                min-height: 24px;
                margin: 2px 0 0 0;
                padding: 0;
              }
            `}
            color="secondary"
            onClick={() => setOpen(true)}
          >
            <IconKeyboardArrowDown />
          </IconButton>
        </div>
      );
    }

    // --------------------------------------------------
    //   Thumbnail
    // --------------------------------------------------
  } else {
    // --------------------------------------------------
    //   Open
    // --------------------------------------------------

    if (open) {
      component = (
        <div
          css={css`
            min-width: 150px;
            max-width: 300px;
            border-radius: 8px;
            background-color: #000;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            padding: 0 0 6px 0;
          `}
        >
          {/* Name & Open Button */}
          <div css={cssTitleBox}>
            <div css={cssTitle}>{name}</div>

            <IconButton
              css={css`
                && {
                  font-size: 12px;
                  width: 24px;
                  height: 24px;
                  min-width: 24px;
                  min-height: 24px;
                  margin: 2px auto 0;
                  padding: 2px 0 0 0;
                }
              `}
              color="secondary"
              onClick={() => setOpen(false)}
            >
              <IconKeyboardArrowUp />
            </IconButton>
          </div>

          {/* Data */}
          <p css={cssInfo}>開設日 | {createdDate}</p>
          <p css={cssInfo}>メンバー | {followedCount}人</p>
          <p css={cssInfo}>
            公開タイプ | {communityType === "open" ? "オープン" : "クローズド"}
          </p>
          <p css={cssInfo}>
            参加方法 | {approval ? "承認制" : "誰でも参加可能"}
          </p>

          {/* Game */}
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              margin: 12px 8px 2px;
            `}
          >
            {codeGames}
          </div>

          {/* Follow Button */}
          <FollowButton
            type="header"
            userCommunities_id={userCommunities_id}
            followsObj={followsObj}
          />
        </div>
      );

      // --------------------------------------------------
      //   Closed
      // --------------------------------------------------
    } else {
      component = (
        <div
          css={css`
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;

            min-width: 150px;
            max-width: 300px;
            border-radius: 8px;
            background-color: #000;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            padding: 0 2px 0 0;
          `}
        >
          {/* Name */}
          <div css={cssTitleClosed}>{name}</div>

          {/* Open Button */}
          <IconButton
            css={css`
              && {
                font-size: 12px;
                width: 24px;
                height: 24px;
                min-width: 24px;
                min-height: 24px;
                margin: 2px 0 0 0;
                padding: 0;
              }
            `}
            color="secondary"
            onClick={() => setOpen(true)}
          >
            <IconKeyboardArrowDown />
          </IconButton>
        </div>
      );
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/header/data-uc.js
  // `);

  // console.log(chalk`
  //   open: {green ${open}}
  // `);

  // console.log(`
  //   ----- headerObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(headerObj)), { colors: true, depth: null })}\n
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

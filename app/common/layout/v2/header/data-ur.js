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
// import Link from 'next/link';

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import IconButton from "@material-ui/core/IconButton";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconHealing from "@material-ui/icons/Healing";
import IconKeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import IconKeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { calculateLevel, calculateToNextLevel } from "app/@modules/level.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import TitleChip from "app/common/title/v2/chip.js";
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
//   Opened
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
//   Function Components
// --------------------------------------------------

const Component = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [open, setOpen] = useState(true);

  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { headerObj, heroImage } = props;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const name = lodashGet(headerObj, ["name"], "");
  const status = lodashGet(headerObj, ["status"], "");

  const exp = lodashGet(headerObj, ["exp"], 0);
  const level = calculateLevel({ exp });
  const tnl = calculateToNextLevel({ exp });

  const titlesArr = lodashGet(headerObj, ["titlesArr"], []);

  const users_id = lodashGet(headerObj, ["users_id"], "");
  const followsObj = lodashGet(headerObj, ["followsObj"], {});
  const followCount = lodashGet(headerObj, ["followsObj", "followCount"], 0);
  const followedCount = lodashGet(
    headerObj,
    ["followsObj", "followedCount"],
    0
  );
  const admin = lodashGet(followsObj, ["admin"], false);

  // --------------------------------------------------
  //   Component - Name
  // --------------------------------------------------

  let componentName = "";

  componentName = (
    <div
      css={css`
        display: flex;
        flex-flow: row wrap;
      `}
    >
      <div
        css={css`
          font-size: 14px;
          margin: 0 2px 0 0;
        `}
      >
        {name}
      </div>

      <IconHealing
        css={css`
          && {
            font-size: 18px;
            margin: 0 2px 0 0;
          }
        `}
      />

      <div
        css={css`
          font-size: 14px;
          margin: 0 2px 0 0;
        `}
      >
        {status}
      </div>
    </div>
  );

  // --------------------------------------------------
  //   Component - Achievement
  // --------------------------------------------------

  const componentAchievementsArr = [];

  for (const [index, valueObj] of titlesArr.entries()) {
    componentAchievementsArr.push(
      <div
        css={css`
          margin: 12px 0 0 12px;
        `}
        key={index}
      >
        <TitleChip
          _id={valueObj._id}
          urlID={valueObj.urlID}
          name={valueObj.name}
        />
      </div>
    );
  }

  let componentAchievement = "";

  if (componentAchievementsArr.length > 0) {
    componentAchievement = (
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 0 6px 0;
        `}
      >
        {componentAchievementsArr}
      </div>
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
            ${admin && componentAchievement
              ? "padding: 0 0 12px 0;"
              : "padding: 0 0 6px 0;"}
          `}
        >
          {/* Name & Open Button */}
          <div css={cssTitleBox}>
            <div css={cssTitle}>{componentName}</div>

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
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              margin: 0 0 2px 0;
            `}
          >
            <p css={cssInfo}>Lv. {level}</p>
            <p css={cssInfo}>次のレベルまで {tnl} Exp</p>
          </div>

          {/* Follower */}
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              margin: 0 0 2px 0;
            `}
          >
            <p css={cssInfo}>フォロー {followCount}人</p>
            <p css={cssInfo}>フォロワー {followedCount}人</p>
          </div>

          {/* Achievement */}
          {componentAchievement}

          {/* Follow Button */}
          <FollowButton
            type="header"
            users_id={users_id}
            followsObj={followsObj}
            updateHeader={true}
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
          <div css={cssTitleClosed}>{componentName}</div>

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
            <div css={cssTitle}>{componentName}</div>

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
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              margin: 0 0 2px 0;
            `}
          >
            <p css={cssInfo}>Lv. {level}</p>
            <p css={cssInfo}>次のレベルまで {tnl} Exp</p>
          </div>

          {/* Follower */}
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              margin: 0 0 2px 0;
            `}
          >
            <p css={cssInfo}>フォロー {followCount}人</p>
            <p css={cssInfo}>フォロワー {followedCount}人</p>
          </div>

          {/* Achievement */}
          {componentAchievement}

          {/* Follow Button */}
          <FollowButton
            type="header"
            users_id={users_id}
            followsObj={followsObj}
            updateHeader={true}
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
          <div css={cssTitleClosed}>{componentName}</div>

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
  //   /app/common/layout/v2/components/header/data-ur.js
  // `);

  // console.log(chalk`
  //   open: {green ${open}}
  //   name: {green ${name}}
  //   hardware: {green ${hardware}}
  // `);

  // console.log(`
  //   ----- hardwareSortedArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(hardwareSortedArr)), { colors: true, depth: null })}\n
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

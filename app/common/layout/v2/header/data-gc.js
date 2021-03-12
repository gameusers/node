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

import React, { useState } from "react";
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

import IconButton from "@material-ui/core/IconButton";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconKeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import IconKeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import LinkIcons from "app/common/layout/v2/header/link-icons.js";
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
  const urlID = lodashGet(headerObj, ["urlID"], "");
  const linkHref = `/gc/${urlID}`;
  const gameCommunities_id = lodashGet(headerObj, ["gameCommunities_id"], "");
  const followsObj = lodashGet(headerObj, ["followsObj"], {});

  // --------------------------------------------------
  //   Hardware
  // --------------------------------------------------

  const hardwareArr = lodashGet(headerObj, ["hardwareArr"], []);
  const hardwaresArr = lodashGet(headerObj, ["hardwaresArr"], []);

  // ハードウェアの発売日順に並び替える
  const hardwareSortedArr = hardwareArr.slice().sort((a, b) => {
    // const date1 = new Date(a.releaseDate);
    // const date2 = new Date(b.releaseDate);

    // 発売日が登録されていないハードウェアを一番後ろに持っていくために new Date() としている
    const date1 = a.releaseDate ? new Date(a.releaseDate) : new Date();
    const date2 = b.releaseDate ? new Date(b.releaseDate) : new Date();

    return date1 < date2 ? -1 : 1;
  });

  const hardwareNameArr = [];

  for (let valueObj of hardwareSortedArr.values()) {
    const resultObj = hardwaresArr.find((value2Obj) => {
      return value2Obj.hardwareID === valueObj.hardwareID;
    });

    if ("name" in resultObj) {
      hardwareNameArr.push(resultObj.name);
    }
  }

  const hardware = hardwareNameArr.join(", ");

  // --------------------------------------------------
  //   Genre
  // --------------------------------------------------

  const genreArr = lodashGet(headerObj, ["genreArr"], []);
  const gameGenresArr = lodashGet(headerObj, ["gameGenresArr"], []);

  const genreNameArr = [];

  for (let value of genreArr.values()) {
    const resultObj = gameGenresArr.find((value2Obj) => {
      return value2Obj.genreID === value;
    });

    if ("name" in resultObj) {
      genreNameArr.push(resultObj.name);
    }
  }

  const genre = genreNameArr.join(", ");

  // --------------------------------------------------
  //   Players
  // --------------------------------------------------

  const playersMin = lodashGet(hardwareSortedArr, [0, "playersMin"], 1);
  const playersMax = lodashGet(hardwareSortedArr, [0, "playersMax"], 1);
  const players =
    playersMin === playersMax
      ? `${playersMin}人`
      : `${playersMin}-${playersMax}人`;

  // --------------------------------------------------
  //   Release Date
  // --------------------------------------------------

  const releaseData = lodashGet(hardwareSortedArr, [0, "releaseDate"], "");
  let formattedReleaseData = "";

  if (releaseData) {
    formattedReleaseData = moment(releaseData).utc().format("YYYY/MM/DD");
  }

  // --------------------------------------------------
  //   Developer & Publisher
  // --------------------------------------------------

  const developersPublishersArr = lodashGet(
    headerObj,
    ["developersPublishersArr"],
    []
  );
  const developersPublishers = developersPublishersArr.join(", ");

  // --------------------------------------------------
  //   Link
  // --------------------------------------------------

  const linkArr = lodashGet(headerObj, ["linkArr"], []);

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
            <div css={cssTitle}>
              <Link href={linkHref}>
                <a style={{ color: "white" }}>{name}</a>
              </Link>
            </div>
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
          <p css={cssInfo}>ハード | {hardware}</p>
          <p css={cssInfo}>ジャンル | {genre}</p>
          <p css={cssInfo}>プレイ人数 | {players}</p>
          <p css={cssInfo}>発売日 | {formattedReleaseData}</p>
          <p css={cssInfo}>開発・販売 | {developersPublishers}</p>

          {/* Link */}
          <LinkIcons linkArr={linkArr} />

          {/* Follow Button */}
          <FollowButton
            type="header"
            gameCommunities_id={gameCommunities_id}
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
          {/* Name */}
          <div css={cssTitleBox}>
            <div css={cssTitle}>{name}</div>
          </div>

          {/* Data */}
          <p css={cssInfo}>ハード | {hardware}</p>
          <p css={cssInfo}>ジャンル | {genre}</p>
          <p css={cssInfo}>プレイ人数 | {players}</p>
          <p css={cssInfo}>発売日 | {formattedReleaseData}</p>
          <p css={cssInfo}>開発・販売 | {developersPublishers}</p>

          {/* Link */}
          <LinkIcons linkArr={linkArr} />

          {/* Data */}
          <FollowButton
            type="header"
            gameCommunities_id={gameCommunities_id}
            followsObj={followsObj}
          />
        </div>
      );
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
        </div>
      );
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/header/data-gc.js
  // `);

  // console.log(chalk`
  //   open: {green ${open}}
  //   name: {green ${name}}
  //   hardware: {green ${hardware}}
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

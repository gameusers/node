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

// import React from 'react';
import Link from "next/link";
import {
  animateScroll as scroll,
  scrollSpy,
  scroller,
  Events,
} from "react-scroll";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconLocalFlorist from "@material-ui/icons/LocalFlorist";
import IconCopyright from "@material-ui/icons/Copyright";
import IconNavigation from "@material-ui/icons/Navigation";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssMenu = css`
  @media screen and (max-width: 480px) {
    font-size: 12px;
  }
`;

const cssMenuVerticalBar = css`
  margin: 0 10px;

  @media screen and (max-width: 480px) {
    margin: 0 5px;
  }
`;

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/sidebar.js
  // `);

  // console.log(chalk`
  //   login: {green ${login}}
  // `);

  // console.log(`
  //   ----- linkArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(linkArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <footer
      css={css`
        width: 100%;
        color: white;
        background-color: black;

        position: absolute;
        bottom: 0;

        padding: 6px 0 6px;
      `}
    >
      {/* Top */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          font-size: 14px;
          color: white;
        `}
      >
        {/* Logo Flower */}
        <Button
          css={css`
            && {
              font-size: 30px;
              height: 34px;
              min-width: 30px;
              min-height: 34px;
              padding: 0 20px 0 8px;

              @media screen and (max-width: 480px) {
                font-size: 18px;
                height: 30px;
                min-height: 30px;
                padding: 0 14px 0 10px;
              }
            }
          `}
          color="secondary"
        >
          <IconLocalFlorist
            css={css`
              font-size: 26px;
              margin: 0 0 3px;

              @media screen and (max-width: 480px) {
                margin: 0 0 2px 0;
              }
            `}
          />
          GU
        </Button>

        {/* Navigation */}
        <div
          css={css`
            display: flex;
            flex-flow: row wrap;
            flex-grow: 2;
            // margin: 0 0 0 0;
            color: white;

            @media screen and (max-width: 480px) {
              font-size: 12px;
            }
          `}
        >
          <div css={cssMenu}>
            <Link href="/uc/official">
              <a className="link-white">公式コミュニティ</a>
            </Link>
          </div>
          <div css={cssMenuVerticalBar}>|</div>
          <div css={cssMenu}>
            <Link href="/inquiry/form">
              <a className="link-white">お問い合わせ</a>
            </Link>
          </div>
          <div css={cssMenuVerticalBar}>|</div>
          <div css={cssMenu}>
            <Link href="https://twitter.com/gameusersorg">
              <a className="link-white">Twitter</a>
            </Link>
          </div>
        </div>

        {/* Scroll To Top Icon */}
        <div
          css={css`
            // position: absolute;
            // top: 10px;
            // right: 10px;
            margin: 0 10px 0 0;
          `}
        >
          <Fab color="secondary" size="small" onClick={scroll.scrollToTop}>
            <IconNavigation />
          </Fab>
        </div>
      </div>

      {/* Bottom */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
        `}
      >
        <IconCopyright
          css={css`
            && {
              font-size: 20px;
            }
          `}
        />

        <div
          css={css`
            font-size: 12px;
            margin: 0 0 0 4px;
          `}
        >
          Game Users All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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
import IconButton from "@material-ui/core/IconButton";

// ---------------------------------------------
//   Simple Icons
// ---------------------------------------------

import {
  Twitter as SimpleIconTwitter,
  Github as SimpleIconGitHub,
} from "@icons-pack/react-simple-icons";

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

          @media screen and (max-width: 480px) {
            margin: 0 0 6px 0;
          }
        `}
      >
        {/* Logo Flower */}
        <Button
          css={css`
            && {
              font-size: 30px;
              height: 34px;
              min-height: 34px;
              padding: 0 20px 0 8px;

              @media screen and (max-width: 480px) {
                font-size: 18px;
                padding: 0;
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
            color: white;
            margin: 0 12px 0 6px;

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
            <IconButton
              css={css`
                && {
                  margin: 0 10px 0 0;
                  padding: 0;
                }
              `}
              aria-label="Twitter"
              href="https://twitter.com/gameusersorg"
              target="_blank"
            >
              <SimpleIconTwitter title="Twitter" color="#1DA1F2" size={20} />
            </IconButton>

            <IconButton
              css={css`
                && {
                  padding: 0;
                }
              `}
              aria-label="GitHub"
              href="https://github.com/gameusers/node"
              target="_blank"
            >
              <SimpleIconGitHub title="GitHub" color="#FFFFFF" size={20} />
            </IconButton>
          </div>
        </div>

        {/* Scroll To Top Icon */}
        <div
          css={css`
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

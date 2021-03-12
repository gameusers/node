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

import Paper from "@material-ui/core/Paper";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconSchedule from "@material-ui/icons/Schedule";
import IconPermIdentity from "@material-ui/icons/PermIdentity";

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
  //   データが存在しない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (Object.keys(obj).length === 0) {
    return null;
  }

  // console.log(`
  //   ----- obj -----\n
  //   ${util.inspect(obj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // ---------------------------------------------
  //   Data
  // ---------------------------------------------

  const urlID = lodashGet(obj, ["urlID"], "");
  const name = lodashGet(obj, ["name"], "");
  const subtitle = lodashGet(obj, ["subtitle"], "");
  const src = lodashGet(obj, ["src"], "/img/common/thumbnail/none-game.jpg");
  const srcSet = lodashGet(obj, ["srcSet"], "");
  const developersPublishers = lodashGet(obj, ["developersPublishers"], "");
  const followedCount = lodashGet(obj, ["followedCount"], 0);
  const datetimeFrom = lodashGet(obj, ["datetimeFrom"], "");

  // --------------------------------------------------
  //   Link
  // --------------------------------------------------

  const linkHref = "/gc/[urlID]/";
  const linkAs = `/gc/${urlID}`;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/common/feed/card.js
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
    <Link href={linkHref} as={linkAs}>
      <a className="link">
        <Paper
          css={css`
            && {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              margin: 12px 0 0 0;
            }
          `}
        >
          {/* Left */}
          <div>
            <img
              css={css`
                border-radius: 4px 0 0 4px;
              `}
              src={src}
              srcSet={srcSet}
              width="48"
            />
          </div>

          {/* Right */}
          <div
            css={css`
              display: flex;
              flex-flow: column nowrap;
              line-height: 1;
              width: 100%;
              margin: 4px 0 0 0;
              padding: 4px 8px;
            `}
          >
            <div
              css={css`
                font-weight: bold;
              `}
            >
              {name}
              {subtitle}
            </div>

            <div
              css={css`
                display: flex;
                flex-flow: row wrap;
                align-items: center;

                margin: 4px 0 0 0;
              `}
            >
              <div>{developersPublishers}</div>

              <div
                css={css`
                  display: flex;
                  flex-flow: row wrap;
                  margin: 0 0 0 auto;

                  @media screen and (max-width: 480px) {
                    display: none;
                  }
                `}
              >
                {datetimeFrom && (
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row nowrap;
                      align-items: center;
                      margin: 0 0 0 12px;
                    `}
                  >
                    <IconSchedule
                      css={css`
                        && {
                          font-size: 16px;
                          margin: 0 0 1px 0;
                        }
                      `}
                    />
                    <div
                      css={css`
                        font-size: 12px;
                        margin: 0 0 0 2px;
                      `}
                    >
                      {datetimeFrom}
                    </div>
                  </div>
                )}

                {followedCount > 0 && (
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row nowrap;
                      align-items: center;
                      margin: 0 0 0 12px;
                    `}
                  >
                    <IconPermIdentity
                      css={css`
                        && {
                          font-size: 16px;
                          margin: 0 0 0 0;
                        }
                      `}
                    />
                    <div
                      css={css`
                        font-size: 12px;
                        margin: 0 0 0 2px;
                      `}
                    >
                      {followedCount}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </a>
    </Link>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

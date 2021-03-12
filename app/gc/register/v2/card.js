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
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";

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

  const { obj = {}, handleGetEditData } = props;

  // --------------------------------------------------
  //   データが存在しない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (Object.keys(obj).length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();

  const { login } = stateUser;

  // ---------------------------------------------
  //   Data
  // ---------------------------------------------

  const _id = lodashGet(obj, ["_id"], "");
  const name = lodashGet(obj, ["name"], "");
  const subtitle = lodashGet(obj, ["subtitle"], "");
  const src = lodashGet(obj, ["src"], "/img/common/thumbnail/none-game.jpg");
  const srcSet = lodashGet(obj, ["srcSet"], "");
  const developersPublishers = lodashGet(obj, ["developersPublishers"], "");

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
    <Paper
      css={css`
        && {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          cursor: pointer;
          margin: 12px 0 0 0;
        }
      `}
      onClick={login ? () => handleGetEditData({ games_id: _id }) : () => {}}
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
            <div
              css={css`
                margin: 0 0 0 12px;
              `}
            >
              <div
                css={css`
                  font-size: 12px;
                  font-weight: bold;
                `}
              >
                [本登録]
              </div>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

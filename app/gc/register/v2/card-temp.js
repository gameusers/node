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
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
import { ContainerStateGcRegister } from "app/@states/gc-register.js";

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
  const stateGcRegister = ContainerStateGcRegister.useContainer();

  const { login, loginUsersObj } = stateUser;
  const { adminCheckedGamesTemps_idsArr, handleAdminCheck } = stateGcRegister;

  const role = lodashGet(loginUsersObj, ["role"], "");
  const administrator = role === "administrator" ? true : false;

  // ---------------------------------------------
  //   Data
  // ---------------------------------------------

  const gamesTemps_id = lodashGet(obj, ["_id"], "");
  const createdDate = lodashGet(obj, ["createdDate"], "");
  const approval = lodashGet(obj, ["approval"], false);
  const users_id = lodashGet(obj, ["users_id"], "");
  const name = lodashGet(obj, ["name"], "");
  const subtitle = lodashGet(obj, ["subtitle"], "");
  const src = "/img/common/thumbnail/none-game.jpg";
  const srcSet = "";

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/gc/register/v2/card-temp.js
  // `);

  // console.log(`
  //   ----- obj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(obj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   adminCheckedGamesTemps_idsArr.includes(gamesTemps_id): {green ${adminCheckedGamesTemps_idsArr.includes(gamesTemps_id)}}
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
    >
      {/* Left */}
      <div
        onClick={login ? () => handleGetEditData({ gamesTemps_id }) : () => {}}
      >
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
        onClick={login ? () => handleGetEditData({ gamesTemps_id }) : () => {}}
      >
        <div
          css={css`
            font-weight: bold;
          `}
        >
          {name}
          {subtitle}
          {administrator && `: ${users_id}`}
        </div>

        <div
          css={css`
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            margin: 4px 0 0 0;
          `}
        >
          <div
            css={css`
              margin: 0 4px 0 0;
            `}
          >
            Ver. {createdDate}
          </div>

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
                `}
              >
                [仮登録 / {approval ? "運営確認済み" : "運営未確認"}]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Approval And Delete Checkbox */}
      {administrator && (
        <div
          css={css`
            width: 26px;
            margin: 0 0 0 24px;
          `}
        >
          {!approval && (
            <FormControlLabel
              control={
                <Checkbox
                  css={css`
                    && {
                      padding: 0;
                    }
                  `}
                  checked={adminCheckedGamesTemps_idsArr.includes(
                    gamesTemps_id
                  )}
                  onChange={() => handleAdminCheck({ gamesTemps_id })}
                />
              }
            />
          )}
        </div>
      )}
    </Paper>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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
// import lodashSet from 'lodash/set';
// import lodashHas from 'lodash/has';
// import lodashCloneDeep from 'lodash/cloneDeep';
// import lodashMerge from 'lodash/merge';

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Avatar from "@material-ui/core/Avatar";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconDescription from "@material-ui/icons/Description";
import IconInformation from "@material-ui/icons/MenuBook";

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

  const { publicInformationsArr = [] } = props;

  // --------------------------------------------------
  //   必要な情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (
    !Array.isArray(publicInformationsArr) ||
    publicInformationsArr.length === 0
  ) {
    return null;
  }

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, valueObj] of publicInformationsArr.entries()) {
    const _id = lodashGet(valueObj, ["_id"], "");
    const title = lodashGet(valueObj, ["title"], "");
    const information = lodashGet(valueObj, ["information"], "");

    componentsArr.push(
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          color: #3f51b5;
          border: 1px solid #3f51b5;
          border-radius: 18px;
          margin: 8px 8px 0 0;
        `}
        key={`publicInformations-${index}-${_id}`}
      >
        <Avatar
          css={css`
            && {
              width: 32px;
              height: 32px;
              background-color: #3f51b5;
            }
          `}
        >
          <IconInformation />
        </Avatar>

        <div
          css={css`
            display: flex;
            flex-flow: row wrap;
            font-size: 14px;
            line-height: 1.4;
            padding: 4px 14px 4px 6px;
          `}
        >
          <span
            css={css`
              font-weight: bold;
              padding: 0 4px 0 0;
            `}
          >
            {title}:
          </span>

          <span>{information}</span>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/public-informations.js
  // `);

  // console.log(`
  //   ----- publicInformationsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(publicInformationsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Heading */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        `}
      >
        <IconDescription
          css={css`
            && {
              font-size: 24px;
            }
          `}
        />

        <h3
          css={css`
            margin: 2px 0 0 4px;
          `}
        >
          情報
        </h3>
      </div>

      {/* Informations */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 4px 0 0 0;

          @media screen and (max-width: 480px) {
            flex-flow: column wrap;
          }
        `}
      >
        {componentsArr}
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

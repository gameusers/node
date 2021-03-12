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

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconAlarm from "@material-ui/icons/Alarm";

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

  const { arr } = props;

  // --------------------------------------------------
  //   必要な情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, valueObj] of arr.entries()) {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const weekTextArr = ["月", "火", "水", "木", "金", "土", "日"];
    const weekArr = lodashGet(valueObj, ["weekArr"], []);

    // --------------------------------------------------
    //   曜日
    // --------------------------------------------------

    let week = "";

    if (weekArr.length > 0) {
      const tempArr = [];

      for (let value of weekArr.values()) {
        tempArr.push(weekTextArr[value - 1]);
      }

      week = ` (${tempArr.join(" / ")})`;
    }

    // --------------------------------------------------
    //   Push
    // --------------------------------------------------

    componentsArr.push(
      <div
        css={css`
          margin: 0 20px 0 0;

          @media screen and (max-width: 480px) {
            margin: 0;
          }
        `}
        key={`activityTime${index}`}
      >
        {valueObj.beginTime} ～ {valueObj.endTime}
        {week}
      </div>
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        border-top: 1px dashed #a4a4a4;
        margin: 24px 0 0 0;
        padding: 24px 0 0 0;
      `}
    >
      {/* Heading */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        `}
      >
        <IconAlarm
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
          活動時間
        </h3>
      </div>

      {/* Components */}
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
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

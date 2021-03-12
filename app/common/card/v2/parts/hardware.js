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

import IconGamepad from "@material-ui/icons/Gamepad";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssHeading = css`
  margin: 3px 0 0 4px;
`;

const cssItem = css`
  margin: 0 20px 0 0;

  @media screen and (max-width: 480px) {
    margin: 0;
  }
`;

const cssSpanColor = css`
  color: #088a08;
`;

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

  const { hardwareActiveArr = [], hardwareInactiveArr = [] } = props;

  // --------------------------------------------------
  //   情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (hardwareActiveArr.length === 0 && hardwareInactiveArr.length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   見出し
  // --------------------------------------------------

  const componentHeading = (
    <h3 css={cssHeading}>
      所有ハードウェア<span css={cssSpanColor}>（昔所有）</span>
    </h3>
  );

  // --------------------------------------------------
  //   Component - プロフィール項目（年齢、性別など）
  // --------------------------------------------------

  const componentsArr = [];
  let tempArr = [];

  // ---------------------------------------------
  //   - 所有ハード
  // ---------------------------------------------

  if (Array.isArray(hardwareActiveArr) && hardwareActiveArr.length > 0) {
    for (let valueObj of hardwareActiveArr) {
      tempArr.push(valueObj.name);
    }

    componentsArr.push(
      <div css={cssItem} key="hardwareActive">
        {tempArr.join(" / ")}
      </div>
    );
  }

  // ---------------------------------------------
  //   - 非所有ハード
  // ---------------------------------------------

  tempArr = [];

  if (Array.isArray(hardwareInactiveArr) && hardwareInactiveArr.length > 0) {
    for (let valueObj of hardwareInactiveArr) {
      tempArr.push(valueObj.name);
    }

    componentsArr.push(
      <div css={cssItem} key="hardwareInactive">
        <span css={cssSpanColor}>{tempArr.join(" / ")}</span>
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
        <IconGamepad
          css={css`
            && {
              font-size: 24px;
            }
          `}
        />

        {componentHeading}
      </div>

      {/* ハードウェア */}
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

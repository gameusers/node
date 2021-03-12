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

import IconPhoneIphone from "@material-ui/icons/PhoneIphone";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Paragraph from "app/common/layout/v2/paragraph.js";

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

  const { smartphoneModel, smartphoneComment } = props;

  // --------------------------------------------------
  //   情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (!smartphoneModel && !smartphoneComment) {
    return null;
  }

  // --------------------------------------------------
  //   Component - モデル
  // --------------------------------------------------

  let componentModel = "スマートフォン";

  if (smartphoneModel) {
    componentModel = `スマートフォン: ${smartphoneModel}`;
  }

  // --------------------------------------------------
  //   Component - コメント
  // --------------------------------------------------

  let componentComment = "";

  if (smartphoneComment) {
    componentComment = (
      <div
        css={css`
          margin: 6px 0 0 0;
        `}
      >
        <Paragraph text={smartphoneComment} />
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
        <IconPhoneIphone
          css={css`
            && {
              font-size: 24px;
            }
          `}
        />

        <h3
          css={css`
            margin: 0 0 0 4px;
          `}
        >
          {componentModel}
        </h3>
      </div>

      {/* コメント */}
      {componentComment}
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

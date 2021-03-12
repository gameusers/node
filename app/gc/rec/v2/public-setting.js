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
//   Material UI / Icons
// ---------------------------------------------

import IconWarning from "@material-ui/icons/Warning";

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

  const { type = "thread", publicSetting } = props;

  // --------------------------------------------------
  //   必要な情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (publicSetting === 1) {
    return null;
  }

  // --------------------------------------------------
  //   Text
  // --------------------------------------------------

  let text = "";

  if (publicSetting === 2 && type === "thread") {
    text = "ログインしてコメントした方のみ、閲覧することができます。";
  } else if (publicSetting === 2 && type === "comment") {
    text = "募集者だけに公開されます。";
  } else if (publicSetting === 3 && type === "thread") {
    text =
      "ログインしてコメントした方の中から、募集者が公開する相手を選びます。";
  } else if (publicSetting === 3 && type === "comment") {
    text =
      "募集者がこのコメントをした方に公開すると、お互いが閲覧できるようになります。相互公開。";
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/public-setting.js
  // `);

  // console.log(chalk`
  //   publicSetting: {green ${publicSetting}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        background-color: #fff4e5;
        border-radius: 8px;

        margin: 24px 0 0 0;
        padding: 8px 16px;
      `}
    >
      <div
        css={css`
          color: #ffca7e;
          margin: 5px 8px 0 0;
        `}
      >
        <IconWarning />
      </div>

      <div
        css={css`
          font-size: 12px;
        `}
      >
        {text}
      </div>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

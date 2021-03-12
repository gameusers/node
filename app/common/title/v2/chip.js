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
//   Material UI
// ---------------------------------------------

// import Avatar from '@material-ui/core/Avatar';

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

// import IconGrade from '@material-ui/icons/Grade';
// import IconPC from '@material-ui/icons/LaptopMac';

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

// const cssAvatar = css`
//   && {
//     width: 32px;
//     height: 32px;
//     line-height: 1;
//     background-color: #003791;
//   }
// `;

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

  const { _id, urlID, name } = props;

  // --------------------------------------------------
  //   必要な情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (!_id && !urlID && !name) {
    return null;
  }

  // --------------------------------------------------
  //   Color
  // --------------------------------------------------

  let colorLine =
    "background-image: linear-gradient(25deg, #f80014, #ff7a4f, #ffbd8b, #fcfccb);";
  let colorText =
    "background-image: linear-gradient(25deg, #f80014, #ff7a4f, #ffbd8b, #fcfccb);";

  // ---------------------------------------------
  //   エデンの民
  // ---------------------------------------------

  if (_id === "MuK2dKVpn") {
    colorLine =
      "background-image: linear-gradient(135deg, #704308 0%, #ffce08 40%, #e1ce08 60%, #704308 100%);";
    colorText =
      "background-image: linear-gradient(135deg, #b8751e 0%, #ffce08 37%, #fefeb2 47%, #fafad6 50%, #fefeb2 53%, #e1ce08 63%, #b8751e 100%);";

    // ---------------------------------------------
    //   遊び人
    // ---------------------------------------------
  } else if (_id === "7YCic-Yds") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #b1a395, #9fc0ae, #81ddc8, #42fae2);";

    // ---------------------------------------------
    //   ピエロ
    // ---------------------------------------------
  } else if (_id === "p-XWgcOtK") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f40845, #fa4164, #fe5f84, #ff79a5);";

    // ---------------------------------------------
    //   人気者
    // ---------------------------------------------
  } else if (_id === "8Fbta4f9O") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff6909, #fb9a06, #f2c504, #e4ed06);";

    // ---------------------------------------------
    //   アイドル
    // ---------------------------------------------
  } else if (_id === "g65dAP992") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff0e13, #ff6f47, #ffa77a, #ffd9af);";

    // ---------------------------------------------
    //   スーパースター
    // ---------------------------------------------
  } else if (_id === "Lcqo1Q7Up") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff9900, #fabd03, #f3de0a, #e7ff13);";

    // ---------------------------------------------
    //   教祖様
    // ---------------------------------------------
  } else if (_id === "8Z3SDtXgN") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff2268, #df8e6f, #abca76, #1aff7d);";

    // ---------------------------------------------
    //   カリスマ
    // ---------------------------------------------
  } else if (_id === "wQ-ywcRpP") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #5447ff, #5678ff, #49a4ff, #01cfff);";

    // ---------------------------------------------
    //   預言者
    // ---------------------------------------------
  } else if (_id === "DrgkgbsbH") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #3a572b, #418c3a, #3fc44a, #29ff59);";

    // ---------------------------------------------
    //   救世主
    // ---------------------------------------------
  } else if (_id === "Rb-hOZVrb") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f83e00, #fb8c00, #f8c700, #ecff0a);";

    // ---------------------------------------------
    //   ポエマー
    // ---------------------------------------------
  } else if (_id === "nFJYEhwWB") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #fb02dd, #ff6baf, #ff9d7e, #ffc83d);";

    // ---------------------------------------------
    //   作家
    // ---------------------------------------------
  } else if (_id === "k4xm8yGJD") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #be3b17, #d4601b, #ea8220, #ffa324);";

    // ---------------------------------------------
    //   文豪
    // ---------------------------------------------
  } else if (_id === "ljIghwR69") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #183dce, #6c7cb1, #83bc8f, #80ff5d);";

    // ---------------------------------------------
    //   表現者
    // ---------------------------------------------
  } else if (_id === "WJlkVSLub") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e48716, #eea012, #f7b80c, #ffd100);";

    // ---------------------------------------------
    //   ネゴシエイター
    // ---------------------------------------------
  } else if (_id === "349Q_q5h8") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #a2353c, #be585b, #d9797c, #f39b9e);";

    // ---------------------------------------------
    //   魔導書の書き手
    // ---------------------------------------------
  } else if (_id === "rIK64YljB") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f73331, #e8832d, #d1b924, #ace912);";

    // ---------------------------------------------
    //   悪魔の筆
    // ---------------------------------------------
  } else if (_id === "DQ9iH_r31") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9f159d, #986fbd, #7dacde, #04e6ff);";

    // ---------------------------------------------
    //   ヴォイニッチ手稿
    // ---------------------------------------------
  } else if (_id === "RTMuPDYkt") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #0867fd, #2c8cfc, #2eb0fa, #0bd5f7);";

    // ---------------------------------------------
    //
    // ---------------------------------------------
  } else if (_id === "") {
    colorLine = colorText = "";

    // background-image: linear-gradient(25deg, #5ac4eb, #acd6b8, #dbea80, #fffe30);
    // background-image: linear-gradient(25deg, #6e3bfb, #a76ce7, #ce9bd2, #eccaba);
    // background-image: linear-gradient(25deg, #cb33e0, #e87eb5, #f9b886, #fff040);

    // ---------------------------------------------
    //   書紀
    // ---------------------------------------------
  } else if (_id === "NwzUOqsiC") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #7a19fb, #705ffc, #588cfd, #00b4fd);";

    // ---------------------------------------------
    //
    // ---------------------------------------------
  } else if (_id === "") {
    colorLine = colorText = "";
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/title/v2/chip.js
  // `);

  // console.log(chalk`
  //   _id: {green ${_id}}
  //   urlID: {green ${urlID}}
  //   name: {green ${name}}
  // `);

  // console.log(`
  //   ----- gamesImagesAndVideosThumbnailObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(gamesImagesAndVideosThumbnailObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        color: #fff;
        font-weight: bold;
        background: #000;

        position: relative;
        box-shadow: 0 2px 14px rgba(0, 0, 0, 0.1);

        &:before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          content: "";
          ${colorLine}
        }

        &:after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          content: "";
          ${colorLine}
        }

        // margin: 0 0 0 12px;
        padding: 0 4px;
      `}
    >
      <span
        css={css`
          ${colorText}
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        `}
      >
        {name}
      </span>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

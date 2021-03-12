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
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";

// ---------------------------------------------
//   Simple Icons
// ---------------------------------------------

import {
  Apple as SimpleIconApple,
  Microsoft as SimpleIconMicrosoft,
  Googleplay as SimpleIconGooglePlay,
} from "@icons-pack/react-simple-icons";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssButtonBox = css`
  margin: 5px 12px 0 0;
`;

const cssBox = css`
  margin: 8px 12px 0 0;
`;

const cssButton = css`
  && {
    background-color: #00695c;
    &:hover {
      background-color: #004d40;
    }

    line-height: 1;
    font-size: 12px;
    min-width: 36px;
    min-height: 20px;
    margin: 0;
    padding: 4px 5px 4px 5px;
  }
`;

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 *
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { linkArr = [] } = props;

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  let componentsArr = [];

  for (const [index, valueObj] of linkArr.entries()) {
    if (valueObj.type === "Official") {
      componentsArr.push(
        <div css={cssButtonBox} key={index}>
          <Button
            css={cssButton}
            variant="contained"
            color="secondary"
            href={valueObj.url}
            target="_blank"
          >
            公式
          </Button>
        </div>
      );
    } else if (valueObj.type === "Other") {
      componentsArr.push(
        <div css={cssButtonBox} key={index}>
          <Button
            css={cssButton}
            variant="contained"
            color="primary"
            href={valueObj.url}
            target="_blank"
          >
            {valueObj.label}
          </Button>
        </div>
      );
    } else if (valueObj.type === "Twitter") {
      componentsArr.push(
        <div css={cssBox} key={index}>
          <a href={valueObj.url} target="_blank">
            <img
              src="/img/common/social/twitter@2x.png"
              title="Twitter"
              width="20"
              height="20"
            />
          </a>
        </div>
      );
    } else if (valueObj.type === "Facebook") {
      componentsArr.push(
        <div css={cssBox} key={index}>
          <a href={valueObj.url} target="_blank">
            <img
              src="/img/common/social/facebook@2x.png"
              title="Facebook"
              width="20"
              height="20"
            />
          </a>
        </div>
      );
    } else if (valueObj.type === "YouTube") {
      componentsArr.push(
        <div css={cssBox} key={index}>
          <a href={valueObj.url} target="_blank">
            <img
              src="/img/common/social/youtube@2x.png"
              title="YouTube"
              width="20"
              height="20"
            />
          </a>
        </div>
      );
    } else if (valueObj.type === "Steam") {
      componentsArr.push(
        <div css={cssBox} key={index}>
          <a href={valueObj.url} target="_blank">
            <img
              src="/img/common/social/steam@2x.png"
              title="Steam"
              width="20"
              height="20"
            />
          </a>
        </div>
      );
    } else if (valueObj.type === "MicrosoftStore") {
      componentsArr.push(
        <div
          css={css`
            margin: 8px 8px 0 0;
          `}
          key={index}
        >
          <a href={valueObj.url} target="_blank">
            <div
              css={css`
                width: 20px;
                height: 20px;
              `}
            >
              <SimpleIconMicrosoft
                title="Microsoft Store"
                color="#F54E25"
                size={19}
              />
            </div>
          </a>
        </div>
      );
    } else if (valueObj.type === "AppStore") {
      componentsArr.push(
        <div
          css={css`
            margin: 7px 8px 0 0;
          `}
          key={index}
        >
          <a href={valueObj.url} target="_blank">
            <div
              css={css`
                width: 20px;
                height: 20px;
              `}
            >
              <SimpleIconApple title="App Store" color="#FFFFFF" size={19} />
            </div>
          </a>
        </div>
      );
    } else if (valueObj.type === "GooglePlay") {
      componentsArr.push(
        <div
          css={css`
            margin: 8px 8px 0 0;
          `}
          key={index}
        >
          <a href={valueObj.url} target="_blank">
            <div
              css={css`
                width: 20px;
                height: 20px;
              `}
            >
              <SimpleIconGooglePlay
                title="Google Play"
                color="#00D7FF"
                size={19}
              />
            </div>
          </a>
        </div>
      );
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/header/link-icons.js
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
    <div
      css={css`
        display: flex;
        flex-flow: row wrap;
        padding: 6px 10px 1px 10px;
      `}
    >
      {componentsArr}
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

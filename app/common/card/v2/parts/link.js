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

import Button from "@material-ui/core/Button";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconPublic from "@material-ui/icons/Public";

// ---------------------------------------------
//   Simple Icons
// ---------------------------------------------

import {
  Twitter as SimpleIconTwitter,
  Facebook as SimpleIconFacebook,
  Instagram as SimpleIconInstagram,
  Youtube as SimpleIconYouTube,
  Twitch as SimpleIconTwitch,
  Steam as SimpleIconSteam,
  Discord as SimpleIconDiscord,
  Flickr as SimpleIconFlickr,
  Tumblr as SimpleIconTumblr,
  Pinterest as SimpleIconPinterest,
} from "@icons-pack/react-simple-icons";

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
    if (valueObj.type === "Other") {
      componentsArr.push(
        <div
          css={css`
            margin: 10px 12px 0 0;
          `}
          key={index}
        >
          <Button
            css={css`
              && {
                font-size: 14px;
                min-width: 36px;
                min-height: 26px
                margin: 0;
                padding: 0 6px;
              }
            `}
            variant="outlined"
            color="secondary"
            href={valueObj.url}
            target="_blank"
          >
            {valueObj.label}
          </Button>
        </div>
      );
    } else if (valueObj.url) {
      // --------------------------------------------------
      //   componentSimpleIcon
      // --------------------------------------------------

      let componentSimpleIcon = "";

      if (valueObj.type === "Twitter") {
        componentSimpleIcon = (
          <SimpleIconTwitter title="Twitter" color="#1DA1F2" />
        );
      } else if (valueObj.type === "Facebook") {
        componentSimpleIcon = (
          <SimpleIconFacebook title="Facebook" color="#1877F2" />
        );
      } else if (valueObj.type === "Instagram") {
        componentSimpleIcon = (
          <SimpleIconInstagram title="Instagram" color="#E4405F" />
        );
      } else if (valueObj.type === "YouTube") {
        componentSimpleIcon = (
          <SimpleIconYouTube title="YouTube" color="#FF0000" />
        );
      } else if (valueObj.type === "Twitch") {
        componentSimpleIcon = (
          <SimpleIconTwitch title="Twitch" color="#9146FF" />
        );
      } else if (valueObj.type === "Steam") {
        componentSimpleIcon = <SimpleIconSteam title="Steam" color="#000000" />;
      } else if (valueObj.type === "Discord") {
        componentSimpleIcon = (
          <SimpleIconDiscord title="Discord" color="#7289DA" />
        );
      } else if (valueObj.type === "Flickr") {
        componentSimpleIcon = (
          <SimpleIconFlickr title="Flickr" color="#0063DC" />
        );
      } else if (valueObj.type === "Tumblr") {
        componentSimpleIcon = (
          <SimpleIconTumblr title="Tumblr" color="#36465D" />
        );
      } else if (valueObj.type === "Pinterest") {
        componentSimpleIcon = (
          <SimpleIconPinterest title="Pinterest" color="#BD081C" />
        );
      }

      // --------------------------------------------------
      //   push
      // --------------------------------------------------

      if (componentSimpleIcon) {
        componentsArr.push(
          <div
            css={css`
              margin: 10px 14px 0 0;
            `}
            key={`link${index}`}
          >
            <a href={valueObj.url} target="_blank">
              <div
                css={css`
                  width: 24px;
                  height: 24px;
                `}
              >
                {componentSimpleIcon}
              </div>
            </a>
          </div>
        );
      }
    }
  }

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  let component = "";

  if (componentsArr.length > 0) {
    component = (
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
        `}
      >
        {componentsArr}
      </div>
    );
  } else {
    return null;
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
        <IconPublic
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
          リンク
        </h3>
      </div>

      {/* Link */}
      {component}
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

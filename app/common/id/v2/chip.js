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

import Avatar from "@material-ui/core/Avatar";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconGrade from "@material-ui/icons/Grade";
import IconPC from "@material-ui/icons/LaptopMac";

// ---------------------------------------------
//   Simple Icons
// ---------------------------------------------

import {
  Apple as SimpleIconIOS,
  Android as SimpleIconAndroid,
  Nintendo as SimpleIconNintendo,
  Playstation as SimpleIconPlayStation,
  Xbox as SimpleIconXbox,
  Steam as SimpleIconSteam,
  Origin as SimpleIconOrigin,
  Discord as SimpleIconDiscord,
  Skype as SimpleIconSkype,
  Icq as SimpleIconICQ,
  Line as SimpleIconLINE,
} from "@icons-pack/react-simple-icons";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssAvatar = css`
  && {
    width: 32px;
    height: 32px;
    line-height: 1;
    background-color: #003791;
  }
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

  const {
    platform,
    label,
    id,
    games_id,
    gamesName,
    gamesImagesAndVideosThumbnailObj = {},
  } = props;

  // --------------------------------------------------
  //   必要な情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (!platform && !id) {
    return null;
  }

  // --------------------------------------------------
  //   Component - Avatar & Label
  // --------------------------------------------------

  let componentAvatar = "";
  let labelValue = "";

  // ---------------------------------------------
  //   PlayStation
  // ---------------------------------------------

  if (platform === "PlayStation") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#003791" }}>
        <SimpleIconPlayStation title="PlayStation" color="#FFFFFF" size={24} />
      </Avatar>
    );

    labelValue = "PlayStation";

    // ---------------------------------------------
    //   Xbox
    // ---------------------------------------------
  } else if (platform === "Xbox") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#107C10" }}>
        <SimpleIconXbox title="Xbox" color="#FFFFFF" size={24} />
      </Avatar>
    );

    labelValue = "Xbox";

    // ---------------------------------------------
    //   Nintendo
    // ---------------------------------------------
  } else if (platform === "Nintendo") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#e60012" }}>
        <SimpleIconNintendo name="Nintendo" color="#FFFFFF" size={19} />
      </Avatar>
    );

    labelValue = "Nintendo";

    // ---------------------------------------------
    //   PC
    // ---------------------------------------------
  } else if (platform === "PC") {
    componentAvatar = (
      <Avatar css={cssAvatar} alt="PC" style={{ backgroundColor: "#000000" }}>
        <IconPC />
      </Avatar>
    );

    labelValue = gamesName ? `PC [${gamesName}]` : "PC";

    // ---------------------------------------------
    //   Android
    // ---------------------------------------------
  } else if (platform === "Android") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#A4C639" }}>
        <SimpleIconAndroid title="Android" color="#FFFFFF" size={24} />
      </Avatar>
    );

    labelValue = gamesName ? `Android [${gamesName}]` : "Android";

    // ---------------------------------------------
    //   iOS
    // ---------------------------------------------
  } else if (platform === "iOS") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#999999" }}>
        <SimpleIconIOS title="iOS" color="#FFFFFF" size={22} />
      </Avatar>
    );

    labelValue = gamesName ? `iOS [${gamesName}]` : "iOS";

    // ---------------------------------------------
    //   Steam
    // ---------------------------------------------
  } else if (platform === "Steam") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#000000" }}>
        <SimpleIconSteam title="Steam" color="#FFFFFF" size={24} />
      </Avatar>
    );

    labelValue = "Steam";

    // ---------------------------------------------
    //   Origin
    // ---------------------------------------------
  } else if (platform === "Origin") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#F56C2D" }}>
        <SimpleIconOrigin title="Origin" color="#FFFFFF" size={26} />
      </Avatar>
    );

    labelValue = "Origin";

    // ---------------------------------------------
    //   Discord
    // ---------------------------------------------
  } else if (platform === "Discord") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#7289DA" }}>
        <SimpleIconDiscord title="Discord" color="#FFFFFF" size={19} />
      </Avatar>
    );

    labelValue = "Discord";

    // ---------------------------------------------
    //   Skype
    // ---------------------------------------------
  } else if (platform === "Skype") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#00AFF0" }}>
        <SimpleIconSkype title="Skype" color="#FFFFFF" size={22} />
      </Avatar>
    );

    labelValue = "Skype";

    // ---------------------------------------------
    //   ICQ
    // ---------------------------------------------
  } else if (platform === "ICQ") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#7EBD00" }}>
        <SimpleIconICQ title="ICQ" color="#FFFFFF" size={22} />
      </Avatar>
    );

    labelValue = "ICQ";

    // ---------------------------------------------
    //   Line
    // ---------------------------------------------
  } else if (platform === "Line") {
    componentAvatar = (
      <Avatar css={cssAvatar} style={{ backgroundColor: "#00C300" }}>
        <SimpleIconLINE title="Line" color="#FFFFFF" size={25} />
      </Avatar>
    );

    labelValue = "Line";

    // ---------------------------------------------
    //   Other
    // ---------------------------------------------
  } else if (platform === "Other") {
    componentAvatar = (
      <Avatar
        css={css`
          && {
            width: 32px;
            height: 32px;
            background-color: #3f51b5;
          }
        `}
      >
        <IconGrade />
      </Avatar>
    );
  }

  // --------------------------------------------------
  //   Label
  // --------------------------------------------------

  if (label) {
    labelValue = label;
  }

  // --------------------------------------------------
  //   Component - Sub Avatar
  // --------------------------------------------------

  let componentSubAvatar = "";

  if (
    games_id &&
    gamesName &&
    Object.keys(gamesImagesAndVideosThumbnailObj).length !== 0
  ) {
    const src = lodashGet(
      gamesImagesAndVideosThumbnailObj,
      ["arr", 0, "src"],
      ""
    );
    const srcSet = lodashGet(
      gamesImagesAndVideosThumbnailObj,
      ["arr", 0, "srcSet"],
      ""
    );

    componentSubAvatar = (
      <div
        css={css`
          margin-left: auto;
        `}
      >
        <Avatar css={cssAvatar} alt={gamesName} src={src} srcSet={srcSet} />
      </div>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/id/v2/components/chip.js
  // `);

  // console.log(chalk`
  //   cardPlayers_id: {green ${cardPlayers_id}}
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
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        color: #3f51b5;
        border: 1px solid #3f51b5;
        border-radius: 18px;
        margin: 8px 8px 0 0;
      `}
    >
      <div>{componentAvatar}</div>

      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          font-size: 14px;
          line-height: 1.4;
          padding: ${componentSubAvatar
            ? "4px 6px 4px 6px"
            : "4px 14px 4px 6px"};
        `}
      >
        <span
          css={css`
            font-weight: bold;
            padding: 0 4px 0 0;
          `}
        >
          {labelValue}:
        </span>

        <span>{id}</span>
      </div>

      {componentSubAvatar}
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

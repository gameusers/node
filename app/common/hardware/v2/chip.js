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

import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconLaptopMac from "@material-ui/icons/LaptopMac";
import IconOther from "@material-ui/icons/Grade";

// ---------------------------------------------
//   Simple Icons
// ---------------------------------------------

import {
  Apple as SimpleIconIOS,
  Android as SimpleIconAndroid,
  Nintendo as SimpleIconNintendo,
  NintendoThreeDs as SimpleIconNintendo3DS,
  Playstation as SimpleIconPlayStation,
  Xbox as SimpleIconXbox,
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

  const { hardwaresArr = [] } = props;

  // --------------------------------------------------
  //   配列が空の場合は処理停止
  // --------------------------------------------------

  if (hardwaresArr.length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   Component - Hardware Chips
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, valueObj] of hardwaresArr.entries()) {
    // --------------------------------------------------
    //   - PC
    // --------------------------------------------------

    if (valueObj.hardwareID === "P0UG-LHOQ") {
      componentsArr.push(
        <div
          key={`hardwareChips-${index}`}
          css={css`
            margin: 8px 8px 0 0;
          `}
        >
          <Chip
            avatar={
              <Avatar alt="PC">
                <IconLaptopMac style={{ fontSize: 20 }} />
              </Avatar>
            }
            label="PC"
            color="primary"
            variant="outlined"
          />
        </div>
      );

      // --------------------------------------------------
      //   - Android
      // --------------------------------------------------
    } else if (valueObj.hardwareID === "SXybALV1f") {
      componentsArr.push(
        <div
          key={`hardwareChips-${index}`}
          css={css`
            margin: 8px 8px 0 0;
          `}
        >
          <Chip
            avatar={
              <Avatar style={{ backgroundColor: "#3DDC84" }}>
                <SimpleIconAndroid title="Android" color="#FFFFFF" size={18} />
              </Avatar>
            }
            label={valueObj.name}
            color="primary"
            variant="outlined"
          />
        </div>
      );

      // --------------------------------------------------
      //   - iOS
      // --------------------------------------------------
    } else if (valueObj.hardwareID === "o-f3Zxd49") {
      componentsArr.push(
        <div
          key={`hardwareChips-${index}`}
          css={css`
            margin: 8px 8px 0 0;
          `}
        >
          <Chip
            avatar={
              <Avatar
                alt={valueObj.name}
                style={{ backgroundColor: "#999999" }}
              >
                <SimpleIconIOS title="iOS" color="#FFFFFF" size={18} />
              </Avatar>
            }
            label={valueObj.name}
            color="primary"
            variant="outlined"
          />
        </div>
      );

      // --------------------------------------------------
      //   - Nintendo Switch / Wii U
      // --------------------------------------------------
    } else if (["Zd_Ia4Hwm", "uPqoiXA_8"].includes(valueObj.hardwareID)) {
      componentsArr.push(
        <div
          key={`hardwareChips-${index}`}
          css={css`
            margin: 8px 8px 0 0;
          `}
        >
          <Chip
            avatar={
              <Avatar
                alt={valueObj.name}
                style={{ backgroundColor: "#E60012" }}
              >
                <SimpleIconNintendo name="Nintendo" color="#FFFFFF" size={16} />
              </Avatar>
            }
            label={valueObj.name}
            color="primary"
            variant="outlined"
          />
        </div>
      );

      // --------------------------------------------------
      //   - Newニンテンドー3DS / Newニンテンドー3DS LL / ニンテンドー3DS / ニンテンドー3DS LL / Newニンテンドー2DS LL / ニンテンドー2DS
      // --------------------------------------------------
    } else if (
      [
        "XdHIETDWn",
        "MfGcqLKYE",
        "qk9DiUwN-",
        "_5hAACSkD",
        "gUbpQnI7S",
        "cLpRfUcf5",
      ].includes(valueObj.hardwareID)
    ) {
      componentsArr.push(
        <div
          key={`hardwareChips-${index}`}
          css={css`
            margin: 8px 8px 0 0;
          `}
        >
          <Chip
            avatar={
              <Avatar
                alt={valueObj.name}
                style={{ backgroundColor: "#D12228" }}
              >
                <SimpleIconNintendo3DS
                  name="Nintendo 3DS"
                  color="#FFFFFF"
                  size={16}
                />
              </Avatar>
            }
            label={valueObj.name}
            color="primary"
            variant="outlined"
          />
        </div>
      );

      // --------------------------------------------------
      //   - PlayStation 5 / PlayStation 5 Digital Edition / PlayStation 4 / PlayStation 4 Pro / PlayStation 3 / PlayStation VR / PS Vita / PlayStation Vita TV / PSP
      // --------------------------------------------------
    } else if (
      [
        "HpmHVmZl_",
        "byyV8Ltdc",
        "TdK3Oc-yV",
        "8dAGDVWLy",
        "YNZ6nb1Ki",
        "rWnfDngrY",
        "mOpBZsQBm",
        "mSNE9IGXN",
        "efIOgWs3N",
      ].includes(valueObj.hardwareID)
    ) {
      componentsArr.push(
        <div
          key={`hardwareChips-${index}`}
          css={css`
            margin: 8px 8px 0 0;
          `}
        >
          <Chip
            avatar={
              <Avatar
                alt={valueObj.name}
                style={{ backgroundColor: "#003791" }}
              >
                <SimpleIconPlayStation
                  title="PlayStation"
                  color="#FFFFFF"
                  size={20}
                />
              </Avatar>
            }
            label={valueObj.name}
            color="primary"
            variant="outlined"
          />
        </div>
      );

      // --------------------------------------------------
      //   - Xbox Series X / Xbox Series S / Xbox One / Xbox One S / Xbox One X / Xbox One S All Digital Edition / Xbox 360 / Xbox 360 エリート / Xbox 360 S / Xbox 360 E / Xbox
      // --------------------------------------------------
    } else if (
      [
        "I7RARV3BG",
        "Oavrp9S42",
        "uPqoiXA_8",
        "XA-5bmGgf",
        "s5tMWj5TX",
        "QNxk7c-ZO",
        "08Qp5KxPA",
        "lCMv0vbVE",
        "CH5XjDxmE",
        "iJoiTR3Lp",
        "78lc0hPjL",
      ].includes(valueObj.hardwareID)
    ) {
      componentsArr.push(
        <div
          key={`hardwareChips-${index}`}
          css={css`
            margin: 8px 8px 0 0;
          `}
        >
          <Chip
            avatar={
              <Avatar
                alt={valueObj.name}
                style={{ backgroundColor: "#107C10" }}
              >
                <SimpleIconXbox title="Xbox" color="#FFFFFF" size={18} />
              </Avatar>
            }
            label={valueObj.name}
            color="primary"
            variant="outlined"
          />
        </div>
      );

      // --------------------------------------------------
      //   - その他
      // --------------------------------------------------
    } else {
      componentsArr.push(
        <div
          key={`hardwareChips-${index}`}
          css={css`
            margin: 8px 8px 0 0;
          `}
        >
          <Chip
            avatar={
              <Avatar alt={valueObj.name}>
                <IconOther />
              </Avatar>
            }
            label={valueObj.name}
            color="primary"
            variant="outlined"
          />
        </div>
      );
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/hardware/v2/components/chip.js
  // `);

  // console.log(`
  //   ----- hardwaresArr -----\n
  //   ${util.inspect(hardwaresArr, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return componentsArr;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

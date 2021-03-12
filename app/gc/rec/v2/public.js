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
//   Components
// ---------------------------------------------

import PublicIDs from "app/gc/rec/v2/public-ids.js";
import PublicInformations from "app/gc/rec/v2/public-informations.js";
import PublicSetting from "app/gc/rec/v2/public-setting.js";

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
    type,
    idsArr = [],
    publicIDsArr = [],
    publicInformationsArr = [],
    publicSetting,
  } = props;

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];
  let count = 0;

  // ---------------------------------------------
  //   - ID
  // ---------------------------------------------

  if (idsArr.length !== 0 || publicIDsArr.length !== 0) {
    componentsArr.push(
      <div key="public-1">
        <PublicIDs idsArr={idsArr} publicIDsArr={publicIDsArr} />
      </div>
    );

    count += 1;
  }

  // ---------------------------------------------
  //   - 情報
  // ---------------------------------------------

  if (publicInformationsArr.length !== 0) {
    componentsArr.push(
      <div
        css={css`
          ${count === 1 && "margin: 24px 0 0 0;"}
        `}
        key="public-2"
      >
        <PublicInformations publicInformationsArr={publicInformationsArr} />
      </div>
    );
  }

  // --------------------------------------------------
  //   IDも情報も存在しない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (componentsArr.length === 0) {
    return null;
  }

  // ---------------------------------------------
  //   - 公開設定
  // ---------------------------------------------

  componentsArr.push(
    <div key="public-3">
      <PublicSetting type={type} publicSetting={publicSetting} />
    </div>
  );

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/public.js
  // `);

  // console.log(`
  //   ----- idsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(idsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- publicIDsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(publicIDsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        margin: 16px 0;
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

// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Node Packaddresss
// ---------------------------------------------

import React from "react";
import { useIntl } from "react-intl";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormHardwares from "app/common/hardware/v2/form.js";

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

  const { hardwaresArr, setHardwaresArr } = props;

  const limit = parseInt(
    process.env.NEXT_PUBLIC_CARD_PLAYER_HARDWARES_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Heading */}
      <h3
        css={css`
          margin: 0 0 6px 0;
        `}
      >
        昔、所有していたハードウェア
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        入力すると昔、所有していたハードウェアが表示されます。
      </p>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        ハードウェア名（またはSFC、N64などの略称）の一部を入力すると、入力フォームの下に一覧でハードウェアの正式名称が表示されます。一覧上でハードウェアをクリック（タップ）すると入力は完了です。この欄では複数のハードウェアを入力することが可能です。
      </p>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        ゲームのハードウェア名だけでなく、「Android」「iOS」「PC」などもハードウェアとして入力できます。
      </p>

      {/* フォーム */}
      <FormHardwares
        hardwaresArr={hardwaresArr}
        setHardwaresArr={setHardwaresArr}
        limit={limit}
      />
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

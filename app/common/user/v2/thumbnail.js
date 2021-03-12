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

import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

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

  const { imagesAndVideosThumbnailObj } = props;

  // --------------------------------------------------
  //   src & srcSet
  // --------------------------------------------------

  const src = lodashGet(
    imagesAndVideosThumbnailObj,
    ["arr", 0, "src"],
    "/img/common/thumbnail/none.svg"
  );
  const srcSet = lodashGet(
    imagesAndVideosThumbnailObj,
    ["arr", 0, "srcSet"],
    ""
  );

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <img
      css={css`
        border-radius: 6px;
        width: 44px;
      `}
      src={src}
      srcSet={srcSet}
    />
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

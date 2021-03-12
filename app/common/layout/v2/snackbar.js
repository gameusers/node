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

import React, { useState, useEffect, useContext } from "react";
import { useIntl } from "react-intl";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconCheckCircle from "@material-ui/icons/CheckCircle";
import IconError from "@material-ui/icons/Error";
import IconWarning from "@material-ui/icons/Warning";
import IconInfo from "@material-ui/icons/Info";
import IconClose from "@material-ui/icons/Close";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssIcon = css`
  && {
    font-size: 20px;
    opacity: 0.9;
    margin: 0 6px 0 0;
  }
`;

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

const Component = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { snackbarObj, handleSnackbarClose } = stateLayout;

  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  // key
  // const key = lodashGet(snackbarObj, ['key'], `snackbar-${new Date().getTime()}`);

  // 開閉を切り替える真偽値
  const open = lodashGet(snackbarObj, ["open"], false);

  // 色 [success / error / warning / info]
  const variant = lodashGet(snackbarObj, ["variant"], "");

  // メッセージID qnWsuPcrJ
  let messageID = lodashGet(snackbarObj, ["messageID"], "");

  // 表示位置 - 縦方向
  const vertical = lodashGet(snackbarObj, ["vertical"], "bottom");

  // 表示位置 - 横方向
  const horizontal = lodashGet(snackbarObj, ["horizontal"], "left");

  // 表示時間
  const autoHideDuration = lodashGet(snackbarObj, ["autoHideDuration"], 5000);

  // Error Object
  const errorObj = lodashGet(snackbarObj, ["errorObj"], {});

  // if (!messageID) {
  //   return;
  // }

  // --------------------------------------------------
  //   Message
  // --------------------------------------------------

  let errorMessage = "";
  let message = "";

  if (errorObj && Object.keys(errorObj).length !== 0) {
    if (errorObj instanceof CustomError) {
      errorMessage = lodashGet(errorObj, ["errorsArr", 0, "code"], "Error");
      messageID = lodashGet(errorObj, ["errorsArr", 0, "messageID"], "Error");
    } else {
      errorMessage = errorObj.message;
      messageID = "Error";
    }
  }

  if (messageID === "Error") {
    message = `Error Message: ${errorMessage}`;
  } else if (messageID) {
    message = intl.formatMessage({ id: messageID });
  }

  // console.log(chalk`
  //   messageID: {green ${messageID}}
  //   message: {green ${message}}
  // `);

  // --------------------------------------------------
  //   Color & Icon
  // --------------------------------------------------

  let backgroundColor = "";
  let icon = "";

  if (variant === "success") {
    backgroundColor = "#43a047";
    icon = <IconCheckCircle css={cssIcon} />;
  } else if (variant === "error") {
    backgroundColor = "#d32f2f";
    icon = <IconError css={cssIcon} />;
  } else if (variant === "warning") {
    backgroundColor = "#ffa000";
    icon = <IconWarning css={cssIcon} />;
  } else if (variant === "info") {
    backgroundColor = "#1976d2";
    icon = <IconInfo css={cssIcon} />;
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/snackbar.js
  // `);

  // console.log(chalk`
  //   login: {green ${login}}
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
    <Snackbar
      // key={key}
      anchorOrigin={{
        vertical,
        horizontal,
      }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleSnackbarClose}
    >
      <SnackbarContent
        css={css`
          color: white;
          background-color: ${backgroundColor};
        `}
        aria-describedby="client-snackbar"
        message={
          <span
            css={css`
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
            `}
            id="client-snackbar"
          >
            {icon}
            {message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <IconClose />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

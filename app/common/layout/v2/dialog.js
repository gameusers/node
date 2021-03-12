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

import React, { useState } from "react";
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

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// --------------------------------------------------
//   Components
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

  const { dialogObj, handleDialogClose } = stateLayout;

  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const open = lodashGet(dialogObj, ["open"], false);
  const title = lodashGet(dialogObj, ["title"], "");
  const description = lodashGet(dialogObj, ["description"], "");
  const handle = lodashGet(dialogObj, ["handle"], () => {});
  const argumentsObj = lodashGet(dialogObj, ["argumentsObj"], {});

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  const handleClick = async ({ handle, argumentsObj }) => {
    await handle(argumentsObj);

    handleDialogClose();
  };

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/dialog.js
  // `);

  // console.log(chalk`
  //   open: {green ${open}}
  // `);

  // console.log(`
  //   ----- argumentsObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(argumentsObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Dialog
      open={open}
      onClose={() => handleDialogClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <div
          css={css`
            margin: 0 auto 0 0;
          `}
        >
          <Button
            onClick={() =>
              handleClick({
                handle,
                argumentsObj,
              })
            }
            color="primary"
            autoFocus
          >
            はい
          </Button>
        </div>

        <Button onClick={() => handleDialogClose()} color="primary">
          いいえ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

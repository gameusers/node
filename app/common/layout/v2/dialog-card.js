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

import React from "react";
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

import { makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import CardPlayer from "app/common/card/v2/card-player.js";

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  paperWidthMd: {
    ["@media (max-width:480px)"]: {
      maxWidth: "100%",
      margin: 0,
    },
  },
});

// --------------------------------------------------
//   Components
// --------------------------------------------------

const Component = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const classes = useStyles();

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { dialogCardObj, dialogCardOpen, handleDialogCardClose } = stateLayout;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/dialog-card.js
  // `);

  // console.log(chalk`
  //   open: {green ${open}}
  // `);

  // console.log(`
  //   ----- dialogCardObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(dialogCardObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Dialog
      classes={{
        paperWidthMd: classes.paperWidthMd,
      }}
      open={dialogCardOpen}
      maxWidth="md"
      onClose={() => handleDialogCardClose()}
      scroll="paper"
    >
      <DialogContent
        css={css`
          && {
            margin: 0;
            padding: 0 !important;
          }
        `}
      >
        <CardPlayer
          obj={dialogCardObj}
          showFollowButton={true}
          showEditButton={false}
          defaultExpanded={true}
        />
      </DialogContent>
    </Dialog>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

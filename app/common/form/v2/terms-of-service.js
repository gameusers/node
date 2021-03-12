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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationTermsOfService } from "app/@validations/terms-of-service.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import DialogTermsOfService from "app/common/layout/v2/dialog-terms-of-service.js";

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    agreeTermsOfService,
    setAgreeTermsOfService,
    checkAgreedVersion = true,
  } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();

  const { termsOfServiceAgreedVersion } = stateUser;
  const { setDialogTermsOfServiceOpen } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  // const intl = useIntl();

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(chalk`
  // agreeTermsOfService: {green ${agreeTermsOfService} typeof ${typeof agreeTermsOfService}}
  // checkAgreedVersion: {green ${checkAgreedVersion} typeof ${typeof checkAgreedVersion}}
  // termsOfServiceAgreedVersion: {green ${termsOfServiceAgreedVersion} typeof ${typeof termsOfServiceAgreedVersion}}
  // validationTermsOfService: {green ${validationTermsOfService({ agree: agreeTermsOfService, agreedVersion: termsOfServiceAgreedVersion }).error}}
  // `);

  // --------------------------------------------------
  //   Check Confirmed Version
  // --------------------------------------------------

  if (checkAgreedVersion && termsOfServiceAgreedVersion) {
    if (
      validationTermsOfService({
        agree: agreeTermsOfService,
        agreedVersion: termsOfServiceAgreedVersion,
      }).error === false
    ) {
      return null;
    }
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Checkbox */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
        `}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={agreeTermsOfService}
              onChange={() => setAgreeTermsOfService(!agreeTermsOfService)}
            />
          }
          label="利用規約に同意します"
        />

        <Button
          color="primary"
          onClick={() => setDialogTermsOfServiceOpen(true)}
        >
          利用規約を表示
        </Button>
      </div>

      {/* 利用規約 */}
      <DialogTermsOfService />
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

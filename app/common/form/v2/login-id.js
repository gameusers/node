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

import TextField from "@material-ui/core/TextField";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import InputAdornment from "@material-ui/core/InputAdornment";
import IconPerson from "@material-ui/icons/Person";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationUsersLoginID } from "app/@database/users/validations/login-id.js";

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { loginID, setLoginID } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationUsersLoginIDObj = validationUsersLoginID({ value: loginID });

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <TextField
      css={css`
        && {
          width: 100%;
          max-width: 500px;
        }
      `}
      label="ログインID"
      value={validationUsersLoginIDObj.value}
      onChange={(eventObj) => setLoginID(eventObj.target.value)}
      error={validationUsersLoginIDObj.error}
      helperText={intl.formatMessage(
        { id: validationUsersLoginIDObj.messageID },
        { numberOfCharacters: validationUsersLoginIDObj.numberOfCharacters }
      )}
      margin="normal"
      inputProps={{
        maxLength: 32,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconPerson />
          </InputAdornment>
        ),
      }}
    />
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

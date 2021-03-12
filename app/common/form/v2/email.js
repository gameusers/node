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
import IconMailOutline from "@material-ui/icons/MailOutline";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationUsersEmail } from "app/@database/users/validations/email.js";

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { email, setEmail } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationUsersEmailObj = validationUsersEmail({ value: email });

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
      label="メールアドレス"
      value={validationUsersEmailObj.value}
      onChange={(eventObj) => setEmail(eventObj.target.value)}
      error={validationUsersEmailObj.error}
      helperText={intl.formatMessage(
        { id: validationUsersEmailObj.messageID },
        { numberOfCharacters: validationUsersEmailObj.numberOfCharacters }
      )}
      margin="normal"
      inputProps={{
        maxLength: 100,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconMailOutline />
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

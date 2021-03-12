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
import IconButton from "@material-ui/core/IconButton";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import InputAdornment from "@material-ui/core/InputAdornment";
import IconLock from "@material-ui/icons/Lock";
import IconLockTwoToneOutlined from "@material-ui/icons/LockTwoTone";
import IconVisibility from "@material-ui/icons/Visibility";
import IconVisibilityOff from "@material-ui/icons/VisibilityOff";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import {
  validationUsersLoginPassword,
  validationUsersLoginPasswordConfirmation,
} from "app/@database/users/validations/login-password.js";

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    loginPassword,
    setLoginPassword,
    loginPasswordConfirmation,
    setLoginPasswordConfirmation,
    loginID,
    strength = false,
    confirmation = false,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  const [loginPasswordShow, setLoginPasswordShow] = useState(false);
  const [
    loginPasswordConfirmationShow,
    setLoginPasswordConfirmationShow,
  ] = useState(false);

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationUsersLoginPasswordObj = validationUsersLoginPassword({
    value: loginPassword,
    loginID,
  });
  const validationUsersLoginPasswordConfirmationObj = validationUsersLoginPasswordConfirmation(
    { value: loginPasswordConfirmation, loginPassword }
  );

  // --------------------------------------------------
  //   パスワードの強度
  // --------------------------------------------------

  const passwordColorArr = ["red", "red", "#FF5F17", "green", "green"];
  const passwordStrengthArr = [
    "とても危険",
    "危険",
    "普通",
    "安全",
    "とても安全",
  ];

  let passwordColor =
    passwordColorArr[validationUsersLoginPasswordObj.strengthScore];
  let passwordStrength =
    passwordStrengthArr[validationUsersLoginPasswordObj.strengthScore];

  if (loginPassword === "") {
    passwordColor = "#848484";
    passwordStrength = " -";
  }

  let componentStrength = "パスワード";

  if (strength) {
    componentStrength = (
      <div>
        パスワード
        <span
          css={css`
            color: ${passwordColor};
            margin-left: 12px;
          `}
        >
          [強度: {passwordStrength}]
        </span>
      </div>
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* パスワード */}
      <TextField
        css={css`
          && {
            width: 100%;
            max-width: 500px;
          }
        `}
        label={componentStrength}
        type={loginPasswordShow ? "text" : "password"}
        value={validationUsersLoginPasswordObj.value}
        onChange={(eventObj) => setLoginPassword(eventObj.target.value)}
        error={validationUsersLoginPasswordObj.error}
        helperText={intl.formatMessage(
          { id: validationUsersLoginPasswordObj.messageID },
          {
            numberOfCharacters:
              validationUsersLoginPasswordObj.numberOfCharacters,
          }
        )}
        margin="normal"
        inputProps={{
          maxLength: 32,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconLock />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => setLoginPasswordShow(!loginPasswordShow)}
                onMouseDown={(eventObj) => {
                  eventObj.preventDefault();
                }}
              >
                {loginPasswordShow ? <IconVisibility /> : <IconVisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* パスワード確認 */}
      {confirmation && (
        <TextField
          css={css`
            && {
              width: 100%;
              max-width: 500px;
            }
          `}
          label="パスワード確認"
          type={loginPasswordConfirmationShow ? "text" : "password"}
          value={validationUsersLoginPasswordConfirmationObj.value}
          onChange={(eventObj) =>
            setLoginPasswordConfirmation(eventObj.target.value)
          }
          error={validationUsersLoginPasswordConfirmationObj.error}
          helperText={intl.formatMessage(
            { id: validationUsersLoginPasswordConfirmationObj.messageID },
            {
              numberOfCharacters:
                validationUsersLoginPasswordConfirmationObj.numberOfCharacters,
            }
          )}
          margin="normal"
          inputProps={{
            maxLength: 32,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconLockTwoToneOutlined />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={() =>
                    setLoginPasswordConfirmationShow(
                      !loginPasswordConfirmationShow
                    )
                  }
                  onMouseDown={(eventObj) => {
                    eventObj.preventDefault();
                  }}
                >
                  {loginPasswordConfirmationShow ? (
                    <IconVisibility />
                  ) : (
                    <IconVisibilityOff />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationHandleName } from "app/@validations/name.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * ハンドルネーム
 */
const Name = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { name, setName } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validation
  // --------------------------------------------------

  const validationHandleNameObj = validationHandleName({ value: name });

  const {
    value,
    error,
    messageID,
    numberOfCharacters,
  } = validationHandleNameObj;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----- validationHandleNameObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(validationHandleNameObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log('AAA');

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
      label="ハンドルネーム"
      value={value}
      onChange={(eventObj) => setName(eventObj.target.value)}
      error={error}
      helperText={intl.formatMessage({ id: messageID }, { numberOfCharacters })}
      margin="normal"
      inputProps={{
        maxLength: 50,
      }}
    />
  );
};

/**
 * 匿名
 */
const Anonymity = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { anonymity, setAnonymity } = props;

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        margin: 0 0 4px 0;
      `}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={anonymity}
            onChange={(eventObj) => setAnonymity(eventObj.target.checked)}
          />
        }
        label="ハンドルネームを匿名にする"
      />
    </div>
  );
};

/**
 * Export Component
 * ログインしていて enableAnonymity が true の場合は、ハンドルネームを匿名にすることができる
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { name, setName, anonymity, setAnonymity, enableAnonymity } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();

  const { login } = stateUser;

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {!login && <Name name={name} setName={setName} />}

      {/* Anonymity */}
      {login && enableAnonymity && (
        <Anonymity anonymity={anonymity} setAnonymity={setAnonymity} />
      )}
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

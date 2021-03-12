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

import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import {
  validationCardPlayersSex,
  validationCardPlayersSexAlternativeText,
} from "app/@database/card-players/validations/sex.js";

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

  const {
    sex,
    setSex,

    sexAlternativeText,
    setSexAlternativeText,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationObj = validationCardPlayersSex({ value: sex });
  const validationAlternativeTextObj = validationCardPlayersSexAlternativeText({
    value: sexAlternativeText,
  });

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
        性別
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        性別を選択してください。選択すると性別が表示されます。選択肢以外の値を入力したい場合は、その他のフォームに入力してください。
      </p>

      {/* 性別 */}
      <div
        css={css`
          margin: 12px 0 0 0;
        `}
      >
        <FormControl>
          <Select
            value={validationObj.value}
            onChange={(eventObj) => setSex(eventObj.target.value)}
            inputProps={{
              name: "sex",
              id: "sex",
            }}
          >
            <MenuItem value="">&nbsp;</MenuItem>
            <MenuItem value={"male"}>男性</MenuItem>
            <MenuItem value={"female"}>女性</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* 性別（固定値） */}
      <TextField
        css={css`
          && {
            width: 400px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id="sexAlternativeText"
        label="性別（その他）"
        value={validationAlternativeTextObj.value}
        onChange={(eventObj) => setSexAlternativeText(eventObj.target.value)}
        error={validationAlternativeTextObj.error}
        helperText={intl.formatMessage(
          { id: validationAlternativeTextObj.messageID },
          {
            numberOfCharacters: validationAlternativeTextObj.numberOfCharacters,
          }
        )}
        margin="normal"
        inputProps={{
          maxLength: 20,
        }}
      />
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

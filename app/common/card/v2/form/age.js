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
import moment from "moment";

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
//   Validations
// ---------------------------------------------

import {
  validationCardPlayersAge,
  validationCardPlayersAgeAlternativeText,
} from "app/@database/card-players/validations/age.js";

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
    age,
    setAge,

    ageAlternativeText,
    setAgeAlternativeText,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationObj = validationCardPlayersAge({ value: age });
  const validationAlternativeTextObj = validationCardPlayersAgeAlternativeText({
    value: ageAlternativeText,
  });

  // --------------------------------------------------
  //   ???????????????????????????
  // --------------------------------------------------

  let formattedDate = "";

  if (age) {
    formattedDate = moment(age).format("YYYY-MM-DD");
  }

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
        ??????
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      </p>

      {/* ????????? */}
      <TextField
        css={css`
          && {
            width: 400px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id="age"
        label="?????????"
        type="date"
        value={formattedDate}
        onChange={(eventObj) => setAge(eventObj.target.value)}
        error={validationObj.error}
        helperText={intl.formatMessage(
          { id: validationObj.messageID },
          { numberOfCharacters: validationObj.numberOfCharacters }
        )}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* ????????????????????? */}
      <TextField
        css={css`
          && {
            width: 400px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id="ageAlternativeText"
        label="?????????????????????"
        value={validationAlternativeTextObj.value}
        onChange={(eventObj) => setAgeAlternativeText(eventObj.target.value)}
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

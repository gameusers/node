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
  validationCardPlayersGamingExperience,
  validationCardPlayersGamingExperienceAlternativeText,
} from "app/@database/card-players/validations/gaming-experience.js";

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
    gamingExperience,
    setGamingExperience,

    gamingExperienceAlternativeText,
    setGamingExperienceAlternativeText,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationObj = validationCardPlayersGamingExperience({
    value: gamingExperience,
  });
  const validationAlternativeTextObj = validationCardPlayersGamingExperienceAlternativeText(
    { value: gamingExperienceAlternativeText }
  );

  // --------------------------------------------------
  //   日付のフォーマット
  // --------------------------------------------------

  let formattedDate = "";

  if (gamingExperience) {
    formattedDate = moment(gamingExperience).format("YYYY-MM-DD");
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
        ゲーム歴
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        入力するとゲーム歴が表示されます。ゲームを始めた日か、ゲーム歴（固定値）のどちらかを入力してください。
      </p>

      {/* ゲームを始めた日 */}
      <TextField
        css={css`
          && {
            width: 400px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id="gamingExperience"
        label="ゲームを始めた日"
        type="date"
        value={formattedDate}
        onChange={(eventObj) => setGamingExperience(eventObj.target.value)}
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

      {/* ゲーム歴（固定値） */}
      <TextField
        css={css`
          && {
            width: 400px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id="gamingExperienceAlternativeText"
        label="ゲーム歴（固定値）"
        value={validationAlternativeTextObj.value}
        onChange={(eventObj) =>
          setGamingExperienceAlternativeText(eventObj.target.value)
        }
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

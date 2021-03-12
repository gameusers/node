// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Node Packaddresss
// ---------------------------------------------

import React from "react";
import { useIntl } from "react-intl";
import TextareaAutosize from "react-autosize-textarea";

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

import { validationCardPlayersTabletModel } from "app/@database/card-players/validations/tablet.js";

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
    tabletModel,
    setTabletModel,
    tabletComment,
    setTabletComment,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationModelObj = validationCardPlayersTabletModel({
    value: tabletModel,
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
        タブレット
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        入力するとタブレットについての情報が表示されます。現在、利用しているタブレットの情報を入力してください。
      </p>

      {/* モデル・機種名 */}
      <TextField
        css={css`
          && {
            width: 400px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id="tabletModel"
        label="モデル・機種名"
        value={validationModelObj.value}
        onChange={(eventObj) => setTabletModel(eventObj.target.value)}
        error={validationModelObj.error}
        helperText={intl.formatMessage(
          { id: validationModelObj.messageID },
          { numberOfCharacters: validationModelObj.numberOfCharacters }
        )}
        margin="normal"
        inputProps={{
          maxLength: 50,
        }}
      />

      {/* コメント */}
      <TextareaAutosize
        css={css`
          && {
            width: 100%;
            border-radius: 4px;
            box-sizing: border-box;
            line-height: 1.8;
            margin: 12px 0 0 0;
            padding: 8px 12px;

            &:focus {
              outline: 1px #a9f5f2 solid;
            }

            resize: none;
          }
        `}
        rows={5}
        placeholder="タブレットについてのコメントを入力してください。"
        value={tabletComment}
        maxLength={3000}
        onChange={(eventObj) => setTabletComment(eventObj.target.value)}
      />
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationHandleName } from "app/@validations/name.js";
import { validationCardPlayersStatus } from "app/@database/card-players/validations/status.js";

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

  const { name, setName, status, setStatus } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationHandleNameObj = validationHandleName({ value: name });
  const validationCardPlayersStatusObj = validationCardPlayersStatus({
    value: status,
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
        ハンドルネーム＆ステータス
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        ハンドルネームは Game Users
        内で利用する名前です。ステータスはハンドルネームの横に表示される肩書きのようなものです。例えばあなたの今の状態やゲーム内の職業など、なんでも好きな情報を入力してください。例）暇、戦士、魔法使い。
        <span
          css={css`
            color: red;
          `}
        >
          ※ 空欄不可
        </span>
      </p>

      {/* ハンドルネーム */}
      <TextField
        css={css`
          && {
            width: 100%;
            max-width: 500px;
          }
        `}
        label="ハンドルネーム"
        value={validationHandleNameObj.value}
        onChange={(eventObj) => setName(eventObj.target.value)}
        error={validationHandleNameObj.error}
        helperText={intl.formatMessage(
          { id: validationHandleNameObj.messageID },
          { numberOfCharacters: validationHandleNameObj.numberOfCharacters }
        )}
        margin="normal"
        inputProps={{
          maxLength: 50,
        }}
      />

      {/* ステータス */}
      <TextField
        css={css`
          && {
            width: 100%;
            max-width: 500px;
          }
        `}
        label="ステータス"
        value={validationCardPlayersStatusObj.value}
        onChange={(eventObj) => setStatus(eventObj.target.value)}
        error={validationCardPlayersStatusObj.error}
        helperText={intl.formatMessage(
          { id: validationCardPlayersStatusObj.messageID },
          {
            numberOfCharacters:
              validationCardPlayersStatusObj.numberOfCharacters,
          }
        )}
        margin="normal"
        inputProps={{
          maxLength: 50,
        }}
      />
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

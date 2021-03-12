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

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashCloneDeep from "lodash/cloneDeep";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconAddCircle from "@material-ui/icons/AddCircle";
import IconRemoveCircle from "@material-ui/icons/RemoveCircle";

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

  const { hobbiesArr = [], setHobbiesArr } = props;

  const limit = parseInt(process.env.NEXT_PUBLIC_CARD_PLAYER_HOBBY_LIMIT, 10);

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * <TextField /> に入力する
   */
  const handleOnChange = ({ index, value }) => {
    const clonedArr = lodashCloneDeep(hobbiesArr);
    clonedArr[index] = value;
    setHobbiesArr(clonedArr);
  };

  /**
   * フォームを増やす
   */
  const handleAdd = () => {
    if (hobbiesArr.length < limit) {
      const clonedArr = lodashCloneDeep(hobbiesArr);
      clonedArr.push("");
      setHobbiesArr(clonedArr);
    }
  };

  /**
   * フォームを減らす
   */
  const handleRemove = ({ index }) => {
    const clonedArr = lodashCloneDeep(hobbiesArr);
    clonedArr.splice(index, 1);
    setHobbiesArr(clonedArr);
  };

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, value] of hobbiesArr.entries()) {
    componentsArr.push(
      <TextField
        css={css`
          && {
            width: 48%;
            margin-right: 12px;

            @media screen and (max-width: 480px) {
              width: 100%;
              margin-right: 0;
            }
          }
        `}
        key={index}
        id={`hobby-${index}`}
        value={value}
        onChange={(eventObj) =>
          handleOnChange({ index, value: eventObj.target.value })
        }
        margin="dense"
        variant="outlined"
        inputProps={{
          maxLength: 20,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleRemove({ index })}>
                <IconRemoveCircle />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
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
        趣味
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        入力すると趣味が表示されます。
      </p>

      {/* 趣味 */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          align-items: center;
        `}
      >
        {/* フォーム */}
        {componentsArr}

        {/* フォーム追加ボタン */}
        <IconButton onClick={handleAdd}>
          <IconAddCircle />
        </IconButton>
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

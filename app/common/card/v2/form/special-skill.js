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

  const { specialSkillsArr = [], setSpecialSkillsArr } = props;

  const limit = parseInt(
    process.env.NEXT_PUBLIC_CARD_PLAYER_SPECIAL_SKILL_LIMIT,
    10
  );

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
    const clonedArr = lodashCloneDeep(specialSkillsArr);
    clonedArr[index] = value;
    setSpecialSkillsArr(clonedArr);
  };

  /**
   * フォームを増やす
   */
  const handleAdd = () => {
    if (specialSkillsArr.length < limit) {
      const clonedArr = lodashCloneDeep(specialSkillsArr);
      clonedArr.push("");
      setSpecialSkillsArr(clonedArr);
    }
  };

  /**
   * フォームを減らす
   */
  const handleRemove = ({ index }) => {
    const clonedArr = lodashCloneDeep(specialSkillsArr);
    clonedArr.splice(index, 1);
    setSpecialSkillsArr(clonedArr);
  };

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, value] of specialSkillsArr.entries()) {
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
        id={`special-skill-${index}`}
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
        特技
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        入力すると特技が表示されます。
      </p>

      {/* 特技 */}
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

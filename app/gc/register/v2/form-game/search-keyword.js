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

  const { arr = [], setArr } = props;

  const limit = parseInt(
    process.env.NEXT_PUBLIC_GAMES_SEARCH_KEYWORD_LIMIT,
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
   * TextFieldに入力する
   */
  const handleOnChange = ({ index, value }) => {
    const clonedArr = lodashCloneDeep(arr);
    clonedArr[index] = value;
    setArr(clonedArr);
  };

  /**
   * TextFieldを増やす
   */
  const handleAdd = () => {
    if (arr.length < limit) {
      const clonedArr = lodashCloneDeep(arr);
      clonedArr.push("");
      setArr(clonedArr);
    }
  };

  /**
   * TextFieldを減らす
   */
  const handleRemove = ({ index }) => {
    const clonedArr = lodashCloneDeep(arr);
    clonedArr.splice(index, 1);
    setArr(clonedArr);
  };

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, value] of arr.entries()) {
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
        id={`search-keywords-${index}`}
        value={value}
        onChange={(eventObj) =>
          handleOnChange({ index, value: eventObj.target.value })
        }
        margin="dense"
        variant="outlined"
        inputProps={{
          maxLength: 50,
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
          font-weight: bold;
          margin: 0 0 2px 0;
        `}
      >
        検索キーワード
      </h3>

      <p
        css={css`
          margin: 0 0 14px 0;
        `}
      >
        検索キーワードを入力してください。ゲームを検索するときに引っかかりやすくなるようなキーワードを入力します。ゲーム名のひらがな表記、カタカナ表記、英語表記、よく使われている略称などです。最大20個。
      </p>

      <p
        css={css`
          margin: 0 0 14px 0;
        `}
      >
        例）すーぱーまりおぶらざーず、スーパーマリオブラザーズ、Super Mario
        Brothers、スーマリ
      </p>

      {/* フォーム */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          align-items: center;
        `}
      >
        {/* テキストフィールド */}
        {componentsArr}

        {/* テキストフィールド追加ボタン */}
        {arr.length < limit && (
          <IconButton onClick={handleAdd}>
            <IconAddCircle />
          </IconButton>
        )}
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

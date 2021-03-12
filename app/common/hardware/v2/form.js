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
import { useSnackbar } from "notistack";
import keycode from "keycode";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";
import lodashCloneDeep from "lodash/cloneDeep";
import lodashMerge from "lodash/merge";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationKeyword } from "app/@validations/keyword.js";

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

  const { hardwaresArr, setHardwaresArr, limit } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [keyword, setKeyword] = useState("");
  const [onFocus, setOnFocus] = useState(false);
  const [suggestionsArr, setSuggestionsArr] = useState([]);
  const [suggestionSelectedIndex, setSuggestionSelectedIndex] = useState(9999);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * ハードウェアを追加する
   * @param {string} hardwareID - DB hardwares hardwareID
   * @param {string} name - ハードウェア名
   */
  const handleAdd = ({ hardwareID, name }) => {
    // --------------------------------------------------
    //   Clone
    // --------------------------------------------------

    let clonedArr = lodashCloneDeep(hardwaresArr);

    // ---------------------------------------------
    //   配列内に存在しているかチェック
    // ---------------------------------------------

    const index = clonedArr.findIndex((valueObj) => {
      return valueObj.hardwareID === hardwareID;
    });

    // ---------------------------------------------
    //   登録できるハードウェアの上限を超えている場合はエラー
    // ---------------------------------------------

    if (clonedArr.length + 1 > limit) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "warning",
            messageID: "Owq_rMCaL",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   存在していない場合は配列に追加して更新
    // ---------------------------------------------

    if (index === -1) {
      clonedArr.push({
        hardwareID,
        name,
      });

      setHardwaresArr(clonedArr);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/hardware/v2/components/form.js - handleAdd
    // `);

    // console.log(`
    //   ----- hardwaresArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(hardwaresArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   hardwareID: {green ${hardwareID}}
    //   name: {green ${name}}
    //   limit: {green ${limit}}
    //   hardwaresArr.length: {green ${hardwaresArr.length}}
    // `);
  };

  /**
   * ハードウェアを削除する
   * @param {string} hardwareID - DB hardwares hardwareID
   */
  const handleRemove = ({ hardwareID }) => {
    // --------------------------------------------------
    //   Clone
    // --------------------------------------------------

    let clonedArr = lodashCloneDeep(hardwaresArr);

    // ---------------------------------------------
    //   削除する index を取得する
    // ---------------------------------------------

    const index = clonedArr.findIndex((valueObj) => {
      return valueObj.hardwareID === hardwareID;
    });

    // ---------------------------------------------
    //   配列から index を指定して削除
    // ---------------------------------------------

    clonedArr.splice(index, 1);

    // --------------------------------------------------
    //   更新
    // --------------------------------------------------

    setHardwaresArr(clonedArr);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/hardware/v2/components/form.js - handleRemove
    // `);

    // console.log(`
    //   ----- hardwaresArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(hardwaresArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  };

  /**
   * 所有ハードウェアのサジェストのキーボード操作
   * ↓ ↑ で現在の選択状態を変更する
   * Enter で現在選択されているハードウェアを登録する
   * @param {Object} eventObj - イベント
   */
  const handleOnKeyDown = ({ eventObj }) => {
    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/hardware/v2/components/form.js - handleOnKeyDown
    // `);

    // console.log(chalk`
    //   suggestionSelectedIndex: {green ${suggestionSelectedIndex}}
    // `);

    // console.log(`
    //   ----- suggestionsArr -----\n
    //   ${util.inspect(suggestionsArr, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Key [Down]
    // ---------------------------------------------

    if (keycode(eventObj) === "down") {
      if (suggestionSelectedIndex === 9999) {
        setSuggestionSelectedIndex(0);
      } else if (suggestionSelectedIndex < suggestionsArr.length - 1) {
        setSuggestionSelectedIndex(suggestionSelectedIndex + 1);
      }

      // ---------------------------------------------
      //   Key [Up]
      // ---------------------------------------------
    } else if (keycode(eventObj) === "up") {
      if (suggestionSelectedIndex !== 9999 && suggestionSelectedIndex > 0) {
        setSuggestionSelectedIndex(suggestionSelectedIndex - 1);
      }

      // ---------------------------------------------
      //   Key [Enter]
      // ---------------------------------------------
    } else if (
      keycode(eventObj) === "enter" &&
      suggestionSelectedIndex !== 9999
    ) {
      // ---------------------------------------------
      //   フォームの送信処理停止
      // ---------------------------------------------

      eventObj.preventDefault();

      // ---------------------------------------------
      //   追加
      // ---------------------------------------------

      handleAdd({
        hardwareID: suggestionsArr[suggestionSelectedIndex].hardwareID,
        name: suggestionsArr[suggestionSelectedIndex].name,
      });
    }
  };

  /**
   * ハードウェアの TextField を変更する
   * 文字が入力されるたびに Fetch でサジェストデータを取得しにいく
   * @param {string} value - 値
   */
  const handleKeyword = async ({ value }) => {
    try {
      // ---------------------------------------------
      //   TextField が空の場合、処理停止
      // ---------------------------------------------

      if (!value) {
        setKeyword("");
        return;
      }

      // ---------------------------------------------
      //   キーワード更新
      // ---------------------------------------------

      setKeyword(value);

      // ---------------------------------------------
      //   1文字以内の場合、処理停止
      // ---------------------------------------------

      if (value.length <= 1) {
        setSuggestionsArr([]);
        setSuggestionSelectedIndex(9999);
        return;
      }

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        keyword: value,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/hardwares/read-suggestion`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/hardware/v2/components/form.js - handleKeyword
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   サジェスト更新
      // ---------------------------------------------

      setSuggestionsArr(resultObj.data);
      setSuggestionSelectedIndex(9999);
    } catch (errorObj) {}
  };

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationKeywordObj = validationKeyword({ value: keyword });

  // --------------------------------------------------
  //   Component - Hardware
  // --------------------------------------------------

  let componentHardwares = "";
  let componentHardwaresArr = [];

  if (hardwaresArr.length > 0) {
    for (const [index, valueObj] of hardwaresArr.entries()) {
      componentHardwaresArr.push(
        <Chip
          css={css`
            && {
              margin: 0 6px 6px 0;
            }
          `}
          key={index}
          label={valueObj.name}
          color="primary"
          onDelete={() =>
            handleRemove({
              hardwareID: valueObj.hardwareID,
            })
          }
          variant="outlined"
        />
      );
    }

    if (componentHardwaresArr.length > 0) {
      componentHardwares = (
        <div
          css={css`
            display: flex;
            flex-flow: row wrap;
            margin: 24px 0 0 0;
          `}
        >
          {componentHardwaresArr}
        </div>
      );
    }
  }

  // --------------------------------------------------
  //   Component - Suggestion
  // --------------------------------------------------

  let componentSuggestionMenuItemsArr = [];

  if (onFocus && keyword && suggestionsArr.length > 0) {
    // --------------------------------------------------
    //   Loop
    // --------------------------------------------------

    for (const [index, valueObj] of suggestionsArr.entries()) {
      // --------------------------------------------------
      //   すでに選択されているハードウェアを太字で表示するためのindex
      // --------------------------------------------------

      const index2 = hardwaresArr.findIndex((value2Obj) => {
        return value2Obj.hardwareID === valueObj.hardwareID;
      });

      // --------------------------------------------------
      //   array.push
      // --------------------------------------------------

      componentSuggestionMenuItemsArr.push(
        <MenuItem
          key={index}
          component="div"
          selected={index === suggestionSelectedIndex}
          onMouseDown={() =>
            handleAdd({
              hardwareID: valueObj.hardwareID,
              name: valueObj.name,
            })
          }
          style={{
            fontWeight: index2 !== -1 ? "bold" : "normal",
          }}
        >
          {valueObj.name}
        </MenuItem>
      );
    }
  }

  let componentSuggestion = "";

  if (componentSuggestionMenuItemsArr.length > 0) {
    componentSuggestion = (
      <Paper square>
        <MenuList>{componentSuggestionMenuItemsArr}</MenuList>
      </Paper>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/hardware/v2/components/form.js
  // `);

  // console.log(`
  //   ----- hardwaresArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(hardwaresArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   value: {green ${value}}
  //   alternativeText: {green ${alternativeText}}
  //   search: {green ${search}}
  //   age: {green ${age}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Hardwares */}
      {componentHardwares}

      {/* Keyword */}
      <div onFocus={() => setOnFocus(true)} onBlur={() => setOnFocus(false)}>
        {/* TextField */}
        <TextField
          css={css`
            && {
              width: 100%;
              max-width: 300px;

              @media screen and (max-width: 480px) {
                width: 100%;
              }
            }
          `}
          label="ハードウェア名"
          value={validationKeywordObj.value}
          onChange={(eventObj) =>
            handleKeyword({ value: eventObj.target.value })
          }
          onKeyDown={(eventObj) =>
            handleOnKeyDown({
              eventObj,
              limit,
            })
          }
          error={validationKeywordObj.error}
          helperText={intl.formatMessage(
            { id: validationKeywordObj.messageID },
            { numberOfCharacters: validationKeywordObj.numberOfCharacters }
          )}
          margin="normal"
          autoComplete="off"
          inputProps={{
            maxLength: 100,
          }}
        />

        {/* Suggestion */}
        {componentSuggestion}
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import keycode from "keycode";

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
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconGrade from "@material-ui/icons/Grade";
import IconClose from "@material-ui/icons/Close";

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
 * Chip
 */
const Chip = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    _id,
    gameCommunities_id,
    name,
    imagesAndVideosThumbnailObj = {},
    gamesArr,
    setGamesArr,
  } = props;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * ゲームを削除する
   * @param {string} _id - ID
   */
  const handleRemove = ({ _id }) => {
    // ---------------------------------------------
    //   配列内に存在しているかチェック
    // ---------------------------------------------

    const index = gamesArr.findIndex((valueObj) => {
      return valueObj._id === _id;
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/game/v2/components/form.js - handleRemove
    // `);

    // console.log(chalk`
    //   _id: {green ${_id} / ${typeof _id} }
    //   index: {green ${index} / ${typeof index} }
    // `);

    // console.log(`
    //   ----- gamesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(gamesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   配列内に存在している場合は削除する
    // ---------------------------------------------

    if (_id && index !== -1) {
      gamesArr.splice(index, 1);
      setGamesArr(lodashCloneDeep(gamesArr));
    }
  };

  // --------------------------------------------------
  //   必要な情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (!_id || !gameCommunities_id || !name) {
    return null;
  }

  // --------------------------------------------------
  //   Component - Avatar
  // --------------------------------------------------

  let componentAvatar = "";

  const thumbnailSrc = lodashGet(
    imagesAndVideosThumbnailObj,
    ["arr", 0, "src"],
    "/img/common/thumbnail/none.svg"
  );
  const thumbnailSrcSet = lodashGet(
    imagesAndVideosThumbnailObj,
    ["arr", 0, "srcSet"],
    ""
  );

  if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
    componentAvatar = (
      <Avatar
        css={css`
          && {
            width: 32px;
            height: 32px;
            background-color: white;
          }
        `}
        alt={name}
        src={thumbnailSrc}
        srcSet={thumbnailSrcSet}
      />
    );
  } else {
    componentAvatar = (
      <Avatar
        css={css`
          && {
            width: 32px;
            height: 32px;
            background-color: #3f51b5;
          }
        `}
      >
        <IconGrade />
      </Avatar>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/game/v2/components/form.js - Chip
  // `);

  // console.log(chalk`
  //   _id: {green ${_id}}
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   name: {green ${name}}
  // `);

  // console.log(`
  //   ----- imagesAndVideosThumbnailObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosThumbnailObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        color: #3f51b5;
        border: 1px solid #3f51b5;
        border-radius: 18px;
        margin: 8px 8px 0 0;
      `}
    >
      {/* アバター */}
      <div>{componentAvatar}</div>

      {/* 名前 */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          font-size: 14px;
          line-height: 1.4;
          padding: 4px 6px 4px 6px;
        `}
      >
        <span
          css={css`
            font-weight: bold;
          `}
        >
          {name}
        </span>
      </div>

      {/* アイコン */}
      <div
        css={css`
          margin-left: auto;
        `}
      >
        <IconButton
          css={css`
            && {
              width: 22px;
              height: 22px;

              margin: 0 6px 2px 0;
              padding: 0;
              background-color: #3f51b5;
            }
          `}
          onClick={() => handleRemove({ _id })}
        >
          <IconClose
            css={css`
              && {
                width: 20px;
                height: 20px;
                color: white;
              }
            `}
          />
        </IconButton>
      </div>
    </div>
  );
};

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { gamesArr, setGamesArr, gamesLimit } = props;

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
   * ゲームを追加する
   * @param {Object} obj - 追加するゲームのデータ
   * @param {number} gamesLimit - 追加できるゲームの最大数
   */
  const handleAdd = ({ obj }) => {
    // --------------------------------------------------
    //   _id
    // --------------------------------------------------

    const _id = lodashGet(obj, ["_id"], "");

    // ---------------------------------------------
    //   配列内に存在しているかチェック
    // ---------------------------------------------

    const index = gamesArr.findIndex((valueObj) => {
      return valueObj._id === _id;
    });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/game/v2/components/form.js - handleAdd
    // `);

    // console.log(`
    //   ----- obj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(obj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   gamesLimit: {green ${gamesLimit} / ${typeof gamesLimit} }
    // `);

    // console.log(`
    //   ----- gamesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(gamesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   登録できるゲームの上限を超えている場合はエラー
    // ---------------------------------------------

    if (gamesArr.length >= gamesLimit) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "warning",
            messageID: "_M772JzNl",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   存在していない場合は配列に追加して更新
    // ---------------------------------------------

    if (index === -1) {
      gamesArr.push(obj);
      setGamesArr(lodashCloneDeep(gamesArr));
    }
  };

  /**
   * サジェストのキーボード操作
   * ↓ ↑ で現在の選択状態を変更する
   * Enter で現在選択されているゲームを登録する
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

      handleAdd({ obj: suggestionsArr[suggestionSelectedIndex] });
    }
  };

  /**
   * TextField を変更する
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
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/games/read-suggestion`,
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
      //   /app/common/game/v2/components/form.js - handleKeyword
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
  //   Component - Selected Game
  // --------------------------------------------------

  let componentSelected = "";
  let componentSelectedArr = [];

  if (gamesArr.length > 0) {
    for (const [index, valueObj] of gamesArr.entries()) {
      // --------------------------------------------------
      //   name
      // --------------------------------------------------

      let gameName = valueObj.name;

      if (valueObj.subtitle) {
        gameName = `${valueObj.name}${valueObj.subtitle}`;
      }

      // --------------------------------------------------
      //   push
      // --------------------------------------------------

      componentSelectedArr.push(
        <Chip
          key={index}
          _id={valueObj._id}
          gameCommunities_id={valueObj.gameCommunities_id}
          name={gameName}
          imagesAndVideosThumbnailObj={valueObj.imagesAndVideosThumbnailObj}
          gamesArr={gamesArr}
          setGamesArr={setGamesArr}
        />
      );
    }

    componentSelected = (
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 12px 0;

          @media screen and (max-width: 480px) {
            flex-flow: column wrap;
          }
        `}
      >
        {componentSelectedArr}
      </div>
    );
  }

  // --------------------------------------------------
  //   Component - Suggestion
  // --------------------------------------------------

  let componentSuggestionMenuItemsArr = [];

  if (onFocus && keyword && suggestionsArr.length > 0) {
    for (const [index, valueObj] of suggestionsArr.entries()) {
      // --------------------------------------------------
      //   すでに選択されているハードウェアを太字で表示するためのindex
      // --------------------------------------------------

      const index2 = gamesArr.findIndex((value2Obj) => {
        return value2Obj._id === valueObj._id;
      });

      // --------------------------------------------------
      //   Thumbnail
      // --------------------------------------------------

      const thumbnailSrc = lodashGet(
        valueObj,
        ["imagesAndVideosThumbnailObj", "arr", 0, "src"],
        "/img/common/thumbnail/none.svg"
      );
      const thumbnailSrcSet = lodashGet(
        valueObj,
        ["imagesAndVideosThumbnailObj", "arr", 0, "srcSet"],
        ""
      );

      // --------------------------------------------------
      //   name
      // --------------------------------------------------

      let gameName = valueObj.name;

      if (valueObj.subtitle) {
        gameName = `${valueObj.name}${valueObj.subtitle}`;
      }

      // console.log(chalk`
      //   thumbnailSrc: {green ${thumbnailSrc}}
      //   thumbnailSrcSet: {green ${thumbnailSrcSet}}
      // `);

      // console.log(chalk`
      //   selectedIndex: {green ${selectedIndex}}
      //   index: {green ${index}}
      //   index2: {green ${index2}}
      // `);

      // console.log(`
      //   ----- valueObj -----\n
      //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      componentSuggestionMenuItemsArr.push(
        <MenuItem
          css={css`
            && {
              font-size: 12px;
              white-space: normal;
            }
          `}
          key={index}
          component="div"
          disabled={index2 !== -1}
          selected={index === suggestionSelectedIndex}
          onMouseDown={() =>
            handleAdd({
              obj: valueObj,
            })
          }
        >
          <Avatar
            css={css`
              && {
                width: 24px;
                height: 24px;
              }
            `}
            alt={gameName}
            src={thumbnailSrc}
            srcSet={thumbnailSrcSet}
          />
          <span
            css={css`
              margin: 0 0 0 8px;
            `}
          >
            {gameName}
          </span>
        </MenuItem>
      );
    }
  }

  let componentSuggestion = "";

  if (componentSuggestionMenuItemsArr.length > 0) {
    componentSuggestion = (
      <Paper
        css={css`
          && {
            margin: 12px 0 0 0;
          }
        `}
        square
      >
        <MenuList>{componentSuggestionMenuItemsArr}</MenuList>
      </Paper>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/game/v2/components/form.js
  // `);

  // console.log(`
  //   ----- gamesArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(gamesArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* 選択されたゲーム */}
      {componentSelected}

      {/* TextField */}
      <div onFocus={() => setOnFocus(true)} onBlur={() => setOnFocus(false)}>
        <TextField
          css={css`
            && {
              width: 400px;

              @media screen and (max-width: 480px) {
                width: 100%;
              }
            }
          `}
          label="ゲーム名"
          value={validationKeywordObj.value}
          onChange={(eventObj) =>
            handleKeyword({ value: eventObj.target.value })
          }
          onKeyDown={(eventObj) =>
            handleOnKeyDown({
              eventObj,
              gamesLimit,
            })
          }
          error={validationKeywordObj.error}
          helperText="ゲーム名の一部を入力して、検索結果から選んでください。"
          margin="normal"
          autoComplete="off"
          inputProps={{
            maxLength: 50,
          }}
        />

        {componentSuggestion}
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

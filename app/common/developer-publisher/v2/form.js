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
import keycode from "keycode";
import { useSnackbar } from "notistack";

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

  const { type, arr = [], setArr, limit } = props;

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
   * ????????????
   * @param {string} developerPublisherID - DB developers-publishers developerPublisherID
   * @param {string} name - ?????????????????????????????????
   */
  const handleAdd = ({ developerPublisherID, name }) => {
    // --------------------------------------------------
    //   Clone
    // --------------------------------------------------

    let clonedArr = lodashCloneDeep(arr);

    // ---------------------------------------------
    //   ?????????????????????????????????????????????
    // ---------------------------------------------

    const index = clonedArr.findIndex((valueObj) => {
      return valueObj.developerPublisherID === developerPublisherID;
    });

    // ---------------------------------------------
    //   ???????????????????????????????????????????????????????????????
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
    //   ?????????????????????????????????????????????????????????
    // ---------------------------------------------

    if (index === -1) {
      clonedArr.push({
        developerPublisherID,
        name,
      });

      setArr(clonedArr);
    }

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/hardware/v2/components/form.js - handleAdd
    // `);

    // console.log(`
    //   ----- arr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   developerPublisherID: {green ${developerPublisherID}}
    //   name: {green ${name}}
    //   limit: {green ${limit}}
    //   arr.length: {green ${arr.length}}
    // `);
  };

  /**
   * ????????????
   * @param {string} developerPublisherID - DB hardwares developerPublisherID
   */
  const handleRemove = ({ developerPublisherID }) => {
    // --------------------------------------------------
    //   Clone
    // --------------------------------------------------

    let clonedArr = lodashCloneDeep(arr);

    // ---------------------------------------------
    //   ???????????? index ???????????????
    // ---------------------------------------------

    const index = clonedArr.findIndex((valueObj) => {
      return valueObj.developerPublisherID === developerPublisherID;
    });

    // ---------------------------------------------
    //   ???????????? index ?????????????????????
    // ---------------------------------------------

    clonedArr.splice(index, 1);

    // --------------------------------------------------
    //   ??????
    // --------------------------------------------------

    setArr(clonedArr);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/hardware/v2/components/form.js - handleRemove
    // `);

    // console.log(`
    //   ----- arr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  };

  /**
   * ???????????????????????????????????????
   * ??? ??? ???????????????????????????????????????
   * Enter ???????????????????????????????????????????????????
   * @param {Object} eventObj - ????????????
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
      //   ?????????????????????????????????
      // ---------------------------------------------

      eventObj.preventDefault();

      // ---------------------------------------------
      //   ??????
      // ---------------------------------------------

      handleAdd({
        developerPublisherID:
          suggestionsArr[suggestionSelectedIndex].developerPublisherID,
        name: suggestionsArr[suggestionSelectedIndex].name,
      });
    }
  };

  /**
   * TextField ???????????????
   * ????????????????????????????????? Fetch ????????????????????????????????????????????????
   * @param {string} value - ???
   */
  const handleKeyword = async ({ value }) => {
    try {
      // ---------------------------------------------
      //   TextField ??????????????????????????????
      // ---------------------------------------------

      if (!value) {
        setKeyword("");
        return;
      }

      // ---------------------------------------------
      //   ?????????????????????
      // ---------------------------------------------

      setKeyword(value);

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
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/developers-publishers/read-suggestion`,
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
      //   ?????????????????????
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
  //   Component - Developers Publishers
  // --------------------------------------------------

  let component = "";
  let componentsArr = [];

  if (arr.length > 0) {
    for (const [index, valueObj] of arr.entries()) {
      componentsArr.push(
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
              developerPublisherID: valueObj.developerPublisherID,
            })
          }
          variant="outlined"
        />
      );
    }

    if (componentsArr.length > 0) {
      component = (
        <div
          css={css`
            display: flex;
            flex-flow: row wrap;
            margin: 24px 0 0 0;
          `}
        >
          {componentsArr}
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
      //   ?????????????????????????????????????????????????????????????????????index
      // --------------------------------------------------

      const index2 = arr.findIndex((value2Obj) => {
        return value2Obj.developerPublisherID === valueObj.developerPublisherID;
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
              developerPublisherID: valueObj.developerPublisherID,
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
  //   app/common/developer-publisher/v2/form.js
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
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
      {/* ???????????? */}
      {component}

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
          label={type === "developer" ? "???????????????" : "??????????????????????????????"}
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

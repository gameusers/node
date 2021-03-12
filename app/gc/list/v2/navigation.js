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
import Router from "next/router";
import { useIntl } from "react-intl";

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

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconHelpOutline from "@material-ui/icons/HelpOutline";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationKeyword } from "app/@validations/keyword.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";
import FormHardwares from "app/common/hardware/v2/form.js";

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

  const { page = 1, hardwaresArr = [], keyword } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { handleScrollTo } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [searchHardwaresArr, setSearchHardwaresArr] = useState(hardwaresArr);
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 検索する
   */
  const handleSearch = () => {
    try {
      // ---------------------------------------------
      //   For Search
      // ---------------------------------------------

      const hardwareIDsArr = [];

      for (let valueObj of searchHardwaresArr.values()) {
        hardwareIDsArr.push(valueObj.hardwareID);
      }

      // ---------------------------------------------
      //   Router.push 用
      // ---------------------------------------------

      const urlHardwares =
        hardwareIDsArr.length > 0
          ? `hardwares=${hardwareIDsArr.join(",")}&`
          : "";
      const urlKeyword = searchKeyword
        ? `keyword=${encodeURI(searchKeyword)}&`
        : "";

      let url = `/gc/list/search?${urlHardwares}${urlKeyword}page=1`;

      if (!urlHardwares && !urlKeyword) {
        if (page === 1) {
          url = "/gc/list";
        } else {
          url = `/gc/list/${page}`;
        }
      }

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to: "gcList",
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/gc/list/v2/navigation.js - handleSearch
      // `);

      // console.log(chalk`
      //   page: {green ${page}}
      //   searchKeyword: {green ${searchKeyword}}
      // `);

      // console.log(`
      //   ----- hardwareIDsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(hardwareIDsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- searchCategoriesArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(searchCategoriesArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Router.push = History API pushState()
      // ---------------------------------------------

      Router.push(url);
    } catch (errorObj) {}
  };

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const limitHardwares = parseInt(
    process.env.NEXT_PUBLIC_COMMUNITY_LIST_SEARCH_HARDWARES_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationKeywordObj = validationKeyword({ value: searchKeyword });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/gc/list/v2/navigation.js
  // `);

  // console.log(chalk`
  //   searchHardwares: {green ${searchHardwares}}
  //   searchCategories: {green ${searchCategories}}
  //   searchKeyword: {green ${searchKeyword}}
  // `);

  // console.log(`
  //   ----- searchHardwaresArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(searchHardwaresArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Panel heading="検索" defaultExpanded={true} mobileMargin={true}>
      <p>条件を設定して検索することができます。</p>

      {/* Form Hardware */}
      <div
        css={css`
          width: 100%;
          border-top: 1px dashed #848484;
          margin: 24px 0 0 0;
          padding: 24px 0 0 0;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
          `}
        >
          <h3
            css={css`
              font-weight: bold;
              margin: 2px 0 0 0;
            `}
          >
            ハードウェア
          </h3>

          {/* ？アイコン */}
          <IconButton
            css={css`
              && {
                margin: 0 0 0 8px;
                padding: 0;
              }
            `}
            color="primary"
            aria-label="Show Explanation"
            onClick={(eventObj) => setAnchorEl(eventObj.currentTarget)}
          >
            <IconHelpOutline />
          </IconButton>
        </div>

        {/* ？アイコンを押すと表示される解説文 */}
        <Popover
          id={Boolean(anchorEl) ? "simple-popover" : undefined}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Paper
            css={css`
              max-width: 400px;
              padding: 0 16px 8px 16px;
            `}
          >
            <div
              css={css`
                margin: 12px 0 0 0;
              `}
            >
              <p
                css={css`
                  margin: 0 0 14px 0;
                `}
              >
                ゲームのハードウェアを選んでください。
              </p>

              <p
                css={css`
                  margin: 0 0 14px 0;
                `}
              >
                ハードウェア名（またはSFC、N64などの略称）の一部を入力すると、入力フォームの下に一覧でハードウェアの正式名称が表示されます。一覧上でハードウェアをクリック（タップ）すると入力は完了です。この欄では複数のハードウェアを入力することが可能です。
              </p>

              <p>
                ゲームのハードウェア名だけでなく、「Android」「iOS」「PC」などもハードウェアとして入力できます。
              </p>
            </div>
          </Paper>
        </Popover>

        {/* Form */}
        <FormHardwares
          hardwaresArr={searchHardwaresArr}
          setHardwaresArr={setSearchHardwaresArr}
          limit={limitHardwares}
        />
      </div>

      {/* Keyword */}
      <div
        css={css`
          width: 100%;
          border-top: 1px dashed #848484;
          margin: 12px 0 0 0;
          padding: 24px 0 0 0;
        `}
      >
        {/* Heading */}
        <h3
          css={css`
            font-size: 14px;
            margin: 0 0 6px 0;
          `}
        >
          ゲーム名
        </h3>

        {/* TextField */}
        <TextField
          css={css`
            && {
              width: 100%;
            }
          `}
          id="keyword"
          label="キーワード"
          value={validationKeywordObj.value}
          onChange={(eventObj) => setSearchKeyword(eventObj.target.value)}
          error={validationKeywordObj.error}
          helperText={intl.formatMessage(
            { id: validationKeywordObj.messageID },
            { numberOfCharacters: validationKeywordObj.numberOfCharacters }
          )}
          margin="normal"
          inputProps={{
            maxLength: 100,
          }}
        />
      </div>

      {/* Button */}
      <div
        css={css`
          width: 100%;
          border-top: 1px dashed #848484;
          margin: 12px 0 0 0;
          padding: 24px 0 0 0;
        `}
      >
        <Button
          type="button"
          variant="contained"
          color="primary"
          disabled={buttonDisabled}
          onClick={handleSearch}
        >
          検索する
        </Button>
      </div>
    </Panel>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

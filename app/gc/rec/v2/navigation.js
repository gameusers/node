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
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconHelpOutline from "@material-ui/icons/HelpOutline";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateRecruitment } from "app/@states/recruitment.js";

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

  const { urlID, gameCommunities_id } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateRecruitment = ContainerStateRecruitment.useContainer();

  const {
    searchHardwaresArr,
    setSearchHardwaresArr,

    searchCategoriesArr,
    setSearchCategoriesArr,

    searchKeyword,
    setSearchKeyword,
  } = stateRecruitment;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [showHardwareExplanation, setShowHardwareExplanation] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * カテゴリーをチェックしたときに呼び出す
   * @param {string} value - 値
   */
  const handleCategory = ({ value }) => {
    // --------------------------------------------------
    //   Clone
    // --------------------------------------------------

    let clonedArr = lodashCloneDeep(searchCategoriesArr);

    // --------------------------------------------------
    //   配列に存在しない場合は追加、存在する場合は削除
    // --------------------------------------------------

    if (clonedArr.indexOf(value) === -1) {
      clonedArr.push(value);
    } else {
      const newArr = clonedArr.filter((number) => number !== value);
      clonedArr = newArr;
    }

    // --------------------------------------------------
    //   数字の昇順に並び替え
    // --------------------------------------------------

    clonedArr = clonedArr.slice().sort((a, b) => {
      return a - b;
    });

    // --------------------------------------------------
    //   更新
    // --------------------------------------------------

    setSearchCategoriesArr(clonedArr);
  };

  /**
   * 募集を検索する
   * @param {string} urlID - ゲームのURLになるID　例）Dead-by-Daylight
   * @param {number} page - スレッドのページ
   */
  const handleSearch = ({ urlID, page }) => {
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
      const urlCategories =
        searchCategoriesArr.length > 0
          ? `categories=${searchCategoriesArr.join(",")}&`
          : "";
      const urlKeyword = searchKeyword
        ? `keyword=${encodeURI(searchKeyword)}&`
        : "";

      let url = `/gc/${urlID}/rec/search?${urlHardwares}${urlCategories}${urlKeyword}page=${page}`;

      if (!urlHardwares && !urlCategories && !urlKeyword) {
        if (page === 1) {
          url = `/gc/${urlID}/rec`;
        } else {
          url = `/gc/${urlID}/rec/${page}`;
        }
      }

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/gc/rec/stores/store.js - handleSearch
      // `);

      // console.log(chalk`
      //   urlID: {green ${urlID}}
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   page: {green ${page}}
      // `);

      // console.log(chalk`
      //   urlHardwares: {green ${urlHardwares}}
      //   urlCategories: {green ${urlCategories}}
      //   urlKeyword: {green ${urlKeyword}}
      //   url: {green ${url}}
      //   as: {green ${as}}
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

      // console.log(chalk`
      //   searchKeyword: {green ${searchKeyword}}
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
    process.env.NEXT_PUBLIC_RECRUITMENT_SEARCH_HARDWARES_LIMIT,
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
  //   /app/gc/rec/v2/components/navigation.js
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

  // console.log(`
  //   ----- searchCategoriesArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(searchCategoriesArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   searchKeyword: {green ${searchKeyword}}
  //   encodeURI(initialKeyword): {green ${encodeURI(searchKeyword)}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Panel heading="募集検索" defaultExpanded={true} mobileMargin={true}>
      <p>条件を設定して募集を検索することができます。</p>

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
            aria-label="Show Notification Explanation"
            onClick={() => setShowHardwareExplanation(!showHardwareExplanation)}
          >
            <IconHelpOutline />
          </IconButton>
        </div>

        {/* 解説 */}
        {showHardwareExplanation && (
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
              募集に関係するハードウェアを選んでください（PC版、○○版などの情報です）
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
        )}

        {/* Form */}
        <FormHardwares
          hardwaresArr={searchHardwaresArr}
          setHardwaresArr={setSearchHardwaresArr}
          limit={limitHardwares}
        />
      </div>

      {/* Form Category */}
      <div
        css={css`
          border-top: 1px dashed #848484;
          margin: 24px 0 0 0;
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
          カテゴリー
        </h3>

        {/* Checkbox */}
        <FormControl required component="fieldset">
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={searchCategoriesArr.indexOf(1) !== -1}
                  onChange={() =>
                    handleCategory({
                      value: 1,
                    })
                  }
                  color="primary"
                />
              }
              label="フレンド募集"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={searchCategoriesArr.indexOf(2) !== -1}
                  onChange={() =>
                    handleCategory({
                      value: 2,
                    })
                  }
                  color="primary"
                />
              }
              label="メンバー募集"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={searchCategoriesArr.indexOf(3) !== -1}
                  onChange={() =>
                    handleCategory({
                      value: 3,
                    })
                  }
                  color="primary"
                />
              }
              label="売買・交換相手募集"
            />
          </FormGroup>
        </FormControl>
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
          タイトル・募集文検索
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
          type="submit"
          variant="contained"
          color="primary"
          disabled={buttonDisabled}
          onClick={() =>
            handleSearch({
              urlID,
              gameCommunities_id,
              page: 1,
            })
          }
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

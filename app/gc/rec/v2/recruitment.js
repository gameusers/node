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
import Link from "next/link";
import Router from "next/router";
import { useIntl } from "react-intl";
import { Element } from "react-scroll";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/ja_JP";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconDoubleArrow from "@material-ui/icons/DoubleArrow";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateRecruitment } from "app/@states/recruitment.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { setCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";
import Thread from "app/gc/rec/v2/thread.js";
import FormThread from "app/gc/rec/v2/form/thread.js";

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  expanded: {
    marginBottom: "0 !important",
  },

  input: {
    fontSize: "12px",
    color: "#666",
    padding: "6px 26px 6px 12px",
  },
});

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

  const { urlID, gameCommunities_id, individual } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const classes = useStyles();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateRecruitment = ContainerStateRecruitment.useContainer();

  const {
    recruitmentThreadsObj,

    searchHardwaresArr,
    searchCategoriesArr,
    searchKeyword,
  } = stateRecruitment;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * スレッドを読み込む
   * @param {number} page - スレッドのページ
   * @param {number} changeLimit - 1ページに表示する件数を変更する場合、値を入力する
   */
  const handleRead = async ({ page, changeLimit }) => {
    try {
      // ---------------------------------------------
      //   Router.push 用
      // ---------------------------------------------

      const hardwareIDsArr = [];

      for (let valueObj of searchHardwaresArr.values()) {
        hardwareIDsArr.push(valueObj.hardwareID);
      }

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
      //   Change Limit / Set Cookie
      // ---------------------------------------------

      if (changeLimit) {
        setCookie({ key: "recruitmentThreadLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/gc/rec/v2/components/recruitment.js - handleRead
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   page: {green ${page}}
      //   changeLimit: {green ${changeLimit}}
      //   url: {green ${url}}
      // `);

      // return;

      // ---------------------------------------------
      //   Router.push = History API pushState()
      // ---------------------------------------------

      Router.push(url);
    } catch (errorObj) {}
  };

  // --------------------------------------------------
  //   Thread
  // --------------------------------------------------

  const page = lodashGet(recruitmentThreadsObj, ["page"], 1);
  const limit = lodashGet(
    recruitmentThreadsObj,
    ["limit"],
    parseInt(process.env.NEXT_PUBLIC_FORUM_THREAD_LIMIT, 10)
  );
  const count = lodashGet(recruitmentThreadsObj, ["count"], 0);
  const arr = lodashGet(recruitmentThreadsObj, [`page${page}Obj`, "arr"], []);

  // --------------------------------------------------
  //   Link Return Top
  // --------------------------------------------------

  const linkReturnTopHref = `/gc/[urlID]/rec/[[...slug]]`;
  const linkReturnTopAs = `/gc/${urlID}/rec`;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/recruitment.js
  // `);

  // console.log(chalk`
  //   urlID: {green ${urlID}}
  //   gameCommunities_id: {green ${gameCommunities_id}}

  //   page: {green ${page}}
  //   count: {green ${count}}
  //   limit: {green ${limit}}
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Component - Thread
  // --------------------------------------------------

  const componentsArr = [];

  for (let recruitmentThreads_id of arr.values()) {
    componentsArr.push(
      <Thread
        key={recruitmentThreads_id}
        urlID={urlID}
        gameCommunities_id={gameCommunities_id}
        recruitmentThreads_id={recruitmentThreads_id}
      />
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name="recruitmentThreads">
      {/* Form - Post New Thread */}
      <div
        css={css`
          margin: 0 0 16px 0;
        `}
      >
        <Panel heading="募集投稿フォーム" defaultExpanded={false}>
          <FormThread
            gameCommunities_id={gameCommunities_id}
            recruitmentThreads_id=""
          />
        </Panel>
      </div>

      {/* Recruitment */}
      {componentsArr}

      {/* Pagination */}
      {individual ? (
        <div
          css={css`
            margin: 24px 0 8px 0;
          `}
        >
          <Paper
            css={css`
              display: flex;
              flex-flow: row wrap;
              padding: 12px 0 12px 12px;
            `}
          >
            <Link href={linkReturnTopHref} as={linkReturnTopAs}>
              <a className="link">
                <Button
                  type="submit"
                  variant="outlined"
                  size="small"
                  disabled={buttonDisabled}
                >
                  <IconDoubleArrow />
                  募集トップに戻る
                </Button>
              </a>
            </Link>
          </Paper>
        </div>
      ) : (
        <Paper
          css={css`
            display: flex;
            flex-flow: row wrap;
            padding: 0 8px 8px 8px;
          `}
        >
          {/* Pagination */}
          <div
            css={css`
              margin: 8px 24px 0 0;
            `}
          >
            <Pagination
              disabled={buttonDisabled}
              onChange={(page) =>
                handleRead({
                  page,
                })
              }
              pageSize={limit}
              current={page}
              total={count}
              locale={localeInfo}
            />
          </div>

          {/* Rows Per Page */}
          <FormControl
            css={css`
              margin: 8px 0 0 0 !important;
            `}
            variant="outlined"
          >
            <Select
              value={limit}
              onChange={(eventObj) =>
                handleRead({
                  page: 1,
                  changeLimit: eventObj.target.value,
                })
              }
              input={
                <OutlinedInput
                  classes={{
                    input: classes.input,
                  }}
                  name="recruitment-threads-pagination"
                  id="outlined-rows-per-page"
                />
              }
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      )}
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

import { ContainerStateForum } from "app/@states/forum.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { setCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";
import Thread from "app/common/forum/v2/thread.js";
import FormThread from "app/common/forum/v2/form/thread.js";

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

  const {
    urlID,
    gameCommunities_id,
    userCommunityID,
    userCommunities_id,

    enableAnonymity,
    deletable,
    individual,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const classes = useStyles();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [panelExpanded, setPanelExpanded] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateForum = ContainerStateForum.useContainer();

  const { forumThreadsObj } = stateForum;

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

      let url = "";

      if (gameCommunities_id) {
        if (page === 1) {
          url = `/gc/${urlID}`;
        } else {
          url = `/gc/${urlID}/forum/${page}`;
        }
      } else {
        if (page === 1) {
          url = `/uc/${userCommunityID}`;
        } else {
          url = `/uc/${userCommunityID}/forum/${page}`;
        }
      }

      // ---------------------------------------------
      //   Change Limit / Set Cookie
      // ---------------------------------------------

      if (changeLimit) {
        setCookie({ key: "forumThreadLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/forum/v2/components/forum.js - handleRead
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   page: {green ${page}}
      //   changeLimit: {green ${changeLimit}}

      //   url: {green ${url}}
      //   as: {green ${as}}
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

  const page = lodashGet(forumThreadsObj, ["page"], 1);
  const limit = lodashGet(
    forumThreadsObj,
    ["limit"],
    parseInt(process.env.NEXT_PUBLIC_FORUM_THREAD_LIMIT, 10)
  );
  const count = lodashGet(forumThreadsObj, ["count"], 0);
  const arr = lodashGet(forumThreadsObj, [`page${page}Obj`, "arr"], []);

  // --------------------------------------------------
  //   Link Return Top
  // --------------------------------------------------

  let linkReturnTopHref = "";
  let linkReturnTopAs = "";

  // ---------------------------------------------
  //   - Game Community
  // ---------------------------------------------

  if (urlID) {
    linkReturnTopHref = `/gc/[urlID]`;
    linkReturnTopAs = `/gc/${urlID}`;

    // ---------------------------------------------
    //   - User Community
    // ---------------------------------------------
  } else if (userCommunityID) {
    linkReturnTopHref = `/uc/[userCommunityID]`;
    linkReturnTopAs = `/uc/${userCommunityID}`;
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/forum/v2/components/forum.js
  // `);

  // console.log(chalk`
  //   urlID: {green ${urlID}}
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   userCommunityID: {green ${userCommunityID}}
  //   userCommunities_id: {green ${userCommunities_id}}

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

  for (let forumThreads_id of arr.values()) {
    componentsArr.push(
      <Thread
        key={forumThreads_id}
        urlID={urlID}
        gameCommunities_id={gameCommunities_id}
        userCommunityID={userCommunityID}
        userCommunities_id={userCommunities_id}
        forumThreads_id={forumThreads_id}
        enableAnonymity={enableAnonymity}
        deletable={deletable}
      />
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name="elementForumThreads">
      {/* Form - Post New Thread */}
      <div
        css={css`
          margin: 0 0 16px 0;
        `}
      >
        <Panel
          heading="スレッド投稿フォーム"
          defaultExpanded={false}
          panelExpanded={panelExpanded}
          setPanelExpanded={setPanelExpanded}
        >
          <FormThread
            gameCommunities_id={gameCommunities_id}
            userCommunities_id={userCommunities_id}
            setPanelExpanded={setPanelExpanded}
          />
        </Panel>
      </div>

      {/* Forum */}
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
                  トップに戻る
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
                  name="forum-threads-pagination"
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

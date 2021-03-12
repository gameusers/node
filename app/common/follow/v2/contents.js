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

import Paper from "@material-ui/core/Paper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateForum } from "app/@states/forum.js";
import { ContainerStateRecruitment } from "app/@states/recruitment.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { setCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import ForumThread from "app/common/forum/v2/thread.js";
import RecruitmentThread from "app/gc/rec/v2/thread.js";
import CardGc from "app/common/community-list/v2/card-gc.js";
import CardUc from "app/common/community-list/v2/card-uc.js";

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
    userCommunityID,
    userID,
    category,
    contents,
    pageObj,
    gameCommunityObj,
    userCommunityObj,
  } = props;

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

  const stateForum = ContainerStateForum.useContainer();
  const stateRecruitment = ContainerStateRecruitment.useContainer();

  const { forumThreadsObj } = stateForum;

  const { recruitmentThreadsObj } = stateRecruitment;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * ページを移行する
   * @param {number} page - ページ
   * @param {number} changeLimit - 1ページに表示する件数を変更する場合、値を入力する
   */
  const handleRead = async ({ page, changeLimit }) => {
    try {
      // ---------------------------------------------
      //   Router.push 用
      // ---------------------------------------------

      let url = "";

      const urlCategory = category === "all" ? "" : `/${category}`;
      const urlContents = contents === "all" ? "" : `/${contents}`;
      const urlCategoryContents = `${urlCategory}${urlContents}`;

      if (urlID) {
        if (page === 1) {
          url = `/gc/${urlID}/follow${urlCategoryContents}`;
        } else {
          url = `/gc/${urlID}/follow${urlCategoryContents}/${page}`;
        }
      } else if (userCommunityID) {
        if (page === 1) {
          url = `/uc/${userCommunityID}/follow${urlCategoryContents}`;
        } else {
          url = `/uc/${userCommunityID}/follow${urlCategoryContents}/${page}`;
        }
      } else {
        if (page === 1) {
          url = `/ur/${userID}/follow${urlCategoryContents}`;
        } else {
          url = `/ur/${userID}/follow${urlCategoryContents}/${page}`;
        }
      }

      // ---------------------------------------------
      //   Change Limit / Set Cookie
      // ---------------------------------------------

      if (changeLimit) {
        setCookie({ key: "followContentsLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/common/follow/v2/contents.js - handleRead
      // `);

      // console.log(chalk`
      // category: {green ${category}}
      // contents: {green ${contents}}
      // page: {green ${page}}
      // changeLimit: {green ${changeLimit}}
      // url: {green ${url}}
      // `);

      // ---------------------------------------------
      //   Router.push = History API pushState()
      // ---------------------------------------------

      Router.push(url);
    } catch (errorObj) {}
  };

  // --------------------------------------------------
  //   Thread
  // --------------------------------------------------

  const page = lodashGet(pageObj, ["page"], 1);
  const limit = lodashGet(
    pageObj,
    ["limit"],
    parseInt(process.env.NEXT_PUBLIC_FORUM_THREAD_LIMIT, 10)
  );
  const count = lodashGet(pageObj, ["count"], 0);
  const arr = lodashGet(pageObj, ["arr"], []);
  const forumDataObj = lodashGet(forumThreadsObj, ["dataObj"], {});
  const recruitmentDataObj = lodashGet(recruitmentThreadsObj, ["dataObj"], {});

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/common/follow/v2/contents.js
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

  // console.log(`
  //   ----- userCommunityObj -----\n
  //   ${util.inspect(userCommunityObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Component - Contents
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, valueObj] of arr.entries()) {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    let communitiesDataObj = {};
    let contentsUrlID = "";
    let contentsUserCommunityID = "";

    const _id = valueObj._id;
    const type = valueObj.type;

    const dataObj = type === "forum" ? forumDataObj : recruitmentDataObj;

    const gameCommunities_id = lodashGet(
      dataObj,
      [_id, "gameCommunities_id"],
      ""
    );
    const userCommunities_id = lodashGet(
      dataObj,
      [_id, "userCommunities_id"],
      ""
    );

    if (gameCommunities_id) {
      communitiesDataObj = lodashGet(
        gameCommunityObj,
        [gameCommunities_id],
        {}
      );
      contentsUrlID = lodashGet(communitiesDataObj, ["urlID"], "");
    } else {
      communitiesDataObj = lodashGet(
        userCommunityObj,
        [userCommunities_id],
        {}
      );
      contentsUserCommunityID = lodashGet(
        communitiesDataObj,
        ["userCommunityID"],
        ""
      );
    }

    const anonymity = lodashGet(communitiesDataObj, ["anonymity"], false);
    const deletable = lodashGet(communitiesDataObj, ["deletable"], false);

    // console.log(`
    //   ----- communitiesDataObj -----\n
    //   ${util.inspect(communitiesDataObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- communitiesDataObj -----\n
    //   ${util.inspect(communitiesDataObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    // gameCommunities_id: {green ${gameCommunities_id}}
    // urlID: {green ${urlID}}
    // userCommunities_id: {green ${userCommunities_id}}
    // userCommunityID: {green ${userCommunityID}}
    // `);

    // --------------------------------------------------
    //   push
    // --------------------------------------------------

    if (valueObj.type === "forum") {
      componentsArr.push(
        <React.Fragment key={index}>
          <div
            css={css`
              margin: 28px 0 14px 0;

              @media screen and (max-width: 947px) {
                ${index === 0
                  ? "margin: 0 0 14px 0;"
                  : "margin: 28px 0 14px 0;"}
              }
            `}
          >
            {gameCommunities_id ? (
              <CardGc obj={communitiesDataObj} />
            ) : (
              <CardUc obj={communitiesDataObj} />
            )}
          </div>

          <ForumThread
            key={_id}
            urlID={contentsUrlID}
            gameCommunities_id={gameCommunities_id}
            userCommunityID={contentsUserCommunityID}
            userCommunities_id={userCommunities_id}
            forumThreads_id={_id}
            enableAnonymity={anonymity}
            deletable={deletable}
          />
        </React.Fragment>
      );
    } else {
      componentsArr.push(
        <React.Fragment key={index}>
          <div
            css={css`
              margin: 28px 0 14px 0;

              @media screen and (max-width: 947px) {
                ${index === 0
                  ? "margin: 0 0 14px 0;"
                  : "margin: 28px 0 14px 0;"}
              }
            `}
          >
            <CardGc obj={communitiesDataObj} />
          </div>

          <RecruitmentThread
            key={_id}
            urlID={contentsUrlID}
            gameCommunities_id={gameCommunities_id}
            recruitmentThreads_id={_id}
          />
        </React.Fragment>
      );
    }
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name="elementFollowContents">
      {/* Forum */}
      {componentsArr}

      {/* Pagination */}
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
                name="follow-contents-pagination"
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
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

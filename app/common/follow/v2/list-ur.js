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
import { useSnackbar } from "notistack";
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
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";
import { setCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import CardPlayer from "app/common/card/v2/card-player.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssButton = css`
  && {
    font-size: 12px;
    min-width: 40px;
    min-height: 24px;
    margin: 0 12px 0 0;
    padding: 2px 8px 0;
  }
`;

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
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

  const { userID, cardPlayersObj, setCardPlayersObj, followListUrObj } = props;

  // console.log(`
  //   ----- cardPlayersObj -----\n
  //   ${util.inspect(cardPlayersObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- followListUrObj -----\n
  //   ${util.inspect(followListUrObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    setHeaderObj,
    handleDialogOpen,
    handleLoadingOpen,
    handleLoadingClose,
  } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * フォロワー一覧を読み込む
   * @param {number} page - ページ
   * @param {number} changeLimit - 1ページに表示する件数を変更する場合、値を入力する
   */
  const handleRead = async ({ page, changeLimit }) => {
    try {
      // ---------------------------------------------
      //   Router.push 用
      // ---------------------------------------------

      let url = "";

      if (page === 1) {
        url = `/ur/${userID}/follow/list/ur`;
      } else {
        url = `/ur/${userID}/follow/list/ur/${page}`;
      }

      // ---------------------------------------------
      //   Change Limit / Set Cookie
      // ---------------------------------------------

      if (changeLimit) {
        setCookie({ key: "followListLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      // handleScrollTo({

      //   to: 'followListUr',
      //   duration: 0,
      //   delay: 0,
      //   smooth: 'easeInOutQuart',
      //   offset: -50,

      // });

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/common/follow/v2/list-ur.js - handleRead
      // `);

      // console.log(chalk`
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

  /**
   * フォロワーの管理 - フォロー解除
   * @param {string} targetUsers_id - DB users _id / 管理するユーザーのID
   * @param {string} type - タイプ [unfollow]
   */
  const handleManage = async ({ targetUsers_id, type }) => {
    try {
      // ---------------------------------------------
      //   Loading Open
      // ---------------------------------------------

      handleLoadingOpen({});

      // ---------------------------------------------
      //   Button Disable
      // ---------------------------------------------

      setButtonDisabled(true);

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        targetUsers_id,
        type,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/follows/upsert-manage-followers-ur`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // ---------------------------------------------
      //   Update - Header
      // ---------------------------------------------

      const headerObj = lodashGet(resultObj, ["data", "headerObj"], {});

      if (Object.keys(headerObj).length !== 0) {
        setHeaderObj(headerObj);
      }

      // ---------------------------------------------
      //   Snackbar: Success
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
        arr: [
          {
            variant: "success",
            messageID: "1z127R0YE",
          },
        ],
      });

      // ---------------------------------------------
      //   再読み込み
      // ---------------------------------------------

      handleRead({
        page,
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/follow/v2/components/members.js - handleManage
      // `);

      // console.log(chalk`
      //   users_id: {green ${users_id} / ${typeof users_id}}
      //   gameCommunities_id: {green ${gameCommunities_id} / ${typeof gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id} / ${typeof userCommunities_id}}
      //   pageType: {green ${pageType} / ${typeof pageType}}
      //   targetUsers_id: {green ${targetUsers_id} / ${typeof targetUsers_id}}
      //   type: {green ${type} / ${typeof type}}
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    } catch (errorObj) {
      // ---------------------------------------------
      //   Snackbar: Error
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        errorObj,
      });
    } finally {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const page = lodashGet(followListUrObj, ["followObj", "page"], 1);
  const limit = lodashGet(
    followListUrObj,
    ["limit"],
    parseInt(process.env.NEXT_PUBLIC_FOLLOW_LIST_LIMIT, 10)
  );
  const count = lodashGet(followListUrObj, ["followObj", "count"], 0);
  const arr = lodashGet(
    followListUrObj,
    ["followObj", `page${page}Obj`, "arr"],
    []
  );

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/common/follow/v2/list-ur.js
  // `);

  // console.log(chalk`
  //   page: {green ${page}}
  //   limit: {green ${limit}}
  //   count: {green ${count}}
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Component - List
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, cardPlayers_id] of arr.entries()) {
    // --------------------------------------------------
    //   ユーザーデータ - 管理する相手
    // --------------------------------------------------

    const targetCardPlayersObj = lodashGet(
      cardPlayersObj,
      [cardPlayers_id],
      {}
    );
    const targetUsers_id = lodashGet(
      cardPlayersObj,
      [cardPlayers_id, "users_id"],
      ""
    );

    // console.log(chalk`
    //   targetUsers_id: {green ${targetUsers_id}}
    // `);

    // console.log(`
    //   ----- targetCardPlayersObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(targetCardPlayersObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   push
    // --------------------------------------------------

    componentsArr.push(
      <div
        css={css`
          ${index === 0 ? "margin: 0" : "margin: 16px 0 0 0"};
        `}
        key={index}
      >
        {/* Card */}
        <CardPlayer
          obj={targetCardPlayersObj}
          showFollow={true}
          showEditButton={true}
          defaultExpanded={false}
          cardPlayersObj={cardPlayersObj}
          setCardPlayersObj={setCardPlayersObj}
        />

        {/* Manage Button */}
        <Paper
          css={css`
            display: flex;
            flex-flow: row wrap;
            border-top: 1px dashed #a4a4a4;
            margin: 0 0 16px 0;
            padding: 10px 12px;
          `}
        >
          <div
            css={css`
              margin: 0 16px 0 0;
            `}
          >
            <Button
              css={cssButton}
              variant="contained"
              color="primary"
              disabled={buttonDisabled}
              onClick={() =>
                handleDialogOpen({
                  title: "フォロー解除",
                  description: "フォローを解除しますか？",
                  handle: handleManage,
                  argumentsObj: {
                    targetUsers_id,
                    type: "unfollow",
                  },
                })
              }
            >
              フォロー解除
            </Button>
          </div>
        </Paper>
      </div>
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name="followListUr">
      {/* List */}
      <div
        css={css`
          margin: 0 0 16px 0;
        `}
      >
        {componentsArr}
      </div>

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
                name="list-ur-limit-pagination"
                id="outlined-rows-per-page"
              />
            }
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
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

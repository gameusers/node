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
import { useIntl } from "react-intl";
// import TextareaAutosize from 'react-autosize-textarea';
import moment from "moment";

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

// import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

// import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";
// import IconList from '@material-ui/icons/List';
// import IconNew from '@material-ui/icons/FiberNew';
// import IconImage from '@material-ui/icons/Image';
// import IconOndemandVideo from '@material-ui/icons/OndemandVideo';
import IconListAlt from "@material-ui/icons/ListAlt";
// import IconCreate from '@material-ui/icons/Create';
// import IconSearch from '@material-ui/icons/Search';

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateCommunity } from "app/@states/community.js";
import { ContainerStateForum } from "app/@states/forum.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { getCookie, setCookie } from "app/@modules/cookie.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

// Tooltip内のIconButtonにemotionでスタイルを当てると、ビルド時にエラーがでるため、強引にstyleで当てている。
// 将来的にバグ？が解消するかもしれないので、以下は消さないように
// const cssIconButton = css`
//   && {
//     width: 28px;
//     height: 28px;
//     margin: 0 10px 0 0;
//     padding: 0;
//   }
// `;

const cssTableCell = css`
  && {
    white-space: nowrap;
    padding: 14px 16px 14px 16px !important;
  }
`;

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
    forumID = "",
    gameCommunities_id,
    userCommunityID,
    userCommunities_id,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [panelExpanded, setPanelExpanded] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [currentTabNo, setCurrentTabNo] = useState(0);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateCommunity = ContainerStateCommunity.useContainer();
  const stateForum = ContainerStateForum.useContainer();

  const {
    gameCommunityObj,
    setGameCommunityObj,

    userCommunityObj,
    setUserCommunityObj,
  } = stateCommunity;

  const { forumThreadsForListObj, setForumThreadsForListObj } = stateForum;

  // --------------------------------------------------
  //   Data
  // --------------------------------------------------

  let updatedDate = lodashGet(
    gameCommunityObj,
    ["updatedDateObj", "forum"],
    "0000-01-01T00:00:00Z"
  );

  if (userCommunityID) {
    updatedDate = lodashGet(
      userCommunityObj,
      ["updatedDateObj", "forum"],
      "0000-01-01T00:00:00Z"
    );
  }

  const count = lodashGet(forumThreadsForListObj, ["count"], 1);
  const page = lodashGet(forumThreadsForListObj, ["page"], 1);
  const limit = lodashGet(
    forumThreadsForListObj,
    ["limit"],
    parseInt(process.env.NEXT_PUBLIC_FORUM_THREAD_LIST_LIMIT, 10)
  );
  const arr = lodashGet(forumThreadsForListObj, [`page${page}Obj`, "arr"], []);

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/forum/v2/navigation.js
  // `);

  // console.log(chalk`
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   userCommunities_id: {green ${userCommunities_id}}
  //   updatedDate: {green ${updatedDate}}
  //   count: {green ${count}}
  //   page: {green ${page}}
  //   limit: {green ${limit}}
  // `);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * スレッド一覧を読み込む
   * @param {number} page - スレッド一覧のページ
   * @param {number} changeLimit - スレッド一覧の1ページの表示件数を変更する場合に入力する
   */
  const handleRead = async ({ page, changeLimit }) => {
    try {
      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const loadedDate = lodashGet(
        forumThreadsForListObj,
        [`page${page}Obj`, "loadedDate"],
        ""
      );
      const arr = lodashGet(
        forumThreadsForListObj,
        [`page${page}Obj`, "arr"],
        []
      );

      // ---------------------------------------------
      //   再読込するかどうか
      // ---------------------------------------------

      let reload = false;

      // ---------------------------------------------
      //   Change Limit
      // ---------------------------------------------

      if (changeLimit) {
        // ---------------------------------------------
        //   Set Cookie - forumThreadListLimit
        // ---------------------------------------------

        setCookie({ key: "forumThreadListLimit", value: changeLimit });

        // ---------------------------------------------
        //   1ページに表示する件数を変更した場合、再読込
        // ---------------------------------------------

        reload = true;

        // ---------------------------------------------
        //   最後の読み込み以降にスレッドの更新があった場合
        //   または最後の読み込みからある程度時間（10分）が経っていた場合、再読込する
        // ---------------------------------------------
      } else if (loadedDate) {
        const datetimeLoaded = moment(loadedDate).utcOffset(0);
        const datetimeForumUpdated = moment(updatedDate).utcOffset(0);
        const datetimeNow = moment().utcOffset(0);
        const datetimeReloadLimit = moment(loadedDate)
          .add(process.env.NEXT_PUBLIC_FORUM_RELOAD_MINUTES, "m")
          .utcOffset(0);

        if (
          datetimeForumUpdated.isAfter(datetimeLoaded) ||
          datetimeNow.isAfter(datetimeReloadLimit)
        ) {
          reload = true;
        }
      }

      // ---------------------------------------------
      //   すでにデータを読み込んでいる場合は、ストアのデータを表示する
      // ---------------------------------------------

      if (!reload && arr.length > 0) {
        // console.log('store');

        // ---------------------------------------------
        //   Set Page
        // ---------------------------------------------

        const clonedObj = lodashCloneDeep(forumThreadsForListObj);
        clonedObj.page = page;
        setForumThreadsForListObj(clonedObj);

        // ---------------------------------------------
        //   Return
        // ---------------------------------------------

        return;
      }

      // console.log('fetch');

      // ---------------------------------------------
      //   Button Disable
      // ---------------------------------------------

      setButtonDisabled(true);

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        gameCommunities_id,
        userCommunities_id,
        page,
        limit: changeLimit || limit,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-threads/read-threads-list`,
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
      //   Update - gameCommunityObj / userCommunityObj
      // ---------------------------------------------

      if (gameCommunities_id) {
        setGameCommunityObj(
          lodashGet(resultObj, ["data", "gameCommunityObj"], {})
        );
      } else {
        setUserCommunityObj(
          lodashGet(resultObj, ["data", "userCommunityObj"], {})
        );
      }

      // ---------------------------------------------
      //   Update - forumThreadsForListObj
      //   再読込する場合は新しいデータに置き換える、再読込しない場合は古いデータと新しいデータをマージする
      // ---------------------------------------------

      const forumThreadsForListNewObj = lodashGet(
        resultObj,
        ["data", "forumThreadsForListObj"],
        {}
      );
      const forumThreadsForListMergedObj = reload
        ? forumThreadsForListNewObj
        : lodashMerge(forumThreadsForListObj, forumThreadsForListNewObj);
      setForumThreadsForListObj(forumThreadsForListMergedObj);

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/forum/v2/navigation.js - handleRead
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   updatedDate: {green ${updatedDate}}
      //   count: {green ${count}}
      //   page: {green ${page}}
      //   limit: {green ${limit}}
      //   changeLimit: {green ${changeLimit}}
      //   loadedDate: {green ${loadedDate}}
      // `);

      // console.log(`
      //   ----- arr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    } catch (errorObj) {
    } finally {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);
    }
  };

  // --------------------------------------------------
  //   Component - スレッド一覧
  // --------------------------------------------------

  let componentThreadList = "";

  if (Object.keys(forumThreadsForListObj).length !== 0) {
    // --------------------------------------------------
    //   テーブルの中身
    // --------------------------------------------------

    let componentTableDataArr = [];

    for (const [index, forumThreads_id] of arr.entries()) {
      // --------------------------------------------------
      //   dataObj
      // --------------------------------------------------

      const dataObj = lodashGet(
        forumThreadsForListObj,
        ["dataObj", forumThreads_id],
        {}
      );

      // console.log(`
      //   ----- dataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(dataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // --------------------------------------------------
      //   Link
      // --------------------------------------------------

      let linkHref = "";
      let linkAs = "";

      // ---------------------------------------------
      //   - Game Community
      // ---------------------------------------------

      if (urlID) {
        linkHref = `/gc/[urlID]/forum/[[...slug]]`;
        linkAs = `/gc/${urlID}/forum/${forumThreads_id}`;

        // ---------------------------------------------
        //   - User Community
        // ---------------------------------------------
      } else if (userCommunityID) {
        linkHref = `/uc/[userCommunityID]/forum/[[...slug]]`;
        linkAs = `/uc/${userCommunityID}/forum/${forumThreads_id}`;
      }

      // --------------------------------------------------
      //   リンクあり
      // --------------------------------------------------

      let tableCellName = (
        <TableCell
          css={css`
            && {
              min-width: 268px;
              cursor: pointer;
              padding: 14px 0 14px 16px;
            }
          `}
          padding="none"
          component="th"
          scope="row"
        >
          <Link href={linkHref} as={linkAs}>
            <a>{dataObj.name}</a>
          </Link>
        </TableCell>
      );
      // --------------------------------------------------
      //   リンクなし（現在、表示しているスレッドの場合）
      // --------------------------------------------------

      if (forumID.indexOf(forumThreads_id) !== -1) {
        tableCellName = (
          <TableCell
            css={css`
              && {
                min-width: 268px;
                padding: 14px 0 14px 16px;
              }
            `}
            padding="none"
            component="th"
            scope="row"
          >
            {dataObj.name}
          </TableCell>
        );
      }

      // --------------------------------------------------
      //   push
      // --------------------------------------------------

      componentTableDataArr.push(
        <TableRow key={index}>
          {tableCellName}
          <TableCell css={cssTableCell}>{dataObj.updatedDate}</TableCell>
          <TableCell css={cssTableCell} align="right">
            {dataObj.comments}
          </TableCell>
          <TableCell css={cssTableCell} align="right">
            {dataObj.replies}
          </TableCell>
          <TableCell css={cssTableCell} align="right">
            {dataObj.images}
          </TableCell>
          <TableCell css={cssTableCell} align="right">
            {dataObj.videos}
          </TableCell>
        </TableRow>
      );
    }

    componentThreadList = (
      <React.Fragment>
        {/* Table */}
        <Table>
          {/* Head */}
          <TableHead>
            <TableRow>
              <TableCell css={cssTableCell}>名前</TableCell>
              <TableCell css={cssTableCell}>最終更新日</TableCell>
              <TableCell css={cssTableCell} align="right">
                コメント
              </TableCell>
              <TableCell css={cssTableCell} align="right">
                返信
              </TableCell>
              <TableCell css={cssTableCell} align="right">
                画像
              </TableCell>
              <TableCell css={cssTableCell} align="right">
                動画
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>{componentTableDataArr}</TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 15, 20]}
          count={count}
          rowsPerPage={limit}
          page={page - 1}
          labelRowsPerPage=""
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onChangeRowsPerPage={(eventObj) =>
            handleRead({
              page: 1,
              changeLimit: eventObj.target.value,
            })
          }
          onChangePage={(eventObj, value) =>
            handleRead({
              page: value + 1,
            })
          }
        />
      </React.Fragment>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/sidebar.js
  // `);

  // console.log(chalk`
  //   login: {green ${login}}
  // `);

  // console.log(`
  //   ----- linkArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(linkArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Accordion
      css={css`
        margin: 0 !important;

        @media screen and (max-width: 947px) {
          margin: 0 0 16px 0 !important;
        }
      `}
      expanded={panelExpanded}
    >
      {/* Summary */}
      <AccordionSummary
        css={css`
          cursor: default !important;
          padding-right: 14px !important;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
          `}
        >
          {/* Heading */}
          <div
            css={css`
              height: 28px;
            `}
          >
            <h2
              css={css`
                font-size: 18px;
                line-height: 1;
                padding: 7px 0 0 0;
              `}
            >
              Forum
            </h2>
          </div>

          {/* Icon */}
          {/*<div
            css={css`
              margin: 0 0 0 14px;
              // background-color: green;
            `}
          >*/}

          {/* Tooltip内のIconButtonにemotionでスタイルを当てると、ビルド時にエラーがでるため、強引にstyleで当てている */}
          {/*<Tooltip title="すべてのコメント">
              <IconButton
                style={{
                  width: '28px',
                  height: '28px',
                  margin: '0 10px 0 0',
                  padding: 0,
                }}
                // css={cssIconButton}
                // onClick={() => handlePanelExpand({ _id: 'test' })}
                // onClick={handleMenuButtonThreadList}
              >
                <IconList />
              </IconButton>
            </Tooltip>


            <Tooltip title="新しいコメント">
              <IconButton
                style={{
                  width: '28px',
                  height: '28px',
                  margin: '0 10px 0 0',
                  padding: 0,
                }}
                // css={cssIconButton}
                // onClick={handleMenuButtonNew}
              >
                <IconNew />
              </IconButton>
            </Tooltip>


            <Tooltip title="画像付きのコメント">
              <IconButton
                style={{
                  width: '28px',
                  height: '28px',
                  margin: '0 10px 0 0',
                  padding: 0,
                }}
                // css={cssIconButton}
                // onClick={handleMenuButtonImage}
              >
                <IconImage />
              </IconButton>
            </Tooltip>


            <Tooltip title="動画付きのコメント">
              <IconButton
                style={{
                  width: '28px',
                  height: '28px',
                  margin: '0 10px 0 0',
                  padding: 0,
                }}
                // css={cssIconButton}
                // onClick={handleMenuButtonVideo}
              >
                <IconOndemandVideo />
              </IconButton>
            </Tooltip>


          </div>*/}
        </div>

        {/* Expansion Button */}
        <div
          css={css`
            margin: 0 0 0 auto;
          `}
        >
          <IconButton
            css={css`
              && {
                margin: 0;
                padding: 4px;
              }
            `}
            onClick={() => setPanelExpanded(!panelExpanded)}
            aria-expanded={panelExpanded}
            aria-label="Show more"
            disabled={buttonDisabled}
          >
            {panelExpanded ? <IconExpandLess /> : <IconExpandMore />}
          </IconButton>
        </div>
      </AccordionSummary>

      {/* Contents */}
      <AccordionDetails
        css={css`
          && {
            padding: 0;
          }
        `}
      >
        {/* Tab */}
        <Paper
          css={css`
            && {
              width: 100%;
              overflow-x: auto;
            }
          `}
        >
          {/* ブラウザの横幅が大きい場合 - タブをテキストで表示する */}
          <Tabs
            css={css`
              && {
                padding: 0 12px;
                display: none;

                @media screen and (max-width: 947px) {
                  display: inline;
                }
              }
            `}
            value={currentTabNo}
            indicatorColor="primary"
            textColor="primary"
            onChange={(eventObj, value) => setCurrentTabNo(value)}
          >
            <Tab label="スレッド一覧" />
          </Tabs>

          {/* ブラウザの横幅が小さい場合 - タブをアイコンで表示する */}
          <Tabs
            css={css`
              && {
                padding: 0 12px;

                @media screen and (max-width: 947px) {
                  display: none;
                }
              }
            `}
            value={currentTabNo}
            indicatorColor="primary"
            textColor="primary"
            onChange={(eventObj, value) => setCurrentTabNo(value)}
          >
            {/* スレッド一覧 */}
            <Tooltip
              css={css`
                && {
                  @media screen and (max-width: 947px) {
                    display: none;
                  }
                }
              `}
              title="スレッド一覧"
            >
              <Tab
                style={{
                  minWidth: "92px",
                }}
                icon={<IconListAlt />}
              />
            </Tooltip>
          </Tabs>

          {/* Thread List */}
          {currentTabNo === 0 && (
            <div
              css={css`
                padding: 4px 0 0;
              `}
            >
              {componentThreadList}
            </div>
          )}

          {/* Search */}
          {currentTabNo === 1 &&
            {
              /*<div
              css={css`
                padding: 0 16px 16px;
              `}
            >


              <div
                css={css`
                  margin: 0 0 16px 0;
                `}
              >

                <TextField
                  css={css`
                    && {
                      width: 100%;
                      max-width: 500px;
                    }
                  `}
                  id="createTreadName"
                  label="検索キーワード"
                  value={lodashGet(dataObj, [...this.pathArr, 'searchObj', 'keyword'], '')}
                  onChange={(eventObj) => handleEdit({
                    pathArr: [...this.pathArr, 'searchObj', 'keyword'],
                    value: eventObj.target.value
                  })}
                  // error={validationForumThreadsObj.error}
                  // helperText={intl.formatMessage({ id: validationForumThreadsObj.messageID }, { numberOfCharacters: validationForumThreadsObj.numberOfCharacters })}
                  margin="normal"
                  inputProps={{
                    maxLength: 20,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch />
                      </InputAdornment>
                    ),
                  }}
                />

                <div
                  css={css`
                    display: flex;
                    flex-flow: row wrap;
                    margin: 6px 0 0 0;
                  `}
                >

                  <TextField
                    css={css`
                      && {
                        margin: 12px 20px 0 0;
                      }
                    `}
                    id="date-start"
                    label="期間 - 開始日"
                    type="date"
                    value={lodashGet(dataObj, [...this.pathArr, 'searchObj', 'dateStart'], '')}
                    onChange={(eventObj) => handleEdit({
                      pathArr: [...this.pathArr, 'searchObj', 'dateStart'],
                      value: eventObj.target.value
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    css={css`
                      && {
                        margin: 12px 0 0 0;
                      }
                    `}
                    id="date-end"
                    label="期間 - 終了日"
                    type="date"
                    value={lodashGet(dataObj, [...this.pathArr, 'searchObj', 'dateEnd'], '')}
                    onChange={(eventObj) => handleEdit({
                      pathArr: [...this.pathArr, 'searchObj', 'dateEnd'],
                      value: eventObj.target.value
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                </div>


                <div
                  css={css`
                    display: flex;
                    flex-flow: row wrap;
                    margin: 16px 0 0 0;
                  `}
                >

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={lodashGet(dataObj, [...this.pathArr, 'searchObj', 'checkThread'], false)}
                        onChange={(eventObj) => handleEdit({
                          pathArr: [...this.pathArr, 'searchObj', 'checkThread'],
                          value: eventObj.target.checked
                        })}
                      />
                    }
                    label="スレッド"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={lodashGet(dataObj, [...this.pathArr, 'searchObj', 'checkComment'], false)}
                        onChange={(eventObj) => handleEdit({
                          pathArr: [...this.pathArr, 'searchObj', 'checkComment'],
                          value: eventObj.target.checked
                        })}
                      />
                    }
                    label="コメント"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={lodashGet(dataObj, [...this.pathArr, 'searchObj', 'checkImage'], false)}
                        onChange={(eventObj) => handleEdit({
                          pathArr: [...this.pathArr, 'searchObj', 'checkImage'],
                          value: eventObj.target.checked
                        })}
                      />
                    }
                    label="画像あり"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={lodashGet(dataObj, [...this.pathArr, 'searchObj', 'checkVideo'], false)}
                        onChange={(eventObj) => handleEdit({
                          pathArr: [...this.pathArr, 'searchObj', 'checkVideo'],
                          value: eventObj.target.checked
                        })}
                      />
                    }
                    label="動画あり"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={lodashGet(dataObj, [...this.pathArr, 'searchObj', 'checkMyPost'], false)}
                        onChange={(eventObj) => handleEdit({
                          pathArr: [...this.pathArr, 'searchObj', 'checkMyPost'],
                          value: eventObj.target.checked
                        })}
                      />
                    }
                    label="自分の投稿"
                  />

                </div>

              </div>


              <Button
                variant="contained"
                color="primary"
              >
                検索
              </Button>


            </div>*/
            }}
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

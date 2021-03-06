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
import { Element } from "react-scroll";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/ja_JP";
import moment from "moment";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashCloneDeep from "lodash/cloneDeep";
import lodashMerge from "lodash/merge";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Paper from "@material-ui/core/Paper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { getCookie, setCookie } from "app/@modules/cookie.js";
import { showSnackbar } from "app/@modules/snackbar.js";

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

  const {
    pageType,
    users_id,
    gameCommunities_id,
    userCommunities_id,
    accessLevel,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [controlType, setControlType] = useState(
    pageType === "ur" ? "follow" : "followed"
  );
  const [cardPlayersObj, setCardPlayersObj] = useState(props.cardPlayersObj);
  const [followMembersObj, setFollowMembersObj] = useState(
    props.followMembersObj
  );

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();

  const { loginUsersObj } = stateUser;

  const {
    setHeaderObj,
    handleDialogOpen,
    handleLoadingOpen,
    handleLoadingClose,
    handleScrollTo,
  } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * ??????????????? / ???????????????????????????
   * @param {string} changeControlType - ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   * @param {number} page - ????????????????????????
   * @param {number} changeLimit - 1????????????????????????????????????????????????????????????????????????
   * @param {boolean} forceReload - ?????????????????????????????????????????? true
   */
  const handleRead = async ({
    changeControlType,
    page = 1,
    changeLimit,
    forceReload = false,
  }) => {
    try {
      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const newControlType = changeControlType || controlType;

      const loadedDate = lodashGet(
        followMembersObj,
        [`${newControlType}Obj`, `page${page}Obj`, "loadedDate"],
        ""
      );
      const arr = lodashGet(
        followMembersObj,
        [`${newControlType}Obj`, `page${page}Obj`, "arr"],
        []
      );

      let limit = parseInt(
        getCookie({ key: "followLimit" }) ||
          process.env.NEXT_PUBLIC_FOLLOW_LIST_LIMIT,
        10
      );

      // ---------------------------------------------
      //   Change Limit
      // ---------------------------------------------

      if (changeLimit) {
        limit = changeLimit;

        // ---------------------------------------------
        //   Set Cookie - followLimit
        // ---------------------------------------------

        setCookie({ key: "followLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   ???????????????????????????
      // ---------------------------------------------

      let reload = false;

      // ---------------------------------------------
      //   controlType ?????????????????????
      // ---------------------------------------------

      if (changeControlType) {
        // ---------------------------------------------
        //   Set controlType
        // ---------------------------------------------

        setControlType(changeControlType);

        // ---------------------------------------------
        //   ???????????????
        // ---------------------------------------------

        reload = true;

        // ---------------------------------------------
        //   1???????????????????????????????????????????????????????????????
        // ---------------------------------------------
      } else if (changeLimit || forceReload) {
        // ---------------------------------------------
        //   ?????????
        // ---------------------------------------------

        reload = true;

        // ---------------------------------------------
        //   ??????????????????????????????????????????????????????
        //   ?????????????????????????????????????????????????????????10????????????????????????????????????????????????
        // ---------------------------------------------
      } else if (loadedDate) {
        const datetimeNow = moment().utcOffset(0);
        const datetimeReloadLimit = moment(loadedDate)
          .add(process.env.NEXT_PUBLIC_FOLLOWERS_RELOAD_MINUTES, "m")
          .utcOffset(0);

        if (datetimeNow.isAfter(datetimeReloadLimit)) {
          reload = true;
        }
      }

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/follow/v2/components/members.js - handleRead
      // `);

      // console.log(chalk`
      //   newControlType: {green ${newControlType}}
      //   controlType: {green ${controlType}}
      //   page: {green ${page}}
      //   reload: {green ${reload}}
      // `);

      // console.log(`
      //   ----- followMembersObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(followMembersObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- arr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   ??????????????????????????????????????????????????????????????????????????????????????????
      // ---------------------------------------------

      if (!reload && arr.length > 0) {
        // console.log('store');

        // ---------------------------------------------
        //   Set Page
        // ---------------------------------------------

        const clonedObj = lodashCloneDeep(followMembersObj);
        lodashSet(clonedObj, [`${newControlType}Obj`, "page"], page);
        setFollowMembersObj(clonedObj);

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
        users_id,
        gameCommunities_id,
        userCommunities_id,
        controlType: newControlType,
        page,
        limit,
      };

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(formDataObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- JSON.stringify(formDataObj) -----\n
      //   ${util.inspect(JSON.stringify(formDataObj), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(formDataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- JSON.stringify(formDataObj) -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(JSON.stringify(formDataObj))), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/follows/read-followers`,
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
      //   Update - cardPlayersObj
      // ---------------------------------------------

      const cardPlayersNewObj = lodashGet(
        resultObj,
        ["data", "cardPlayersObj"],
        {}
      );
      const cardPlayersMergedObj = reload
        ? cardPlayersNewObj
        : lodashMerge(cardPlayersObj, cardPlayersNewObj);
      setCardPlayersObj(cardPlayersMergedObj);

      // ---------------------------------------------
      //   Update - followMembersObj
      // ---------------------------------------------

      const followMembersNewObj = lodashGet(
        resultObj,
        ["data", "followMembersObj"],
        {}
      );
      const followMembersMergedObj = reload
        ? followMembersNewObj
        : lodashMerge(followMembersObj, followMembersNewObj);
      setFollowMembersObj(followMembersMergedObj);

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/follow/v2/components/members.js - handleRead
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      //   forumComments_id: {green ${forumComments_id}}
      // `);

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(formDataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- cardPlayersMergedObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(cardPlayersMergedObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- followMembersMergedObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(followMembersMergedObj)), { colors: true, depth: null })}\n
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
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to: "elementFollowMembers",
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });
    }
  };

  /**
   * ????????????????????????????????????????????????????????? - ??????????????????????????????????????????????????????/ ?????? / ?????? / ???????????? / ??????????????????
   * @param {string} targetUsers_id - DB users _id / ???????????????????????????ID
   * @param {string} type - ????????? [follow / unfollow / approval / unapproval / block / unblock]
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
      //   Fetch
      // ---------------------------------------------

      let resultObj = {};

      // ----------------------------------------
      //   - User
      // ----------------------------------------

      if (pageType === "ur") {
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

        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/follows/upsert-manage-followers-ur`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });

        // ----------------------------------------
        //   - User Community
        // ----------------------------------------
      } else if (pageType === "uc") {
        // ---------------------------------------------
        //   FormData
        // ---------------------------------------------

        const formDataObj = {
          userCommunities_id,
          targetUsers_id,
          type,
        };

        // ---------------------------------------------
        //   Fetch
        // ---------------------------------------------

        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/follows/upsert-manage-followers-uc`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      }

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // ---------------------------------------------
      //   ????????????????????????
      // ---------------------------------------------

      handleRead({
        page,
        forceReload: true,
      });

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

  const page = lodashGet(followMembersObj, [`${controlType}Obj`, "page"], 1);
  const limit = lodashGet(
    followMembersObj,
    ["limit"],
    parseInt(process.env.NEXT_PUBLIC_FOLLOW_LIST_LIMIT, 10)
  );
  const count = lodashGet(followMembersObj, [`${controlType}Obj`, "count"], 0);
  const arr = lodashGet(
    followMembersObj,
    [`${controlType}Obj`, `page${page}Obj`, "arr"],
    []
  );

  let approvalCount = lodashGet(followMembersObj, ["approvalObj", "count"], 0);

  if (approvalCount > 99) {
    approvalCount = "99+";
  }

  const loginUsers_id = lodashGet(loginUsersObj, ["_id"], "");

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/follow/v2/components/members.js
  // `);

  // console.log(chalk`
  //   users_id: {green ${users_id}}
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   userCommunities_id: {green ${userCommunities_id}}

  //   accessLevel: {green ${accessLevel}}

  //   page: {green ${page}}
  //   count: {green ${count}}
  //   limit: {green ${limit}}
  // `);

  // console.log(`
  //   ----- followMembersObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(followMembersObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Component - Card Players
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, cardPlayers_id] of arr.entries()) {
    // --------------------------------------------------
    //   ????????????????????? - ??????????????????
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

    // --------------------------------------------------
    //   ??????????????????????????????????????????
    // --------------------------------------------------

    const showManageButton =
      accessLevel >= 50 && loginUsers_id !== targetUsers_id ? true : false;

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
        {/* Card Player */}
        <div
          css={css`
            ${showManageButton ? "margin: 0" : "margin: 0 0 16px 0"};
          `}
        >
          <CardPlayer
            obj={targetCardPlayersObj}
            showFollow={true}
            showEditButton={true}
            defaultExpanded={false}
            cardPlayersObj={cardPlayersObj}
            setCardPlayersObj={setCardPlayersObj}
          />
        </div>

        {/* ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */}
        {showManageButton && (
          <Paper
            css={css`
              display: flex;
              flex-flow: row wrap;
              border-top: 1px dashed #a4a4a4;
              margin: 0 0 16px 0;
              padding: 10px 12px;
            `}
          >
            {controlType === "follow" && (
              <div
                css={css`
                  margin: 0 16px 0 0;
                `}
              >
                <Button
                  css={cssButton}
                  variant="contained"
                  color="secondary"
                  disabled={buttonDisabled}
                  onClick={() =>
                    handleDialogOpen({
                      title:
                        pageType === "ur" ? "??????????????????" : "????????????????????????",
                      description:
                        pageType === "ur"
                          ? "????????????????????????????????????"
                          : "????????????????????????????????????????????????",
                      handle: handleManage,
                      argumentsObj: {
                        targetUsers_id,
                        type: "unfollow",
                      },
                    })
                  }
                >
                  {pageType === "ur" ? "??????????????????" : "??????"}
                </Button>
              </div>
            )}

            {controlType === "approval" && (
              <React.Fragment>
                <Button
                  css={cssButton}
                  variant="contained"
                  color="secondary"
                  disabled={buttonDisabled}
                  onClick={() =>
                    handleDialogOpen({
                      title:
                        pageType === "ur"
                          ? "??????????????????"
                          : "????????????????????????????????????",
                      description:
                        pageType === "ur"
                          ? "????????????????????????????????????"
                          : "??????????????????????????????????????????????????????",
                      handle: handleManage,
                      argumentsObj: {
                        targetUsers_id,
                        type: "approval",
                      },
                    })
                  }
                >
                  {pageType === "ur" ? "??????????????????" : "????????????"}
                </Button>

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
                        title:
                          pageType === "ur"
                            ? "??????????????????"
                            : "????????????????????????????????????",
                        description:
                          pageType === "ur"
                            ? "????????????????????????????????????"
                            : "??????????????????????????????????????????????????????",
                        handle: handleManage,
                        argumentsObj: {
                          targetUsers_id,
                          type: "unapproval",
                        },
                      })
                    }
                  >
                    {pageType === "ur" ? "??????????????????" : "????????????"}
                  </Button>
                </div>
              </React.Fragment>
            )}

            {controlType !== "block" && (
              <Button
                css={cssButton}
                variant="contained"
                color="secondary"
                disabled={buttonDisabled}
                onClick={() =>
                  handleDialogOpen({
                    title: "????????????",
                    description: "???????????????????????????",
                    handle: handleManage,
                    argumentsObj: {
                      targetUsers_id,
                      type: "block",
                    },
                  })
                }
              >
                ????????????
              </Button>
            )}

            {controlType === "block" && (
              <Button
                css={cssButton}
                variant="contained"
                color="primary"
                disabled={buttonDisabled}
                onClick={() =>
                  handleDialogOpen({
                    title: "??????????????????",
                    description: "????????????????????????????????????",
                    handle: handleManage,
                    argumentsObj: {
                      targetUsers_id,
                      type: "unblock",
                    },
                  })
                }
              >
                ??????????????????
              </Button>
            )}
          </Paper>
        )}
      </div>
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name="elementFollowMembers">
      {/* Control Buttons */}
      <Paper
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 0 0 16px 0;
          padding: 12px;
        `}
      >
        <ButtonGroup
          size="small"
          color="primary"
          aria-label="outlined primary button group"
          disabled={buttonDisabled}
        >
          {/* ????????????????????? - ??????????????????????????????????????????????????????????????????????????????????????? */}
          {pageType === "ur" && (
            <Button
              onClick={() =>
                handleRead({
                  changeControlType: "follow",
                  pageType,
                  page: 1,
                })
              }
            >
              <span
                css={css`
                  font-weight: ${controlType === "follow" ? "bold" : "normal"};
                `}
              >
                ????????????
              </span>
            </Button>
          )}

          {/* ???????????????????????? */}
          <Button
            onClick={() =>
              handleRead({
                changeControlType: "followed",
                pageType,
                page: 1,
              })
            }
          >
            <span
              css={css`
                font-weight: ${controlType === "followed" ? "bold" : "normal"};
              `}
            >
              {pageType === "uc" ? "????????????" : "???????????????"}
            </span>
          </Button>

          {/* ?????????????????? */}
          {pageType === "uc" && (
            <Button
              onClick={() =>
                handleRead({
                  changeControlType: "administrator",
                  pageType,
                  page: 1,
                })
              }
            >
              <span
                css={css`
                  font-weight: ${controlType === "administrator"
                    ? "bold"
                    : "normal"};
                `}
              >
                ?????????
              </span>
            </Button>
          )}

          {/* ??????????????? - ???????????? */}
          {accessLevel >= 50 && (
            <Button
              onClick={() =>
                handleRead({
                  changeControlType: "approval",
                  pageType,
                  page: 1,
                })
              }
            >
              <span
                css={css`
                  font-weight: ${controlType === "approval"
                    ? "bold"
                    : "normal"};
                `}
              >
                ?????? ({approvalCount})
              </span>
            </Button>
          )}

          {/* ????????????????????? - ???????????? */}
          {accessLevel >= 50 && (
            <Button
              onClick={() =>
                handleRead({
                  changeControlType: "block",
                  pageType,
                  page: 1,
                })
              }
            >
              <span
                css={css`
                  font-weight: ${controlType === "block" ? "bold" : "normal"};
                `}
              >
                ????????????
              </span>
            </Button>
          )}
        </ButtonGroup>
      </Paper>

      {/* Card Players */}
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
                name="follow-members-pagination"
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

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
import { useSnackbar } from "notistack";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconPermIdentity from "@material-ui/icons/PermIdentity";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
import { ContainerStateLayout } from "app/@states/layout.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    type,
    gameCommunities_id,
    userCommunities_id,
    users_id,
    followsObj = {},
    updateHeader = false,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();

  const { login } = stateUser;

  const { setHeaderObj, handleDialogOpen } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  const handleFollow = async ({
    type,
    gameCommunities_id,
    userCommunities_id,
    users_id,
  }) => {
    try {
      // ---------------------------------------------
      //   Button Disable
      // ---------------------------------------------

      setButtonDisabled(true);

      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      let resultObj = {};
      let pageTransition = false;

      // ---------------------------------------------
      //   Game Community & User Community
      // ---------------------------------------------

      if (gameCommunities_id || userCommunities_id) {
        // ---------------------------------------------
        //   FormData
        // ---------------------------------------------

        const formDataObj = {
          gameCommunities_id,
          userCommunities_id,
        };

        // ---------------------------------------------
        //   Fetch
        // ---------------------------------------------

        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/follows/upsert-follow-gc-uc`,
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
        //   /app/common/follow/v2/components/follow-button.js - handleFollow
        // `);

        // console.log(chalk`
        //   type: {green ${type}}
        //   gameCommunities_id: {green ${gameCommunities_id}}
        //   userCommunities_id: {green ${userCommunities_id}}
        // `);

        // console.log(`
        //   ----- resultObj -----\n
        //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // ---------------------------------------------
        //   User
        // ---------------------------------------------
      } else {
        // ---------------------------------------------
        //   FormData
        // ---------------------------------------------

        const formDataObj = {
          users_id,
          updateHeader,
        };

        // ---------------------------------------------
        //   Fetch
        // ---------------------------------------------

        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/follows/upsert-follow-ur`,
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
        //   /app/common/follow/v2/components/follow-button.js - handleFollow
        // `);

        // console.log(chalk`
        //   type: {green ${type}}
        //   gameCommunities_id: {green ${gameCommunities_id}}
        //   userCommunities_id: {green ${userCommunities_id}}
        // `);

        // console.log(`
        //   ----- resultObj -----\n
        //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }

      // ---------------------------------------------
      //   ?????????????????????????????????????????????????????????
      // ---------------------------------------------

      const follow = lodashGet(resultObj, ["data", "follow"], null);

      if (follow !== null) {
        lodashSet(followsObj, ["follow"], follow);
      }

      const followedCount = lodashGet(
        resultObj,
        ["data", "followedCount"],
        null
      );

      if (followedCount !== null) {
        lodashSet(followsObj, ["followedCount"], followedCount);
      }

      // ---------------------------------------------
      //   ??????????????????????????????
      // ---------------------------------------------

      pageTransition = lodashGet(resultObj, ["data", "pageTransition"], false);

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

      let messageID = "RTsMTGw-1";

      switch (type) {
        case "followGc":
          messageID = "RTsMTGw-1";
          break;

        case "unfollowGc":
          messageID = "1z127R0YE";
          break;

        case "followUc":
          messageID = "SY6WWDyxQ";
          break;

        case "unfollowUc":
          messageID = "xWAfTONZ6";
          break;

        case "followApprovalUc":
          messageID = "PaC4bsJe2";
          break;

        case "unfollowApprovalUc":
          messageID = "HOo6u_sXD";
          break;

        case "follow":
          messageID = "RTsMTGw-1";
          break;

        case "unfollow":
          messageID = "1z127R0YE";
          break;

        case "followApproval":
          messageID = "T7i5qYulJ";
          break;

        case "unfollowApproval":
          messageID = "a-BV7oEkP";
          break;
      }

      showSnackbar({
        enqueueSnackbar,
        intl,
        experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
        arr: [
          {
            variant: "success",
            messageID,
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/follow/v2/follow-button.js
      // `);

      // console.log(chalk`
      //   pageTransition: {green ${pageTransition}}
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   ??????????????????
      // ---------------------------------------------

      if (pageTransition) {
        window.location.reload();
      }
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
    }
  };

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const approval = lodashGet(followsObj, ["approval"], false);
  const admin = lodashGet(followsObj, ["admin"], false);
  const follow = lodashGet(followsObj, ["follow"], false);
  const followedCount = lodashGet(followsObj, ["followedCount"], 0);
  const followApproval = lodashGet(followsObj, ["followApproval"], false);
  const followBlocked = lodashGet(followsObj, ["followBlocked"], false);

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/follow/v2/components/follow-button.js
  // `);

  // console.log(chalk`
  //   login: {green ${login}}
  //   lodashHas(loginUsersObj, ['_id']): {green ${lodashHas(loginUsersObj, ['_id'])}}
  // `);

  // console.log(`
  //   ----- loginUsersObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(loginUsersObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- followsObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(followsObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // ---------------------------------------------
  //   - ??????????????????????????????????????????????????????????????????????????????????????????????????????
  // ---------------------------------------------

  if (admin || followBlocked) {
    return null;
  }

  // --------------------------------------------------
  //   Component - Button
  // --------------------------------------------------

  let component = "";
  const size = type === "header" ? "small" : "medium";

  // ---------------------------------------------
  //   - Game Community
  // ---------------------------------------------

  if (gameCommunities_id) {
    // ---------------------------------------------
    //   - ?????????????????????????????????
    // ---------------------------------------------

    if (!login) {
      component = (
        <Link href="/login">
          <a className="link">
            <Button variant="contained" color="secondary" size={size}>
              ??????????????????
            </Button>
          </a>
        </Link>
      );
    }

    // ---------------------------------------------
    //   - ?????????????????????????????????????????????????????????
    // ---------------------------------------------

    if (login && !follow) {
      component = (
        <Button
          variant="contained"
          color="secondary"
          size={size}
          disabled={buttonDisabled}
          onClick={() =>
            handleFollow({
              type: "followGc",
              gameCommunities_id,
            })
          }
        >
          ??????????????????
        </Button>
      );
    }

    // ---------------------------------------------
    //   - ??????????????????????????????????????????????????????
    // ---------------------------------------------

    if (login && follow) {
      component = (
        <Button
          variant="contained"
          color="primary"
          size={size}
          disabled={buttonDisabled}
          onClick={() =>
            handleDialogOpen({
              title: "??????????????????",
              description: "????????????????????????????????????",
              handle: handleFollow,
              argumentsObj: {
                type: "unfollowGc",
                gameCommunities_id,
              },
            })
          }
        >
          ???????????????
        </Button>
      );
    }

    // ---------------------------------------------
    //   - User Community
    // ---------------------------------------------
  } else if (userCommunities_id) {
    // ---------------------------------------------
    //   - ?????????????????????????????????
    // ---------------------------------------------

    if (!login) {
      component = (
        <Link href="/login">
          <a className="link">
            <Button variant="contained" color="secondary" size={size}>
              ????????????
            </Button>
          </a>
        </Link>
      );
    }

    // ---------------------------------------------
    //   - ???????????????????????????????????????????????????
    // ---------------------------------------------

    if (login && !follow) {
      // ---------------------------------------------
      //   - ?????????
      // ---------------------------------------------

      if (approval) {
        component = (
          <Button
            variant="contained"
            color="secondary"
            size={size}
            disabled={buttonDisabled}
            onClick={() =>
              handleFollow({
                type: "followApprovalUc",
                userCommunities_id,
              })
            }
          >
            ??????????????????
          </Button>
        );

        // ---------------------------------------------
        //   - ????????????????????????
        // ---------------------------------------------
      } else {
        component = (
          <Button
            variant="contained"
            color="secondary"
            size={size}
            disabled={buttonDisabled}
            onClick={() =>
              handleFollow({
                type: "followUc",
                userCommunities_id,
              })
            }
          >
            ????????????
          </Button>
        );
      }
    }

    // ---------------------------------------------
    //   - ???????????????????????????????????????????????????
    // ---------------------------------------------

    if (login && follow) {
      component = (
        <Button
          variant="contained"
          color="primary"
          size={size}
          disabled={buttonDisabled}
          onClick={() =>
            handleDialogOpen({
              title: "???????????????????????????",
              description: "?????????????????????????????????????????????",
              handle: handleFollow,
              argumentsObj: {
                type: "unfollowUc",
                userCommunities_id,
              },
            })
          }
        >
          ????????????
        </Button>
      );
    }

    // ---------------------------------------------
    //   - ???????????????????????????
    // ---------------------------------------------

    if (followApproval) {
      component = (
        <Button
          variant="contained"
          color="primary"
          size={size}
          disabled={buttonDisabled}
          onClick={() =>
            handleDialogOpen({
              title: "???????????????????????????",
              description: "???????????????????????????????????????",
              handle: handleFollow,
              argumentsObj: {
                type: "unfollowApprovalUc",
                userCommunities_id,
              },
            })
          }
        >
          ??????????????????????????????
        </Button>
      );
    }

    // ---------------------------------------------
    //   - User
    // ---------------------------------------------
  } else if (users_id) {
    // ---------------------------------------------
    //   - ?????????????????????????????????
    // ---------------------------------------------

    if (!login) {
      component = (
        <Link href="/login">
          <a className="link">
            <Button variant="contained" color="secondary" size={size}>
              ??????????????????
            </Button>
          </a>
        </Link>
      );
    }

    // ---------------------------------------------
    //   - ?????????????????????????????????????????????????????????
    // ---------------------------------------------

    if (login && !follow) {
      // ---------------------------------------------
      //   - ?????????
      // ---------------------------------------------

      if (approval) {
        component = (
          <Button
            variant="contained"
            color="secondary"
            size={size}
            disabled={buttonDisabled}
            onClick={() =>
              handleFollow({
                type: "followApproval",
                users_id,
              })
            }
          >
            ???????????????????????????
          </Button>
        );

        // ---------------------------------------------
        //   - ??????????????????????????????
        // ---------------------------------------------
      } else {
        component = (
          <Button
            variant="contained"
            color="secondary"
            size={size}
            disabled={buttonDisabled}
            onClick={() =>
              handleFollow({
                type: "follow",
                users_id,
              })
            }
          >
            ??????????????????
          </Button>
        );
      }
    }

    // ---------------------------------------------
    //   - ?????????????????????????????????????????????????????????
    // ---------------------------------------------

    if (login && follow) {
      component = (
        <Button
          variant="contained"
          color="primary"
          size={size}
          disabled={buttonDisabled}
          onClick={() =>
            handleDialogOpen({
              title: "?????????????????????",
              description: "????????????????????????????????????",
              handle: handleFollow,
              argumentsObj: {
                type: "unfollow",
                users_id,
              },
            })
          }
        >
          ???????????????
        </Button>
      );
    }

    // ---------------------------------------------
    //   - ???????????????????????????
    // ---------------------------------------------

    if (followApproval) {
      component = (
        <Button
          variant="contained"
          color="primary"
          size={size}
          disabled={buttonDisabled}
          onClick={() =>
            handleDialogOpen({
              title: "?????????????????????????????????",
              description: "?????????????????????????????????????????????",
              handle: handleFollow,
              argumentsObj: {
                type: "unfollowApproval",
                users_id,
              },
            })
          }
        >
          ????????????????????????????????????
        </Button>
      );
    }
  }

  // --------------------------------------------------
  //   Component - Number of People
  // --------------------------------------------------

  const componentNumberOfPeople = (
    <div
      css={css`
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        margin: 0 0 0 10px;
      `}
    >
      <IconPermIdentity
        css={css`
          font-size: 24px;
          padding: 0;
        `}
      />
      {followedCount} ???
    </div>
  );
  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/follow/v2/follow-button.js
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
    <div
      css={css`
        ${type === "header" &&
        `
            border-top: 1px dashed #A4A4A4;
            margin: 12px 12px 4px;
            padding: 12px 0 0 0;
          `}
        ${type === "cardPlayer" &&
        `
            border-top: 1px dashed #A4A4A4;
            margin: 24px 0 0 0;
            padding: 24px 0 0 0;
          `}
      `}
    >
      {/* Button */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          align-items: center;
        `}
      >
        {component}

        {componentNumberOfPeople}
      </div>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

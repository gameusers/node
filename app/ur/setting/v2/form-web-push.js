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

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";

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

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";
import WebPuchCheckbox from "app/common/web-push/v2/checkbox.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [webPushAvailable, setWebPushAvailable] = useState(
    lodashGet(props, ["webPushAvailable"], false)
  );
  const [webPushSubscriptionObj, setWebPushSubscriptionObj] = useState({});

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    setHeaderObj,
    handleLoadingOpen,
    handleLoadingClose,
    handleScrollTo,
  } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * ???????????????????????????
   * @param {Object} eventObj - ????????????
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   ?????????????????????????????????
    // ---------------------------------------------

    eventObj.preventDefault();

    try {
      // console.log(chalk`
      //   webPushAvailable: {green ${webPushAvailable}}
      // `);

      // console.log(`
      //   ----- webPushSubscriptionObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(webPushSubscriptionObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   ????????????????????????????????????
      //   ???????????????????????????????????????????????????????????????????????????
      //   ??????????????????????????????????????????????????????
      // ---------------------------------------------

      if (
        webPushAvailable &&
        Object.keys(webPushSubscriptionObj).length === 0
      ) {
        showSnackbar({
          enqueueSnackbar,
          intl,
          arr: [
            {
              variant: "success",
              messageID: "etyRC_hg3",
            },
          ],
        });

        return;
      }

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
        subscriptionObj: webPushSubscriptionObj,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      let resultObj = {};

      if (webPushAvailable) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/users/upsert-setting-web-push`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      } else {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/users/delete-setting-web-push`,
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
      //   webPushSubscriptionObj ???????????????
      // ---------------------------------------------

      setWebPushSubscriptionObj({});

      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Update - Header
      // ---------------------------------------------

      const headerObj = lodashGet(resultObj, ["data", "headerObj"], {});

      if (Object.keys(headerObj).length !== 0) {
        setHeaderObj(headerObj);
      }

      // ---------------------------------------------
      //   Push?????? & Snackbar
      //   ??????????????????????????????????????????Snackbar???????????????
      // ---------------------------------------------

      if (webPushAvailable) {
        showSnackbar({
          enqueueSnackbar,
          intl,
          experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
        });

        // ---------------------------------------------
        //   Snackbar
        //   ?????????????????????????????????Snackbar?????????????????????
        // ---------------------------------------------
      } else {
        showSnackbar({
          enqueueSnackbar,
          intl,
          experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
          arr: [
            {
              variant: "success",
              messageID: "lJRp1gpPT",
            },
          ],
        });
      }

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/ur/setting/v2/form-account.js / handleSubmit
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
    } catch (errorObj) {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

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
      //   Scroll
      // ---------------------------------------------

      handleScrollTo({
        to: "elementFormWebPush",
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

      // ---------------------------------------------
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/ur/setting/v2/form-web-push.js
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
  //   Return
  // --------------------------------------------------

  return (
    <Element
      css={css`
        margin: 14px 0 0 0;
      `}
      name="elementFormWebPush"
    >
      <Panel heading="???????????????????????????" defaultExpanded={false}>
        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ????????????????????????????????????????????????????????????????????????????????????
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ??????????????????????????????????????????????????????????????????????????????PC????????????????????????????????????????????????????????????????????????????????????
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ???????????????????????????????????????????????????????????????
          Chrome???Edge???Firefox???Opera ?????????
          <span
            css={css`
              color: red;
            `}
          >
            ??? iOS / Mac OS??????????????????????????????
          </span>
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ?????????Game
          Users??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        </p>

        <p
          css={css`
            color: red;
          `}
        >
          ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        </p>

        {/* ???????????? */}
        <form
          name="formWebPush"
          onSubmit={(eventObj) =>
            handleSubmit({
              eventObj,
            })
          }
        >
          {/* ?????????????????? */}
          <div
            css={css`
              margin: 12px 0 0 0;
            `}
          >
            <WebPuchCheckbox
              webPushAvailable={webPushAvailable}
              setWebPushAvailable={setWebPushAvailable}
              webPushSubscriptionObj={webPushSubscriptionObj}
              setWebPushSubscriptionObj={setWebPushSubscriptionObj}
            />
          </div>

          {/* Submit Button */}
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              border-top: 1px dashed #848484;
              margin: 24px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={buttonDisabled}
            >
              ????????????
            </Button>
          </div>
        </form>
      </Panel>
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

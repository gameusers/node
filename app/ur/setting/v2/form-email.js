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
//   Validations
// ---------------------------------------------

import { validationUsersEmail } from "app/@database/users/validations/email.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

import FormEmail from "app/common/form/v2/email.js";

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

  const [email, setEmail] = useState(lodashGet(props, ["email"], ""));
  const [emailConfirmation, setEmailConfirmation] = useState(
    lodashGet(props, ["emailConfirmation"], false)
  );

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    handleDialogOpen,
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
      // ---------------------------------------------
      //   Validations
      // ---------------------------------------------

      if (validationUsersEmail({ required: true, value: email }).error) {
        throw new CustomError({
          errorsArr: [{ code: "6cFcqgVgL", messageID: "uwHIKBy7c" }],
        });
      }

      // ---------------------------------------------
      //   ???????????????????????????????????????????????????????????????
      // ---------------------------------------------

      if (
        email &&
        emailCurrent &&
        email === emailCurrent &&
        emailConfirmation
      ) {
        showSnackbar({
          enqueueSnackbar,
          intl,
          arr: [
            {
              variant: "warning",
              messageID: "DQrBNlhe4",
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
        email,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/users/upsert-setting-email`,
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
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Snackbar: Success
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "CquCU7BtA",
          },
        ],
      });

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
        to: "elementFormEmail",
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

  /**
   * ????????????????????????????????????
   */
  const handleDelete = async () => {
    try {
      // ---------------------------------------------
      //   ????????????????????????????????????????????????????????????????????????
      // ---------------------------------------------

      if (!emailCurrent) {
        showSnackbar({
          enqueueSnackbar,
          intl,
          arr: [
            {
              variant: "warning",
              messageID: "a107F1Uxw",
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

      const formDataObj = {};

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/users/delete-setting-email`,
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
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // --------------------------------------------------
      //   Reset Form
      // --------------------------------------------------

      setEmail("");
      setEmailConfirmation(false);

      // ---------------------------------------------
      //   Snackbar: Success
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "hbRy4HpaP",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/ur/setting/v2/form-email.js / handleDelete
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
        to: "elementFormEmail",
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
  //   Property
  // --------------------------------------------------

  const emailCurrent = lodashGet(props, ["email"], "");

  // --------------------------------------------------
  //   Component - Confirmation
  // --------------------------------------------------

  let componentConfirmation = "";

  if (email) {
    if (emailConfirmation && emailCurrent === email) {
      componentConfirmation = (
        <span
          css={css`
            color: green;
          `}
        >
          ????????????????????????????????????????????????
        </span>
      );
    } else {
      componentConfirmation = (
        <span
          css={css`
            color: red;
          `}
        >
          ???????????????????????????????????????????????????
        </span>
      );
    }
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
  //   Return
  // --------------------------------------------------

  return (
    <Element
      css={css`
        margin: 14px 0 0 0;
      `}
      name="elementFormEmail"
    >
      <Panel heading="???????????????????????????" defaultExpanded={false}>
        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????24????????????????????????????????????URL?????????????????????????????????????????????????????????24?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        </p>

        <p>
          ???????????? confirmation@gameusers.org
          ???????????????????????????????????????????????????????????????????????????????????????
          @gameusers.org ??????????????????????????????????????????????????????
        </p>

        {/* ???????????? */}
        <form
          name="formEmail"
          onSubmit={(eventObj) =>
            handleSubmit({
              eventObj,
            })
          }
        >
          {/* E-Mail Address */}
          <div
            css={css`
              border-top: 1px dashed #848484;
              margin: 36px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >
            <FormEmail email={email} setEmail={setEmail} />

            <div
              css={css`
                margin: 0 0 0 0;
              `}
            >
              {componentConfirmation}
            </div>
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
              ????????????????????????
            </Button>

            <div
              css={css`
                margin: 0 0 0 auto;
              `}
            >
              <Button
                variant="contained"
                color="secondary"
                disabled={buttonDisabled}
                onClick={() =>
                  handleDialogOpen({
                    title: "???????????????????????????",
                    description: "?????????????????????????????????????????????",
                    handle: handleDelete,
                    argumentsObj: {},
                  })
                }
              >
                ????????????
              </Button>
            </div>
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

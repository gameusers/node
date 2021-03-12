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
import TextField from "@material-ui/core/TextField";

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

import { validationUsersUserID } from "app/@database/users/validations/user-id.js";
import { validationUsersLoginID } from "app/@database/users/validations/login-id.js";
import { validationUsersLoginPassword } from "app/@database/users/validations/login-password.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

import FormLoginID from "app/common/form/v2/login-id.js";
import FormLoginPassword from "app/common/form/v2/login-password.js";

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

  const [userID, setUserID] = useState("");
  const [loginID, setLoginID] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

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
  } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 送信する
   */
  const handleSubmit = async () => {
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
      //   Validation
      // ---------------------------------------------

      if (
        validationUsersUserID({ value: userID }).error ||
        validationUsersLoginID({ required: true, value: loginID }).error ||
        validationUsersLoginPassword({
          required: true,
          value: loginPassword,
          loginID,
        }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "lTrdInwGA", messageID: "uwHIKBy7c" }],
        });
      }

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        userID,
        loginID,
        loginPassword,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/administration/login`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // ---------------------------------------------
      //   Form Reset
      // ---------------------------------------------

      setUserID("");
      setLoginID("");
      setLoginPassword("");

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "EnStWOly-",
          },
        ],
      });
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
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/administration/index/v2/form-login.js
  // `);

  // console.log(`
  //   ----- validationUsersLoginIDObj -----\n
  //   ${util.inspect(validationUsersLoginIDObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- validationUsersLoginPasswordObj -----\n
  //   ${util.inspect(validationUsersLoginPasswordObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   recaptchaRef: {green ${recaptchaRef}}
  // `);

  // console.log(chalk`
  //   process.env.NEXT_PUBLIC_VERIFY_RECAPTCHA: {green ${process.env.NEXT_PUBLIC_VERIFY_RECAPTCHA} / ${typeof process.env.NEXT_PUBLIC_VERIFY_RECAPTCHA}}
  //   process.env.NEXT_PUBLIC_VERIFY_RECAPTCHA === '0': {green ${process.env.NEXT_PUBLIC_VERIFY_RECAPTCHA === '0'}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Panel heading="ログインID & パスワード変更" defaultExpanded={true}>
      <p>ユーザーのログインIDとパスワードを変更します。</p>

      {/* userID */}
      <TextField
        css={css`
          && {
            width: 300px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id="userID"
        type="text"
        margin="normal"
        label="userID / userIDInitial"
        value={userID}
        onChange={(eventObj) => setUserID(eventObj.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* Login ID */}
      <FormLoginID loginID={loginID} setLoginID={setLoginID} />

      {/* Login Password */}
      <FormLoginPassword
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginID={loginID}
        strength={true}
        confirmation={false}
      />

      {/* Submit Button */}
      <div
        css={css`
          margin: 24px 0 0 0;
        `}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={buttonDisabled}
          onClick={() =>
            handleDialogOpen({
              title: "Login ID & Password",
              description: "変更しますか？",
              handle: handleSubmit,
              argumentsObj: {},
            })
          }
        >
          変更する
        </Button>
      </div>
    </Panel>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

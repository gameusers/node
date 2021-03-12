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
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

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

import { validationUsersLoginID } from "app/@database/users/validations/login-id.js";
import { validationUsersEmail } from "app/@database/users/validations/email.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

import FormLoginID from "app/common/form/v2/login-id.js";
import FormEmail from "app/common/form/v2/email.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Form Component
 */
const FormComponent = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [loginID, setLoginID] = useState(lodashGet(props, ["loginID"], ""));
  const [email, setEmail] = useState(lodashGet(props, ["email"], ""));

  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { handleLoadingOpen, handleLoadingClose, handleScrollTo } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * フォームを送信する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
    // ---------------------------------------------

    eventObj.preventDefault();

    try {
      // ---------------------------------------------
      //   Validations
      // ---------------------------------------------

      if (
        validationUsersLoginID({ required: true, value: loginID }).error ||
        validationUsersEmail({ required: true, value: email }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "cOnTqvz3z", messageID: "uwHIKBy7c" }],
        });
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
      //   executeRecaptcha
      // ---------------------------------------------

      let response = "";

      if (process.env.NEXT_PUBLIC_VERIFY_RECAPTCHA === "1") {
        response = await executeRecaptcha("loginResetPassword");
      }

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        loginID,
        email,
        response,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/email-confirmations/upsert-reset-password`,
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
      //   Reset Form
      // ---------------------------------------------

      setLoginID("");
      setEmail("");

      // ---------------------------------------------
      //   Snackbar: Success
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "WTynPDVob",
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
        to: "elementFormResetPassword",
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
  //   /app/login/reset-password/v2/form-reset-password.js
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
    <Element name="elementFormResetPassword">
      <Panel heading="パスワード再設定" defaultExpanded={true}>
        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          パスワードを忘れた場合、こちらのフォームを利用してパスワードの再設定を行うことができます。
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ログインIDとアカウントに登録済みのメールアドレスを入力して「パスワードを再設定する」ボタンを押してください。パスワードを再設定する方法が記載されたメールが届きます。30分以内にメールを受信してパスワードの再設定を行ってください。
        </p>

        <p
          css={css`
            color: red;
          `}
        >
          ※
          お持ちのアカウントにメールアドレスを登録していない方は、こちらのページからパスワードの再設定を行うことはできません。Game
          Users 運営にご連絡ください。
        </p>

        {/* フォーム */}
        <form
          name="formResetPassword"
          onSubmit={(eventObj) =>
            handleSubmit({
              eventObj,
            })
          }
        >
          <div
            css={css`
              border-top: 1px dashed #848484;
              margin: 36px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >
            {/* Login ID */}
            <FormLoginID loginID={loginID} setLoginID={setLoginID} />

            {/* Email */}
            <FormEmail email={email} setEmail={setEmail} />
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
              送信する
            </Button>
          </div>
        </form>
      </Panel>
    </Element>
  );
};

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   reCAPTCHA で検証する場合
  // --------------------------------------------------

  if (process.env.NEXT_PUBLIC_VERIFY_RECAPTCHA === "1") {
    return (
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      >
        <FormComponent {...props} />
      </GoogleReCaptchaProvider>
    );
  }

  // --------------------------------------------------
  //   reCAPTCHA で検証しない場合
  // --------------------------------------------------

  return <FormComponent {...props} />;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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
import { useSnackbar } from "notistack";
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
 * Form Component
 */
const FormComponent = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { recentAccessPageUrl } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [loginID, setLoginID] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { handleLoadingOpen, handleLoadingClose } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * ログインフォームを送信する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    try {
      // ---------------------------------------------
      //   フォームの送信処理停止
      // ---------------------------------------------

      eventObj.preventDefault();

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(chalk`
      // loginID: {green ${loginID}}
      // loginPassword: {green ${loginPassword}}
      // recaptchaResponse: {green ${recaptchaResponse}}
      // `);

      // ---------------------------------------------
      //   Validation
      // ---------------------------------------------

      const validationUsersLoginIDObj = validationUsersLoginID({
        required: true,
        value: loginID,
      });
      const validationUsersLoginPasswordObj = validationUsersLoginPassword({
        required: true,
        value: loginPassword,
        loginID,
      });

      if (
        validationUsersLoginIDObj.error ||
        validationUsersLoginPasswordObj.error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "0oSjjQhm3", messageID: "uwHIKBy7c" }],
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
        response = await executeRecaptcha("login");
      }

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formData = new FormData();

      formData.append("loginID", loginID);
      formData.append("loginPassword", loginPassword);
      formData.append("response", response);

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v1/login/login`,
        methodType: "POST",
        formData,
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
            messageID: "5Gf730Gmz",
          },
        ],
      });

      // ---------------------------------------------
      //   Router.push = History API pushState()
      // ---------------------------------------------

      let url = recentAccessPageUrl;

      // console.log(chalk`
      //   url: {green ${url}}
      // `);

      if (!url) {
        const userID = lodashGet(resultObj, ["data", "userID"], "");
        url = `/ur/${userID}`;
      }

      Router.push(url);
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
  //   /app/login/index/components/form-login.js
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
    <Panel heading="ログイン - ID & パスワード" defaultExpanded={true}>
      <p
        css={css`
          margin: 0 0 14px 0;
        `}
      >
        IDとパスワードでログインします。アカウントをお持ちでない場合は、
        <Link href="/login/account">
          <a>こちらのページ</a>
        </Link>
        でアカウントを作成してください。
      </p>

      <p
        css={css`
          color: red;
          margin: 0 0 14px 0;
        `}
      >
        Game
        Usersはリニューアルしました。旧サイトのアカウントを新サイトで利用するには、
        <Link href="/inquiry/account">
          <a>アカウント移行フォーム</a>
        </Link>
        で移行の手続きをする必要があります。
      </p>

      <p
        css={css`
          margin: 0 0 14px 0;
        `}
      >
        リニューアル後、称号を利用できる新たな機能が追加されています。リニューアル前から利用してくれているユーザーのみもらえる特別な称号がありますので、ぜひ旧アカウントを移行して利用してください。
      </p>

      {/* Form */}
      <form
        onSubmit={(eventObj) =>
          handleSubmit({
            eventObj,
          })
        }
      >
        {/* Login ID */}
        <FormLoginID loginID={loginID} setLoginID={setLoginID} />

        {/* Login Password */}
        <FormLoginPassword
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginID={loginID}
          strength={false}
          confirmation={false}
        />

        <p
          css={css`
            font-size: 12px;
            margin: 6px 0 30px 0;
          `}
        >
          <Link href="/login/reset-password">
            <a>パスワードを忘れた方はこちら</a>
          </Link>
        </p>

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
          >
            ログイン
          </Button>
        </div>
      </form>
    </Panel>
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

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
import {
  validationUsersLoginPassword,
  validationUsersLoginPasswordConfirmation,
} from "app/@database/users/validations/login-password.js";
import { validationUsersEmail } from "app/@database/users/validations/email.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

import FormLoginID from "app/common/form/v2/login-id.js";
import FormLoginPassword from "app/common/form/v2/login-password.js";
import FormEmail from "app/common/form/v2/email.js";
import TermsOfService from "app/common/form/v2/terms-of-service.js";

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
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordConfirmation, setLoginPasswordConfirmation] = useState(
    ""
  );
  const [email, setEmail] = useState(lodashGet(props, ["email"], ""));
  const [agreeTermsOfService, setAgreeTermsOfService] = useState(false);

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
        validationUsersLoginPassword({
          required: true,
          value: loginPassword,
          loginID,
        }).error ||
        validationUsersLoginPasswordConfirmation({
          required: true,
          value: loginPasswordConfirmation,
          loginPassword,
        }).error ||
        validationUsersEmail({ value: email }).error ||
        agreeTermsOfService === false
      ) {
        throw new CustomError({
          errorsArr: [{ code: "MxNRxHj8G", messageID: "uwHIKBy7c" }],
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
        response = await executeRecaptcha("accountCreate");
      }

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        loginID,
        loginPassword,
        email,
        response,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/users/upsert-create-account`,
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
      setLoginPassword("");
      setLoginPasswordConfirmation("");
      setEmail("");
      setAgreeTermsOfService(false);

      // ---------------------------------------------
      //   Snackbar: Success
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "Jje25z6lV",
          },
        ],
      });

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formData = new FormData();

      formData.append("loginID", loginID);
      formData.append("loginPassword", loginPassword);
      formData.append("response", response);

      // ---------------------------------------------
      //   Fetch - Login
      // ---------------------------------------------

      const resultLoginObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v1/login/login`,
        methodType: "POST",
        formData,
      });

      // console.log(`
      //   ----- resultLoginObj -----\n
      //   ${util.inspect(resultLoginObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Router.push = History API pushState()
      // ---------------------------------------------

      if (resultLoginObj.data) {
        const userID = lodashGet(resultLoginObj, ["data", "userID"], "");

        Router.push(`/ur/${userID}`);
      }

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/ur/setting/v2/form-account.js / handleSubmit
      // `);

      // console.log(chalk`
      // recaptchaResponse: {green ${recaptchaResponse}}
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
        to: "elementFormAccountCreate",
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
    <Element name="elementFormAccountCreate">
      <Panel heading="アカウント作成" defaultExpanded={true}>
        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          アカウントを作成します。ログインIDとパスワードを入力してください。
        </p>

        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          IDとパスワードに利用できる文字は、半角英数字とハイフン( -
          )アンダースコア( _ )です。※
          IDは6文字以上、32文字以内。パスワードは8文字以上、32文字以内。
        </p>

        <p
          css={css`
            margin: 0 0 16px 0;
          `}
        >
          メールアドレスの登録は必須ではありませんが、登録しておくとパスワードを忘れたときに、メールを利用してパスワードを登録しなおせるようになります。ID、パスワード、メールアドレスはアカウント作成後に変更することが可能です。
        </p>

        {/* フォーム */}
        <form
          name="formAccountCreate"
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

            {/* Login Password */}
            <FormLoginPassword
              loginPassword={loginPassword}
              setLoginPassword={setLoginPassword}
              loginPasswordConfirmation={loginPasswordConfirmation}
              setLoginPasswordConfirmation={setLoginPasswordConfirmation}
              loginID={loginID}
              strength={true}
              confirmation={true}
            />

            {/* E-Mail */}
            <FormEmail email={email} setEmail={setEmail} />

            {/* Terms of Service */}
            <TermsOfService
              agreeTermsOfService={agreeTermsOfService}
              setAgreeTermsOfService={setAgreeTermsOfService}
              checkAgreedVersion={false}
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

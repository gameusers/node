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
import TextareaAutosize from "react-autosize-textarea";

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

import { validationHandleName } from "app/@validations/name.js";
import { validationComment } from "app/@validations/comment.js";
import { validationUsersEmail } from "app/@database/users/validations/email.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

import FormName from "app/common/form/v2/name.js";
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState(lodashGet(props, ["email"], ""));
  const [url, setURL] = useState("");
  const [loginID, setLoginID] = useState("");
  const [social, setSocial] = useState("");
  const [provider, setProvider] = useState("");
  const [device, setDevice] = useState("");
  const [browser, setBrowser] = useState("");

  const [comment, setComment] = useState("");

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
        validationHandleName({ required: true, value: name }).error ||
        validationUsersEmail({ required: true, value: email }).error ||
        validationComment({ required: true, value: comment }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "Sh6Vg7TDB", messageID: "uwHIKBy7c" }],
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
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        name,
        email,
        url,
        loginID,
        social,
        provider,
        device,
        browser,
        comment,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/inquiry/form/account`,
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

      setName("");
      setEmail("");
      setURL("");
      setLoginID("");
      setSocial("");
      setProvider("");
      setDevice("");
      setBrowser("");
      setComment("");

      // ---------------------------------------------
      //   Snackbar: Success
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "dusYj_Gh3",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/inquiry/form/v2/form-inquiry.js / handleSubmit
      // `);

      // console.log(chalk`
      //   name: {green ${name}}
      //   email: {green ${email}}
      //   comment: {green ${comment}}
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
        to: "elementFormAccount",
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
    <Element name="elementFormAccount">
      <Panel heading="アカウント移行フォーム" defaultExpanded={true}>
        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          Game Users
          は先日リニューアルを行いました。リニューアル前のアカウントを利用するには、こちらのフォームに必要な情報を入力して送信する必要があります。
        </p>

        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          リニューアル後、称号を利用できる新たな機能が追加されています。リニューアル前から利用してくれているユーザーのみもらえる特別な称号がありますので、多少手間はかかりますが、ぜひ旧アカウントを移行して利用してください。
        </p>

        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          運営側の移行作業が終わると連絡先のメールアドレスに、ログインに必要な情報を記載したメールを送らせてもらいますので、メールアドレスは必ず入力してください。
        </p>

        <p
          css={css`
            margin: 0 0 28px 0;
          `}
        >
          わからない欄は未記入にしてください。ソーシャルサイトのアカウントを用いたログインは現在利用できなくなっています。以前ログインに利用していたソーシャルサイトがあった場合は、そのサービス名を記入してください。最後のコメント欄はそのユーザーを使用していたことを証明できるような情報があれば記載してください。
        </p>

        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          <span style={{ fontWeight: "bold" }}>記入例）</span>
          <br />
          ユーザーページのURL：https://gameusers.org/ur/az1979
          <br />
          ログインID：login-id
          <br />
          ソーシャルログイン：Twitter
          <br />
          プロバイダー：OCN
          <br />
          端末：iPhone
          <br />
          ブラウザ：Safari
          <br />
          コメント：5年くらい前にアカウントを作成した記憶があります。
          <br />
          ARK: Survival Evolvedの募集によく投稿していました。
        </p>

        {/* フォーム */}
        <form
          name="formInquiry"
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
            {/* Name */}
            <FormName name={name} setName={setName} />

            {/* E-Mail */}
            <FormEmail email={email} setEmail={setEmail} />

            {/* ユーザーページのURL */}
            <TextField
              css={css`
                && {
                  width: 100%;
                }
              `}
              id="url"
              label="ユーザーページのURL"
              value={url}
              onChange={(eventObj) => setURL(eventObj.target.value)}
              helperText={"記入例）https://gameusers.org/ur/az1979"}
              margin="normal"
              inputProps={{
                maxLength: 500,
              }}
            />

            {/* ログインID */}
            <TextField
              css={css`
                && {
                  width: 100%;
                }
              `}
              id="loginID"
              label="ログインID"
              value={loginID}
              onChange={(eventObj) => setLoginID(eventObj.target.value)}
              helperText={"記入例）login-id"}
              margin="normal"
              inputProps={{
                maxLength: 500,
              }}
            />

            {/* ソーシャルログイン */}
            <TextField
              css={css`
                && {
                  width: 100%;
                }
              `}
              id="social"
              label="ソーシャルログイン"
              value={social}
              onChange={(eventObj) => setSocial(eventObj.target.value)}
              helperText={"記入例）Twitter / Yahoo"}
              margin="normal"
              inputProps={{
                maxLength: 500,
              }}
            />

            {/* プロバイダー */}
            <TextField
              css={css`
                && {
                  width: 100%;
                }
              `}
              id="provider"
              label="プロバイダー"
              value={provider}
              onChange={(eventObj) => setProvider(eventObj.target.value)}
              helperText={"記入例）OCN / So-net"}
              margin="normal"
              inputProps={{
                maxLength: 500,
              }}
            />

            {/* 端末 */}
            <TextField
              css={css`
                && {
                  width: 100%;
                }
              `}
              id="device"
              label="端末"
              value={device}
              onChange={(eventObj) => setDevice(eventObj.target.value)}
              helperText={"記入例）PC / iPhone / Android"}
              margin="normal"
              inputProps={{
                maxLength: 500,
              }}
            />

            {/* ブラウザ */}
            <TextField
              css={css`
                && {
                  width: 100%;
                }
              `}
              id="browser"
              label="ブラウザ"
              value={browser}
              onChange={(eventObj) => setBrowser(eventObj.target.value)}
              helperText={"記入例）Chrome / Safari"}
              margin="normal"
              inputProps={{
                maxLength: 500,
              }}
            />

            {/* Comment */}
            <div
              css={css`
                margin: 24px 0 0 0;
              `}
            >
              <TextareaAutosize
                css={css`
                  && {
                    width: 100%;
                    border-radius: 4px;
                    box-sizing: border-box;
                    padding: 8px 12px;
                    line-height: 1.8;

                    &:focus {
                      outline: 1px #a9f5f2 solid;
                    }

                    resize: none;
                  }
                `}
                rows={5}
                placeholder="コメント"
                value={comment}
                onChange={(eventObj) => setComment(eventObj.target.value)}
                maxLength={3000}
                disabled={buttonDisabled}
              />
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
              送信する
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

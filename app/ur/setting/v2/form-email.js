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

      if (validationUsersEmail({ required: true, value: email }).error) {
        throw new CustomError({
          errorsArr: [{ code: "6cFcqgVgL", messageID: "uwHIKBy7c" }],
        });
      }

      // ---------------------------------------------
      //   メールアドレスが確認済みの場合、送信しない
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
   * メールアドレスを削除する
   */
  const handleDelete = async () => {
    try {
      // ---------------------------------------------
      //   メールアドレスが登録されていない場合、送信しない
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
          このメールアドレスは確認済みです
        </span>
      );
    } else {
      componentConfirmation = (
        <span
          css={css`
            color: red;
          `}
        >
          このメールアドレスは確認が必要です
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
      <Panel heading="メールアドレス登録" defaultExpanded={false}>
        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          メールアドレスを登録しておくとパスワードを忘れたときに、メールを利用してパスワードを再設定できるようになります。
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          メールアドレスを入力して「確認メールを送信」ボタンを押すと、入力したメールアドレスに確認メールが届きます。24時間以内に表示されているURLにアクセスして登録を完了してください。24時間以内にアクセスできなかった場合は、再度ボタンを押してください。もう一度、確認メールが送信されます。
        </p>

        <p>
          メールは confirmation@gameusers.org
          こちらのアドレスから届きます。ドメイン指定をされている方は
          @gameusers.org を受信できるように設定してください。
        </p>

        {/* フォーム */}
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
              確認メールを送信
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
                    title: "メールアドレス削除",
                    description: "メールアドレスを削除しますか？",
                    handle: handleDelete,
                    argumentsObj: {},
                  })
                }
              >
                削除する
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

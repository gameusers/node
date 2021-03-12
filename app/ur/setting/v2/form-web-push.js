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
   * フォームを送信する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
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
      //   すでに許可されている場合
      //   許可をしてページをリロードした場合、この状態になる
      //   何度もプッシュ通知を送信しないために
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
      //   webPushSubscriptionObj を空にする
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
      //   Push通知 & Snackbar
      //   許可した場合、プッシュ通知とSnackbarで通知する
      // ---------------------------------------------

      if (webPushAvailable) {
        showSnackbar({
          enqueueSnackbar,
          intl,
          experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
        });

        // ---------------------------------------------
        //   Snackbar
        //   許可を取り消した場合、Snackbarだけで通知する
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
      <Panel heading="プッシュ通知の許可" defaultExpanded={false}>
        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ブラウザで通知を受け取れるプッシュ通知の設定を行えます。
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          通知を受けたいデバイス（スマートフォン、タブレット、PCなど）で、このページにアクセスして設定を行ってください。
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          プッシュ通知に対応しているブラウザは最新の
          Chrome、Edge、Firefox、Opera です。
          <span
            css={css`
              color: red;
            `}
          >
            ※ iOS / Mac OSでは利用できません。
          </span>
        </p>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          過去にGame
          Usersからのプッシュ通知をブロックしたことがある方は、ブロックを解除しなければ通知を受けることができません。通知を受け取りたい場合は、ご使用のブラウザのブロック解除方法を調べて実行してください。
        </p>

        <p
          css={css`
            color: red;
          `}
        >
          初めて設定を行う場合、チェックボックスをチェックしたときに通知の許可を求めるダイアログが出てきます。まずそこで許可を選択してください。それから「送信する」ボタンを忘れずに押してください。
        </p>

        {/* フォーム */}
        <form
          name="formWebPush"
          onSubmit={(eventObj) =>
            handleSubmit({
              eventObj,
            })
          }
        >
          {/* プッシュ通知 */}
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

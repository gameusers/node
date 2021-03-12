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

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { showSnackbar } from "app/@modules/snackbar.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    webPushAvailable,
    setWebPushAvailable,
    setWebPushSubscriptionObj,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    // --------------------------------------------------
    //   iOS & Mac OS はプッシュ通知が使えないのでチェックボックスは常に利用できない状態にする
    // --------------------------------------------------

    const userAgent = window.navigator.userAgent;
    // const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1';

    // console.log(chalk`
    //   userAgent: {green ${userAgent}}
    //   userAgent.indexOf('iPhone'): {green ${userAgent.indexOf('iPhone')}}
    //   userAgent.indexOf('iPad'): {green ${userAgent.indexOf('iPad')}}
    //   userAgent.indexOf('Mac OS'): {green ${userAgent.indexOf('Mac OS')}}
    // `);

    if (
      userAgent.indexOf("iPhone") === -1 &&
      userAgent.indexOf("iPad") === -1 &&
      userAgent.indexOf("Mac OS") === -1
    ) {
      setButtonDisabled(false);
    }
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();

  const { serviceWorkerRegistrationObj } = stateUser;

  const { handleLoadingOpen, handleLoadingClose } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * プッシュ通知を許可する（チェックボックス）
   * @param {boolean} checked - チェックの状態
   */
  const handleCheck = async (checked) => {
    try {
      // ---------------------------------------------
      //   Loading Open
      // ---------------------------------------------

      handleLoadingOpen({});

      // ---------------------------------------------
      //   Button Disable
      // ---------------------------------------------

      setButtonDisabled(true);

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/web-push/v2/components/checkbox.js - handleCheck
      // `);

      // console.log(chalk`
      //   process.env.NODE_ENV: {green ${process.env.NODE_ENV}}
      //   process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY: {green ${process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY}}
      // `);

      // ---------------------------------------------
      //   Subscribe
      // ---------------------------------------------

      let oldSubscriptionObj = {};
      let newSubscriptionObj = {};
      let webPushSubscriptionObj = {};

      if (
        checked &&
        process.env.NODE_ENV === "production" &&
        process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY
      ) {
        // ---------------------------------------------
        //   購読済みかどうかをチェックする / 購読していない場合は null が返る
        //   すでに購読済みの場合
        // ---------------------------------------------

        oldSubscriptionObj = await serviceWorkerRegistrationObj.pushManager.getSubscription();

        if (oldSubscriptionObj) {
          // ---------------------------------------------
          //   webPushSubscriptionObj
          // ---------------------------------------------

          const parsedObj = JSON.parse(JSON.stringify(oldSubscriptionObj));

          webPushSubscriptionObj = {
            endpoint: lodashGet(parsedObj, ["endpoint"], ""),
            keys: {
              p256dh: lodashGet(parsedObj, ["keys", "p256dh"], ""),
              auth: lodashGet(parsedObj, ["keys", "auth"], ""),
            },
          };

          // ---------------------------------------------
          //   解除してから登録しなおす場合
          // ---------------------------------------------

          // true 解除成功 / false 解除失敗
          // const unsubscribe = await oldSubscriptionObj.unsubscribe();

          // console.log(chalk`
          //   unsubscribe: {green ${unsubscribe}}
          // `);

          // ---------------------------------------------
          //   新しく購読する場合
          // ---------------------------------------------
        } else {
          // ---------------------------------------------
          //   applicationServerKey を作成する
          // ---------------------------------------------

          const urlBase64ToUint8Array = (base64String) => {
            const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
            const base64 = (base64String + padding)
              .replace(/-/g, "+")
              .replace(/_/g, "/");

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }

            return outputArray;
          };

          const convertedVapidKey = urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY
          );

          // console.log(chalk`
          //   convertedVapidKey: {green ${convertedVapidKey}}
          // `);

          // ---------------------------------------------
          //   購読する
          // ---------------------------------------------

          newSubscriptionObj = await serviceWorkerRegistrationObj.pushManager.subscribe(
            {
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            }
          );

          // console.log(`
          //   ----- newSubscriptionObj -----\n
          //   ${util.inspect(JSON.parse(JSON.stringify(newSubscriptionObj)), { colors: true, depth: null })}\n
          //   --------------------\n
          // `);

          // ---------------------------------------------
          //   通知を許可するかどうか尋ねるダイアログを表示する
          // ---------------------------------------------

          // 'default', 'granted', 'denied' が返り値
          const permission = await Notification.requestPermission();

          // 許可した場合
          if (permission === "granted") {
            // ---------------------------------------------
            //   subscriptionObj を返す
            // ---------------------------------------------

            const parsedObj = JSON.parse(JSON.stringify(newSubscriptionObj));

            webPushSubscriptionObj = {
              endpoint: lodashGet(parsedObj, ["endpoint"], ""),
              keys: {
                p256dh: lodashGet(parsedObj, ["keys", "p256dh"], ""),
                auth: lodashGet(parsedObj, ["keys", "auth"], ""),
              },
            };
          }
        }
      }

      // ---------------------------------------------
      //   更新
      // ---------------------------------------------

      // ----------------------------------------
      //   - checked === false
      // ----------------------------------------

      if (!checked) {
        setWebPushAvailable(false);
        setWebPushSubscriptionObj({});

        // ----------------------------------------
        //   - checked === true / Subscription データを取得できた場合
        // ----------------------------------------
      } else if (checked && Object.keys(webPushSubscriptionObj).length !== 0) {
        setWebPushAvailable(true);
        setWebPushSubscriptionObj(webPushSubscriptionObj);

        // ---------------------------------------------
        //   環境が Web Push に対応していない場合、Subscription データが取得できない場合はエラー
        // ---------------------------------------------
      } else {
        // console.log('BBB');

        setWebPushAvailable(false);
        setWebPushSubscriptionObj({});

        // ---------------------------------------------
        //   Snackbar: Error
        // ---------------------------------------------

        showSnackbar({
          enqueueSnackbar,
          intl,
          arr: [
            {
              variant: "error",
              messageID: "KkWs0oIKw",
            },
          ],
        });
      }

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/web-push/v2/components/checkbox.js - handleCheck
      // `);

      // console.log(chalk`
      //   process.env.NODE_ENV: {green ${process.env.NODE_ENV}}
      //   process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY: {green ${process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY}}
      // `);

      // console.log(`
      //   ----- oldSubscriptionObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(oldSubscriptionObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- newSubscriptionObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(newSubscriptionObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- webPushSubscriptionObj -----\n
      //   ${util.inspect(webPushSubscriptionObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
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
  //   /app/common/web-push/v2/checkbox.js
  // `);

  // console.log(`
  //   ----- hardwaresArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(hardwaresArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   value: {green ${value}}
  //   alternativeText: {green ${alternativeText}}
  //   search: {green ${search}}
  //   age: {green ${age}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={webPushAvailable}
          disabled={buttonDisabled}
          onChange={(eventObj) => handleCheck(eventObj.target.checked)}
        />
      }
      label="プッシュ通知を許可する"
    />
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

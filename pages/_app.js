// --------------------------------------------------
//   _app.jsについて：https://nextjs.org/docs/advanced-features/custom-app
//   日本語の記事：https://qiita.com/tetsutaroendo/items/c7171286137d963cdecf
//
//   Next.jsでMaterial UIを利用する場合の_app.js
//   参考：https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
// --------------------------------------------------

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

import React, { useEffect } from "react";
import { IntlProvider, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { SnackbarProvider } from "notistack";
import moment from "moment";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashIsEqual from "lodash/isEqual";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { ThemeProvider } from "@material-ui/styles";
import theme from "app/@css/material-ui/theme";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { showSnackbar } from "app/@modules/snackbar.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale, loadLocaleData } from "app/@locales/locale.js";

// ---------------------------------------------
//   CSS
// ---------------------------------------------

import "app/@css/reset.css";
import "swiper/swiper-bundle.min.css";
import "rc-pagination/assets/index.css";
import "react-modal-video/css/modal-video.min.css";
import "nprogress/nprogress.css";
import "app/@css/style.css";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Service Worker - registration データを保存する
 */
const ServiceWorker = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { Component, pageProps } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();

  const {
    setLogin,
    setLoginUsersObj,
    setServiceWorkerRegistrationObj,
  } = stateUser;
  const { setISO8601, headerObj, setHeaderObj } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  useEffect(() => {
    // --------------------------------------------------
    //   Service Worker
    // --------------------------------------------------

    if ("serviceWorker" in navigator) {
      // ---------------------------------------------
      //   Service Worker を登録する - production
      // ---------------------------------------------

      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/service-worker.js", { scope: "/" })
          .then((registrationObj) => {
            setServiceWorkerRegistrationObj(registrationObj);
          });

        // ---------------------------------------------
        //   登録されている Service Worker を全て削除する
        //   unregister で削除するとデータベースに登録済みの endpoint & p256dh & auth も無効になるため、削除していはいけない。2020/5/21
        //   dev 環境で unregister を行わないと、Chrome で「使用できるソケットを待機しています」と出て固まってしまう。2020/5/30
        // ---------------------------------------------
      } else {
        navigator.serviceWorker.getRegistrations().then((registrationsObj) => {
          for (let registration of registrationsObj) {
            registration.unregister();
          }
        });
      }
    }

    // --------------------------------------------------
    //   setInterval / Set Datetime Current
    // --------------------------------------------------

    const setDatetimeCurrent = setInterval(() => {
      const datetimeCurrent = moment().utc().toISOString();
      setISO8601(datetimeCurrent);
    }, 1000 * 60);

    return () => clearInterval(setDatetimeCurrent);
  }, []);

  // --------------------------------------------------
  //   ページ共通の処理を行うために、2つ目の useEffect を利用する
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // console.log('useEffect / ServiceWorker 2');

    // console.log(`
    //   ----- pageProps -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(pageProps)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   ログイン状態を更新する
    // --------------------------------------------------

    setLogin(pageProps.login);
    setLoginUsersObj(pageProps.loginUsersObj);

    // --------------------------------------------------
    //   Header 更新 - データに変更があった場合のみステートを更新
    // --------------------------------------------------

    if (lodashIsEqual(headerObj, pageProps.headerObj) === false) {
      setHeaderObj(pageProps.headerObj);
    }

    // --------------------------------------------------
    //   Snackbar - ログイン回数 + 1
    // --------------------------------------------------

    const experienceObj = lodashGet(pageProps, ["experienceObj"], {});

    if (Object.keys(experienceObj).length !== 0) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        experienceObj: pageProps.experienceObj,
        arr: [
          {
            variant: "success",
            messageID: "LjWizvlER",
          },
        ],
      });
    }
  }, [pageProps.ISO8601]);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return <Component {...pageProps} />;
};

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { pageProps } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  useEffect(() => {
    // --------------------------------------------------
    //   Remove the server-side injected CSS.
    // --------------------------------------------------

    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // --------------------------------------------------
  //   Initial State - User
  // --------------------------------------------------

  const login = lodashGet(pageProps, ["login"], false);
  const loginUsersObj = lodashGet(pageProps, ["loginUsersObj"], {});
  const reqAcceptLanguage = lodashGet(pageProps, ["reqAcceptLanguage"], "");
  const termsOfServiceAgreedVersion = lodashGet(
    pageProps,
    ["termsOfServiceAgreedVersion"],
    ""
  );

  // console.log(chalk`
  //   termsOfServiceAgreedVersion: {green ${termsOfServiceAgreedVersion}}
  // `);

  const localeObj = locale({
    acceptLanguage: reqAcceptLanguage,
  });

  const initialStateUserObj = {
    login,
    loginUsersObj,
    localeObj,
    termsOfServiceAgreedVersion,
  };

  // --------------------------------------------------
  //   Initial State - Layout
  // --------------------------------------------------

  const ISO8601 = lodashGet(
    pageProps,
    ["ISO8601"],
    moment().utc().toISOString()
  );
  const headerObj = lodashGet(pageProps, ["headerObj"], {});

  const initialStateLayoutObj = {
    ISO8601,
    headerObj,
  };

  // --------------------------------------------------
  //   Load Locale Data
  // --------------------------------------------------

  const localData = loadLocaleData({ local: localeObj.language });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /pages/_app.js
  // `);

  // console.log(chalk`
  //   ISO8601: {green ${ISO8601}}
  //   login: {green ${login}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Unstated Next States */}
      <ContainerStateUser.Provider initialState={initialStateUserObj}>
        <ContainerStateLayout.Provider initialState={initialStateLayoutObj}>
          {/* react-intl(i18n) Provider */}
          <IntlProvider
            locale={localeObj.languageArr[0]}
            // locale="en"
            // locale="ja"
            // messages={localeObj.dataObj}
            messages={localData}
          >
            {/* Material UI Theme Provider */}
            <ThemeProvider theme={theme}>
              {/* Snackbar */}
              <SnackbarProvider maxSnack={3}>
                <ServiceWorker {...props} />
              </SnackbarProvider>
            </ThemeProvider>
          </IntlProvider>
        </ContainerStateLayout.Provider>
      </ContainerStateUser.Provider>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

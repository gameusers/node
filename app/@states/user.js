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

import { useState } from "react";
import { createContainer } from "unstated-next";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// --------------------------------------------------
//   State
// --------------------------------------------------

const useUser = (initialStateObj) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [login, setLogin] = useState(
    lodashGet(initialStateObj, ["login"], false)
  );
  const [loginUsersObj, setLoginUsersObj] = useState(
    lodashGet(initialStateObj, ["loginUsersObj"], {})
  );
  const [localeObj, setLocaleObj] = useState(
    lodashGet(initialStateObj, ["localeObj"], {})
  );
  const [
    serviceWorkerRegistrationObj,
    setServiceWorkerRegistrationObj,
  ] = useState({});
  const [
    termsOfServiceAgreedVersion,
    setTermsOfServiceAgreedVersion,
  ] = useState(lodashGet(initialStateObj, ["termsOfServiceAgreedVersion"], ""));

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/@states/layout.js
  // `);

  // console.log(`
  //   ----- loginUsersObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(loginUsersObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    login,
    setLogin,
    loginUsersObj,
    setLoginUsersObj,
    localeObj,
    setLocaleObj,
    serviceWorkerRegistrationObj,
    setServiceWorkerRegistrationObj,
    termsOfServiceAgreedVersion,
    setTermsOfServiceAgreedVersion,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export const ContainerStateUser = createContainer(useUser);

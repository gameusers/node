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
//   States
// --------------------------------------------------

const useCommunity = (initialStateObj) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [gameCommunityObj, setGameCommunityObj] = useState(
    lodashGet(initialStateObj, ["gameCommunityObj"], {})
  );
  const [userCommunityObj, setUserCommunityObj] = useState(
    lodashGet(initialStateObj, ["userCommunityObj"], {})
  );

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    gameCommunityObj,
    setGameCommunityObj,

    userCommunityObj,
    setUserCommunityObj,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export const ContainerStateCommunity = createContainer(useCommunity);

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

const useRecruitment = (initialStateObj) => {
  // --------------------------------------------------
  //   Initial State
  // --------------------------------------------------

  const categories = lodashGet(initialStateObj, ["categories"], "");

  let categoriesArr = [];

  if (categories) {
    categoriesArr = categories.split(",");
    categoriesArr = categoriesArr.map((value) => parseInt(value, 10));
  }

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [recruitmentThreadsObj, setRecruitmentThreadsObj] = useState(
    lodashGet(initialStateObj, ["recruitmentThreadsObj"], {})
  );
  const [recruitmentCommentsObj, setRecruitmentCommentsObj] = useState(
    lodashGet(initialStateObj, ["recruitmentCommentsObj"], {})
  );
  const [recruitmentRepliesObj, setRecruitmentRepliesObj] = useState(
    lodashGet(initialStateObj, ["recruitmentRepliesObj"], {})
  );

  const [
    reloadForceRecruitmentComment,
    setReloadForceRecruitmentComment,
  ] = useState(false);
  const [
    reloadForceRecruitmentReply,
    setReloadForceRecruitmentReply,
  ] = useState(false);

  const [searchHardwaresArr, setSearchHardwaresArr] = useState(
    lodashGet(initialStateObj, ["hardwaresArr"], [])
  );
  const [searchCategoriesArr, setSearchCategoriesArr] = useState(categoriesArr);
  const [searchKeyword, setSearchKeyword] = useState(
    lodashGet(initialStateObj, ["keyword"], "")
  );

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    recruitmentThreadsObj,
    setRecruitmentThreadsObj,

    recruitmentCommentsObj,
    setRecruitmentCommentsObj,

    recruitmentRepliesObj,
    setRecruitmentRepliesObj,

    reloadForceRecruitmentComment,
    setReloadForceRecruitmentComment,

    reloadForceRecruitmentReply,
    setReloadForceRecruitmentReply,

    searchHardwaresArr,
    setSearchHardwaresArr,

    searchCategoriesArr,
    setSearchCategoriesArr,

    searchKeyword,
    setSearchKeyword,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export const ContainerStateRecruitment = createContainer(useRecruitment);

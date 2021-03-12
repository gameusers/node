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
import lodashSet from "lodash/set";
import lodashCloneDeep from "lodash/cloneDeep";

// ---------------------------------------------
//   States
// ---------------------------------------------

// import { ContainerStateLayout } from 'app/@states/layout.js';

// --------------------------------------------------
//   States
// --------------------------------------------------

const useGcRegister = (initialStateObj) => {
  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  // const stateLayout = ContainerStateLayout.useContainer();
  // const {

  //   handleLoadingOpen,
  //   handleLoadingClose,
  //   handleScrollTo,

  // } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [formType, setFormType] = useState("new");
  const [games_id, setGames_id] = useState("");
  const [sourceGamesName, setSourceGamesName] = useState("");

  const [language, setLanguage] = useState("ja");
  const [country, setCountry] = useState("JP");
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sortKeyword, setSortKeyword] = useState("");
  const [urlID, setURLID] = useState("");
  const [twitterHashtagsArr, setTwitterHashtagsArr] = useState([]);
  const [searchKeywordsArr, setSearchKeywordsArr] = useState([]);

  const [genre1, setGenre1] = useState("");
  const [genre2, setGenre2] = useState("");
  const [genre3, setGenre3] = useState("");

  const [hardwaresCount, setHardwaresCount] = useState(1);

  const [hardwares1Arr, setHardwares1Arr] = useState([]);
  const [releaseDate1, setReleaseDate1] = useState("");
  const [playersMin1, setPlayersMin1] = useState(1);
  const [playersMax1, setPlayersMax1] = useState(1);
  const [publishers1Arr, setPublishers1Arr] = useState([]);
  const [developers1Arr, setDevelopers1Arr] = useState([]);

  const [hardwares2Arr, setHardwares2Arr] = useState([]);
  const [releaseDate2, setReleaseDate2] = useState("");
  const [playersMin2, setPlayersMin2] = useState(1);
  const [playersMax2, setPlayersMax2] = useState(1);
  const [publishers2Arr, setPublishers2Arr] = useState([]);
  const [developers2Arr, setDevelopers2Arr] = useState([]);

  const [hardwares3Arr, setHardwares3Arr] = useState([]);
  const [releaseDate3, setReleaseDate3] = useState("");
  const [playersMin3, setPlayersMin3] = useState(1);
  const [playersMax3, setPlayersMax3] = useState(1);
  const [publishers3Arr, setPublishers3Arr] = useState([]);
  const [developers3Arr, setDevelopers3Arr] = useState([]);

  const [hardwares4Arr, setHardwares4Arr] = useState([]);
  const [releaseDate4, setReleaseDate4] = useState("");
  const [playersMin4, setPlayersMin4] = useState(1);
  const [playersMax4, setPlayersMax4] = useState(1);
  const [publishers4Arr, setPublishers4Arr] = useState([]);
  const [developers4Arr, setDevelopers4Arr] = useState([]);

  const [hardwares5Arr, setHardwares5Arr] = useState([]);
  const [releaseDate5, setReleaseDate5] = useState("");
  const [playersMin5, setPlayersMin5] = useState(1);
  const [playersMax5, setPlayersMax5] = useState(1);
  const [publishers5Arr, setPublishers5Arr] = useState([]);
  const [developers5Arr, setDevelopers5Arr] = useState([]);

  const [hardwares6Arr, setHardwares6Arr] = useState([]);
  const [releaseDate6, setReleaseDate6] = useState("");
  const [playersMin6, setPlayersMin6] = useState(1);
  const [playersMax6, setPlayersMax6] = useState(1);
  const [publishers6Arr, setPublishers6Arr] = useState([]);
  const [developers6Arr, setDevelopers6Arr] = useState([]);

  const [hardwares7Arr, setHardwares7Arr] = useState([]);
  const [releaseDate7, setReleaseDate7] = useState("");
  const [playersMin7, setPlayersMin7] = useState(1);
  const [playersMax7, setPlayersMax7] = useState(1);
  const [publishers7Arr, setPublishers7Arr] = useState([]);
  const [developers7Arr, setDevelopers7Arr] = useState([]);

  const [hardwares8Arr, setHardwares8Arr] = useState([]);
  const [releaseDate8, setReleaseDate8] = useState("");
  const [playersMin8, setPlayersMin8] = useState(1);
  const [playersMax8, setPlayersMax8] = useState(1);
  const [publishers8Arr, setPublishers8Arr] = useState([]);
  const [developers8Arr, setDevelopers8Arr] = useState([]);

  const [hardwares9Arr, setHardwares9Arr] = useState([]);
  const [releaseDate9, setReleaseDate9] = useState("");
  const [playersMin9, setPlayersMin9] = useState(1);
  const [playersMax9, setPlayersMax9] = useState(1);
  const [publishers9Arr, setPublishers9Arr] = useState([]);
  const [developers9Arr, setDevelopers9Arr] = useState([]);

  const [hardwares10Arr, setHardwares10Arr] = useState([]);
  const [releaseDate10, setReleaseDate10] = useState("");
  const [playersMin10, setPlayersMin10] = useState(1);
  const [playersMax10, setPlayersMax10] = useState(1);
  const [publishers10Arr, setPublishers10Arr] = useState([]);
  const [developers10Arr, setDevelopers10Arr] = useState([]);

  const [linkArr, setLinkArr] = useState([
    {
      _id: "",
      type: "Official",
      label: "",
      url: "",
    },
  ]);

  const [imagesAndVideosObj, setImagesAndVideosObj] = useState({
    _id: "",
    createdDate: "",
    updatedDate: "",
    users_id: "",
    type: "gc",
    arr: [],
  });

  const [
    imagesAndVideosThumbnailObj,
    setImagesAndVideosThumbnailObj,
  ] = useState({
    _id: "",
    createdDate: "",
    updatedDate: "",
    users_id: "",
    type: "gc",
    arr: [],
  });

  const [
    adminCheckedGamesTemps_idsArr,
    setAdminCheckedGamesTemps_idsArr,
  ] = useState([]);
  // const [adminCheckedGamesTemps_idsArr, setAdminCheckedGamesTemps_idsArr] = useState([]);

  /**
   * フォームをリセットする
   */
  const handleResetForm = async () => {
    setFormType("new");
    setGames_id("");
    setSourceGamesName("");

    setLanguage("ja");
    setCountry("JP");
    setName("");
    setSubtitle("");
    setSortKeyword("");
    setURLID("");
    setTwitterHashtagsArr([]);
    setSearchKeywordsArr([]);

    setGenre1("");
    setGenre2("");
    setGenre3("");

    setHardwaresCount(1);

    setHardwares1Arr([]);
    setReleaseDate1("");
    setPlayersMin1(1);
    setPlayersMax1(1);
    setPublishers1Arr([]);
    setDevelopers1Arr([]);

    setHardwares2Arr([]);
    setReleaseDate2("");
    setPlayersMin2(1);
    setPlayersMax2(1);
    setPublishers2Arr([]);
    setDevelopers2Arr([]);

    setHardwares3Arr([]);
    setReleaseDate3("");
    setPlayersMin3(1);
    setPlayersMax3(1);
    setPublishers3Arr([]);
    setDevelopers3Arr([]);

    setHardwares4Arr([]);
    setReleaseDate4("");
    setPlayersMin4(1);
    setPlayersMax4(1);
    setPublishers4Arr([]);
    setDevelopers4Arr([]);

    setHardwares5Arr([]);
    setReleaseDate5("");
    setPlayersMin5(1);
    setPlayersMax5(1);
    setPublishers5Arr([]);
    setDevelopers5Arr([]);

    setHardwares6Arr([]);
    setReleaseDate6("");
    setPlayersMin6(1);
    setPlayersMax6(1);
    setPublishers6Arr([]);
    setDevelopers6Arr([]);

    setHardwares7Arr([]);
    setReleaseDate7("");
    setPlayersMin7(1);
    setPlayersMax7(1);
    setPublishers7Arr([]);
    setDevelopers7Arr([]);

    setHardwares8Arr([]);
    setReleaseDate8("");
    setPlayersMin8(1);
    setPlayersMax8(1);
    setPublishers8Arr([]);
    setDevelopers8Arr([]);

    setHardwares9Arr([]);
    setReleaseDate9("");
    setPlayersMin9(1);
    setPlayersMax9(1);
    setPublishers9Arr([]);
    setDevelopers9Arr([]);

    setHardwares10Arr([]);
    setReleaseDate10("");
    setPlayersMin10(1);
    setPlayersMax10(1);
    setPublishers10Arr([]);
    setDevelopers10Arr([]);

    setLinkArr([
      {
        _id: "",
        type: "Official",
        label: "",
        url: "",
      },
    ]);

    setImagesAndVideosObj({
      _id: "",
      createdDate: "",
      updatedDate: "",
      users_id: "",
      type: "gc",
      arr: [],
    });

    setImagesAndVideosThumbnailObj({
      _id: "",
      createdDate: "",
      updatedDate: "",
      users_id: "",
      type: "gc",
      arr: [],
    });
  };

  /**
   * 仮登録を承認または削除するためにチェックする
   */
  const handleAdminCheck = ({ gamesTemps_id }) => {
    const clonedArr = lodashCloneDeep(adminCheckedGamesTemps_idsArr);
    const arrayIndex = clonedArr.indexOf(gamesTemps_id);

    if (arrayIndex === -1) {
      clonedArr.push(gamesTemps_id);
    } else {
      clonedArr.splice(arrayIndex, 1);
    }

    setAdminCheckedGamesTemps_idsArr(clonedArr);

    // console.log(`
    //   ----------------------------------------\n
    //   app/@states/gc-register.js - handleAdminCheck
    // `);

    // console.log(chalk`
    //   gamesTemps_id: {green ${gamesTemps_id}}
    // `);

    // console.log(`
    //   ----- adminCheckedGamesTemps_idsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(adminCheckedGamesTemps_idsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  };

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    formType,
    setFormType,

    games_id,
    setGames_id,
    sourceGamesName,
    setSourceGamesName,

    language,
    setLanguage,
    country,
    setCountry,
    name,
    setName,
    subtitle,
    setSubtitle,
    sortKeyword,
    setSortKeyword,
    urlID,
    setURLID,
    twitterHashtagsArr,
    setTwitterHashtagsArr,
    searchKeywordsArr,
    setSearchKeywordsArr,
    genre1,
    setGenre1,
    genre2,
    setGenre2,
    genre3,
    setGenre3,

    hardwaresCount,
    setHardwaresCount,

    hardwares1Arr,
    setHardwares1Arr,
    releaseDate1,
    setReleaseDate1,
    playersMin1,
    setPlayersMin1,
    playersMax1,
    setPlayersMax1,
    publishers1Arr,
    setPublishers1Arr,
    developers1Arr,
    setDevelopers1Arr,

    hardwares2Arr,
    setHardwares2Arr,
    releaseDate2,
    setReleaseDate2,
    playersMin2,
    setPlayersMin2,
    playersMax2,
    setPlayersMax2,
    publishers2Arr,
    setPublishers2Arr,
    developers2Arr,
    setDevelopers2Arr,

    hardwares3Arr,
    setHardwares3Arr,
    releaseDate3,
    setReleaseDate3,
    playersMin3,
    setPlayersMin3,
    playersMax3,
    setPlayersMax3,
    publishers3Arr,
    setPublishers3Arr,
    developers3Arr,
    setDevelopers3Arr,

    hardwares4Arr,
    setHardwares4Arr,
    releaseDate4,
    setReleaseDate4,
    playersMin4,
    setPlayersMin4,
    playersMax4,
    setPlayersMax4,
    publishers4Arr,
    setPublishers4Arr,
    developers4Arr,
    setDevelopers4Arr,

    hardwares5Arr,
    setHardwares5Arr,
    releaseDate5,
    setReleaseDate5,
    playersMin5,
    setPlayersMin5,
    playersMax5,
    setPlayersMax5,
    publishers5Arr,
    setPublishers5Arr,
    developers5Arr,
    setDevelopers5Arr,

    hardwares6Arr,
    setHardwares6Arr,
    releaseDate6,
    setReleaseDate6,
    playersMin6,
    setPlayersMin6,
    playersMax6,
    setPlayersMax6,
    publishers6Arr,
    setPublishers6Arr,
    developers6Arr,
    setDevelopers6Arr,

    hardwares7Arr,
    setHardwares7Arr,
    releaseDate7,
    setReleaseDate7,
    playersMin7,
    setPlayersMin7,
    playersMax7,
    setPlayersMax7,
    publishers7Arr,
    setPublishers7Arr,
    developers7Arr,
    setDevelopers7Arr,

    hardwares8Arr,
    setHardwares8Arr,
    releaseDate8,
    setReleaseDate8,
    playersMin8,
    setPlayersMin8,
    playersMax8,
    setPlayersMax8,
    publishers8Arr,
    setPublishers8Arr,
    developers8Arr,
    setDevelopers8Arr,

    hardwares9Arr,
    setHardwares9Arr,
    releaseDate9,
    setReleaseDate9,
    playersMin9,
    setPlayersMin9,
    playersMax9,
    setPlayersMax9,
    publishers9Arr,
    setPublishers9Arr,
    developers9Arr,
    setDevelopers9Arr,

    hardwares10Arr,
    setHardwares10Arr,
    releaseDate10,
    setReleaseDate10,
    playersMin10,
    setPlayersMin10,
    playersMax10,
    setPlayersMax10,
    publishers10Arr,
    setPublishers10Arr,
    developers10Arr,
    setDevelopers10Arr,

    linkArr,
    setLinkArr,

    imagesAndVideosObj,
    setImagesAndVideosObj,
    imagesAndVideosThumbnailObj,
    setImagesAndVideosThumbnailObj,

    adminCheckedGamesTemps_idsArr,
    setAdminCheckedGamesTemps_idsArr,

    handleResetForm,
    handleAdminCheck,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export const ContainerStateGcRegister = createContainer(useGcRegister);

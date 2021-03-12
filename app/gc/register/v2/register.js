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
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/ja_JP";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
// import lodashSet from 'lodash/set';
// import lodashCloneDeep from 'lodash/cloneDeep';

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
import { ContainerStateLayout } from "app/@states/layout.js";
import { ContainerStateGcRegister } from "app/@states/gc-register.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";
import { setCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

import Card from "app/gc/register/v2/card.js";
import CardTemp from "app/gc/register/v2/card-temp.js";
import FormGame from "app/gc/register/v2/form-game.js";
import FormDevelopersPublishers from "app/gc/register/v2/form-developers-publishers.js";

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  expanded: {
    marginBottom: "0 !important",
  },

  input: {
    fontSize: "12px",
    color: "#666",
    padding: "6px 26px 6px 12px",
  },
});

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
    gcListObj,
    hardwaresArr,
    keyword,
    gcTempsListObj,
    gameGenresArr,
  } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();
  const stateGcRegister = ContainerStateGcRegister.useContainer();

  const { login, loginUsersObj } = stateUser;

  const {
    handleDialogOpen,
    handleLoadingOpen,
    handleLoadingClose,
    handleScrollTo,
  } = stateLayout;

  const {
    setFormType,
    setGames_id,
    setSourceGamesName,

    setLanguage,
    setCountry,
    setName,
    setSubtitle,
    setSortKeyword,
    setURLID,
    setTwitterHashtagsArr,
    setSearchKeywordsArr,
    setGenre1,
    setGenre2,
    setGenre3,

    setHardwaresCount,

    setHardwares1Arr,
    setReleaseDate1,
    setPlayersMin1,
    setPlayersMax1,
    setPublishers1Arr,
    setDevelopers1Arr,

    setHardwares2Arr,
    setReleaseDate2,
    setPlayersMin2,
    setPlayersMax2,
    setPublishers2Arr,
    setDevelopers2Arr,

    setHardwares3Arr,
    setReleaseDate3,
    setPlayersMin3,
    setPlayersMax3,
    setPublishers3Arr,
    setDevelopers3Arr,

    setHardwares4Arr,
    setReleaseDate4,
    setPlayersMin4,
    setPlayersMax4,
    setPublishers4Arr,
    setDevelopers4Arr,

    setHardwares5Arr,
    setReleaseDate5,
    setPlayersMin5,
    setPlayersMax5,
    setPublishers5Arr,
    setDevelopers5Arr,

    setHardwares6Arr,
    setReleaseDate6,
    setPlayersMin6,
    setPlayersMax6,
    setPublishers6Arr,
    setDevelopers6Arr,

    setHardwares7Arr,
    setReleaseDate7,
    setPlayersMin7,
    setPlayersMax7,
    setPublishers7Arr,
    setDevelopers7Arr,

    setHardwares8Arr,
    setReleaseDate8,
    setPlayersMin8,
    setPlayersMax8,
    setPublishers8Arr,
    setDevelopers8Arr,

    setHardwares9Arr,
    setReleaseDate9,
    setPlayersMin9,
    setPlayersMax9,
    setPublishers9Arr,
    setDevelopers9Arr,

    setHardwares10Arr,
    setReleaseDate10,
    setPlayersMin10,
    setPlayersMax10,
    setPublishers10Arr,
    setDevelopers10Arr,

    setLinkArr,

    setImagesAndVideosObj,
    setImagesAndVideosThumbnailObj,

    adminCheckedGamesTemps_idsArr,
  } = stateGcRegister;

  const role = lodashGet(loginUsersObj, ["role"], "");
  const administrator = role === "administrator" ? true : false;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 登録ゲーム一覧を読み込む
   * @param {number} page - ページ
   * @param {number} changeLimit - 1ページに表示する件数を変更する場合、値を入力する
   */
  const handleRead = async ({ page, changeLimit }) => {
    try {
      // ---------------------------------------------
      //   For Search
      // ---------------------------------------------

      const hardwareIDsArr = [];

      for (let valueObj of hardwaresArr.values()) {
        hardwareIDsArr.push(valueObj.hardwareID);
      }

      // ---------------------------------------------
      //   Router.push 用
      // ---------------------------------------------

      const urlHardwares =
        hardwareIDsArr.length > 0
          ? `hardwares=${hardwareIDsArr.join(",")}&`
          : "";
      const urlKeyword = keyword ? `keyword=${encodeURI(keyword)}&` : "";

      let url = `/gc/register/search?${urlHardwares}${urlKeyword}page=${page}`;

      if (!urlHardwares && !urlKeyword) {
        if (page === 1) {
          url = "/gc/register";
        } else {
          url = `/gc/register/${page}`;
        }
      }

      // ---------------------------------------------
      //   Change Limit / Set Cookie
      // ---------------------------------------------

      if (changeLimit) {
        setCookie({ key: "communityListLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      // handleScrollTo({

      //   to: 'gcRegister',
      //   duration: 0,
      //   delay: 0,
      //   smooth: 'easeInOutQuart',
      //   offset: -50,

      // });

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/gc/register/v2/register.js - handleRead
      // `);

      // console.log(chalk`
      //   page: {green ${page}}
      //   changeLimit: {green ${changeLimit}}
      //   url: {green ${url}}
      // `);

      // return;

      // ---------------------------------------------
      //   Router.push = History API pushState()
      // ---------------------------------------------

      Router.push(url);
    } catch (errorObj) {}
  };

  /**
   * 編集用データを読み込む
   */
  const handleGetEditData = async ({ games_id, gamesTemps_id }) => {
    try {
      // console.log(chalk`
      //   games_id: {green ${games_id}}
      //   gamesTemps_id: {green ${gamesTemps_id}}
      // `);

      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (!games_id && !gamesTemps_id) {
        throw new CustomError({
          errorsArr: [{ code: "oVxYzL2wk", messageID: "Error" }],
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
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to: "gcRegisterForm",
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        games_id,
        gamesTemps_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/games-temps/get-edit-data`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

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
      //   Set Form Data
      // ---------------------------------------------

      setLanguage(lodashGet(resultObj, ["data", "language"], "ja"));
      setCountry(lodashGet(resultObj, ["data", "country"], "JP"));
      setName(lodashGet(resultObj, ["data", "name"], ""));
      setSubtitle(lodashGet(resultObj, ["data", "subtitle"], ""));
      setSortKeyword(lodashGet(resultObj, ["data", "sortKeyword"], ""));
      setURLID(lodashGet(resultObj, ["data", "urlID"], ""));
      setTwitterHashtagsArr(
        lodashGet(resultObj, ["data", "twitterHashtagsArr"], [])
      );
      setSearchKeywordsArr(
        lodashGet(resultObj, ["data", "searchKeywordsArr"], [])
      );

      setGenre1(lodashGet(resultObj, ["data", "genreArr", 0], ""));
      setGenre2(lodashGet(resultObj, ["data", "genreArr", 1], ""));
      setGenre3(lodashGet(resultObj, ["data", "genreArr", 2], ""));

      const hardwareArr = lodashGet(resultObj, ["data", "hardwareArr"], []);
      setHardwaresCount(hardwareArr.length);

      setHardwares1Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 0, "hardwaresArr"], [])
      );
      setReleaseDate1(
        lodashGet(resultObj, ["data", "hardwareArr", 0, "releaseDate"], "")
      );
      setPlayersMin1(
        lodashGet(resultObj, ["data", "hardwareArr", 0, "playersMin"], 1)
      );
      setPlayersMax1(
        lodashGet(resultObj, ["data", "hardwareArr", 0, "playersMax"], 1)
      );
      setPublishers1Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 0, "publishersArr"], [])
      );
      setDevelopers1Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 0, "developersArr"], [])
      );

      setHardwares2Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 1, "hardwaresArr"], [])
      );
      setReleaseDate2(
        lodashGet(resultObj, ["data", "hardwareArr", 1, "releaseDate"], "")
      );
      setPlayersMin2(
        lodashGet(resultObj, ["data", "hardwareArr", 1, "playersMin"], 1)
      );
      setPlayersMax2(
        lodashGet(resultObj, ["data", "hardwareArr", 1, "playersMax"], 1)
      );
      setPublishers2Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 1, "publishersArr"], [])
      );
      setDevelopers2Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 1, "developersArr"], [])
      );

      setHardwares3Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 2, "hardwaresArr"], [])
      );
      setReleaseDate3(
        lodashGet(resultObj, ["data", "hardwareArr", 2, "releaseDate"], "")
      );
      setPlayersMin3(
        lodashGet(resultObj, ["data", "hardwareArr", 2, "playersMin"], 1)
      );
      setPlayersMax3(
        lodashGet(resultObj, ["data", "hardwareArr", 2, "playersMax"], 1)
      );
      setPublishers3Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 2, "publishersArr"], [])
      );
      setDevelopers3Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 2, "developersArr"], [])
      );

      setHardwares4Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 3, "hardwaresArr"], [])
      );
      setReleaseDate4(
        lodashGet(resultObj, ["data", "hardwareArr", 3, "releaseDate"], "")
      );
      setPlayersMin4(
        lodashGet(resultObj, ["data", "hardwareArr", 3, "playersMin"], 1)
      );
      setPlayersMax4(
        lodashGet(resultObj, ["data", "hardwareArr", 3, "playersMax"], 1)
      );
      setPublishers4Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 3, "publishersArr"], [])
      );
      setDevelopers4Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 3, "developersArr"], [])
      );

      setHardwares5Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 4, "hardwaresArr"], [])
      );
      setReleaseDate5(
        lodashGet(resultObj, ["data", "hardwareArr", 4, "releaseDate"], "")
      );
      setPlayersMin5(
        lodashGet(resultObj, ["data", "hardwareArr", 4, "playersMin"], 1)
      );
      setPlayersMax5(
        lodashGet(resultObj, ["data", "hardwareArr", 4, "playersMax"], 1)
      );
      setPublishers5Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 4, "publishersArr"], [])
      );
      setDevelopers5Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 4, "developersArr"], [])
      );

      setHardwares6Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 5, "hardwaresArr"], [])
      );
      setReleaseDate6(
        lodashGet(resultObj, ["data", "hardwareArr", 5, "releaseDate"], "")
      );
      setPlayersMin6(
        lodashGet(resultObj, ["data", "hardwareArr", 5, "playersMin"], 1)
      );
      setPlayersMax6(
        lodashGet(resultObj, ["data", "hardwareArr", 5, "playersMax"], 1)
      );
      setPublishers6Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 5, "publishersArr"], [])
      );
      setDevelopers6Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 5, "developersArr"], [])
      );

      setHardwares7Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 6, "hardwaresArr"], [])
      );
      setReleaseDate7(
        lodashGet(resultObj, ["data", "hardwareArr", 6, "releaseDate"], "")
      );
      setPlayersMin7(
        lodashGet(resultObj, ["data", "hardwareArr", 6, "playersMin"], 1)
      );
      setPlayersMax7(
        lodashGet(resultObj, ["data", "hardwareArr", 6, "playersMax"], 1)
      );
      setPublishers7Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 6, "publishersArr"], [])
      );
      setDevelopers7Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 6, "developersArr"], [])
      );

      setHardwares8Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 7, "hardwaresArr"], [])
      );
      setReleaseDate8(
        lodashGet(resultObj, ["data", "hardwareArr", 7, "releaseDate"], "")
      );
      setPlayersMin8(
        lodashGet(resultObj, ["data", "hardwareArr", 7, "playersMin"], 1)
      );
      setPlayersMax8(
        lodashGet(resultObj, ["data", "hardwareArr", 7, "playersMax"], 1)
      );
      setPublishers8Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 7, "publishersArr"], [])
      );
      setDevelopers8Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 7, "developersArr"], [])
      );

      setHardwares9Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 8, "hardwaresArr"], [])
      );
      setReleaseDate9(
        lodashGet(resultObj, ["data", "hardwareArr", 8, "releaseDate"], "")
      );
      setPlayersMin9(
        lodashGet(resultObj, ["data", "hardwareArr", 8, "playersMin"], 1)
      );
      setPlayersMax9(
        lodashGet(resultObj, ["data", "hardwareArr", 8, "playersMax"], 1)
      );
      setPublishers9Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 8, "publishersArr"], [])
      );
      setDevelopers9Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 8, "developersArr"], [])
      );

      setHardwares10Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 9, "hardwaresArr"], [])
      );
      setReleaseDate10(
        lodashGet(resultObj, ["data", "hardwareArr", 9, "releaseDate"], "")
      );
      setPlayersMin10(
        lodashGet(resultObj, ["data", "hardwareArr", 9, "playersMin"], 1)
      );
      setPlayersMax10(
        lodashGet(resultObj, ["data", "hardwareArr", 9, "playersMax"], 1)
      );
      setPublishers10Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 9, "publishersArr"], [])
      );
      setDevelopers10Arr(
        lodashGet(resultObj, ["data", "hardwareArr", 9, "developersArr"], [])
      );

      setLinkArr(lodashGet(resultObj, ["data", "linkArr"], []));

      // ---------------------------------------------
      //   分岐
      // ---------------------------------------------

      const gamesObj = lodashGet(resultObj, ["data", "gamesObj"], {});
      let imagesAndVideosObj = {};
      let imagesAndVideosThumbnailObj = {};

      // ----------------------------------------
      //   - 追記の場合 / games
      // ----------------------------------------

      if (games_id) {
        setGames_id(games_id);
        setFormType("postscript");
        setSourceGamesName(lodashGet(resultObj, ["data", "name"], ""));

        imagesAndVideosObj = lodashGet(
          resultObj,
          ["data", "imagesAndVideosObj"],
          {}
        );
        imagesAndVideosThumbnailObj = lodashGet(
          resultObj,
          ["data", "imagesAndVideosThumbnailObj"],
          {}
        );

        // ----------------------------------------
        //   - 追記の場合 / games-temps
        // ----------------------------------------
      } else if (Object.keys(gamesObj).length !== 0) {
        setGames_id(lodashGet(resultObj, ["data", "games_id"], ""));
        setFormType("postscript");
        setSourceGamesName(lodashGet(gamesObj, ["name"], ""));

        imagesAndVideosObj = lodashGet(gamesObj, ["imagesAndVideosObj"], {});
        imagesAndVideosThumbnailObj = lodashGet(
          gamesObj,
          ["imagesAndVideosThumbnailObj"],
          {}
        );

        // ----------------------------------------
        //   - 新規登録の場合
        // ----------------------------------------
      } else {
        setGames_id("");
        setFormType("new");
        setSourceGamesName(lodashGet(resultObj, ["data", "name"], ""));

        imagesAndVideosObj = lodashGet(
          resultObj,
          ["data", "imagesAndVideosObj"],
          {}
        );
        imagesAndVideosThumbnailObj = lodashGet(
          resultObj,
          ["data", "imagesAndVideosThumbnailObj"],
          {}
        );
      }

      if (Object.keys(imagesAndVideosObj).length === 0) {
        imagesAndVideosObj = {
          _id: "",
          createdDate: "",
          updatedDate: "",
          users_id: "",
          type: "gc",
          arr: [],
        };
      }

      setImagesAndVideosObj(imagesAndVideosObj);

      if (Object.keys(imagesAndVideosThumbnailObj).length === 0) {
        imagesAndVideosThumbnailObj = {
          _id: "",
          createdDate: "",
          updatedDate: "",
          users_id: "",
          type: "gc",
          arr: [],
        };
      }

      setImagesAndVideosThumbnailObj(imagesAndVideosThumbnailObj);
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
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  /**
   * 仮登録を承認する
   */
  const handleApproval = async () => {
    try {
      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (adminCheckedGamesTemps_idsArr.length === 0) {
        throw new CustomError({
          errorsArr: [{ code: "Zh0mo70CB", messageID: "Error" }],
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
        gamesTemps_idsArr: adminCheckedGamesTemps_idsArr,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/games-temps/approval`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

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
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/@states/gc-register.js - handleDelete
      // `);

      // console.log(chalk`
      //   gamesTemps_id: {green ${gamesTemps_id}}
      // `);

      // console.log(`
      //   ----- adminCheckedGamesTemps_idsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(adminCheckedGamesTemps_idsArr)), { colors: true, depth: null })}\n
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
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  /**
   * 仮登録を削除する
   */
  const handleDelete = async ({ adminCheckedGamesTemps_idsArr }) => {
    try {
      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (adminCheckedGamesTemps_idsArr.length === 0) {
        throw new CustomError({
          errorsArr: [{ code: "p2v1IP42S", messageID: "Error" }],
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
        gamesTemps_idsArr: adminCheckedGamesTemps_idsArr,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/games-temps/delete`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

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
      //   Router.push = History API pushState()
      // ---------------------------------------------

      Router.push("/gc/register");

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/@states/gc-register.js - handleDelete
      // `);

      // console.log(chalk`
      //   gamesTemps_id: {green ${gamesTemps_id}}
      // `);

      // console.log(`
      //   ----- adminCheckedGamesTemps_idsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(adminCheckedGamesTemps_idsArr)), { colors: true, depth: null })}\n
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
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  // --------------------------------------------------
  //   Thread
  // --------------------------------------------------

  const page = lodashGet(gcTempsListObj, ["page"], 1);
  const limit = lodashGet(
    gcTempsListObj,
    ["limit"],
    parseInt(process.env.NEXT_PUBLIC_COMMUNITY_LIST_LIMIT, 10)
  );
  const count = lodashGet(gcTempsListObj, ["count"], 0);
  const listArr = lodashGet(gcListObj, [`page${page}Obj`, "arr"], []);
  const tempsListArr = lodashGet(gcTempsListObj, [`page${page}Obj`, "arr"], []);

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/gc/register/v2/register.js
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
  //   ----- gcListObj -----\n
  //   ${util.inspect(gcListObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- gcTempsListObj -----\n
  //   ${util.inspect(gcTempsListObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Component - List
  // --------------------------------------------------

  const componentListArr = [];

  for (const [index, gameCommunities_id] of listArr.entries()) {
    // --------------------------------------------------
    //   dataObj
    // --------------------------------------------------

    const dataObj = lodashGet(gcListObj, ["dataObj", gameCommunities_id], {});

    // --------------------------------------------------
    //   push
    // --------------------------------------------------

    componentListArr.push(
      <Card key={index} obj={dataObj} handleGetEditData={handleGetEditData} />
    );
  }

  // --------------------------------------------------
  //   Component - Temps List
  // --------------------------------------------------

  const componentTempsListArr = [];

  for (const [index, _id] of tempsListArr.entries()) {
    // --------------------------------------------------
    //   dataObj
    // --------------------------------------------------

    const dataObj = lodashGet(gcTempsListObj, ["dataObj", _id], {});

    // --------------------------------------------------
    //   push
    // --------------------------------------------------

    componentTempsListArr.push(
      <CardTemp
        key={index}
        obj={dataObj}
        handleGetEditData={handleGetEditData}
      />
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name="gcRegister">
      {/* List */}
      <div
        css={css`
          margin: 0 0 16px 0;
        `}
      >
        {componentListArr}
      </div>

      {/* Temps List */}
      <div
        css={css`
          margin: 0 0 16px 0;
        `}
      >
        {componentTempsListArr}
      </div>

      {/* Administrator Buttons */}
      {administrator && (
        <Paper
          css={css`
            display: flex;
            flex-flow: row wrap;
            margin: 0 0 12px 0;
            padding: 8px;
          `}
        >
          {/* Approval Button */}
          <Button
            variant="contained"
            color="primary"
            disabled={buttonDisabled}
            onClick={handleApproval}
          >
            承認する
          </Button>

          {/* Delete Button */}
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
                  title: "仮登録削除",
                  description: "削除しますか？",
                  handle: handleDelete,
                  argumentsObj: {
                    adminCheckedGamesTemps_idsArr,
                  },
                })
              }
            >
              削除する
            </Button>
          </div>
        </Paper>
      )}

      {/* Pagination Container */}
      <Paper
        css={css`
          display: flex;
          flex-flow: row wrap;
          padding: 0 8px 8px 8px;
        `}
      >
        {/* Pagination */}
        <div
          css={css`
            margin: 8px 24px 0 0;
          `}
        >
          <Pagination
            disabled={buttonDisabled}
            onChange={(page) =>
              handleRead({
                page,
              })
            }
            pageSize={limit}
            current={page}
            total={count}
            locale={localeInfo}
          />
        </div>

        {/* Rows Per Page */}
        <FormControl
          css={css`
            margin: 8px 0 0 0 !important;
          `}
          variant="outlined"
        >
          <Select
            value={limit}
            onChange={(eventObj) =>
              handleRead({
                page: 1,
                changeLimit: eventObj.target.value,
              })
            }
            input={
              <OutlinedInput
                classes={{
                  input: classes.input,
                }}
                name="gc-limit-pagination"
                id="outlined-rows-per-page"
              />
            }
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Form - Game */}
      {login ? (
        <div
          css={css`
            margin: 28px 0 0 0;
          `}
        >
          <Panel heading="ゲーム登録フォーム" defaultExpanded={true}>
            <FormGame gameGenresArr={gameGenresArr} />
          </Panel>
        </div>
      ) : (
        <Paper
          css={css`
            margin: 28px 0 0 0;
            padding: 8px 12px;
          `}
        >
          <p
            css={css`
              color: red;
            `}
          >
            ※ ログインしていないため、登録フォームは表示されません。
          </p>
        </Paper>
      )}

      {/* Form - Developers Publishers */}
      {administrator && (
        <div
          css={css`
            margin: 28px 0 0 0;
          `}
        >
          <Panel heading="開発・販売フォーム" defaultExpanded={true}>
            <FormDevelopersPublishers
            // gameGenresArr={gameGenresArr}
            />
          </Panel>
        </div>
      )}
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

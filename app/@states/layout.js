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

import React, { useState } from "react";
import { animateScroll as scroll, scrollSpy, scroller } from "react-scroll";
import { createContainer } from "unstated-next";
import moment from "moment";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashHas from "lodash/has";
import lodashCloneDeep from "lodash/cloneDeep";
import lodashMerge from "lodash/merge";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";

// --------------------------------------------------
//   State
// --------------------------------------------------

const useLayout = (initialStateObj) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [ISO8601, setISO8601] = useState(
    lodashGet(initialStateObj, ["ISO8601"], moment().utc().toISOString())
  );

  const [headerObj, setHeaderObj] = useState(
    lodashGet(initialStateObj, ["headerObj"], {})
  );
  const [dialogObj, setDialogOpen] = useState({ open: false });
  const [loadingObj, setLoadingObj] = useState({});
  const [videoObj, setVideoObj] = useState({});
  const [navigationForLightbox, setNavigationForLightbox] = useState(true);

  const [cardPlayersObj, setCardPlayersObj] = useState({});
  const [dialogCardOpen, setDialogCardOpen] = useState(false);
  const [dialogCardObj, setDialogCardObj] = useState({});

  const [dialogAchievementOpen, setDialogAchievementOpen] = useState(false);
  const [dialogAchievementObj, setDialogAchievementObj] = useState({});
  const [
    dialogAchievementSelectedTitles_idsArr,
    setDialogAchievementSelectedTitles_idsArr,
  ] = useState([]);

  const [dialogTermsOfServiceOpen, setDialogTermsOfServiceOpen] = useState(
    false
  );

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  // ---------------------------------------------
  //   - Dialog
  // ---------------------------------------------

  const handleDialogOpen = ({ title, description, handle, argumentsObj }) => {
    setDialogOpen({
      open: true,
      title,
      description,
      handle,
      argumentsObj,
    });
  };

  const handleDialogClose = () => {
    setDialogOpen({
      open: false,
    });
  };

  // ---------------------------------------------
  //   - Loading
  // ---------------------------------------------

  const handleLoadingOpen = ({ position }) => {
    setLoadingObj({
      open: true,
      position,
    });
  };

  const handleLoadingClose = () => {
    setLoadingObj({
      open: false,
    });
  };

  // ---------------------------------------------
  //   - Video
  // ---------------------------------------------

  const handleVideoOpen = ({ videoChannel, videoID }) => {
    // console.log(`
    //   ----------------------------------------\n
    //   /app/@states/layout.js - handleVideoOpen
    // `);

    // console.log(chalk`
    //   videoChannel: {green ${videoChannel}}
    //   videoID: {green ${videoID}}
    // `);

    setVideoObj({
      open: true,
      videoChannel,
      videoID,
    });
  };

  const handleVideoClose = () => {
    setVideoObj({
      open: false,
    });
  };

  // ---------------------------------------------
  //   - ScrollTo
  // ---------------------------------------------

  const handleScrollTo = ({
    to,
    duration = 0,
    delay = 0,
    smooth = "easeInOutQuart",
    offset = -50,
  }) => {
    // --------------------------------------------------
    //   to がない場合は処理停止
    // --------------------------------------------------

    if (!to) {
      return;
    }

    // --------------------------------------------------
    //   scrollTo
    // --------------------------------------------------

    scroller.scrollTo(to, {
      duration,
      delay,
      smooth,
      offset,
    });

    // Events.scrollEvent.register('end', (to, element) => {
    //   // console.log('Events.scrollEvent.register(end)');
    //   this.scrollToEnd = true;
    // });
  };

  // ---------------------------------------------
  //   - Show or Hide Navigation for Lightbox
  // ---------------------------------------------

  const handleNavigationForLightboxShow = () => {
    setNavigationForLightbox(true);
  };

  const handleNavigationForLightboxHide = () => {
    setNavigationForLightbox(false);
  };

  // ---------------------------------------------
  //   - Dialog Card
  // ---------------------------------------------

  /**
   * ダイアログでカードを開く
   * @param {string} cardPlayers_id - プレイヤーカード固有ID
   * @param {boolena} setButtonDisabled - ロード中、ボタンを
   */
  const handleDialogCardOpen = async ({
    enqueueSnackbar,
    intl,
    cardPlayers_id,
    setButtonDisabled,
  }) => {
    try {
      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (!cardPlayers_id) {
        throw new CustomError({
          errorsArr: [{ code: "GmGF8vBhi", messageID: "1YJnibkmh" }],
        });
      }

      // console.log(`
      //   ----- cardPlayersObj -----\n
      //   ${util.inspect(cardPlayersObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   データが存在している場合、既存のデータを表示する
      // ---------------------------------------------

      if (lodashHas(cardPlayersObj, [cardPlayers_id])) {
        setDialogCardObj(cardPlayersObj[cardPlayers_id]);

        // ---------------------------------------------
        //   データが存在していない場合、 fetch で取得して表示する
        // ---------------------------------------------
      } else {
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
          cardPlayers_id,
        };

        // ---------------------------------------------
        //   Fetch
        // ---------------------------------------------

        const resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/card-players/find-one`,
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
        //   Update
        // ---------------------------------------------

        const cardPlayersMergedObj = lodashMerge(
          cardPlayersObj,
          lodashGet(resultObj, ["data"], {})
        );
        setCardPlayersObj(cardPlayersMergedObj);

        setDialogCardObj(lodashGet(resultObj, ["data", cardPlayers_id], {}));

        // ---------------------------------------------
        //   Button Enable
        // ---------------------------------------------

        setButtonDisabled(false);

        // ---------------------------------------------
        //   Loading Close
        // ---------------------------------------------

        handleLoadingClose();

        // ---------------------------------------------
        //   console.log
        // ---------------------------------------------

        // console.log(`
        //   ----------------------------------------\n
        //   /app/@states/layout.js - handleDialogCardOpen
        // `);

        // console.log(chalk`
        //   cardPlayers_id: {green ${cardPlayers_id}}
        // `);

        // console.log(`
        //   ----- resultObj -----\n
        //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }

      // ---------------------------------------------
      //   ダイアログを開く
      // ---------------------------------------------

      setDialogCardOpen(true);
    } catch (errorObj) {
      // ---------------------------------------------
      //   Snackbar: Error
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        errorObj,
      });
    }
  };

  const handleDialogCardClose = () => {
    setDialogCardOpen(false);
  };

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/@states/layout.js
  // `);

  // console.log(`
  //   ----- initialStateObj -----\n
  //   ${util.inspect(initialStateObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    ISO8601,
    setISO8601,

    headerObj,
    setHeaderObj,

    dialogObj,
    handleDialogOpen,
    handleDialogClose,

    loadingObj,
    handleLoadingOpen,
    handleLoadingClose,

    videoObj,
    handleVideoOpen,
    handleVideoClose,

    handleScrollTo,

    navigationForLightbox,
    handleNavigationForLightboxShow,
    handleNavigationForLightboxHide,

    cardPlayersObj,
    setCardPlayersObj,

    dialogCardOpen,
    handleDialogCardOpen,
    handleDialogCardClose,
    dialogCardObj,

    dialogAchievementOpen,
    setDialogAchievementOpen,
    dialogAchievementObj,
    setDialogAchievementObj,
    dialogAchievementSelectedTitles_idsArr,
    setDialogAchievementSelectedTitles_idsArr,

    dialogTermsOfServiceOpen,
    setDialogTermsOfServiceOpen,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export const ContainerStateLayout = createContainer(useLayout);

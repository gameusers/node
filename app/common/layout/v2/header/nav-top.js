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

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { useSpring, animated } from "react-spring";
import moment from "moment";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/ja_JP";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";
import lodashCloneDeep from "lodash/cloneDeep";
import lodashMerge from "lodash/merge";
import lodashThrottle from "lodash/throttle";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { makeStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconLogin from "@material-ui/icons/ExitToApp";
import IconNotifications from "@material-ui/icons/Notifications";
import IconSearch from "@material-ui/icons/Search";
import IconPerson from "@material-ui/icons/Person";
import IconEject from "@material-ui/icons/Eject";
import IconAchievement from "@material-ui/icons/EmojiEvents";
import IconGavel from "@material-ui/icons/Gavel";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";
// import { getCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import CardGc from "app/common/community-list/v2/card-gc.js";
import CardUc from "app/common/community-list/v2/card-uc.js";
import CardPlayer from "app/common/card/v2/card-player.js";

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  paper: {
    top: 0,
    right: 0,
    marginTop: 14,
    marginRight: 14,
  },

  paperSearch: {
    top: 0,
    left: 0,
    right: 0,
    width: "600px",
    margin: "60px auto 0",
    padding: "14px",
  },

  input: {
    fontSize: "12px",
    color: "#666",
    padding: "6px 26px 6px 12px",
  },
});

// --------------------------------------------------
//   Components
// --------------------------------------------------

/**
 * react-spring
 * 参考：https://www.react-spring.io/
 */
const Container = ({ children, showNavTop }) => {
  // console.log(chalk`
  //   showNavTop: {green ${showNavTop}}
  // `);

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const props = useSpring({
    transform: showNavTop ? "translateY(0px)" : "translateY(-53px)",
    config: { duration: 250 },
  });

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <animated.header
      css={css`
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        background-color: white;
        width: 100%;
        height: 53px;
        position: sticky;
        top: 0;
        z-index: 1001;
      `}
      style={props}
    >
      {children}
    </animated.header>
  );
};

/**
 * <MenuItem> を Next.js の <Link> で囲うとエラーが出るのでこういう書き方をしている
 * 参考：https://qiita.com/ainehanta/items/44fe664b4b2b0adf213b
 */
const LinkMenuItem = React.forwardRef((props, ref) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { href, func, ...other } = props;

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Link href={href}>
      <a className="link">
        <MenuItem onClick={func} ref={ref} {...other} />
      </a>
    </Link>
  );
});

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    showNavTop,
    setShowNavTop,
    setLowerNavMain,
    setLowerSidebar,
    heroImageHeight,
    scrollToEnd,
    setScrollToEnd,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  const [searchType, setSearchType] = useState("gc");
  const [searchKeyword, setSearchKeyword] = useState("");
  // 製品版の場合、ページアクセス後フォーカスが検索フォームに行くが、開発版の場合は行かない
  const [searchOnFocus, setSearchOnFocus] = useState(true);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [searchResultsObj, setSearchResultsObj] = useState({});
  const searchRef = useRef(null);

  useEffect(() => {
    // ---------------------------------------------
    //   EventListener: scroll
    // ---------------------------------------------

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [heroImageHeight, scrollToEnd]);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();

  const { login, loginUsersObj } = stateUser;

  const {
    handleLoadingOpen,
    handleLoadingClose,
    setDialogAchievementOpen,
    setDialogAchievementObj,
    setDialogAchievementSelectedTitles_idsArr,
  } = stateLayout;

  const role = lodashGet(loginUsersObj, ["role"], "");
  const administrator = role === "administrator" ? true : false;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  let scrollYOffset = 0;
  const navTopHeight = 53;

  /**
   * スクロール時の処理
   */
  const handleScroll = useCallback(
    lodashThrottle(() => {
      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const scrollY = window.scrollY;
      let scrollUp = false;

      let showNavTopNew = true;
      let lowerNavMainNew = false;
      let lowerSidebarNew = false;

      // console.log(chalk`
      //   handleScroll
      //   scrollToEnd: {green ${scrollToEnd}}
      //   scrollY: {green ${scrollY}}
      // `);

      // ---------------------------------------------
      //   Scroll Up / Scroll Down
      // ---------------------------------------------

      scrollUp = scrollY > scrollYOffset ? false : true;

      // ---------------------------------------------
      //   ヒーローイメージの高さよりもスクロールが小さい場合（スクロールバーのノブが上の方にある場合）
      // ---------------------------------------------

      if (heroImageHeight < scrollY) {
        showNavTopNew = scrollUp ? true : false;
      }

      // ---------------------------------------------
      //   上向きのスクロールで Navigation Top が表示中の場合、Navigation Main の位置を下げる
      // ---------------------------------------------

      if (navTopHeight + heroImageHeight < scrollY) {
        if (scrollUp && showNavTopNew) {
          lowerNavMainNew = true;
        }

        // サイドバーの位置を下げる
        lowerSidebarNew = true;
      }

      // ---------------------------------------------
      //   過去のスクロール量を記録
      // ---------------------------------------------

      scrollYOffset = scrollY;

      // ---------------------------------------------
      //   デバイスの横幅が狭い場合（スマホなど）はサイドバーの位置を下げない
      // ---------------------------------------------

      if (window.innerWidth <= 947) {
        lowerSidebarNew = false;
      }

      // ---------------------------------------------
      //   scrollY === 0 / スクロールしていない状態、処理停止
      // ---------------------------------------------

      if (scrollY === 0) {
        setShowNavTop(true);
        setLowerNavMain(false);
        setLowerSidebar(false);

        return;

        // ---------------------------------------------
        //   ScrollTo で移動した場合の処理
        // ---------------------------------------------
      } else if (scrollToEnd) {
        setScrollToEnd(false);

        return;
      }

      // ---------------------------------------------
      //   State 更新
      // ---------------------------------------------

      setShowNavTop(showNavTopNew);
      setLowerNavMain(lowerNavMainNew);
      setLowerSidebar(lowerSidebarNew);

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/layout/components/header/nav-top.js - handleScroll
      // `);

      // console.log(chalk`
      //   showNavTopNew: {green ${showNavTopNew}}
      //   lowerNavMainNew: {green ${lowerNavMainNew}}
      //   lowerSidebarNew: {green ${lowerSidebarNew}}
      // `);

      // console.log(chalk`
      //   scrollY: {green ${scrollY}}
      //   scrollUp: {green ${scrollUp}}
      //   showNavTop: {green ${showNavTop}}
      //   showNavTopNew: {green ${showNavTopNew}}
      // `);

      // console.log(chalk`
      //   scrollY: {green ${scrollY}}
      //   this.navTopHeight: {green ${this.navTopHeight}}
      //   headerHeroImageHeight: {green ${headerHeroImageHeight}}
      //   scrollUp: {green ${scrollUp}}
      // `);
    }, 100),
    [heroImageHeight, scrollToEnd]
  );

  /**
   * 実績ダイアログを開く - 編集用データを読み込む
   */
  const handleDialogAchievementOpen = async () => {
    try {
      // ---------------------------------------------
      //   Loading Open
      // ---------------------------------------------

      handleLoadingOpen({});

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {};

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/achievements/get-edit-data`,
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
      //   Set Form Data
      // ---------------------------------------------

      setDialogAchievementObj(lodashGet(resultObj, ["data"], {}));
      setDialogAchievementSelectedTitles_idsArr(
        lodashGet(
          resultObj,
          ["data", "experiencesObj", "selectedTitles_idsArr"],
          []
        )
      );

      // ---------------------------------------------
      //   Dialog Open
      // ---------------------------------------------

      setDialogAchievementOpen(true);
      setLoginMenuOpen(false);

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/layout/v2/header/nav-top.js - handleDialogAchievementOpen
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
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
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  /**
   * 検索キーワードを入力する
   * @param {string} keyword - キーワード
   */
  const handleSearchKeyword = async ({ keyword }) => {
    // ---------------------------------------------
    //   キーワード更新
    // ---------------------------------------------

    setSearchKeyword(keyword);

    // console.log("searchRef.current = " + searchRef.current);

    // ---------------------------------------------
    //   入力完了後に検索結果を読み込む
    //   文字の入力ごとにデータベースにアクセスするのを防ぐ
    //   参考：https://rios-studio.com/?p=270
    // ---------------------------------------------

    // 連続でキーワードが入力された場合は処理をクリア
    if (searchRef.current) {
      // console.log("clearTimeout = " + searchRef.current);
      clearTimeout(searchRef.current);
    }

    // キーワードの入力後、一定時間が過ぎてから読み込む
    searchRef.current = setTimeout(
      () => handleRead({ type: searchType, keyword }),
      500
    );
    // searchRef.current = setTimeout(() => handleTest(searchRef.current), 3000);
    // console.log("setTimeout = " + searchRef.current);
  };

  /**
   * 検索結果を読み込む
   * @param {string} keyword - キーワード
   * @param {number} page - ページ
   */
  const handleRead = async ({ type, keyword, page }) => {
    try {
      // ---------------------------------------------
      //   Type 変更
      // ---------------------------------------------

      if (searchType !== type) {
        setSearchType(type);
      }

      // ---------------------------------------------
      //   0文字の場合、処理停止
      // ---------------------------------------------

      if (keyword.length < 1) {
        setSearchResultsObj({});
        return;
      }

      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const listObj = lodashGet(searchResultsObj, [`${type}ListObj`], "");
      const pageObj = lodashGet(listObj, [`page${page}Obj`], "");
      const loadedDate = lodashGet(pageObj, ["loadedDate"], "");

      // ---------------------------------------------
      //   再読込するかどうか
      // ---------------------------------------------

      let reload = false;

      if (searchKeyword !== keyword) {
        // 検索キーワードに変更があった場合
        reload = true;
      } else if (loadedDate) {
        // 最後の読み込みからある程度時間（30分）が経っていた場合、再読込する
        const datetimeNow = moment().utcOffset(0);
        const datetimeReloadLimit = moment(loadedDate)
          .add(process.env.NEXT_PUBLIC_SEARCH_RELOAD_MINUTES, "m")
          .utcOffset(0);

        if (datetimeNow.isAfter(datetimeReloadLimit)) {
          reload = true;
        }
      }

      // ---------------------------------------------
      //   すでにデータを読み込んでいる場合は、ストアのデータを表示する
      // ---------------------------------------------

      if (!reload && pageObj) {
        // console.log("store");

        // ---------------------------------------------
        //   Set Page
        // ---------------------------------------------

        const clonedObj = lodashCloneDeep(listObj);
        lodashSet(clonedObj, ["page"], page);

        if (type === "gc") {
          setSearchResultsObj({
            gcListObj: clonedObj,
          });
        } else if (type === "uc") {
          setSearchResultsObj({
            ucListObj: clonedObj,
          });
        } else if (type === "ur") {
          setSearchResultsObj({
            urListObj: clonedObj,
          });
        }

        // console.log(`
        //   ----- clonedObj -----\n
        //   ${util.inspect(clonedObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // ---------------------------------------------
        //   Return
        // ---------------------------------------------

        return;
      }

      // console.log("fetch");

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
        type,
        keyword,
      };

      if (page) {
        formDataObj.page = page;
      }

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/common/search`,
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

      if (type === "gc") {
        const newObj = lodashGet(resultObj, ["data", "gcListObj"], {});
        const mergedObj = reload ? newObj : lodashMerge(listObj, newObj);
        setSearchResultsObj({
          gcListObj: mergedObj,
        });
      } else if (type === "uc") {
        const newObj = lodashGet(resultObj, ["data", "ucListObj"], {});
        const mergedObj = reload ? newObj : lodashMerge(listObj, newObj);
        setSearchResultsObj({
          ucListObj: mergedObj,
        });
      } else if (type === "ur") {
        const newObj = lodashGet(resultObj, ["data", "urListObj"], {});
        const mergedObj = reload ? newObj : lodashMerge(listObj, newObj);
        setSearchResultsObj({
          urListObj: mergedObj,
        });

        // console.log(`
        //   ----- newObj -----\n
        //   ${util.inspect(newObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- listObj -----\n
        //   ${util.inspect(listObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- mergedObj -----\n
        //   ${util.inspect(mergedObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/common/layout/v2/header/nav-top.js - handleRead
      // `);

      // console.log(chalk`
      //   searchType: {green ${searchType}}
      //   searchKeyword: {green ${searchKeyword}}
      //   type: {green ${type}}
      //   keyword: {green ${keyword}}
      //   page: {green ${page} / ${typeof page}}
      //   loadedDate: {green ${loadedDate} / ${typeof loadedDate}}
      // `);

      // console.log(`
      //   ----- searchResultsObj -----\n
      //   ${util.inspect(searchResultsObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- listObj -----\n
      //   ${util.inspect(listObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- pageObj -----\n
      //   ${util.inspect(pageObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
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

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      // handleScrollTo({
      //   to: `forumComments-${forumThreads_id}`,
      //   duration: 0,
      //   delay: 0,
      //   smooth: "easeInOutQuart",
      //   offset: -50,
      // });
    }
  };

  /**
   * 検索フォームにフォーカスする
   */
  const handleSearchKeywordFocus = () => {
    setSearchOnFocus(true);
    setSearchResultsOpen(true);
  };

  /**
   * 検索結果を閉じる
   */
  const handleSearchResultsClose = () => {
    if (!searchOnFocus && searchResultsOpen) {
      setSearchResultsOpen(false);
    }
  };

  // --------------------------------------------------
  //   ログインメニュー用
  // --------------------------------------------------

  const userID = lodashGet(loginUsersObj, ["userID"], "");

  const imagesAndVideosThumbnailArr = lodashGet(
    loginUsersObj,
    ["cardPlayerObj", "imagesAndVideosThumbnailObj", "arr"],
    []
  );

  let thumbnailSrc = "/img/common/thumbnail/none.svg";
  let thumbnailSrcSet = "";

  if (imagesAndVideosThumbnailArr.length > 0) {
    thumbnailSrc = lodashGet(
      imagesAndVideosThumbnailArr,
      [0, "src"],
      "/img/common/thumbnail/none.svg"
    );
    thumbnailSrcSet = lodashGet(imagesAndVideosThumbnailArr, [0, "srcSet"], "");
  }

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  let searchListObj = {};

  if (searchType === "gc") {
    searchListObj = lodashGet(searchResultsObj, ["gcListObj"], {});
  } else if (searchType === "uc") {
    searchListObj = lodashGet(searchResultsObj, ["ucListObj"], {});
  } else if (searchType === "ur") {
    searchListObj = lodashGet(searchResultsObj, ["urListObj"], {});
  }

  const searchPage = lodashGet(searchListObj, ["page"], 1);
  const searchCount = lodashGet(searchListObj, ["count"], 0);
  const searchLimit = parseInt(
    searchListObj.limit || process.env.NEXT_PUBLIC_SEARCH_LIMIT,
    10
  );

  const searchArr = lodashGet(
    searchListObj,
    [`page${searchPage}Obj`, "arr"],
    []
  );

  // --------------------------------------------------
  //   Component - Search Result List
  // --------------------------------------------------

  const componentsSearchResultsListArr = [];

  for (const [index, _id] of searchArr.entries()) {
    // dataObj
    const dataObj = lodashGet(searchListObj, ["dataObj", _id], {});

    //   console.log(`
    //   ----- dataObj -----\n
    //   ${util.inspect(dataObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // push
    if (searchType === "gc") {
      componentsSearchResultsListArr.push(<CardGc key={index} obj={dataObj} />);
    } else if (searchType === "uc") {
      componentsSearchResultsListArr.push(<CardUc key={index} obj={dataObj} />);
    } else if (searchType === "ur") {
      componentsSearchResultsListArr.push(
        <div
          css={css`
            ${index === 0 ? "margin: 0" : "margin: 16px 0 0 0"};
          `}
          key={index}
        >
          {/* Card */}
          <CardPlayer
            obj={dataObj}
            showFollow={true}
            showEditButton={false}
            defaultExpanded={false}
            // cardPlayersObj={cardPlayersObj}
            // setCardPlayersObj={setCardPlayersObj}
          />
        </div>
      );
    }
  }

  // --------------------------------------------------
  //   Component - Search Result
  // --------------------------------------------------

  let componentSearchResults = "";

  if (searchResultsOpen && searchKeyword) {
    componentSearchResults = (
      <ClickAwayListener onClickAway={handleSearchResultsClose}>
        <Paper
          css={css`
            max-width: 600px;
            max-height: 70vh;
            overflow: auto;
            box-sizing: border-box;

            position: fixed;
            top: 0;
            left: 0;
            right: 0;

            margin: 62px auto 0;
            padding: 14px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          `}
          // elevation={12}
        >
          <div
            css={css`
              margin: 0 0 20px 0;
            `}
          >
            <ButtonGroup
              disabled={buttonDisabled}
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                onClick={() =>
                  handleRead({
                    type: "gc",
                    keyword: searchKeyword,
                    page: 1,
                  })
                }
              >
                <span
                  css={css`
                    font-weight: ${searchType === "gc" ? "bold" : "normal"};
                  `}
                >
                  ゲームC
                </span>
              </Button>
              <Button
                onClick={() =>
                  handleRead({
                    type: "uc",
                    keyword: searchKeyword,
                    page: 1,
                  })
                }
              >
                <span
                  css={css`
                    font-weight: ${searchType === "uc" ? "bold" : "normal"};
                  `}
                >
                  ユーザーC
                </span>
              </Button>
              <Button
                onClick={() =>
                  handleRead({
                    type: "ur",
                    keyword: searchKeyword,
                    page: 1,
                  })
                }
              >
                <span
                  css={css`
                    font-weight: ${searchType === "ur" ? "bold" : "normal"};
                  `}
                >
                  ユーザー
                </span>
              </Button>
            </ButtonGroup>
          </div>

          {componentsSearchResultsListArr}

          {/* Pagination */}
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              padding: 0 0 0 0;
              margin: 12px 0 0 0;
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
                    type: searchType,
                    keyword: searchKeyword,
                    page,
                  })
                }
                pageSize={searchLimit}
                current={searchPage}
                total={searchCount}
                locale={localeInfo}
              />
            </div>
          </div>
        </Paper>
      </ClickAwayListener>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/header/nav-top.js
  // `);

  // console.log(chalk`
  //   login: {green ${login}}
  // `);

  // console.log(`
  //   ----- loginUsersObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(loginUsersObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Container showNavTop={showNavTop}>
      {/* ロゴ */}
      <Link href="/">
        <a className="link">
          <div
            css={css`
              width: 138px;
              height: 43px;
              background-image: url("/img/common/header/logo.png");
              cursor: pointer;
              margin: 0 0 0 6px;

              @media screen and (max-width: 480px) {
                width: 30px;
                min-width: 30px;
                height: 43px;
                background-image: url("/img/common/header/logo-mobile.png");
                margin: 0 0 0 10px;
              }
            `}
          />
        </a>
      </Link>

      {/* ベル・通知 */}
      {/*{userID &&
          <IconButton
            css={css`
              && {
                margin: 6px 0 0 6px !important;
                padding: 6px !important;

                @media screen and (max-width: 480px) {
                  width: 26px;
                }
              }
            `}
            onClick={stores.layout.handleHeaderNotificationDialogOpen}
          >
            <Badge
              css={css`
                color: black;
              `}
              badgeContent={5}
              color="primary"
            >
              <IconNotifications />
            </Badge>
          </IconButton>
        }*/}

      {/* 検索フォーム */}
      <div
        css={css`
          display: flex;
          flex-grow: 1;
          justify-content: center;
          margin-left: auto;
        `}
        onFocus={handleSearchKeywordFocus}
        onBlur={() => setSearchOnFocus(false)}
      >
        {/* テキストフィールド */}
        <TextField
          css={css`
            && {
              width: 90%;
            }
          `}
          autoFocus={true}
          placeholder="検索"
          value={searchKeyword}
          onChange={(eventObj) =>
            handleSearchKeyword({ keyword: eventObj.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            ),
          }}
          inputProps={{
            autoComplete: "off",
          }}
        />
      </div>

      {/* 検索結果 */}
      {componentSearchResults}

      {/* 右寄せ（検索フォームを非表示にした場合、代わりにこのタグで右寄せにしている） */}
      <div
        css={css`
          display: flex;
          // flex-grow: 1;
          justify-content: flex-end;
          margin-left: auto;
        `}
      >
        {/* サムネイルまたはログインページへのリンク */}
        {login ? (
          <IconButton
            css={css`
              && {
                margin: 0 8px 0 auto;
                padding: 0;
              }
            `}
            onClick={() => setLoginMenuOpen(true)}
          >
            <Avatar
              alt="ログインメニュー"
              src={thumbnailSrc}
              srcSet={thumbnailSrcSet}
            />
          </IconButton>
        ) : (
          <Link href="/login">
            <a>
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                  color: #4000ff;
                  cursor: pointer;
                  white-space: nowrap;
                  margin: 0 16px 0 0;

                  @media screen and (max-width: 480px) {
                    margin: 0 10px 0 0;
                  }
                `}
              >
                <IconLogin
                  css={css`
                    && {
                      margin: 0 6px 0 0;
                    }
                  `}
                />{" "}
                ログイン
              </div>
            </a>
          </Link>
        )}
      </div>

      {/* ログインメニュー */}
      <Menu
        classes={{
          paper: classes.paper,
        }}
        open={loginMenuOpen}
        onClose={() => setLoginMenuOpen(false)}
        disableAutoFocusItem={true}
        anchorReference="none"
      >
        {/* 管理 */}
        {administrator && (
          <LinkMenuItem
            href={`/administration`}
            func={() => setLoginMenuOpen(false)}
          >
            <ListItemIcon>
              <IconGavel />
            </ListItemIcon>

            <ListItemText
              css={css`
                && {
                  margin: 0 8px 0 0;
                }
              `}
              primary="管理"
            />
          </LinkMenuItem>
        )}

        {/* ユーザー */}
        <LinkMenuItem
          href={`/ur/${userID}`}
          func={() => setLoginMenuOpen(false)}
        >
          <ListItemIcon>
            <IconPerson />
          </ListItemIcon>

          <ListItemText
            css={css`
              && {
                margin: 0 8px 0 0;
              }
            `}
            primary="ユーザー"
          />
        </LinkMenuItem>

        {/* 実績 */}
        <MenuItem onClick={() => handleDialogAchievementOpen()}>
          <ListItemIcon>
            <IconAchievement />
          </ListItemIcon>

          <ListItemText
            css={css`
              && {
                margin: 0 8px 0 0;
              }
            `}
            primary="実績"
          />
        </MenuItem>

        {/* ログアウト */}
        <LinkMenuItem href="/logout" func={() => setLoginMenuOpen(false)}>
          <ListItemIcon>
            <IconEject />
          </ListItemIcon>

          <ListItemText
            css={css`
              && {
                margin: 0 8px 0 0;
              }
            `}
            primary="ログアウト"
          />
        </LinkMenuItem>
      </Menu>
    </Container>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { useSpring, animated } from "react-spring";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
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

  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

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

  // --------------------------------------------------
  //   loginUsersObj
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
      {/*<div
          css={css`
            display: flex;
            flex-grow: 1;
            justify-content: center;
            margin-left: auto;
          `}
        >
          <TextField
            css={css`
              && {
                width: 90%;
              }
            `}
            placeholder="検索"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch />
                </InputAdornment>
              ),
            }}
            inputProps={{
              autoComplete: "off"
            }}
          />
        </div>*/}

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

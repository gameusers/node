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

import Link from "next/link";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

// import lodashGet from 'lodash/get';
// import lodashSet from 'lodash/set';
// import lodashThrottle from 'lodash/throttle';

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

// ---------------------------------------------
//   Material UI / Icon
// ---------------------------------------------

import IconHome from "@material-ui/icons/Home";
import IconLogin from "@material-ui/icons/ExitToApp";
import IconLogout from "@material-ui/icons/Eject";
import IconMail from "@material-ui/icons/MailOutline";
import IconLock from "@material-ui/icons/Lock";

import IconGames from "@material-ui/icons/Games";
import IconCommunityList from "@material-ui/icons/Style";
import IconAddCircle from "@material-ui/icons/AddCircle";

import IconUserCommunity from "@material-ui/icons/SupervisedUserCircle";
import IconMembers from "@material-ui/icons/SentimentSatisfiedAlt";
import IconUser from "@material-ui/icons/Person";
import IconFollow from "@material-ui/icons/FilterNone";
import IconList from "@material-ui/icons/List";
import IconSetting from "@material-ui/icons/Settings";

import IconForum from "@material-ui/icons/Forum";
import IconDescription from "@material-ui/icons/Description";
import IconIndividual from "@material-ui/icons/DoubleArrow";
import IconSearch from "@material-ui/icons/Search";

import IconAdministration from "@material-ui/icons/Gavel";

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

  const { arr = [], sidebar = false } = props;

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, valueObj] of arr.entries()) {
    // --------------------------------------------------
    //   Icon & Anchor Text
    // --------------------------------------------------

    let icon = "";
    let anchorText = "";

    // --------------------------------------------------
    //   - Login
    // --------------------------------------------------

    if (valueObj.type === "login") {
      icon = <IconLogin fontSize="small" />;
      anchorText = "ログイン";
    } else if (valueObj.type === "login/account") {
      icon = <IconUser fontSize="small" />;
      anchorText = "アカウント作成";
    } else if (
      valueObj.type === "login/reset-password" ||
      valueObj.type === "confirm/reset-password"
    ) {
      icon = <IconLock fontSize="small" />;
      anchorText = "パスワード再設定";

      // --------------------------------------------------
      //   - Logout
      // --------------------------------------------------
    } else if (valueObj.type === "logout") {
      icon = <IconLogout fontSize="small" />;
      anchorText = "ログアウト";

      // --------------------------------------------------
      //   - 確認 / メールアドレス
      // --------------------------------------------------
    } else if (valueObj.type === "confirm/email") {
      icon = <IconMail fontSize="small" />;
      anchorText = "メールアドレス確認";

      // --------------------------------------------------
      //   - お問い合わせ / お問い合わせフォーム
      // --------------------------------------------------
    } else if (valueObj.type === "inquiry/form") {
      icon = <IconMail fontSize="small" />;
      anchorText = "お問い合わせフォーム";

      // --------------------------------------------------
      //   - お問い合わせ / アカウント移行フォーム
      // --------------------------------------------------
    } else if (valueObj.type === "inquiry/account") {
      icon = <IconMail fontSize="small" />;
      anchorText = "アカウント移行フォーム";

      // --------------------------------------------------
      //   - Game Community
      // --------------------------------------------------
    } else if (valueObj.type === "gc/list") {
      icon = <IconCommunityList fontSize="small" />;
      anchorText = "ゲームコミュニティ";
    } else if (
      valueObj.type === "gc/list/search" ||
      valueObj.type === "gc/register/search"
    ) {
      icon = <IconSearch fontSize="small" />;
      anchorText = "検索";
    } else if (valueObj.type === "gc/register") {
      icon = <IconAddCircle fontSize="small" />;
      anchorText = "ゲーム登録";
    } else if (valueObj.type === "gc/index") {
      icon = <IconGames fontSize="small" />;
      anchorText = valueObj.anchorText;
    } else if (valueObj.type === "gc/forum" || valueObj.type === "uc/forum") {
      icon = <IconForum fontSize="small" />;
      anchorText = "フォーラム";
    } else if (valueObj.type === "gc/rec") {
      icon = <IconDescription fontSize="small" />;
      anchorText = "募集";
    } else if (
      valueObj.type === "gc/forum/individual" ||
      valueObj.type === "gc/rec/individual" ||
      valueObj.type === "uc/forum/individual"
    ) {
      icon = <IconIndividual fontSize="small" />;
      anchorText = valueObj.anchorText;
    } else if (valueObj.type === "gc/rec/search") {
      icon = <IconSearch fontSize="small" />;
      anchorText = "検索";
    } else if (valueObj.type === "gc/follower") {
      icon = <IconFollow fontSize="small" />;
      anchorText = "フォロワー";

      // --------------------------------------------------
      //   - User Community
      // --------------------------------------------------
    } else if (valueObj.type === "uc/list") {
      icon = <IconCommunityList fontSize="small" />;
      anchorText = "ユーザーコミュニティ";
    } else if (
      valueObj.type === "uc/list/search" ||
      valueObj.type === "uc/register/search"
    ) {
      icon = <IconSearch fontSize="small" />;
      anchorText = "検索";
    } else if (valueObj.type === "uc/register") {
      icon = <IconAddCircle fontSize="small" />;
      anchorText = "ユーザーコミュニティ作成";
    } else if (valueObj.type === "uc/index") {
      icon = <IconUserCommunity fontSize="small" />;
      anchorText = valueObj.anchorText;
    } else if (valueObj.type === "uc/member") {
      icon = <IconMembers fontSize="small" />;
      anchorText = "メンバー";
    } else if (valueObj.type === "uc/setting") {
      icon = <IconSetting fontSize="small" />;
      anchorText = "ユーザーコミュニティ設定";

      // --------------------------------------------------
      //   - User
      // --------------------------------------------------
    } else if (valueObj.type === "ur") {
      icon = <IconUser fontSize="small" />;
      anchorText = "ユーザー";
    } else if (valueObj.type === "ur/follow") {
      icon = <IconFollow fontSize="small" />;
      anchorText = "フォロー";
    } else if (valueObj.type === "ur/follow/list") {
      icon = <IconList fontSize="small" />;
      anchorText = "一覧";
    } else if (valueObj.type === "ur/setting") {
      icon = <IconSetting fontSize="small" />;
      anchorText = "ユーザー設定";

      // --------------------------------------------------
      //   - Administration
      // --------------------------------------------------
    } else if (valueObj.type === "administration") {
      icon = <IconAdministration fontSize="small" />;
      anchorText = "Administration";
    }

    // --------------------------------------------------
    //   push
    // --------------------------------------------------

    componentsArr.push(
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
        `}
        key={`breadcrumbs-${index}`}
      >
        {icon}

        <div
          css={css`
            font-size: 14px;
            margin: 0 0 0 4px;
          `}
        >
          {valueObj.href ? (
            <Link href={valueObj.href}>
              <a className="link">{anchorText}</a>
            </Link>
          ) : (
            <h1
              css={css`
                font-size: 14px;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.87);
                margin: 0 0 0 4px;
              `}
            >
              {anchorText}
            </h1>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/breadcrumbs.js
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Paper
      css={css`
        margin: 0 0 16px 0;
        padding: 10px 12px;

        ${sidebar
          ? `
              display: none;

              @media screen and (max-width: 947px) {
                // margin: 0;
                display: inherit;
              }
            `
          : `
              display: inherit;

              @media screen and (max-width: 947px) {
                display: none;
              }
            `}
      `}
      component="nav"
    >
      <Breadcrumbs separator="›" aria-label="breadcrumb" component="div">
        <div
          css={css`
            display: flex;
            flex-flow: row wrap;
          `}
        >
          <IconHome fontSize="small" />

          <div
            css={css`
              font-size: 14px;
              cursor: pointer;
              margin: 0 0 0 4px;
            `}
          >
            <Link href={"/"} as={"/"}>
              <a className="link">Game Users</a>
            </Link>
          </div>
        </div>

        {componentsArr}
      </Breadcrumbs>
    </Paper>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

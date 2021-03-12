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
import Link from "next/link";
import Error from "next/error";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import moment from "moment";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";
import { getCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Layout from "app/common/layout/v2/layout.js";

// --------------------------------------------------
//   Function Components
//   URL: http://localhost:8080/initialize
// --------------------------------------------------

/**
 * レイアウト
 * @param {Object} props - Props
 */
const ContainerLayout = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  // const {

  //   feedObj = {},

  // } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { handleLoadingOpen, handleLoadingClose } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * データベースに初期データを挿入する
   */
  const handleInitializeDB = async () => {
    try {
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

      const formData = new FormData();

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v1/initialize/db`,
        methodType: "POST",
        formData,
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

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "EEpHdbjPr",
          },
        ],
      });
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
    }
  };

  /**
   * インデックスを削除する
   */
  const handleDropIndexes = async () => {
    try {
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

      const formData = new FormData();

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v1/initialize/drop-indexes`,
        methodType: "POST",
        formData,
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

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "dusYj_Gh3",
          },
        ],
      });
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
    }
  };

  // --------------------------------------------------
  //   urlBase
  // --------------------------------------------------

  const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   pages/initialize.js
  // `);

  // console.log(`
  //   ----- props -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(props)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Component - Contents
  // --------------------------------------------------

  const componentContent = (
    <React.Fragment>
      <h1>データベース</h1>
      <p>
        以下のボタンを押すと、MongoDB の gameusers
        データベース内に、初期データを挿入します。データを初期状態に戻したいときにも利用できます。
      </p>

      <Button
        variant="contained"
        disabled={buttonDisabled}
        onClick={handleInitializeDB}
      >
        データベース - データ挿入
      </Button>

      <br />
      <br />

      <h1>データベースのインデックスを削除する</h1>
      <p>
        データベースのインデックスをすべて削除します。開発中不要なインデックスができてしまった場合、利用してください。
      </p>

      <Button
        variant="contained"
        disabled={buttonDisabled}
        onClick={handleDropIndexes}
      >
        データベース - インデックス削除
      </Button>

      <br />
      <br />

      <h1>開発中の主要ページ</h1>
      <p>
        開発の状況により、正常にアクセスできないページが出てくることがあります。
      </p>

      <p>
        トップページ
        <br />
        <a href={urlBase} target="_blank">
          {urlBase}
        </a>
      </p>

      <p>
        ユーザーコミュニティ一覧
        <br />
        <a href={`${urlBase}uc/list`} target="_blank">{`${urlBase}uc/list`}</a>
      </p>

      <p>
        ゲームコミュニティ一覧
        <br />
        <a href={`${urlBase}gc/list`} target="_blank">{`${urlBase}gc/list`}</a>
      </p>

      <p>
        ログイン
        <br />
        <a href={`${urlBase}login`} target="_blank">{`${urlBase}login`}</a>
      </p>

      <p>
        ログアウト
        <br />
        <a href={`${urlBase}logout`} target="_blank">{`${urlBase}logout`}</a>
      </p>

      <p>
        ゲームコミュニティ（現在はこのページを作成中）
        <br />
        <a
          href={`${urlBase}gc/Dead-by-Daylight`}
          target="_blank"
        >{`${urlBase}gc/Dead-by-Daylight`}</a>
      </p>

      <p>
        ユーザーコミュニティ
        <br />
        <a
          href={`${urlBase}uc/community1`}
          target="_blank"
        >{`${urlBase}uc/community1`}</a>
      </p>

      <p>
        ユーザー
        <br />
        <a
          href={`${urlBase}ur/user1`}
          target="_blank"
        >{`${urlBase}ur/user1`}</a>
      </p>

      <br />
      <br />

      <h1>ログイン情報</h1>

      <p>1. ログインID：8OM0dhDak　パスワード：8OM0dhDak0</p>
      <p>2. ログインID：enPLLYBBEg3y　パスワード：enPLLYBBEg3y0</p>
      <p>3. ログインID：nzPR7R9GO　パスワード：nzPR7R9GO0</p>

      <p>Administrator: ログインID：sTXPyssv8　パスワード：sTXPyssv80</p>
    </React.Fragment>
  );
  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Layout
      title={props.title}
      // componentSidebar={}
      componentContent={componentContent}
      headerObj={props.headerObj}
      headerNavMainArr={props.headerNavMainArr}
    />
  );
};

/**
 * コンポーネント / このページ独自のステートを設定する
 * @param {Object} props - Props
 */
const Component = (props) => {
  // --------------------------------------------------
  //   Error
  //   参考：https://nextjs.org/docs/advanced-features/custom-error-page#reusing-the-built-in-error-page
  // --------------------------------------------------

  if (props.statusCode !== 200) {
    return <Error statusCode={props.statusCode} />;
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return <ContainerLayout {...props} />;
};

/**
 * getServerSideProps
 * @param {Object} req - リクエスト
 * @param {Object} res - レスポンス
 * @param {Object} query - クエリー
 */
export async function getServerSideProps({ req, res, query }) {
  // --------------------------------------------------
  //   Cookie & Accept Language
  // --------------------------------------------------

  const reqHeadersCookie = lodashGet(req, ["headers", "cookie"], "");
  const reqAcceptLanguage = lodashGet(req, ["headers", "accept-language"], "");

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const ISO8601 = moment().utc().toISOString();

  // --------------------------------------------------
  //   Get Cookie Data
  // --------------------------------------------------

  const termsOfServiceAgreedVersion = getCookie({
    key: "termsOfServiceAgreedVersion",
    reqHeadersCookie,
  });

  // --------------------------------------------------
  //   Title
  // --------------------------------------------------

  const title = "Game Users Initialize";

  // --------------------------------------------------
  //   Header Navigation Link
  // --------------------------------------------------

  const headerNavMainArr = [];

  // --------------------------------------------------
  //   statusCode
  // --------------------------------------------------

  let statusCode = 200;

  if (process.env.NODE_ENV !== "development") {
    statusCode = 404;
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /pages/logout/index.js
  // `);

  // console.log(`
  //   ----- resultObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    props: {
      reqAcceptLanguage,
      ISO8601,
      termsOfServiceAgreedVersion,
      statusCode,
      login: false,
      loginUsersObj: {},
      title,
      headerObj: {},
      headerNavMainArr,
    },
  };
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

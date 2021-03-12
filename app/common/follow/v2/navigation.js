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
import Router from "next/router";
import { useIntl } from "react-intl";

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

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { setCookie } from "app/@modules/cookie.js";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

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

  const { accessLevel, userID, contentsOrList } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 変更する / ページを移動する
   * @param {string} newCategory - [all / gc / uc / ur]
   * @param {string} newContents - [all / forum / rec]
   * @param {string} newPeriod - [360 / 720 / 1440 / 4320 / 7200 / 14400 / 21600 / 43200]
   */
  const handleChange = async ({ newCategory, newContents, newPeriod }) => {
    // ---------------------------------------------
    //   URL
    // ---------------------------------------------

    const currentCategory = newCategory || category;
    const currentContents = newContents || contents;

    const urlCategory = currentCategory === "all" ? "" : `/${currentCategory}`;
    const urlContents = currentContents === "all" ? "" : `/${currentContents}`;

    const url = `/ur/${userID}/follow${urlCategory}${urlContents}`;

    // ---------------------------------------------
    //   Change Period / Set Cookie
    // ---------------------------------------------

    if (newPeriod) {
      setCookie({ key: "followContentsPeriod", value: newPeriod });
    }

    // console.log(chalk`
    // newCategory: {green ${newCategory}}
    // category: {green ${category}}
    // contents: {green ${contents}}
    // url: {green ${url}}
    // `);

    // ---------------------------------------------
    //   Router.push = History API pushState()
    // ---------------------------------------------

    Router.push(url);
  };

  /**
   * リストタイプを変更する / ページを移動する
   * @param {string} newCategory - [gc / uc / ur]
   */
  const handleChangeList = async ({ newCategory }) => {
    // ---------------------------------------------
    //   Router.push = History API pushState()
    // ---------------------------------------------

    Router.push(`/ur/${userID}/follow/list/${newCategory}`);
  };

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const category = props.category || "all";
  const contents = props.contents || "all";
  const period =
    props.period ||
    parseInt(process.env.NEXT_PUBLIC_FOLLOW_CONTENTS_PERIOD, 10);

  // --------------------------------------------------
  //   Button href
  // --------------------------------------------------

  let hrefContents = `/ur/${userID}/follow`;
  let hrefList = `/ur/${userID}/follow/list/gc`;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/common/follow/v2/navigation.js
  // `);

  // console.log(chalk`
  // followContentsPeriod: {green ${followContentsPeriod} typeof ${typeof followContentsPeriod}}
  // `);

  // console.log(`
  //   ----- searchHardwaresArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(searchHardwaresArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Panel heading="フォロー" defaultExpanded={true} mobileMargin={true}>
      <ButtonGroup
        size="small"
        color="primary"
        aria-label="outlined primary button group"
        disabled={buttonDisabled}
      >
        {/* ゲームC */}
        <Button>
          <Link href={hrefContents}>
            <a className="link">
              <span
                css={css`
                  ${contentsOrList === "contents" && "font-weight: bold"};
                `}
              >
                コンテンツ
              </span>
            </a>
          </Link>
        </Button>

        {/* 一覧 */}
        <Button>
          <Link href={hrefList}>
            <a className="link">
              <span
                css={css`
                  ${contentsOrList === "list" && "font-weight: bold"};
                `}
              >
                一覧
              </span>
            </a>
          </Link>
        </Button>
      </ButtonGroup>

      {/* コンテンツまたはリスト */}
      {contentsOrList === "contents" ? (
        <React.Fragment>
          <div
            css={css`
              margin: 20px 0 0 0;
            `}
          >
            <FormControl>
              {accessLevel >= 50 ? (
                <Select
                  value={category}
                  onChange={(eventObj) =>
                    handleChange({ newCategory: eventObj.target.value })
                  }
                  inputProps={{
                    name: "category",
                    id: "category",
                  }}
                >
                  <MenuItem value="all">すべて</MenuItem>
                  <MenuItem value="gc">ゲームコミュニティ</MenuItem>
                  <MenuItem value="uc">ユーザーコミュニティ</MenuItem>
                  <MenuItem value="ur">ユーザー</MenuItem>
                </Select>
              ) : (
                <Select
                  value={category}
                  onChange={(eventObj) =>
                    handleChange({ newCategory: eventObj.target.value })
                  }
                  inputProps={{
                    name: "category",
                    id: "category",
                  }}
                >
                  <MenuItem value="all">すべて</MenuItem>
                  <MenuItem value="gc">ゲームコミュニティ</MenuItem>
                  <MenuItem value="uc">ユーザーコミュニティ</MenuItem>
                </Select>
              )}

              <FormHelperText>表示するカテゴリー</FormHelperText>
            </FormControl>
          </div>

          <div
            css={css`
              margin: 12px 0 0 0;
            `}
          >
            <FormControl>
              {category === "uc" ? (
                <Select
                  value={contents}
                  onChange={(eventObj) =>
                    handleChange({ newContents: eventObj.target.value })
                  }
                  inputProps={{
                    name: "contents",
                    id: "contents",
                  }}
                >
                  <MenuItem value="all">すべて</MenuItem>
                  <MenuItem value="forum">フォーラム</MenuItem>
                </Select>
              ) : (
                <Select
                  value={contents}
                  onChange={(eventObj) =>
                    handleChange({ newContents: eventObj.target.value })
                  }
                  inputProps={{
                    name: "contents",
                    id: "contents",
                  }}
                >
                  <MenuItem value="all">すべて</MenuItem>
                  <MenuItem value="forum">フォーラム</MenuItem>
                  <MenuItem value="rec">募集</MenuItem>
                </Select>
              )}

              <FormHelperText>表示するコンテンツ</FormHelperText>
            </FormControl>
          </div>

          <div
            css={css`
              margin: 12px 0 0 0;
            `}
          >
            <FormControl>
              <Select
                value={period}
                onChange={(eventObj) =>
                  handleChange({ newPeriod: eventObj.target.value })
                }
                inputProps={{
                  name: "period",
                  id: "period",
                }}
              >
                <MenuItem value="360">6時間</MenuItem>
                <MenuItem value="720">12時間</MenuItem>
                <MenuItem value="1440">1日</MenuItem>
                <MenuItem value="4320">3日</MenuItem>
                <MenuItem value="7200">5日</MenuItem>
                <MenuItem value="14400">10日</MenuItem>
                <MenuItem value="21600">15日</MenuItem>
                <MenuItem value="43200">30日</MenuItem>
              </Select>

              <FormHelperText>コンテンツの取得期間</FormHelperText>
            </FormControl>
          </div>
        </React.Fragment>
      ) : (
        <div
          css={css`
            margin: 20px 0 0 0;
          `}
        >
          <FormControl>
            {accessLevel >= 50 ? (
              <Select
                value={category}
                onChange={(eventObj) =>
                  handleChangeList({ newCategory: eventObj.target.value })
                }
                inputProps={{
                  name: "category",
                  id: "category",
                }}
              >
                <MenuItem value="gc">ゲームコミュニティ</MenuItem>
                <MenuItem value="uc">ユーザーコミュニティ</MenuItem>
                <MenuItem value="ur">ユーザー</MenuItem>
              </Select>
            ) : (
              <Select
                value={category}
                onChange={(eventObj) =>
                  handleChangeList({ newCategory: eventObj.target.value })
                }
                inputProps={{
                  name: "category",
                  id: "category",
                }}
              >
                <MenuItem value="gc">ゲームコミュニティ</MenuItem>
                <MenuItem value="uc">ユーザーコミュニティ</MenuItem>
              </Select>
            )}
          </FormControl>
        </div>
      )}
    </Panel>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

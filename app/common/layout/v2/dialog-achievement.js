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
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashCloneDeep from "lodash/cloneDeep";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Paper from "@material-ui/core/Paper";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconClose from "@material-ui/icons/Close";
import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";

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

// ---------------------------------------------
//   Components
// ---------------------------------------------

import TitleChip from "app/common/title/v2/chip.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssHeadingBlue = css`
  color: #ffffff;
  font-size: 16px;
  position: relative;
  background: #4169e1;
  box-shadow: 10px 0 0 0 #4169e1, -10px 0 0 0 #4169e1,
    0 3px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;

  &:before {
    content: " ";
    position: absolute;
    top: 100%;
    left: -10px;
    width: 0;
    height: 0;
    border-width: 0 10px 10px 0;
    border-style: solid;
    border-color: transparent;
    border-right-color: #4f4f4f;
  }

  &:after {
    content: " ";
    position: absolute;
    top: 100%;
    right: -10px;
    width: 0;
    height: 0;
    border-width: 10px 10px 0 0;
    border-style: solid;
    border-color: transparent;
    border-top-color: #4f4f4f;
  }
`;

const cssHeadingRed = css`
  color: #ffffff;
  font-size: 16px;
  position: relative;
  background: #ff0033;
  box-shadow: 10px 0 0 0 #ff0033, -10px 0 0 0 #ff0033,
    0 3px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;

  &:before {
    content: " ";
    position: absolute;
    top: 100%;
    left: -10px;
    width: 0;
    height: 0;
    border-width: 0 10px 10px 0;
    border-style: solid;
    border-color: transparent;
    border-right-color: #4f4f4f;
  }

  &:after {
    content: " ";
    position: absolute;
    top: 100%;
    right: -10px;
    width: 0;
    height: 0;
    border-width: 10px 10px 0 0;
    border-style: solid;
    border-color: transparent;
    border-top-color: #4f4f4f;
  }
`;

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  root: {
    minHeight: "inherit !important",
    backgroundColor: "#4169e1",
  },

  content: {
    margin: "0 !important",
  },

  expanded: {
    minHeight: "inherit !important",
  },
});

// --------------------------------------------------
//   Components
// --------------------------------------------------

const ComponentPanel = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { heading, defaultExpanded = true } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const classes = useStyles();
  const [panelExpanded, setPanelExpanded] = useState(defaultExpanded);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/dialog-achievement.js
  // `);

  // console.log(chalk`
  //   open: {green ${open}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Accordion
      css={css`
        margin: 24px 0 0 0 !important;
      `}
      expanded={panelExpanded}
    >
      {/* Heading */}
      <AccordionSummary
        css={cssHeadingBlue}
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
        }}
      >
        <h2
          css={css`
            color: white;
            padding-top: 2px;
          `}
        >
          {heading}
        </h2>

        {/* Expansion Button */}
        <div
          css={css`
            margin: 0 0 0 auto;
            padding: 0;
          `}
        >
          <IconButton
            css={css`
              && {
                color: white;
                margin: 0;
                padding: 4px;
              }
            `}
            onClick={() => setPanelExpanded(!panelExpanded)}
            aria-expanded={panelExpanded}
            aria-label="Show more"
            disabled={buttonDisabled}
          >
            {panelExpanded ? <IconExpandLess /> : <IconExpandMore />}
          </IconButton>
        </div>
      </AccordionSummary>

      {/* Contents */}
      <AccordionDetails
        css={css`
          display: flex;
          flex-flow: column wrap;
        `}
      >
        {/* Contents */}
        {props.children}
      </AccordionDetails>
    </Accordion>
  );
};

// --------------------------------------------------
//   Components
// --------------------------------------------------

const Component = (props) => {
  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    setHeaderObj,
    handleLoadingOpen,
    handleLoadingClose,
    dialogAchievementOpen,
    setDialogAchievementOpen,
    dialogAchievementObj,
    dialogAchievementSelectedTitles_idsArr,
    setDialogAchievementSelectedTitles_idsArr,
  } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * フォームを送信する / 表示する称号を保存する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
    // ---------------------------------------------

    eventObj.preventDefault();

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

      const formDataObj = {
        titles_idsArr: dialogAchievementSelectedTitles_idsArr,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/experiences/upsert`,
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
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Update - Header
      // ---------------------------------------------

      const headerObj = lodashGet(resultObj, ["data", "headerObj"], {});

      if (Object.keys(headerObj).length !== 0) {
        setHeaderObj(headerObj);
      }

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
        arr: [
          {
            variant: "success",
            messageID: "EnStWOly-",
          },
        ],
      });

      // console.log(`
      //   ----- experienceObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(experienceObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/layout/v2/dialog-achievement.js - handleSubmit
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      //   forumComments_id: {green ${forumComments_id}}
      //   name: {green ${name}}
      //   comment: {green ${comment}}
      // `);

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(formDataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    } catch (errorObj) {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // console.log(errorObj);
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
   * 称号を追加する / 削除する
   * @param {string} value - titles_id
   */
  const handleAddRemoveTitle = ({ value }) => {
    const clonedArr = lodashCloneDeep(dialogAchievementSelectedTitles_idsArr);
    const arrayIndex = clonedArr.indexOf(value);

    if (arrayIndex === -1) {
      clonedArr.push(value);
    } else {
      clonedArr.splice(arrayIndex, 1);
    }

    setDialogAchievementSelectedTitles_idsArr(clonedArr);

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/layout/v2/dialog-achievement.js - handleAddRemoveTitle
    // `);

    // console.log(chalk`
    //   value: {green ${value}}
    //   arrayIndex: {green ${arrayIndex}}
    // `);

    // console.log(`
    //   ----- clonedArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(clonedArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  };

  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const historiesArr = lodashGet(
    dialogAchievementObj,
    ["experiencesObj", "historiesArr"],
    []
  );
  const achievementsArr = lodashGet(
    dialogAchievementObj,
    ["achievementsArr"],
    []
  );
  const titlesObj = lodashGet(dialogAchievementObj, ["titlesObj"], {});

  // --------------------------------------------------
  //   Component - Achievements Chip
  // --------------------------------------------------

  const componentAchievementsArr = [];
  const componentTitlesArr = [];

  for (const [index1, value1Obj] of achievementsArr.entries()) {
    // --------------------------------------------------
    //   Property
    // --------------------------------------------------

    const type = lodashGet(value1Obj, ["type"], "");
    const limitDay = lodashGet(value1Obj, ["limitDay"], 0);
    const limitMonth = lodashGet(value1Obj, ["limitMonth"], 0);
    const limitYear = lodashGet(value1Obj, ["limitYear"], 0);
    const conditionsArr = lodashGet(value1Obj, ["conditionsArr"], []);

    const find1Obj = historiesArr.find((tempObj) => {
      return tempObj.type === type;
    });

    const countValid = lodashGet(find1Obj, ["countValid"], 0);
    const countTotal = lodashGet(find1Obj, ["countTotal"], 0);

    let activeStep = -1;

    // console.log(`
    //   ----- find1Obj -----\n
    //   ${util.inspect(find1Obj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   古のアカウントの条件を満たしていない場合、条件自体を表示しない
    // --------------------------------------------------

    if (type === "account-ancient" && countValid === 0) {
      continue;
    }

    // --------------------------------------------------
    //   Heading & Explanation
    // --------------------------------------------------

    let heading = "";
    let explanation = "";
    let unit = "回";
    let arrayIndex = 0;

    switch (type) {
      case "account-ancient":
        heading = "古のアカウント";
        explanation = "Game Users 創世記にアカウントを作成したユーザー。";
        arrayIndex = 0;
        break;

      case "level-count":
        heading = "レベルアップ";
        explanation = "レベルが上がるとカウントされます。";
        unit = "レベル";
        arrayIndex = 1;
        break;

      case "account-count-day":
        heading = "アカウント作成";
        explanation = "アカウントを作成してから特定の日数が経過。";
        unit = "日";
        arrayIndex = 2;
        break;

      case "login-count":
        heading = "ログイン回数";
        explanation =
          "ログインするとカウントされます。ログイン状態が継続している場合は、毎日サイトにアクセスするだけでカウントされます。ログインしなおす必要はありません。";
        arrayIndex = 3;
        break;

      case "good-count-click":
        heading = "Goodボタンを押す";
        explanation = "フォーラムのGoodボタンを押すとカウントされます。";
        arrayIndex = 4;
        break;

      case "good-count-clicked":
        heading = "Goodボタンを押される";
        explanation = "フォーラムのGoodボタンを押されるとカウントされます。";
        arrayIndex = 5;
        break;

      case "gc-register":
        heading = "ゲームを登録する";
        explanation = "ゲーム登録ページでゲームを登録してください。";
        arrayIndex = 6;
        break;

      case "forum-count-post":
        heading = "フォーラムに書き込む";
        explanation =
          "ゲームコミュニティ、ユーザーコミュニティのフォーラムに書き込むとカウントされます。";
        arrayIndex = 7;
        break;

      case "recruitment-count-post":
        heading = "募集の投稿";
        explanation =
          "ゲームコミュニティで募集を投稿するとカウントされます。募集へのコメント、返信でもカウントされます。";
        arrayIndex = 8;
        break;

      case "follow-count":
        heading = "フォローする";
        explanation = "他のユーザーをフォローするとカウントされます。";
        unit = "人";
        arrayIndex = 9;
        break;

      case "followed-count":
        heading = "フォローされる";
        explanation = "他のユーザーにフォローされるとカウントされます。";
        unit = "人";
        arrayIndex = 10;
        break;

      case "title-count":
        heading = "称号を獲得する";
        explanation = "称号を獲得するとカウントされます。";
        unit = "個";
        arrayIndex = 11;
        break;

      case "title-show":
        heading = "称号を表示する";
        explanation = "ユーザーページに称号を表示してください。";
        arrayIndex = 12;
        break;

      case "card-player-edit":
        heading = "プレイヤーカードを編集する";
        explanation = "プレイヤーカードを編集してください。";
        arrayIndex = 13;
        break;

      case "card-player-upload-image-main":
        heading = "プレイヤーカードのメイン画像";
        explanation =
          "プレイヤーカードにメイン画像をアップロードしてください。";
        arrayIndex = 14;
        break;

      case "card-player-upload-image-thumbnail":
        heading = "プレイヤーカードのサムネイル画像";
        explanation =
          "プレイヤーカードにサムネイル画像をアップロードしてください。";
        arrayIndex = 15;
        break;

      case "user-page-upload-image-main":
        heading = "ユーザーページのトップ画像";
        explanation =
          "ユーザーページにトップ画像をアップロードしてください。ユーザーページの設定で行えます。";
        arrayIndex = 16;
        break;

      case "user-page-change-url":
        heading = "ユーザーページのURL";
        explanation =
          "ユーザーページのURLを変更してください。ユーザーページの設定で行えます。";
        arrayIndex = 17;
        break;

      case "web-push-permission":
        heading = "プッシュ通知の許可";
        explanation =
          "プッシュ通知を許可してください。ユーザーページの設定で行えます。";
        arrayIndex = 18;
        break;
    }

    // --------------------------------------------------
    //   Limit
    // --------------------------------------------------

    let limit = "";

    if (limitDay) {
      limit = `1日に${limitDay}${unit}まで`;
    } else if (limitMonth) {
      limit = `1ヶ月に${limitMonth}${unit}まで`;
    } else if (limitYear) {
      limit = `1年に${limitYear}${unit}まで`;
    }

    // --------------------------------------------------
    //   Component - Step & Title
    // --------------------------------------------------

    const componentConditionsArr = [];
    const componentTitleAcquisitionsArr = [];

    for (const [index2, value2Obj] of conditionsArr.entries()) {
      // --------------------------------------------------
      //   Property
      // --------------------------------------------------

      const titles_id = lodashGet(value2Obj, ["titles_id"], "");

      // count は達成条件の数値、countDay は達成に必要な経過日数
      let count = lodashGet(value2Obj, ["count"], 0);
      const countDay = lodashGet(value2Obj, ["countDay"], 0);

      if (countDay > 0) {
        count = countDay;
      }

      const urlID = lodashGet(titlesObj, [titles_id, "urlID"], "");
      const name = lodashGet(titlesObj, [titles_id, "name"], "");

      // if (type === 'title-count') {
      //   console.log(chalk`
      //     index2: {green ${index2}}
      //     count: {green ${count}}
      //     countDay: {green ${countDay}}
      //     urlID: {green ${urlID}}
      //     name: {green ${name}}
      //   `);
      // }

      // --------------------------------------------------
      //   達成状況
      // --------------------------------------------------

      if (countValid >= count) {
        activeStep += 1;
      }

      // --------------------------------------------------
      //   Component - 達成状況（獲得できる称号も表示する）
      // --------------------------------------------------

      componentConditionsArr.push(
        <Step key={index2}>
          <StepLabel>
            <div
              css={css`
                display: flex;
                flex-flow: row wrap;
                align-items: center;
              `}
            >
              <div
                css={css`
                  margin: 0 12px 0 0;
                `}
              >
                {count}
                {unit}
              </div>

              <div
                css={css`
                  border-radius: 6px;
                  background-color: black;
                  margin: 0;
                  padding: 4px 6px;
                `}
              >
                <TitleChip _id={titles_id} urlID={urlID} name={name} />
              </div>
            </div>
          </StepLabel>
        </Step>
      );

      // --------------------------------------------------
      //   Component - 実績を達成し獲得した称号
      // --------------------------------------------------

      if (countValid >= count) {
        componentTitleAcquisitionsArr.push(
          <div
            css={css`
              border-radius: 6px;
              background-color: black;
              cursor: pointer;
              margin: 12px 12px 0 0;
              padding: 4px 6px;
            `}
            key={titles_id}
            onClick={() => handleAddRemoveTitle({ value: titles_id })}
          >
            <TitleChip _id={titles_id} urlID={urlID} name={name} />
          </div>
        );
      }
    }

    // if (type === 'account-count-day') {

    //   console.log(chalk`
    // conditionsArr.length: {green ${conditionsArr.length}}
    // activeStep: {green ${activeStep}}
    // `);

    // }

    // --------------------------------------------------
    //   最後まで実績を達成した場合
    // --------------------------------------------------

    if (conditionsArr.length - 1 === activeStep) {
      activeStep += 1;
    }

    // --------------------------------------------------
    //   Component - 実績ページ（上部のボタンで切り替える）
    // --------------------------------------------------

    componentAchievementsArr[arrayIndex] = (
      <ComponentPanel
        key={`achievement-${index1}`}
        heading={heading}
        defaultExpanded={false}
      >
        <p
          css={css`
            margin: 12px 6px;
          `}
        >
          {explanation}
        </p>

        <p
          css={css`
            margin: 0 6px;
          `}
        >
          <span
            css={css`
              font-weight: bold;
            `}
          >
            有効カウント：
          </span>
          {countValid}
          {unit}

          {countValid !== countTotal && (
            <React.Fragment>
              {" "}
              /{" "}
              <span
                css={css`
                  font-weight: bold;
                `}
              >
                合計カウント：
              </span>
              {countTotal}
              {unit}
            </React.Fragment>
          )}
        </p>

        {limit && (
          <p
            css={css`
              margin: 0 6px;
            `}
          >
            <span
              css={css`
                font-weight: bold;
              `}
            >
              制限：
            </span>
            {limit}
          </p>
        )}

        <Stepper
          css={css`
            padding: 24px 0 0 0 !important;
          `}
          activeStep={activeStep}
          orientation="vertical"
        >
          {componentConditionsArr}
        </Stepper>
      </ComponentPanel>
    );

    // --------------------------------------------------
    //   Component - 称号ページ（上部のボタンで切り替える）
    // --------------------------------------------------

    componentTitlesArr[arrayIndex] = (
      <ComponentPanel
        key={`title-${index1}`}
        heading={heading}
        defaultExpanded={true}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row wrap;
          `}
        >
          {componentTitleAcquisitionsArr}
        </div>
      </ComponentPanel>
    );
  }

  // --------------------------------------------------
  //   Component - 表示する称号
  // --------------------------------------------------

  const componentTitleSelectedArr = [];

  for (let titles_id of dialogAchievementSelectedTitles_idsArr.values()) {
    const urlID = lodashGet(titlesObj, [titles_id, "urlID"], "");
    const name = lodashGet(titlesObj, [titles_id, "name"], "");

    componentTitleSelectedArr.push(
      <div
        css={css`
          border-radius: 6px;
          background-color: black;
          cursor: pointer;
          margin: 12px 12px 0 0;
          padding: 4px 6px;
        `}
        key={titles_id}
        onClick={() => handleAddRemoveTitle({ value: titles_id })}
      >
        <TitleChip _id={titles_id} urlID={urlID} name={name} />
      </div>
    );
  }

  const componentTitleSelected = (
    <Paper
      css={css`
        && {
          margin: 0 0 24px;
          padding: 0 0 12px;
        }
      `}
      elevation={3}
    >
      <h3 css={cssHeadingRed}>表示する称号</h3>

      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 0 12px;
        `}
      >
        {componentTitleSelectedArr}
      </div>

      {/* フォーム */}
      <form
        name="formTitleSelected"
        onSubmit={(eventObj) =>
          handleSubmit({
            eventObj,
          })
        }
      >
        {/* Submit Button */}
        <div
          css={css`
            display: flex;
            flex-flow: row wrap;
            border-top: 1px dashed #848484;
            margin: 12px 0 0 0;
            padding: 12px 12px 0;
          `}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={buttonDisabled}
          >
            保存する
          </Button>
        </div>
      </form>
    </Paper>
  );
  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/dialog-achievement.js
  // `);

  // console.log(chalk`
  //   dialogAchievementOpen: {green ${dialogAchievementOpen}}
  // `);

  // console.log(`
  //   ----- dialogAchievementSelectedTitles_idsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(dialogAchievementSelectedTitles_idsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- dialogAchievementObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(dialogAchievementObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Dialog
      fullScreen
      open={dialogAchievementOpen}
      onClose={() => setDialogAchievementOpen(false)}
    >
      {/* Bar */}
      <AppBar
        css={css`
          padding: 0 !important;
        `}
      >
        <Toolbar
          css={css`
            && {
              padding-right: 12px;
            }
          `}
        >
          <h2>実績</h2>

          <div
            css={css`
              margin-left: auto;
            `}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDialogAchievementOpen(false)}
              aria-label="close"
            >
              <IconClose />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <div
        css={css`
          margin: 90px 0 24px 0;
          padding: 0 24px;

          @media screen and (max-width: 480px) {
            margin: 76px 0 24px 0;
            padding: 0;
          }
        `}
      >
        {/* Buttons */}
        <ButtonGroup
          css={css`
            @media screen and (max-width: 480px) {
              padding: 0 12px;
            }
          `}
          color="primary"
          aria-label="outlined primary button group"
          disabled={buttonDisabled}
        >
          {/* 実績ボタン */}
          <Button onClick={() => setPageNo(0)}>
            <span
              css={css`
                font-weight: ${pageNo === 0 ? "bold" : "normal"};
              `}
            >
              実績
            </span>
          </Button>

          {/* 称号ボタン */}
          <Button onClick={() => setPageNo(1)}>
            <span
              css={css`
                font-weight: ${pageNo === 1 ? "bold" : "normal"};
              `}
            >
              称号
            </span>
          </Button>
        </ButtonGroup>

        {/* Content */}
        {pageNo === 0 ? (
          // 実績

          <React.Fragment>
            <p
              css={css`
                margin: 14px 0 0 0;

                @media screen and (max-width: 480px) {
                  padding: 0 12px;
                }
              `}
            >
              Game Users 内で特定の行動をすると称号を獲得することができます。
            </p>

            <p
              css={css`
                color: red;
                margin: 14px 0 36px 0;

                @media screen and (max-width: 480px) {
                  padding: 0 12px;
                }
              `}
            >
              ※
              実績を達成するために内容のないコンテンツを作成した場合、実績機能を利用できなくなることがあります。
            </p>

            {componentAchievementsArr}
          </React.Fragment>
        ) : (
          // 称号

          <React.Fragment>
            <p
              css={css`
                margin: 14px 0 28px 0;

                @media screen and (max-width: 480px) {
                  padding: 0 12px;
                }
              `}
            >
              獲得した称号はユーザーページ内に表示することができます。表示したい称号を選択して「保存する」ボタンを押してください。左から3つ目までの称号が保存され、ユーザーページ内の上部に表示されます。
            </p>

            {componentTitleSelected}

            {componentTitlesArr}
          </React.Fragment>
        )}
      </div>
    </Dialog>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

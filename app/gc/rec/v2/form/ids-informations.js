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
import { useIntl } from "react-intl";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import {
  validationRecruitmentThreadsID,
  validationRecruitmentThreadsInformationTitle,
  validationRecruitmentThreadsInformation,
} from "app/@database/recruitment-threads/validations/ids-informations.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormIDs from "app/gc/rec/v2/form/ids.js";

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
    type,
    publicSettingThread,

    idsArr,
    setIDsArr,

    platform1,
    setPlatform1,
    platform2,
    setPlatform2,
    platform3,
    setPlatform3,

    id1,
    setID1,
    id2,
    setID2,
    id3,
    setID3,

    informationTitle1,
    setInformationTitle1,
    informationTitle2,
    setInformationTitle2,
    informationTitle3,
    setInformationTitle3,
    informationTitle4,
    setInformationTitle4,
    informationTitle5,
    setInformationTitle5,

    information1,
    setInformation1,
    information2,
    setInformation2,
    information3,
    setInformation3,
    information4,
    setInformation4,
    information5,
    setInformation5,

    publicSetting,
    setPublicSetting,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  const [showFormID, setShowFormID] = useState(true);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();

  const { login } = stateUser;

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationRecruitmentThreadsID1Obj = validationRecruitmentThreadsID({
    value: id1,
  });
  const validationRecruitmentThreadsID2Obj = validationRecruitmentThreadsID({
    value: id2,
  });
  const validationRecruitmentThreadsID3Obj = validationRecruitmentThreadsID({
    value: id3,
  });

  const validationRecruitmentThreadsInformationTitle1Obj = validationRecruitmentThreadsInformationTitle(
    { value: informationTitle1 }
  );
  const validationRecruitmentThreadsInformationTitle2Obj = validationRecruitmentThreadsInformationTitle(
    { value: informationTitle2 }
  );
  const validationRecruitmentThreadsInformationTitle3Obj = validationRecruitmentThreadsInformationTitle(
    { value: informationTitle3 }
  );
  const validationRecruitmentThreadsInformationTitle4Obj = validationRecruitmentThreadsInformationTitle(
    { value: informationTitle4 }
  );
  const validationRecruitmentThreadsInformationTitle5Obj = validationRecruitmentThreadsInformationTitle(
    { value: informationTitle5 }
  );

  const validationRecruitmentThreadsInformation1Obj = validationRecruitmentThreadsInformation(
    { value: information1 }
  );
  const validationRecruitmentThreadsInformation2Obj = validationRecruitmentThreadsInformation(
    { value: information2 }
  );
  const validationRecruitmentThreadsInformation3Obj = validationRecruitmentThreadsInformation(
    { value: information3 }
  );
  const validationRecruitmentThreadsInformation4Obj = validationRecruitmentThreadsInformation(
    { value: information4 }
  );
  const validationRecruitmentThreadsInformation5Obj = validationRecruitmentThreadsInformation(
    { value: information5 }
  );

  // --------------------------------------------------
  //   Component - ID
  // --------------------------------------------------

  const componentsIDsArr = [];

  for (let i = 1; i <= 3; i++) {
    let platform = "";
    let validationObj = {};
    let handlePlatform = () => {};
    let handleID = () => {};

    if (i === 1) {
      platform = platform1;
      validationObj = validationRecruitmentThreadsID1Obj;
      handlePlatform = setPlatform1;
      handleID = setID1;
    } else if (i === 2) {
      platform = platform2;
      validationObj = validationRecruitmentThreadsID2Obj;
      handlePlatform = setPlatform2;
      handleID = setID2;
    } else if (i === 3) {
      platform = platform3;
      validationObj = validationRecruitmentThreadsID3Obj;
      handlePlatform = setPlatform3;
      handleID = setID3;
    }

    componentsIDsArr.push(
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;

          @media screen and (max-width: 480px) {
            flex-flow: column wrap;
            border-left: 4px solid #01dfa5;
            margin: 24px 0 0 0;
            // padding: 0 0 0 12px;
          }
        `}
        key={`ids-${i}`}
      >
        <div
          css={css`
            width: 100px;
            margin: 24px 24px 0 0;

            @media screen and (max-width: 480px) {
              margin: 0 0 0 16px;
            }
          `}
        >
          <Select
            value={platform}
            onChange={(eventObj) => handlePlatform(eventObj.target.value)}
            displayEmpty
          >
            <MenuItem value={"Other"}>ID</MenuItem>
            <MenuItem value={"PlayStation"}>PlayStation</MenuItem>
            <MenuItem value={"Xbox"}>Xbox</MenuItem>
            <MenuItem value={"Nintendo"}>Nintendo</MenuItem>
            <MenuItem value={"PC"}>PC</MenuItem>
            <MenuItem value={"Android"}>Android</MenuItem>
            <MenuItem value={"iOS"}>iOS</MenuItem>
            <MenuItem value={"Steam"}>Steam</MenuItem>
            <MenuItem value={"Origin"}>Origin</MenuItem>
            <MenuItem value={"Discord"}>Discord</MenuItem>
            <MenuItem value={"Skype"}>Skype</MenuItem>
            <MenuItem value={"ICQ"}>ICQ</MenuItem>
            <MenuItem value={"Line"}>Line</MenuItem>
          </Select>
        </div>

        <div
          css={css`
            @media screen and (max-width: 480px) {
              margin: 8px 0 0 16px;
            }
          `}
        >
          <TextField
            css={css`
              && {
                margin: 8px 0 0 0;
              }
            `}
            label={`ID ${i}`}
            value={validationObj.value}
            onChange={(eventObj) => handleID(eventObj.target.value)}
            error={validationObj.error}
            helperText={intl.formatMessage(
              { id: validationObj.messageID },
              { numberOfCharacters: validationObj.numberOfCharacters }
            )}
            margin="normal"
            inputProps={{
              maxLength: 100,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  //   Component - Information
  // --------------------------------------------------

  const componentsInformationsArr = [];

  for (let i = 1; i <= 5; i++) {
    let validationInformationTitleObj = {};
    let validationInformationObj = {};
    let handleTitle = () => {};
    let handleInformation = () => {};

    if (i === 1) {
      validationInformationTitleObj = validationRecruitmentThreadsInformationTitle1Obj;
      validationInformationObj = validationRecruitmentThreadsInformation1Obj;
      handleTitle = setInformationTitle1;
      handleInformation = setInformation1;
    } else if (i === 2) {
      validationInformationTitleObj = validationRecruitmentThreadsInformationTitle2Obj;
      validationInformationObj = validationRecruitmentThreadsInformation2Obj;
      handleTitle = setInformationTitle2;
      handleInformation = setInformation2;
    } else if (i === 3) {
      validationInformationTitleObj = validationRecruitmentThreadsInformationTitle3Obj;
      validationInformationObj = validationRecruitmentThreadsInformation3Obj;
      handleTitle = setInformationTitle3;
      handleInformation = setInformation3;
    } else if (i === 4) {
      validationInformationTitleObj = validationRecruitmentThreadsInformationTitle4Obj;
      validationInformationObj = validationRecruitmentThreadsInformation4Obj;
      handleTitle = setInformationTitle4;
      handleInformation = setInformation4;
    } else if (i === 5) {
      validationInformationTitleObj = validationRecruitmentThreadsInformationTitle5Obj;
      validationInformationObj = validationRecruitmentThreadsInformation5Obj;
      handleTitle = setInformationTitle5;
      handleInformation = setInformation5;
    }

    componentsInformationsArr.push(
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          margin: 8px 0 0 0;

          @media screen and (max-width: 480px) {
            flex-flow: column wrap;
            border-left: 4px solid #01dfa5;
            margin: 24px 0 0 0;
          }
        `}
        key={`informations-${i}`}
      >
        <div
          css={css`
            margin: 0 16px 0 0;

            @media screen and (max-width: 480px) {
              margin: 0;
            }
          `}
        >
          <TextField
            css={css`
              && {
                margin: 8px 0 0 0;
              }
            `}
            label={`タイトル ${i}`}
            value={validationInformationTitleObj.value}
            onChange={(eventObj) => handleTitle(eventObj.target.value)}
            error={validationInformationTitleObj.error}
            helperText={intl.formatMessage(
              { id: validationInformationTitleObj.messageID },
              {
                numberOfCharacters:
                  validationInformationTitleObj.numberOfCharacters,
              }
            )}
            margin="normal"
            inputProps={{
              maxLength: 30,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <div
          css={css`
            @media screen and (max-width: 480px) {
              margin: 8px 0 0 0;
            }
          `}
        >
          <TextField
            css={css`
              && {
                margin: 8px 0 0 0;
              }
            `}
            label={`情報 ${i}`}
            value={validationInformationObj.value}
            onChange={(eventObj) => handleInformation(eventObj.target.value)}
            error={validationInformationObj.error}
            helperText={intl.formatMessage(
              { id: validationInformationObj.messageID },
              {
                numberOfCharacters: validationInformationObj.numberOfCharacters,
              }
            )}
            margin="normal"
            inputProps={{
              maxLength: 50,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  //   Component - 公開設定
  // --------------------------------------------------

  let componentsPublicSettingSelectMenuItemsArr = [
    <MenuItem value={1} key="publicSettingSelectMenuItems1">
      誰にでも公開
    </MenuItem>,
  ];

  if (login) {
    if (type === "thread") {
      componentsPublicSettingSelectMenuItemsArr = [
        <MenuItem value={1} key="publicSettingSelectMenuItems1">
          誰にでも公開
        </MenuItem>,
        <MenuItem value={2} key="publicSettingSelectMenuItems2">
          コメントした方に公開（全員）
        </MenuItem>,
        <MenuItem value={3} key="publicSettingSelectMenuItems3">
          コメントした方に公開（選択）
        </MenuItem>,
      ];
    } else if (type === "comment") {
      componentsPublicSettingSelectMenuItemsArr = [
        <MenuItem value={1} key="publicSettingSelectMenuItems1">
          誰にでも公開
        </MenuItem>,
        <MenuItem value={2} key="publicSettingSelectMenuItems2">
          募集者だけに公開
        </MenuItem>,
      ];

      if (publicSettingThread === 3) {
        componentsPublicSettingSelectMenuItemsArr.push(
          <MenuItem value={3} key="publicSettingSelectMenuItems3">
            募集者が自分に公開した場合
          </MenuItem>
        );
      }
    }
  }

  // --------------------------------------------------
  //   Component - 公開設定の解説
  // --------------------------------------------------

  let componentPublicSettingExplanation = "";

  // --------------------------------------------------
  //   - 募集フォーム
  // --------------------------------------------------

  if (type === "thread") {
    if (publicSetting === 1) {
      componentPublicSettingExplanation = (
        <p>
          このページにアクセスした人なら誰でもID・情報を見ることができます。
        </p>
      );
    } else if (publicSetting === 2) {
      componentPublicSettingExplanation = (
        <p>ログインしてコメントしたユーザー全員にID・情報を公開します。</p>
      );
    } else if (publicSetting === 3) {
      componentPublicSettingExplanation = (
        <p>
          ログインして返信したユーザーの中からID・情報を公開する相手を選べます。
        </p>
      );
    }

    // --------------------------------------------------
    //   - コメントフォーム
    // --------------------------------------------------
  } else if (type === "comment") {
    if (publicSetting === 1) {
      componentPublicSettingExplanation = (
        <p>
          このページにアクセスした人なら誰でもID・情報を見ることができます。
        </p>
      );
    } else if (publicSetting === 2) {
      componentPublicSettingExplanation = (
        <p>募集者だけにID・情報を公開します。</p>
      );
    } else if (publicSetting === 3) {
      componentPublicSettingExplanation = (
        <p>
          募集者が自分に対してID・情報を公開した場合、募集者だけに自分のID・情報を公開します。お互いが公開した場合だけ、相互に閲覧できるようになる設定です。
        </p>
      );
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/form/ids-informations.js
  // `);

  // console.log(chalk`
  //   publicSettingThread: {green ${publicSettingThread}}
  // `);

  // console.log(`
  //   ----- idsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(idsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      <h3
        css={css`
          font-weight: bold;
          margin: 0 0 2px 0;
        `}
      >
        ID・情報 （未記入でもOK）
      </h3>

      <p
        css={css`
          margin: 0 0 24px 0;
        `}
      >
        ゲームやメッセージアプリのID・情報を掲載できます。募集に期限が設定されている場合、期限が来るとこちらで入力したID・情報は自動的に非表示になります。
      </p>

      {/* Button */}
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button onClick={() => setShowFormID(true)}>ID</Button>

        <Button onClick={() => setShowFormID(false)}>情報</Button>
      </ButtonGroup>

      {showFormID && login && <FormIDs idsArr={idsArr} setIDsArr={setIDsArr} />}

      {showFormID && !login && (
        <div
          css={css`
            margin: 24px 0 0 0;
          `}
        >
          <p>
            左側は入力するIDに関連しているハードを選んでください。該当するハードがない場合は最初に表示されている「ID」を選択してください。右側にはIDを入力します。
          </p>

          <div
            css={css`
              margin: 16px 0 0 0;
            `}
          >
            {componentsIDsArr}
          </div>
        </div>
      )}

      {!showFormID && (
        <div
          css={css`
            margin: 24px 0 0 0;
          `}
        >
          <p
            css={css`
              margin: 0 0 8px 0;
            `}
          >
            ID以外にも掲載したい情報がある場合はこちらに入力してください。
          </p>

          <div
            css={css`
              margin: 16px 0 0 0;
            `}
          >
            {componentsInformationsArr}
          </div>
        </div>
      )}

      {/* 公開設定 */}
      <FormControl
        css={css`
          && {
            margin: 42px 0 16px 0;
          }
        `}
        variant="outlined"
      >
        <InputLabel id="publicSettingLabel">ID・情報の公開設定</InputLabel>

        <Select
          css={css`
            && {
              width: 280px;
            }
          `}
          labelId="publicSettingLabel"
          label="ID・情報の公開設定"
          value={publicSetting}
          onChange={(eventObj) => setPublicSetting(eventObj.target.value)}
        >
          {componentsPublicSettingSelectMenuItemsArr}
        </Select>
      </FormControl>

      {/* 公開設定の解説 */}
      {componentPublicSettingExplanation}
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

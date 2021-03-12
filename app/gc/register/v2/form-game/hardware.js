// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Node Packaddresss
// ---------------------------------------------

import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";

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

import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconAddCircle from "@material-ui/icons/AddCircle";
import IconRemoveCircle from "@material-ui/icons/RemoveCircle";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormHardwares from "app/common/hardware/v2/form.js";
import FormDeveloperPublisher from "app/common/developer-publisher/v2/form.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Form
 */
const ComponentForm = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    i,
    hardwaresArr,
    setHardwaresArr,
    releaseDate,
    setReleaseDate,
    playersMin,
    setPlayersMin,
    playersMax,
    setPlayersMax,
    publishersArr,
    setPublishersArr,
    developersArr,
    setDevelopersArr,
  } = props;

  const limitDevPub = parseInt(
    process.env.NEXT_PUBLIC_GAMES_DEVELOPERS_PUBLISHERS_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column wrap;
        border-bottom: 1px solid #dc143c;
        padding: 12px 0 24px 0;
      `}
    >
      <h3
        css={css`
          margin: 0 0 6px 0;
        `}
      >
        ハードウェア {i}
      </h3>

      {/* ハードウェア */}
      <FormHardwares
        hardwaresArr={hardwaresArr}
        setHardwaresArr={setHardwaresArr}
        limit={1}
      />

      {/* 発売日 */}
      <TextField
        css={css`
          && {
            width: 300px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id={`releaseDate${i}`}
        type="date"
        margin="normal"
        label="発売日"
        value={releaseDate}
        onChange={(eventObj) => setReleaseDate(eventObj.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* プレイ人数　最小 */}
      <TextField
        css={css`
          && {
            width: 150px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id={`playersMin${i}`}
        type="number"
        margin="normal"
        label="プレイ人数 最小"
        value={playersMin}
        onChange={(eventObj) => setPlayersMin(eventObj.target.value)}
        inputProps={{
          min: 1,
        }}
      />

      {/* プレイ人数　最大 */}
      <TextField
        css={css`
          && {
            width: 150px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id={`playersMax${i}`}
        type="number"
        margin="normal"
        label="プレイ人数 最大"
        value={playersMax}
        onChange={(eventObj) => setPlayersMax(eventObj.target.value)}
        inputProps={{
          min: 1,
        }}
      />

      {/* 開発 */}
      <FormDeveloperPublisher
        type="developer"
        arr={developersArr}
        setArr={setDevelopersArr}
        limit={limitDevPub}
      />

      {/* パブリッシャー */}
      <FormDeveloperPublisher
        type="publisher"
        arr={publishersArr}
        setArr={setPublishersArr}
        limit={limitDevPub}
      />
    </div>
  );
};

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
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
  } = props;

  const limitHardwares = parseInt(
    process.env.NEXT_PUBLIC_GAMES_HARDWARES_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // const [hardwaresCount, setFormCount] = useState(hardwaresCount);

  // console.log(chalk`
  //   hardwaresCount: {green ${hardwaresCount}}
  // `);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * フォームを増やす
   */
  const handleAdd = () => {
    if (hardwaresCount < limitHardwares) {
      setHardwaresCount(hardwaresCount + 1);
    }

    // console.log(chalk`
    //   handleAdd
    //   hardwaresCount: {green ${hardwaresCount}}
    // `);
  };

  /**
   * フォームを減らす
   */
  const handleRemove = () => {
    if (hardwaresCount > 1) {
      setHardwaresCount(hardwaresCount - 1);
    }

    // console.log(chalk`
    //   handleRemove
    //   hardwaresCount: {green ${hardwaresCount}}
    // `);
  };

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  for (let i = 1; i <= hardwaresCount; i++) {
    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(valueObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   i: {green ${i}}
    //   hardwaresCount: {green ${hardwaresCount}}
    // `);

    // --------------------------------------------------
    //   dataObj
    // --------------------------------------------------

    let hardwaresArr = [];
    let setHardwaresArr = () => {};
    let releaseDate = "";
    let setReleaseDate = () => {};
    let playersMin = 1;
    let setPlayersMin = () => {};
    let playersMax = 1;
    let setPlayersMax = () => {};
    let publishersArr = "";
    let setPublishersArr = () => {};
    let developersArr = "";
    let setDevelopersArr = () => {};

    switch (i) {
      case 1:
        hardwaresArr = hardwares1Arr;
        setHardwaresArr = setHardwares1Arr;
        releaseDate = releaseDate1;
        setReleaseDate = setReleaseDate1;
        playersMin = playersMin1;
        setPlayersMin = setPlayersMin1;
        playersMax = playersMax1;
        setPlayersMax = setPlayersMax1;
        publishersArr = publishers1Arr;
        setPublishersArr = setPublishers1Arr;
        developersArr = developers1Arr;
        setDevelopersArr = setDevelopers1Arr;

        break;

      case 2:
        hardwaresArr = hardwares2Arr;
        setHardwaresArr = setHardwares2Arr;
        releaseDate = releaseDate2;
        setReleaseDate = setReleaseDate2;
        playersMin = playersMin2;
        setPlayersMin = setPlayersMin2;
        playersMax = playersMax2;
        setPlayersMax = setPlayersMax2;
        publishersArr = publishers2Arr;
        setPublishersArr = setPublishers2Arr;
        developersArr = developers2Arr;
        setDevelopersArr = setDevelopers2Arr;

        break;

      case 3:
        hardwaresArr = hardwares3Arr;
        setHardwaresArr = setHardwares3Arr;
        releaseDate = releaseDate3;
        setReleaseDate = setReleaseDate3;
        playersMin = playersMin3;
        setPlayersMin = setPlayersMin3;
        playersMax = playersMax3;
        setPlayersMax = setPlayersMax3;
        publishersArr = publishers3Arr;
        setPublishersArr = setPublishers3Arr;
        developersArr = developers3Arr;
        setDevelopersArr = setDevelopers3Arr;

        break;

      case 4:
        hardwaresArr = hardwares4Arr;
        setHardwaresArr = setHardwares4Arr;
        releaseDate = releaseDate4;
        setReleaseDate = setReleaseDate4;
        playersMin = playersMin4;
        setPlayersMin = setPlayersMin4;
        playersMax = playersMax4;
        setPlayersMax = setPlayersMax4;
        publishersArr = publishers4Arr;
        setPublishersArr = setPublishers4Arr;
        developersArr = developers4Arr;
        setDevelopersArr = setDevelopers4Arr;

        break;

      case 5:
        hardwaresArr = hardwares5Arr;
        setHardwaresArr = setHardwares5Arr;
        releaseDate = releaseDate5;
        setReleaseDate = setReleaseDate5;
        playersMin = playersMin5;
        setPlayersMin = setPlayersMin5;
        playersMax = playersMax5;
        setPlayersMax = setPlayersMax5;
        publishersArr = publishers5Arr;
        setPublishersArr = setPublishers5Arr;
        developersArr = developers5Arr;
        setDevelopersArr = setDevelopers5Arr;

        break;

      case 6:
        hardwaresArr = hardwares6Arr;
        setHardwaresArr = setHardwares6Arr;
        releaseDate = releaseDate6;
        setReleaseDate = setReleaseDate6;
        playersMin = playersMin6;
        setPlayersMin = setPlayersMin6;
        playersMax = playersMax6;
        setPlayersMax = setPlayersMax6;
        publishersArr = publishers6Arr;
        setPublishersArr = setPublishers6Arr;
        developersArr = developers6Arr;
        setDevelopersArr = setDevelopers6Arr;

        break;

      case 7:
        hardwaresArr = hardwares7Arr;
        setHardwaresArr = setHardwares7Arr;
        releaseDate = releaseDate7;
        setReleaseDate = setReleaseDate7;
        playersMin = playersMin7;
        setPlayersMin = setPlayersMin7;
        playersMax = playersMax7;
        setPlayersMax = setPlayersMax7;
        publishersArr = publishers7Arr;
        setPublishersArr = setPublishers7Arr;
        developersArr = developers7Arr;
        setDevelopersArr = setDevelopers7Arr;

        break;

      case 8:
        hardwaresArr = hardwares8Arr;
        setHardwaresArr = setHardwares8Arr;
        releaseDate = releaseDate8;
        setReleaseDate = setReleaseDate8;
        playersMin = playersMin8;
        setPlayersMin = setPlayersMin8;
        playersMax = playersMax8;
        setPlayersMax = setPlayersMax8;
        publishersArr = publishers8Arr;
        setPublishersArr = setPublishers8Arr;
        developersArr = developers8Arr;
        setDevelopersArr = setDevelopers8Arr;

        break;

      case 9:
        hardwaresArr = hardwares9Arr;
        setHardwaresArr = setHardwares9Arr;
        releaseDate = releaseDate9;
        setReleaseDate = setReleaseDate9;
        playersMin = playersMin9;
        setPlayersMin = setPlayersMin9;
        playersMax = playersMax9;
        setPlayersMax = setPlayersMax9;
        publishersArr = publishers9Arr;
        setPublishersArr = setPublishers9Arr;
        developersArr = developers9Arr;
        setDevelopersArr = setDevelopers9Arr;

        break;

      case 10:
        hardwaresArr = hardwares10Arr;
        setHardwaresArr = setHardwares10Arr;
        releaseDate = releaseDate10;
        setReleaseDate = setReleaseDate10;
        playersMin = playersMin10;
        setPlayersMin = setPlayersMin10;
        playersMax = playersMax10;
        setPlayersMax = setPlayersMax10;
        publishersArr = publishers10Arr;
        setPublishersArr = setPublishers10Arr;
        developersArr = developers10Arr;
        setDevelopersArr = setDevelopers10Arr;

        break;
    }

    componentsArr.push(
      <div
        css={css`
          padding: 0 0 14px 0;
        `}
        key={`formHardware-${i}`}
      >
        <ComponentForm
          i={i}
          hardwaresArr={hardwaresArr}
          setHardwaresArr={setHardwaresArr}
          releaseDate={releaseDate}
          setReleaseDate={setReleaseDate}
          playersMin={playersMin}
          setPlayersMin={setPlayersMin}
          playersMax={playersMax}
          setPlayersMax={setPlayersMax}
          publishersArr={publishersArr}
          setPublishersArr={setPublishersArr}
          developersArr={developersArr}
          setDevelopersArr={setDevelopersArr}
        />
      </div>
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Heading */}
      <h3
        css={css`
          font-weight: bold;
          margin: 0 0 14px 0;
        `}
      >
        ハードウェア
      </h3>

      <p
        css={css`
          margin: 0 0 14px 0;
        `}
      >
        このゲームが利用できるハードウェアを入力してください。
      </p>

      <p
        css={css`
          margin: 0 0 14px 0;
        `}
      >
        ハードウェア名（またはSFC、N64などの略称）の一部を入力すると、入力フォームの下に一覧でハードウェアの正式名称が表示されます。一覧上でハードウェアをクリック（タップ）すると入力は完了です。この欄では複数のハードウェアを入力することが可能です。
      </p>

      <p
        css={css`
          margin: 0 0 14px 0;
        `}
      >
        ゲームのハードウェア名だけでなく、「Android」「iOS」「PC」などもハードウェアとして入力できます。
      </p>

      <p
        css={css`
          border-bottom: 1px solid #dc143c;
          margin: 0 0 12px 0;
          padding: 0 0 30px 0;
        `}
      >
        開発・パブリッシャーはハードウェア名と同じで名前の一部をテキストフィールに入力すると、入力フォームの下に一覧で開発・パブリッシャーの正式名称が表示されますので、そこから選択してください。入力したい対象が出てこない場合は空欄にしておいてください。
      </p>

      {/* フォーム */}
      <div
        css={css`
          display: flex;
          flex-flow: column wrap;
        `}
      >
        {/* テキストフィールド */}
        {componentsArr}

        {/* フォーム追加・削除ボタン */}
        <div
          css={css`
            margin: 12px 0 0 0;
          `}
        >
          {/* - ボタン */}
          {hardwaresCount > 1 && (
            <IconButton
              css={css`
                && {
                  margin-right: 16px;
                }
              `}
              onClick={handleRemove}
            >
              <IconRemoveCircle />
            </IconButton>
          )}

          {/* + ボタン */}
          {hardwaresCount < limitHardwares && (
            <IconButton onClick={handleAdd}>
              <IconAddCircle />
            </IconButton>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

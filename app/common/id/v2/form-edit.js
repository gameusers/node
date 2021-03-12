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

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

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
//   Validations
// ---------------------------------------------

import { validationIDsPlatform } from "app/@database/ids/validations/platform.js";
import { validationIDsLabel } from "app/@database/ids/validations/label.js";
import { validationIDsID } from "app/@database/ids/validations/id.js";
import { validationIDsPublicSetting } from "app/@database/ids/validations/public-setting.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import IDChip from "app/common/id/v2/chip.js";
import FormGame from "app/common/game/v2/form.js";

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

  const { dataArr, setDataArr, idsArr, setIDsArr, gamesLimit } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [_id, set_id] = useState("");
  const [platform, setPlatform] = useState("");
  const [label, setLabel] = useState("");
  const [id, setID] = useState("");
  const [publicSetting, setPublicSetting] = useState("");
  const [search, setSearch] = useState(true);
  const [gamesArr, setGamesArr] = useState([]);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { handleDialogOpen } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 編集時に編集するIDを選択する（各フォームの値を設定する）
   * 編集フォームの ID (Chip) をクリックしたときに発動
   * @param {string} ids_id - DB IDs _id
   */
  const handleSelect = ({ ids_id }) => {
    // --------------------------------------------------
    //   データを取得する
    // --------------------------------------------------

    const resultObj = dataArr.find((valueObj) => {
      return valueObj._id === ids_id;
    });

    // --------------------------------------------------
    //   フォームのデータを変更する
    // --------------------------------------------------

    set_id(resultObj._id);
    setPlatform(resultObj.platform);
    setLabel(resultObj.label);
    setID(resultObj.id);
    setPublicSetting(resultObj.publicSetting);
    setSearch(resultObj.search);

    // --------------------------------------------------
    //   ゲームフォームのゲームを変更する
    // --------------------------------------------------

    const games_id = lodashGet(resultObj, ["gamesObj", "_id"], "");
    const gameCommunities_id = lodashGet(
      resultObj,
      ["gamesObj", "gameCommunities_id"],
      ""
    );
    const name = lodashGet(resultObj, ["gamesObj", "name"], "");
    const imagesAndVideosThumbnailObj = lodashGet(
      resultObj,
      ["gamesObj", "imagesAndVideosThumbnailObj"],
      {}
    );

    let tempArr = [];

    if (games_id && gameCommunities_id && name) {
      tempArr = [
        {
          _id: games_id,
          gameCommunities_id,
          name,
          imagesAndVideosThumbnailObj,
        },
      ];
    }

    setGamesArr(tempArr);

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/id/v2/components/form-edit.js - handleSelect
    // `);

    // console.log(`
    //   ----- gamesArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(gamesArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(chalk`
    //   ids_id: {green ${ids_id}}
    // `);

    // console.log(`
    //   ----- resultObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  };

  /**
   * 編集フォームを送信する
   */
  const handleSubmit = async () => {
    try {
      // --------------------------------------------------
      //   Button Disable
      // --------------------------------------------------

      setButtonDisabled(true);

      // --------------------------------------------------
      //   編集するIDが選ばれていない場合、エラー
      // --------------------------------------------------

      if (!_id) {
        throw new CustomError({
          errorsArr: [{ code: "cOQptDp5", messageID: "sHOvvQXWL" }],
        });
      }

      // --------------------------------------------------
      //   フォームに必要な情報が入力されていない場合、エラー
      // --------------------------------------------------

      if (!platform || !id || !publicSetting) {
        throw new CustomError({
          errorsArr: [{ code: "5Geof8YQ", messageID: "uwHIKBy7c" }],
        });
      }

      // --------------------------------------------------
      //   FormData
      // --------------------------------------------------

      const formDataObj = {
        _id,
        platform,
        label,
        id,
        publicSetting,
        search,
      };

      if (gamesArr.length > 0) {
        formDataObj.gameCommunities_id = lodashGet(
          gamesArr,
          [0, "gameCommunities_id"],
          ""
        );
      }

      // --------------------------------------------------
      //   Fetch
      // --------------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/ids/upsert`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // --------------------------------------------------
      //   Error
      // --------------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // --------------------------------------------------
      //   データ更新
      // --------------------------------------------------

      setDataArr(resultObj.data);

      // --------------------------------------------------
      //   ID登録フォームをロードした元のフォームのIDを更新する
      // --------------------------------------------------

      const updatedIDsArr = [];

      for (let valueObj of idsArr.values()) {
        // 現在選択されているIDを抽出する
        const newObj = resultObj.data.find((valueObj2) => {
          return valueObj2._id === valueObj._id;
        });

        // 新しくなった選択IDの配列を作成
        if (newObj) {
          updatedIDsArr.push(newObj);
        }

        // console.log(`
        //   ----- valueObj -----\n
        //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- newObj -----\n
        //   ${util.inspect(newObj, { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }

      // --------------------------------------------------
      //   Update idsArr
      // --------------------------------------------------

      setIDsArr(updatedIDsArr);

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "EnStWOly-",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/id/v2/components/form-edit.js - handleSubmit
      // `);

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(formDataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(chalk`
      //   platform: {green ${platform}}
      //   label: {green ${label}}
      //   id: {green ${id}}
      //   publicSetting: {green ${publicSetting}}
      //   search: {green ${search}}
      // `);

      // console.log(`
      //   ----- idsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(idsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- updatedIDsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(updatedIDsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
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
      // --------------------------------------------------
      //   Button Enable
      // --------------------------------------------------

      setButtonDisabled(false);
    }
  };

  /**
   * 削除フォームを送信する
   */
  const handleDelete = async () => {
    try {
      // --------------------------------------------------
      //   Button Disable
      // --------------------------------------------------

      setButtonDisabled(true);

      // --------------------------------------------------
      //   編集するIDが選ばれていない場合、エラー
      // --------------------------------------------------

      if (!_id) {
        throw new CustomError({
          errorsArr: [{ code: "-PQYNFlb", messageID: "Z9LG9XL5W" }],
        });
      }

      // --------------------------------------------------
      //   FormData
      // --------------------------------------------------

      const formDataObj = {
        _id,
      };

      // --------------------------------------------------
      //   Fetch
      // --------------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/ids/delete`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // --------------------------------------------------
      //   Error
      // --------------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // --------------------------------------------------
      //   データ更新
      // --------------------------------------------------

      setDataArr(resultObj.data);

      // --------------------------------------------------
      //   渡された関数を実行する
      //   ID登録フォームをロードした元のフォームのIDを更新する
      // --------------------------------------------------

      const updatedIDsArr = [];

      for (let valueObj of idsArr.values()) {
        const newObj = resultObj.data.find((valueObj2) => {
          return valueObj2._id === valueObj._id;
        });

        if (newObj) {
          updatedIDsArr.push(newObj);
        }
      }

      // --------------------------------------------------
      //   Update idsArr
      // --------------------------------------------------

      setIDsArr(updatedIDsArr);

      // --------------------------------------------------
      //   フォームを空にする
      // --------------------------------------------------

      set_id("");
      setPlatform("");
      setLabel("");
      setID("");
      setPublicSetting("");
      setSearch(true);
      setGamesArr([]);

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "j6lSS-Zf5",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/id/v2/components/form-edit.js - handleDelete
      // `);

      // console.log(chalk`
      //   _id: {green ${_id}}
      // `);

      // console.log(`
      //   ----- idsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(idsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- updatedIDsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(updatedIDsArr)), { colors: true, depth: null })}\n
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
      // --------------------------------------------------
      //   Button Enable
      // --------------------------------------------------

      setButtonDisabled(false);
    }
  };

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationPlatformObj = validationIDsPlatform({ value: platform });
  const validationLabelObj = validationIDsLabel({ value: label });
  const validationIDObj = validationIDsID({ value: id });
  const validationPublicSettingObj = validationIDsPublicSetting({
    value: publicSetting,
  });

  // --------------------------------------------------
  //   ゲーム選択フォーム
  //   ゲーム選択フォームを表示するかどうかの真偽値　配列内のプラットフォームの場合、表示しない
  // --------------------------------------------------

  const gameSelectForm =
    [
      "PlayStation",
      "Xbox",
      "Nintendo",
      "Steam",
      "Origin",
      "Discord",
      "Skype",
      "ICQ",
      "Line",
    ].indexOf(validationPlatformObj.value) === -1;

  // --------------------------------------------------
  //   Component - 編集可能なID
  // --------------------------------------------------

  const componentsIDArr = [];

  for (const [index, valueObj] of dataArr.entries()) {
    const games_id = lodashGet(valueObj, ["gamesObj", "_id"], "");
    const gamesName = lodashGet(valueObj, ["gamesObj", "name"], "");
    const gamesImagesAndVideosThumbnailObj = lodashGet(
      valueObj,
      ["gamesObj", "imagesAndVideosThumbnailObj"],
      {}
    );

    componentsIDArr.push(
      <div
        key={index}
        css={css`
          cursor: pointer;
        `}
        onClick={() => handleSelect({ ids_id: valueObj._id })}
      >
        <IDChip
          platform={valueObj.platform}
          label={valueObj.label}
          id={valueObj.id}
          games_id={games_id}
          gamesName={gamesName}
          gamesImagesAndVideosThumbnailObj={gamesImagesAndVideosThumbnailObj}
        />
      </div>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/id/v2/components/form-edit.js
  // `);

  // console.log(chalk`
  //   gameSelectForm: {green ${gameSelectForm}}
  // `);

  // console.log(`
  //   ----- gamesArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(gamesArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        padding: 8px 14px 16px 14px;
      `}
    >
      <p
        css={css`
          margin: 12px 0 0 0;
        `}
      >
        編集したいIDを押してから、フォームの内容を編集してください。「編集する」ボタンを押すとIDの編集が完了します。
      </p>

      <p>
        IDは「<strong>ラベル:</strong>{" "}
        ID」という並びで表示されます。ラベルが未入力の場合はプラットフォーム、選択したゲームの名前が代わりに表示されます。
      </p>

      {/* 編集可能なID */}
      <h4
        css={css`
          font-weight: bold;
          margin: 36px 0 0 0;
        `}
      >
        [ 編集可能なID ]
      </h4>

      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 4px 0 8px 0;

          @media screen and (max-width: 480px) {
            flex-flow: column wrap;
          }
        `}
      >
        {componentsIDArr}
      </div>

      {/* 編集フォーム */}
      <h4
        css={css`
          font-weight: bold;
          margin: 36px 0 0 0;
        `}
      >
        [ 編集フォーム ]
      </h4>

      {/* プラットフォーム */}
      <div
        css={css`
          margin: 12px 0 0 0;
        `}
      >
        <FormControl
          style={{ minWidth: 300 }}
          error={validationPlatformObj.error}
        >
          <InputLabel id="platform">プラットフォーム</InputLabel>

          <Select
            labelId="platform"
            value={validationPlatformObj.value}
            onChange={(eventObj) => setPlatform(eventObj.target.value)}
          >
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
            <MenuItem value={"Other"}>その他</MenuItem>
          </Select>

          <FormHelperText>
            {intl.formatMessage({ id: validationPlatformObj.messageID })}
          </FormHelperText>
        </FormControl>
      </div>

      {/* ゲーム選択 */}
      {gameSelectForm && (
        <FormGame
          gamesArr={gamesArr}
          setGamesArr={setGamesArr}
          gamesLimit={gamesLimit}
        />
      )}

      {/* ラベル */}
      <div>
        <TextField
          css={css`
            && {
              width: 400px;

              @media screen and (max-width: 480px) {
                width: 100%;
              }
            }
          `}
          id="label"
          label="ラベル"
          value={validationLabelObj.value}
          onChange={(eventObj) => setLabel(eventObj.target.value)}
          error={validationLabelObj.error}
          helperText={intl.formatMessage(
            { id: validationLabelObj.messageID },
            { numberOfCharacters: validationLabelObj.numberOfCharacters }
          )}
          margin="normal"
          inputProps={{
            maxLength: 30,
          }}
        />
      </div>

      {/* ID */}
      <div>
        <TextField
          css={css`
            && {
              width: 400px;

              @media screen and (max-width: 480px) {
                width: 100%;
              }
            }
          `}
          id="id"
          label="ID"
          value={validationIDObj.value}
          onChange={(eventObj) => setID(eventObj.target.value)}
          error={validationIDObj.error}
          helperText={intl.formatMessage(
            { id: validationIDObj.messageID },
            { numberOfCharacters: validationIDObj.numberOfCharacters }
          )}
          margin="normal"
          inputProps={{
            maxLength: 100,
          }}
        />
      </div>

      {/* 公開設定 */}
      <div
        css={css`
          margin: 12px 0 0 0;
        `}
      >
        <FormControl
          style={{ minWidth: 300 }}
          error={validationPublicSettingObj.error}
        >
          <InputLabel id="publicSetting">IDの公開設定</InputLabel>

          <Select
            labelId="publicSetting"
            value={validationPublicSettingObj.value}
            onChange={(eventObj) => setPublicSetting(eventObj.target.value)}
          >
            <MenuItem value={1}>誰にでも公開</MenuItem>
            <MenuItem value={2}>自分をフォローしているユーザーに公開</MenuItem>
            <MenuItem value={3}>自分がフォローしているユーザーに公開</MenuItem>
            <MenuItem value={4}>相互フォローで公開</MenuItem>
            <MenuItem value={5}>自分以外には公開しない</MenuItem>
          </Select>

          <FormHelperText>
            {intl.formatMessage({ id: validationPublicSettingObj.messageID })}
          </FormHelperText>
        </FormControl>
      </div>

      {/* 検索可能 */}
      <div
        css={css`
          margin: 24px 0 0 0;
        `}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={search}
              onChange={(eventObj) => setSearch(eventObj.target.checked)}
            />
          }
          label="このIDを検索可能にする"
        />
      </div>

      {/* 「編集する」ボタン */}
      <div
        css={css`
          margin: 24px 0 12px 0;
        `}
      >
        <Button
          css={css`
            && {
              margin: 0 12px 0 0;
            }
          `}
          variant="outlined"
          color="primary"
          disabled={buttonDisabled}
          onClick={() => handleSubmit()}
        >
          編集する
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          disabled={buttonDisabled}
          onClick={() =>
            handleDialogOpen({
              title: "ID削除",
              description: "このIDを削除しますか？",
              handle: handleDelete,
              argumentsObj: {},
            })
          }
        >
          削除する
        </Button>
      </div>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

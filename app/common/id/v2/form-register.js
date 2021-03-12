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
import lodashCloneDeep from "lodash/cloneDeep";

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

  const { setDataArr, unselectedArr, setUnselectedArr, gamesLimit } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

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
  //   Handler
  // --------------------------------------------------

  /**
   * 登録フォームを送信する
   */
  const handleSubmit = async () => {
    try {
      // --------------------------------------------------
      //   Button Disable
      // --------------------------------------------------

      setButtonDisabled(true);

      // --------------------------------------------------
      //   フォームに必要な情報が入力されていない場合、エラー
      // --------------------------------------------------

      if (!platform || !id || !publicSetting) {
        throw new CustomError({
          errorsArr: [{ code: "gk89EvTvH", messageID: "uwHIKBy7c" }],
        });
      }

      // --------------------------------------------------
      //   FormData
      // --------------------------------------------------

      const formDataObj = {
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

      const tempDataArr = resultObj.data;
      setDataArr(tempDataArr);

      // --------------------------------------------------
      //   未選択IDに追加 / _id のみでいい
      // --------------------------------------------------

      unselectedArr.push(tempDataArr[tempDataArr.length - 1]._id);
      setUnselectedArr(lodashCloneDeep(unselectedArr));

      // --------------------------------------------------
      //   フォームを空にする
      // --------------------------------------------------

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
            messageID: "As9-T8q9N",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/id/v2/components/form-register.js - handleSubmit
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

      // console.log(chalk`
      //   tempDataArr.length: {green ${tempDataArr.length}}
      // `);

      // console.log(`
      //   ----- tempDataArr[tempDataArr.length - 1] -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(tempDataArr[tempDataArr.length - 1])), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- dataArr[dataArr.length] -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(dataArr[dataArr.length])), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- unselectedArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(unselectedArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    } catch (errorObj) {
      // --------------------------------------------------
      //   Snackbar: Error
      // --------------------------------------------------

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
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/id/v2/components/form-register.js
  // `);

  // console.log(`
  //   ----- gamesArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(gamesArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   _id: {green ${_id}}
  //   platform: {green ${platform}}
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
        IDを登録する場合は、こちらのフォームに必要なデータを入力してから「登録する」ボタンを押してください。
        <span
          css={css`
            color: red;
          `}
        >
          IDは公開可能な情報であるため、パスワードなど、他の人に見せてはいけない情報は絶対に入力しないようにしてください。
        </span>
      </p>

      <p>
        IDは「<strong>ラベル:</strong>{" "}
        ID」という並びで表示されます。ラベルが未入力の場合は、プラットフォームや選択したゲームの名前が代わりに表示されます。
      </p>

      {/* 登録フォーム */}
      <h4
        css={css`
          font-weight: bold;
          margin: 24px 0 0 0;
        `}
      >
        [ 登録フォーム ]
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

      {/* 「登録する」ボタン */}
      <div
        css={css`
          margin: 24px 0 0 0;
        `}
      >
        <Button
          variant="outlined"
          color="primary"
          disabled={buttonDisabled}
          onClick={() => handleSubmit()}
        >
          登録する
        </Button>
      </div>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

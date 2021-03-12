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

import React from "react";
import { useIntl } from "react-intl";
import shortid from "shortid";

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

import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconAddCircle from "@material-ui/icons/AddCircle";
import IconRemoveCircle from "@material-ui/icons/RemoveCircle";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationGamesLinkArr } from "app/@database/games/validations/link.js";

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

  const { linkArr, setLinkArr } = props;

  const limit = parseInt(process.env.NEXT_PUBLIC_GAMES_LINK_LIMIT, 10);

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * ウェブサイトの種類を選択する
   */
  const handleOnChangeType = ({ index, value }) => {
    const clonedArr = lodashCloneDeep(linkArr);
    lodashSet(clonedArr, [index, "type"], value);
    setLinkArr(clonedArr);
  };

  /**
   * Label を入力する
   */
  const handleOnChangeLabel = ({ index, value }) => {
    const clonedArr = lodashCloneDeep(linkArr);
    lodashSet(clonedArr, [index, "label"], value);
    setLinkArr(clonedArr);
  };

  /**
   * URL を入力する
   */
  const handleOnChangeURL = ({ index, value }) => {
    const clonedArr = lodashCloneDeep(linkArr);
    lodashSet(clonedArr, [index, "url"], value);
    setLinkArr(clonedArr);
  };

  /**
   * フォームを増やす
   */
  const handleAdd = () => {
    if (linkArr.length < limit) {
      const clonedArr = lodashCloneDeep(linkArr);

      clonedArr.push({
        _id: "",
        type: "Official",
        label: "",
        url: "",
      });

      setLinkArr(clonedArr);
    }
  };

  /**
   * フォームを減らす
   */
  const handleRemove = ({ index }) => {
    const clonedArr = lodashCloneDeep(linkArr);

    if (index) {
      clonedArr.splice(index, 1);
    } else if (linkArr.length > 0) {
      clonedArr.pop();
    }

    setLinkArr(clonedArr);
  };

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationObj = validationGamesLinkArr({ valueArr: linkArr });

  // --------------------------------------------------
  //   Component - Form
  // --------------------------------------------------

  let componentsArr = [];

  for (const [index, valueObj] of linkArr.entries()) {
    const type = lodashGet(valueObj, ["type"], "");

    const label = lodashGet(valueObj, ["label"], "");
    const labelError = lodashGet(
      validationObj,
      ["formArr", index, "labelObj", "error"],
      false
    );
    const labelMessageID = lodashGet(
      validationObj,
      ["formArr", index, "labelObj", "messageID"],
      "sOgKU3gS9"
    );

    const url = lodashGet(valueObj, ["url"], "");
    const urlError = lodashGet(
      validationObj,
      ["formArr", index, "urlObj", "error"],
      false
    );
    const urlMessageID = lodashGet(
      validationObj,
      ["formArr", index, "urlObj", "messageID"],
      "CAhUTCx7B"
    );

    componentsArr.push(
      <div
        css={css`
          border-bottom: 1px dashed #d0d0d0;
          padding: 24px 0;
        `}
        key={index}
      >
        {/* ウェブサイトの種類 */}
        <div
          css={css`
            margin: 12px 0 12px 0;
          `}
        >
          <FormControl>
            <InputLabel htmlFor="linkType">ウェブサイトの種類</InputLabel>

            <Select
              css={css`
                && {
                  width: 200px;
                }
              `}
              _id="linkType"
              value={type}
              onChange={(eventObj) =>
                handleOnChangeType({ index, value: eventObj.target.value })
              }
            >
              <MenuItem value={"Official"}>公式</MenuItem>
              <MenuItem value={"Twitter"}>Twitter</MenuItem>
              <MenuItem value={"Facebook"}>Facebook</MenuItem>
              <MenuItem value={"YouTube"}>YouTube</MenuItem>
              <MenuItem value={"Steam"}>Steam</MenuItem>
              <MenuItem value={"MicrosoftStore"}>Microsoft Store</MenuItem>
              <MenuItem value={"AppStore"}>App Store</MenuItem>
              <MenuItem value={"GooglePlay"}>Google Play</MenuItem>
              <MenuItem value={"Other"}>その他</MenuItem>
            </Select>
          </FormControl>

          {/* - ボタン */}
          <IconButton
            css={css`
              && {
                margin-left: 24px;
              }
            `}
            onClick={() => handleRemove({ index })}
          >
            <IconRemoveCircle />
          </IconButton>
        </div>

        {/* リンクのタイトル */}
        {valueObj.type === "Other" && (
          <TextField
            css={css`
              && {
                width: 400px;

                @media screen and (max-width: 480px) {
                  width: 100%;
                }
              }
            `}
            id="linkLabel"
            label="リンクのタイトル"
            value={label}
            onChange={(eventObj) =>
              handleOnChangeLabel({ index, value: eventObj.target.value })
            }
            error={labelError}
            helperText={intl.formatMessage({ id: labelMessageID })}
            margin="normal"
            inputProps={{
              maxLength: 20,
            }}
          />
        )}

        {/* URL */}
        <TextField
          css={css`
            && {
              width: 100%;
            }
          `}
          id={`linkURL${index}`}
          label="URL"
          value={url}
          onChange={(eventObj) =>
            handleOnChangeURL({ index, value: eventObj.target.value })
          }
          error={urlError}
          helperText={intl.formatMessage({ id: urlMessageID })}
          margin="normal"
          inputProps={{
            maxLength: 500,
          }}
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
          margin: 0 0 6px 0;
        `}
      >
        リンク
      </h3>

      <p
        css={css`
          margin: 0 0 0 0;
        `}
      >
        公式サイトや公式SNSのリンクを登録してください。
      </p>

      {/* Form */}
      {componentsArr}

      {/* フォーム追加・削除ボタン */}
      <div
        css={css`
          margin: 12px 0 0 0;
        `}
      >
        {/* - ボタン */}
        <IconButton
          css={css`
            && {
              margin-right: 16px;
            }
          `}
          onClick={() => handleRemove({})}
        >
          <IconRemoveCircle />
        </IconButton>

        {/* + ボタン */}
        <IconButton onClick={() => handleAdd()}>
          <IconAddCircle />
        </IconButton>
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

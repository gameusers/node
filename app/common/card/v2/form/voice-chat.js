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
import TextareaAutosize from "react-autosize-textarea";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconHeadsetMic from "@material-ui/icons/HeadsetMic";

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
    voiceChat,
    setVoiceChat,
    voiceChatComment,
    setVoiceChatComment,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

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
        ボイスチャット
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        入力するとボイスチャットについての情報が表示されます。
      </p>

      {/* 募集中かどうか */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 24px 0 0 0;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row nowrap;
            margin: 3px 0 0 0;
          `}
        >
          <IconHeadsetMic
            css={css`
              && {
                font-size: 24px;
                margin: 0 6px 0 0;
              }
            `}
          />
          <div
            css={css`
              margin: 0 6px 0 0;
            `}
          >
            ボイスチャット:
          </div>
        </div>

        <FormControl>
          <Select
            value={voiceChat}
            onChange={(eventObj) => setVoiceChat(eventObj.target.value)}
            inputProps={{
              name: "friend",
              id: "friend",
            }}
          >
            <MenuItem value={true}>できる</MenuItem>
            <MenuItem value={false}>できない</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* コメント */}
      <div
        css={css`
          margin: 12px 0 0 0;
        `}
      >
        <TextareaAutosize
          css={css`
            && {
              width: 100%;
              border-radius: 4px;
              box-sizing: border-box;
              padding: 8px 12px;
              line-height: 1.8;

              &:focus {
                outline: 1px #a9f5f2 solid;
              }

              resize: none;
            }
          `}
          rows={5}
          placeholder="コメントを入力してください。"
          value={voiceChatComment}
          maxLength={3000}
          onChange={(eventObj) => setVoiceChatComment(eventObj.target.value)}
        />
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

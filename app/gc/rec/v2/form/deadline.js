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

import TextField from "@material-ui/core/TextField";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationRecruitmentThreadsDeadlineDate } from "app/@database/recruitment-threads/validations/deadline.js";

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

  const { deadlineDate, setDeadlineDate, recruitmentThreads_id } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationRecruitmentThreadsDeadlineDateObj = validationRecruitmentThreadsDeadlineDate(
    { value: deadlineDate }
  );

  // --------------------------------------------------
  //   日付のフォーマット
  // --------------------------------------------------

  const formattedDate = deadlineDate
    ? moment(deadlineDate).format("YYYY-MM-DDTHH:mm")
    : "";

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/form/deadline.js
  // `);

  // console.log(chalk`
  //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
  //   showForm: {green ${showForm}}
  // `);

  // console.log(`
  //   ----- validationRecruitmentThreadsID1Obj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(validationRecruitmentThreadsID1Obj)), { colors: true, depth: null })}\n
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
        募集期限 （未記入でもOK）
      </h3>

      <p
        css={css`
          ${!recruitmentThreads_id && "margin: 0 0 24px 0"};
        `}
      >
        募集期限を設定する場合は、募集の締切日時を設定してください。募集期限が過ぎると、募集者とコメントをした方のID・情報が自動的に非表示になります。無期限に募集を掲載したい場合は未記入にしてください。
      </p>

      {recruitmentThreads_id && (
        <p
          css={css`
            color: red;
            margin: 0 0 24px 0;
          `}
        >
          すぐに募集を締め切りたい場合は、この欄で過去の日時を入力してください。
        </p>
      )}

      <TextField
        css={css`
          && {
            width: 400px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        label="募集の締切日時"
        type="datetime-local"
        value={formattedDate}
        onChange={(eventObj) => setDeadlineDate(eventObj.target.value)}
        error={validationRecruitmentThreadsDeadlineDateObj.error}
        helperText={intl.formatMessage(
          { id: validationRecruitmentThreadsDeadlineDateObj.messageID },
          {
            numberOfCharacters:
              validationRecruitmentThreadsDeadlineDateObj.numberOfCharacters,
          }
        )}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

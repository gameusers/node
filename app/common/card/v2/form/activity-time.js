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

import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconAddCircle from "@material-ui/icons/AddCircle";
import IconRemoveCircle from "@material-ui/icons/RemoveCircle";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationCardPlayersActivityTimeArr } from "app/@database/card-players/validations/activity-time.js";

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

  const { activityTimeArr, setActivityTimeArr } = props;

  const limit = parseInt(
    process.env.NEXT_PUBLIC_CARD_PLAYER_ACTIVITY_TIME_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 開始時間、終了時間を入力する
   */
  const handleOnChangeTime = ({ index, value, type }) => {
    const clonedArr = lodashCloneDeep(activityTimeArr);

    if (type === "beginTime") {
      lodashSet(clonedArr, [index, "beginTime"], value);
    } else {
      lodashSet(clonedArr, [index, "endTime"], value);
    }

    setActivityTimeArr(clonedArr);
  };

  /**
   * 曜日をチェックする
   */
  const handleOnChangeWeek = ({ index, value }) => {
    const clonedArr = lodashCloneDeep(activityTimeArr);
    const weekArr = lodashGet(clonedArr, [index, "weekArr"], []);
    const arrayIndex = weekArr.indexOf(value);

    if (arrayIndex === -1) {
      weekArr.push(value);
    } else {
      weekArr.splice(arrayIndex, 1);
    }

    weekArr.sort((a, b) => {
      return a - b;
    });

    lodashSet(clonedArr, [index, "weekArr"], weekArr);
    setActivityTimeArr(clonedArr);

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/card/v2/form/activity-time.js - handleOnChangeWeek
    // `);

    // console.log(chalk`
    //   index: {green ${index}}
    //   value: {green ${value}}
    //   arrayIndex: {green ${arrayIndex}}
    // `);

    // console.log(`
    //   ----- clonedArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(clonedArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  };

  /**
   * フォームを増やす
   */
  const handleAdd = () => {
    if (activityTimeArr.length < limit) {
      const clonedArr = lodashCloneDeep(activityTimeArr);

      clonedArr.push({
        _id: shortid.generate(),
        beginTime: "",
        endTime: "",
        weekArr: [],
      });

      setActivityTimeArr(clonedArr);
    }
  };

  /**
   * フォームを減らす
   */
  const handleRemove = () => {
    if (activityTimeArr.length > 0) {
      const clonedArr = lodashCloneDeep(activityTimeArr);
      clonedArr.pop();
      setActivityTimeArr(clonedArr);
    }
  };

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationObj = validationCardPlayersActivityTimeArr({
    valueArr: activityTimeArr,
  });

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  for (const [index, valueObj] of activityTimeArr.entries()) {
    const beginTime = lodashGet(valueObj, ["beginTime"], "");
    const beginTimeError = lodashGet(
      validationObj,
      ["formArr", index, "beginTimeObj", "error"],
      false
    );
    const beginTimeMessageID = lodashGet(
      validationObj,
      ["formArr", index, "beginTimeObj", "messageID"],
      "qnWsuPcrJ"
    );

    const endTime = lodashGet(valueObj, ["endTime"], "");
    const endTimeError = lodashGet(
      validationObj,
      ["formArr", index, "endTimeObj", "error"],
      false
    );
    const endTimeMessageID = lodashGet(
      validationObj,
      ["formArr", index, "endTimeObj", "messageID"],
      "qnWsuPcrJ"
    );

    const weekArr = lodashGet(valueObj, ["weekArr"], "");
    const weekError = lodashGet(
      validationObj,
      ["formArr", index, "weekObj", "error"],
      false
    );
    const weekMessageID = lodashGet(
      validationObj,
      ["formArr", index, "weekObj", "messageID"],
      "qnWsuPcrJ"
    );

    componentsArr.push(
      <React.Fragment key={index}>
        <div
          css={css`
            margin: 12px 0 0 0;
          `}
        >
          <TextField
            css={css`
              && {
                margin-right: 16px;
              }
            `}
            id={`beginTimeActivityTime${index}`}
            label="開始時間"
            type="time"
            value={beginTime}
            onChange={(eventObj) =>
              handleOnChangeTime({
                index,
                value: eventObj.target.value,
                type: "beginTime",
              })
            }
            error={beginTimeError}
            helperText={intl.formatMessage({ id: beginTimeMessageID })}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            css={css`
              && {
                margin-right: 16px;
              }
            `}
            id={`endTimeActivityTime${index}`}
            label="終了時間"
            type="time"
            value={endTime}
            onChange={(eventObj) =>
              handleOnChangeTime({
                index,
                value: eventObj.target.value,
                type: "endTime",
              })
            }
            error={endTimeError}
            helperText={intl.formatMessage({ id: endTimeMessageID })}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <FormControl required error={weekError} component="fieldset">
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={weekArr.indexOf(1) !== -1}
                  onChange={() => handleOnChangeWeek({ index, value: 1 })}
                  color="primary"
                />
              }
              label="月"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={weekArr.indexOf(2) !== -1}
                  onChange={() => handleOnChangeWeek({ index, value: 2 })}
                  color="primary"
                />
              }
              label="火"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={weekArr.indexOf(3) !== -1}
                  onChange={() => handleOnChangeWeek({ index, value: 3 })}
                  color="primary"
                />
              }
              label="水"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={weekArr.indexOf(4) !== -1}
                  onChange={() => handleOnChangeWeek({ index, value: 4 })}
                  color="primary"
                />
              }
              label="木"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={weekArr.indexOf(5) !== -1}
                  onChange={() => handleOnChangeWeek({ index, value: 5 })}
                  color="primary"
                />
              }
              label="金"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={weekArr.indexOf(6) !== -1}
                  onChange={() => handleOnChangeWeek({ index, value: 6 })}
                  color="primary"
                />
              }
              label="土"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={weekArr.indexOf(7) !== -1}
                  onChange={() => handleOnChangeWeek({ index, value: 7 })}
                  color="primary"
                />
              }
              label="日"
            />
          </FormGroup>

          <FormHelperText>
            {intl.formatMessage({ id: weekMessageID })}
          </FormHelperText>
        </FormControl>
      </React.Fragment>
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
        活動時間
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        入力すると活動時間が表示されます。開始時間と終了時間、曜日を入力してください。
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
          onClick={() => handleRemove()}
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

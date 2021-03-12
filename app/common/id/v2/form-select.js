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

// ---------------------------------------------
//   Components
// ---------------------------------------------

import IDChip from "app/common/id/v2/chip.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssHeading = css`
  font-weight: bold;
  margin: 24px 0 0 0;
`;

const cssBox = css`
  display: flex;
  flex-flow: row wrap;
  margin: 4px 0 8px 0;

  @media screen and (max-width: 480px) {
    flex-flow: column wrap;
  }
`;

const cssIDBox = css`
  cursor: pointer;
`;

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
    dataArr,
    selectedArr,
    setSelectedArr,
    unselectedArr,
    setUnselectedArr,
    setIDsArr,
    setDialogOpen,
  } = props;

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
   * 選択IDから未選択IDに移動する
   * @param {number} index - 移動するIDの配列index
   */
  const handleToUnselected = ({ index }) => {
    unselectedArr.push(selectedArr[index]);
    selectedArr.splice(index, 1);

    setSelectedArr(lodashCloneDeep(selectedArr));
    setUnselectedArr(lodashCloneDeep(unselectedArr));
  };

  /**
   * 未選択IDから選択IDに移動する
   * @param {number} index - 移動するIDの配列index
   */
  const handleToSelected = ({ index }) => {
    selectedArr.push(unselectedArr[index]);
    unselectedArr.splice(index, 1);

    setSelectedArr(lodashCloneDeep(selectedArr));
    setUnselectedArr(lodashCloneDeep(unselectedArr));
  };

  /**
   * 選択を確定するボタンを押したときに実行される
   */
  const handleSubmit = () => {
    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/id/v2/components/form-select.js - handleSubmit
    // `);

    // console.log(`
    //   ----- selectedIDsArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(selectedIDsArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // --------------------------------------------------
    //   更新
    // --------------------------------------------------

    setIDsArr(selectedIDsArr);

    // --------------------------------------------------
    //   ダイアログを閉じる
    // --------------------------------------------------

    setDialogOpen(false);
  };

  // --------------------------------------------------
  //   Component - 選択ID
  // --------------------------------------------------

  const selectedIDsArr = [];
  const componentsSelectedArr = [];

  for (const [index, value] of selectedArr.entries()) {
    const tempObj = dataArr.find((valueObj) => {
      return valueObj._id === value;
    });

    if (tempObj) {
      selectedIDsArr.push(tempObj);

      const games_id = lodashGet(tempObj, ["gamesObj", "_id"], "");
      const gamesName = lodashGet(tempObj, ["gamesObj", "name"], "");
      const gamesImagesAndVideosThumbnailObj = lodashGet(
        tempObj,
        ["gamesObj", "imagesAndVideosThumbnailObj"],
        {}
      );

      componentsSelectedArr.push(
        <div
          css={cssIDBox}
          key={index}
          onClick={() =>
            handleToUnselected({
              index,
            })
          }
        >
          <IDChip
            platform={tempObj.platform}
            label={tempObj.label}
            id={tempObj.id}
            games_id={games_id}
            gamesName={gamesName}
            gamesImagesAndVideosThumbnailObj={gamesImagesAndVideosThumbnailObj}
          />
        </div>
      );
    }
  }

  // --------------------------------------------------
  //   Component - 未選択ID
  // --------------------------------------------------

  const componentsUnselectedArr = [];

  for (const [index, value] of unselectedArr.entries()) {
    const tempObj = dataArr.find((valueObj) => {
      return valueObj._id === value;
    });

    if (tempObj) {
      const games_id = lodashGet(tempObj, ["gamesObj", "_id"], "");
      const gamesName = lodashGet(tempObj, ["gamesObj", "name"], "");
      const gamesImagesAndVideosThumbnailObj = lodashGet(
        tempObj,
        ["gamesObj", "imagesAndVideosThumbnailObj"],
        {}
      );

      componentsUnselectedArr.push(
        <div
          css={cssIDBox}
          key={index}
          onClick={() =>
            handleToSelected({
              index,
            })
          }
        >
          <IDChip
            platform={tempObj.platform}
            label={tempObj.label}
            id={tempObj.id}
            games_id={games_id}
            gamesName={gamesName}
            gamesImagesAndVideosThumbnailObj={gamesImagesAndVideosThumbnailObj}
          />
        </div>
      );
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/id/v2/components/form-select.js
  // `);

  // console.log(chalk`
  //   _id: {green ${_id}}
  // `);

  // console.log(`
  //   ----- forUpdateOtherStorePathArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(forUpdateOtherStorePathArr)), { colors: true, depth: null })}\n
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
        Game
        Usersでは、何度も同じIDを入力しなくていいように、IDを登録してから利用するシステムになっています。IDを登録したことがない方は、上部の「登録」ボタンを押してIDを登録してみてください。次回からはIDの利用がとても簡単になります。
        <br />
        <br />
        選択したいIDをクリック（タップ）して、[ 選択ID ]
        の欄に入れてください。「選択を確定する」ボタンを押すと、IDの選択は完了します。
      </p>

      {/* 選択ID */}
      <h4 css={cssHeading}>[ 選択ID ]</h4>

      <div css={cssBox}>{componentsSelectedArr}</div>

      {/* 未選択ID */}
      <h4 css={cssHeading}>[ 未選択ID ]</h4>

      <div css={cssBox}>{componentsUnselectedArr}</div>

      {/* 「選択を確定する」ボタン */}
      <Button
        css={css`
          && {
            margin: 24px 0 0 0;
          }
        `}
        variant="outlined"
        color="primary"
        disabled={buttonDisabled}
        onClick={() => handleSubmit()}
      >
        選択を確定する
      </Button>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

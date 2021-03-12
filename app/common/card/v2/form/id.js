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

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import IDChip from "app/common/id/v2/chip.js";
import IDForm from "app/common/id/v2/form.js";

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

  const { idsArr, setIDsArr } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Component - 選択済みID
  // --------------------------------------------------

  const componentsSelectedArr = [];

  for (const [index, valueObj] of idsArr.entries()) {
    const games_id = lodashGet(valueObj, ["gamesObj", "_id"], "");
    const gamesName = lodashGet(valueObj, ["gamesObj", "name"], "");
    const gamesImagesAndVideosThumbnailObj = lodashGet(
      valueObj,
      ["gamesObj", "imagesAndVideosThumbnailObj"],
      {}
    );

    componentsSelectedArr.push(
      <IDChip
        key={index}
        platform={valueObj.platform}
        label={valueObj.label}
        id={valueObj.id}
        games_id={games_id}
        gamesName={gamesName}
        gamesImagesAndVideosThumbnailObj={gamesImagesAndVideosThumbnailObj}
      />
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
        ID
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        ゲームや連絡先のIDを表示します。「IDを登録・編集する」ボタンを押して、表示したいIDを選択してください。
      </p>

      {/* 選択済みID */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 12px 0 8px 0;

          @media screen and (max-width: 480px) {
            flex-flow: column wrap;
          }
        `}
      >
        {componentsSelectedArr}
      </div>

      {/* ID 選択・編集フォーム */}
      <div
        css={css`
          margin: 24px 0 0 0;
        `}
      >
        <IDForm idsArr={idsArr} setIDsArr={setIDsArr} />
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

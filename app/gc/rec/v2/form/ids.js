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
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/form/ids.js
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
    <div
      css={css`
        margin: 24px 0 0 0;
      `}
    >
      <p
        css={css`
          margin: 0 0 14px 0;
        `}
      >
        ゲームや連絡先のIDを表示します。「IDを登録・編集する」ボタンを押して、表示したいIDを選択してください。
      </p>

      <p>
        募集ではIDごとの個別の公開設定は無効になります。例えばこの欄の公開設定で「誰にでも公開」を選んだ場合は、個別の設定を無視して選択したIDが誰にでも公開されるようになります。気をつけてください。
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
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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
// import lodashSet from 'lodash/set';
// import lodashHas from 'lodash/has';
// import lodashCloneDeep from 'lodash/cloneDeep';
// import lodashMerge from 'lodash/merge';

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconStyle from "@material-ui/icons/Style";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import IDChip from "app/common/id/v2/chip.js";

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

  const { idsArr = [], publicIDsArr = [] } = props;

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  const componentsArr = [];

  // ---------------------------------------------
  //   - idsArr / ログインしてIDを選択した場合
  // ---------------------------------------------

  if (Array.isArray(idsArr) && idsArr.length > 0) {
    for (const [index, valueObj] of idsArr.entries()) {
      const games_id = lodashGet(valueObj, ["gamesObj", "_id"], "");
      const gamesName = lodashGet(valueObj, ["gamesObj", "name"], "");
      const gamesImagesAndVideosThumbnailObj = lodashGet(
        valueObj,
        ["gamesObj", "imagesAndVideosThumbnailObj"],
        {}
      );

      componentsArr.push(
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

    // ---------------------------------------------
    //   - publicIDsArr / 非ログインでIDを入力した場合
    // ---------------------------------------------
  } else if (Array.isArray(publicIDsArr) && publicIDsArr.length > 0) {
    for (const [index, valueObj] of publicIDsArr.entries()) {
      const label = valueObj.platform === "Other" ? "ID" : "";

      componentsArr.push(
        <IDChip
          key={index}
          platform={valueObj.platform}
          label={label}
          id={valueObj.id}
        />
      );
    }

    // ---------------------------------------------
    //   - 必要な情報がない場合、空のコンポーネントを返す
    // ---------------------------------------------
  } else {
    return null;
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/public-ids.js
  // `);

  // console.log(`
  //   ----- idsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(idsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- publicIDsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(publicIDsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Heading */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        `}
      >
        <IconStyle
          css={css`
            && {
              font-size: 24px;
            }
          `}
        />

        <h3
          css={css`
            margin: 2px 0 0 4px;
          `}
        >
          ID
        </h3>
      </div>

      {/* ID */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 4px 0 0 0;

          @media screen and (max-width: 480px) {
            flex-flow: column wrap;
          }
        `}
      >
        {componentsArr}
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

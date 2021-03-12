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

// import lodashGet from 'lodash/get';
// import lodashSet from 'lodash/set';
// import lodashHas from 'lodash/has';
// import lodashCloneDeep from 'lodash/cloneDeep';
// import lodashMerge from 'lodash/merge';

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconFriend from "@material-ui/icons/SentimentSatisfiedAlt";
import IconMember from "@material-ui/icons/SupervisedUserCircle";
import IconDeal from "@material-ui/icons/MonetizationOn";

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

  const { category } = props;

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  let component = "";

  if (category === 1) {
    component = (
      <div
        css={css`
          margin: 8px 8px 0 0;
        `}
      >
        <Chip
          avatar={
            <Avatar alt="フレンド募集">
              <IconFriend />
            </Avatar>
          }
          label="フレンド募集"
          color="primary"
          variant="outlined"
        />
      </div>
    );
  } else if (category === 2) {
    component = (
      <div
        css={css`
          margin: 8px 8px 0 0;
        `}
      >
        <Chip
          avatar={
            <Avatar alt="メンバー募集">
              <IconMember />
            </Avatar>
          }
          label="メンバー募集"
          color="primary"
          variant="outlined"
        />
      </div>
    );
  } else if (category === 3) {
    component = (
      <div
        css={css`
          margin: 8px 8px 0 0;
        `}
      >
        <Chip
          avatar={
            <Avatar alt="売買・交換相手募集">
              <IconDeal />
            </Avatar>
          }
          label="売買・交換相手募集"
          color="primary"
          variant="outlined"
        />
      </div>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/category-chip.js
  // `);

  // console.log(chalk`
  //   category: {green ${category}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return component;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

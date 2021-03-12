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

import moment from "moment";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconDescription from "@material-ui/icons/Description";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

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

  const { deadlineDate } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { ISO8601 } = stateLayout;

  // --------------------------------------------------
  //   必要な情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (!deadlineDate) {
    return null;
  }

  // --------------------------------------------------
  //   日数を取得
  // --------------------------------------------------

  // 現在の日時と締切日時の差をミリ秒で取得
  const diff = moment(deadlineDate).diff(moment(ISO8601));

  // duration オブジェクトを生成
  const duration = moment.duration(diff);

  // 締め切りまでの日数を取得（小数点切り捨て）
  const days = Math.floor(duration.asDays());

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  let component = `残り ${days}日`;

  if (days === 0) {
    component = (
      <span
        css={css`
          color: red;
        `}
      >
        残り {moment(deadlineDate).fromNow(true)}
      </span>
    );
  } else if (days < 0) {
    component = (
      <span
        css={css`
          color: red;
        `}
      >
        締め切り
      </span>
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/deadline-date.js
  // `);

  // console.log(chalk`
  //   deadlineDate: {green ${deadlineDate} / ${typeof deadlineDate}}
  //   ISO8601: {green ${ISO8601} / ${typeof ISO8601}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        margin: 4px 0 0 0;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        `}
      >
        {/* Icon */}
        <IconDescription
          css={css`
            && {
              font-size: 24px;
            }
          `}
        />

        {/* Heading */}
        <h3
          css={css`
            margin: 2px 0 0 4px;
          `}
        >
          募集期限:
        </h3>

        {/* 日数 */}
        <div
          css={css`
            font-size: 14px;
            margin: 2px 0 0 8px;
          `}
        >
          {component}
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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
import Link from "next/link";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import moment from "moment";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconHealing from "@material-ui/icons/Healing";
import IconSchedule from "@material-ui/icons/Schedule";
import IconStars from "@material-ui/icons/Stars";
import IconLayers from "@material-ui/icons/Layers";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { calculateLevel } from "app/@modules/level.js";

// ---------------------------------------------
//   Moment Locale
// ---------------------------------------------

moment.locale("ja");

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

// ---------------------------------------------
//   Name
// ---------------------------------------------

const cssNameNoColor = css`
  font-size: 14px;
  margin: 0 2px 0 0;
`;

// ---------------------------------------------
//   Level
// ---------------------------------------------

const cssLevelBox = css`
  display: flex;
  flex-flow: row nowrap;
`;

const cssIconStars = css`
  && {
    font-size: 18px;
    margin: 1px 3px 0 0;
  }
`;

const cssLevel = css`
  font-size: 14px;
  margin: 0 6px 0 0;
`;

// ---------------------------------------------
//   Cards
// ---------------------------------------------

const cssButton = css`
  && {
    font-size: 12px;
    height: 22px;
    min-height: 22px;
    margin: 0 6px 0 0;
    padding: 0 6px 0 3px;
  }
`;

const cssIconLayers = css`
  font-size: 16px !important;
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
    name,
    userID,
    status,
    accessDate,
    // gameName,
    // gameUrlID,
    exp,
    cardPlayers_id,
  } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { ISO8601, handleDialogCardOpen } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Component - Name
  // --------------------------------------------------

  let componentName = "";

  if (name && userID) {
    componentName = (
      <div css={cssNameNoColor}>
        <Link href={`/ur/[userID]`} as={`/ur/${userID}`}>
          <a>{name}</a>
        </Link>
      </div>
    );
  } else if (name) {
    componentName = <div css={cssNameNoColor}>{name}</div>;
  } else {
    componentName = <div css={cssNameNoColor}>ななしさん</div>;
  }

  // --------------------------------------------------
  //   Component - Status
  // --------------------------------------------------

  let componentStatus = "";

  if (status) {
    componentStatus = (
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
        `}
      >
        <IconHealing
          css={css`
            && {
              font-size: 18px;
              margin: 1px 2px 0 0;
            }
          `}
        />

        <div
          css={css`
            font-size: 14px;
            margin: 0 2px 0 0;
          `}
        >
          {status}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  //   Component - Access Time
  // --------------------------------------------------

  let componentAccessTime = "";

  if (accessDate) {
    // const datetimeNow = moment().utcOffset(0);
    const datetimeNow = moment(ISO8601).utc();
    let datetimeAccess = moment(accessDate).utc();

    // 現在の日時がアクセス日時よりも前になってしまった場合は、同じ値にしておく
    if (datetimeNow.isBefore(datetimeAccess)) {
      datetimeAccess = datetimeNow;
    }

    // console.log(chalk`
    //   datetimeNow.isBefore(datetimeAccess): {green ${datetimeNow.isBefore(datetimeAccess)}}
    // `);

    // datetimeAccess = datetimeNow;

    const accessTime = datetimeAccess.from(datetimeNow);

    componentAccessTime = (
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
        `}
      >
        <IconSchedule
          css={css`
            && {
              font-size: 18px;
              margin: 1px 3px 0 0;
            }
          `}
        />

        <div
          css={css`
            font-size: 14px;
            margin: 0 2px 0 0;
          `}
        >
          {accessTime}
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  //   下段
  // --------------------------------------------------

  let componentBottomArr = [];

  // --------------------------------------------------
  //   Component - Level
  // --------------------------------------------------

  if (userID) {
    const level = calculateLevel({ exp });

    componentBottomArr.push(
      <div css={cssLevelBox} key="levelBox">
        <IconStars css={cssIconStars} />
        <div css={cssLevel}>Lv.{level}</div>
      </div>
    );
  } else {
    componentBottomArr.push(
      <div css={cssLevelBox} key="levelBox">
        <IconStars css={cssIconStars} />
        <div css={cssLevel}>Lv.0</div>
      </div>
    );
  }

  // --------------------------------------------------
  //   Component - Button / Open Card Player
  // --------------------------------------------------

  if (cardPlayers_id) {
    componentBottomArr.push(
      <Button
        css={cssButton}
        variant="outlined"
        onClick={() =>
          handleDialogCardOpen({
            enqueueSnackbar,
            intl,
            cardPlayers_id,
            setButtonDisabled,
          })
        }
        disabled={buttonDisabled}
        key="cardPlayersButton"
      >
        <IconLayers css={cssIconLayers} />
        Player
      </Button>
    );
  }

  // --------------------------------------------------
  //   Button Card Game
  // --------------------------------------------------

  // if (showCardGameButton && cardGames_id) {

  //   // --------------------------------------------------
  //   //   Button Disable - ロードが終わるまで使用禁止
  //   // --------------------------------------------------

  //   let buttonDisabledCardGame = true;

  //   if (`${cardGames_id}-card-game` in buttonDisabledObj) {
  //     buttonDisabledCardGame = buttonDisabledObj[`${cardGames_id}-card-game`];
  //   }

  //   // --------------------------------------------------
  //   //   Component
  //   // --------------------------------------------------

  //   componentBottomArr.push(
  //     <Button
  //       css={cssButton}
  //       variant="outlined"
  //       onClick={() => handleCardPlayerDialogOpen('game', cardGames_id)}
  //       disabled={buttonDisabledCardGame}
  //       key="cardGamesButton"
  //     >
  //       <IconLayers css={cssIconLayers} />
  //       Game
  //     </Button>
  //   );

  // }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/user/v2/name.js
  // `);

  // console.log(`
  //   ----- validationForumThreadsNameObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(validationForumThreadsNameObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   forumThreads_id: {green ${forumThreads_id}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column wrap;
        line-height: 1.6em;
      `}
    >
      {/* 上段 */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
        `}
      >
        {componentName}
        {componentStatus}
        {componentAccessTime}
      </div>

      {/* 下段 */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
        `}
      >
        {componentBottomArr}
      </div>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

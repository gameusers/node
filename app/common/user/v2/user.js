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
//   Components
// ---------------------------------------------

import Thumbnail from "app/common/user/v2/thumbnail.js";
import Name from "app/common/user/v2/name.js";

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
    imagesAndVideosThumbnailObj,

    name,
    userID,
    status,
    accessDate,

    gameName,
    gameUrlID,

    exp,

    cardPlayers_id,
    // showCardPlayerButton,
    // cardGames_id,
    // showCardGameButton
  } = props;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/forum/v2/components/form/thread.js
  // `);

  // console.log(`
  //   ----- imagesAndVideosObj -----\n
  //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
  //   --------------------\n
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
        flex-flow: row nowrap;
      `}
    >
      {/* Thumbnail */}
      <div
        css={css`
          display: flex;
          flex-flow: column nowrap;
        `}
      >
        <Thumbnail imagesAndVideosThumbnailObj={imagesAndVideosThumbnailObj} />
      </div>

      {/* Name */}
      <div
        css={css`
          display: flex;
          flex-flow: column nowrap;
          padding: 0 0 0 10px;

          @media screen and (max-width: 480px) {
            max-width: initial;
          }
        `}
      >
        <Name
          name={name}
          userID={userID}
          status={status}
          accessDate={accessDate}
          gameName={gameName}
          gameUrlID={gameUrlID}
          // showGameName={showGameName}

          exp={exp}
          cardPlayers_id={cardPlayers_id}
          // showCardGameButton={showCardGameButton}
          // cardGames_id={cardGames_id}
          // showCardPlayerButton={showCardPlayerButton}
        />
      </div>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

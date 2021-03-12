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

import { useState } from "react";
import { createContainer } from "unstated-next";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// --------------------------------------------------
//   States
// --------------------------------------------------

const useForum = (initialStateObj) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const [forumThreadsForListObj, setForumThreadsForListObj] = useState(
    lodashGet(initialStateObj, ["forumThreadsForListObj"], {})
  );
  const [forumThreadsObj, setForumThreadsObj] = useState(
    lodashGet(initialStateObj, ["forumThreadsObj"], {})
  );
  const [forumCommentsObj, setForumCommentsObj] = useState(
    lodashGet(initialStateObj, ["forumCommentsObj"], {})
  );
  const [forumRepliesObj, setForumRepliesObj] = useState(
    lodashGet(initialStateObj, ["forumRepliesObj"], {})
  );

  const [reloadForceForumComment, setReloadForceForumComment] = useState(false);
  const [reloadForceForumReply, setReloadForceForumReply] = useState(false);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return {
    forumThreadsForListObj,
    setForumThreadsForListObj,

    forumThreadsObj,
    setForumThreadsObj,

    forumCommentsObj,
    setForumCommentsObj,

    forumRepliesObj,
    setForumRepliesObj,

    reloadForceForumComment,
    setReloadForceForumComment,

    reloadForceForumReply,
    setReloadForceForumReply,
  };
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export const ContainerStateForum = createContainer(useForum);

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
import { Element } from "react-scroll";
import moment from "moment";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/ja_JP";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashCloneDeep from "lodash/cloneDeep";
import lodashMerge from "lodash/merge";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// ---------------------------------------------
//   Material UI / Icon
// ---------------------------------------------

import IconPublic from "@material-ui/icons/Public";
import IconUpdate from "@material-ui/icons/Update";
import IconDelete from "@material-ui/icons/Delete";
import IconEdit from "@material-ui/icons/Edit";
import IconReply from "@material-ui/icons/Reply";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";
import { ContainerStateCommunity } from "app/@states/community.js";
import { ContainerStateForum } from "app/@states/forum.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { getCookie, setCookie } from "app/@modules/cookie.js";
import { showSnackbar } from "app/@modules/snackbar.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Paragraph from "app/common/layout/v2/paragraph.js";
import User from "app/common/user/v2/user.js";
import ImageAndVideo from "app/common/image-and-video/v2/image-and-video.js";
import GoodButton from "app/common/good/v2/button.js";

import FormComment from "app/common/forum/v2/form/comment.js";
import FormReply from "app/common/forum/v2/form/reply.js";
import Reply from "app/common/forum/v2/reply.js";

// ---------------------------------------------
//   Moment Locale
// ---------------------------------------------

moment.locale("ja");

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  input: {
    fontSize: "12px",
    color: "#666",
    padding: "6px 26px 6px 12px",
  },
});

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Comment
 */
const Comment = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    urlID,
    gameCommunities_id,
    userCommunityID,
    userCommunities_id,
    forumThreads_id,
    forumComments_id,
    enableAnonymity,
    deletable,
  } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();
  const stateCommunity = ContainerStateCommunity.useContainer();
  const stateForum = ContainerStateForum.useContainer();

  const {
    ISO8601,
    handleDialogOpen,
    handleLoadingOpen,
    handleLoadingClose,
  } = stateLayout;

  const { setGameCommunityObj, setUserCommunityObj } = stateCommunity;

  const {
    forumCommentsObj,
    setForumCommentsObj,
    setReloadForceForumComment,
  } = stateForum;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [showFormComment, setShowFormComment] = useState(false);
  const [showFormReply, setShowFormReply] = useState(false);
  const [goods, setGoods] = useState(
    lodashGet(forumCommentsObj, ["dataObj", forumComments_id, "goods"], 0)
  );

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * コメントを削除する
   */
  const handleDelete = async () => {
    try {
      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (
        (!gameCommunities_id && !userCommunities_id) ||
        !forumThreads_id ||
        !forumComments_id
      ) {
        throw new CustomError({
          errorsArr: [{ code: "_quWlqMjb", messageID: "1YJnibkmh" }],
        });
      }

      // ---------------------------------------------
      //   Loading Open
      // ---------------------------------------------

      handleLoadingOpen({});

      // ---------------------------------------------
      //   Button Disable
      // ---------------------------------------------

      setButtonDisabled(true);

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        gameCommunities_id,
        userCommunities_id,
        forumThreads_id,
        forumComments_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      let resultObj = {};

      if (gameCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/delete-comment-gc`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      } else if (userCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/delete-comment-uc`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      }

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // ---------------------------------------------
      //   Update - gameCommunityObj / userCommunityObj
      // ---------------------------------------------

      if (gameCommunities_id) {
        setGameCommunityObj(
          lodashGet(resultObj, ["data", "gameCommunityObj"], {})
        );
      } else {
        setUserCommunityObj(
          lodashGet(resultObj, ["data", "userCommunityObj"], {})
        );
      }

      // ---------------------------------------------
      //   Delete Comment Data
      // ---------------------------------------------

      const clonedObj = lodashCloneDeep(forumCommentsObj);

      const dataObj = lodashGet(clonedObj, ["dataObj"], {});
      delete dataObj[forumComments_id];

      setForumCommentsObj(clonedObj);

      // ---------------------------------------------
      //   次回の読み込み時に強制リロード
      // ---------------------------------------------

      setReloadForceForumComment(true);

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      const experienceObj = lodashGet(resultObj, ["data", "experienceObj"], {});

      showSnackbar({
        enqueueSnackbar,
        intl,
        experienceObj,
        arr: [
          {
            variant: "success",
            messageID: "GERzvKtUN",
          },
        ],
      });

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/forum/v2/components/thread.js - handleDelete
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    } catch (errorObj) {
      // ---------------------------------------------
      //   Snackbar: Error
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        errorObj,
      });
    } finally {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/forum/v2/components/comment.js
  // `);

  // console.log(chalk`
  //   urlID: {green ${urlID}}
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   userCommunityID: {green ${userCommunityID}}
  //   userCommunities_id: {green ${userCommunities_id}}
  //   forumThreads_id: {green ${forumThreads_id}}
  //   enableAnonymity: {green ${enableAnonymity}}
  // `);

  // console.log(chalk`
  //   page: {green ${page}}
  //   count: {green ${count}}
  //   limit: {green ${limit}}
  // `);

  // --------------------------------------------------
  //   dataObj
  // --------------------------------------------------

  const dataObj = lodashGet(
    forumCommentsObj,
    ["dataObj", forumComments_id],
    {}
  );

  if (Object.keys(dataObj).length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   User Data
  // --------------------------------------------------

  const imagesAndVideosThumbnailObj = lodashGet(
    dataObj,
    ["cardPlayersObj", "imagesAndVideosThumbnailObj"],
    {}
  );

  const cardPlayers_id = lodashGet(dataObj, ["cardPlayersObj", "_id"], "");

  let name = lodashGet(dataObj, ["name"], "");
  const cardPlayers_name = lodashGet(dataObj, ["cardPlayersObj", "name"], "");

  if (cardPlayers_name) {
    name = cardPlayers_name;
  }

  const status = lodashGet(dataObj, ["cardPlayersObj", "status"], "");

  const exp = lodashGet(dataObj, ["usersObj", "exp"], 0);
  const accessDate = lodashGet(dataObj, ["usersObj", "accessDate"], "");
  const userID = lodashGet(dataObj, ["usersObj", "userID"], "");

  // --------------------------------------------------
  //   Comment
  // --------------------------------------------------

  const comment = lodashGet(dataObj, ["comment"], "");

  // --------------------------------------------------
  //   Images and Videos
  // --------------------------------------------------

  const imagesAndVideosObj = lodashGet(dataObj, ["imagesAndVideosObj"], {});

  // --------------------------------------------------
  //   Datetime
  // --------------------------------------------------

  let datetimeCurrent = ISO8601;
  const datetimeUpdated = moment(dataObj.updatedDate);

  if (datetimeUpdated.isAfter(datetimeCurrent)) {
    datetimeCurrent = datetimeUpdated;
  }

  const datetimeFrom = datetimeUpdated.from(datetimeCurrent);

  // --------------------------------------------------
  //   Link
  // --------------------------------------------------

  let linkHref = "";
  let linkAs = "";

  if (urlID) {
    linkHref = `/gc/[urlID]/forum/[[...slug]]`;
    linkAs = `/gc/${urlID}/forum/${forumComments_id}`;
  } else if (userCommunityID) {
    linkHref = `/uc/[userCommunityID]/forum/[[...slug]]`;
    linkAs = `/uc/${userCommunityID}/forum/${forumComments_id}`;
  }

  // --------------------------------------------------
  //   編集権限 - 編集ボタンを表示する
  // --------------------------------------------------

  const editable = lodashGet(dataObj, ["editable"], false);

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  return (
    <Element
      css={css`
        border-top: 1px solid;
        border-image: linear-gradient(
          to right,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0.5),
          rgba(0, 0, 0, 0)
        );
        border-image-slice: 1;
        padding: 24px 0 0 0;
        margin: 24px 0 0 0;
      `}
      name={forumComments_id}
    >
      {/* Form */}
      {showFormComment && (
        <div
          css={css`
            width: 100%;
          `}
        >
          <FormComment
            gameCommunities_id={gameCommunities_id}
            userCommunities_id={userCommunities_id}
            forumThreads_id={forumThreads_id}
            forumComments_id={forumComments_id}
            enableAnonymity={enableAnonymity}
            setShowForm={setShowFormComment}
          />
        </div>
      )}

      {/* Comments & Replies */}
      {!showFormComment && (
        <React.Fragment>
          {/* ユーザー情報 - サムネイル画像・ハンドルネームなど */}
          <User
            imagesAndVideosThumbnailObj={imagesAndVideosThumbnailObj}
            name={name}
            userID={userID}
            status={status}
            accessDate={accessDate}
            exp={exp}
            cardPlayers_id={cardPlayers_id}
          />

          {/* Images and Videos */}
          {Object.keys(imagesAndVideosObj).length > 0 && (
            <div
              css={css`
                margin: 12px 0 0 0;
              `}
            >
              <ImageAndVideo imagesAndVideosObj={imagesAndVideosObj} />
            </div>
          )}

          {/* Comment Container / Left Green Line */}
          <div
            css={css`
              border-left: 4px solid #84cacb;
              margin: 12px 0;
              padding: 8px 0 8px 16px;

              @media screen and (max-width: 480px) {
                padding: 0 0 0 12px;
              }
            `}
          >
            {/* Comment */}
            <Paragraph text={comment} />

            {/* Bottom Container */}
            <div
              css={css`
                display: flex;
                flex-flow: row wrap;
                margin: 12px 0 0 0;

                @media screen and (max-width: 480px) {
                  flex-flow: column wrap;
                }
              `}
            >
              {/* Good Button & Updated Date & forumComments_id */}
              <div
                css={css`
                  display: flex;
                  flex-flow: row nowrap;
                `}
              >
                {/* Good Button */}
                <div
                  css={css`
                    && {
                      margin: 2px 12px 0 0;

                      @media screen and (max-width: 480px) {
                        margin: 2px 8px 0 0;
                      }
                    }
                  `}
                >
                  <GoodButton
                    goods={goods}
                    setGoods={setGoods}
                    type="forumComment"
                    target_id={forumComments_id}
                  />
                </div>

                {/* Updated Date */}
                <div
                  css={css`
                    display: flex;
                    flex-flow: row nowrap;
                    margin: 4px 12px 0 0;

                    @media screen and (max-width: 480px) {
                      margin: 4px 8px 0 0;
                    }
                  `}
                >
                  <IconUpdate
                    css={css`
                      && {
                        font-size: 22px;
                        margin: 0 2px 0 0;
                      }
                    `}
                  />

                  <div
                    css={css`
                      font-size: 12px;
                      margin: 1px 0 0 0;
                    `}
                  >
                    {datetimeFrom}
                  </div>
                </div>

                {/* forumComments_id */}
                <div
                  css={css`
                    display: flex;
                    flex-flow: row nowrap;
                    margin: 1px 0 0 0;
                  `}
                >
                  <IconPublic
                    css={css`
                      && {
                        font-size: 20px;
                        margin: 3px 2px 0 0;
                      }
                    `}
                  />
                  <div
                    css={css`
                      font-size: 12px;
                      color: #009933;
                      margin: 4px 0 0 0;
                    `}
                  >
                    <Link href={linkHref} as={linkAs}>
                      <a>{forumComments_id}</a>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div
                css={css`
                  display: flex;
                  flex-flow: row nowrap;
                  margin-left: auto;

                  @media screen and (max-width: 480px) {
                    margin-top: 12px;
                  }
                `}
              >
                {/* Reply Button */}
                <Button
                  css={css`
                    && {
                      font-size: 12px;
                      height: 22px;
                      min-width: 54px;
                      min-height: 22px;
                      padding: 0 3px;

                      @media screen and (max-width: 480px) {
                        min-width: 36px;
                        min-height: 22px;
                      }
                    }
                  `}
                  variant="outlined"
                  disabled={buttonDisabled}
                  onClick={() => setShowFormReply(true)}
                >
                  <IconReply
                    css={css`
                      && {
                        font-size: 16px;
                        margin: 0 1px 3px 0;
                      }
                    `}
                  />
                  返信
                </Button>

                {/* Delete Button */}
                {(deletable || editable) && (
                  <Button
                    css={css`
                      && {
                        font-size: 12px;
                        height: 22px;
                        min-width: 54px;
                        min-height: 22px;
                        margin: 0 0 0 12px;
                        padding: 0 4px;

                        @media screen and (max-width: 480px) {
                          min-width: 36px;
                          min-height: 22px;
                        }
                      }
                    `}
                    variant="outlined"
                    color="secondary"
                    disabled={buttonDisabled}
                    onClick={
                      buttonDisabled
                        ? () => {}
                        : () =>
                            handleDialogOpen({
                              title: "コメント削除",
                              description: "コメントを削除しますか？",
                              handle: handleDelete,
                              argumentsObj: {},
                            })
                    }
                  >
                    <IconDelete
                      css={css`
                        && {
                          font-size: 16px;
                          margin: 0 2px 1px 0;
                        }
                      `}
                    />
                    削除
                  </Button>
                )}

                {/* Edit Button */}
                {editable && (
                  <Button
                    css={css`
                      && {
                        font-size: 12px;
                        height: 22px;
                        min-width: 54px;
                        min-height: 22px;
                        margin: 0 0 0 12px;
                        padding: 0 4px;

                        @media screen and (max-width: 480px) {
                          min-width: 36px;
                          min-height: 22px;
                        }
                      }
                    `}
                    variant="outlined"
                    color="primary"
                    disabled={buttonDisabled}
                    onClick={() => setShowFormComment(true)}
                  >
                    <IconEdit
                      css={css`
                        && {
                          font-size: 16px;
                          margin: 0 2px 3px 0;
                        }
                      `}
                    />
                    編集
                  </Button>
                )}
              </div>
            </div>

            {/* Form Reply */}
            {showFormReply && (
              <div
                css={css`
                  margin: 6px 0 0 0;
                `}
              >
                <FormReply
                  gameCommunities_id={gameCommunities_id}
                  userCommunities_id={userCommunities_id}
                  forumThreads_id={forumThreads_id}
                  forumComments_id={forumComments_id}
                  enableAnonymity={enableAnonymity}
                  setShowForm={setShowFormReply}
                />
              </div>
            )}

            {/* Reply */}
            <Reply
              urlID={urlID}
              gameCommunities_id={gameCommunities_id}
              userCommunityID={userCommunityID}
              userCommunities_id={userCommunities_id}
              forumThreads_id={forumThreads_id}
              forumComments_id={forumComments_id}
              enableAnonymity={enableAnonymity}
              deletable={deletable}
            />
          </div>
        </React.Fragment>
      )}
    </Element>
  );
};

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    urlID,
    gameCommunities_id,
    userCommunityID,
    userCommunities_id,
    forumThreads_id,
    enableAnonymity,
    deletable,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();
  const stateCommunity = ContainerStateCommunity.useContainer();
  const stateForum = ContainerStateForum.useContainer();

  const {
    // ISO8601,
    handleScrollTo,
  } = stateLayout;

  const {
    gameCommunityObj,
    setGameCommunityObj,

    userCommunityObj,
    setUserCommunityObj,
  } = stateCommunity;

  const {
    forumThreadsObj,
    setForumThreadsObj,
    forumCommentsObj,
    setForumCommentsObj,
    forumRepliesObj,
    setForumRepliesObj,
    reloadForceForumComment,
    setReloadForceForumComment,
  } = stateForum;

  // --------------------------------------------------
  //   Data
  // --------------------------------------------------

  let updatedDate = "";

  // ---------------------------------------------
  //   - Game Community
  // ---------------------------------------------

  if (urlID) {
    updatedDate = lodashGet(
      gameCommunityObj,
      ["updatedDateObj", "forum"],
      "0000-01-01T00:00:00Z"
    );

    // ---------------------------------------------
    //   - User Community
    // ---------------------------------------------
  } else if (userCommunityID) {
    updatedDate = lodashGet(
      userCommunityObj,
      ["updatedDateObj", "forum"],
      "0000-01-01T00:00:00Z"
    );
  }

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * コメントを読み込む
   * @param {number} page - コメントのページ
   * @param {number} changeLimit - 1ページに表示する件数を変更する場合、値を入力する
   */
  const handleRead = async ({ page, changeLimit }) => {
    try {
      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const loadedDate = lodashGet(
        forumCommentsObj,
        [forumThreads_id, `page${page}Obj`, "loadedDate"],
        ""
      );
      const arr = lodashGet(
        forumCommentsObj,
        [forumThreads_id, `page${page}Obj`, "arr"],
        []
      );

      const threadLimit = parseInt(
        getCookie({ key: "forumThreadLimit" }) ||
          process.env.NEXT_PUBLIC_FORUM_THREAD_LIMIT,
        10
      );
      let commentLimit = parseInt(
        getCookie({ key: "forumCommentLimit" }) ||
          process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
        10
      );
      const replyLimit = parseInt(
        getCookie({ key: "forumReplyLimit" }) ||
          process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
        10
      );

      // ---------------------------------------------
      //   Change Limit
      // ---------------------------------------------

      if (changeLimit) {
        commentLimit = changeLimit;

        // ---------------------------------------------
        //   Set Cookie - forumCommentLimit
        // ---------------------------------------------

        setCookie({ key: "forumCommentLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   再読込するかどうか
      // ---------------------------------------------

      let reload = false;

      // ---------------------------------------------
      //   1ページに表示する件数を変更した場合、再読込
      // ---------------------------------------------

      if (changeLimit || reloadForceForumComment) {
        // ---------------------------------------------
        //   次回の読み込み時に強制リロード
        // ---------------------------------------------

        // setReloadForceForumComment(true);

        // ---------------------------------------------
        //   再読込
        // ---------------------------------------------

        reload = true;

        // ---------------------------------------------
        //   最後の読み込み以降にフォーラムの更新があった場合
        //   または最後の読み込みからある程度時間（10分）が経っていた場合、再読込する
        // ---------------------------------------------
      } else if (loadedDate) {
        const datetimeLoaded = moment(loadedDate).utcOffset(0);
        const datetimeForumUpdated = moment(updatedDate).utcOffset(0);
        const datetimeNow = moment().utcOffset(0);
        const datetimeReloadLimit = moment(loadedDate)
          .add(process.env.NEXT_PUBLIC_FORUM_RELOAD_MINUTES, "m")
          .utcOffset(0);

        if (
          datetimeForumUpdated.isAfter(datetimeLoaded) ||
          datetimeNow.isAfter(datetimeReloadLimit)
        ) {
          reload = true;
        }
      }

      // ---------------------------------------------
      //   すでにデータを読み込んでいる場合は、ストアのデータを表示する
      // ---------------------------------------------

      if (!reload && arr.length > 0) {
        // console.log('store');

        // ---------------------------------------------
        //   Set Page
        // ---------------------------------------------

        const clonedObj = lodashCloneDeep(forumCommentsObj);
        lodashSet(clonedObj, [forumThreads_id, "page"], page);
        setForumCommentsObj(clonedObj);

        // ---------------------------------------------
        //   Return
        // ---------------------------------------------

        return;
      }

      // console.log('fetch');

      // ---------------------------------------------
      //   Button Disable
      // ---------------------------------------------

      setButtonDisabled(true);

      // ---------------------------------------------
      //   forumThreads_idsArr
      // ---------------------------------------------

      let forumThreads_idsArr = [forumThreads_id];

      // 表示件数を変更する場合は他のスレッドも一緒に更新するため、現在表示されているスレッドのIDを取得する
      if (changeLimit) {
        const forumThreadsPage = lodashGet(forumThreadsObj, ["page"], 1);
        forumThreads_idsArr = lodashGet(
          forumThreadsObj,
          [`page${forumThreadsPage}Obj`, "arr"],
          []
        );
      }

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        gameCommunities_id,
        userCommunities_id,
        forumThreads_idsArr,
        threadPage: 1,
        threadLimit,
        commentPage: page,
        commentLimit,
        replyPage: 1,
        replyLimit,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/read-comments`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // ---------------------------------------------
      //   Update - gameCommunityObj / userCommunityObj
      // ---------------------------------------------

      if (gameCommunities_id) {
        setGameCommunityObj(
          lodashGet(resultObj, ["data", "gameCommunityObj"], {})
        );
      } else {
        setUserCommunityObj(
          lodashGet(resultObj, ["data", "userCommunityObj"], {})
        );
      }

      // ---------------------------------------------
      //   Update - forumThreadsObj - dataObj / [データオブジェクトのみ]
      //   再読込する場合は新しいデータに置き換える、再読込しない場合は古いデータと新しいデータをマージする
      // ---------------------------------------------

      const clonedForumThreadsObj = lodashCloneDeep(forumThreadsObj);

      const forumThreadsOldDataObj = lodashGet(
        forumThreadsObj,
        ["dataObj"],
        {}
      );
      const forumThreadsNewDataObj = lodashGet(
        resultObj,
        ["data", "forumThreadsObj", "dataObj"],
        {}
      );
      clonedForumThreadsObj.dataObj = lodashMerge(
        forumThreadsOldDataObj,
        forumThreadsNewDataObj
      );

      setForumThreadsObj(clonedForumThreadsObj);

      // console.log(`
      //   ----- forumThreadsOldDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(forumThreadsOldDataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- forumThreadsNewDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(forumThreadsNewDataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- clonedForumThreadsObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(clonedForumThreadsObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Update - forumCommentsObj
      // ---------------------------------------------

      const forumCommentsNewObj = lodashGet(
        resultObj,
        ["data", "forumCommentsObj"],
        {}
      );
      const forumCommentsMergedObj = reload
        ? forumCommentsNewObj
        : lodashMerge(forumCommentsObj, forumCommentsNewObj);
      setForumCommentsObj(forumCommentsMergedObj);

      // ---------------------------------------------
      //   Update - forumRepliesObj
      // ---------------------------------------------

      const forumRepliesNewObj = lodashGet(
        resultObj,
        ["data", "forumRepliesObj"],
        {}
      );
      const forumRepliesMergedObj = reload
        ? forumRepliesNewObj
        : lodashMerge(forumRepliesObj, forumRepliesNewObj);
      setForumRepliesObj(forumRepliesMergedObj);

      // ---------------------------------------------
      //   コメントの強制リロード解除
      // ---------------------------------------------

      setReloadForceForumComment(false);

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/forum/v2/components/comment.js - handleRead
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      //   forumComments_id: {green ${forumComments_id}}
      // `);

      // console.log(`
      //   ----- forumThreads_idsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(forumThreads_idsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    } catch (errorObj) {
      // ---------------------------------------------
      //   Snackbar: Error
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        errorObj,
      });
    } finally {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to: `forumComments-${forumThreads_id}`,
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });
    }
  };

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const page = lodashGet(forumCommentsObj, [forumThreads_id, "page"], 1);
  const count = lodashGet(forumCommentsObj, [forumThreads_id, "count"], 0);
  const limit = parseInt(
    forumCommentsObj.limit || process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
    10
  );
  const arr = lodashGet(
    forumCommentsObj,
    [forumThreads_id, `page${page}Obj`, "arr"],
    []
  );

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/forum/v2/components/comment.js
  // `);

  // console.log(chalk`
  //   urlID: {green ${urlID}}
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   userCommunityID: {green ${userCommunityID}}
  //   userCommunities_id: {green ${userCommunities_id}}
  //   forumThreads_id: {green ${forumThreads_id}}
  //   enableAnonymity: {green ${enableAnonymity}}
  // `);

  // console.log(chalk`
  //   page: {green ${page}}
  //   count: {green ${count}}
  //   limit: {green ${limit}}
  // `);

  // console.log(`
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   配列が空の場合は、空のコンポーネントを返す
  // --------------------------------------------------

  if (arr.length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   Component - Comment & Reply
  // --------------------------------------------------

  const componentArr = [];

  for (let forumComments_id of arr.values()) {
    componentArr.push(
      <Comment
        key={forumComments_id}
        urlID={urlID}
        gameCommunities_id={gameCommunities_id}
        userCommunityID={userCommunityID}
        userCommunities_id={userCommunities_id}
        forumThreads_id={forumThreads_id}
        forumComments_id={forumComments_id}
        enableAnonymity={enableAnonymity}
        deletable={deletable}
      />
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element
      css={css`
        margin: 24px 0 0 0;
      `}
      name={`forumComments-${forumThreads_id}`}
    >
      {componentArr}

      {/* Pagination */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;

          border-top: 1px solid;
          border-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.5),
            rgba(0, 0, 0, 0)
          );
          border-image-slice: 1;

          padding: 16px 0 0 0;
          margin: 24px 24px 0 0;
        `}
      >
        {/* Pagination */}
        <div
          css={css`
            margin: 8px 24px 0 0;
          `}
        >
          <Pagination
            disabled={buttonDisabled}
            onChange={(page) =>
              handleRead({
                page,
              })
            }
            pageSize={limit}
            current={page}
            total={count}
            locale={localeInfo}
          />
        </div>

        {/* Rows Per Page */}
        <FormControl
          css={css`
            margin: 8px 0 0 0 !important;
          `}
          variant="outlined"
        >
          <Select
            value={limit}
            onChange={(eventObj) =>
              handleRead({
                page: 1,
                changeLimit: eventObj.target.value,
              })
            }
            input={
              <OutlinedInput
                classes={{
                  input: classes.input,
                }}
                name="forum-comments-pagination"
              />
            }
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

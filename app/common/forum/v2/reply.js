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

import FormReply from "app/common/forum/v2/form/reply.js";

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
 * Reply
 */
const Reply = (props) => {
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
    forumReplies_id,
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
    // forumCommentsObj,
    forumRepliesObj,
    setForumRepliesObj,
    setReloadForceForumReply,
  } = stateForum;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [showFormReply, setShowFormReply] = useState(false);
  const [showFormReplyNew, setShowFormReplyNew] = useState(false);
  const [goods, setGoods] = useState(
    lodashGet(forumRepliesObj, ["dataObj", forumReplies_id, "goods"], 0)
  );

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 返信を削除する
   */
  const handleDelete = async () => {
    try {
      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (
        (!gameCommunities_id && !userCommunities_id) ||
        !forumThreads_id ||
        !forumComments_id ||
        !forumReplies_id
      ) {
        throw new CustomError({
          errorsArr: [{ code: "cqD8ikZJ_", messageID: "1YJnibkmh" }],
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
        forumReplies_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      let resultObj = {};

      if (gameCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/delete-reply-gc`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      } else if (userCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/delete-reply-uc`,
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
      //   Delete Reply Data
      // ---------------------------------------------

      const clonedObj = lodashCloneDeep(forumRepliesObj);

      const dataObj = lodashGet(clonedObj, ["dataObj"], {});
      delete dataObj[forumReplies_id];

      setForumRepliesObj(clonedObj);

      // ---------------------------------------------
      //   次回の読み込み時に強制リロード
      // ---------------------------------------------

      setReloadForceForumReply(true);

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
            messageID: "o4fiADvZR",
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
  //   /app/common/forum/v2/components/reply.js
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

  const dataObj = lodashGet(forumRepliesObj, ["dataObj", forumReplies_id], {});

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
    linkAs = `/gc/${urlID}/forum/${forumReplies_id}`;
  } else if (userCommunityID) {
    linkHref = `/uc/[userCommunityID]/forum/[[...slug]]`;
    linkAs = `/uc/${userCommunityID}/forum/${forumReplies_id}`;
  }

  // --------------------------------------------------
  //   Reply to
  // --------------------------------------------------

  const replyToForumComments_id = lodashGet(
    dataObj,
    ["replyToForumComments_id"],
    ""
  );

  let replyToName = lodashGet(dataObj, ["replyToName"], "");

  if (!replyToName) {
    replyToName = "ななしさん";
  }

  const replyTo = `${replyToName} | ${replyToForumComments_id}`;

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
        border-top: 1px dashed #bdbdbd;
        padding: 20px 0 0 0;
        margin: 20px 0 0 0;
      `}
      name={forumReplies_id}
    >
      {/* Form */}
      {showFormReply && (
        <FormReply
          gameCommunities_id={gameCommunities_id}
          userCommunities_id={userCommunities_id}
          forumThreads_id={forumThreads_id}
          forumComments_id={forumComments_id}
          forumReplies_id={forumReplies_id}
          replyToForumComments_id={replyToForumComments_id}
          enableAnonymity={enableAnonymity}
          setShowForm={setShowFormReply}
        />
      )}

      {/* Replies */}
      {!showFormReply && (
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

          {/* Reply Container / Left Purple Line */}
          <div
            css={css`
              border-left: 4px solid #a9a9f5;
              margin: 10px 0 0 0;
              padding: 0 0 0 16px;

              @media screen and (max-width: 480px) {
                padding: 0 0 0 12px;
              }
            `}
          >
            {/* Reply To */}
            {replyToForumComments_id && (
              <div
                css={css`
                  display: flex;
                  flex-flow: row nowrap;
                  margin: 0 0 12px 0;
                  color: #7401df;
                `}
              >
                <IconReply
                  css={css`
                    && {
                      font-size: 16px;
                      margin: 4px 4px 0 0;
                    }
                  `}
                />
                <p>{replyTo}</p>
              </div>
            )}

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
                    type="forumReply"
                    target_id={forumReplies_id}
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

                {/* forumReplies_id */}
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
                      <a>{forumReplies_id}</a>
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
                  onClick={() => setShowFormReplyNew(true)}
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
                              title: "返信削除",
                              description: "返信を削除しますか？",
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
                    onClick={() => setShowFormReply(true)}
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
            {showFormReplyNew && (
              <FormReply
                gameCommunities_id={gameCommunities_id}
                userCommunities_id={userCommunities_id}
                forumThreads_id={forumThreads_id}
                forumComments_id={forumComments_id}
                replyToForumComments_id={forumReplies_id}
                enableAnonymity={enableAnonymity}
                setShowForm={setShowFormReplyNew}
              />
            )}
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
    forumComments_id,
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
    forumCommentsObj,
    forumRepliesObj,
    setForumRepliesObj,
    setReloadForceForumComment,
    reloadForceForumReply,
    setReloadForceForumReply,
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
   * 返信を読み込む
   * @param {number} page - 返信のページ
   * @param {number} changeLimit - 1ページに表示する件数を変更する場合、値を入力する
   */
  const handleRead = async ({ page, changeLimit }) => {
    try {
      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const loadedDate = lodashGet(
        forumRepliesObj,
        [forumComments_id, `page${page}Obj`, "loadedDate"],
        ""
      );
      const arr = lodashGet(
        forumRepliesObj,
        [forumComments_id, `page${page}Obj`, "arr"],
        []
      );

      const commentLimit = parseInt(
        getCookie({ key: "forumCommentLimit" }) ||
          process.env.NEXT_PUBLIC_FORUM_COMMENT_LIMIT,
        10
      );
      let replyLimit = parseInt(
        getCookie({ key: "forumReplyLimit" }) ||
          process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
        10
      );

      // ---------------------------------------------
      //   Change Limit
      // ---------------------------------------------

      if (changeLimit) {
        replyLimit = changeLimit;

        // ---------------------------------------------
        //   Set Cookie - forumReplyLimit
        // ---------------------------------------------

        setCookie({ key: "forumReplyLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   再読込するかどうか
      // ---------------------------------------------

      let reload = false;

      // ---------------------------------------------
      //   1ページに表示する件数を変更した場合、再読込
      // ---------------------------------------------

      if (changeLimit || reloadForceForumReply) {
        // ---------------------------------------------
        //   次回の読み込み時にコメントを強制リロード
        // ---------------------------------------------

        setReloadForceForumComment(true);

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

        const clonedObj = lodashCloneDeep(forumRepliesObj);
        lodashSet(clonedObj, [forumComments_id, "page"], page);
        setForumRepliesObj(clonedObj);

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
      //   forumComments_idsArr
      // ---------------------------------------------

      let forumComments_idsArr = [forumComments_id];

      // 表示件数を変更する場合は他の返信も一緒に更新するため、現在表示されているコメントのIDを取得する
      if (changeLimit) {
        const forumThreadsPage = lodashGet(forumThreadsObj, ["page"], 1);
        const forumThreads_idsArr = lodashGet(
          forumThreadsObj,
          [`page${forumThreadsPage}Obj`, "arr"],
          []
        );

        forumComments_idsArr = [];

        for (let forumThreads_id of forumThreads_idsArr.values()) {
          const forumCommentsPage = lodashGet(
            forumCommentsObj,
            [forumThreads_id, "page"],
            1
          );
          const tempForumComments_idArr = lodashGet(
            forumCommentsObj,
            [forumThreads_id, `page${forumCommentsPage}Obj`, "arr"],
            []
          );

          forumComments_idsArr = forumComments_idsArr.concat(
            tempForumComments_idArr
          );
        }
      }

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        gameCommunities_id,
        userCommunities_id,
        forumComments_idsArr,
        commentPage: 1,
        commentLimit,
        replyPage: page,
        replyLimit,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/read-replies`,
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
      //   返信の強制リロード解除
      // ---------------------------------------------

      setReloadForceForumReply(false);

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/forum/v2/components/reply.js - handleRead
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      //   forumComments_id: {green ${forumComments_id}}
      //   commentLimit: {green ${commentLimit}}
      //   replyLimit: {green ${replyLimit}}
      // `);

      // console.log(`
      //   ----- forumComments_idsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(forumComments_idsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(chalk`
      //   reloadForceForumReply: {green ${reloadForceForumReply}}
      //   reload: {green ${reload}}
      // `);

      // console.log(`
      //   ----- arr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
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
        to: `forumReplies-${forumComments_id}`,
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

  const page = lodashGet(forumRepliesObj, [forumComments_id, "page"], 1);
  const count = lodashGet(forumRepliesObj, [forumComments_id, "count"], 0);
  const limit = parseInt(
    forumRepliesObj.limit || process.env.NEXT_PUBLIC_FORUM_REPLY_LIMIT,
    10
  );
  const arr = lodashGet(
    forumRepliesObj,
    [forumComments_id, `page${page}Obj`, "arr"],
    []
  );

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/forum/v2/components/reply.js
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

  for (let forumReplies_id of arr.values()) {
    componentArr.push(
      <Reply
        key={forumReplies_id}
        urlID={urlID}
        gameCommunities_id={gameCommunities_id}
        userCommunityID={userCommunityID}
        userCommunities_id={userCommunities_id}
        forumThreads_id={forumThreads_id}
        forumComments_id={forumComments_id}
        forumReplies_id={forumReplies_id}
        enableAnonymity={enableAnonymity}
        deletable={deletable}
      />
    );
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name={`forumReplies-${forumComments_id}`}>
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
            onChange={() => {}}
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
            onChange={() => {}}
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
                name="forum-replies-pagination"
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

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
//   Material UI / Icons
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
import { ContainerStateRecruitment } from "app/@states/recruitment.js";

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

import FormReply from "app/gc/rec/v2/form/reply.js";

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
    recruitmentThreads_id,
    recruitmentComments_id,
    recruitmentReplies_id,
    editableThread,
  } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();
  const stateCommunity = ContainerStateCommunity.useContainer();
  const stateRecruitment = ContainerStateRecruitment.useContainer();

  const {
    ISO8601,
    handleDialogOpen,
    handleLoadingOpen,
    handleLoadingClose,
  } = stateLayout;

  const { setGameCommunityObj } = stateCommunity;

  const {
    // recruitmentCommentsObj,
    recruitmentRepliesObj,
    setRecruitmentRepliesObj,
    setReloadForceRecruitmentComment,
    setReloadForceRecruitmentReply,
  } = stateRecruitment;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [showFormEdit, setShowFormEdit] = useState(false);
  const [showFormNew, setShowFormNew] = useState(false);
  const [goods, setGoods] = useState(
    lodashGet(
      recruitmentRepliesObj,
      ["dataObj", recruitmentReplies_id, "goods"],
      0
    )
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

      if (!recruitmentReplies_id) {
        throw new CustomError({
          errorsArr: [{ code: "LsSsbiQxE", messageID: "1YJnibkmh" }],
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
        recruitmentReplies_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/recruitment-replies/delete`,
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
      //   Update - Game Community
      // ---------------------------------------------

      setGameCommunityObj(
        lodashGet(resultObj, ["data", "gameCommunityObj"], {})
      );

      // ---------------------------------------------
      //   Delete Reply Data
      // ---------------------------------------------

      const clonedObj = lodashCloneDeep(recruitmentRepliesObj);

      const dataObj = lodashGet(clonedObj, ["dataObj"], {});
      delete dataObj[recruitmentReplies_id];

      setRecruitmentRepliesObj(clonedObj);

      // ---------------------------------------------
      //   次回の読み込み時に強制リロード
      // ---------------------------------------------

      setReloadForceRecruitmentComment(true);
      setReloadForceRecruitmentReply(true);

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
            messageID: "j6lSS-Zf5",
          },
        ],
      });

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/gc/rec/v2/components/reply.js - handleDelete
      // `);

      // console.log(chalk`
      //   recruitmentReplies_id: {green ${recruitmentReplies_id}}
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
  //   dataObj
  // --------------------------------------------------

  const dataObj = lodashGet(
    recruitmentRepliesObj,
    ["dataObj", recruitmentReplies_id],
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

  const linkHref = `/gc/[urlID]/rec/[[...slug]]`;
  const linkAs = `/gc/${urlID}/rec/${recruitmentReplies_id}`;

  // --------------------------------------------------
  //   Reply to
  // --------------------------------------------------

  const replyToRecruitmentReplies_id = lodashGet(
    dataObj,
    ["replyToRecruitmentReplies_id"],
    ""
  );

  let replyToName = lodashGet(dataObj, ["replyToName"], "");

  if (!replyToName) {
    replyToName = "ななしさん";
  }

  const replyTo = `${replyToName} | ${replyToRecruitmentReplies_id}`;

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
        margin: 20px 0 0 0;
        padding: 20px 0 0 0;
      `}
      name={recruitmentReplies_id}
    >
      {/* Reply - Edit Form */}
      {showFormEdit && (
        <FormReply
          gameCommunities_id={gameCommunities_id}
          recruitmentThreads_id={recruitmentThreads_id}
          recruitmentComments_id={recruitmentComments_id}
          recruitmentReplies_id={recruitmentReplies_id}
          replyToRecruitmentReplies_id={replyToRecruitmentReplies_id}
          setShowForm={setShowFormEdit}
        />
      )}

      {/* Reply */}
      {!showFormEdit && (
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

          {/* Reply */}
          <div
            css={css`
              border-left: 4px solid #a9a9f5;
              margin: 12px 0;
              padding: 8px 0 8px 16px;

              @media screen and (max-width: 480px) {
                padding: 8px 0 8px 12px;
              }
            `}
          >
            {/* Reply To */}
            {replyToRecruitmentReplies_id && (
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
              {/* Good Button & Updated Date & recruitmentComments_id */}
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
                    type="recruitmentReply"
                    target_id={recruitmentReplies_id}
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

                {/* recruitmentReplies_id */}
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
                      <a>{recruitmentReplies_id}</a>
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
                  onClick={() => setShowFormNew(true)}
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
                {(editable || editableThread) && (
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
                    onClick={() => setShowFormEdit(true)}
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

            {/* Reply - New Form */}
            {showFormNew && (
              <div
                css={css`
                  margin: 6px 0 0 0;
                `}
              >
                <FormReply
                  gameCommunities_id={gameCommunities_id}
                  recruitmentThreads_id={recruitmentThreads_id}
                  recruitmentComments_id={recruitmentComments_id}
                  replyToRecruitmentReplies_id={recruitmentReplies_id}
                  setShowForm={setShowFormNew}
                />
              </div>
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
    recruitmentThreads_id,
    recruitmentComments_id,
    editableThread,
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
  const stateRecruitment = ContainerStateRecruitment.useContainer();

  const { ISO8601, handleScrollTo } = stateLayout;

  const { gameCommunityObj, setGameCommunityObj } = stateCommunity;

  const {
    recruitmentThreadsObj,
    recruitmentCommentsObj,
    recruitmentRepliesObj,
    setRecruitmentRepliesObj,
    setReloadForceRecruitmentComment,
    reloadForceRecruitmentReply,
    setReloadForceRecruitmentReply,
  } = stateRecruitment;

  // --------------------------------------------------
  //   Data
  // --------------------------------------------------

  const updatedDate = lodashGet(
    gameCommunityObj,
    ["updatedDateObj", "recruitment"],
    "0000-01-01T00:00:00Z"
  );

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
        recruitmentRepliesObj,
        [recruitmentComments_id, `page${page}Obj`, "loadedDate"],
        ""
      );
      const arr = lodashGet(
        recruitmentRepliesObj,
        [recruitmentComments_id, `page${page}Obj`, "arr"],
        []
      );

      const commentLimit = parseInt(
        getCookie({ key: "recruitmentCommentLimit" }) ||
          process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
        10
      );
      let replyLimit = parseInt(
        getCookie({ key: "recruitmentReplyLimit" }) ||
          process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
        10
      );

      // ---------------------------------------------
      //   Change Limit
      // ---------------------------------------------

      if (changeLimit) {
        replyLimit = changeLimit;

        // ---------------------------------------------
        //   Set Cookie - recruitmentReplyLimit
        // ---------------------------------------------

        setCookie({ key: "recruitmentReplyLimit", value: changeLimit });
      }

      // ---------------------------------------------
      //   再読込するかどうか
      // ---------------------------------------------

      let reload = false;

      // ---------------------------------------------
      //   1ページに表示する件数を変更した場合、再読込
      // ---------------------------------------------

      if (changeLimit || reloadForceRecruitmentReply) {
        // ---------------------------------------------
        //   次回の読み込み時に強制リロード
        // ---------------------------------------------

        setReloadForceRecruitmentComment(true);

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
        const datetimeRecruitmentUpdated = moment(updatedDate).utcOffset(0);
        const datetimeNow = moment().utcOffset(0);
        const datetimeReloadLimit = moment(loadedDate)
          .add(process.env.NEXT_PUBLIC_RECRUITMENT_RELOAD_MINUTES, "m")
          .utcOffset(0);

        if (
          datetimeRecruitmentUpdated.isAfter(datetimeLoaded) ||
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

        const clonedObj = lodashCloneDeep(recruitmentRepliesObj);
        lodashSet(clonedObj, [recruitmentComments_id, "page"], page);
        setRecruitmentRepliesObj(clonedObj);

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
      //   recruitmentComments_idsArr
      // ---------------------------------------------

      let recruitmentComments_idsArr = [recruitmentComments_id];

      // 表示件数を変更する場合は他のコメントも一緒に更新するため、現在表示されているコメントのIDを取得する
      if (changeLimit) {
        const recruitmentThreadsPage = lodashGet(
          recruitmentThreadsObj,
          ["page"],
          1
        );
        const recruitmentThreads_idsArr = lodashGet(
          recruitmentThreadsObj,
          [`page${recruitmentThreadsPage}Obj`, "arr"],
          []
        );

        recruitmentComments_idsArr = [];

        for (let recruitmentThreads_id of recruitmentThreads_idsArr.values()) {
          const recruitmentCommentsPage = lodashGet(
            recruitmentCommentsObj,
            [recruitmentThreads_id, "page"],
            1
          );
          const tempRecruitmentComments_idsArr = lodashGet(
            recruitmentCommentsObj,
            [recruitmentThreads_id, `page${recruitmentCommentsPage}Obj`, "arr"],
            []
          );

          recruitmentComments_idsArr = recruitmentComments_idsArr.concat(
            tempRecruitmentComments_idsArr
          );
        }
      }

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        gameCommunities_id,
        recruitmentComments_idsArr,
        commentPage: 1,
        commentLimit,
        replyPage: page,
        replyLimit,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/recruitment-replies/read-replies`,
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
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/gc/rec/v2/components/reply.js - handleRead
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   recruitmentComments_id: {green ${recruitmentComments_id}}
      // `);

      // console.log(`
      //   ----- recruitmentComments_idsArr -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(recruitmentComments_idsArr)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(formDataObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Update - Game Community
      // ---------------------------------------------

      setGameCommunityObj(
        lodashGet(resultObj, ["data", "gameCommunityObj"], {})
      );

      // ---------------------------------------------
      //   Update - recruitmentRepliesObj
      // ---------------------------------------------

      const recruitmentRepliesNewObj = lodashGet(
        resultObj,
        ["data", "recruitmentRepliesObj"],
        {}
      );
      const recruitmentRepliesMergedObj = reload
        ? recruitmentRepliesNewObj
        : lodashMerge(recruitmentRepliesObj, recruitmentRepliesNewObj);
      setRecruitmentRepliesObj(recruitmentRepliesMergedObj);

      // ---------------------------------------------
      //   強制リロード解除
      // ---------------------------------------------

      setReloadForceRecruitmentReply(false);
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
        to: `recruitmentReplies-${recruitmentComments_id}`,
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

  const page = lodashGet(
    recruitmentRepliesObj,
    [recruitmentComments_id, "page"],
    1
  );
  const count = lodashGet(
    recruitmentRepliesObj,
    [recruitmentComments_id, "count"],
    0
  );
  const limit = parseInt(
    recruitmentRepliesObj.limit ||
      process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
    10
  );
  const arr = lodashGet(
    recruitmentRepliesObj,
    [recruitmentComments_id, `page${page}Obj`, "arr"],
    []
  );

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/reply.js
  // `);

  // console.log(chalk`
  //   urlID: {green ${urlID}}
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
  //   recruitmentComments_id: {green ${recruitmentComments_id}}
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
  //   Component - Reply
  // --------------------------------------------------

  const componentArr = [];

  for (let recruitmentReplies_id of arr.values()) {
    componentArr.push(
      <Reply
        key={recruitmentReplies_id}
        urlID={urlID}
        gameCommunities_id={gameCommunities_id}
        recruitmentThreads_id={recruitmentThreads_id}
        recruitmentComments_id={recruitmentComments_id}
        recruitmentReplies_id={recruitmentReplies_id}
        editableThread={editableThread}
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
      name={`recruitmentReplies-${recruitmentComments_id}`}
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
                name="recruitment-replies-pagination"
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

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

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";
import lodashCloneDeep from "lodash/cloneDeep";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Avatar from "@material-ui/core/Avatar";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";
import IconPublic from "@material-ui/icons/Public";
import IconDelete from "@material-ui/icons/Delete";
import IconEdit from "@material-ui/icons/Edit";
import IconReply from "@material-ui/icons/Reply";

// ---------------------------------------------
//   Simple Icons
// ---------------------------------------------

import { Twitter as SimpleIconTwitter } from "@icons-pack/react-simple-icons";

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
import { showSnackbar } from "app/@modules/snackbar.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Paragraph from "app/common/layout/v2/paragraph.js";
import User from "app/common/user/v2/user.js";
import ImageAndVideo from "app/common/image-and-video/v2/image-and-video.js";
import HardwaresChip from "app/common/hardware/v2/chip.js";

import CategoryChip from "app/gc/rec/v2/category-chip.js";
import FormThread from "app/gc/rec/v2/form/thread.js";
import FormComment from "app/gc/rec/v2/form/comment.js";
import Comment from "app/gc/rec/v2/comment.js";
import Public from "app/gc/rec/v2/public.js";
import DeadlineDate from "app/gc/rec/v2/deadline-date.js";
import Notification from "app/gc/rec/v2/notification.js";

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  expanded: {
    marginBottom: "0 !important",
  },

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
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { urlID, gameCommunities_id, recruitmentThreads_id } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [showFormThread, setShowFormThread] = useState(false);
  const [showFormComment, setShowFormComment] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();
  const stateCommunity = ContainerStateCommunity.useContainer();
  const stateRecruitment = ContainerStateRecruitment.useContainer();

  const {
    handleDialogOpen,
    handleLoadingOpen,
    handleLoadingClose,
  } = stateLayout;

  const { setGameCommunityObj } = stateCommunity;

  const { recruitmentThreadsObj, setRecruitmentThreadsObj } = stateRecruitment;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 募集を削除する
   */
  const handleDelete = async () => {
    try {
      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (!recruitmentThreads_id) {
        throw new CustomError({
          errorsArr: [{ code: "jVXVASs_N", messageID: "1YJnibkmh" }],
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
        recruitmentThreads_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/recruitment-threads/delete`,
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
      //   Delete Thread Data
      // ---------------------------------------------

      const clonedObj = lodashCloneDeep(recruitmentThreadsObj);

      const dataObj = lodashGet(clonedObj, ["dataObj"], {});
      delete dataObj[recruitmentThreads_id];

      setRecruitmentThreadsObj(clonedObj);

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
      //   /app/common/forum/v2/components/thread.js - handleDelete
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
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
  //   dataObj
  // --------------------------------------------------

  const dataObj = lodashGet(
    recruitmentThreadsObj,
    ["dataObj", recruitmentThreads_id],
    {}
  );

  if (Object.keys(dataObj).length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const title = lodashGet(dataObj, ["title"], "");
  const comment = lodashGet(dataObj, ["comment"], "");

  const imagesAndVideosObj = lodashGet(dataObj, ["imagesAndVideosObj"], {});

  // 管理者権限がある、またはスレッドを建てた本人の場合、編集ボタンを表示する
  const editable = lodashGet(dataObj, ["editable"], false);

  const category = lodashGet(dataObj, ["category"], 1);
  const hardwaresArr = lodashGet(dataObj, ["hardwaresArr"], []);
  const deadlineDate = lodashGet(dataObj, ["deadlineDate"], "");
  const notification = lodashGet(dataObj, ["notification"], "");

  const comments = lodashGet(dataObj, ["comments"], 0);

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
  //   Link
  // --------------------------------------------------

  let linkHref = `/gc/[urlID]/rec/[[...slug]]`;
  let linkAs = `/gc/${urlID}/rec/${recruitmentThreads_id}`;

  // --------------------------------------------------
  //   ID & Information
  // --------------------------------------------------

  const idsArr = lodashGet(dataObj, ["idsArr"], []);
  const publicIDsArr = lodashGet(dataObj, ["publicIDsArr"], []);
  const publicInformationsArr = lodashGet(
    dataObj,
    ["publicInformationsArr"],
    []
  );
  const publicSetting = lodashGet(dataObj, ["publicSetting"], 1);

  // --------------------------------------------------
  //   Share: Twitter
  //   参考：https://blog.ikunaga.net/entry/twitter-com-intent-tweet/
  // --------------------------------------------------

  const twitterHashtagsArr = lodashGet(
    dataObj,
    ["gamesObj", "twitterHashtagsArr"],
    []
  );

  let shareTwitterText = title;

  if (title.length > 50) {
    shareTwitterText = title.substr(0, 50) + "…";
  }

  let shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURI(
    shareTwitterText
  )}&url=${
    process.env.NEXT_PUBLIC_URL_BASE
  }gc/${urlID}/rec/${recruitmentThreads_id}`;

  if (twitterHashtagsArr.length > 0) {
    shareTwitter += `&hashtags=${twitterHashtagsArr.join(",")}`;
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/thread.js
  // `);

  // console.log(`
  //   ----- dataObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(dataObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- twitterHashtagsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(twitterHashtagsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <article>
      <Element name={recruitmentThreads_id}>
        <Accordion
          css={css`
            margin: 0 0 16px 0 !important;
          `}
          expanded={panelExpanded}
        >
          {/* Summary */}
          <AccordionSummary
            css={css`
              && {
                cursor: default;
                background-color: white;
                user-select: auto;

                @media screen and (max-width: 480px) {
                  padding: 0 16px;
                }
              }
            `}
            classes={{
              expanded: classes.expanded,
            }}
          >
            <div
              css={css`
                display: flex;
                flex-flow: column nowrap;
                width: 100%;
              `}
            >
              {/* Container - Thread Name & Expansion Button */}
              <div
                css={css`
                  display: flex;
                  flex-flow: row nowrap;
                  align-items: center;
                  width: 100%;
                `}
              >
                {/* h1 */}
                <h1
                  css={css`
                    font-weight: bold;
                    font-size: 16px;

                    @media screen and (max-width: 480px) {
                      font-size: 14px;
                    }
                  `}
                >
                  {title}
                </h1>

                {/* Expansion Button */}
                <div
                  css={css`
                    margin-left: auto;
                  `}
                >
                  <IconButton
                    css={css`
                      && {
                        margin: 0;
                        padding: 4px;
                      }
                    `}
                    aria-expanded={panelExpanded}
                    aria-label="Show more"
                    disabled={buttonDisabled}
                    onClick={() => setPanelExpanded(!panelExpanded)}
                  >
                    {panelExpanded ? <IconExpandLess /> : <IconExpandMore />}
                  </IconButton>
                </div>
              </div>

              {/* Information */}
              <div
                css={css`
                  display: flex;
                  flex-flow: row nowrap;
                  align-items: center;
                  font-size: 12px;
                `}
              >
                {/* Hardwares & recruitmentThreads_id */}
                <div
                  css={css`
                    display: flex;
                    flex-flow: row wrap;
                    align-items: center;
                    margin: 0;
                  `}
                >
                  {/* ハードウェア  */}
                  <HardwaresChip hardwaresArr={hardwaresArr} />

                  {/* カテゴリー */}
                  <CategoryChip category={category} />

                  {/* スレッドの固有ID: recruitmentThreads_id */}
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row nowrap;
                      margin: 8px 0 0 0;
                    `}
                  >
                    <IconPublic
                      css={css`
                        && {
                          font-size: 24px;
                          margin: 0 2px 0 0;
                        }
                      `}
                    />

                    <div
                      css={css`
                        font-size: 12px;
                        color: #009933;
                        cursor: pointer;
                        margin: 2px 0 0 0;
                      `}
                    >
                      <Link href={linkHref} as={linkAs}>
                        <a>{recruitmentThreads_id}</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionSummary>

          {/* Contents */}
          <AccordionDetails
            css={css`
              && {
                display: flex;
                flex-flow: column wrap;

                @media screen and (max-width: 480px) {
                  padding: 0 16px 16px !important;
                }
              }
            `}
          >
            {/* Thread - Edit Form */}
            {showFormThread && (
              <div
                css={css`
                  width: 100%;

                  border-top: 1px solid;
                  border-image: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0),
                    rgba(0, 0, 0, 0.5),
                    rgba(0, 0, 0, 0)
                  );
                  border-image-slice: 1;

                  margin: 12px 0 0 0;
                `}
              >
                <div
                  css={css`
                    border-left: 4px solid #a4a4a4;
                    margin: 16px 0 0 0;
                    padding: 8px 0 8px 16px;

                    @media screen and (max-width: 480px) {
                      border-left: none;
                      margin: 0;
                      padding: 32px 0 0 0;
                    }
                  `}
                >
                  <FormThread
                    gameCommunities_id={gameCommunities_id}
                    recruitmentThreads_id={recruitmentThreads_id}
                    setShowForm={setShowFormThread}
                  />
                </div>
              </div>
            )}

            {/* Thread */}
            {!showFormThread && (
              <div
                css={css`
                  width: 100%;

                  border-top: 1px solid;
                  border-image: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0),
                    rgba(0, 0, 0, 0.5),
                    rgba(0, 0, 0, 0)
                  );
                  border-image-slice: 1;

                  margin: 12px 0 0 0;
                  padding: 20px 0 0 0;
                `}
              >
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

                {/* スレッド */}
                <div
                  css={css`
                    font-size: 14px;
                    line-height: 1.6em;

                    border-left: 4px solid #a4a4a4;
                    margin: 12px 0 24px 0;
                    padding: 8px 0 8px 16px;

                    @media screen and (max-width: 480px) {
                      padding: 8px 0 8px 12px;
                    }
                  `}
                >
                  {/* コメント */}
                  <Paragraph text={comment} />

                  {/* ID & 情報 & 公開設定 */}
                  <Public
                    type="thread"
                    idsArr={idsArr}
                    publicIDsArr={publicIDsArr}
                    publicInformationsArr={publicInformationsArr}
                    publicSetting={publicSetting}
                  />

                  {/* 募集期限 ＆ 通知方法 */}
                  {(deadlineDate || notification) && (
                    <div
                      css={css`
                        margin: 20px 0 0 0;
                      `}
                    >
                      <DeadlineDate deadlineDate={deadlineDate} />

                      <Notification notification={notification} />
                    </div>
                  )}

                  {/* Bottom Container */}
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row wrap;
                      margin: 12px 0 0 0;
                    `}
                  >
                    {/* Buttons */}
                    <div
                      css={css`
                        display: flex;
                        flex-flow: row nowrap;
                        margin-left: auto;
                      `}
                    >
                      <Button
                        css={css`
                          && {
                            font-size: 12px;
                            height: 22px;
                            min-width: 54px;
                            min-height: 22px;
                            line-height: 1;
                            padding: 0 3px;

                            @media screen and (max-width: 480px) {
                              min-width: 36px;
                              min-height: 22px;
                            }
                          }
                        `}
                        variant="outlined"
                        href={shareTwitter}
                        target="_blank"
                        disabled={buttonDisabled}
                      >
                        <Avatar
                          css={css`
                            && {
                              width: 16px;
                              height: 16px;
                              line-height: 1;
                              background-color: #1da1f2;
                              margin: 0 4px 0 0;
                            }
                          `}
                          alt="PlayStation"
                          style={{ backgroundColor: "#1DA1F2" }}
                        >
                          <div style={{ width: "80%", marginTop: "0px" }}>
                            <SimpleIconTwitter
                              title="Twitter"
                              color="#FFFFFF"
                              size={12}
                            />
                          </div>
                        </Avatar>
                        シェア
                      </Button>

                      {/* Delete Button */}
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
                          color="secondary"
                          disabled={buttonDisabled}
                          onClick={
                            buttonDisabled
                              ? () => {}
                              : () =>
                                  handleDialogOpen({
                                    title: "募集削除",
                                    description: "募集を削除しますか？",
                                    handle: handleDelete,
                                    argumentsObj: {
                                      recruitmentThreads_id,
                                    },
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
                          onClick={() => setShowFormThread(true)}
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
                </div>

                {/* Form Comment */}
                <div
                  css={css`
                    ${showFormComment
                      ? `
                          border-top: 2px dashed red;
                          ${comments > 0 && "border-bottom: 2px dashed red;"}
                          `
                      : `
                          border-top: 1px dashed #585858;
                          ${
                            comments > 0 && "border-bottom: 1px dashed #585858;"
                          }
                          `}

                    @media screen and (max-width: 480px) {
                      border-left: none;
                    }
                  `}
                >
                  {/* Button - Show New Form Comment */}
                  {!showFormComment && (
                    <div
                      css={css`
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;

                        ${comments > 0
                          ? `
                              margin: 14px 0;
                              `
                          : `
                              margin: 14px 0 0 0;
                              `}
                      `}
                    >
                      <Button
                        type="submit"
                        variant="outlined"
                        size="small"
                        disabled={buttonDisabled}
                        startIcon={<IconReply />}
                        onClick={() => setShowFormComment(!showFormComment)}
                      >
                        コメント投稿フォーム
                      </Button>
                    </div>
                  )}

                  {/* New Form Comment */}
                  {showFormComment && (
                    <div
                      css={css`
                        border-left: 4px solid #84cacb;

                        ${comments > 0
                          ? `
                              margin: 24px 0;
                              `
                          : `
                              margin: 24px 0 6px 0;
                              `}

                        padding: 0 0 0 16px;

                        @media screen and (max-width: 480px) {
                          border-left: none;

                          padding-left: 0;
                        }
                      `}
                    >
                      <FormComment
                        gameCommunities_id={gameCommunities_id}
                        recruitmentThreads_id={recruitmentThreads_id}
                        publicSettingThread={publicSetting}
                        setShowForm={setShowFormComment}
                      />
                    </div>
                  )}
                </div>

                {/* Comment */}
                <Comment
                  urlID={urlID}
                  gameCommunities_id={gameCommunities_id}
                  recruitmentThreads_id={recruitmentThreads_id}
                  editableThread={editable}
                />
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </Element>
    </article>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

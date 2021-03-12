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
import IconAssignment from "@material-ui/icons/Assignment";
import IconPublic from "@material-ui/icons/Public";
import IconDelete from "@material-ui/icons/Delete";
import IconEdit from "@material-ui/icons/Edit";

// ---------------------------------------------
//   Simple Icons
// ---------------------------------------------

import { Twitter as SimpleIconTwitter } from "@icons-pack/react-simple-icons";

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
import { showSnackbar } from "app/@modules/snackbar.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Paragraph from "app/common/layout/v2/paragraph.js";
import ImageAndVideo from "app/common/image-and-video/v2/image-and-video.js";
import FormThread from "app/common/forum/v2/form/thread.js";
import FormComment from "app/common/forum/v2/form/comment.js";
import Comment from "app/common/forum/v2/comment.js";

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
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [showComment, setShowComment] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
    handleDialogOpen,
    handleLoadingOpen,
    handleLoadingClose,
  } = stateLayout;

  const { setGameCommunityObj, setUserCommunityObj } = stateCommunity;

  const { forumThreadsObj, setForumThreadsObj } = stateForum;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * スレッドを削除する
   */
  const handleDelete = async () => {
    try {
      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (
        (!gameCommunities_id && !forumThreads_id) ||
        (!userCommunities_id && !forumThreads_id)
      ) {
        throw new CustomError({
          errorsArr: [{ code: "cGHv25p8q", messageID: "1YJnibkmh" }],
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
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      let resultObj = {};

      if (gameCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-threads/delete-gc`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      } else {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-threads/delete-uc`,
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
      //   Delete Thread Data
      // ---------------------------------------------

      const clonedObj = lodashCloneDeep(forumThreadsObj);

      const dataObj = lodashGet(clonedObj, ["dataObj"], {});
      delete dataObj[forumThreads_id];

      setForumThreadsObj(clonedObj);

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
            messageID: "KBPPfi4f9",
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

      // console.log(`
      //   ----- clonedObj -----\n
      //   ${util.inspect(clonedObj, { colors: true, depth: null })}\n
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

  const dataObj = lodashGet(forumThreadsObj, ["dataObj", forumThreads_id], {});

  if (Object.keys(dataObj).length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const name = lodashGet(dataObj, ["name"], "");
  const comment = lodashGet(dataObj, ["comment"], "");

  const imagesAndVideosObj = lodashGet(dataObj, ["imagesAndVideosObj"], {});

  // 管理者権限がある、またはスレッドを建てた本人の場合、編集ボタンを表示する
  const editable = lodashGet(dataObj, ["editable"], false);

  // --------------------------------------------------
  //   Link
  // --------------------------------------------------

  let linkHref = "";
  let linkAs = "";

  // ---------------------------------------------
  //   - Game Community
  // ---------------------------------------------

  if (urlID) {
    linkHref = `/gc/[urlID]/forum/[[...slug]]`;
    linkAs = `/gc/${urlID}/forum/${forumThreads_id}`;

    // ---------------------------------------------
    //   - User Community
    // ---------------------------------------------
  } else if (userCommunityID) {
    linkHref = `/uc/[userCommunityID]/forum/[[...slug]]`;
    linkAs = `/uc/${userCommunityID}/forum/${forumThreads_id}`;
  }

  // --------------------------------------------------
  //   Share: Twitter
  //   参考：https://blog.ikunaga.net/entry/twitter-com-intent-tweet/
  // --------------------------------------------------

  const twitterHashtagsArr = lodashGet(
    dataObj,
    ["gamesObj", "twitterHashtagsArr"],
    []
  );

  let shareTwitterText = name;

  if (name.length > 50) {
    shareTwitterText = name.substr(0, 50) + "…";
  }

  let shareTwitter = "";

  // ---------------------------------------------
  //   - Game Community
  // ---------------------------------------------

  if (urlID) {
    shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURI(
      shareTwitterText
    )}&url=${
      process.env.NEXT_PUBLIC_URL_BASE
    }gc/${urlID}/forum/${forumThreads_id}`;

    // ---------------------------------------------
    //   - User Community
    // ---------------------------------------------
  } else if (userCommunityID) {
    shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURI(
      shareTwitterText
    )}&url=${
      process.env.NEXT_PUBLIC_URL_BASE
    }uc/${userCommunityID}/forum/${forumThreads_id}`;
  }

  if (twitterHashtagsArr.length > 0) {
    shareTwitter += `&hashtags=${twitterHashtagsArr.join(",")}`;
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/forum/v2/components/thread.js
  // `);

  // console.log(`
  //   ----- formImagesAndVideosObj -----\n
  //   ${util.inspect(formImagesAndVideosObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <article>
      <Element name={forumThreads_id}>
        {/* Panel */}
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
            {/* Form - Edit Thread */}
            {showForm && (
              <div
                css={css`
                  width: 100%;
                `}
              >
                <FormThread
                  gameCommunities_id={gameCommunities_id}
                  userCommunities_id={userCommunities_id}
                  forumThreads_id={forumThreads_id}
                  setShowForm={setShowForm}
                />
              </div>
            )}

            {/* Thread */}
            {!showForm && (
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
                  {/* heading */}
                  <h1
                    css={css`
                      font-weight: bold;
                      font-size: 16px;

                      @media screen and (max-width: 480px) {
                        font-size: 14px;
                      }
                    `}
                  >
                    {name}
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
                      onClick={() => setPanelExpanded(!panelExpanded)}
                      aria-expanded={panelExpanded}
                      aria-label="Show more"
                      disabled={buttonDisabled}
                    >
                      {panelExpanded ? <IconExpandLess /> : <IconExpandMore />}
                    </IconButton>
                  </div>
                </div>

                {/* Images and Videos */}
                {Object.keys(imagesAndVideosObj).length > 0 && (
                  <div
                    css={css`
                      margin: 12px 0 4px 0;
                    `}
                  >
                    <ImageAndVideo imagesAndVideosObj={imagesAndVideosObj} />
                  </div>
                )}

                {/* Information */}
                <div
                  css={css`
                    display: flex;
                    flex-flow: row wrap;
                    font-size: 12px;
                    margin: 6px 0 0 0;
                  `}
                >
                  {/* Show Thread Description */}
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row nowrap;
                      margin: 0 6px 0 0;
                    `}
                  >
                    <IconAssignment
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
                      onClick={() => setShowComment(!showComment)}
                    >
                      スレッドについて
                    </div>
                  </div>

                  {/* Thread _id */}
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row nowrap;
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
                        <a>{forumThreads_id}</a>
                      </Link>
                    </div>
                  </div>
                </div>

                <div
                  css={css`
                    font-size: 14px;
                    line-height: 1.6em;

                    ${showComment &&
                    `
                      border-left: 4px solid #A4A4A4;
                      margin: 12px 0 10px 0;
                      padding: 8px 0 8px 16px;
                      `}

                    @media screen and (max-width: 480px) {
                      padding: 0 0 8px 12px;
                    }
                  `}
                >
                  {/* Comment */}
                  {showComment && <Paragraph text={comment} />}

                  {/* Bottom Container */}
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row wrap;
                      margin: 16px 0 0 0;
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
                          alt="Twitter"
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
                                    title: "スレッド削除",
                                    description: "スレッドを削除しますか？",
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
                          onClick={() => setShowForm(true)}
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
              </div>
            )}
          </AccordionSummary>

          {/* Contents */}
          <AccordionDetails
            css={css`
              @media screen and (max-width: 480px) {
                padding: 0 16px 24px !important;
              }
            `}
          >
            <div
              css={css`
                width: 100%;
                margin: 12px 0 0 0;
              `}
            >
              {/* Form - Post New Comment */}
              <div
                css={css`
                  border-top: 1px dashed #585858;
                  padding: 14px 0 0 0;
                `}
              >
                <FormComment
                  gameCommunities_id={gameCommunities_id}
                  userCommunities_id={userCommunities_id}
                  forumThreads_id={forumThreads_id}
                  enableAnonymity={enableAnonymity}
                />
              </div>

              {/* Comment */}
              <Comment
                urlID={urlID}
                gameCommunities_id={gameCommunities_id}
                userCommunityID={userCommunityID}
                userCommunities_id={userCommunities_id}
                forumThreads_id={forumThreads_id}
                enableAnonymity={enableAnonymity}
                deletable={deletable}
              />
            </div>
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

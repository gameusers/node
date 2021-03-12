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
import { useSnackbar } from "notistack";
import TextareaAutosize from "react-autosize-textarea";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashMerge from "lodash/merge";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";

// ---------------------------------------------
//   Material UI / Icon
// ---------------------------------------------

import IconReply from "@material-ui/icons/Reply";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateUser } from "app/@states/user.js";
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
//   Validations
// ---------------------------------------------

import { validationHandleName } from "app/@validations/name.js";
import { validationBoolean } from "app/@validations/boolean.js";
import { validationTermsOfService } from "app/@validations/terms-of-service.js";

import { validationForumCommentsComment } from "app/@database/forum-comments/validations/comment.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormName from "app/common/form/v2/name.js";
import FormImageAndVideo from "app/common/image-and-video/v2/form.js";
import TermsOfService from "app/common/form/v2/terms-of-service.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssNew = css`
  border-top: 1px dashed #bdbdbd;
  margin: 12px 0 0 0;
  padding: 12px 0 12px 0;
`;

const cssEdit = css`
  padding: 0 0 12px 0;
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
    gameCommunities_id,
    userCommunities_id,
    forumThreads_id,
    forumComments_id,
    forumReplies_id,
    replyToForumComments_id,
    enableAnonymity,

    setShowForm,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [name, setName] = useState("");
  const [anonymity, setAnonymity] = useState(false);
  const [comment, setComment] = useState("");
  const [imagesAndVideosObj, setImagesAndVideosObj] = useState({
    _id: "",
    createdDate: "",
    updatedDate: "",
    users_id: "",
    type: "forum",
    arr: [],
  });

  const [agreeTermsOfService, setAgreeTermsOfService] = useState(false);

  useEffect(() => {
    // --------------------------------------------------
    //   Button Enable
    // --------------------------------------------------

    setButtonDisabled(false);

    // --------------------------------------------------
    //   編集用データを読み込む
    // --------------------------------------------------

    if (forumReplies_id) {
      handleGetEditData();
    }
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();
  const stateCommunity = ContainerStateCommunity.useContainer();
  const stateForum = ContainerStateForum.useContainer();

  const {
    termsOfServiceAgreedVersion,
    setTermsOfServiceAgreedVersion,
  } = stateUser;

  const { handleLoadingOpen, handleLoadingClose, handleScrollTo } = stateLayout;

  const { setGameCommunityObj, setUserCommunityObj } = stateCommunity;

  const { forumRepliesObj, setForumRepliesObj } = stateForum;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 編集用データを読み込む
   */
  const handleGetEditData = async () => {
    try {
      // ---------------------------------------------
      //   forumReplies_id が存在しない場合エラー
      // ---------------------------------------------

      if (!forumReplies_id) {
        throw new CustomError({
          errorsArr: [{ code: "3cWrPpMq8", messageID: "Error" }],
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
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to: forumReplies_id,
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        forumComments_id: forumReplies_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/get-edit-data`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Set Form Data
      // ---------------------------------------------

      const name = lodashGet(resultObj, ["data", "name"], "");
      const anonymity = lodashGet(resultObj, ["data", "anonymity"], false);
      const comment = lodashGet(resultObj, ["data", "comment"], "");
      let imagesAndVideosObj = lodashGet(
        resultObj,
        ["data", "imagesAndVideosObj"],
        {}
      );

      if (Object.keys(imagesAndVideosObj).length === 0) {
        imagesAndVideosObj = {
          _id: "",
          createdDate: "",
          updatedDate: "",
          users_id: "",
          type: "forum",
          arr: [],
        };
      }

      setName(name);
      setAnonymity(anonymity);
      setComment(comment);
      setImagesAndVideosObj(imagesAndVideosObj);
    } catch (errorObj) {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

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
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  /**
   * 返信作成・編集フォームを送信する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
    // ---------------------------------------------

    eventObj.preventDefault();

    // ---------------------------------------------
    //   新規投稿時の forumReplies_id
    // ---------------------------------------------

    let newForumReplies_id = "";

    try {
      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const threadListLimit = parseInt(
        getCookie({ key: "forumThreadListLimit" }) ||
          process.env.NEXT_PUBLIC_FORUM_THREAD_LIST_LIMIT,
        10
      );
      const threadLimit = parseInt(
        getCookie({ key: "forumThreadLimit" }) ||
          process.env.NEXT_PUBLIC_FORUM_THREAD_LIMIT,
        10
      );
      const commentLimit = parseInt(
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
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (
        (!gameCommunities_id && !userCommunities_id) ||
        !forumThreads_id ||
        !forumComments_id
      ) {
        throw new CustomError({
          errorsArr: [{ code: "ooDR_zAOu", messageID: "1YJnibkmh" }],
        });
      }

      // ---------------------------------------------
      //   Validation Error
      // ---------------------------------------------

      if (
        validationHandleName({ value: name }).error ||
        validationBoolean({ value: anonymity }).error ||
        validationForumCommentsComment({ value: comment }).error ||
        validationTermsOfService({
          agree: agreeTermsOfService,
          agreedVersion: termsOfServiceAgreedVersion,
        }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "keP5ra5TO", messageID: "uwHIKBy7c" }],
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
        name,
        anonymity,
        comment,
        threadListLimit,
        threadLimit,
        commentLimit,
        replyLimit,
      };

      if (forumReplies_id) {
        formDataObj.forumReplies_id = forumReplies_id;
      }

      if (replyToForumComments_id) {
        formDataObj.replyToForumComments_id = replyToForumComments_id;
      }

      if (Object.keys(imagesAndVideosObj).length !== 0) {
        formDataObj.imagesAndVideosObj = imagesAndVideosObj;
      }

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      let resultObj = {};

      if (gameCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/upsert-reply-gc`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      } else if (userCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/upsert-reply-uc`,
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
      //   Set termsOfServiceAgreedVersion
      // ---------------------------------------------

      setCookie({
        key: "termsOfServiceAgreedVersion",
        value: process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_VERSION,
      });
      setTermsOfServiceAgreedVersion(
        process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_VERSION
      );

      // ---------------------------------------------
      //   Reset Form
      // ---------------------------------------------

      setName("");
      setAnonymity(false);
      setComment("");
      setImagesAndVideosObj({
        _id: "",
        createdDate: "",
        updatedDate: "",
        users_id: "",
        type: "forum",
        arr: [],
      });

      setAgreeTermsOfService(false);

      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

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
      //   forumRepliesObj
      // ---------------------------------------------

      // setForumRepliesObj(lodashGet(resultObj, ['data', 'forumRepliesObj'], {}));

      // ---------------------------------------------
      //   Update - forumRepliesObj
      // ---------------------------------------------

      const forumRepliesNewObj = lodashGet(
        resultObj,
        ["data", "forumRepliesObj"],
        {}
      );
      const forumRepliesMergedObj = lodashMerge(
        forumRepliesObj,
        forumRepliesNewObj
      );
      setForumRepliesObj(forumRepliesMergedObj);

      // ---------------------------------------------
      //   新規投稿時の forumReplies_id
      // ---------------------------------------------

      const page = lodashGet(
        resultObj,
        ["data", "forumRepliesObj", forumComments_id, "page"],
        1
      );
      newForumReplies_id = lodashGet(
        resultObj,
        [
          "data",
          "forumRepliesObj",
          forumComments_id,
          `page${page}Obj`,
          "arr",
          0,
        ],
        ""
      );

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
            messageID: forumReplies_id ? "0q0NzGlLb" : "cuaQHE4lG",
          },
        ],
      });

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   //app/common/forum/v2/components/form/reply.js - handleSubmit
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- forumRepliesMergedObj -----\n
      //   ${util.inspect(forumRepliesMergedObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(chalk`
      //   forumComments_id: {green ${forumComments_id}}
      //   forumReplies_id: {green ${forumReplies_id}}
      //   newForumReplies_id: {green ${newForumReplies_id}}
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      //   forumComments_id: {green ${forumComments_id}}
      //   forumReplies_id: {green ${forumReplies_id}}
      //   replyToForumComments_id: {green ${replyToForumComments_id}}
      //   name: {green ${name}}
      //   anonymity: {green ${anonymity}}
      //   comment: {green ${comment}}
      // `);

      // console.log(`
      //   ----- imagesAndVideosObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    } catch (errorObj) {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

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
      //   Hide Form
      // ---------------------------------------------

      setShowForm(false);
      // if (forumReplies_id) {
      //   setShowForm(false);
      // }

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to:
          forumReplies_id ||
          newForumReplies_id ||
          forumComments_id ||
          forumThreads_id ||
          "forumThreads",
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

      // ---------------------------------------------
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  // --------------------------------------------------
  //   Limit
  // --------------------------------------------------

  const limit = parseInt(
    process.env.NEXT_PUBLIC_FORUM_REPLY_IMAGES_AND_VIDEOS_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Reply to
  // --------------------------------------------------

  let replyToName = "";
  let repliesDataObj = {};
  let replyTo = "";

  if (forumReplies_id) {
    repliesDataObj = lodashGet(
      forumRepliesObj,
      ["dataObj", forumReplies_id],
      {}
    );
    replyToName = lodashGet(repliesDataObj, ["replyToName"], "");
  } else if (replyToForumComments_id) {
    repliesDataObj = lodashGet(
      forumRepliesObj,
      ["dataObj", replyToForumComments_id],
      {}
    );
    replyToName = lodashGet(
      repliesDataObj,
      ["cardPlayersObj", "name"],
      repliesDataObj.name
    );

    if (!replyToName) {
      replyToName = "ななしさん";
    }
  }

  if (replyToName) {
    replyTo = `${replyToName} | ${replyToForumComments_id} への返信`;
  }

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
    <form
      css={forumReplies_id ? cssEdit : cssNew}
      name={`form-${forumComments_id}-reply`}
      onSubmit={(eventObj) =>
        handleSubmit({
          eventObj,
        })
      }
    >
      {/* Reply To */}
      {replyTo && (
        <div
          css={css`
            display: flex;
            flex-flow: row nowrap;
            margin: 8px 0 12px 0;
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

      {/* Name */}
      <FormName
        name={name}
        setName={setName}
        anonymity={anonymity}
        setAnonymity={setAnonymity}
        enableAnonymity={enableAnonymity}
      />

      {/* Comment */}
      <div
        css={css`
          margin: 12px 0 0 0;
        `}
      >
        <TextareaAutosize
          css={css`
            && {
              width: 100%;
              border-radius: 4px;
              box-sizing: border-box;
              padding: 8px 12px;
              line-height: 1.8;

              &:focus {
                outline: 1px #a9f5f2 solid;
              }

              resize: none;
            }
          `}
          rows={5}
          placeholder="返信を書き込んでください。"
          value={comment}
          onChange={(eventObj) => setComment(eventObj.target.value)}
          maxLength={3000}
          disabled={buttonDisabled}
        />
      </div>

      {/* Form Images & Videos */}
      <div
        css={css`
          margin: 4px 0 0 0;
        `}
      >
        <FormImageAndVideo
          descriptionImage="返信に表示する画像をアップロードできます。"
          descriptionVideo="返信に表示する動画を登録できます。"
          showImageCaption={true}
          limit={limit}
          imagesAndVideosObj={imagesAndVideosObj}
          setImagesAndVideosObj={setImagesAndVideosObj}
        />
      </div>

      {/* Terms of Service */}
      <div
        css={css`
          margin: 14px 0 0 0;
        `}
      >
        <TermsOfService
          agreeTermsOfService={agreeTermsOfService}
          setAgreeTermsOfService={setAgreeTermsOfService}
        />
      </div>

      {/* Buttons */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          margin: 24px 0 0 0;
        `}
      >
        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={buttonDisabled}
        >
          {forumReplies_id ? "返信を編集する" : "返信を投稿する"}
        </Button>

        {/* Close */}
        {forumComments_id && (
          <div
            css={css`
              margin: 0 0 0 auto;
            `}
          >
            <Button
              variant="outlined"
              color="secondary"
              disabled={buttonDisabled}
              onClick={() => setShowForm(false)}
            >
              閉じる
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

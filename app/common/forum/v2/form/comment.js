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

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";

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

    if (forumComments_id) {
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

  const {
    setForumThreadsForListObj,
    setForumThreadsObj,
    setForumCommentsObj,
    setForumRepliesObj,
  } = stateForum;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 編集用データを読み込む
   */
  const handleGetEditData = async () => {
    try {
      // ---------------------------------------------
      //   forumComments_id が存在しない場合エラー
      // ---------------------------------------------

      if (!forumComments_id) {
        throw new CustomError({
          errorsArr: [{ code: "3NtNGg1EG", messageID: "Error" }],
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
        to: forumComments_id,
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        forumComments_id,
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
   * コメント作成・編集フォームを送信する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
    // ---------------------------------------------

    eventObj.preventDefault();

    // ---------------------------------------------
    //   新規投稿時の forumComments_id
    // ---------------------------------------------

    let newForumComments_id = "";

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

      if ((!gameCommunities_id && !userCommunities_id) || !forumThreads_id) {
        throw new CustomError({
          errorsArr: [{ code: "UsXqWgrd6", messageID: "1YJnibkmh" }],
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
          errorsArr: [{ code: "evE70gDt0", messageID: "uwHIKBy7c" }],
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
        name,
        anonymity,
        comment,
        threadListLimit,
        threadLimit,
        commentLimit,
        replyLimit,
      };

      if (forumComments_id) {
        formDataObj.forumComments_id = forumComments_id;
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
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/upsert-comment-gc`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      } else if (userCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-comments/upsert-comment-uc`,
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
      //   forumThreadsForListObj
      // ---------------------------------------------

      setForumThreadsForListObj(
        lodashGet(resultObj, ["data", "forumThreadsForListObj"], {})
      );

      // ---------------------------------------------
      //   forumThreadsObj
      // ---------------------------------------------

      setForumThreadsObj(lodashGet(resultObj, ["data", "forumThreadsObj"], {}));

      // ---------------------------------------------
      //   forumCommentsObj
      // ---------------------------------------------

      setForumCommentsObj(
        lodashGet(resultObj, ["data", "forumCommentsObj"], {})
      );

      // ---------------------------------------------
      //   forumRepliesObj
      // ---------------------------------------------

      setForumRepliesObj(lodashGet(resultObj, ["data", "forumRepliesObj"], {}));

      // ---------------------------------------------
      //   新規投稿時の forumComments_id
      // ---------------------------------------------

      newForumComments_id = lodashGet(
        resultObj,
        ["data", "forumCommentsObj", forumThreads_id, "page1Obj", "arr", 0],
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
            messageID: forumComments_id ? "NKsMLWvkt" : "fhi9lUaap",
          },
        ],
      });

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/forum/v2/components/form/comment.js - handleSubmit
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      //   forumComments_id: {green ${forumComments_id}}
      //   name: {green ${name}}
      //   comment: {green ${comment}}
      // `);

      // console.log(`
      //   ----- imagesAndVideosObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // return;

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
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

      if (forumComments_id) {
        setShowForm(false);
      }

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to:
          forumComments_id ||
          newForumComments_id ||
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
    process.env.NEXT_PUBLIC_FORUM_COMMENT_IMAGES_AND_VIDEOS_LIMIT,
    10
  );

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
      css={css`
        padding: 0 0 8px;
      `}
      name={`form-${forumComments_id}`}
      onSubmit={(eventObj) =>
        handleSubmit({
          eventObj,
        })
      }
    >
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
          placeholder="コメントを書き込んでください。"
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
          descriptionImage="コメントに表示する画像をアップロードできます。"
          descriptionVideo="コメントに表示する動画を登録できます。"
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
          {forumComments_id ? "コメントを編集する" : "コメントを投稿する"}
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

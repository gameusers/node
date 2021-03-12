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
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

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

import { validationTermsOfService } from "app/@validations/terms-of-service.js";

import { validationForumThreadsName } from "app/@database/forum-threads/validations/name.js";
import { validationForumThreadsComment } from "app/@database/forum-threads/validations/comment.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

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

    setShowForm,
    setPanelExpanded,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [name, setName] = useState("");
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

    if (forumThreads_id) {
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
      //   forumThreads_id が存在しない場合エラー
      // ---------------------------------------------

      if (!forumThreads_id) {
        throw new CustomError({
          errorsArr: [{ code: "5bsoal_-V", messageID: "Error" }],
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
        to: forumThreads_id,
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        forumThreads_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-threads/get-edit-data`,
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
   * スレッド作成・編集フォームを送信する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
    // ---------------------------------------------

    eventObj.preventDefault();

    // ---------------------------------------------
    //   新規投稿時の forumThreads_id
    // ---------------------------------------------

    let newForumThreads_id = "";

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

      if (!gameCommunities_id && !userCommunities_id) {
        throw new CustomError({
          errorsArr: [{ code: "8319EqfHo", messageID: "1YJnibkmh" }],
        });
      }

      // ---------------------------------------------
      //   Validation Error
      // ---------------------------------------------

      if (
        validationForumThreadsName({ value: name }).error ||
        validationForumThreadsComment({ value: comment }).error ||
        validationTermsOfService({
          agree: agreeTermsOfService,
          agreedVersion: termsOfServiceAgreedVersion,
        }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "Gd0MdEBNq", messageID: "uwHIKBy7c" }],
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
        comment,
        threadListLimit,
        threadLimit,
        commentLimit,
        replyLimit,
      };

      if (Object.keys(imagesAndVideosObj).length !== 0) {
        formDataObj.imagesAndVideosObj = imagesAndVideosObj;
      }

      // if (lodashHas(imagesAndVideosObj, ['arr', 0, '_id'])) {
      //   formDataObj.imagesAndVideosObj = imagesAndVideosObj;
      // }

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      let resultObj = {};

      if (gameCommunities_id) {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-threads/upsert-gc`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });
      } else {
        resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/forum-threads/upsert-uc`,
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
      //   新規投稿時の forumThreads_id
      // ---------------------------------------------

      newForumThreads_id = lodashGet(
        resultObj,
        ["data", "forumThreadsObj", "page1Obj", "arr", 0],
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
            messageID: forumThreads_id ? "HINAkcSmJ" : "pInPmleQh",
          },
        ],
      });

      // --------------------------------------------------
      //   スレッド投稿フォームを閉じる
      // --------------------------------------------------

      if (setPanelExpanded) {
        setPanelExpanded(false);
      }

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/forum/v2/components/form/thread.js - handleSubmit
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   userCommunities_id: {green ${userCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      //   name: {green ${name}}
      //   comment: {green ${comment}}
      // `);

      // console.log(`
      //   ----- imagesAndVideosObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

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

      if (forumThreads_id) {
        setShowForm(false);
      }

      // console.log(chalk`
      //   forumThreads_id: {green ${forumThreads_id} / ${typeof forumThreads_id}}
      //   newForumThreads_id: {green ${newForumThreads_id} / ${typeof newForumThreads_id}}
      // `);

      // ---------------------------------------------
      //   Scroll To / 新規投稿時に効かない
      // ---------------------------------------------

      handleScrollTo({
        to: forumThreads_id || newForumThreads_id || "forumThreads",
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
  //   Validations
  // --------------------------------------------------

  const validationForumThreadsNameObj = validationForumThreadsName({
    value: name,
  });

  // --------------------------------------------------
  //   Limit
  // --------------------------------------------------

  const limit = parseInt(
    process.env.NEXT_PUBLIC_FORUM_THREAD_IMAGES_AND_VIDEOS_LIMIT,
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
      name={`form-${forumThreads_id}`}
      onSubmit={(eventObj) =>
        handleSubmit({
          eventObj,
        })
      }
    >
      {!forumThreads_id && (
        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          スレッドを新しく投稿する場合、こちらのフォームを利用して投稿してください。ログインして投稿するとスレッドをいつでも編集できるようになります。
        </p>
      )}

      {/* Name */}
      <TextField
        css={css`
          && {
            width: 100%;
            max-width: 500px;
            ${forumThreads_id && `margin-top: 4px;`}
          }
        `}
        id="createTreadName"
        label="スレッド名"
        value={validationForumThreadsNameObj.value}
        onChange={(eventObj) => setName(eventObj.target.value)}
        error={validationForumThreadsNameObj.error}
        helperText={intl.formatMessage(
          { id: validationForumThreadsNameObj.messageID },
          {
            numberOfCharacters:
              validationForumThreadsNameObj.numberOfCharacters,
          }
        )}
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
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
          placeholder="スレッドについての説明、書き込みルールなどがあれば、こちらに記述してください。"
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
          descriptionImage="スレッドに表示する画像をアップロードできます。"
          descriptionVideo="スレッドに表示する動画を登録できます。"
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
          {forumThreads_id ? "スレッドを編集する" : "スレッドを作成する"}
        </Button>

        {/* Close */}
        {forumThreads_id && (
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

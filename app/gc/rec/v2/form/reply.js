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
import { Element } from "react-scroll";
import TextareaAutosize from "react-autosize-textarea";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashHas from "lodash/has";
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
import { ContainerStateRecruitment } from "app/@states/recruitment.js";

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
import { validationTermsOfService } from "app/@validations/terms-of-service.js";

import { validationRecruitmentThreadsComment } from "app/@database/recruitment-threads/validations/comment.js";

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
    recruitmentThreads_id,
    recruitmentComments_id,
    recruitmentReplies_id,
    replyToRecruitmentReplies_id,

    setShowForm,
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
    type: "recruitment",
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

    if (recruitmentReplies_id) {
      handleGetEditData();
    }
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateUser = ContainerStateUser.useContainer();
  const stateLayout = ContainerStateLayout.useContainer();
  const stateCommunity = ContainerStateCommunity.useContainer();
  const stateRecruitment = ContainerStateRecruitment.useContainer();

  const {
    localeObj,
    termsOfServiceAgreedVersion,
    setTermsOfServiceAgreedVersion,
  } = stateUser;

  const { handleLoadingOpen, handleLoadingClose, handleScrollTo } = stateLayout;

  const { setGameCommunityObj } = stateCommunity;

  const { recruitmentRepliesObj, setRecruitmentRepliesObj } = stateRecruitment;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 編集用データを読み込む
   */
  const handleGetEditData = async () => {
    try {
      // ---------------------------------------------
      //   recruitmentReplies_id が存在しない場合エラー
      // ---------------------------------------------

      if (!recruitmentReplies_id) {
        throw new CustomError({
          errorsArr: [{ code: "eryvlZc7N", messageID: "Error" }],
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
        to: recruitmentReplies_id,
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

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
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/recruitment-replies/get-edit-data`,
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

      const localesArr = lodashGet(resultObj, ["data", "localesArr"], []);

      const filteredArr = localesArr.filter((filterObj) => {
        return filterObj.language === localeObj.language;
      });

      if (lodashHas(filteredArr, [0])) {
        setName(lodashGet(filteredArr, [0, "name"], ""));
        setComment(lodashGet(filteredArr, [0, "comment"], ""));
      } else {
        setName(lodashGet(localesArr, [0, "name"], ""));
        setComment(lodashGet(localesArr, [0, "comment"], ""));
      }

      let tempImagesAndVideosObj = lodashGet(
        resultObj,
        ["data", "imagesAndVideosObj"],
        {}
      );

      if (Object.keys(tempImagesAndVideosObj).length === 0) {
        tempImagesAndVideosObj = {
          _id: "",
          createdDate: "",
          updatedDate: "",
          users_id: "",
          type: "recruitment",
          arr: [],
        };
      }

      setImagesAndVideosObj(tempImagesAndVideosObj);
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
   * 返信を投稿する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
    // ---------------------------------------------

    eventObj.preventDefault();

    // ---------------------------------------------
    //   新規投稿時の recruitmentReplies_id
    // ---------------------------------------------

    let newRecruitmentReplies_id = "";

    try {
      // ---------------------------------------------
      //   Temp Data
      // ---------------------------------------------

      // setName('テストネーム');
      // setComment('テストコメント');

      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const threadLimit = parseInt(
        getCookie({ key: "recruitmentThreadLimit" }) ||
          process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_LIMIT,
        10
      );
      const commentLimit = parseInt(
        getCookie({ key: "recruitmentCommentLimit" }) ||
          process.env.NEXT_PUBLIC_RECRUITMENT_COMMENT_LIMIT,
        10
      );
      const replyLimit = parseInt(
        getCookie({ key: "recruitmentReplyLimit" }) ||
          process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_LIMIT,
        10
      );

      // ---------------------------------------------
      //   Validations
      // ---------------------------------------------

      if (
        validationHandleName({ value: name }).error ||
        validationRecruitmentThreadsComment({ value: comment }).error ||
        validationTermsOfService({
          agree: agreeTermsOfService,
          agreedVersion: termsOfServiceAgreedVersion,
        }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "gNEl9TZsF", messageID: "uwHIKBy7c" }],
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
        recruitmentThreads_id,
        recruitmentComments_id,
        recruitmentReplies_id,
        replyToRecruitmentReplies_id,
        name,
        comment,
        threadLimit,
        commentLimit,
        replyLimit,
      };

      if (Object.keys(imagesAndVideosObj).length !== 0) {
        formDataObj.imagesAndVideosObj = imagesAndVideosObj;
      }

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/recruitment-replies/upsert`,
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
        type: "recruitment",
        arr: [],
      });

      setAgreeTermsOfService(false);

      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // --------------------------------------------------
      //   gameCommunityObj
      // --------------------------------------------------

      setGameCommunityObj(
        lodashGet(resultObj, ["data", "gameCommunityObj"], {})
      );

      // ---------------------------------------------
      //   recruitmentRepliesObj
      // ---------------------------------------------

      // setRecruitmentRepliesObj(lodashGet(resultObj, ['data', 'recruitmentRepliesObj'], {}));

      // ---------------------------------------------
      //   Update - forumRepliesObj
      // ---------------------------------------------

      const recruitmentRepliesNewObj = lodashGet(
        resultObj,
        ["data", "recruitmentRepliesObj"],
        {}
      );
      const recruitmentRepliesMergedObj = lodashMerge(
        recruitmentRepliesObj,
        recruitmentRepliesNewObj
      );
      setRecruitmentRepliesObj(recruitmentRepliesMergedObj);

      // ---------------------------------------------
      //   新規投稿時の recruitmentReplies_id
      // ---------------------------------------------

      const page = lodashGet(
        resultObj,
        ["data", "recruitmentRepliesObj", recruitmentComments_id, "page"],
        1
      );
      newRecruitmentReplies_id = lodashGet(
        resultObj,
        [
          "data",
          "recruitmentRepliesObj",
          recruitmentComments_id,
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
            messageID: recruitmentComments_id ? "0q0NzGlLb" : "cuaQHE4lG",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/gc/rec/v2/components/form/comment.js / handleSubmit
      // `);

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(formDataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(chalk`
      //   recruitmentComments_id: {green ${recruitmentComments_id}}
      //   recruitmentReplies_id: {green ${recruitmentReplies_id}}
      //   replyToRecruitmentReplies_id:  {green ${replyToRecruitmentReplies_id}}
      //   newRecruitmentReplies_id: {green ${newRecruitmentReplies_id}}
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

      if (!replyToRecruitmentReplies_id) {
        setShowForm(false);
      }

      // ---------------------------------------------
      //   Scroll
      // ---------------------------------------------

      handleScrollTo({
        to:
          recruitmentReplies_id ||
          newRecruitmentReplies_id ||
          recruitmentComments_id ||
          recruitmentThreads_id ||
          "recruitmentThreads",
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

  /**
   * フォームを閉じる
   */
  const handleClose = async () => {
    // ---------------------------------------------
    //   閉じる
    // ---------------------------------------------

    setShowForm(false);

    // ---------------------------------------------
    //   Scroll To
    // ---------------------------------------------

    handleScrollTo({
      to:
        replyToRecruitmentReplies_id ||
        recruitmentReplies_id ||
        recruitmentComments_id ||
        recruitmentThreads_id,
      duration: 0,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -50,
    });
  };

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const limitImagesAndVideos = parseInt(
    process.env.NEXT_PUBLIC_RECRUITMENT_REPLY_IMAGES_AND_VIDEOS_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Reply to
  // --------------------------------------------------

  const dataObj = lodashGet(recruitmentRepliesObj, ["dataObj"], {});

  let replyToName = "";
  let replyTo = "";

  if (recruitmentReplies_id) {
    replyToName = lodashGet(
      dataObj,
      [recruitmentReplies_id, "replyToName"],
      ""
    );
  } else if (replyToRecruitmentReplies_id) {
    const nonLoginUsersName = lodashGet(
      dataObj,
      [replyToRecruitmentReplies_id, "name"],
      ""
    );
    const loginUsersName = lodashGet(
      dataObj,
      [replyToRecruitmentReplies_id, "cardPlayersObj", "name"],
      ""
    );

    replyToName = loginUsersName || nonLoginUsersName;

    if (!replyToName) {
      replyToName = "ななしさん";
    }
  }

  if (replyToName) {
    replyTo = `${replyToName} | ${replyToRecruitmentReplies_id} への返信`;
  }

  // --------------------------------------------------
  //   Element Name
  // --------------------------------------------------

  const elementName = recruitmentReplies_id
    ? `${recruitmentReplies_id}-formReply`
    : `${recruitmentComments_id}-formReply`;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/form/reply.js
  // `);

  // console.log(chalk`
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
  //   recruitmentComments_id: {green ${recruitmentComments_id}}
  //   recruitmentReplies_id: {green ${recruitmentReplies_id}}
  //   replyToRecruitmentReplies_id: {green ${replyToRecruitmentReplies_id}}
  // `);

  // console.log(`
  //   ----- dataObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(dataObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element
      css={css`
        ${!recruitmentReplies_id &&
        `
            border-top: 1px dashed #848484;
            margin: 24px 0 0 0;
            padding: 24px 0 0 0;
          `}
      `}
      name={elementName}
    >
      {/* Form */}
      <form
        name={elementName}
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

        {/* Name */}
        <FormName name={name} setName={setName} />

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
            placeholder="返信を入力してください。"
            value={comment}
            maxLength={3000}
            disabled={buttonDisabled}
            onChange={(eventObj) => setComment(eventObj.target.value)}
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
            limit={limitImagesAndVideos}
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
            {recruitmentReplies_id ? "編集する" : "投稿する"}
          </Button>

          {/* Close */}
          <div
            css={css`
              margin: 0 0 0 auto;
            `}
          >
            <Button
              variant="outlined"
              color="secondary"
              disabled={buttonDisabled}
              onClick={() => handleClose()}
            >
              閉じる
            </Button>
          </div>
        </div>
      </form>
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

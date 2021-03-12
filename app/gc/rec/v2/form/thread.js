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

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

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

import { validationBoolean } from "app/@validations/boolean.js";
import { validationHandleName } from "app/@validations/name.js";
import { validationTermsOfService } from "app/@validations/terms-of-service.js";

import { validationRecruitmentThreadsCategory } from "app/@database/recruitment-threads/validations/category.js";
import { validationRecruitmentThreadsTitle } from "app/@database/recruitment-threads/validations/title.js";
import { validationRecruitmentThreadsComment } from "app/@database/recruitment-threads/validations/comment.js";
import {
  validationRecruitmentThreadsPlatform,
  validationRecruitmentThreadsID,
  validationRecruitmentThreadsInformationTitle,
  validationRecruitmentThreadsInformation,
  validationRecruitmentThreadsPublicSetting,
} from "app/@database/recruitment-threads/validations/ids-informations.js";
import { validationRecruitmentThreadsDeadlineDate } from "app/@database/recruitment-threads/validations/deadline.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormName from "app/common/form/v2/name.js";
import FormImageAndVideo from "app/common/image-and-video/v2/form.js";
import FormHardwares from "app/common/hardware/v2/form.js";
import WebPuchCheckbox from "app/common/web-push/v2/checkbox.js";
import TermsOfService from "app/common/form/v2/terms-of-service.js";

import FormIDsInformations from "app/gc/rec/v2/form/ids-informations.js";
import FormDeadline from "app/gc/rec/v2/form/deadline.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssBox = css`
  border-top: 1px dashed #848484;
  margin: 24px 0 0 0;
  padding: 24px 0 0 0;
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
    recruitmentThreads_id,

    setShowForm,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [hardwaresArr, setHardwaresArr] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
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

  const [idsArr, setIDsArr] = useState([]);
  const [platform1, setPlatform1] = useState("Other");
  const [platform2, setPlatform2] = useState("Other");
  const [platform3, setPlatform3] = useState("Other");
  const [id1, setID1] = useState("");
  const [id2, setID2] = useState("");
  const [id3, setID3] = useState("");
  const [informationTitle1, setInformationTitle1] = useState("");
  const [informationTitle2, setInformationTitle2] = useState("");
  const [informationTitle3, setInformationTitle3] = useState("");
  const [informationTitle4, setInformationTitle4] = useState("");
  const [informationTitle5, setInformationTitle5] = useState("");
  const [information1, setInformation1] = useState("");
  const [information2, setInformation2] = useState("");
  const [information3, setInformation3] = useState("");
  const [information4, setInformation4] = useState("");
  const [information5, setInformation5] = useState("");
  const [publicSetting, setPublicSetting] = useState(1);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [webPushAvailable, setWebPushAvailable] = useState(false);
  const [webPushSubscriptionObj, setWebPushSubscriptionObj] = useState({});
  const [agreeTermsOfService, setAgreeTermsOfService] = useState(false);

  useEffect(() => {
    // --------------------------------------------------
    //   Button Enable
    // --------------------------------------------------

    setButtonDisabled(false);

    // --------------------------------------------------
    //   編集用データを読み込む
    // --------------------------------------------------

    if (recruitmentThreads_id) {
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

  const {
    setRecruitmentThreadsObj,
    setRecruitmentCommentsObj,
    setRecruitmentRepliesObj,
  } = stateRecruitment;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 編集用データを読み込む
   */
  const handleGetEditData = async () => {
    try {
      // ---------------------------------------------
      //   recruitmentThreads_id が存在しない場合エラー
      // ---------------------------------------------

      if (!recruitmentThreads_id) {
        throw new CustomError({
          errorsArr: [{ code: "1sfB7JPUO", messageID: "Error" }],
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
        to: recruitmentThreads_id,
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

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
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/recruitment-threads/get-edit-data`,
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

      setHardwaresArr(lodashGet(resultObj, ["data", "hardwaresArr"], []));
      setCategory(lodashGet(resultObj, ["data", "category"], ""));

      const localesArr = lodashGet(resultObj, ["data", "localesArr"], []);

      const filteredArr = localesArr.filter((filterObj) => {
        return filterObj.language === localeObj.language;
      });

      if (lodashHas(filteredArr, [0])) {
        setTitle(lodashGet(filteredArr, [0, "title"], ""));
        setName(lodashGet(filteredArr, [0, "name"], ""));
        setComment(lodashGet(filteredArr, [0, "comment"], ""));
      } else {
        setTitle(lodashGet(localesArr, [0, "title"], ""));
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

      setIDsArr(lodashGet(resultObj, ["data", "idsArr"], []));
      setPlatform1(lodashGet(resultObj, ["data", "platform1"], "Other"));
      setPlatform2(lodashGet(resultObj, ["data", "platform2"], "Other"));
      setPlatform3(lodashGet(resultObj, ["data", "platform3"], "Other"));
      setID1(lodashGet(resultObj, ["data", "id1"], ""));
      setID2(lodashGet(resultObj, ["data", "id2"], ""));
      setID3(lodashGet(resultObj, ["data", "id3"], ""));
      setInformationTitle1(
        lodashGet(resultObj, ["data", "informationTitle1"], "")
      );
      setInformationTitle2(
        lodashGet(resultObj, ["data", "informationTitle2"], "")
      );
      setInformationTitle3(
        lodashGet(resultObj, ["data", "informationTitle3"], "")
      );
      setInformationTitle4(
        lodashGet(resultObj, ["data", "informationTitle4"], "")
      );
      setInformationTitle5(
        lodashGet(resultObj, ["data", "informationTitle5"], "")
      );
      setInformation1(lodashGet(resultObj, ["data", "information1"], ""));
      setInformation2(lodashGet(resultObj, ["data", "information2"], ""));
      setInformation3(lodashGet(resultObj, ["data", "information3"], ""));
      setInformation4(lodashGet(resultObj, ["data", "information4"], ""));
      setInformation5(lodashGet(resultObj, ["data", "information5"], ""));
      setPublicSetting(lodashGet(resultObj, ["data", "publicSetting"], 1));
      setDeadlineDate(lodashGet(resultObj, ["data", "deadlineDate"], ""));
      setWebPushAvailable(
        lodashGet(resultObj, ["data", "webPushAvailable"], false)
      );
      setWebPushSubscriptionObj(
        lodashGet(resultObj, ["data", "webPushesObj", "subscriptionObj"], {})
      );
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
   * 募集を投稿する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
    // ---------------------------------------------

    eventObj.preventDefault();

    // ---------------------------------------------
    //   新規投稿時の recruitmentThreads_id
    // ---------------------------------------------

    let newRecruitmentThreads_id = "";

    try {
      // console.log(chalk`
      //   platform1: {green ${platform1}}
      //   platform2: {green ${platform2}}
      //   platform3: {green ${platform3}}
      // `);

      // ---------------------------------------------
      //   Temp Data
      // ---------------------------------------------

      // setHardwaresArr([ { hardwareID: 'I-iu-WmkO', name: 'ファミリーコンピュータ' },  { hardwareID: '2yKF4qXAw', name: 'メガドライブ' } ]);
      // setCategory(1);
      // setTitle('テストタイトル');
      // setName('テストネーム');
      // setComment('テストコメント');
      // setWebPushAvailable(true);
      // setPlatform1('Other');
      // setPlatform2('Other');
      // setPlatform3('Other');
      // setID1('test-id-1');
      // setInformationTitle1('情報タイトル1');
      // setInformation1('情報1');
      // setPublicSetting(1);
      // setDeadlineDate('');
      // setWebPushSubscriptionObj({

      //   endpoint: 'https://fcm.googleapis.com/fcm/send/fStle9C5HJk:APA91bFMuBrN4DaT6QOVLhkXbaDJCTEM3q0hE8gM_FPqMqE7SgN6fkxylrFLfve3C8QA7O03Q-UWMXI2LQINSpCCveDrMV3FOpTfPfRhjabMbM43dsBVcKHJy4QcasADEW9KqA40Ea5y',
      //   keys: {
      //     p256dh: 'BCleeWTRP95hSeOXd3lTmcGInU2AFR4xEfy6W_kgzwd7IT_GMXzbhriEerFEFZDEXOQJNTGUFObhkol2P7qTMWw',
      //     auth: 'siDbUa9DCbg-n9AMsvWA1w'
      //   }

      // });

      // ---------------------------------------------
      //   Property
      // ---------------------------------------------

      const hardwareIDsArr = [];

      for (let valueObj of hardwaresArr.values()) {
        hardwareIDsArr.push(valueObj.hardwareID);
      }

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
        validationRecruitmentThreadsCategory({ value: category }).error ||
        validationRecruitmentThreadsTitle({ value: title }).error ||
        validationHandleName({ value: name }).error ||
        validationRecruitmentThreadsComment({ value: comment }).error ||
        validationRecruitmentThreadsPlatform({ value: platform1 }).error ||
        validationRecruitmentThreadsPlatform({ value: platform2 }).error ||
        validationRecruitmentThreadsPlatform({ value: platform3 }).error ||
        validationRecruitmentThreadsID({ value: id1 }).error ||
        validationRecruitmentThreadsID({ value: id2 }).error ||
        validationRecruitmentThreadsID({ value: id3 }).error ||
        validationRecruitmentThreadsInformationTitle({
          value: informationTitle1,
        }).error ||
        validationRecruitmentThreadsInformationTitle({
          value: informationTitle2,
        }).error ||
        validationRecruitmentThreadsInformationTitle({
          value: informationTitle3,
        }).error ||
        validationRecruitmentThreadsInformationTitle({
          value: informationTitle4,
        }).error ||
        validationRecruitmentThreadsInformationTitle({
          value: informationTitle5,
        }).error ||
        validationRecruitmentThreadsInformation({ value: information1 })
          .error ||
        validationRecruitmentThreadsInformation({ value: information2 })
          .error ||
        validationRecruitmentThreadsInformation({ value: information3 })
          .error ||
        validationRecruitmentThreadsInformation({ value: information4 })
          .error ||
        validationRecruitmentThreadsInformation({ value: information5 })
          .error ||
        validationRecruitmentThreadsPublicSetting({ value: publicSetting })
          .error ||
        validationRecruitmentThreadsDeadlineDate({ value: deadlineDate })
          .error ||
        validationBoolean({ value: webPushAvailable }).error ||
        validationTermsOfService({
          agree: agreeTermsOfService,
          agreedVersion: termsOfServiceAgreedVersion,
        }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "S0JRF6V5l", messageID: "uwHIKBy7c" }],
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
        hardwareIDsArr,
        category,
        title,
        name,
        comment,
        idsArr,
        platform1,
        platform2,
        platform3,
        id1,
        id2,
        id3,
        informationTitle1,
        informationTitle2,
        informationTitle3,
        informationTitle4,
        informationTitle5,
        information1,
        information2,
        information3,
        information4,
        information5,
        publicSetting,
        deadlineDate,
        webPushAvailable,
        threadLimit,
        commentLimit,
        replyLimit,
      };

      if (Object.keys(imagesAndVideosObj).length !== 0) {
        formDataObj.imagesAndVideosObj = imagesAndVideosObj;
      }

      if (
        webPushAvailable &&
        Object.keys(webPushSubscriptionObj).length !== 0
      ) {
        formDataObj.webPushSubscriptionObj = webPushSubscriptionObj;
      }

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/recruitment-threads/upsert`,
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

      setHardwaresArr([]);
      setCategory("");
      setTitle("");
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

      setIDsArr([]);
      setPlatform1("Other");
      setPlatform2("Other");
      setPlatform3("Other");
      setID1("");
      setID2("");
      setID3("");
      setInformationTitle1("");
      setInformationTitle2("");
      setInformationTitle3("");
      setInformationTitle4("");
      setInformationTitle5("");
      setInformation1("");
      setInformation2("");
      setInformation3("");
      setInformation4("");
      setInformation5("");
      setPublicSetting(1);
      setDeadlineDate("");
      setWebPushAvailable(false);
      setWebPushSubscriptionObj({});
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
      //   forumThreadsObj
      // ---------------------------------------------

      setRecruitmentThreadsObj(
        lodashGet(resultObj, ["data", "recruitmentThreadsObj"], {})
      );

      // ---------------------------------------------
      //   forumCommentsObj
      // ---------------------------------------------

      setRecruitmentCommentsObj(
        lodashGet(resultObj, ["data", "recruitmentCommentsObj"], {})
      );

      // ---------------------------------------------
      //   forumRepliesObj
      // ---------------------------------------------

      setRecruitmentRepliesObj(
        lodashGet(resultObj, ["data", "recruitmentRepliesObj"], {})
      );

      // ---------------------------------------------
      //   新規投稿時の recruitmentThreads_id
      // ---------------------------------------------

      newRecruitmentThreads_id = lodashGet(
        resultObj,
        ["data", "recruitmentThreadsObj", "page1Obj", "arr", 0],
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
            messageID: recruitmentThreads_id ? "xM5NqhTq5" : "B9Goe5scP",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/gc/rec/v2/components/form/thread.js / handleSubmit
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
      //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
      //   newRecruitmentThreads_id: {green ${newRecruitmentThreads_id}}
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

      if (recruitmentThreads_id) {
        setShowForm(false);
      }

      // ---------------------------------------------
      //   Scroll
      // ---------------------------------------------

      handleScrollTo({
        to:
          recruitmentThreads_id ||
          newRecruitmentThreads_id ||
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
      to: recruitmentThreads_id,
      duration: 0,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -50,
    });
  };

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const limitHardwares = parseInt(
    process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_HARDWARES_LIMIT,
    10
  );
  const limitImagesAndVideos = parseInt(
    process.env.NEXT_PUBLIC_RECRUITMENT_THREAD_IMAGES_AND_VIDEOS_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationRecruitmentThreadsTitleObj = validationRecruitmentThreadsTitle(
    { value: title }
  );

  // --------------------------------------------------
  //   Element Name
  // --------------------------------------------------

  const elementName = recruitmentThreads_id
    ? `${recruitmentThreads_id}-formThread`
    : `${gameCommunities_id}-formThread`;

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/gc/rec/v2/components/form/thread.js
  // `);

  // console.log(chalk`
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
  // `);

  // console.log(`
  //   ----- validationRecruitmentThreadsID1Obj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(validationRecruitmentThreadsID1Obj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name={elementName}>
      {/* Form */}
      <form
        name={elementName}
        onSubmit={(eventObj) =>
          handleSubmit({
            eventObj,
          })
        }
      >
        {/* Heading & Explanation */}
        {recruitmentThreads_id && (
          <React.Fragment>
            <h3
              css={css`
                font-weight: bold;
                margin: 0 0 12px 0;
              `}
            >
              募集編集フォーム
            </h3>

            <p
              css={css`
                margin: 0 0 14px 0;
              `}
            >
              投稿済みの募集を編集できます。
            </p>
          </React.Fragment>
        )}

        {!recruitmentThreads_id && (
          <p
            css={css`
              margin: 0 0 14px 0;
            `}
          >
            募集を新しく投稿する場合、こちらのフォームを利用して投稿してください。ログインして投稿すると募集をいつでも編集できるようになり、ID・情報の公開相手を選ぶことができるようになります。
          </p>
        )}

        {/* Form Hardware */}
        <div css={cssBox}>
          <h3
            css={css`
              font-weight: bold;
              margin: 0 0 2px 0;
            `}
          >
            ハードウェア
          </h3>

          <p
            css={css`
              margin: 0 0 14px 0;
            `}
          >
            募集に関係するハードウェアを選んでください（PC版、○○版などの情報です）
          </p>

          <p
            css={css`
              margin: 0 0 14px 0;
            `}
          >
            ハードウェア名（またはSFC、N64などの略称）の一部を入力すると、入力フォームの下に一覧でハードウェアの正式名称が表示されます。一覧上でハードウェアをクリック（タップ）すると入力は完了です。この欄では複数のハードウェアを入力することが可能です。
          </p>

          <p>
            ゲームのハードウェア名だけでなく、「Android」「iOS」「PC」などもハードウェアとして入力できます。
          </p>

          <FormHardwares
            hardwaresArr={hardwaresArr}
            setHardwaresArr={setHardwaresArr}
            limit={limitHardwares}
          />
        </div>

        {/* Category */}
        <div css={cssBox}>
          <h3
            css={css`
              font-weight: bold;
              margin: 0 0 2px 0;
            `}
          >
            カテゴリー
          </h3>

          <p
            css={css`
              margin: 0 0 24px 0;
            `}
          >
            当てはまるカテゴリーを選んでください。どのカテゴリーにも当てはまらない場合は「なし」を選んでください。
          </p>

          <FormControl>
            <InputLabel shrink id="categoryLabel">
              募集のカテゴリー
            </InputLabel>

            <Select
              css={css`
                && {
                  width: 200px;
                }
              `}
              labelId="categoryLabel"
              value={category}
              onChange={(eventObj) => setCategory(eventObj.target.value)}
              displayEmpty
            >
              <MenuItem value="">なし</MenuItem>
              <MenuItem value={1}>フレンド募集</MenuItem>
              <MenuItem value={2}>メンバー募集</MenuItem>
              <MenuItem value={3}>売買・交換相手募集</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Title & Handle Name & Comment */}
        <div css={cssBox}>
          {/* Title */}
          <TextField
            css={css`
              && {
                width: 100%;
                max-width: 500px;
                ${recruitmentThreads_id && `margin-top: 4px;`}
              }
            `}
            label="募集タイトル"
            value={validationRecruitmentThreadsTitleObj.value}
            onChange={(eventObj) => setTitle(eventObj.target.value)}
            error={validationRecruitmentThreadsTitleObj.error}
            helperText={intl.formatMessage(
              { id: validationRecruitmentThreadsTitleObj.messageID },
              {
                numberOfCharacters:
                  validationRecruitmentThreadsTitleObj.numberOfCharacters,
              }
            )}
            margin="normal"
            inputProps={{
              maxLength: 100,
            }}
          />

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
              placeholder="募集について必要な情報をこちらに記述してください。"
              value={comment}
              maxLength={3000}
              disabled={buttonDisabled}
              onChange={(eventObj) => setComment(eventObj.target.value)}
            />
          </div>

          {/* Form Images & Videos */}
          <div
            css={css`
              margin: 12px 0 0 0;
            `}
          >
            <FormImageAndVideo
              // type="recruitment"
              descriptionImage="募集に表示する画像をアップロードできます。"
              descriptionVideo="募集に表示する動画を登録できます。"
              showImageCaption={true}
              limit={limitImagesAndVideos}
              imagesAndVideosObj={imagesAndVideosObj}
              setImagesAndVideosObj={setImagesAndVideosObj}
            />
          </div>
        </div>

        {/* ID & Other Information */}
        <div css={cssBox}>
          <FormIDsInformations
            type="thread"
            idsArr={idsArr}
            setIDsArr={setIDsArr}
            platform1={platform1}
            setPlatform1={setPlatform1}
            platform2={platform2}
            setPlatform2={setPlatform2}
            platform3={platform3}
            setPlatform3={setPlatform3}
            id1={id1}
            setID1={setID1}
            id2={id2}
            setID2={setID2}
            id3={id3}
            setID3={setID3}
            informationTitle1={informationTitle1}
            setInformationTitle1={setInformationTitle1}
            informationTitle2={informationTitle2}
            setInformationTitle2={setInformationTitle2}
            informationTitle3={informationTitle3}
            setInformationTitle3={setInformationTitle3}
            informationTitle4={informationTitle4}
            setInformationTitle4={setInformationTitle4}
            informationTitle5={informationTitle5}
            setInformationTitle5={setInformationTitle5}
            information1={information1}
            setInformation1={setInformation1}
            information2={information2}
            setInformation2={setInformation2}
            information3={information3}
            setInformation3={setInformation3}
            information4={information4}
            setInformation4={setInformation4}
            information5={information5}
            setInformation5={setInformation5}
            publicSetting={publicSetting}
            setPublicSetting={setPublicSetting}
          />
        </div>

        {/* Deadline */}
        <div css={cssBox}>
          <FormDeadline
            deadlineDate={deadlineDate}
            setDeadlineDate={setDeadlineDate}
            recruitmentThreads_id={recruitmentThreads_id}
          />
        </div>

        {/* プッシュ通知 */}
        <div css={cssBox}>
          <h3
            css={css`
              font-weight: bold;
              margin: 0 0 2px 0;
            `}
          >
            プッシュ通知
          </h3>

          <p
            css={css`
              margin: 0 0 12px 0;
            `}
          >
            ブラウザで通知を受け取れるプッシュ通知の設定を行えます。プッシュ通知を許可すると、募集に返信があったときに通知を受け取れるのでおすすめです。
          </p>

          <p
            css={css`
              margin: 0 0 12px 0;
            `}
          >
            プッシュ通知に対応しているブラウザは最新の
            Chrome、Edge、Firefox、Opera です。
            <span
              css={css`
                color: red;
              `}
            >
              ※ iOS / Mac OSでは利用できません。
            </span>
          </p>

          <p
            css={css`
              margin: 0 0 12px 0;
            `}
          >
            過去にGame
            Usersからのプッシュ通知をブロックしたことがある方は、ブロックを解除しなければ通知を受けることができません。通知を受け取りたい場合は、ご使用のブラウザのブロック解除方法を調べて実行してください。
          </p>

          <WebPuchCheckbox
            webPushAvailable={webPushAvailable}
            setWebPushAvailable={setWebPushAvailable}
            webPushSubscriptionObj={webPushSubscriptionObj}
            setWebPushSubscriptionObj={setWebPushSubscriptionObj}
          />
        </div>

        {/* Terms of Service */}
        <div
          css={css`
            border-top: 1px dashed #848484;
            margin: 24px 0 0 0;
            padding: 12px 0 0 0;
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
            {recruitmentThreads_id ? "編集する" : "投稿する"}
          </Button>

          {/* Close */}
          {recruitmentThreads_id && (
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
          )}
        </div>
      </form>
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

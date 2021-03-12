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
import shortid from "shortid";
import TextareaAutosize from "react-autosize-textarea";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";
import lodashMerge from "lodash/merge";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationHandleName } from "app/@validations/name.js";
import { validationBoolean } from "app/@validations/boolean.js";

import { validationCardPlayersStatus } from "app/@database/card-players/validations/status.js";
import { validationCardPlayersComment } from "app/@database/card-players/validations/comment.js";
import {
  validationCardPlayersAge,
  validationCardPlayersAgeAlternativeText,
} from "app/@database/card-players/validations/age.js";
import {
  validationCardPlayersSex,
  validationCardPlayersSexAlternativeText,
} from "app/@database/card-players/validations/sex.js";
import { validationCardPlayersAddressAlternativeText } from "app/@database/card-players/validations/address.js";
import {
  validationCardPlayersGamingExperience,
  validationCardPlayersGamingExperienceAlternativeText,
} from "app/@database/card-players/validations/gaming-experience.js";
import { validationCardPlayersHobby } from "app/@database/card-players/validations/hobby.js";
import { validationCardPlayersSpecialSkill } from "app/@database/card-players/validations/special-skill.js";
import {
  validationCardPlayersSmartphoneModel,
  validationCardPlayersSmartphoneComment,
} from "app/@database/card-players/validations/smartphone.js";
import {
  validationCardPlayersTabletModel,
  validationCardPlayersTabletComment,
} from "app/@database/card-players/validations/tablet.js";
import {
  validationCardPlayersPCModel,
  validationCardPlayersPCComment,
  validationCardPlayersPCSpec,
} from "app/@database/card-players/validations/pc.js";
import { validationCardPlayersActivityTimeArr } from "app/@database/card-players/validations/activity-time.js";
import {
  validationCardPlayersLookingForFriendsValue,
  validationCardPlayersLookingForFriendsIcon,
  validationCardPlayersLookingForFriendsComment,
} from "app/@database/card-players/validations/looking-for-friends.js";
import {
  validationCardPlayersVoiceChatValue,
  validationCardPlayersVoiceChatComment,
} from "app/@database/card-players/validations/voice-chat.js";
import { validationCardPlayersLinkArr } from "app/@database/card-players/validations/link.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormImageAndVideo from "app/common/image-and-video/v2/form.js";

import FormNameStatus from "app/common/card/v2/form/name-status.js";
import FormAge from "app/common/card/v2/form/age.js";
import FormSex from "app/common/card/v2/form/sex.js";
import FormAddress from "app/common/card/v2/form/address.js";
import FormGamingExperience from "app/common/card/v2/form/gaming-experience.js";
import FormHobby from "app/common/card/v2/form/hobby.js";
import FormSpecialSkill from "app/common/card/v2/form/special-skill.js";
import FormSmartphone from "app/common/card/v2/form/smartphone.js";
import FormTablet from "app/common/card/v2/form/tablet.js";
import FormPC from "app/common/card/v2/form/pc.js";
import FormHardwareActive from "app/common/card/v2/form/hardware-active.js";
import FormHardwareInactive from "app/common/card/v2/form/hardware-inactive.js";
import FormID from "app/common/card/v2/form/id.js";
import FormActivityTime from "app/common/card/v2/form/activity-time.js";
import FormLookingForFriends from "app/common/card/v2/form/looking-for-friends.js";
import FormVoiceChat from "app/common/card/v2/form/voice-chat.js";
import FormLink from "app/common/card/v2/form/link.js";

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

const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const {
    cardPlayers_id,
    setShowForm,
    cardPlayersObj,
    setCardPlayersObj,
  } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    setHeaderObj,
    handleLoadingOpen,
    handleLoadingClose,
    handleScrollTo,
  } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  const [imagesAndVideosObj, setImagesAndVideosObj] = useState({
    _id: "",
    createdDate: "",
    updatedDate: "",
    users_id: "",
    type: "ur",
    arr: [],
  });

  const [
    imagesAndVideosThumbnailObj,
    setImagesAndVideosThumbnailObj,
  ] = useState({
    _id: "",
    createdDate: "",
    updatedDate: "",
    users_id: "",
    type: "ur",
    arr: [],
  });

  const [age, setAge] = useState("");
  const [ageAlternativeText, setAgeAlternativeText] = useState("");
  const [sex, setSex] = useState("");
  const [sexAlternativeText, setSexAlternativeText] = useState("");
  const [addressAlternativeText, setAddressAlternativeText] = useState("");
  const [gamingExperience, setGamingExperience] = useState("");
  const [
    gamingExperienceAlternativeText,
    setGamingExperienceAlternativeText,
  ] = useState("");
  const [hobbiesArr, setHobbiesArr] = useState([""]);
  const [specialSkillsArr, setSpecialSkillsArr] = useState([""]);
  const [smartphoneModel, setSmartphoneModel] = useState("");
  const [smartphoneComment, setSmartphoneComment] = useState("");
  const [tabletModel, setTabletModel] = useState("");
  const [tabletComment, setTabletComment] = useState("");
  const [pcModel, setPCModel] = useState("");
  const [pcComment, setPCComment] = useState("");
  const [pcSpecsObj, setPCSpecsObj] = useState({
    os: "",
    cpu: "",
    cpuCooler: "",
    motherboard: "",
    memory: "",
    storage: "",
    graphicsCard: "",
    opticalDrive: "",
    powerSupply: "",
    pcCase: "",
    monitor: "",
    mouse: "",
    keyboard: "",
  });

  const [hardwareActiveArr, setHardwareActiveArr] = useState([]);
  const [hardwareInactiveArr, setHardwareInactiveArr] = useState([]);
  const [idsArr, setIDsArr] = useState([]);
  const [activityTimeArr, setActivityTimeArr] = useState([
    {
      _id: shortid.generate(),
      beginTime: "",
      endTime: "",
      weekArr: [],
    },
  ]);

  const [lookingForFriends, setLookingForFriends] = useState(true);
  const [lookingForFriendsIcon, setLookingForFriendsIcon] = useState(
    "emoji_u1f603"
  );
  const [lookingForFriendsComment, setLookingForFriendsComment] = useState("");
  const [voiceChat, setVoiceChat] = useState(true);
  const [voiceChatComment, setVoiceChatComment] = useState("");
  const [linkArr, setLinkArr] = useState([
    {
      _id: shortid.generate(),
      type: "Other",
      label: "",
      url: "",
    },
  ]);

  const [search, setSearch] = useState(true);

  useEffect(() => {
    // --------------------------------------------------
    //   Button Enable
    // --------------------------------------------------

    setButtonDisabled(false);

    // --------------------------------------------------
    //   編集用データを読み込む
    // --------------------------------------------------

    if (cardPlayers_id) {
      handleGetEditData();
    }
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 編集用データを読み込む
   */
  const handleGetEditData = async () => {
    try {
      // ---------------------------------------------
      //   cardPlayers_id が存在しない場合エラー
      // ---------------------------------------------

      if (!cardPlayers_id) {
        throw new CustomError({
          errorsArr: [{ code: "yYI5YlDcS", messageID: "Error" }],
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
        to: cardPlayers_id,
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        cardPlayers_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/card-players/get-edit-data`,
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
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Set Form Data
      // ---------------------------------------------

      const dataObj = lodashGet(resultObj, ["data"], {});

      const name = lodashGet(dataObj, ["name"], "");
      const status = lodashGet(dataObj, ["status"], "");
      const comment = lodashGet(dataObj, ["comment"], "");

      let imagesAndVideosObj = lodashGet(dataObj, ["imagesAndVideosObj"], {});

      if (Object.keys(imagesAndVideosObj).length === 0) {
        imagesAndVideosObj = {
          _id: "",
          createdDate: "",
          updatedDate: "",
          users_id: "",
          type: "ur",
          arr: [],
        };
      }

      let imagesAndVideosThumbnailObj = lodashGet(
        dataObj,
        ["imagesAndVideosThumbnailObj"],
        {}
      );

      if (Object.keys(imagesAndVideosThumbnailObj).length === 0) {
        imagesAndVideosThumbnailObj = {
          _id: "",
          createdDate: "",
          updatedDate: "",
          users_id: "",
          type: "ur",
          arr: [],
        };
      }

      const age = lodashGet(dataObj, ["age"], "");
      const ageAlternativeText = lodashGet(dataObj, ["ageAlternativeText"], "");
      const sex = lodashGet(dataObj, ["sex"], "");
      const sexAlternativeText = lodashGet(dataObj, ["sexAlternativeText"], "");
      const addressAlternativeText = lodashGet(
        dataObj,
        ["addressAlternativeText"],
        ""
      );

      const gamingExperience = lodashGet(dataObj, ["gamingExperience"], "");
      const gamingExperienceAlternativeText = lodashGet(
        dataObj,
        ["gamingExperienceAlternativeText"],
        ""
      );
      const hobbiesArr = lodashGet(dataObj, ["hobbiesArr"], []);
      const specialSkillsArr = lodashGet(dataObj, ["specialSkillsArr"], []);
      const smartphoneModel = lodashGet(dataObj, ["smartphoneModel"], "");
      const smartphoneComment = lodashGet(dataObj, ["smartphoneComment"], "");

      const tabletModel = lodashGet(dataObj, ["tabletModel"], "");
      const tabletComment = lodashGet(dataObj, ["tabletComment"], "");
      const pcModel = lodashGet(dataObj, ["pcModel"], "");
      const pcComment = lodashGet(dataObj, ["pcComment"], "");
      const pcSpecsObj = lodashGet(dataObj, ["pcSpecsObj"], {
        os: "",
        cpu: "",
        cpuCooler: "",
        motherboard: "",
        memory: "",
        storage: "",
        graphicsCard: "",
        opticalDrive: "",
        powerSupply: "",
        pcCase: "",
        monitor: "",
        mouse: "",
        keyboard: "",
      });

      const hardwareActiveArr = lodashGet(dataObj, ["hardwareActiveArr"], []);
      const hardwareInactiveArr = lodashGet(
        dataObj,
        ["hardwareInactiveArr"],
        []
      );
      const idsArr = lodashGet(dataObj, ["idsArr"], []);
      const activityTimeArr = lodashGet(
        dataObj,
        ["activityTimeArr"],
        [
          {
            _id: shortid.generate(),
            beginTime: "",
            endTime: "",
            weekArr: [],
          },
        ]
      );

      const lookingForFriends = lodashGet(dataObj, ["lookingForFriends"], true);
      const lookingForFriendsIcon = lodashGet(
        dataObj,
        ["lookingForFriendsIcon"],
        "emoji_u1f603"
      );
      const lookingForFriendsComment = lodashGet(
        dataObj,
        ["lookingForFriendsComment"],
        ""
      );
      const voiceChat = lodashGet(dataObj, ["voiceChat"], true);
      const voiceChatComment = lodashGet(dataObj, ["voiceChatComment"], "");

      const linkArr = lodashGet(
        dataObj,
        ["linkArr"],
        [
          {
            _id: shortid.generate(),
            type: "Other",
            label: "",
            url: "",
          },
        ]
      );

      const search = lodashGet(dataObj, ["search"], true);

      setName(name);
      setStatus(status);
      setComment(comment);
      setImagesAndVideosObj(imagesAndVideosObj);
      setImagesAndVideosThumbnailObj(imagesAndVideosThumbnailObj);
      setAge(age);
      setAgeAlternativeText(ageAlternativeText);
      setSex(sex);
      setSexAlternativeText(sexAlternativeText);
      setAddressAlternativeText(addressAlternativeText);
      setGamingExperience(gamingExperience);
      setGamingExperienceAlternativeText(gamingExperienceAlternativeText);
      setHobbiesArr(hobbiesArr);
      setSpecialSkillsArr(specialSkillsArr);
      setSmartphoneModel(smartphoneModel);
      setSmartphoneComment(smartphoneComment);
      setTabletModel(tabletModel);
      setTabletComment(tabletComment);
      setPCModel(pcModel);
      setPCComment(pcComment);
      setPCSpecsObj(pcSpecsObj);
      setHardwareActiveArr(hardwareActiveArr);
      setHardwareInactiveArr(hardwareInactiveArr);
      setIDsArr(idsArr);
      setActivityTimeArr(activityTimeArr);
      setLookingForFriends(lookingForFriends);
      setLookingForFriendsIcon(lookingForFriendsIcon);
      setLookingForFriendsComment(lookingForFriendsComment);
      setVoiceChat(voiceChat);
      setVoiceChatComment(voiceChatComment);
      setLinkArr(linkArr);
      setSearch(search);

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/card/v2/components/parts/edit-button.js - handleGetEditData
      // `);

      // console.log(chalk`
      //   cardPlayers_id: {green ${cardPlayers_id}}
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
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();
    }
  };

  /**
   * フォームを送信する
   * @param {Object} eventObj - イベント
   */
  const handleSubmit = async ({ eventObj }) => {
    // ---------------------------------------------
    //   フォームの送信処理停止
    // ---------------------------------------------

    eventObj.preventDefault();

    try {
      // ---------------------------------------------
      //   _id が存在しない場合エラー
      // ---------------------------------------------

      if (!cardPlayers_id) {
        throw new CustomError({
          errorsArr: [{ code: "TlbdVZVuk", messageID: "1YJnibkmh" }],
        });
      }

      // ---------------------------------------------
      //   Validation Error
      // ---------------------------------------------

      if (
        validationHandleName({ value: name }).error ||
        validationCardPlayersStatus({ value: status }).error ||
        validationCardPlayersComment({ value: comment }).error ||
        validationCardPlayersAge({ value: age }).error ||
        validationCardPlayersAgeAlternativeText({ value: ageAlternativeText })
          .error ||
        validationCardPlayersSex({ value: sex }).error ||
        validationCardPlayersSexAlternativeText({ value: sexAlternativeText })
          .error ||
        validationCardPlayersAddressAlternativeText({
          value: addressAlternativeText,
        }).error ||
        validationCardPlayersGamingExperience({ value: gamingExperience })
          .error ||
        validationCardPlayersGamingExperienceAlternativeText({
          value: gamingExperienceAlternativeText,
        }).error ||
        validationCardPlayersHobby({ valueArr: hobbiesArr }).error ||
        validationCardPlayersSpecialSkill({ valueArr: specialSkillsArr })
          .error ||
        validationCardPlayersSmartphoneModel({ value: smartphoneModel })
          .error ||
        validationCardPlayersSmartphoneComment({ value: smartphoneComment })
          .error ||
        validationCardPlayersTabletModel({ value: tabletModel }).error ||
        validationCardPlayersTabletComment({ value: tabletComment }).error ||
        validationCardPlayersPCModel({ value: pcModel }).error ||
        validationCardPlayersPCComment({ value: pcComment }).error ||
        validationCardPlayersPCSpec({ valueObj: pcSpecsObj }).error ||
        validationCardPlayersActivityTimeArr({ valueArr: activityTimeArr })
          .error ||
        validationCardPlayersLookingForFriendsValue({
          value: lookingForFriends,
        }).error ||
        validationCardPlayersLookingForFriendsComment({
          value: lookingForFriendsComment,
        }).error ||
        validationCardPlayersLookingForFriendsIcon({
          value: lookingForFriendsIcon,
        }).error ||
        validationCardPlayersVoiceChatValue({ value: voiceChat }).error ||
        validationCardPlayersVoiceChatComment({ value: voiceChatComment })
          .error ||
        validationCardPlayersLinkArr({ valueArr: linkArr }).error ||
        validationBoolean({ value: search }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "g5D-Ev10X", messageID: "uwHIKBy7c" }],
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
        _id: cardPlayers_id,
        name,
        status,
        comment,
        age,
        ageAlternativeText,
        sex,
        sexAlternativeText,
        addressAlternativeText,
        gamingExperience,
        gamingExperienceAlternativeText,
        hobbiesArr,
        specialSkillsArr,
        smartphoneModel,
        smartphoneComment,
        tabletModel,
        tabletComment,
        pcModel,
        pcComment,
        pcSpecsObj,
        hardwareActiveArr,
        hardwareInactiveArr,
        idsArr,
        activityTimeArr,
        lookingForFriends,
        lookingForFriendsIcon,
        lookingForFriendsComment,
        voiceChat,
        voiceChatComment,
        linkArr,
        search,
      };

      if (Object.keys(imagesAndVideosObj).length !== 0) {
        formDataObj.imagesAndVideosObj = imagesAndVideosObj;
      }

      if (Object.keys(imagesAndVideosThumbnailObj).length !== 0) {
        formDataObj.imagesAndVideosThumbnailObj = imagesAndVideosThumbnailObj;
      }

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/card-players/upsert`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Update - cardPlayersObj
      // ---------------------------------------------

      const cardPlayersMergedObj = lodashMerge(
        cardPlayersObj,
        lodashGet(resultObj, ["data", "cardPlayersObj"], {})
      );
      setCardPlayersObj(cardPlayersMergedObj);

      // ---------------------------------------------
      //   Update - Header
      // ---------------------------------------------

      const headerObj = lodashGet(resultObj, ["data", "headerObj"], {});

      if (Object.keys(headerObj).length !== 0) {
        setHeaderObj(headerObj);
      }

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
        arr: [
          {
            variant: "success",
            messageID: "EnStWOly-",
          },
        ],
      });

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/card/v2/components/form-card-player.js - handleSubmit
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
      //   ----- formDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(formDataObj)), { colors: true, depth: null })}\n
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

      setShowForm(false);

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to: cardPlayers_id,
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
      to: cardPlayers_id,
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
    process.env.NEXT_PUBLIC_CARD_PLAYER_IMAGES_AND_VIDEOS_LIMIT,
    10
  );
  const limitImagesAndVideosThumbnail = parseInt(
    process.env.NEXT_PUBLIC_CARD_PLAYER_IMAGES_AND_VIDEOS_THUMBNAIL_LIMIT,
    10
  );

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/card/v2/components/form-card-player.js
  // `);

  // console.log(chalk`
  //   login: {green ${login}}
  // `);

  // console.log(`
  //   ----- loginUsersObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(loginUsersObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(`
  //   ----- followsObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(followsObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <form
      css={css`
        padding: 20px 16px 16px;
      `}
      name={`form-${cardPlayers_id}`}
      onSubmit={(eventObj) =>
        handleSubmit({
          eventObj,
        })
      }
    >
      <h2
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        プレイヤーカード
      </h2>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        プレイヤーカードとは、Game Users
        内で基本的なプロフィールとして扱われるデータです。あなたがどんなゲームプレイヤーなのか知ってもらう情報になります。
      </p>

      <p
        css={css`
          margin: 0 0 24px 0;
        `}
      >
        ハンドルネームとステータスは必ず入力してください。それ以外の項目は空欄でも問題ありません。
      </p>

      {/* ハンドルネーム＆ステータス */}
      <div css={cssBox}>
        <FormNameStatus
          name={name}
          setName={setName}
          status={status}
          setStatus={setStatus}
        />
      </div>

      {/* Form Images & Videos - Main */}
      <div css={cssBox}>
        <h3
          css={css`
            margin: 0 0 6px 0;
          `}
        >
          メイン画像
        </h3>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          プレイヤーカードのトップに表示される大きな画像です。横長の画像（推奨サイズ
          1920 x ---）をアップロードしてください。
        </p>

        <FormImageAndVideo
          showVideoButton={false}
          descriptionImage="横長の大きな画像をアップロードしてください。"
          showImageCaption={true}
          limit={limitImagesAndVideos}
          imagesAndVideosObj={imagesAndVideosObj}
          setImagesAndVideosObj={setImagesAndVideosObj}
        />
      </div>

      {/* Form Images & Videos - Thumbnail */}
      <div css={cssBox}>
        <h3
          css={css`
            margin: 0 0 6px 0;
          `}
        >
          サムネイル画像
        </h3>

        <p
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          ハンドルネームの左側に表示される小さな画像です。正方形の画像（推奨サイズ
          256 x 256 ピクセル以上）をアップロードしてください。
        </p>

        <FormImageAndVideo
          showVideoButton={false}
          descriptionImage="サムネイル画像をアップロードできます。"
          showImageCaption={true}
          limit={limitImagesAndVideosThumbnail}
          imagesAndVideosObj={imagesAndVideosThumbnailObj}
          setImagesAndVideosObj={setImagesAndVideosThumbnailObj}
        />
      </div>

      {/* Comment */}
      <div css={cssBox}>
        <h3
          css={css`
            margin: 0 0 12px 0;
          `}
        >
          コメント
        </h3>

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
          placeholder="コメントを入力してください。"
          value={comment}
          maxLength={3000}
          disabled={buttonDisabled}
          onChange={(eventObj) => setComment(eventObj.target.value)}
        />
      </div>

      {/* 年齢 */}
      <div css={cssBox}>
        <FormAge
          age={age}
          setAge={setAge}
          ageAlternativeText={ageAlternativeText}
          setAgeAlternativeText={setAgeAlternativeText}
        />
      </div>

      {/* 性別 */}
      <div css={cssBox}>
        <FormSex
          sex={sex}
          setSex={setSex}
          sexAlternativeText={sexAlternativeText}
          setSexAlternativeText={setSexAlternativeText}
        />
      </div>

      {/* 住所 */}
      <div css={cssBox}>
        <FormAddress
          addressAlternativeText={addressAlternativeText}
          setAddressAlternativeText={setAddressAlternativeText}
        />
      </div>

      {/* ゲーム歴 */}
      <div css={cssBox}>
        <FormGamingExperience
          gamingExperience={gamingExperience}
          setGamingExperience={setGamingExperience}
          gamingExperienceAlternativeText={gamingExperienceAlternativeText}
          setGamingExperienceAlternativeText={
            setGamingExperienceAlternativeText
          }
        />
      </div>

      {/* 趣味 */}
      <div css={cssBox}>
        <FormHobby hobbiesArr={hobbiesArr} setHobbiesArr={setHobbiesArr} />
      </div>

      {/* 特技 */}
      <div css={cssBox}>
        <FormSpecialSkill
          specialSkillsArr={specialSkillsArr}
          setSpecialSkillsArr={setSpecialSkillsArr}
        />
      </div>

      {/* スマートフォン */}
      <div css={cssBox}>
        <FormSmartphone
          smartphoneModel={smartphoneModel}
          setSmartphoneModel={setSmartphoneModel}
          smartphoneComment={smartphoneComment}
          setSmartphoneComment={setSmartphoneComment}
        />
      </div>

      {/* タブレット */}
      <div css={cssBox}>
        <FormTablet
          tabletModel={tabletModel}
          setTabletModel={setTabletModel}
          tabletComment={tabletComment}
          setTabletComment={setTabletComment}
        />
      </div>

      {/* PC */}
      <div css={cssBox}>
        <FormPC
          pcModel={pcModel}
          setPCModel={setPCModel}
          pcComment={pcComment}
          setPCComment={setPCComment}
          pcSpecsObj={pcSpecsObj}
          setPCSpecsObj={setPCSpecsObj}
        />
      </div>

      {/* 所有ハードウェア */}
      <div css={cssBox}>
        <FormHardwareActive
          hardwaresArr={hardwareActiveArr}
          setHardwaresArr={setHardwareActiveArr}
        />
      </div>

      {/* 昔、所有していたハードウェア */}
      <div css={cssBox}>
        <FormHardwareInactive
          hardwaresArr={hardwareInactiveArr}
          setHardwaresArr={setHardwareInactiveArr}
        />
      </div>

      {/* ID */}
      <div css={cssBox}>
        <FormID idsArr={idsArr} setIDsArr={setIDsArr} />
      </div>

      {/* 活動時間 */}
      <div css={cssBox}>
        <FormActivityTime
          activityTimeArr={activityTimeArr}
          setActivityTimeArr={setActivityTimeArr}
        />
      </div>

      {/* フレンド */}
      <div css={cssBox}>
        <FormLookingForFriends
          lookingForFriends={lookingForFriends}
          setLookingForFriends={setLookingForFriends}
          lookingForFriendsIcon={lookingForFriendsIcon}
          setLookingForFriendsIcon={setLookingForFriendsIcon}
          lookingForFriendsComment={lookingForFriendsComment}
          setLookingForFriendsComment={setLookingForFriendsComment}
        />
      </div>

      {/* ボイスチャット */}
      <div css={cssBox}>
        <FormVoiceChat
          voiceChat={voiceChat}
          setVoiceChat={setVoiceChat}
          voiceChatComment={voiceChatComment}
          setVoiceChatComment={setVoiceChatComment}
        />
      </div>

      {/* Link */}
      <div css={cssBox}>
        <FormLink linkArr={linkArr} setLinkArr={setLinkArr} />
      </div>

      {/* 検索 */}
      <div css={cssBox}>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={search}
                onChange={(eventObj) => setSearch(eventObj.target.checked)}
              />
            }
            label="プレイヤーカードを検索可能にする"
          />
        </div>
      </div>

      {/* Buttons */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          border-top: 1px dashed #848484;
          margin: 24px 0 0 0;
          padding: 36px 0 0 0;
        `}
      >
        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={buttonDisabled}
        >
          {cardPlayers_id ? "編集する" : "投稿する"}
        </Button>

        {/* Close */}
        {cardPlayers_id && (
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
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

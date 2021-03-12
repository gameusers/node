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
import { Element } from "react-scroll";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Paragraph from "app/common/layout/v2/paragraph.js";
import User from "app/common/user/v2/user.js";
import ImageAndVideo from "app/common/image-and-video/v2/image-and-video.js";
import FollowButton from "app/common/follow/v2/follow-button.js";

import Profile from "app/common/card/v2/parts/profile.js";
import Hardware from "app/common/card/v2/parts/hardware.js";
import Smartphone from "app/common/card/v2/parts/smartphone.js";
import Tablet from "app/common/card/v2/parts/tablet.js";
import Pc from "app/common/card/v2/parts/pc.js";
import ID from "app/common/card/v2/parts/id.js";
import ActivityTime from "app/common/card/v2/parts/activity-time.js";
import LookingForFriend from "app/common/card/v2/parts/looking-for-friends.js";
import VoiceChat from "app/common/card/v2/parts/voice-chat.js";
import Link from "app/common/card/v2/parts/link.js";
import EditButton from "app/common/card/v2/parts/edit-button.js";

import Form from "app/common/card/v2/form-card-player.js";

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
    obj = {},
    showFollowButton = true,
    showEditButton = true,
    defaultExpanded = true,
    cardPlayersObj,
    setCardPlayersObj,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const [panelExpanded, setPanelExpanded] = useState(defaultExpanded);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   カードデータが存在しない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (Object.keys(obj).length === 0) {
    return null;
  }

  // --------------------------------------------------
  //   _id
  // --------------------------------------------------

  const cardPlayers_id = lodashGet(obj, ["_id"], "");
  const users_id = lodashGet(obj, ["users_id"], "");

  // ---------------------------------------------
  //   User
  // ---------------------------------------------

  const name = lodashGet(obj, ["name"], "");
  const status = lodashGet(obj, ["status"], "");
  const comment = lodashGet(obj, ["comment"], "");

  const exp = lodashGet(obj, ["usersObj", "exp"], 0);
  const accessDate = lodashGet(obj, ["usersObj", "accessDate"], "");
  const userID = lodashGet(obj, ["usersObj", "userID"], "");

  // --------------------------------------------------
  //   Images and Videos
  // --------------------------------------------------

  const imagesAndVideosObj = lodashGet(obj, ["imagesAndVideosObj"], {});
  const imagesAndVideosThumbnailObj = lodashGet(
    obj,
    ["imagesAndVideosThumbnailObj"],
    {}
  );

  // ---------------------------------------------
  //   Profile
  // ---------------------------------------------

  const ageValue = lodashGet(obj, ["age"], "");
  const ageAlternativeText = lodashGet(obj, ["ageAlternativeText"], "");
  const sexValue = lodashGet(obj, ["sex"], "");
  const sexAlternativeText = lodashGet(obj, ["sexAlternativeText"], "");
  const addressAlternativeText = lodashGet(obj, ["addressAlternativeText"], "");
  const gamingExperienceValue = lodashGet(obj, ["gamingExperience"], "");
  const gamingExperienceAlternativeText = lodashGet(
    obj,
    ["gamingExperienceAlternativeText"],
    ""
  );
  const hobbiesValueArr = lodashGet(obj, ["hobbiesArr"], []);
  const specialSkillsValueArr = lodashGet(obj, ["specialSkillsArr"], []);

  // ---------------------------------------------
  //   Hardware
  // ---------------------------------------------

  const hardwareActiveArr = lodashGet(obj, ["hardwareActiveArr"], []);
  const hardwareInactiveArr = lodashGet(obj, ["hardwareInactiveArr"], []);

  // ---------------------------------------------
  //   Smartphone
  // ---------------------------------------------

  const smartphoneModel = lodashGet(obj, ["smartphoneModel"], "");
  const smartphoneComment = lodashGet(obj, ["smartphoneComment"], "");

  // ---------------------------------------------
  //   Tablet
  // ---------------------------------------------

  const tabletModel = lodashGet(obj, ["tabletModel"], "");
  const tabletComment = lodashGet(obj, ["tabletComment"], "");

  // ---------------------------------------------
  //   PC
  // ---------------------------------------------

  const pcModel = lodashGet(obj, ["pcModel"], "");
  const pcComment = lodashGet(obj, ["pcComment"], "");
  const pcOs = lodashGet(obj, ["pcSpecsObj", "os"], "");
  const pcCpu = lodashGet(obj, ["pcSpecsObj", "cpu"], "");
  const pcCpuCooler = lodashGet(obj, ["pcSpecsObj", "cpuCooler"], "");
  const pcMotherboard = lodashGet(obj, ["pcSpecsObj", "motherboard"], "");
  const pcMemory = lodashGet(obj, ["pcSpecsObj", "memory"], "");
  const pcStorage = lodashGet(obj, ["pcSpecsObj", "storage"], "");
  const pcGraphicsCard = lodashGet(obj, ["pcSpecsObj", "graphicsCard"], "");
  const pcOpticalDrive = lodashGet(obj, ["pcSpecsObj", "opticalDrive"], "");
  const pcPowerSupply = lodashGet(obj, ["pcSpecsObj", "powerSupply"], "");
  const pcCase = lodashGet(obj, ["pcSpecsObj", "pcCase"], "");
  const pcMonitor = lodashGet(obj, ["pcSpecsObj", "monitor"], "");
  const pcMouse = lodashGet(obj, ["pcSpecsObj", "mouse"], "");
  const pcKeyboard = lodashGet(obj, ["pcSpecsObj", "keyboard"], "");

  // ---------------------------------------------
  //   ID
  // ---------------------------------------------

  const idsArr = lodashGet(obj, ["idsArr"], []);

  // ---------------------------------------------
  //   活動時間
  // ---------------------------------------------

  const activityTimeArr = lodashGet(obj, ["activityTimeArr"], []);

  // ---------------------------------------------
  //   フレンド募集
  // ---------------------------------------------

  const lookingForFriendsValue = lodashGet(obj, ["lookingForFriends"], "");
  const lookingForFriendsIcon = lodashGet(obj, ["lookingForFriendsIcon"], "");
  const lookingForFriendsComment = lodashGet(
    obj,
    ["lookingForFriendsComment"],
    ""
  );

  // ---------------------------------------------
  //   ボイスチャット
  // ---------------------------------------------

  const voiceChatValue = lodashGet(obj, ["voiceChat"], "");
  const voiceChatComment = lodashGet(obj, ["voiceChatComment"], "");

  // ---------------------------------------------
  //   Link
  // ---------------------------------------------

  const linkArr = lodashGet(obj, ["linkArr"], []);

  // --------------------------------------------------
  //   Follow
  // --------------------------------------------------

  const followsObj = lodashGet(obj, ["followsObj"], {});

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/card/v2/components/card-player.js
  // `);

  // console.log(`
  //   ----- obj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(obj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // console.log(chalk`
  //   showEditButton: {green ${showEditButton}}
  //   defaultExpanded: {green ${defaultExpanded}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name={cardPlayers_id}>
      <Card>
        {showForm ? (
          // 編集フォーム

          <Form
            cardPlayers_id={cardPlayers_id}
            setShowForm={setShowForm}
            cardPlayersObj={cardPlayersObj}
            setCardPlayersObj={setCardPlayersObj}
          />
        ) : (
          // プレイヤーカード

          <React.Fragment>
            <div
              css={css`
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                margin: 0;
                padding: 12px 4px 12px 12px;
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
              />

              {/* 右上に設置されているパネル開閉用のボタン */}
              <div
                css={css`
                  margin: 0 0 0 auto;
                `}
              >
                <IconButton
                  aria-expanded={panelExpanded}
                  aria-label="Show more"
                  disabled={buttonDisabled}
                  onClick={() => setPanelExpanded(!panelExpanded)}
                >
                  {panelExpanded ? <IconExpandLess /> : <IconExpandMore />}
                </IconButton>
              </div>
            </div>

            {/* カードのコンテンツ - 折り畳まれる部分 */}
            <Collapse in={panelExpanded} timeout="auto">
              {/* Big Image */}
              <ImageAndVideo
                imagesAndVideosObj={imagesAndVideosObj}
                // setMaxHeight={false}
              />

              {/* Contents */}
              <CardContent
                css={css`
                  && {
                    font-size: 14px;
                    padding-bottom: 16px !important;

                    ${Object.keys(imagesAndVideosObj).length === 0 &&
                    `border-top: 1px dashed;
                         border-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.50), rgba(0,0,0,0));
                         border-image-slice: 1;`}
                  }
                `}
              >
                {/* コメント */}
                <Paragraph text={comment} />

                {/* 年齢・性別などのプロフィール */}
                <Profile
                  ageValue={ageValue}
                  ageAlternativeText={ageAlternativeText}
                  sexValue={sexValue}
                  sexAlternativeText={sexAlternativeText}
                  addressAlternativeText={addressAlternativeText}
                  gamingExperienceValue={gamingExperienceValue}
                  gamingExperienceAlternativeText={
                    gamingExperienceAlternativeText
                  }
                  hobbiesValueArr={hobbiesValueArr}
                  specialSkillsValueArr={specialSkillsValueArr}
                />

                {/* 所有ハード */}
                <Hardware
                  hardwareActiveArr={hardwareActiveArr}
                  hardwareInactiveArr={hardwareInactiveArr}
                />

                {/* スマートフォン */}
                <Smartphone
                  smartphoneModel={smartphoneModel}
                  smartphoneComment={smartphoneComment}
                />

                {/* タブレット */}
                <Tablet
                  tabletModel={tabletModel}
                  tabletComment={tabletComment}
                />

                {/* PC */}
                <Pc
                  pcModel={pcModel}
                  pcComment={pcComment}
                  pcOs={pcOs}
                  pcCpu={pcCpu}
                  pcCpuCooler={pcCpuCooler}
                  pcMotherboard={pcMotherboard}
                  pcMemory={pcMemory}
                  pcStorage={pcStorage}
                  pcGraphicsCard={pcGraphicsCard}
                  pcOpticalDrive={pcOpticalDrive}
                  pcPowerSupply={pcPowerSupply}
                  pcCase={pcCase}
                  pcMonitor={pcMonitor}
                  pcMouse={pcMouse}
                  pcKeyboard={pcKeyboard}
                />

                {/* ID */}
                <ID arr={idsArr} />

                {/* 活動時間 */}
                <ActivityTime arr={activityTimeArr} />

                {/* フレンド募集 */}
                <LookingForFriend
                  value={lookingForFriendsValue}
                  icon={lookingForFriendsIcon}
                  comment={lookingForFriendsComment}
                />

                {/* ボイスチャット */}
                <VoiceChat value={voiceChatValue} comment={voiceChatComment} />

                {/* Link */}
                <Link arr={linkArr} />

                {/* Follow Button */}
                {showFollowButton && (
                  <FollowButton
                    type="cardPlayer"
                    users_id={users_id}
                    followsObj={followsObj}
                  />
                )}

                {/* 編集ボタン */}
                {showEditButton && (
                  <EditButton users_id={users_id} setShowForm={setShowForm} />
                )}
              </CardContent>
            </Collapse>
          </React.Fragment>
        )}
      </Card>
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

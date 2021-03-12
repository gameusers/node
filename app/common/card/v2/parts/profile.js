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

import moment from "moment";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconPerson from "@material-ui/icons/Person";

// ---------------------------------------------
//   Moment Locale
// ---------------------------------------------

moment.locale("ja");

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssItem = css`
  margin: 0 20px 0 0;

  @media screen and (max-width: 480px) {
    margin: 0;
  }
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
    ageValue,
    ageAlternativeText,
    sexValue,
    sexAlternativeText,
    addressAlternativeText,
    gamingExperienceValue,
    gamingExperienceAlternativeText,
    hobbiesValueArr,
    specialSkillsValueArr,
  } = props;

  // --------------------------------------------------
  //   情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (
    !ageValue &&
    !ageAlternativeText &&
    !sexValue &&
    !sexAlternativeText &&
    !addressAlternativeText &&
    !gamingExperienceValue &&
    !gamingExperienceAlternativeText &&
    !hobbiesValueArr &&
    !specialSkillsValueArr
  ) {
    return null;
  }

  // --------------------------------------------------
  //   Component - プロフィール項目（年齢、性別など）
  // --------------------------------------------------

  const componentsArr = [];

  // ---------------------------------------------
  //   - 年齢
  // ---------------------------------------------

  let age = "";

  if (ageAlternativeText) {
    age = ageAlternativeText;
  } else if (ageValue) {
    age = `${moment().diff(ageValue, "years")}歳`;
  }

  if (age) {
    componentsArr.push(
      <div css={cssItem} key="age">
        <strong>年齢:</strong> {age}
      </div>
    );
  }

  // ---------------------------------------------
  //   - 性別
  // ---------------------------------------------

  let sex = "";

  if (sexAlternativeText) {
    sex = sexAlternativeText;
  } else if (sexValue === "male") {
    sex = "男";
  } else if (sexValue === "female") {
    sex = "女";
  }

  if (sex) {
    componentsArr.push(
      <div css={cssItem} key="sex">
        <strong>性別:</strong> {sex}
      </div>
    );
  }

  // ---------------------------------------------
  //   - 住所
  // ---------------------------------------------

  if (addressAlternativeText) {
    componentsArr.push(
      <div css={cssItem} key="address">
        <strong>住所:</strong> {addressAlternativeText}
      </div>
    );
  }

  // ---------------------------------------------
  //   - ゲーム歴
  // ---------------------------------------------

  let gamingExperience = "";

  if (gamingExperienceAlternativeText) {
    gamingExperience = gamingExperienceAlternativeText;
  } else if (gamingExperienceValue) {
    gamingExperience = `${moment(gamingExperienceValue).fromNow(true)}`;
  }

  if (gamingExperience) {
    componentsArr.push(
      <div css={cssItem} key="gamingExperience">
        <strong>ゲーム歴:</strong> {gamingExperience}
      </div>
    );
  }

  // ---------------------------------------------
  //   - 趣味
  // ---------------------------------------------

  if (Array.isArray(hobbiesValueArr) && hobbiesValueArr.length > 0) {
    componentsArr.push(
      <div css={cssItem} key="hobbie">
        <strong>趣味:</strong> {hobbiesValueArr.join(" / ")}
      </div>
    );
  }

  // ---------------------------------------------
  //   - 特技
  // ---------------------------------------------

  if (
    Array.isArray(specialSkillsValueArr) &&
    specialSkillsValueArr.length > 0
  ) {
    componentsArr.push(
      <div css={cssItem} key="specialSkills">
        <strong>特技:</strong> {specialSkillsValueArr.join(" / ")}
      </div>
    );
  }

  // ---------------------------------------------
  //   Component
  // ---------------------------------------------

  let component = "";

  if (componentsArr.length > 0) {
    component = (
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 4px 0 0 0;

          @media screen and (max-width: 480px) {
            flex-flow: column wrap;
          }
        `}
      >
        {componentsArr}
      </div>
    );
  } else {
    return null;
  }

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        border-top: 1px dashed #a4a4a4;
        margin: 24px 0 0 0;
        padding: 24px 0 0 0;
      `}
    >
      {/* Heading */}
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        `}
      >
        <IconPerson
          css={css`
            && {
              font-size: 24px;
            }
          `}
        />

        <h3
          css={css`
            margin: 3px 0 0 4px;
          `}
        >
          プロフィール
        </h3>
      </div>

      {/* コンポーネント */}
      {component}
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconLaptopMac from "@material-ui/icons/LaptopMac";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Paragraph from "app/common/layout/v2/paragraph.js";

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
    pcModel,
    pcComment,
    pcOs,
    pcCpu,
    pcCpuCooler,
    pcMotherboard,
    pcMemory,
    pcStorage,
    pcGraphicsCard,
    pcOpticalDrive,
    pcPowerSupply,
    pcCase,
    pcMonitor,
    pcMouse,
    pcKeyboard,
  } = props;

  // --------------------------------------------------
  //   情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (
    !pcModel &&
    !pcComment &&
    !pcOs &&
    !pcCpu &&
    !pcCpuCooler &&
    !pcMotherboard &&
    !pcMemory &&
    !pcStorage &&
    !pcGraphicsCard &&
    !pcOpticalDrive &&
    !pcPowerSupply &&
    !pcCase &&
    !pcMonitor &&
    !pcMouse &&
    !pcKeyboard
  ) {
    return null;
  }

  // --------------------------------------------------
  //   Component - モデル
  // --------------------------------------------------

  let componentModel = "PC";

  if (pcModel) {
    componentModel = `PC: ${pcModel}`;
  }

  // --------------------------------------------------
  //   Component - コメント
  // --------------------------------------------------

  let componentComment = "";

  if (pcComment) {
    componentComment = (
      <div
        css={css`
          margin: 6px 0 0 0;
        `}
      >
        <Paragraph text={pcComment} />
      </div>
    );
  }

  // --------------------------------------------------
  //   Component - PCスペック
  // --------------------------------------------------

  const componentsArr = [];

  // ---------------------------------------------
  //   - OS
  // ---------------------------------------------

  if (pcOs) {
    componentsArr.push(
      <li key="os">
        <strong>OS:</strong> {pcOs}
      </li>
    );
  }

  // ---------------------------------------------
  //   - CPU
  // ---------------------------------------------

  if (pcCpu) {
    componentsArr.push(
      <li key="cpu">
        <strong>CPU:</strong> {pcCpu}
      </li>
    );
  }

  // ---------------------------------------------
  //   - CPU Cooler
  // ---------------------------------------------

  if (pcCpuCooler) {
    componentsArr.push(
      <li key="cpuCooler">
        <strong>CPUクーラー:</strong> {pcCpuCooler}
      </li>
    );
  }

  // ---------------------------------------------
  //   - マザーボード
  // ---------------------------------------------

  if (pcMotherboard) {
    componentsArr.push(
      <li key="motherboard">
        <strong>マザーボード:</strong> {pcMotherboard}
      </li>
    );
  }

  // ---------------------------------------------
  //   - メモリ
  // ---------------------------------------------

  if (pcMemory) {
    componentsArr.push(
      <li key="memory">
        <strong>メモリ:</strong> {pcMemory}
      </li>
    );
  }

  // ---------------------------------------------
  //   - ストレージ
  // ---------------------------------------------

  if (pcStorage) {
    componentsArr.push(
      <li key="storage">
        <strong>ストレージ:</strong> {pcStorage}
      </li>
    );
  }

  // ---------------------------------------------
  //   - グラフィックス
  // ---------------------------------------------

  if (pcGraphicsCard) {
    componentsArr.push(
      <li key="graphicsCard">
        <strong>グラフィックス:</strong> {pcGraphicsCard}
      </li>
    );
  }

  // ---------------------------------------------
  //   - 光学ドライブ
  // ---------------------------------------------

  if (pcOpticalDrive) {
    componentsArr.push(
      <li key="opticalDrive">
        <strong>光学ドライブ:</strong> {pcOpticalDrive}
      </li>
    );
  }

  // ---------------------------------------------
  //   - 電源
  // ---------------------------------------------

  if (pcPowerSupply) {
    componentsArr.push(
      <li key="powerSupply">
        <strong>電源:</strong> {pcPowerSupply}
      </li>
    );
  }

  // ---------------------------------------------
  //   - ケース
  // ---------------------------------------------

  if (pcCase) {
    componentsArr.push(
      <li key="pcCase">
        <strong>ケース:</strong> {pcCase}
      </li>
    );
  }

  // ---------------------------------------------
  //   - モニター
  // ---------------------------------------------

  if (pcMonitor) {
    componentsArr.push(
      <li key="monitor">
        <strong>モニター:</strong> {pcMonitor}
      </li>
    );
  }

  // ---------------------------------------------
  //   - マウス
  // ---------------------------------------------

  if (pcMouse) {
    componentsArr.push(
      <li key="mouse">
        <strong>マウス:</strong> {pcMouse}
      </li>
    );
  }

  // ---------------------------------------------
  //   - キーボード
  // ---------------------------------------------

  if (pcKeyboard) {
    componentsArr.push(
      <li key="keyboard">
        <strong>キーボード:</strong> {pcKeyboard}
      </li>
    );
  }

  // ---------------------------------------------
  //   Component
  // ---------------------------------------------

  let componentSpecs = "";

  if (componentsArr.length > 0) {
    componentSpecs = (
      <div
        css={css`
          margin: 16px 0 0 0;
        `}
      >
        <p
          css={css`
            font-weight: bold;
          `}
        >
          スペック
        </p>

        <ul
          css={css`
            list-style-type: disc;
            margin: 3px 0 0 20px;
          `}
        >
          {componentsArr}
        </ul>
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
        <IconLaptopMac
          css={css`
            && {
              font-size: 24px;
            }
          `}
        />

        <h3
          css={css`
            margin: 0 0 0 4px;
          `}
        >
          {componentModel}
        </h3>
      </div>

      {/* コメント */}
      {componentComment}

      {/* PCスペック */}
      {componentSpecs}
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

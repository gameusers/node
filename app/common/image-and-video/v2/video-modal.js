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

import ModalVideo from "react-modal-video";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   States
// ---------------------------------------------

import { ContainerStateLayout } from "app/@states/layout.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { videoObj, handleVideoClose } = stateLayout;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const open = lodashGet(videoObj, ["open"], false);
  const videoChannel = lodashGet(videoObj, ["videoChannel"], "youtube");
  const videoID = lodashGet(videoObj, ["videoID"], "");

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/layout/v2/components/sidebar.js
  // `);

  // console.log(chalk`
  //   login: {green ${login}}
  // `);

  // console.log(`
  //   ----- linkArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(linkArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <ModalVideo
      channel={videoChannel}
      isOpen={open}
      videoId={videoID}
      onClose={handleVideoClose}
    />
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

import { useSpring, animated } from "react-spring";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

// import lodashGet from 'lodash/get';
// import lodashSet from 'lodash/set';
// import lodashThrottle from 'lodash/throttle';

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * react-spring
 * 参考：https://www.react-spring.io/
 */
const Container = ({ children, showNavTop, lowerSidebar }) => {
  // --------------------------------------------------
  //   移動させる距離を指定
  // --------------------------------------------------

  let ypx = 52;

  // Navigation Top が表示されている場合は、大きく移動させる
  if (showNavTop) {
    ypx = 105;
  }

  // console.log(chalk`
  //   showNavTop: {green ${showNavTop}}
  //   lowerSidebar: {green ${lowerSidebar}}
  //   ypx: {green ${ypx}}
  // `);

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const props = useSpring({
    transform: lowerSidebar ? `translateY(${ypx}px)` : "translateY(0px)",
    config: { duration: 250 },
  });

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <animated.div
      css={css`
        width: 300px;
        // height: 100%;
        // height: 92vh;
        // min-height: 200px;
        overflow-y: auto;

        ::-webkit-scrollbar {
          display: none;
        }
        scrollbar-width: none;

        position: sticky;
        top: 0;

        // margin: 0 4px 0 0;
        padding: 0 4px 2px 0;

        @media screen and (max-width: 947px) {
          width: 100%;
          height: auto;
          min-height: inherit;
          position: static;
          overflow-y: visible;
          margin: 0;
          padding: 0;
        }
      `}
      style={props}
    >
      {children}
    </animated.div>
  );
};

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { showNavTop, lowerSidebar } = props;

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
    <Container showNavTop={showNavTop} lowerSidebar={lowerSidebar}>
      {/* Contents */}
      {props.children}
    </Container>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

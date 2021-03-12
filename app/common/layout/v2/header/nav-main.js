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
import Link from "next/link";
import { useSpring, animated } from "react-spring";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
// import lodashSet from 'lodash/set';

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconMenu from "@material-ui/icons/Menu";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * react-spring
 * 参考：https://www.react-spring.io/
 */
const Container = ({ children, lowerNavMain }) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const props = useSpring({
    transform: lowerNavMain ? "translateY(53px)" : "translateY(0px)",
    config: { duration: 250 },
  });

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <animated.div
      css={css`
        width: 100%;
        height: 36px;
        background-color: #25283d;
        position: sticky;
        top: 0;
        z-index: 1000;
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

  const { lowerNavMain, headerNavMainArr } = props;

  // const drawerIconShow = lodashGet(stores, ['layout', 'drawerIconShow'], false);
  // const handleDrawerOpen = lodashGet(stores, ['layout', 'handleDrawerOpen'], () => {});

  // --------------------------------------------------
  //   Component - Button
  // --------------------------------------------------

  const componentsArr = [];

  if (headerNavMainArr.length > 0) {
    for (const [index, valueObj] of headerNavMainArr.entries()) {
      if (valueObj.active) {
        componentsArr.push(
          <Button
            css={css`
              && {
                height: 36px;
                color: white;
                border-bottom: solid 2px #b40431;
                margin: 0 10px 0 0;
              }
            `}
            key={index}
          >
            {valueObj.name}
          </Button>
        );
      } else {
        componentsArr.push(
          <Link href={valueObj.href} key={index}>
            <a className="link">
              <Button
                css={css`
                  && {
                    height: 36px;
                    color: #bdbdbd;
                    border-bottom: solid 2px #25283d;
                    margin: 0 10px 0 0;
                  }
                `}
              >
                {valueObj.name}
              </Button>
            </a>
          </Link>
        );
      }
    }
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----- contextObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(contextObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Container lowerNavMain={lowerNavMain}>
      <div
        css={css`
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          padding: 0 12px;

          @media screen and (max-width: 480px) {
            position: relative;
          }
        `}
      >
        {/* Drawer Menu */}
        {/*{drawerIconShow &&
          <div
            css={css`
              margin: 0 28px 0 0;

              @media screen and (max-width: 480px) {
                position: absolute;
                left: 12px;
              }
            `}
          >
            <IconButton
              css={css`
                && {
                  color: white;
                  width: 28px;
                  height: 28px;
                  padding: 0;
                }
              `}
              onClick={() => handleDrawerOpen()}
            >
              <IconMenu />
            </IconButton>
          </div>
        }*/}

        {/* Menu */}
        {componentsArr}
      </div>
    </Container>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

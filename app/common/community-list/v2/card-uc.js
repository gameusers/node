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

import React from "react";
import Link from "next/link";
import { useIntl } from "react-intl";

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

import { makeStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconCommunityType from "@material-ui/icons/Public";
import IconApproval from "@material-ui/icons/AddBox";
import IconSchedule from "@material-ui/icons/Schedule";
import IconPermIdentity from "@material-ui/icons/PermIdentity";

// --------------------------------------------------
//   Material UI Style Overrides
//   https://material-ui.com/styles/basics/
// --------------------------------------------------

const useStyles = makeStyles({
  tooltip: {
    backgroundColor: "black",
    color: "white",
    fontSize: 11,
  },

  arrow: {
    color: "black",
  },
});

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

  const { obj = {} } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const classes = useStyles();

  // --------------------------------------------------
  //   ????????????????????????????????????????????????????????????????????????
  // --------------------------------------------------

  if (Object.keys(obj).length === 0) {
    return null;
  }

  // ---------------------------------------------
  //   Data
  // ---------------------------------------------

  const userCommunityID = lodashGet(obj, ["userCommunityID"], "");
  const createdDate = lodashGet(obj, ["createdDate"], "");
  const name = lodashGet(obj, ["name"], "");
  const src = lodashGet(obj, ["src"], "/img/common/thumbnail/none-game.jpg");
  const srcSet = lodashGet(obj, ["srcSet"], "");
  const followedCount = lodashGet(obj, ["followedCount"], 0);

  // --------------------------------------------------
  //   Link
  // --------------------------------------------------

  const linkHref = "/uc/[userCommunityID]/";
  const linkAs = `/uc/${userCommunityID}`;

  // --------------------------------------------------
  //   ?????????????????????
  // --------------------------------------------------

  const gamesArr = lodashGet(obj, ["gamesArr"], []);

  const componentsGamesArr = [];

  for (const [index, valueObj] of gamesArr.entries()) {
    const src = lodashGet(
      valueObj,
      ["imagesAndVideosThumbnailObj", "arr", 0, "src"],
      "/img/common/thumbnail/none-game.jpg"
    );
    const srcSet = lodashGet(
      valueObj,
      ["imagesAndVideosThumbnailObj", "arr", 0, "srcSet"],
      ""
    );

    // console.log(`
    //   ----- valueObj -----\n
    //   ${util.inspect(valueObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    componentsGamesArr.push(
      <Tooltip classes={classes} title={valueObj.name} arrow key={index}>
        {/* ???????????????????????? Tooltip ???????????? div ???????????????????????????????????? */}
        <div>
          <IconButton
            css={css`
              && {
                margin: 0;
                padding: 0;
              }
            `}
          >
            <Avatar
              css={css`
                && {
                  width: 18px;
                  height: 18px;
                  margin: 0 8px 0 0;
                  cursor: pointer;
                }
              `}
              alt={valueObj.name}
              src={src}
              srcSet={srcSet}
            />
          </IconButton>
        </div>
      </Tooltip>
    );
  }

  // --------------------------------------------------
  //   ???????????????
  // --------------------------------------------------

  const communityType = lodashGet(obj, ["communityType"], "open");
  const codeCommunityType =
    communityType === "open"
      ? intl.formatMessage({ id: "DXeihaDx8" })
      : intl.formatMessage({ id: "QHz1wbGch" });

  // --------------------------------------------------
  //   ??????
  // --------------------------------------------------

  const approval = lodashGet(obj, ["approval"], false);
  const codeApproval = approval
    ? intl.formatMessage({ id: "Da45qlq9l" })
    : intl.formatMessage({ id: "nEtCLmbKz" });

  // --------------------------------------------------
  //   ??????????????????
  // --------------------------------------------------

  const anonymity = lodashGet(obj, ["anonymity"], true);
  const codeAnonymity = anonymity
    ? intl.formatMessage({ id: "I2lSx_RQh" })
    : intl.formatMessage({ id: "btIZLhdBM" });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/common/feed/card.js
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
    <Link href={linkHref} as={linkAs}>
      <a className="link">
        <Paper
          css={css`
            && {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              margin: 12px 0 0 0;
            }
          `}
        >
          {/* Left */}
          <div>
            <img
              css={css`
                border-radius: 4px 0 0 4px;
              `}
              src={src}
              srcSet={srcSet}
              width="48"
            />
          </div>

          {/* Right */}
          <div
            css={css`
              display: flex;
              flex-flow: column nowrap;
              line-height: 1;
              width: 100%;
              margin: 4px 0 0 0;
              padding: 4px 8px;
            `}
          >
            {/* ?????? / ?????? */}
            <div
              css={css`
                font-weight: bold;
              `}
            >
              {name}
            </div>

            {/* ?????? */}
            <div
              css={css`
                display: flex;
                flex-flow: row wrap;
                align-items: center;

                margin: 4px 0 0 0;
              `}
            >
              {/* ????????? */}
              {componentsGamesArr}

              <div
                css={css`
                  display: flex;
                  flex-flow: row wrap;
                  margin: 0 0 0 auto;
                `}
              >
                {/* ??????????????? */}
                <div
                  css={css`
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    margin: 0 0 0 12px;

                    @media screen and (max-width: 480px) {
                      display: none;
                    }
                  `}
                >
                  <IconCommunityType
                    css={css`
                      && {
                        font-size: 16px;
                        margin: 0 0 1px 0;
                      }
                    `}
                  />
                  <div
                    css={css`
                      font-size: 12px;
                      margin: 0 0 0 2px;
                    `}
                  >
                    {codeCommunityType}
                  </div>
                </div>

                {/* ?????? */}
                <div
                  css={css`
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    margin: 0 0 0 12px;

                    @media screen and (max-width: 480px) {
                      display: none;
                    }
                  `}
                >
                  <IconApproval
                    css={css`
                      && {
                        font-size: 16px;
                        margin: 0 0 1px 0;
                      }
                    `}
                  />
                  <div
                    css={css`
                      font-size: 12px;
                      margin: 0 0 0 2px;
                    `}
                  >
                    {codeApproval}
                  </div>
                </div>

                {/* ????????? */}
                <div
                  css={css`
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    margin: 0 0 0 12px;

                    @media screen and (max-width: 480px) {
                      display: none;
                    }
                  `}
                >
                  <IconSchedule
                    css={css`
                      && {
                        font-size: 16px;
                        margin: 0 0 1px 0;
                      }
                    `}
                  />
                  <div
                    css={css`
                      font-size: 12px;
                      margin: 0 0 0 2px;
                    `}
                  >
                    {createdDate}
                  </div>
                </div>

                {/* ???????????? */}
                <div
                  css={css`
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    margin: 0 0 0 12px;
                  `}
                >
                  <IconPermIdentity
                    css={css`
                      && {
                        font-size: 16px;
                        margin: 0 0 0 0;
                      }
                    `}
                  />
                  <div
                    css={css`
                      font-size: 12px;
                      margin: 0 0 0 2px;
                    `}
                  >
                    {followedCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </a>
    </Link>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

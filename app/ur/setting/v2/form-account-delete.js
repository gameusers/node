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
import Router from "next/router";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { Element } from "react-scroll";

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

import { validationDelete } from "app/@validations/delete.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

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
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    handleLoadingOpen,
    handleLoadingClose,
    handleScrollTo,
    handleDialogOpen,
  } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [keyword, setKeyword] = useState(
    lodashGet(props, ["userCommunityObj", "keyword"], "")
  );
  const [defaultExpanded, setDefaultExpanded] = useState(
    lodashGet(props, ["defaultExpanded"], false)
  );

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 送信する
   */
  const handleSubmit = async () => {
    try {
      // ---------------------------------------------
      //   Validations
      // ---------------------------------------------

      if (validationDelete({ value: keyword }).error) {
        throw new CustomError({
          errorsArr: [{ code: "MkHzFQ1cX", messageID: "uwHIKBy7c" }],
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

      const formDataObj = {};

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/users/delete-setting-account`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "j6lSS-Zf5",
          },
        ],
      });

      // ---------------------------------------------
      //   リロードする
      // ---------------------------------------------

      Router.push("/");

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/uc/v2/form-community.js - handleSubmit
      // `);

      // console.log(chalk`
      //   gameCommunities_id: {green ${gameCommunities_id}}
      //   forumThreads_id: {green ${forumThreads_id}}
      // `);

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(formDataObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);
    } catch (errorObj) {
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
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);

      // ---------------------------------------------
      //   Loading Close
      // ---------------------------------------------

      handleLoadingClose();

      // ---------------------------------------------
      //   Scroll To
      // ---------------------------------------------

      handleScrollTo({
        to: "elementFormDelete",
        duration: 0,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });
    }
  };

  // --------------------------------------------------
  //   Validation
  // --------------------------------------------------

  const validationDeleteObj = validationDelete({ value: keyword });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/uc/v2/form-community.js
  // `);

  // console.log(chalk`
  //   urlID: {green ${urlID}}
  //   gameCommunities_id: {green ${gameCommunities_id}}
  //   userCommunityID: {green ${userCommunityID}}
  //   userCommunities_id: {green ${userCommunities_id}}

  //   page: {green ${page}}
  //   count: {green ${count}}
  //   limit: {green ${limit}}
  // `);

  // console.log(`
  //   ----- lodashGet(props, ['headerObj', 'followsObj'], {}) -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(lodashGet(props, ['headerObj', 'followsObj'], {}))), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element
      css={css`
        margin: 16px 0 0 0;
      `}
      name="elementFormDelete"
    >
      <Panel heading="アカウント削除" defaultExpanded={defaultExpanded}>
        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          アカウントを削除します。自分がオーナーになっているコミュニティも同時に削除されますので、参加者がいる場合は、閉鎖することを通知してからアカウントを削除することをお勧めします。
        </p>

        <p>
          ゲームコミュニティのフォーラムや募集に書き込んだ内容は削除されませんので、必ずアカウントを削除する前に削除してください。一度アカウントを削除すると以後は削除できなくなります。
        </p>

        <form>
          {/* Delete */}
          <div css={cssBox}>
            <h3
              css={css`
                margin: 0 0 6px 0;
              `}
            >
              削除
            </h3>

            <p
              css={css`
                margin: 0 0 8px 0;
              `}
            >
              半角英字で delete と入力してください。
            </p>

            <div>
              <TextField
                css={css`
                  width: 400px;

                  @media screen and (max-width: 480px) {
                    width: 100%;
                  }
                `}
                id="delete"
                label="Textfield"
                value={validationDeleteObj.value}
                onChange={(eventObj) => setKeyword(eventObj.target.value)}
                error={validationDeleteObj.error}
                helperText={intl.formatMessage(
                  { id: validationDeleteObj.messageID },
                  { numberOfCharacters: validationDeleteObj.numberOfCharacters }
                )}
                disabled={buttonDisabled}
                margin="normal"
                inputProps={{
                  maxLength: 6,
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
              border-top: 1px dashed #848484;
              margin: 24px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={buttonDisabled}
              onClick={() =>
                handleDialogOpen({
                  title: "アカウント削除",
                  description: "アカウントを削除しますか？",
                  handle: handleSubmit,
                  argumentsObj: {},
                })
              }
            >
              削除する
            </Button>
          </div>
        </form>
      </Panel>
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

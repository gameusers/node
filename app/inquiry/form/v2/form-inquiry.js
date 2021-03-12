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

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";

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
import { validationComment } from "app/@validations/comment.js";
import { validationUsersEmail } from "app/@database/users/validations/email.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";

import FormName from "app/common/form/v2/name.js";
import FormEmail from "app/common/form/v2/email.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(lodashGet(props, ["email"], ""));
  const [comment, setComment] = useState("");

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const { handleLoadingOpen, handleLoadingClose, handleScrollTo } = stateLayout;

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

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
      //   Validations
      // ---------------------------------------------

      if (
        validationHandleName({ required: true, value: name }).error ||
        validationUsersEmail({ value: email }).error ||
        validationComment({ required: true, value: comment }).error
      ) {
        throw new CustomError({
          errorsArr: [{ code: "MxNRxHj8G", messageID: "uwHIKBy7c" }],
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
        name,
        email,
        comment,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/inquiry/form/inquiry`,
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
      //   Reset Form
      // ---------------------------------------------

      setName("");
      setEmail("");
      setComment("");

      // ---------------------------------------------
      //   Snackbar: Success
      // ---------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "dusYj_Gh3",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/inquiry/form/v2/form-inquiry.js / handleSubmit
      // `);

      // console.log(chalk`
      //   name: {green ${name}}
      //   email: {green ${email}}
      //   comment: {green ${comment}}
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
      //   Scroll
      // ---------------------------------------------

      handleScrollTo({
        to: "elementFormInquiry",
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

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/forum/v2/components/forum.js
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
  //   ----- arr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(arr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name="elementFormInquiry">
      <Panel heading="お問い合わせフォーム" defaultExpanded={true}>
        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          Game Usersへの連絡はこちらのフォーム、または{" "}
          <Link href="/uc/official">Game Users 公式コミュニティ</Link>
          を利用して行ってください。
        </p>

        {/* フォーム */}
        <form
          name="formInquiry"
          onSubmit={(eventObj) =>
            handleSubmit({
              eventObj,
            })
          }
        >
          <div
            css={css`
              border-top: 1px dashed #848484;
              margin: 36px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >
            {/* Name */}
            <FormName name={name} setName={setName} />

            {/* E-Mail */}
            <FormEmail email={email} setEmail={setEmail} />

            {/* Comment */}
            <div
              css={css`
                margin: 24px 0 0 0;
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
                placeholder="お問い合わせ内容"
                value={comment}
                onChange={(eventObj) => setComment(eventObj.target.value)}
                maxLength={3000}
                disabled={buttonDisabled}
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
              type="submit"
              variant="contained"
              color="primary"
              disabled={buttonDisabled}
            >
              送信する
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

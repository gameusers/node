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
//   Material UI / Icon
// ---------------------------------------------

import IconThumbUp from "@material-ui/icons/ThumbUp";

// ---------------------------------------------
//   Material UI / Color
// ---------------------------------------------

import green from "@material-ui/core/colors/green";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";
import { showSnackbar } from "app/@modules/snackbar.js";

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

  const { goods, setGoods, type, target_id } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * Good ボタンを押したときの処理
   * @param {string} type - タイプ [forumComment, forumReply, recruitmentComment, recruitmentReply]
   * @param {string} target_id - Goodボタンを押したコンテンツのID
   */
  const handleSubmit = async ({ type, target_id }) => {
    try {
      // ---------------------------------------------
      //   Button Disable
      // ---------------------------------------------

      setButtonDisabled(true);

      // ---------------------------------------------
      //   console.log
      // ---------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/common/good/v2/button.js - handleSubmit
      // `);

      // console.log(chalk`
      //   type: {green ${type}}
      //   target_id: {green ${target_id}}
      // `);

      // ---------------------------------------------
      //   FormData
      // ---------------------------------------------

      const formDataObj = {
        type,
        target_id,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/goods/upsert`,
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
      //   result
      // ---------------------------------------------

      const result = lodashGet(resultObj, ["data", "result"], true);

      if (result) {
        setGoods(goods + 1);
      } else {
        setGoods(goods - 1);
      }

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
      });
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
    }
  };

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/good/v2/button.js
  // `);

  // console.log(chalk`
  //   goods: {green ${goods}}
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Button
      css={css`
        && {
          background-color: ${green[500]};
          &:hover {
            background-color: ${green[700]};
          }
          color: white;
          font-size: 12px;
          height: 22px;
          min-width: 20px;
          padding: 0 5px;
        }
      `}
      variant="outlined"
      disabled={buttonDisabled}
      onClick={() =>
        handleSubmit({
          type,
          target_id,
        })
      }
    >
      <IconThumbUp
        css={css`
          && {
            font-size: 14px;
            margin: 0 4px 2px 0;
          }
        `}
      />
      {goods}
    </Button>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

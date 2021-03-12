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

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashCloneDeep from "lodash/cloneDeep";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconClose from "@material-ui/icons/Close";
import IconSettings from "@material-ui/icons/Settings";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { fetchWrapper } from "app/@modules/fetch.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormSelect from "app/common/id/v2/form-select.js";
import FormEdit from "app/common/id/v2/form-edit.js";
import FormRegister from "app/common/id/v2/form-register.js";

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

  const { idsArr, setIDsArr } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [dataArr, setDataArr] = useState([]);
  const [selectedArr, setSelectedArr] = useState([]);
  const [unselectedArr, setUnselectedArr] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formType, setFormType] = useState("select");

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * フォーム（ダイアログ）を開く
   * Fetchでユーザーが登録しているIDをすべて取得する
   * @param {Array} idsArr - 選択されているIDが入っている配列
   */
  const handleDialogOpen = async () => {
    try {
      // --------------------------------------------------
      //   フォームに表示するデータがすでに読み込まれている場合
      //   ダイアログをすぐに表示する
      // --------------------------------------------------

      if (dataArr.length > 0) {
        setDialogOpen(true);

        // --------------------------------------------------
        //   フォームに表示するデータがまだ読み込まれていない場合
        //   Fetch でデータを取得してからフォームを表示する
        // --------------------------------------------------
      } else {
        // --------------------------------------------------
        //   Button Disable
        // --------------------------------------------------

        setButtonDisabled(true);

        // --------------------------------------------------
        //   FormData
        // --------------------------------------------------

        const formDataObj = {};

        // --------------------------------------------------
        //   Fetch
        // --------------------------------------------------

        const resultObj = await fetchWrapper({
          urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/ids/read-edit-form`,
          methodType: "POST",
          formData: JSON.stringify(formDataObj),
        });

        // --------------------------------------------------
        //   Error
        // --------------------------------------------------

        if ("errorsArr" in resultObj) {
          throw new CustomError({ errorsArr: resultObj.errorsArr });
        }

        // --------------------------------------------------
        //   Data
        // --------------------------------------------------

        const fetchDataArr = lodashGet(resultObj, ["data"], []);

        // --------------------------------------------------
        //   選択IDの配列を作成する
        // --------------------------------------------------

        for (let valueObj of idsArr.values()) {
          // 存在するIDかチェックする（すでに削除されている可能性があるため）
          const index = fetchDataArr.findIndex((value2Obj) => {
            return value2Obj._id === valueObj._id;
          });

          if (index !== -1) {
            selectedArr.push(valueObj._id);
          }
        }

        // --------------------------------------------------
        //   未選択IDの配列を作成する
        // --------------------------------------------------

        for (let valueObj of fetchDataArr.values()) {
          // 選択IDに含まれていない場合、配列に追加
          const index = idsArr.findIndex((value2Obj) => {
            return value2Obj._id === valueObj._id;
          });

          if (index === -1) {
            unselectedArr.push(valueObj._id);
          }
        }

        // --------------------------------------------------
        //   更新
        // --------------------------------------------------

        setDataArr(fetchDataArr);
        setSelectedArr(lodashCloneDeep(selectedArr));
        setUnselectedArr(lodashCloneDeep(unselectedArr));

        // --------------------------------------------------
        //   ダイアログ表示
        // --------------------------------------------------

        setDialogOpen(true);

        // --------------------------------------------------
        //   console.log
        // --------------------------------------------------

        // console.log(`
        //   ----------------------------------------\n
        //   /app/common/id/v2/components/form.js - handleDialogOpen
        // `);

        // console.log(`
        //   ----- fetchDataArr -----\n
        //   ${util.inspect(JSON.parse(JSON.stringify(fetchDataArr)), { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- idsArr -----\n
        //   ${util.inspect(JSON.parse(JSON.stringify(idsArr)), { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- dataArr -----\n
        //   ${util.inspect(JSON.parse(JSON.stringify(dataArr)), { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- selectedArr -----\n
        //   ${util.inspect(JSON.parse(JSON.stringify(selectedArr)), { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- unselectedArr -----\n
        //   ${util.inspect(JSON.parse(JSON.stringify(unselectedArr)), { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }
    } catch (errorObj) {
    } finally {
      // ---------------------------------------------
      //   Button Enable
      // ---------------------------------------------

      setButtonDisabled(false);
    }
  };

  // --------------------------------------------------
  //   フォームを切り替える
  // --------------------------------------------------

  let component = "";

  if (formType === "select") {
    component = (
      <FormSelect
        dataArr={dataArr}
        selectedArr={selectedArr}
        setSelectedArr={setSelectedArr}
        unselectedArr={unselectedArr}
        setUnselectedArr={setUnselectedArr}
        setIDsArr={setIDsArr}
        setDialogOpen={setDialogOpen}
      />
    );
  } else if (formType === "edit") {
    component = (
      <FormEdit
        dataArr={dataArr}
        setDataArr={setDataArr}
        idsArr={idsArr}
        setIDsArr={setIDsArr}
        gamesLimit={1}
      />
    );
  } else {
    component = (
      <FormRegister
        dataArr={dataArr}
        setDataArr={setDataArr}
        unselectedArr={unselectedArr}
        setUnselectedArr={setUnselectedArr}
        gamesLimit={1}
      />
    );
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/id/v2/components/form.js
  // `);

  // console.log(chalk`
  //   _id: {green ${_id}}
  // `);

  // console.log(`
  //   ----- idsArr -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(idsArr)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* ダイアログ表示ボタン */}
      <Button
        variant="outlined"
        color="primary"
        disabled={buttonDisabled}
        startIcon={<IconSettings />}
        onClick={() => handleDialogOpen()}
      >
        IDを登録・編集する
      </Button>

      {/* ダイアログ - ID選択＆登録フォーム */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullScreen
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* 上部メニュー */}
        <AppBar>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setDialogOpen(false)}
              aria-label="Close"
            >
              <IconClose />
            </IconButton>
            <Typography variant="h6" color="inherit">
              ID 入力フォーム
            </Typography>
          </Toolbar>
        </AppBar>

        {/* ボタン */}
        <div
          css={css`
            margin: 88px 0 0 12px;

            @media screen and (max-width: 480px) {
              margin: 76px 0 0 12px;
            }
          `}
        >
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
          >
            <Button
              disabled={buttonDisabled}
              onClick={() => setFormType("select")}
            >
              <span
                css={css`
                  font-weight: ${formType === "select" ? "bold" : "normal"};
                `}
              >
                選択
              </span>
            </Button>

            <Button
              disabled={buttonDisabled}
              onClick={() => setFormType("edit")}
            >
              <span
                css={css`
                  font-weight: ${formType === "edit" ? "bold" : "normal"};
                `}
              >
                編集
              </span>
            </Button>

            <Button
              disabled={buttonDisabled}
              onClick={() => setFormType("register")}
            >
              <span
                css={css`
                  font-weight: ${formType === "register" ? "bold" : "normal"};
                `}
              >
                登録
              </span>
            </Button>
          </ButtonGroup>
        </div>

        {/* コンテンツ */}
        {component}
      </Dialog>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

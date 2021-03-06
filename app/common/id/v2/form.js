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
   * ??????????????????????????????????????????
   * Fetch????????????????????????????????????ID????????????????????????
   * @param {Array} idsArr - ?????????????????????ID????????????????????????
   */
  const handleDialogOpen = async () => {
    try {
      // --------------------------------------------------
      //   ??????????????????????????????????????????????????????????????????????????????
      //   ???????????????????????????????????????
      // --------------------------------------------------

      if (dataArr.length > 0) {
        setDialogOpen(true);

        // --------------------------------------------------
        //   ??????????????????????????????????????????????????????????????????????????????
        //   Fetch ????????????????????????????????????????????????????????????
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
        //   ??????ID????????????????????????
        // --------------------------------------------------

        for (let valueObj of idsArr.values()) {
          // ????????????ID?????????????????????????????????????????????????????????????????????????????????
          const index = fetchDataArr.findIndex((value2Obj) => {
            return value2Obj._id === valueObj._id;
          });

          if (index !== -1) {
            selectedArr.push(valueObj._id);
          }
        }

        // --------------------------------------------------
        //   ?????????ID????????????????????????
        // --------------------------------------------------

        for (let valueObj of fetchDataArr.values()) {
          // ??????ID????????????????????????????????????????????????
          const index = idsArr.findIndex((value2Obj) => {
            return value2Obj._id === valueObj._id;
          });

          if (index === -1) {
            unselectedArr.push(valueObj._id);
          }
        }

        // --------------------------------------------------
        //   ??????
        // --------------------------------------------------

        setDataArr(fetchDataArr);
        setSelectedArr(lodashCloneDeep(selectedArr));
        setUnselectedArr(lodashCloneDeep(unselectedArr));

        // --------------------------------------------------
        //   ?????????????????????
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
  //   ??????????????????????????????
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
      {/* ?????????????????????????????? */}
      <Button
        variant="outlined"
        color="primary"
        disabled={buttonDisabled}
        startIcon={<IconSettings />}
        onClick={() => handleDialogOpen()}
      >
        ID????????????????????????
      </Button>

      {/* ??????????????? - ID??????????????????????????? */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullScreen
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* ?????????????????? */}
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
              ID ??????????????????
            </Typography>
          </Toolbar>
        </AppBar>

        {/* ????????? */}
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
                ??????
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
                ??????
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
                ??????
              </span>
            </Button>
          </ButtonGroup>
        </div>

        {/* ??????????????? */}
        {component}
      </Dialog>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

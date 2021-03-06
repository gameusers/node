// --------------------------------------------------
//   Import
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

import chalk from "chalk";
import util from "util";

// ---------------------------------------------
//   Node Packaddresss
// ---------------------------------------------

import React from "react";
import { useIntl } from "react-intl";
import TextareaAutosize from "react-autosize-textarea";

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

import TextField from "@material-ui/core/TextField";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationCardPlayersPCModel } from "app/@database/card-players/validations/pc.js";

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

const cssTextField = css`
  && {
    width: 400px;

    @media screen and (max-width: 480px) {
      width: 100%;
    }
  }
`;

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
    setPCModel,
    pcComment,
    setPCComment,
    pcSpecsObj,
    setPCSpecsObj,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * <TextField /> ???????????????
   */
  const handleOnChange = (value, type) => {
    const clonedObj = lodashCloneDeep(pcSpecsObj);
    clonedObj[type] = value;
    setPCSpecsObj(clonedObj);
  };

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationModelObj = validationCardPlayersPCModel({ value: pcModel });

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Heading */}
      <h3
        css={css`
          margin: 0 0 6px 0;
        `}
      >
        PC
      </h3>

      <p
        css={css`
          margin: 0 0 12px 0;
        `}
      >
        ???????????????PC????????????????????????????????????????????????????????????????????????PC???????????????????????????????????????
      </p>

      {/* ????????????????????? */}
      <TextField
        css={css`
          && {
            width: 400px;

            @media screen and (max-width: 480px) {
              width: 100%;
            }
          }
        `}
        id="pcModel"
        label="?????????????????????"
        value={validationModelObj.value}
        onChange={(eventObj) => setPCModel(eventObj.target.value)}
        error={validationModelObj.error}
        helperText={intl.formatMessage(
          { id: validationModelObj.messageID },
          { numberOfCharacters: validationModelObj.numberOfCharacters }
        )}
        margin="normal"
        inputProps={{
          maxLength: 50,
        }}
      />

      {/* ???????????? */}
      <TextareaAutosize
        css={css`
          && {
            width: 100%;
            border-radius: 4px;
            box-sizing: border-box;
            line-height: 1.8;
            margin: 12px 0;
            padding: 8px 12px;

            &:focus {
              outline: 1px #a9f5f2 solid;
            }

            resize: none;
          }
        `}
        rows={5}
        placeholder="PC?????????????????????????????????????????????????????????"
        value={pcComment}
        maxLength={3000}
        onChange={(eventObj) => setPCComment(eventObj.target.value)}
      />

      {/* ???????????? */}
      <TextField
        css={cssTextField}
        id="specOS"
        label="OS"
        value={pcSpecsObj.os}
        onChange={(eventObj) => handleOnChange(eventObj.target.value, "os")}
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specCPU"
        label="CPU"
        value={pcSpecsObj.cpu}
        onChange={(eventObj) => handleOnChange(eventObj.target.value, "cpu")}
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specCPUCooler"
        label="CPU????????????"
        value={pcSpecsObj.cpuCooler}
        onChange={(eventObj) =>
          handleOnChange(eventObj.target.value, "cpuCooler")
        }
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specMotherboard"
        label="??????????????????"
        value={pcSpecsObj.motherboard}
        onChange={(eventObj) =>
          handleOnChange(eventObj.target.value, "motherboard")
        }
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specMemory"
        label="????????????"
        value={pcSpecsObj.memory}
        onChange={(eventObj) => handleOnChange(eventObj.target.value, "memory")}
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specStorage"
        label="???????????????"
        value={pcSpecsObj.storage}
        onChange={(eventObj) =>
          handleOnChange(eventObj.target.value, "storage")
        }
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specGraphicsCard"
        label="???????????????????????????"
        value={pcSpecsObj.graphicsCard}
        onChange={(eventObj) =>
          handleOnChange(eventObj.target.value, "graphicsCard")
        }
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specOpticalDrive"
        label="??????????????????"
        value={pcSpecsObj.opticalDrive}
        onChange={(eventObj) =>
          handleOnChange(eventObj.target.value, "opticalDrive")
        }
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specPowerSupply"
        label="??????"
        value={pcSpecsObj.powerSupply}
        onChange={(eventObj) =>
          handleOnChange(eventObj.target.value, "powerSupply")
        }
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specCase"
        label="?????????"
        value={pcSpecsObj.pcCase}
        onChange={(eventObj) => handleOnChange(eventObj.target.value, "pcCase")}
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specMonitor"
        label="????????????"
        value={pcSpecsObj.monitor}
        onChange={(eventObj) =>
          handleOnChange(eventObj.target.value, "monitor")
        }
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specMouse"
        label="?????????"
        value={pcSpecsObj.mouse}
        onChange={(eventObj) => handleOnChange(eventObj.target.value, "mouse")}
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />

      <TextField
        css={cssTextField}
        id="specKeyboard"
        label="???????????????"
        value={pcSpecsObj.keyboard}
        onChange={(eventObj) =>
          handleOnChange(eventObj.target.value, "keyboard")
        }
        margin="normal"
        inputProps={{
          maxLength: 100,
        }}
      />
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

import React, { useState, useEffect, useContext } from "react";
import { useIntl } from "react-intl";
import { useSnackbar } from "notistack";

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
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputAdornment from "@material-ui/core/InputAdornment";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconOndemandVideo from "@material-ui/icons/OndemandVideo";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

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

  const {
    heading,
    description,
    limit = 1,
    imagesAndVideosObj,
    setImagesAndVideosObj,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [videoChannel, setVideoChannel] = useState("youtube");
  const [url, setUrl] = useState("");

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * ?????????????????????????????????
   * ?????????????????????????????????????????????????????????????????????????????????????????????????????????
   * @param {number} limit - ??????????????????????????????
   */
  const handleAddVideo = ({ limit }) => {
    // ---------------------------------------------
    //   Property
    // ---------------------------------------------

    const clonedImagesAndVideosObj = lodashCloneDeep(imagesAndVideosObj);
    const arr = lodashGet(clonedImagesAndVideosObj, ["arr"], []);

    // ---------------------------------------------
    //   videoID??????
    //   ?????????????????????https://stackoverflow.com/questions/2936467/parse-youtube-video-id-using-preg-match
    // ---------------------------------------------

    const regex = new RegExp(
      '(?:youtube(?:-nocookie)?.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu.be/)([^"&?/ ]{11})',
      "i"
    );
    const matchArr = url.match(regex);
    const videoID = lodashGet(matchArr, [1], "");

    // ---------------------------------------------
    //   URL ???????????????????????????????????????
    // ---------------------------------------------

    if (url === "") {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "NLcx8C6G-",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   ??????????????????????????????????????????????????????????????????
    // ---------------------------------------------

    const resultObj = arr.find((valueObj) => {
      return valueObj.videoID === videoID;
    });

    if (resultObj) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "Qd5d74x-3",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   limit ??? 1 ??????????????????????????????????????????
    // ---------------------------------------------

    if (limit === 1) {
      arr.splice(0, 1);

      // ---------------------------------------------
      //   ?????????????????? limit ????????????????????????????????????????????????
      // ---------------------------------------------
    } else if (limit <= arr.length) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "fWrKN58iV",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   imagesAndVideosArr ???????????????
    // ---------------------------------------------

    arr.push({
      _id: "",
      type: "video",
      videoChannel,
      videoID,
    });

    clonedImagesAndVideosObj.arr = arr;

    // ---------------------------------------------
    //   ??????
    // ---------------------------------------------

    setImagesAndVideosObj(clonedImagesAndVideosObj);

    // ---------------------------------------------
    //   ?????????????????????????????????
    // ---------------------------------------------

    setVideoChannel("");
    setUrl("");

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/common/image-and-video/v2/components/form-video.js - handleAddVideo
    // `);

    // console.log(chalk`
    //   videoChannel: {green ${videoChannel}}
    //   videoID: {green ${videoID}}
    // `);

    // console.log(`
    //   ----- clonedImagesAndVideosObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(clonedImagesAndVideosObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  };

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
    <React.Fragment>
      {/* Heading */}
      {heading && (
        <div
          css={css`
            font-weight: bold;
            margin: 0 0 2px 0;
          `}
        >
          {heading}
        </div>
      )}

      {/* Description */}
      {description && (
        <p
          css={css`
            margin: 12px 0 0 0;
          `}
        >
          {description}
        </p>
      )}

      {/* Select Video Channel */}
      <div
        css={css`
          margin: 12px 0 0 0;
        `}
      >
        <FormControl>
          <Select
            value={videoChannel}
            onChange={(eventObj) => setVideoChannel(eventObj.target.value)}
          >
            <MenuItem value="youtube">YouTube</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Video URL */}
      <TextField
        css={css`
          && {
            width: 100%;
            max-width: 500px;
            margin: 14px 0 0 0;

            @media screen and (max-width: 480px) {
              max-width: auto;
            }
          }
        `}
        placeholder="??????URL"
        value={url}
        onChange={(eventObj) => setUrl(eventObj.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconOndemandVideo />
            </InputAdornment>
          ),
        }}
      />

      {/* ??????????????? */}
      <p
        css={css`
          font-size: 12px;
          margin: 10px 0 0 0;
        `}
      >
        ?????????URL??????????????????????????????
        <span
          css={css`
            color: #fe2e2e;
          `}
        >
          ??????????????????????????????????????????????????????
        </span>
      </p>

      {/* Button */}
      <div
        css={css`
          margin: 16px 0 0 0;
        `}
      >
        <Button
          variant="contained"
          color="secondary"
          size="small"
          disabled={buttonDisabled}
          onClick={() => handleAddVideo({ limit })}
        >
          ??????
        </Button>
      </div>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

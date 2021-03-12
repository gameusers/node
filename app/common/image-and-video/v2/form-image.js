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
import lodashCloneDeep from "lodash/cloneDeep";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

import IconDescription from "@material-ui/icons/Description";
import IconHelpOutline from "@material-ui/icons/HelpOutline";

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
    showImageCaption = false,
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

  const [inputFileKey, setInputFileKey] = useState(Date.now());
  const [src, setSrc] = useState("");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [caption, setCaption] = useState("");
  const [showCaptionDescription, setShowCaptionDescription] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // ---------------------------------------------
  //   Form - Image
  // ---------------------------------------------

  /**
   * 画像を選択したときに呼び出される
   * @param {Object} fileObj - ファイルオブジェクト
   */
  const handleSelectImage = ({ fileObj }) => {
    // ---------------------------------------------
    //   Error
    // ---------------------------------------------

    if (!fileObj) {
      return;
    }

    // FileReaderに対応しているかチェック
    if (
      !window.File ||
      !window.FileReader ||
      !window.FileList ||
      !window.Blob
    ) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "aSErb-9vc",
          },
        ],
      });

      return;
    }

    // アップロードできる画像の種類かチェック
    if (!fileObj.type.match(/^image\/(gif|jpeg|png|svg\+xml)$/)) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "sdHI6gvbB",
          },
        ],
      });

      return;
    }

    // ファイルサイズが設定より大きすぎないかチェック
    if (fileObj.size > process.env.NEXT_PUBLIC_UPLOAD_IMAGE_SIZE_UPPER_LIMIT) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "ihxQ34x1L",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   画像のデータ取得
    // ---------------------------------------------

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const img = new Image();
      img.src = fileReader.result;

      img.onload = () => {
        const { width, height } = img;

        setSrc(fileReader.result);
        setWidth(width);
        setHeight(height);
      };
    };

    fileReader.readAsDataURL(fileObj);
  };

  /**
   * 選択した画像を追加する
   * 追加すると画像のサムネイルがフォーム内に表示される（プレビューできる）
   * @param {number} limit - 画像を追加できる上限
   */
  const handleAddImage = ({ limit }) => {
    // ---------------------------------------------
    //   Property
    // ---------------------------------------------

    const clonedImagesAndVideosObj = lodashCloneDeep(imagesAndVideosObj);
    const arr = lodashGet(clonedImagesAndVideosObj, ["arr"], []);

    // ---------------------------------------------
    //   画像が選択されていない場合、処理停止
    // ---------------------------------------------

    if (src === "") {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "kcnBnLcoV",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   同じ画像を追加しようとしている場合、処理停止
    // ---------------------------------------------

    let duplication = false;

    if (arr.length > 0) {
      for (const valueObj of arr.values()) {
        if (valueObj.type === "image") {
          duplication = valueObj.srcSetArr.find((valueObj) => {
            return valueObj.src === src;
          });

          if (duplication) {
            break;
          }
        }
      }
    }

    if (duplication) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "cPw2kZIqY",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   limit が 1 のときは既存の要素を削除する
    // ---------------------------------------------

    if (limit === 1) {
      arr.splice(0, 1);

      // ---------------------------------------------
      //   画像＆動画が limit より多くなっている場合は処理停止
      // ---------------------------------------------
    } else if (limit <= arr.length) {
      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "error",
            messageID: "MansOH_XH",
          },
        ],
      });

      return;
    }

    // ---------------------------------------------
    //   srcSetArr データを生成する
    // ---------------------------------------------

    const srcSetArr = [
      {
        _id: "",
        w: "320w",
        width,
        height,
        src,
      },
    ];

    // ---------------------------------------------
    //   imagesAndVideosArr に追加する
    // ---------------------------------------------

    const tempObj = {
      _id: "",
      type: "image",
      srcSetArr,
    };

    if (caption) {
      tempObj.localesArr = [
        {
          _id: "",
          language: "ja",
          caption,
        },
      ];
    }

    arr.push(tempObj);

    clonedImagesAndVideosObj.arr = arr;

    // ---------------------------------------------
    //   更新
    // ---------------------------------------------

    setImagesAndVideosObj(clonedImagesAndVideosObj);

    // ---------------------------------------------
    //   入力フォームをリセット
    // ---------------------------------------------

    setInputFileKey(Date.now());
    setSrc("");
    setWidth(0);
    setHeight(0);
    setCaption("");

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(chalk`
    //   /app/common/image-and-video/v2/components/form-image.js - handleAddImage
    // `);

    // console.log(`
    //   ----- clonedImagesAndVideosObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(clonedImagesAndVideosObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- imagesAndVideosObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(imagesAndVideosObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);
  };

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(chalk`
  //   /app/common/image-and-video/v2/components/form-image.js
  // `);

  // console.log(chalk`
  //   _id: {green ${_id}}
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

      {/* Input file */}
      <div
        css={css`
          display: flex;
          flex-flow: row wrap;
          margin: 0 0 6px;
        `}
      >
        <input
          css={css`
            margin: 14px 0 0 0;
          `}
          type="file"
          key={inputFileKey}
          onChange={(eventObj) =>
            handleSelectImage({ fileObj: eventObj.target.files[0] })
          }
        />

        <div
          css={css`
            margin: 12px 0 0 0;
          `}
        >
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disabled={buttonDisabled}
            onClick={() => handleAddImage({ limit })}
          >
            追加
          </Button>
        </div>
      </div>

      {/* Caption */}
      {showImageCaption && (
        <TextField
          css={css`
            && {
              width: 100%;
              max-width: 500px;
              margin: 10px 0 0 0;

              @media screen and (max-width: 480px) {
                max-width: auto;
              }
            }
          `}
          placeholder="画像名・簡単な解説"
          value={caption}
          onChange={(eventObj) => setCaption(eventObj.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconDescription />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowCaptionDescription(!showCaptionDescription)
                  }
                >
                  <IconHelpOutline />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}

      {/* Captionについての解説 */}
      {showCaptionDescription && (
        <p
          css={css`
            font-size: 12px;
            margin: 10px 0 0 0;
          `}
        >
          アップロードした画像をクリック（タップ）すると、画像が拡大表示されますが、上記フォームに文字を入力して追加すると、拡大された画像の下部に入力した文字が表示されるようになります。
          <strong>基本的には未入力で問題ありません</strong>
          が、アップロードした画像について、説明を加えたい場合に利用してください。
        </p>
      )}

      {/* アップロードできる画像の解説 */}
      <p
        css={css`
          font-size: 12px;
          margin: 10px 0 0 0;
        `}
      >
        アップロードできる画像の種類は JPEG, PNG, GIF, SVG
        で、ファイルサイズが5MB以内のものです。
        <span
          css={css`
            color: #fe2e2e;
          `}
        >
          画像を選択したら追加ボタンを押してください。
        </span>
      </p>
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormPreview from "app/common/image-and-video/v2/form-preview.js";
import FormImage from "app/common/image-and-video/v2/form-image.js";
import FormVideo from "app/common/image-and-video/v2/form-video.js";

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
    showImageButton = true,
    showVideoButton = true,
    descriptionImage,
    descriptionVideo,
    showImageCaption,
    limit,
    imagesAndVideosObj,
    setImagesAndVideosObj,
  } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [showFormImage, setShowFormImage] = useState(false);
  const [showFormVideo, setShowFormVideo] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  const handleShowFormImage = () => {
    setShowFormImage(!showFormImage);
    setShowFormVideo(false);
  };

  const handleShowFormVideo = () => {
    setShowFormImage(false);
    setShowFormVideo(!showFormVideo);
  };

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/image-and-video/components/form.js
  // `);

  // console.log(chalk`
  //   type: {green ${type}}
  // `);

  // console.log(`
  //   ----- imagesAndVideosObj -----\n
  //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <React.Fragment>
      {/* Preview */}
      <FormPreview
        imagesAndVideosObj={imagesAndVideosObj}
        setImagesAndVideosObj={setImagesAndVideosObj}
      />

      {/* Buttons */}
      <ButtonGroup
        css={css`
          margin: 12px 0 0 0;
        `}
        color="primary"
        disabled={buttonDisabled}
      >
        {showImageButton && (
          <Button onClick={() => handleShowFormImage()}>画像</Button>
        )}

        {showVideoButton && (
          <Button onClick={() => handleShowFormVideo()}>動画</Button>
        )}
      </ButtonGroup>

      {/* Form Image */}
      {showFormImage && (
        <div
          css={css`
            margin: 8px 0 0 0;
          `}
        >
          <FormImage
            description={descriptionImage}
            showImageCaption={showImageCaption}
            limit={limit}
            imagesAndVideosObj={imagesAndVideosObj}
            setImagesAndVideosObj={setImagesAndVideosObj}
          />
        </div>
      )}

      {/* Form Video */}
      {showFormVideo && (
        <div
          css={css`
            margin: 8px 0 0 0;
          `}
        >
          <FormVideo
            description={descriptionVideo}
            limit={limit}
            imagesAndVideosObj={imagesAndVideosObj}
            setImagesAndVideosObj={setImagesAndVideosObj}
          />
        </div>
      )}
    </React.Fragment>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

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
import { Element } from "react-scroll";
import { useSnackbar } from "notistack";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";
import lodashHas from "lodash/has";
import lodashCloneDeep from "lodash/cloneDeep";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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

import { validationUsersUserID } from "app/@database/users/validations/user-id.js";
import { validationUsersPagesTitle } from "app/@database/users/validations/pages.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import Panel from "app/common/layout/v2/panel.js";
import FormImageAndVideo from "app/common/image-and-video/v2/form.js";

// --------------------------------------------------
//   Function Components
// --------------------------------------------------

/**
 * Form Page Title
 */
const FormPageTitle = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { pagesArr = [], setPagesArr } = props;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();

  const [type, setType] = useState("top");

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * タイトルを入力する
   */
  const handleOnChangeTitle = ({ value }) => {
    const clonedArr = lodashCloneDeep(pagesArr);

    const index = clonedArr.findIndex((valueObj) => {
      return valueObj.type === type;
    });

    // --------------------------------------------------
    //   index がない場合はオブジェクトを新たに追加する
    // --------------------------------------------------

    if (index === -1) {
      const tempObj = {
        _id: "",
        type,
        title: value,
        language: "ja",
      };

      clonedArr.push(tempObj);

      // --------------------------------------------------
      //   オブジェクトが存在する場合はタイトルを更新
      // --------------------------------------------------
    } else {
      lodashSet(clonedArr, [index, "title"], value);
    }

    setPagesArr(clonedArr);

    // console.log(chalk`
    //   value: {green ${value}}
    // `);

    // console.log(`
    //   ----- clonedArr -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(clonedArr)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // const newArr = [

    //   {
    //     _id: '',
    //     type: 'top',
    //     title: '',
    //     language: 'ja',
    //   },

    //   {
    //     _id: '',
    //     type: 'follow',
    //     title: '',
    //     language: 'ja',
    //   },

    // ];
  };

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const resultObj = pagesArr.find((valueObj) => {
    return valueObj.type === type;
  });

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const title = lodashGet(resultObj, ["title"], "");
  const validationUsersPagesTitleObj = validationUsersPagesTitle({
    value: title,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/ur/setting/v2/form-page.js
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
    <React.Fragment>
      {/* Select Type */}
      <div
        css={css`
          margin: 24px 0 12px 0;
        `}
      >
        <FormControl>
          <Select
            value={type}
            onChange={(eventObj) => setType(eventObj.target.value)}
            inputProps={{
              name: "type",
              id: "type",
            }}
          >
            <MenuItem value="top">トップ</MenuItem>
            <MenuItem value="follow">フォロー</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Title */}
      <div>
        <TextField
          css={css`
            && {
              width: 100%;
              max-width: 500px;
            }
          `}
          id="title"
          label="タイトル"
          value={validationUsersPagesTitleObj.value}
          onChange={(eventObj) =>
            handleOnChangeTitle({ value: eventObj.target.value })
          }
          error={validationUsersPagesTitleObj.error}
          helperText={intl.formatMessage(
            { id: validationUsersPagesTitleObj.messageID },
            {
              numberOfCharacters:
                validationUsersPagesTitleObj.numberOfCharacters,
            }
          )}
          margin="normal"
          inputProps={{
            maxLength: 100,
          }}
        />
      </div>
    </React.Fragment>
  );
};

/**
 * Export Component
 */
const Component = (props) => {
  // --------------------------------------------------
  //   props
  // --------------------------------------------------

  const { pagesObj } = props;

  const arr = lodashGet(
    pagesObj,
    ["arr"],
    [
      {
        _id: "",
        type: "top",
        title: "",
        language: "ja",
      },
    ]
  );

  let pagesImagesAndVideosObj = lodashGet(
    props,
    ["pagesImagesAndVideosObj"],
    {}
  );

  if (Object.keys(pagesImagesAndVideosObj).length === 0) {
    pagesImagesAndVideosObj = {
      _id: "",
      createdDate: "",
      updatedDate: "",
      users_id: "",
      type: "ur",
      arr: [],
    };
  }

  // let pagesImagesAndVideosObj = lodashGet(props, ['pagesImagesAndVideosObj'], {

  //   _id: '',
  //   createdDate: '',
  //   updatedDate: '',
  //   users_id: '',
  //   type: 'ur',
  //   arr: [],

  // });

  // console.log(`
  //   ----- pagesImagesAndVideosObj -----\n
  //   ${util.inspect(pagesImagesAndVideosObj, { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [userID, setUserID] = useState(lodashGet(props, ["userID"], ""));
  // const [approval, setApproval] = useState(lodashGet(props, ['approval'], false));
  const [pagesArr, setPagesArr] = useState(arr);

  const [imagesAndVideosObj, setImagesAndVideosObj] = useState(
    pagesImagesAndVideosObj
  );

  useEffect(() => {
    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    setHeaderObj,
    handleLoadingOpen,
    handleLoadingClose,
    handleScrollTo,
  } = stateLayout;

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

      if (validationUsersUserID({ value: userID }).error) {
        throw new CustomError({
          errorsArr: [{ code: "jj7ApE77f", messageID: "uwHIKBy7c" }],
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
        userID,
        // approval,
        pagesArr,
      };

      // if (lodashHas(imagesAndVideosObj, ['arr', 0, '_id'])) {
      //   formDataObj.imagesAndVideosObj = imagesAndVideosObj;
      // }

      if (Object.keys(imagesAndVideosObj).length !== 0) {
        formDataObj.imagesAndVideosObj = imagesAndVideosObj;
      }

      // console.log(`
      //   ----- imagesAndVideosObj -----\n
      //   ${util.inspect(imagesAndVideosObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/users/upsert-setting-pages`,
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
      //   Snackbar: Success
      // ---------------------------------------------

      const pageTransition = lodashGet(
        resultObj,
        ["data", "pageTransition"],
        false
      );

      // ページをリロードする場合は短い表示にする
      if (pageTransition) {
        showSnackbar({
          enqueueSnackbar,
          intl,
          arr: [
            {
              variant: "success",
              messageID: "EnStWOly-",
            },
          ],
        });
      } else {
        showSnackbar({
          enqueueSnackbar,
          intl,
          experienceObj: lodashGet(resultObj, ["data", "experienceObj"], {}),
          arr: [
            {
              variant: "success",
              messageID: "EnStWOly-",
            },
          ],
        });
      }

      // ---------------------------------------------
      //   Page Transition / URLを変更した場合にリロードする
      // ---------------------------------------------

      if (pageTransition) {
        window.location.href = `${process.env.NEXT_PUBLIC_URL_BASE}ur/${userID}/setting`;
      }

      // ---------------------------------------------
      //   Update - Header
      // ---------------------------------------------

      const headerObj = lodashGet(resultObj, ["data", "headerObj"], {});

      if (Object.keys(headerObj).length !== 0) {
        setHeaderObj(headerObj);
      }

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   /app/ur/setting/v2/form-page.js / handleSubmit
      // `);

      // console.log(`
      //   ----- formDataObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(formDataObj)), { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(JSON.parse(JSON.stringify(resultObj)), { colors: true, depth: null })}\n
      //   --------------------\n
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
        to: "elementFormPage",
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
  //   Limit
  // --------------------------------------------------

  const limitImagesAndVideos = parseInt(
    process.env.NEXT_PUBLIC_USER_PAGE_IMAGES_AND_VIDEOS_LIMIT,
    10
  );

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationUsersUserIDObj = validationUsersUserID({ value: userID });

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
    <Element name="elementFormPage">
      <Panel heading="ユーザーページ設定" defaultExpanded={false}>
        <p>
          ユーザーページの設定を行います。ユーザーページというのは、各ユーザーごとに用意される固有のページになります。URLやページのタイトルを変更することが可能です。
        </p>

        {/* フォーム */}
        <form
          name="formPage"
          onSubmit={(eventObj) =>
            handleSubmit({
              eventObj,
            })
          }
        >
          {/* トップ画像 */}
          <div
            css={css`
              border-top: 1px dashed #848484;
              margin: 24px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >
            <h3
              css={css`
                font-weight: bold;
                margin: 0 0 6px 0;
              `}
            >
              トップ画像
            </h3>

            <p>
              ユーザーページのトップに表示される大きな画像です。横長の画像（推奨サイズ
              1920 x ---）をアップロードしてください。
            </p>

            <FormImageAndVideo
              showVideoButton={false}
              descriptionImage="横長の大きな画像をアップロードしてください。"
              showImageCaption={true}
              limit={limitImagesAndVideos}
              imagesAndVideosObj={imagesAndVideosObj}
              setImagesAndVideosObj={setImagesAndVideosObj}
            />
          </div>

          {/* URL */}
          <div
            css={css`
              border-top: 1px dashed #848484;
              margin: 36px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >
            <h3
              css={css`
                margin: 0 0 6px 0;
              `}
            >
              URL変更
            </h3>

            <p>
              ユーザーページのURLを入力してください。次の形式のURLになります。https://gameusers.org/ur/
              <span
                css={css`
                  color: red;
                `}
              >
                ***
              </span>
              　赤文字部分の文字列を入力してください。
            </p>

            <p
              css={css`
                margin: 0 0 8px 0;
              `}
            >
              利用できる文字は半角英数字とハイフン( - )アンダースコア( _
              )です。3文字以上、32文字以内。
            </p>

            <TextField
              css={css`
                && {
                  width: 100%;
                  max-width: 500px;
                }
              `}
              label="URL"
              value={validationUsersUserIDObj.value}
              onChange={(eventObj) => setUserID(eventObj.target.value)}
              error={validationUsersUserIDObj.error}
              helperText={intl.formatMessage(
                { id: validationUsersUserIDObj.messageID },
                {
                  numberOfCharacters:
                    validationUsersUserIDObj.numberOfCharacters,
                }
              )}
              margin="normal"
              inputProps={{
                maxLength: 32,
              }}
            />
          </div>

          {/* Page Title */}
          <div
            css={css`
              border-top: 1px dashed #848484;
              margin: 24px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >
            <h3
              css={css`
                font-weight: bold;
                margin: 0 0 6px 0;
              `}
            >
              ページのタイトル変更
            </h3>

            <p
              css={css`
                margin: 0 0 12px 0;
              `}
            >
              ユーザーページのタイトルを変更できます。
            </p>

            <FormPageTitle pagesArr={pagesArr} setPagesArr={setPagesArr} />
          </div>

          {/* フォロー承認 */}
          {/* <div
            css={css`
              border-top: 1px dashed #848484;
              margin: 24px 0 0 0;
              padding: 24px 0 0 0;
            `}
          >

            <h3
              css={css`
                font-weight: bold;
                margin: 0 0 6px 0;
              `}
            >
              フォロー承認制
            </h3>

            <p
              css={css`
                margin: 0 0 12px 0;
              `}
            >
              チェックすると、あなたをフォローするのにあなたの承認が必要になります。チェックを外すと誰でもフォローができるようになります。
            </p>


            <FormControlLabel
              control={
                <Checkbox
                  checked={approval}
                  onChange={(eventObj) => setApproval(eventObj.target.checked)}
                />
              }
              label="フォロー承認制にする"
            />

          </div> */}

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

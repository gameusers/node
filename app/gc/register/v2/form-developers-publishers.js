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
import { Element } from "react-scroll";
import shortid from "shortid";

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
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
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

import { validation_id } from "app/@validations/_id.js";
import { validationKeyword } from "app/@validations/keyword.js";

// ---------------------------------------------
//   Components
// ---------------------------------------------

import FormDeveloperPublisher from "app/common/developer-publisher/v2/form.js";

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
  //   props
  // --------------------------------------------------

  // const {

  //   gameGenresArr,

  // } = props;

  // --------------------------------------------------
  //   States
  // --------------------------------------------------

  const stateLayout = ContainerStateLayout.useContainer();

  const {
    handleLoadingOpen,
    handleLoadingClose,
    handleDialogOpen,
  } = stateLayout;

  // --------------------------------------------------
  //   Hooks
  // --------------------------------------------------

  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [developersPublishersArr, setDevelopersPublishersArr] = useState([]);
  const [editDeveloperPublisherID, setEditDeveloperPublisherID] = useState("");

  const [language, setLanguage] = useState("ja");
  const [country, setCountry] = useState("JP");
  const [developerPublisherID, setDeveloperPublisherID] = useState(
    shortid.generate()
  );
  const [urlID, setUrlID] = useState(shortid.generate());
  const [name, setName] = useState("");

  useEffect(() => {
    // --------------------------------------------------
    //   Button Enable
    // --------------------------------------------------

    setButtonDisabled(false);
  }, []);

  // --------------------------------------------------
  //   Handler
  // --------------------------------------------------

  /**
   * 編集用データを読み込む
   */
  const handleGetEditData = async () => {
    try {
      // console.log(chalk`
      // language: {green ${language}}
      // country: {green ${country}}
      // developerPublisherID: {green ${developerPublisherID}}
      // `);

      // console.log(`
      //   ----- developersPublishersArr -----\n
      //   ${util.inspect(developersPublishersArr, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   必要な情報が存在しない場合エラー
      // ---------------------------------------------

      const tempEditDeveloperPublisherID = lodashGet(
        developersPublishersArr,
        [0, "developerPublisherID"],
        ""
      );

      if (!language || !country || !tempEditDeveloperPublisherID) {
        throw new CustomError({
          errorsArr: [{ code: "QLIbXWjFI", messageID: "1YJnibkmh" }],
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
        language,
        country,
        developerPublisherID: tempEditDeveloperPublisherID,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/developers-publishers/get-edit-data`,
        methodType: "POST",
        formData: JSON.stringify(formDataObj),
      });

      // console.log(`
      //   ----- resultObj -----\n
      //   ${util.inspect(resultObj, { colors: true, depth: null })}\n
      //   --------------------\n
      // `);

      // ---------------------------------------------
      //   Error
      // ---------------------------------------------

      if ("errorsArr" in resultObj) {
        throw new CustomError({ errorsArr: resultObj.errorsArr });
      }

      // ---------------------------------------------
      //   Set Form Data
      // ---------------------------------------------

      setEditDeveloperPublisherID(tempEditDeveloperPublisherID);
      setDeveloperPublisherID(
        lodashGet(resultObj, ["data", "developerPublisherID"], "")
      );
      setUrlID(lodashGet(resultObj, ["data", "urlID"], ""));
      setName(lodashGet(resultObj, ["data", "name"], ""));
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
    }
  };

  /**
   * ゲームを登録する
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

      if (!language || !country || !developerPublisherID || !urlID || !name) {
        throw new CustomError({
          errorsArr: [{ code: "ubk9i-Ak2", messageID: "uwHIKBy7c" }],
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
        editDeveloperPublisherID,
        language,
        country,
        developerPublisherID,
        urlID,
        name,
      };

      // ---------------------------------------------
      //   Fetch
      // ---------------------------------------------

      const resultObj = await fetchWrapper({
        urlApi: `${process.env.NEXT_PUBLIC_URL_API}/v2/db/developers-publishers/upsert`,
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
      //   Reset Form
      // ---------------------------------------------

      handleResetForm();

      // --------------------------------------------------
      //   Snackbar: Success
      // --------------------------------------------------

      showSnackbar({
        enqueueSnackbar,
        intl,
        arr: [
          {
            variant: "success",
            messageID: "As9-T8q9N",
          },
        ],
      });

      // --------------------------------------------------
      //   console.log
      // --------------------------------------------------

      // console.log(`
      //   ----------------------------------------\n
      //   app/gc/list/v2/form.js / handleSubmit
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

      // console.log(chalk`
      //   recruitmentThreads_id: {green ${recruitmentThreads_id}}
      //   newRecruitmentThreads_id: {green ${newRecruitmentThreads_id}}
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
    }
  };

  /**
   * フォームをリセットする
   */
  const handleResetForm = () => {
    setDevelopersPublishersArr([]);
    setEditDeveloperPublisherID("");
    setLanguage("ja");
    setCountry("JP");
    setDeveloperPublisherID(shortid.generate());
    setUrlID(shortid.generate());
    setName("");
  };

  // --------------------------------------------------
  //   Validations
  // --------------------------------------------------

  const validationDeveloperPublisherIDObj = validation_id({
    value: developerPublisherID,
  });
  const validationUrlIDObj = validationKeyword({ value: urlID });
  const validationNameObj = validationKeyword({ value: name });

  // --------------------------------------------------
  //   Submit Button Label
  // --------------------------------------------------

  const submitButtonLabel = editDeveloperPublisherID
    ? "編集する"
    : "新規登録する";

  // --------------------------------------------------
  //   Element Name
  // --------------------------------------------------

  const elementName = "gcRegisterDevelopersPublishersForm";

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   app/gc/register/v2/form-developers-publishers.js
  // `);

  // console.log(chalk`
  //   games_id: {green ${games_id}}
  // `);

  // console.log(`
  //   ----- validationRecruitmentThreadsID1Obj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(validationRecruitmentThreadsID1Obj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <Element name={elementName}>
      {/* Form */}
      <form
        name={elementName}
        onSubmit={(eventObj) =>
          handleSubmit({
            eventObj,
          })
        }
      >
        <p
          css={css`
            margin: 0 0 14px 0;
          `}
        >
          開発・販売を行っている企業、チームなどを登録する。
        </p>

        {/* 開発・販売検索 */}
        <div css={cssBox}>
          {/* Form */}
          <FormDeveloperPublisher
            type="developer"
            arr={developersPublishersArr}
            setArr={setDevelopersPublishersArr}
            limit={1}
          />

          {/* Submit */}
          <div
            css={css`
              margin: 14px 0 0 0;
            `}
          >
            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={buttonDisabled}
              onClick={handleGetEditData}
            >
              編集データを取得する
            </Button>
          </div>
        </div>

        {/* Category */}
        <div css={cssBox}>
          <h3
            css={css`
              font-weight: bold;
              margin: 0 0 2px 0;
            `}
          >
            言語・国
          </h3>

          <p
            css={css`
              margin: 0 0 24px 0;
            `}
          >
            言語と国を選んでください。現在、選べるのは日本語・日本のみです。
          </p>

          <div
            css={css`
              display: flex;
              flex-flow: row wrap;
            `}
          >
            <div
              css={css`
                margin: 0 24px 12px 0;
              `}
            >
              <FormControl>
                <InputLabel shrink id="categoryLabel">
                  言語
                </InputLabel>

                <Select
                  css={css`
                    && {
                      width: 200px;
                    }
                  `}
                  labelId="言語"
                  value={language}
                  onChange={(eventObj) => setLanguage(eventObj.target.value)}
                  displayEmpty
                >
                  <MenuItem value="ja">日本語</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div
              css={css`
                margin: 0 0 12px 0;
              `}
            >
              <FormControl>
                <InputLabel shrink id="categoryLabel">
                  国
                </InputLabel>

                <Select
                  css={css`
                    && {
                      width: 200px;
                    }
                  `}
                  labelId="国"
                  value={country}
                  onChange={(eventObj) => setCountry(eventObj.target.value)}
                  displayEmpty
                >
                  <MenuItem value="JP">日本</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Name */}
        <div css={cssBox}>
          <h3
            css={css`
              font-weight: bold;
              margin: 0 0 2px 0;
            `}
          >
            ID & name
          </h3>

          <p
            css={css`
              margin: 0 0 12px 0;
            `}
          >
            ID & name
          </p>

          {/* developerPublisherID */}
          <TextField
            css={css`
              && {
                width: 100%;
                max-width: 500px;
              }
            `}
            label="developerPublisherID"
            value={validationDeveloperPublisherIDObj.value}
            onChange={(eventObj) =>
              setDeveloperPublisherID(eventObj.target.value)
            }
            error={validationDeveloperPublisherIDObj.error}
            helperText={intl.formatMessage(
              { id: validationDeveloperPublisherIDObj.messageID },
              {
                numberOfCharacters:
                  validationDeveloperPublisherIDObj.numberOfCharacters,
              }
            )}
            margin="normal"
            inputProps={{
              maxLength: 100,
            }}
          />

          {/* urlID */}
          <TextField
            css={css`
              && {
                width: 100%;
                max-width: 500px;
              }
            `}
            label="urlID"
            value={validationUrlIDObj.value}
            onChange={(eventObj) => setUrlID(eventObj.target.value)}
            error={validationUrlIDObj.error}
            helperText={intl.formatMessage(
              { id: validationUrlIDObj.messageID },
              { numberOfCharacters: validationUrlIDObj.numberOfCharacters }
            )}
            margin="normal"
            inputProps={{
              maxLength: 100,
            }}
          />

          {/* name */}
          <TextField
            css={css`
              && {
                width: 100%;
                max-width: 500px;
              }
            `}
            label="name"
            value={validationNameObj.value}
            onChange={(eventObj) => setName(eventObj.target.value)}
            error={validationNameObj.error}
            helperText={intl.formatMessage(
              { id: validationNameObj.messageID },
              { numberOfCharacters: validationNameObj.numberOfCharacters }
            )}
            margin="normal"
            inputProps={{
              maxLength: 100,
            }}
          />
        </div>

        {/* Buttons */}
        <div
          css={css`
            display: flex;
            flex-flow: row nowrap;
            border-top: 1px dashed #848484;
            margin: 24px 0 0 0;
            padding: 36px 0 0 0;
          `}
        >
          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={buttonDisabled}
          >
            {submitButtonLabel}
          </Button>

          {/* Reset Form */}
          <div
            css={css`
              margin: 0 0 0 auto;
            `}
          >
            <Button
              variant="contained"
              color="secondary"
              disabled={buttonDisabled}
              onClick={() =>
                handleDialogOpen({
                  title: "フォームリセット",
                  description: "フォームをリセットしますか？",
                  handle: handleResetForm,
                  argumentsObj: {},
                })
              }
            >
              リセット
            </Button>
          </div>
        </div>
      </form>
    </Element>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

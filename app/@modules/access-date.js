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

import moment from "moment";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";
import lodashSet from "lodash/set";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelUsers from "app/@database/users/model.js";
import ModelExperiences from "app/@database/experiences/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { experienceCalculate } from "app/@modules/experience.js";

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * アクセス日時を更新する / ログイン回数もカウントする
 * @param {Object} loginUsersObj - ログインユーザーの情報、前回のアクセス日時も入っている　accessDate: 2020-08-15T03:41:00.718Z,
 */
const updateAccessDate = async ({
  req,
  localeObj,
  loginUsers_id,
  accessDate,
}) => {
  try {
    // --------------------------------------------------
    //   returnObj
    // --------------------------------------------------

    const returnObj = {};

    // --------------------------------------------------
    //   ログインしている場合のみ処理する
    // --------------------------------------------------

    if (loginUsers_id && accessDate) {
      // --------------------------------------------------
      //   Login Count
      // --------------------------------------------------

      // ---------------------------------------------
      //   - DB find / experiences
      // ---------------------------------------------

      const docExperiencesObj = await ModelExperiences.findOne({
        conditionObj: {
          users_id: loginUsers_id,
        },
      });

      const historiesArr = lodashGet(docExperiencesObj, ["historiesArr"], []);

      const historyObj = historiesArr.find((valueObj) => {
        return valueObj.type === "login-count";
      });

      const updatedDate = lodashGet(historyObj, ["updatedDate"], "");

      // ---------------------------------------------
      //   - 前回アクセスからの日数の計算
      // ---------------------------------------------

      let days = 1;

      if (updatedDate) {
        const datetimeCurrentStartOfDay = moment().startOf("day");
        const datetimeUpdatedStartOfDay = moment(updatedDate).startOf("day");
        days = datetimeCurrentStartOfDay.diff(
          datetimeUpdatedStartOfDay,
          "days"
        );
      }

      // ---------------------------------------------
      //   - 前回のアクセスから1日以上経過している場合、ログイン回数 + 1
      // ---------------------------------------------

      if (days >= 1) {
        returnObj.experienceObj = await experienceCalculate({
          req,
          localeObj,
          loginUsers_id,
          arr: [
            {
              type: "login-count",
              calculation: "addition",
            },
          ],
        });
      }

      // --------------------------------------------------
      //   Update Access Date
      // --------------------------------------------------

      // ---------------------------------------------
      //   - Property
      // ---------------------------------------------

      const datetimeCurrent = moment();
      const datetimeAccess = moment(accessDate);
      const minutes = datetimeCurrent.diff(datetimeAccess, "minutes");
      const intervalMinutes = parseInt(
        process.env.ACCESS_DATE_UPDATE_INTERVAL_MINUTES,
        10
      );

      // ---------------------------------------------
      //   - 前回のアクセスから規定の時間が経過している場合、アクセス日時を更新する
      // ---------------------------------------------

      if (minutes >= intervalMinutes) {
        const ISO8601 = moment().utc().toISOString();

        const conditionObj = {
          _id: loginUsers_id,
        };

        const saveObj = {
          $set: {
            accessDate: ISO8601,
          },
        };

        await ModelUsers.upsert({ conditionObj, saveObj });

        returnObj.updatedAccessDate = ISO8601;

        // console.log(`
        //   ----- conditionObj -----\n
        //   ${util.inspect(JSON.parse(JSON.stringify(conditionObj)), { colors: true, depth: null })}\n
        //   --------------------\n
        // `);

        // console.log(`
        //   ----- saveObj -----\n
        //   ${util.inspect(JSON.parse(JSON.stringify(saveObj)), { colors: true, depth: null })}\n
        //   --------------------\n
        // `);
      }

      // console.log(chalk`
      //   days: {green ${days}}
      //   minutes: {green ${minutes}}
      //   process.env.ACCESS_DATE_UPDATE_INTERVAL_MINUTES: {green ${process.env.ACCESS_DATE_UPDATE_INTERVAL_MINUTES}}
      // `);
    }

    // ---------------------------------------------
    //   console.log
    // ---------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   /app/@modules/access-date.js - updateAccessDate
    // `);

    // console.log(chalk`
    // loginUsers_id: {green ${loginUsers_id} typeof ${typeof loginUsers_id}}
    // accessDate: {green ${accessDate} typeof ${typeof accessDate}}
    // `);

    // console.log(`
    //   ----- returnObj -----\n
    //   ${util.inspect(JSON.parse(JSON.stringify(returnObj)), { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Return
    // ---------------------------------------------

    return returnObj;
  } catch (errorObj) {
    throw errorObj;
  }
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  updateAccessDate,
};

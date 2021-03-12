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
import lodashHas from "lodash/has";

// ---------------------------------------------
//   Model
// ---------------------------------------------

import ModelHardwares from "app/@database/hardwares/model.js";

// ---------------------------------------------
//   Modules
// ---------------------------------------------

import { returnErrorsArr } from "app/@modules/log/log.js";
import { CustomError } from "app/@modules/error/custom.js";

// ---------------------------------------------
//   Validations
// ---------------------------------------------

import { validationIP } from "app/@validations/ip.js";

// ---------------------------------------------
//   Locales
// ---------------------------------------------

import { locale } from "app/@locales/locale.js";

// --------------------------------------------------
//   endpointID: hazd8DMIg
// --------------------------------------------------

export default async (req, res) => {
  // --------------------------------------------------
  //   Status Code
  // --------------------------------------------------

  let statusCode = 400;

  // --------------------------------------------------
  //   Property
  // --------------------------------------------------

  const requestParametersObj = {};
  const loginUsers_id = lodashGet(req, ["user", "_id"], "");
  const loginUsersRole = lodashGet(req, ["user", "role"], "");

  // --------------------------------------------------
  //   Language & IP & User Agent
  // --------------------------------------------------

  const acceptLanguage = lodashGet(req, ["headers", "accept-language"], "");
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = lodashGet(req, ["headers", "user-agent"], "");

  // --------------------------------------------------
  //   Locale
  // --------------------------------------------------

  const localeObj = locale({
    acceptLanguage,
  });

  try {
    // --------------------------------------------------
    //   POST Data
    // --------------------------------------------------

    // const bodyObj = JSON.parse(req.body);

    // const {

    //   userID,
    //   loginID,
    //   loginPassword,

    // } = bodyObj;

    // lodashSet(requestParametersObj, ['userID'], userID);
    // lodashSet(requestParametersObj, ['loginID'], '*****');
    // lodashSet(requestParametersObj, ['loginPassword'], '*****');

    // --------------------------------------------------
    //   Administrator Check
    // --------------------------------------------------

    if (loginUsersRole !== "administrator") {
      statusCode = 403;
      throw new CustomError({
        level: "warn",
        errorsArr: [{ code: "xiASceRut", messageID: "DSRlEoL29" }],
      });
    }

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    await validationIP({ throwError: true, required: true, value: ip });

    // --------------------------------------------------
    //   Validation
    // --------------------------------------------------

    const ISO8601 = moment().utc().toISOString();

    // --------------------------------------------------
    //   DB / Hardwares
    // --------------------------------------------------

    // ---------------------------------------------
    //   Save Array
    // ---------------------------------------------

    const saveArr = [
      {
        _id: "pr6k8Jn6_",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "P0UG-LHOQ",
        urlID: "PC",
        name: "PC",
        searchKeywordsArr: [
          "ピーシー",
          "パソコン",
          "パーソナル・コンピューター",
          "パーソナルコンピューター",
          "ぴーしー",
          "ぱーそなる・こんぴゅーたー",
          "ぱーそなるこんぴゅーたー",
          "Personal Computer",
          "PersonalComputer",
          "PC",
        ],
      },

      {
        _id: "KN9AMVKP7",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "SXybALV1f",
        urlID: "Android",
        name: "Android",
        searchKeywordsArr: ["アンドロイド", "あんどろいど", "Android"],
      },

      {
        _id: "M7YVRglvr",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "o-f3Zxd49",
        urlID: "iOS",
        name: "iOS",
        searchKeywordsArr: ["アイオーエス", "あいおーえす", "iOS"],
      },

      {
        _id: "Gu1hYjbv7",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "Zd_Ia4Hwm",
        urlID: "Nintendo-Switch",
        name: "Nintendo Switch",
        searchKeywordsArr: [
          "任天堂スイッチ",
          "任天堂スウィッチ",
          "ニンテンドースイッチ",
          "ニンテンドースウィッチ",
          "ニンテンドウスイッチ",
          "ニンテンドウスウィッチ",
          "ニンテンドオスイッチ",
          "ニンテンドオスウィッチ",
          "にんてんどーすいっち",
          "にんてんどーすうぃっち",
          "にんてんどうすいっち",
          "にんてんどうすうぃっち",
          "にんてんどおすいっち",
          "にんてんどおすうぃっち",
          "Nintendo Switch",
          "NintendoSwitch",
          "NS",
        ],
      },

      {
        _id: "qX8WLLubQ",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "GTxWVd0z-",
        urlID: "Wii-U",
        name: "Wii U",
        searchKeywordsArr: [
          "ウィーユー",
          "ウイーユー",
          "うぃーゆー",
          "ういーゆー",
          "Wii U",
          "Wi U",
          "We U",
          "WiiU",
          "WiU",
          "WeU",
        ],
      },

      {
        _id: "91N2yPx6B",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "n3wYKZ_ao",
        urlID: "Wii",
        name: "Wii",
        searchKeywordsArr: [
          "ウィー",
          "ウイー",
          "うぃー",
          "ういー",
          "Wii",
          "We",
        ],
      },

      {
        _id: "PlRw2lxiy",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "XLUt628gr",
        urlID: "NINTENDO-GAMECUBE",
        name: "ニンテンドーゲームキューブ",
        searchKeywordsArr: [
          "任天堂ゲームキューブ",
          "ニンテンドーゲームキューブ",
          "ニンテンドウゲームキューブ",
          "ニンテンドオゲームキューブ",
          "にんてんどーげーむきゅーぶ",
          "にんてんどうげーむきゅーぶ",
          "にんてんどおげーむきゅーぶ",
          "NINTENDO GAMECUBE",
          "NINTENDOGAMECUBE",
          "NGC",
          "GC",
        ],
      },

      {
        _id: "N-V_maXNc",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "45syCFviA",
        urlID: "NINTENDO-64",
        name: "NINTENDO64",
        searchKeywordsArr: [
          "任天堂64",
          "任天堂６４",
          "ニンテンドー64",
          "ニンテンドウ64",
          "ニンテンドオ64",
          "ニンテンドー６４",
          "ニンテンドウ６４",
          "ニンテンドオ６４",
          "ニンテンドーロクジュウヨン",
          "ニンテンドウロクジュウヨン",
          "ニンテンドオロクジュウヨン",
          "ロクヨン",
          "にんてんどー64",
          "にんてんどう64",
          "にんてんどお64",
          "にんてんどー６４",
          "にんてんどう６４",
          "にんてんどお６４",
          "にんてんどーろくじゅうよん",
          "にんてんどうろくじゅうよん",
          "にんてんどおろくじゅうよん",
          "ろくよん",
          "NINTENDO 64",
          "NINTENDO64",
          "N64",
        ],
      },

      {
        _id: "WOQKUSPPR",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "eKmDxi8lX",
        urlID: "SUPER-Famicom",
        name: "スーパーファミコン",
        searchKeywordsArr: [
          "スーパーファミコン",
          "スーファミ",
          "すーぱーふぁみこん",
          "すーふぁみ",
          "SUPER Famicom",
          "SUPERFamicom",
          "Super Family Computer",
          "SuperFamilyComputer",
          "SFC",
        ],
      },

      {
        _id: "aOeQ04_vN",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "VFLNnniHr",
        urlID: "Family-Computer-Disk-System",
        name: "ファミリーコンピュータ ディスクシステム",
        searchKeywordsArr: [
          "ファミリーコンピューター ディスクシステム",
          "ふぁみりーこんぴゅーたー でぃすくしすてむ",
          "Family Computer Disk System",
          "FamilyComputerDiskSystem",
          "FCDS",
        ],
      },

      {
        _id: "4FJM8n4Xa",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "en",
        country: "US",
        hardwareID: "I-iu-WmkO",
        urlID: "Nintendo-Entertainment-System",
        name: "Nintendo Entertainment System",
        searchKeywordsArr: ["Nintendo Entertainment System", "NES"],
      },
      {
        _id: "R6uD6BzZ5",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "I-iu-WmkO",
        urlID: "Family-Computer",
        name: "ファミリーコンピュータ",
        searchKeywordsArr: [
          "ファミリーコンピューター",
          "ファミコン",
          "ふぁみりーこんぴゅーたー",
          "ふぁみこん",
          "Family Computer",
          "FamilyComputer",
          "Famicom",
          "FC",
        ],
      },

      {
        _id: "C1Y1K5YH3",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "XdHIETDWn",
        urlID: "New-Nintendo-3DS",
        name: "Newニンテンドー3DS",
        searchKeywordsArr: [
          "New任天堂3DS",
          "New任天堂スリーディーエス",
          "ニューニンテンドー3DS",
          "ニューニンテンドースリーディーエス",
          "ニューニンテンドウ3DS",
          "ニューニンテンドウスリーディーエス",
          "ニューニンテンドオ3DS",
          "ニューニンテンドオスリーディーエス",
          "にゅーにんてんどー3DS",
          "にゅーにんてんどーすりーでぃーえす",
          "にゅーにんてんどう3DS",
          "にゅーにんてんどうすりーでぃーえす",
          "にゅーにんてんどお3DS",
          "にゅーにんてんどおすりーでぃーえす",
          "New Nintendo 3DS",
          "NewNintendo3DS",
          "NN3DS",
        ],
      },

      {
        _id: "PdwoBOlfL",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "MfGcqLKYE",
        urlID: "New-Nintendo-3DS-LL",
        name: "Newニンテンドー3DS LL",
        searchKeywordsArr: [
          "New任天堂3DS LL",
          "New任天堂スリーディーエスエルエル",
          "ニューニンテンドー3DS LL",
          "ニューニンテンドースリーディーエスエルエル",
          "ニューニンテンドウ3DS LL",
          "ニューニンテンドウスリーディーエスエルエル",
          "ニューニンテンドオ3DS LL",
          "ニューニンテンドオスリーディーエスエルエル",
          "にゅーにんてんどー3DS LL",
          "にゅーにんてんどーすりーでぃーえすえるえる",
          "にゅーにんてんどう3DS LL",
          "にゅーにんてんどうすりーでぃーえすえるえる",
          "にゅーにんてんどお3DS LL",
          "にゅーにんてんどおすりーでぃーえすえるえる",
          "New Nintendo 3DS LL",
          "NewNintendo3DSLL",
          "NN3DSLL",
        ],
      },

      {
        _id: "YvgkE6inK",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "qk9DiUwN-",
        urlID: "Nintendo-3DS",
        name: "ニンテンドー3DS",
        searchKeywordsArr: [
          "任天堂3DS",
          "任天堂スリーディーエス",
          "ニンテンドー3DS",
          "ニンテンドースリーディーエス",
          "ニンテンドウ3DS",
          "ニンテンドウスリーディーエス",
          "ニンテンドオ3DS",
          "ニンテンドオスリーディーエス",
          "にんてんどー3DS",
          "にんてんどーすりーでぃーえす",
          "にんてんどう3DS",
          "にんてんどうすりーでぃーえす",
          "にんてんどお3DS",
          "にんてんどおすりーでぃーえす",
          "Nintendo 3DS",
          "Nintendo3DS",
          "N3DS",
        ],
      },

      {
        _id: "io-6nML_1",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "_5hAACSkD",
        urlID: "Nintendo-3DS-LL",
        name: "ニンテンドー3DS LL",
        searchKeywordsArr: [
          "任天堂3DS LL",
          "任天堂スリーディーエス エルエル",
          "ニンテンドー3DS LL",
          "ニンテンドースリーディーエスエルエル",
          "ニンテンドウ3DS LL",
          "ニンテンドウスリーディーエスエルエル",
          "ニンテンドオ3DS LL",
          "ニンテンドオスリーディーエスエルエル",
          "にんてんどー3DS LL",
          "にんてんどーすりーでぃーえすえるえる",
          "にんてんどう3DS LL",
          "にんてんどうすりーでぃーえすえるえる",
          "にんてんどお3DS LL",
          "にんてんどおすりーでぃーえすえるえる",
          "Nintendo 3DS LL",
          "Nintendo3DSLL",
          "N3DSLL",
        ],
      },

      {
        _id: "0dQcRCGQT",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "gUbpQnI7S",
        urlID: "New-Nintendo-2DS-LL",
        name: "Newニンテンドー2DS LL",
        searchKeywordsArr: [
          "New任天堂2DS LL",
          "New任天堂ツーディーエスエルエル",
          "ニューニンテンドー2DS LL",
          "ニューニンテンドーツーディーエスエルエル",
          "ニューニンテンドウ2DS LL",
          "ニューニンテンドウツーディーエスエルエル",
          "ニューニンテンドオ2DS LL",
          "ニューニンテンドオツーディーエスエルエル",
          "にんてんどー2DS LL",
          "にゅーにんてんどーつーでぃーえすえるえる",
          "にゅーにんてんどう2DS LL",
          "にゅーにんてんどうつーでぃーえすえるえる",
          "にゅーにんてんどお2DS LL",
          "にゅーにんてんどおつーでぃーえすえるえる",
          "New Nintendo 2DS LL",
          "NewNintendo2DSLL",
          "NN2DSLL",
        ],
      },

      {
        _id: "o70D0LBKZ",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "cLpRfUcf5",
        urlID: "Nintendo-2DS",
        name: "ニンテンドー2DS",
        searchKeywordsArr: [
          "任天堂2DS",
          "任天堂ツーディーエス",
          "ニンテンドー2DS",
          "ニンテンドーツーディーエス",
          "ニンテンドウ2DS",
          "ニンテンドウツーディーエス",
          "ニンテンドオ2DS",
          "ニンテンドオツーディーエス",
          "にんてんどー2DS",
          "にんてんどーつーでぃーえす",
          "にんてんどう2DS",
          "にんてんどうつーでぃーえす",
          "にんてんどお2DS",
          "にんてんどおつーでぃーえす",
          "Nintendo 2DS",
          "Nintendo2DS",
          "N2DS",
        ],
      },

      {
        _id: "Uem6UalMW",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "HATpnt7sl",
        urlID: "Nintendo-DS",
        name: "ニンテンドーDS",
        searchKeywordsArr: [
          "任天堂DS",
          "任天堂ディーエス",
          "ニンテンドーDS",
          "ニンテンドーディーエス",
          "ニンテンドウDS",
          "ニンテンドウディーエス",
          "ニンテンドオDS",
          "ニンテンドオディーエス",
          "にんてんどーDS",
          "にんてんどーでぃーえす",
          "にんてんどうDS",
          "にんてんどうでぃーえす",
          "にんてんどおDS",
          "にんてんどおでぃーえす",
          "Nintendo DS",
          "NintendoDS",
          "NDS",
        ],
      },

      {
        _id: "Wqh5KttAD",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "2MLTBSCET",
        urlID: "Nintendo-DS-Lite",
        name: "ニンテンドーDS Lite",
        searchKeywordsArr: [
          "任天堂DS Lite",
          "任天堂ディーエスライト",
          "ニンテンドーDS Lite",
          "ニンテンドーディーエスライト",
          "ニンテンドウDS Lite",
          "ニンテンドウディーエスライト",
          "ニンテンドオDS Lite",
          "ニンテンドオディーエスライト",
          "にんてんどーDS Lite",
          "にんてんどーでぃーえすらいと",
          "にんてんどうDS Lite",
          "にんてんどうでぃーえすらいと",
          "にんてんどおDS Lite",
          "にんてんどおでぃーえすらいと",
          "Nintendo DS Lite",
          "NintendoDSLite",
          "NDSL",
        ],
      },

      {
        _id: "Nv6mHh_2I",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "b5VPDNMed",
        urlID: "Nintendo-DSi",
        name: "ニンテンドーDSi",
        searchKeywordsArr: [
          "任天堂DSi",
          "任天堂ディーエスアイ",
          "ニンテンドーDSi",
          "ニンテンドーディーエスアイ",
          "ニンテンドウDSi",
          "ニンテンドウディーエスアイ",
          "ニンテンドオDSi",
          "ニンテンドオディーエスアイ",
          "にんてんどーDSi",
          "にんてんどーでぃーえすあい",
          "にんてんどうDSi",
          "にんてんどうでぃーえすあい",
          "にんてんどおDSi",
          "にんてんどおでぃーえすあい",
          "Nintendo DSi",
          "NintendoDSi",
          "NDSi",
        ],
      },

      {
        _id: "uvmWxzgbz",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "kkOq54fXP",
        urlID: "Nintendo-DSi-LL",
        name: "ニンテンドーDSi LL",
        searchKeywordsArr: [
          "任天堂DSi LL",
          "任天堂ディーエスアイ エルエル",
          "ニンテンドーDSi LL",
          "ニンテンドーディーエスアイエルエル",
          "ニンテンドウDSi LL",
          "ニンテンドウディーエスアイエルエル",
          "ニンテンドオDSi LL",
          "ニンテンドオディーエスアイエルエル",
          "にんてんどーDSi LL",
          "にんてんどーでぃーえすあいえるえる",
          "にんてんどうDSi LL",
          "にんてんどうでぃーえすあいえるえる",
          "にんてんどおDSi LL",
          "にんてんどおでぃーえすあいえるえる",
          "Nintendo DSi LL",
          "NintendoDSiLL",
          "NDSiLL",
        ],
      },

      {
        _id: "4OkTt-VSM",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "AIvzEgDCd",
        urlID: "GAMEBOY-ADVANCE",
        name: "ゲームボーイアドバンス",
        searchKeywordsArr: [
          "ゲームボーイアドバンス",
          "げーむぼーいあどばんす",
          "GAMEBOY ADVANCE",
          "GAMEBOYADVANCE",
          "GBA",
        ],
      },

      {
        _id: "wlDy9Dqmv",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "o9bdsq5af",
        urlID: "VIRTUAL-BOY",
        name: "バーチャルボーイ",
        searchKeywordsArr: [
          "バーチャルボーイ",
          "ばーちゃるぼーい",
          "VIRTUAL BOY",
          "VIRTUALBOY",
          "VB",
        ],
      },

      {
        _id: "_z4DBLYNi",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "XBKalRRW7",
        urlID: "Game-Boy",
        name: "ゲームボーイ",
        searchKeywordsArr: [
          "ゲームボーイ",
          "げーむぼーい",
          "Game Boy",
          "GameBoy",
          "GB",
        ],
      },

      {
        _id: "aGcBHYjtR",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "HpmHVmZl_",
        urlID: "PlayStation-5",
        name: "PlayStation 5",
        searchKeywordsArr: [
          "プレイステーション5",
          "プレーステーション5",
          "プレステ5",
          "プレイステーション５",
          "プレーステーション５",
          "プレステ５",
          "プレイステーションファイブ",
          "プレーステーションファイブ",
          "プレステファイブ",
          "ぷれいすてーしょん5",
          "ぷれーすてーしょん5",
          "ぷれすて5",
          "ぷれいすてーしょん５",
          "ぷれーすてーしょん５",
          "ぷれすて５",
          "ぷれいすてーしょんふぁいぶ",
          "ぷれーすてーしょんふぁいぶ",
          "ぷれすてふぁいぶ",
          "Play Station 5",
          "PlayStation 5",
          "PlayStation5",
          "PS5",
        ],
      },

      {
        _id: "s2a_FhZiX",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "byyV8Ltdc",
        urlID: "PlayStation-5-Digital-Edition",
        name: "PlayStation 5 デジタル・エディション",
        searchKeywordsArr: [
          "プレイステーション5 デジタルエディション",
          "プレーステーション5 デジタルエディション",
          "プレステ5 デジタルエディション",
          "プレイステーション５ デジタルエディション",
          "プレーステーション５ デジタルエディション",
          "プレステ５デジタルエディション",
          "プレイステーションファイブデジタルエディション",
          "プレーステーションファイブデジタルエディション",
          "プレステファイブデジタルエディション",
          "ぷれいすてーしょん5でじたるえでぃしょん",
          "ぷれーすてーしょん5でじたるえでぃしょん",
          "ぷれすて5でじたるえでぃしょん",
          "ぷれいすてーしょん５でじたるえでぃしょん",
          "ぷれーすてーしょん５でじたるえでぃしょん",
          "ぷれすて５ でじたるえでぃしょん",
          "ぷれいすてーしょんふぁいぶでじたるえでぃしょん",
          "ぷれーすてーしょんふぁいぶでじたるえでぃしょん",
          "ぷれすてふぁいぶでじたるえでぃしょん",
          "Play Station 5 Digital Edition",
          "PlayStation 5 Digital Edition",
          "PlayStation5 Digital Edition",
          "PS5DE",
        ],
      },

      {
        _id: "FW76LaH_H",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "TdK3Oc-yV",
        urlID: "PlayStation-4",
        name: "PlayStation 4",
        searchKeywordsArr: [
          "プレイステーション4",
          "プレーステーション4",
          "プレステ4",
          "プレイステーション４",
          "プレーステーション４",
          "プレステ４",
          "プレイステーションフォー",
          "プレーステーションフォー",
          "プレステフォー",
          "ぷれいすてーしょん4",
          "ぷれーすてーしょん4",
          "ぷれすて4",
          "ぷれいすてーしょん４",
          "ぷれーすてーしょん４",
          "ぷれすて４",
          "ぷれいすてーしょんふぉー",
          "ぷれーすてーしょんふぉー",
          "ぷれすてふぉー",
          "Play Station 4",
          "PlayStation 4",
          "PlayStation4",
          "PS4",
        ],
      },

      {
        _id: "c2ZtNCPov",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "8dAGDVWLy",
        urlID: "PlayStation-4-Pro",
        name: "PlayStation 4 Pro",
        searchKeywordsArr: [
          "プレイステーション4 Pro",
          "プレーステーション4 Pro",
          "プレイステーション4 プロ",
          "プレステ4Pro",
          "プレステ4プロ",
          "プレイステーション４ Pro",
          "プレーステーション４ Pro",
          "プレステ４ Pro",
          "プレイステーションフォープロ",
          "プレーステーションフォープロ",
          "プレステフォープロ",
          "ぷれいすてーしょん4ぷろ",
          "ぷれーすてーしょん4ぷろ",
          "ぷれすて4ぷろ",
          "ぷれいすてーしょん４ぷろ",
          "ぷれーすてーしょん４ぷろ",
          "ぷれすて４ぷろ",
          "ぷれいすてーしょんふぉーぷろ",
          "ぷれーすてーしょんふぉーぷろ",
          "ぷれすてふぉーぷろ",
          "Play Station 4 Pro",
          "PlayStation 4 Pro",
          "PlayStation4Pro",
          "PS4Pro",
        ],
      },

      {
        _id: "4iGMasHh4",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "YNZ6nb1Ki",
        urlID: "PlayStation-3",
        name: "PlayStation 3",
        searchKeywordsArr: [
          "プレイステーション3",
          "プレーステーション3",
          "プレステ3",
          "プレイステーション３",
          "プレーステーション３",
          "プレステ３",
          "プレイステーションスリー",
          "プレーステーションスリー",
          "プレステスリー",
          "ぷれいすてーしょん3",
          "ぷれーすてーしょん3",
          "ぷれすて3",
          "ぷれいすてーしょん３",
          "ぷれーすてーしょん３",
          "ぷれすて３",
          "ぷれいすてーしょんすりー",
          "ぷれーすてーしょんすりー",
          "ぷれすてすりー",
          "Play Station 3",
          "PlayStation 3",
          "PlayStation3",
          "PS3",
        ],
      },

      {
        _id: "I2cKTLJNk",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "8RERfeQQ9",
        urlID: "PlayStation-2",
        name: "PlayStation 2",
        searchKeywordsArr: [
          "プレイステーション2",
          "プレーステーション2",
          "プレステ2",
          "プレイステーション２",
          "プレーステーション２",
          "プレステ２",
          "プレイステーションツー",
          "プレーステーションツー",
          "プレステツー",
          "ぷれいすてーしょん2",
          "ぷれーすてーしょん2",
          "ぷれすて2",
          "ぷれいすてーしょん２",
          "ぷれーすてーしょん２",
          "ぷれすて２",
          "ぷれいすてーしょんつー",
          "ぷれーすてーしょんつー",
          "ぷれすてつー",
          "Play Station 2",
          "PlayStation 2",
          "PlayStation2",
          "PS2",
        ],
      },

      {
        _id: "zSvRzOp0V",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "zB4ivcsqM",
        urlID: "PlayStation",
        name: "PlayStation",
        searchKeywordsArr: [
          "プレイステーション",
          "プレーステーション",
          "プレステ",
          "ぷれいすてーしょん",
          "ぷれーすてーしょん",
          "ぷれすて",
          "Play Station",
          "PlayStation",
          "PS",
        ],
      },

      {
        _id: "u-8ylTavB",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "rWnfDngrY",
        urlID: "PlayStation-VR",
        name: "PlayStation VR",
        searchKeywordsArr: [
          "プレイステーション ヴィーアール",
          "プレイステーション ブイアール",
          "プレーステーション ヴィーアール",
          "プレーステーション ブイアール",
          "プレステヴィーアール",
          "プレステブイアール",
          "ぷれいすてーしょんゔぃーあーる",
          "ぷれいすてーしょんぶいあーる",
          "ぷれーすてーしょんゔぃーあーる",
          "ぷれーすてーしょんぶいあーる",
          "ぷれすてゔぃーあーる",
          "ぷれすてぶいあーる",
          "Play Station VR",
          "PlayStation VR",
          "PSVR",
        ],
      },

      {
        _id: "_3asC9ODV",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "mOpBZsQBm",
        urlID: "PlayStation-Vita",
        name: "PlayStation Vita",
        searchKeywordsArr: [
          "プレイステーション・ヴィータ",
          "プレイステーションヴィータ",
          "プレーステーション・ヴィータ",
          "プレーステーションヴィータ",
          "プレステヴィータ",
          "プレイステーション・ビータ",
          "プレイステーションビータ",
          "プレーステーション・ビータ",
          "プレーステーションビータ",
          "プレステビータ",
          "ぷれいすてーしょん・ゔぃーた",
          "ぷれいすてーしょんゔぃーた",
          "ぷれーすてーしょん・ゔぃーた",
          "ぷれーすてーしょんゔぃーた",
          "ぷれすて・ゔぃーた",
          "ぷれすてゔぃーた",
          "ぷれいすてーしょん・びーた",
          "ぷれいすてーしょんびーた",
          "ぷれーすてーしょん・びーた",
          "ぷれーすてーしょんびーた",
          "ぷれすて・びーた",
          "ぷれすてびーた",
          "Play Station Vita",
          "PlayStation Vita",
          "PlayStationVita",
          "PS Vita",
          "PSVita",
          "PSV",
        ],
      },

      {
        _id: "_TvYZ22wz",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "mSNE9IGXN",
        urlID: "PlayStation-Vita-TV",
        name: "PlayStation Vita TV",
        searchKeywordsArr: [
          "プレイステーション・ヴィータ ティービー",
          "プレイステーションヴィータ ティーヴィー",
          "プレーステーション・ヴィータ ティーヴィー",
          "プレーステーションヴィータ ティーヴィー",
          "プレステヴィータティーヴィー",
          "プレイステーション・ビータ ティーヴィー",
          "プレイステーションビータティーヴィー",
          "プレーステーション・ビータ ティーヴィー",
          "プレーステーションビータティーヴィー",
          "プレステビータティーヴィー",
          "ぷれいすてーしょん・ゔぃーた てぃーゔぃー",
          "ぷれいすてーしょんゔぃーたてぃーゔぃー",
          "ぷれーすてーしょん・ゔぃーた てぃーゔぃー",
          "ぷれーすてーしょんゔぃーたてぃーゔぃー",
          "ぷれすて・ゔぃーた てぃーゔぃー",
          "ぷれすてゔぃーたてぃーゔぃー",
          "ぷれいすてーしょん・びーた てぃーゔぃー",
          "ぷれいすてーしょんびーたてぃーゔぃー",
          "ぷれーすてーしょん・びーた てぃーゔぃー",
          "ぷれーすてーしょんびーたてぃーゔぃー",
          "ぷれすて・びーた てぃーゔぃー",
          "ぷれすてびーたてぃーゔぃー",
          "Play Station Vita TV",
          "PlayStation Vita TV",
          "PlayStationVitaTV",
          "PS Vita TV",
          "PSVitaTV",
          "PSVTV",
        ],
      },

      {
        _id: "nMhdlLGm6",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "efIOgWs3N",
        urlID: "PlayStation-Portable",
        name: "PlayStation Portable",
        searchKeywordsArr: [
          "プレイステーション・ポータブル",
          "プレイステーションポータブル",
          "プレーステーション・ポータブル",
          "プレーステーションポータブル",
          "プレステポータブル",
          "ぷれいすてーしょん・ぽーたぶる",
          "ぷれいすてーしょんぽーたぶる",
          "ぷれーすてーしょん・ぽーたぶる",
          "ぷれーすてーしょんぽーたぶる",
          "ぷれすて・ぽーたぶる",
          "ぷれすてぽーたぶる",
          "Play Station Portable",
          "PlayStation Portable",
          "PlayStationPortable",
          "PS Portable",
          "PSPortable",
          "PSP",
        ],
      },

      {
        _id: "sK9V0tq0z",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "I7RARV3BG",
        urlID: "Xbox-Series-X",
        name: "Xbox Series X",
        searchKeywordsArr: [
          "エックスボックスシリーズエックス",
          "エックスボックスエックス",
          "えっくすぼっくすしりーずえっくす",
          "えっくすぼっくすえっくす",
          "Xbox Series X",
          "XboxSeriesX",
          "Xbox X",
          "XboxX",
          "XX",
        ],
      },

      {
        _id: "KE7vrrnfw",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "Oavrp9S42",
        urlID: "Xbox-Series-S",
        name: "Xbox Series S",
        searchKeywordsArr: [
          "エックスボックスシリーズエス",
          "エックスボックスエス",
          "えっくすぼっくすしりーずえす",
          "えっくすぼっくすえす",
          "Xbox Series S",
          "XboxSeriesS",
          "Xbox S",
          "XboxS",
          "XS",
        ],
      },

      {
        _id: "vk2kF94Ks",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "uPqoiXA_8",
        urlID: "Xbox-One",
        name: "Xbox One",
        searchKeywordsArr: [
          "エックスボックスワン",
          "エックスボックスイチ",
          "えっくすぼっくすわん",
          "えっくすぼっくすいち",
          "Xbox One",
          "XboxOne",
          "Xbox 1",
          "Xbox1",
          "XO",
        ],
      },

      {
        _id: "QakRmupL5",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "XA-5bmGgf",
        urlID: "Xbox-One-S",
        name: "Xbox One S",
        searchKeywordsArr: [
          "エックスボックスワンエス",
          "エックスボックスイチエス",
          "えっくすぼっくすわんえす",
          "えっくすぼっくすいちえす",
          "Xbox One S",
          "XboxOneS",
          "Xbox 1 S",
          "Xbox1S",
          "XOS",
        ],
      },

      {
        _id: "n5mZHQKdN",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "s5tMWj5TX",
        urlID: "Xbox-One-X",
        name: "Xbox One X",
        searchKeywordsArr: [
          "エックスボックスワンエックス",
          "エックスボックスイチエックス",
          "えっくすぼっくすわんえっくす",
          "えっくすぼっくすいちえっくす",
          "Xbox One X",
          "XboxOneX",
          "Xbox 1 X",
          "Xbox1X",
          "XOX",
        ],
      },

      {
        _id: "qD3nhDhxn",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "QNxk7c-ZO",
        urlID: "Xbox-One-S-All-Digital-Edition",
        name: "Xbox One S All Digital Edition",
        searchKeywordsArr: [
          "エックスボックスワンエスオールデジタルエディション",
          "エックスボックスイチエスオールデジタルエディション",
          "えっくすぼっくすわんえすおーるでじたるえでぃしょん",
          "えっくすぼっくすいちえすおーるでじたるえでぃしょん",
          "Xbox One S All Digital Edition",
          "XboxOneSAllDigitalEdition",
          "Xbox 1 S All Digital Edition",
          "Xbox1SAllDigitalEdition",
          "XOSADE",
        ],
      },

      {
        _id: "NiozcDYe-",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "08Qp5KxPA",
        urlID: "Xbox-360",
        name: "Xbox 360",
        searchKeywordsArr: [
          "エックスボックス360",
          "エックスボックス３６０",
          "エックスボックスサンロクマル",
          "エックスボックスサンビャクロクジュウ",
          "えっくすぼっくす360",
          "えっくすぼっくす３６０",
          "えっくすぼっくすさんろくまる",
          "えっくすぼっくすさんびゃくろくじゅう",
          "Xbox 360",
          "Xbox360",
          "X360",
        ],
      },

      {
        _id: "kUuO7ko_-",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "lCMv0vbVE",
        urlID: "Xbox-360-Elite",
        name: "Xbox 360 エリート",
        searchKeywordsArr: [
          "エックスボックス360 エリート",
          "エックスボックス３６０ エリート",
          "エックスボックスサンロクマルエリート",
          "エックスボックスサンビャクロクジュウエリート",
          "えっくすぼっくす360えりーと",
          "えっくすぼっくす３６０えりーと",
          "えっくすぼっくすさんろくまるえりーと",
          "えっくすぼっくすさんびゃくろくじゅうえりーと",
          "Xbox 360 Elite",
          "Xbox360Elite",
          "X360Elite",
        ],
      },

      {
        _id: "RDpDhhqyD",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "CH5XjDxmE",
        urlID: "Xbox-360-S",
        name: "Xbox 360 S",
        searchKeywordsArr: [
          "エックスボックス360 S",
          "エックスボックス３６０ S",
          "エックスボックスサンロクマルエス",
          "エックスボックスサンビャクロクジュウエス",
          "えっくすぼっくす360えす",
          "えっくすぼっくす３６０えす",
          "えっくすぼっくすさんろくまるえす",
          "えっくすぼっくすさんびゃくろくじゅうえす",
          "Xbox 360 S",
          "Xbox360S",
          "X360S",
        ],
      },

      {
        _id: "SADsmkUqW",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "iJoiTR3Lp",
        urlID: "Xbox-360-E",
        name: "Xbox 360 E",
        searchKeywordsArr: [
          "エックスボックス360 E",
          "エックスボックス３６０ E",
          "エックスボックスサンロクマルイー",
          "エックスボックスサンビャクロクジュウイー",
          "えっくすぼっくす360いー",
          "えっくすぼっくす３６０いー",
          "えっくすぼっくすさんろくまるいー",
          "えっくすぼっくすさんびゃくろくじゅういー",
          "Xbox 360 E",
          "Xbox360E",
          "X360E",
        ],
      },

      {
        _id: "uQcBzP5cS",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "78lc0hPjL",
        urlID: "Xbox",
        name: "Xbox",
        searchKeywordsArr: ["エックスボックス", "えっくすぼっくす", "Xbox"],
      },

      {
        _id: "yuQuOO-iu",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "k1VYYQddf",
        urlID: "Oculus-Rift",
        name: "Oculus Rift",
        searchKeywordsArr: [
          "オキュラスリフト",
          "おきゅらすりふと",
          "Oculus Rift",
          "OR",
        ],
      },

      {
        _id: "O8Qod3y5C",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "1yDR63Cqk",
        urlID: "Oculus-Go",
        name: "Oculus Go",
        searchKeywordsArr: [
          "オキュラスゴー",
          "おきゅらすごー",
          "Oculus Go",
          "OG",
        ],
      },

      {
        _id: "1xrOufJWW",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "Io01c4kQE",
        urlID: "Oculus-Rift-S",
        name: "Oculus Rift S",
        searchKeywordsArr: [
          "オキュラスリフトエス",
          "おきゅらすりふとえす",
          "Oculus Rift S",
          "ORS",
        ],
      },

      {
        _id: "_EG00QFGH",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "ATC0oAmn9",
        urlID: "Oculus-Quest",
        name: "Oculus Quest",
        searchKeywordsArr: [
          "オキュラスクエスト",
          "おきゅらすくえすと",
          "Oculus Quest",
          "OQ",
        ],
      },

      {
        _id: "CiOx71u04",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "_QEtypbLu",
        urlID: "Oculus-Quest-2",
        name: "Oculus Quest 2",
        searchKeywordsArr: [
          "オキュラスクエスト2",
          "おきゅらすくえすと2",
          "Oculus Quest 2",
          "OQ2",
        ],
      },

      {
        _id: "53gIjhxmL",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "oGZmbXHZf",
        urlID: "HTC-Vive",
        name: "HTC Vive",
        searchKeywordsArr: [
          "エイチティーシーバイブ",
          "エッチティーシーバイブ",
          "えいちてぃーしーばいぶ",
          "えっちてぃーしーばいぶ",
          "HTC Vive",
          "HTCV",
        ],
      },

      {
        _id: "ZNZdymLyq",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "6yFmpXAV6",
        urlID: "HTC-Vive-Pro",
        name: "HTC Vive Pro",
        searchKeywordsArr: [
          "エイチティーシーバイブプロ",
          "エッチティーシーバイブプロ",
          "えいちてぃーしーばいぶぷろ",
          "えっちてぃーしーばいぶぷろ",
          "HTC Vive Pro",
          "HTCVP",
        ],
      },

      {
        _id: "qFXtXjxAl",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "djrNBolR4",
        urlID: "HTC-Vive-Cosmos",
        name: "HTC Vive Cosmos",
        searchKeywordsArr: [
          "エイチティーシーバイブコスモス",
          "エッチティーシーバイブコスモス",
          "えいちてぃーしーばいぶこすもす",
          "えっちてぃーしーばいぶこすもす",
          "HTC Vive Cosmos",
          "HTCVC",
        ],
      },

      {
        _id: "iZ7MmkuQw",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "Kj_Djheqt",
        urlID: "Dreamcast",
        name: "ドリームキャスト",
        searchKeywordsArr: [
          "ドリームキャスト",
          "ドリキャス",
          "どりーむきゃすと",
          "どりきゃす",
          "Dreamcast",
          "DC",
        ],
      },

      {
        _id: "9zeb0m_13",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "lBSGQeGmx",
        urlID: "SEGA-SATURN",
        name: "セガサターン",
        searchKeywordsArr: [
          "セガサターン",
          "せがさたーん",
          "SEGA SATURN",
          "SEGASATURN",
          "SS",
        ],
      },

      {
        _id: "KVvkuvZF2",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "2yKF4qXAw",
        urlID: "MEGA-DRIVE",
        name: "メガドライブ",
        searchKeywordsArr: [
          "メガドライブ",
          "めがどらいぶ",
          "MEGA DRIVE",
          "MEGADRIVE",
          "MD",
        ],
      },

      {
        _id: "adzG1JLYu",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "KyOSlwcLk",
        urlID: "PC-Engine",
        name: "PCエンジン",
        searchKeywordsArr: [
          "PCエンジン",
          "ピーシーエンジン",
          "ぴーしーえんじん",
          "PC Engine",
          "PCEngine",
          "PCE",
        ],
      },

      {
        _id: "QQtnx7FEN",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "qBsY8y0nO",
        urlID: "PC-Engine-GT",
        name: "PCエンジンGT",
        searchKeywordsArr: [
          "PCエンジンGT",
          "ピーシーエンジンジーティー",
          "ぴーしーえんじんじーてぃー",
          "PC Engine GT",
          "PCEngineGT",
          "PCEGT",
        ],
      },

      {
        _id: "8oGNQ2hMR",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "Z4R-SPN2-",
        urlID: "NEO-GEO",
        name: "ネオジオ",
        searchKeywordsArr: [
          "ネオジオ",
          "ねおじお",
          "NEO GEO",
          "NEOGEO",
          "NEO・GEO",
          "NG",
        ],
      },

      {
        _id: "IcH7HG2f7",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "u3SQqtJ-u",
        urlID: "NEOGEO-POCKET",
        name: "ネオジオポケット",
        searchKeywordsArr: [
          "ネオジオポケット",
          "ねおじおぽけっと",
          "NEO GEO POCKET",
          "NEOGEO POCKET",
          "NEOGEOPOCKET",
          "NEO・GEO POCKET",
          "NGP",
        ],
      },

      {
        _id: "9Z6Wh_JJ2",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "sO2U2PzHl",
        urlID: "GAME-GEAR",
        name: "ゲームギア",
        searchKeywordsArr: [
          "ゲームギア",
          "げーむぎあ",
          "GAME GEAR",
          "GAMEGEAR",
          "GG",
        ],
      },

      {
        _id: "S2Q_3MrBo",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "PYIE0rv_e",
        urlID: "Wonder-Swan",
        name: "ワンダースワン",
        searchKeywordsArr: [
          "ワンダースワン",
          "わんだーすわん",
          "Wonder Swan",
          "WonderSwan",
          "WS",
        ],
      },

      {
        _id: "8hmwbso_y",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "ehBtuyjma",
        urlID: "PC-FX",
        name: "PC-FX",
        searchKeywordsArr: [
          "PC-FX",
          "ピーシーエフエックス",
          "ぴーしーえふえっくす",
          "PC FX",
          "PCFX",
        ],
      },

      {
        _id: "0J3jIYcCN",
        createdDate: ISO8601,
        updatedDate: ISO8601,
        language: "ja",
        country: "JP",
        hardwareID: "si2_UYLdW",
        urlID: "3DO",
        name: "3DO",
        searchKeywordsArr: ["3DO", "スリーディーオー", "すりーでぃーおー"],
      },
    ];

    // --------------------------------------------------
    //   Delete & Insert
    // --------------------------------------------------

    await ModelHardwares.deleteMany({ reset: true });
    await ModelHardwares.insertMany({ saveArr });

    // --------------------------------------------------
    //   upsert
    // --------------------------------------------------

    // const conditionObj = {
    //   _id: lodashGet(usersObj, ['_id'], '')
    // };

    // const saveObj = {
    //   $set: {
    //     loginID,
    //     loginPassword: bcrypt.hashSync(loginPassword, 10),
    //   }
    // };

    // await ModelUsers.upsert({ conditionObj, saveObj });

    // --------------------------------------------------
    //   console.log
    // --------------------------------------------------

    // console.log(`
    //   ----------------------------------------\n
    //   pages/api/v2/administration/index.js
    // `);

    // console.log(chalk`
    //   userID: {green ${userID}}
    //   loginID: {green ${loginID}}
    //   loginPassword: {green ${loginPassword}}
    // `);

    // console.log(`
    //   ----- usersObj -----\n
    //   ${util.inspect(usersObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- conditionObj -----\n
    //   ${util.inspect(conditionObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // console.log(`
    //   ----- saveObj -----\n
    //   ${util.inspect(saveObj, { colors: true, depth: null })}\n
    //   --------------------\n
    // `);

    // ---------------------------------------------
    //   Success
    // ---------------------------------------------

    return res.status(200).json({});
  } catch (errorObj) {
    // ---------------------------------------------
    //   Log
    // ---------------------------------------------

    const resultErrorObj = returnErrorsArr({
      errorObj,
      endpointID: "hazd8DMIg",
      users_id: loginUsers_id,
      ip,
      userAgent,
      requestParametersObj,
    });

    // --------------------------------------------------
    //   Return JSON Object / Error
    // --------------------------------------------------

    return res.status(statusCode).json(resultErrorObj);
  }
};

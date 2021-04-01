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

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

// ---------------------------------------------
//   Material UI
// ---------------------------------------------

// import Avatar from '@material-ui/core/Avatar';

// ---------------------------------------------
//   Material UI / Icons
// ---------------------------------------------

// import IconGrade from '@material-ui/icons/Grade';
// import IconPC from '@material-ui/icons/LaptopMac';

// --------------------------------------------------
//   Emotion
//   https://emotion.sh/docs/composition
// --------------------------------------------------

// const cssAvatar = css`
//   && {
//     width: 32px;
//     height: 32px;
//     line-height: 1;
//     background-color: #003791;
//   }
// `;

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

  const { _id, urlID, name } = props;

  // --------------------------------------------------
  //   必要な情報がない場合、空のコンポーネントを返す
  // --------------------------------------------------

  if (!_id && !urlID && !name) {
    return null;
  }

  // --------------------------------------------------
  //   Color
  // --------------------------------------------------

  let colorLine =
    "background-image: linear-gradient(25deg, #f80014, #ff7a4f, #ffbd8b, #fcfccb);";
  let colorText =
    "background-image: linear-gradient(25deg, #f80014, #ff7a4f, #ffbd8b, #fcfccb);";

  if (_id === "MuK2dKVpn") {
    // ---------------------------------------------
    //   special / エデンの民
    // ---------------------------------------------

    colorLine =
      "background-image: linear-gradient(135deg, #704308 0%, #ffce08 40%, #e1ce08 60%, #704308 100%);";
    colorText =
      "background-image: linear-gradient(135deg, #b8751e 0%, #ffce08 37%, #fefeb2 47%, #fafad6 50%, #fefeb2 53%, #e1ce08 63%, #b8751e 100%);";

    // ---------------------------------------------
    //   level-count / チキン
    // ---------------------------------------------
  } else if (_id === "065apjMq1") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #dd7e28, #e2a537, #e4ca46, #e2ef56);";

    // ---------------------------------------------
    //   level-count / 駄犬
    // ---------------------------------------------
  } else if (_id === "oZlexPqhS") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #0f8ec5, #89b09e, #bfd470, #eafb1f);";

    // ---------------------------------------------
    //   level-count / ネコ
    // ---------------------------------------------
  } else if (_id === "FM8hGmeqv") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #dd526c, #e88787, #f0b7a4, #f3e5c1);";

    // ---------------------------------------------
    //   level-count / うさぎ
    // ---------------------------------------------
  } else if (_id === "GjGPfC8e1") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #acadb7, #c0c1bf, #d3d6c8, #e7ebd0);";

    // ---------------------------------------------
    //   level-count / 村人
    // ---------------------------------------------
  } else if (_id === "MYLwdOLD1") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #d6682a, #e08656, #e6a480, #e8c1ac);";

    // ---------------------------------------------
    //   level-count / お調子者
    // ---------------------------------------------
  } else if (_id === "XdNCO6eIe") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #30e7aa, #9ce286, #d4dc5f, #ffd52c);";

    // ---------------------------------------------
    //   level-count / キュート
    // ---------------------------------------------
  } else if (_id === "0lmhBTKPF") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff229f, #ee64ae, #d889bd, #bca8cc);";

    // ---------------------------------------------
    //   level-count / スクラップ
    // ---------------------------------------------
  } else if (_id === "VN3reZuRi") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9a434c, #bb7a65, #dab07f, #f8e89a);";

    // ---------------------------------------------
    //   level-count / 冒険者
    // ---------------------------------------------
  } else if (_id === "NwRla-9WG") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9498af, #91b3bb, #8acfc6, #7eead2);";

    // ---------------------------------------------
    //   level-count / 型落ち
    // ---------------------------------------------
  } else if (_id === "C00pgN_Xn") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #b48f75, #c8a28f, #ddb5aa, #f1c8c5);";

    // ---------------------------------------------
    //   level-count / 熱血漢
    // ---------------------------------------------
  } else if (_id === "BWqIWFilB") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #fc0027, #fd3247, #fc4a66, #f95d85);";

    // ---------------------------------------------
    //   level-count / VIP
    // ---------------------------------------------
  } else if (_id === "AW2KhpcxM") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ee2713, #f26b15, #f39a19, #f0c41e);";

    // ---------------------------------------------
    //   level-count / メンヘラ
    // ---------------------------------------------
  } else if (_id === "nxZrZpuiy") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff374e, #df7086, #ac95c1, #12b3ff);";

    // ---------------------------------------------
    //   level-count / お尋ね者
    // ---------------------------------------------
  } else if (_id === "h5b34wdsc") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #8640d5, #7e6fda, #6c96de, #46bbe2);";

    // ---------------------------------------------
    //   level-count / イエスマン
    // ---------------------------------------------
  } else if (_id === "QEd4nWllx") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #959b8a, #a8bb72, #b6dd53, #c2ff13);";

    // ---------------------------------------------
    //   level-count / 風紀委員
    // ---------------------------------------------
  } else if (_id === "YC0hOO6mu") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #42902f, #6cb439, #96d944, #c0ff4f);";

    // ---------------------------------------------
    //   level-count / ラブリー
    // ---------------------------------------------
  } else if (_id === "pRR5Qc8oO") {
    //background-image: linear-gradient(25deg, #ff072c, #fe4650, #fa6575, #f37f9a)
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #fe003e, #ff4566, #fd6690, #f681bb);";

    // ---------------------------------------------
    //   level-count / 逃亡者
    // ---------------------------------------------
  } else if (_id === "-VG1v7kcD") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #19d248, #89b66f, #ba958f, #df67ad);";

    // ---------------------------------------------
    //   level-count / バトルクライ
    // ---------------------------------------------
  } else if (_id === "kdEKzT2du") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #df0735, #ef7334, #fab32d, #ffef19);";

    // ---------------------------------------------
    //   level-count / 秘密兵器
    // ---------------------------------------------
  } else if (_id === "nowtpqr6_") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #c3342d, #d47366, #dca9a4, #d8dfe6);";

    // ---------------------------------------------
    //   level-count / もふもふ
    // ---------------------------------------------
  } else if (_id === "yAGGRAkFG") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #d9928b, #e8b6b0, #f5dad7, #ffffff);";

    // ---------------------------------------------
    //   level-count / サイレント
    // ---------------------------------------------
  } else if (_id === "T8yCXNXn1") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #888fa2, #8ab0b5, #88d2c8, #81f5dc);";

    // ---------------------------------------------
    //   level-count / ジョーカー
    // ---------------------------------------------
  } else if (_id === "jDUBpaZs4") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9825e6, #bd58e6, #de82e4, #fcaae2);";

    // ---------------------------------------------
    //   level-count / 天下無双
    // ---------------------------------------------
  } else if (_id === "2ZvB6qs8O") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f43303, #f65c01, #f77a01, #f79502);";

    // ---------------------------------------------
    //   level-count / サイコパス
    // ---------------------------------------------
  } else if (_id === "gpABkVPwE") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #1ba56c, #82a769, #bda565, #f2a062);";

    // ---------------------------------------------
    //   level-count / スカイハイ
    // ---------------------------------------------
  } else if (_id === "RZmgRzPkb") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #aaafb2, #98c6c7, #7edddc, #4df4f2);";

    // ---------------------------------------------
    //   level-count / 海賊王
    // ---------------------------------------------
  } else if (_id === "OQbA1CIGZ") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #413fc9, #6e76cf, #8aaed4, #9ee7d6);";

    // ---------------------------------------------
    //   level-count / エンペラー
    // ---------------------------------------------
  } else if (_id === "0c00gASC1") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #cb8d43, #dba53c, #ebbd31, #fad51d);";

    // ---------------------------------------------
    //   level-count / 宇宙人
    // ---------------------------------------------
  } else if (_id === "N1uUsUmpP") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #60a8c3, #9bab9c, #c0ae74, #ddb246);";

    // ---------------------------------------------
    //   level-count / デンジャラスクイーン
    // ---------------------------------------------
  } else if (_id === "9V_XbaxwZ") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #fa1c4a, #fa5b70, #f68399, #eca5c3);";

    // ---------------------------------------------
    //   level-count / レジェンド
    // ---------------------------------------------
  } else if (_id === "TrSEsmN7h") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f1991c, #eeb221, #eacb26, #e3e32c);";

    // ---------------------------------------------
    //   level-count / 不死
    // ---------------------------------------------
  } else if (_id === "XkgxqdmPp") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #92463f, #b17d4e, #cfb45c, #ebed69);";

    // ---------------------------------------------
    //   level-count / 異界の扉
    // ---------------------------------------------
  } else if (_id === "xVu0pGDtI") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #59545b, #8d827f, #c5b3a5, #ffe6cd);";

    // ---------------------------------------------
    //   level-count / ファッションリーダー
    // ---------------------------------------------
  } else if (_id === "3hdye-b-T") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f24039, #d48c4e, #a4c066, #29ed80);";

    // ---------------------------------------------
    //   level-count / 伝説のヒーロー
    // ---------------------------------------------
  } else if (_id === "gmLjWaOPk") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #312be8, #6771e9, #7eb1e7, #82f2e3);";

    // ---------------------------------------------
    //   level-count / イージス
    // ---------------------------------------------
  } else if (_id === "5WLv0C11_") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ca6918, #e29659, #f3c496, #fff3d6);";

    // ---------------------------------------------
    //   level-count / お掃除ロボ
    // ---------------------------------------------
  } else if (_id === "0I1ULpaSC") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #caa0e8, #b2c1c9, #8fdfa9, #4ffa85);";

    // ---------------------------------------------
    //   level-count / クッキー
    // ---------------------------------------------
  } else if (_id === "jl3skqUCw") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ae693a, #c99169, #e1ba9a, #f7e4ce);";

    // ---------------------------------------------
    //   level-count / 冥界の王
    // ---------------------------------------------
  } else if (_id === "lMahzRskP") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff3a35, #e25a6c, #b970a2, #7481da);";

    // ---------------------------------------------
    //   level-count / 混沌の女王
    // ---------------------------------------------
  } else if (_id === "d5wM-NjJ6") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ef5c33, #d28069, #a59d9e, #41b6d5);";

    // ---------------------------------------------
    //   level-count / ブルーローズ
    // ---------------------------------------------
  } else if (_id === "tWuUZX5gC") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #665eff, #6285ef, #4fa8df, #00cacd);";

    // ---------------------------------------------
    //   level-count / ノブレス・オブリージュ
    // ---------------------------------------------
  } else if (_id === "quNmsBMAv") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ea6b3d, #de746d, #cd7e9c, #b287cb);";

    // ---------------------------------------------
    //   level-count / 魔法少女
    // ---------------------------------------------
  } else if (_id === "kzPLdbzW8") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e41ea9, #e57a91, #dfb373, #cfe64a);";

    // ---------------------------------------------
    //   account-count-day / ランナー
    // ---------------------------------------------
  } else if (_id === "rYAf6jFYK") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #3e8743, #46aa78, #45cfaf, #33f5e8);";

    // ---------------------------------------------
    //   account-count-day / ゲーマー
    // ---------------------------------------------
  } else if (_id === "8z7LyZQ_5") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff2312, #fa7421, #f1a733, #e0d347);";

    // ---------------------------------------------
    //   account-count-day / 鉄人
    // ---------------------------------------------
  } else if (_id === "W8sbxpWTe") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9aee1e, #a3d979, #a0c5b5, #8eb1ee);";

    // ---------------------------------------------
    //   account-count-day / 古老
    // ---------------------------------------------
  } else if (_id === "QZbmznsqU") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e87771, #c89b94, #98bab8, #1ad6dd);";

    // ---------------------------------------------
    //   account-count-day / 求道者
    // ---------------------------------------------
  } else if (_id === "LOUgnlj36") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #3057e8, #5688d6, #5bb9c3, #44eaac);";

    // ---------------------------------------------
    //   account-count-day / タイムイーター
    // ---------------------------------------------
  } else if (_id === "L_p3lJfig") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff101a, #e28939, #afc85d, #05ff83);";

    // ---------------------------------------------
    //   account-count-day / 永遠の旅人
    // ---------------------------------------------
  } else if (_id === "CBZfxt-5L") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff4d1b, #f09222, #d9c72c, #b2f639);";

    // ---------------------------------------------
    //   account-count-day / 無限回廊
    // ---------------------------------------------
  } else if (_id === "yHSTXY0Uv") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #c2232f, #b6656b, #9693ab, #18bdef);";

    // ---------------------------------------------
    //   account-count-day / タイムトラベラー
    // ---------------------------------------------
  } else if (_id === "DLV53cJSO") {
    colorLine = colorText =
      "background-image: linear-gradient(301deg, #ffd338, #dce27c, #a6f1b6, #06ffee);";

    // ---------------------------------------------
    //   login-count / スライム
    // ---------------------------------------------
  } else if (_id === "tegNhho16") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #2971e4, #378de1, #39a9de, #2fc6da);";

    // ---------------------------------------------
    //   login-count / ピクシー
    // ---------------------------------------------
  } else if (_id === "xvY5bY9yH") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ec363b, #f56a56, #fb9372, #fdb990);";

    // ---------------------------------------------
    //   login-count / マーメイド
    // ---------------------------------------------
  } else if (_id === "GPoSK78Rj") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #248ab9, #27a4c1, #24bec9, #18d9d1);";

    // ---------------------------------------------
    //   login-count / エルフ
    // ---------------------------------------------
  } else if (_id === "TIucZj9SX") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #41d4a6, #9bd585, #d1d560, #fcd430);";

    // ---------------------------------------------
    //   login-count / ドワーフ
    // ---------------------------------------------
  } else if (_id === "zqAxK8mRN") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f2120f, #ee6649, #e2967f, #c7c0b8);";

    // ---------------------------------------------
    //   login-count / ゴースト
    // ---------------------------------------------
  } else if (_id === "KIYiKgZFQ") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #b25e22, #b27b47, #ad976c, #a1b291);";

    // ---------------------------------------------
    //   login-count / トロール
    // ---------------------------------------------
  } else if (_id === "gXzXHvnPG") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e85504, #eb723d, #ec8d66, #e8a690);";

    // ---------------------------------------------
    //   login-count / セイレーン
    // ---------------------------------------------
  } else if (_id === "CF-BqxD_-") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9ba5cc, #87bed2, #69d7d8, #29efde);";

    // ---------------------------------------------
    //   login-count / サキュバス
    // ---------------------------------------------
  } else if (_id === "4CjPpkvKH") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e2274a, #eb5066, #f26f83, #f78ba2);";

    // ---------------------------------------------
    //   login-count / ヴァンパイア
    // ---------------------------------------------
  } else if (_id === "d1Yv3ixS_") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #a81012, #c51735, #e22058, #ff297b);";

    // ---------------------------------------------
    //   login-count / ユニコーン
    // ---------------------------------------------
  } else if (_id === "W71yk14CX") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #00afcd, #7bc5d9, #b9dae4, #f0f0f0);";

    // ---------------------------------------------
    //   login-count / ケルベロス
    // ---------------------------------------------
  } else if (_id === "v4IWCI0K9") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #b7767f, #c8a3a8, #d6d0d3, #e0ffff);";

    // ---------------------------------------------
    //   login-count / メデューサ
    // ---------------------------------------------
  } else if (_id === "-RbTjxeMB") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e400b3, #c65ab1, #a37dae, #7596ac);";

    // ---------------------------------------------
    //   login-count / フェニックス
    // ---------------------------------------------
  } else if (_id === "P81q63Gax") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #d1175c, #dc6e81, #dfa9a8, #d9e1d1);";

    // ---------------------------------------------
    //   login-count / ドラゴン
    // ---------------------------------------------
  } else if (_id === "JQ4EdkmVY") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #a8a8be, #8fc0a6, #6ad58d, #00ea71);";

    // ---------------------------------------------
    //   login-count / ゾンビ
    // ---------------------------------------------
  } else if (_id === "u5khnDn8e") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #5ba54c, #86bf87, #add8c2, #d2f2ff);";

    // ---------------------------------------------
    //   login-count / アンデッド
    // ---------------------------------------------
  } else if (_id === "wVfpH2aLB") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #695069, #88778f, #a8a1b7, #c9cce0);";

    // ---------------------------------------------
    //   login-count / デビル
    // ---------------------------------------------
  } else if (_id === "jmoIcgxpY") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #675a6e, #968d9c, #c9c4cc, #fdfdfe);";

    // ---------------------------------------------
    //   login-count / 妖精
    // ---------------------------------------------
  } else if (_id === "yfbgYncsB") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #23853c, #31ac78, #35d5b6, #27fff8);";

    // ---------------------------------------------
    //   login-count / 精霊
    // ---------------------------------------------
  } else if (_id === "nLvby1IsJ") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #1873fb, #439cf3, #4cc6ea, #41f1e0);";

    // ---------------------------------------------
    //   login-count / 天使
    // ---------------------------------------------
  } else if (_id === "_vXx7_K4G") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #bcc4ce, #d2d7de, #e8ebee, #ffffff);";

    // ---------------------------------------------
    //   login-count / 堕天使
    // ---------------------------------------------
  } else if (_id === "Jvf9Lijjm") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #676d72, #979b9f, #caccce, #ffffff);";

    // ---------------------------------------------
    //   login-count / 魔王
    // ---------------------------------------------
  } else if (_id === "eyvU_SACO") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #5755c6, #a16b9f, #d08476, #f79f44);";

    // ---------------------------------------------
    //   login-count / 死神
    // ---------------------------------------------
  } else if (_id === "5upcKu5zF") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #1066cd, #9759a2, #cf4379, #fc0950);";

    // ---------------------------------------------
    //   login-count / 魔神
    // ---------------------------------------------
  } else if (_id === "YK_KSzwsG") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #cb5d56, #d47b52, #db974d, #e2b345);";

    // ---------------------------------------------
    //   login-count / 貧乏神
    // ---------------------------------------------
  } else if (_id === "i6c5Dfu-m") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #472bff, #9e62c0, #be957d, #c8c814);";

    // ---------------------------------------------
    //   login-count / 福の神
    // ---------------------------------------------
  } else if (_id === "dKBIlPEoa") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ef5184, #ec8d6f, #e4be53, #d4eb1e);";

    // ---------------------------------------------
    //   good-count-click / 剣士
    // ---------------------------------------------
  } else if (_id === "OvFFDioQV") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #5e3ef9, #5f75fb, #50a4fd, #03d2fe);";

    // ---------------------------------------------
    //   good-count-click / ウォーリアー
    // ---------------------------------------------
  } else if (_id === "MBNo5yFTg") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff4d12, #ec565e, #d15e9b, #a368da);";

    // ---------------------------------------------
    //   good-count-click / ランサー
    // ---------------------------------------------
  } else if (_id === "yKAZQg45T") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #a9c3b4, #93d88c, #6fec5e, #0cff01);";

    // ---------------------------------------------
    //   good-count-click / アーチャー
    // ---------------------------------------------
  } else if (_id === "krhg5hHmV") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff5223, #ff7b2d, #ff9d38, #ffbc44);";

    // ---------------------------------------------
    //   good-count-click / 騎士
    // ---------------------------------------------
  } else if (_id === "YMqxD6ALt") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #89acf1, #9fc2b7, #a4d979, #9bf018);";

    // ---------------------------------------------
    //   good-count-click / 盗賊
    // ---------------------------------------------
  } else if (_id === "dxDtrrPc7") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ce616d, #c38b66, #b3b05c, #9bd24f);";

    // ---------------------------------------------
    //   good-count-click / 戦士
    // ---------------------------------------------
  } else if (_id === "LBK1jIxgT") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ed262b, #fb745b, #ffad8f, #ffe2c5);";

    // ---------------------------------------------
    //   good-count-click / 武闘家
    // ---------------------------------------------
  } else if (_id === "wjuY6Q2lk") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #40a2f2, #76c0bc, #84df81, #7fff2a);";

    // ---------------------------------------------
    //   good-count-click / 勇者
    // ---------------------------------------------
  } else if (_id === "ywapJh2Yi") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #fea985, #ffbc80, #ffce7b, #ffe075);";

    // ---------------------------------------------
    //   good-count-click / 魔物使い
    // ---------------------------------------------
  } else if (_id === "kecLQlRQi") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f75b00, #e59c00, #c9cf02, #98ff12);";

    // ---------------------------------------------
    //   good-count-click / バーサーカー
    // ---------------------------------------------
  } else if (_id === "aVcpTftl9") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #c20216, #d83641, #ed566b, #ff7398);";

    // ---------------------------------------------
    //   good-count-click / 竜騎士
    // ---------------------------------------------
  } else if (_id === "o1aIdzdBF") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #7f60e0, #7483cf, #5fa3be, #2cc0ac);";

    // ---------------------------------------------
    //   good-count-click / パラディン
    // ---------------------------------------------
  } else if (_id === "6kHbHpzv8") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #1af0bd, #9cea94, #d5e467, #ffdc2d);";

    // ---------------------------------------------
    //   good-count-click / アサシン
    // ---------------------------------------------
  } else if (_id === "YFMuKFuQc") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9a050b, #bc0c35, #de165e, #ff2189);";

    // ---------------------------------------------
    //   good-count-click / 侍
    // ---------------------------------------------
  } else if (_id === "0w9fjuWVw") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #8e3830, #b1763d, #d1b348, #f0f252);";

    // ---------------------------------------------
    //   good-count-click / 忍者
    // ---------------------------------------------
  } else if (_id === "Zu1Uq6XIE") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #4a582f, #83845d, #bfb290, #ffe2c5);";

    // ---------------------------------------------
    //   good-count-clicked / 商人
    // ---------------------------------------------
  } else if (_id === "-qbom3GV8") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f25907, #ed933a, #e0c464, #c6f28e);";

    // ---------------------------------------------
    //   good-count-clicked / 鍛冶屋
    // ---------------------------------------------
  } else if (_id === "jni4Si4Hn") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #b26141, #d1947c, #eac9bc, #ffffff);";

    // ---------------------------------------------
    //   good-count-clicked / 踊り子
    // ---------------------------------------------
  } else if (_id === "N46yXHfp6") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e91f45, #ee5a6a, #ee8191, #eaa4ba);";

    // ---------------------------------------------
    //   good-count-clicked / 吟遊詩人
    // ---------------------------------------------
  } else if (_id === "ve1zL3KLa") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #4a9ddd, #79bcac, #89dd76, #89ff1a);";

    // ---------------------------------------------
    //   good-count-clicked / 魔法使い
    // ---------------------------------------------
  } else if (_id === "O-cemW2Yj") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ef136d, #ed818b, #e1c2ab, #c4ffcc);";

    // ---------------------------------------------
    //   good-count-clicked / 僧侶
    // ---------------------------------------------
  } else if (_id === "QNGUdMEvH") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #05add1, #72c8e0, #ace3f0, #e0ffff);";

    // ---------------------------------------------
    //   good-count-clicked / 召喚士
    // ---------------------------------------------
  } else if (_id === "y4gno22iq") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9180e5, #b3a4e9, #d3caed, #f0f0f0);";

    // ---------------------------------------------
    //   good-count-clicked / 占い師
    // ---------------------------------------------
  } else if (_id === "7F-dv9721") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f31387, #ce64a7, #998ac8, #00a7eb);";

    // ---------------------------------------------
    //   good-count-clicked / 巫女
    // ---------------------------------------------
  } else if (_id === "AYZJY5Dmk") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #23afd5, #86c9e3, #c5e4f1, #ffffff);";

    // ---------------------------------------------
    //   good-count-clicked / 聖職者
    // ---------------------------------------------
  } else if (_id === "Q-VdNpq0A") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #afb3f7, #cbccfa, #e5e5fd, #ffffff);";

    // ---------------------------------------------
    //   good-count-clicked / 呪術師
    // ---------------------------------------------
  } else if (_id === "OHF_0sr4f") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #746052, #938277, #b2a69d, #d2ccc6);";

    // ---------------------------------------------
    //   good-count-clicked / 錬金術師
    // ---------------------------------------------
  } else if (_id === "2lp1a9nry") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #fb1f12, #f57124, #eaa338, #d7cf4d);";

    // ---------------------------------------------
    //   good-count-clicked / ビショップ
    // ---------------------------------------------
  } else if (_id === "sRZIe_DIL") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #c3a596, #a4bc87, #7cd076, #2ee364);";

    // ---------------------------------------------
    //   good-count-clicked / 魔法戦士
    // ---------------------------------------------
  } else if (_id === "gwn-HZQud") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ee616f, #ce8e95, #9db2bd, #00d2e6);";

    // ---------------------------------------------
    //   good-count-clicked / ネクロマンサー
    // ---------------------------------------------
  } else if (_id === "BIA1DRFjt") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #8752e8, #a55ecc, #ba6bb0, #ca7894);";

    // ---------------------------------------------
    //   good-count-clicked / 魔女
    // ---------------------------------------------
  } else if (_id === "BNJ30I7Wu") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff3e0c, #ff8209, #ffb709, #ffe70c);";

    // ---------------------------------------------
    //   gc-register / エディター
    // ---------------------------------------------
  } else if (_id === "oUikoyNw8") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #b5a0a0, #9abb8d, #72d478, #01ec60);";

    // ---------------------------------------------
    //   gc-register / インデックス
    // ---------------------------------------------
  } else if (_id === "RC23wuPie") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e1712f, #d8942f, #ccb32f, #bcd02f);";

    // ---------------------------------------------
    //   gc-register / 物知り博士
    // ---------------------------------------------
  } else if (_id === "4hcDA5La3") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #c12fff, #a46fff, #7b97ff, #19b8ff);";

    // ---------------------------------------------
    //   gc-register / 知の巨人
    // ---------------------------------------------
  } else if (_id === "9tnHg8N6a") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #00adee, #9dc3b8, #d5db7d, #fef41d);";

    // ---------------------------------------------
    //   gc-register / 博愛精神
    // ---------------------------------------------
  } else if (_id === "O1z1kO6fk") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9113ec, #b753f1, #d880f5, #f6acf8);";

    // ---------------------------------------------
    //   gc-register / サンタクロース
    // ---------------------------------------------
  } else if (_id === "t7KFWLOYJ") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff1355, #ff7a74, #ffb894, #fff1b7);";

    // ---------------------------------------------
    //   gc-register / パラドックス
    // ---------------------------------------------
  } else if (_id === "z0VBPIIfi") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f10000, #e68057, #c3c2a7, #48fffb);";

    // ---------------------------------------------
    //   gc-register / 聖域の解放者
    // ---------------------------------------------
  } else if (_id === "O0loEvj9c") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #2ba5bf, #83c3d4, #c3e1e9, #ffffff);";

    // ---------------------------------------------
    //   gc-register / 三千世界
    // ---------------------------------------------
  } else if (_id === "UiFiyYOP5") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #008383, #01a39c, #01c5b6, #00e7d0);";

    // ---------------------------------------------
    //   gc-register / 創造主
    // ---------------------------------------------
  } else if (_id === "6tNoSpoSA") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #17efb7, #9ce98e, #d4e162, #ffd825);";

    // ---------------------------------------------
    //   gc-register / 深淵を覗く者
    // ---------------------------------------------
  } else if (_id === "A4r74MAjm") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #afbcd1, #c9d2e0, #e4e8f0, #ffffff);";

    // ---------------------------------------------
    //   forum-count-post / ポエマー
    // ---------------------------------------------
  } else if (_id === "nFJYEhwWB") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #fb02dd, #ff6baf, #ff9d7e, #ffc83d);";

    // ---------------------------------------------
    //   forum-count-post / 作家
    // ---------------------------------------------
  } else if (_id === "k4xm8yGJD") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #be3b17, #d4601b, #ea8220, #ffa324);";

    // ---------------------------------------------
    //   forum-count-post / 文豪
    // ---------------------------------------------
  } else if (_id === "ljIghwR69") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #183dce, #6c7cb1, #83bc8f, #80ff5d);";

    // ---------------------------------------------
    //   forum-count-post / 表現者
    // ---------------------------------------------
  } else if (_id === "WJlkVSLub") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #e48716, #eea012, #f7b80c, #ffd100);";

    // ---------------------------------------------
    //   forum-count-post / ネゴシエイター
    // ---------------------------------------------
  } else if (_id === "349Q_q5h8") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #a2353c, #be585b, #d9797c, #f39b9e);";

    // ---------------------------------------------
    //   forum-count-post / 魔導書の書き手
    // ---------------------------------------------
  } else if (_id === "rIK64YljB") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f73331, #e8832d, #d1b924, #ace912);";

    // ---------------------------------------------
    //   forum-count-post / 悪魔の筆
    // ---------------------------------------------
  } else if (_id === "DQ9iH_r31") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #9f159d, #986fbd, #7dacde, #04e6ff);";

    // ---------------------------------------------
    //   forum-count-post / ヴォイニッチ手稿
    // ---------------------------------------------
  } else if (_id === "RTMuPDYkt") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #0867fd, #2c8cfc, #2eb0fa, #0bd5f7);";

    // ---------------------------------------------
    //   recruitment-count-post / ぼっち
    // ---------------------------------------------
  } else if (_id === "7K8R91Chm") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ef586a, #f88e77, #fdbe83, #ffec90);";

    // ---------------------------------------------
    //   recruitment-count-post / 友達募集
    // ---------------------------------------------
  } else if (_id === "0kh9wSxkK") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff0b00, #ff7100, #fea700, #f6d800);";

    // ---------------------------------------------
    //   recruitment-count-post / 招き猫
    // ---------------------------------------------
  } else if (_id === "ksytsAh44") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #0afff0, #a6f2b9, #dbe481, #ffd540);";

    // ---------------------------------------------
    //   recruitment-count-post / トレーダー
    // ---------------------------------------------
  } else if (_id === "6u1Me1S13") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #8b6ce2, #b892da, #ddbad1, #ffe3c6);";

    // ---------------------------------------------
    //   recruitment-count-post / リーダー
    // ---------------------------------------------
  } else if (_id === "n-OyxEgZE") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #2e8678, #50a98b, #70cd9e, #90f3b2);";

    // ---------------------------------------------
    //   recruitment-count-post / 指揮官
    // ---------------------------------------------
  } else if (_id === "iJhdcsAnj") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #248fbf, #90b299, #c9d76b, #f9ff09);";

    // ---------------------------------------------
    //   recruitment-count-post / フレンドリーファイア
    // ---------------------------------------------
  } else if (_id === "VYe67sAJI") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #dd0878, #bd549b, #8f75bf, #158fe5);";

    // ---------------------------------------------
    //   recruitment-count-post / 軍師
    // ---------------------------------------------
  } else if (_id === "LgqylZRLH") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #4e6de1, #9698e6, #ccc5ea, #fef5ec);";

    // ---------------------------------------------
    //   recruitment-count-post / CEO
    // ---------------------------------------------
  } else if (_id === "cy-FSwJ6x") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff2f4c, #dd8e5a, #a8c76a, #00f87b);";

    // ---------------------------------------------
    //   recruitment-count-post / 全てを統べる者
    // ---------------------------------------------
  } else if (_id === "iQrrWOHai") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ab86dd, #94a1d6, #74b9ce, #3bd0c6);";

    // ---------------------------------------------
    //   follow-count / ペット
    // ---------------------------------------------
  } else if (_id === "Klp5SO8K2") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f7cdc3, #f8d9bc, #f8e4b5, #f8f0ad);";

    // ---------------------------------------------
    //   follow-count / メイド
    // ---------------------------------------------
  } else if (_id === "WuJd0ECX0") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ed2764, #f07f7f, #ebbc9b, #dbf5b9);";

    // ---------------------------------------------
    //   follow-count / 操り人形
    // ---------------------------------------------
  } else if (_id === "LMeLQQZft") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #46b76d, #78c093, #a1c8ba, #c6cfe1);";

    // ---------------------------------------------
    //   follow-count / 追跡者
    // ---------------------------------------------
  } else if (_id === "lMRySntAn") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ca4de8, #ae7ae6, #889ae4, #4ab5e2);";

    // ---------------------------------------------
    //   follow-count / サーヴァント
    // ---------------------------------------------
  } else if (_id === "i_NBtroQY") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #d55348, #df7744, #e8983e, #efb734);";

    // ---------------------------------------------
    //   follow-count / 使徒
    // ---------------------------------------------
  } else if (_id === "R8XwivxCN") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #cf9945, #ceae4c, #ccc253, #c9d65a);";

    // ---------------------------------------------
    //   follow-count / みんなの友達
    // ---------------------------------------------
  } else if (_id === "E_4zTVN8O") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff3f06, #ff7f02, #ffaf02, #ffdc06);";

    // ---------------------------------------------
    //   followed-count / 遊び人
    // ---------------------------------------------
  } else if (_id === "7YCic-Yds") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #b1a395, #9fc0ae, #81ddc8, #42fae2);";

    // ---------------------------------------------
    //   followed-count / ピエロ
    // ---------------------------------------------
  } else if (_id === "p-XWgcOtK") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f40845, #fa4164, #fe5f84, #ff79a5);";

    // ---------------------------------------------
    //   followed-count / 人気者
    // ---------------------------------------------
  } else if (_id === "8Fbta4f9O") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff6909, #fb9a06, #f2c504, #e4ed06);";

    // ---------------------------------------------
    //   followed-count / アイドル
    // ---------------------------------------------
  } else if (_id === "g65dAP992") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff0e13, #ff6f47, #ffa77a, #ffd9af);";

    // ---------------------------------------------
    //   followed-count / スーパースター
    // ---------------------------------------------
  } else if (_id === "Lcqo1Q7Up") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff9900, #fabd03, #f3de0a, #e7ff13);";

    // ---------------------------------------------
    //   followed-count / 教祖様
    // ---------------------------------------------
  } else if (_id === "8Z3SDtXgN") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff2268, #df8e6f, #abca76, #1aff7d);";

    // ---------------------------------------------
    //   followed-count / カリスマ
    // ---------------------------------------------
  } else if (_id === "wQ-ywcRpP") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #5447ff, #5678ff, #49a4ff, #01cfff);";

    // ---------------------------------------------
    //   followed-count / 預言者
    // ---------------------------------------------
  } else if (_id === "DrgkgbsbH") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #3a572b, #418c3a, #3fc44a, #29ff59);";

    // ---------------------------------------------
    //   followed-count / 救世主
    // ---------------------------------------------
  } else if (_id === "Rb-hOZVrb") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f83e00, #fb8c00, #f8c700, #ecff0a);";

    // ---------------------------------------------
    //   title-count / 探検家
    // ---------------------------------------------
  } else if (_id === "0c0jL9cW-") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ce3731, #e16b5f, #ef998f, #f7c5c2);";

    // ---------------------------------------------
    //   title-count / マニア
    // ---------------------------------------------
  } else if (_id === "ZDNXA6mwh") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #004e9f, #447c82, #49ac5e, #20de1a);";

    // ---------------------------------------------
    //   title-count / コレクター
    // ---------------------------------------------
  } else if (_id === "hJgT4h1s6") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #3d45b9, #5a78c4, #6babce, #72e0d6);";

    // ---------------------------------------------
    //   title-count / トレジャーハンター
    // ---------------------------------------------
  } else if (_id === "vhTNgUcb0") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #a77a4e, #bb9747, #cfb43d, #e3d22b);";

    // ---------------------------------------------
    //   title-count / ヒストリア
    // ---------------------------------------------
  } else if (_id === "PiVoTxcDG") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #6f2ff0, #b070b9, #ceac7d, #dbe70e);";

    // ---------------------------------------------
    //   title-count / 無限の宝物庫
    // ---------------------------------------------
  } else if (_id === "xiwWB50ug") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #1ce9c3, #9be899, #d4e66d, #ffe432);";

    // ---------------------------------------------
    //   title-count / アカシックレコード
    // ---------------------------------------------
  } else if (_id === "7uqCc8K1z") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff091d, #e47a41, #bab068, #69dd90);";

    // ---------------------------------------------
    //   title-show / ひよこ
    // ---------------------------------------------
  } else if (_id === "RhpW8VDw4") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #eb9300, #e4b906, #d9dc11, #c8ff1c);";

    // ---------------------------------------------
    //   card-player-edit / クリエイター
    // ---------------------------------------------
  } else if (_id === "1FYXcjzEb") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #ff3a51, #ff835e, #ffba6b, #ffec78);";

    // ---------------------------------------------
    //   card-player-upload-image-main / デザイナー
    // ---------------------------------------------
  } else if (_id === "bnOJOwQN4") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #18b2ee, #9fc6b8, #d6db7e, #fff227);";

    // ---------------------------------------------
    //   card-player-upload-image-thumbnail / 絵描き
    // ---------------------------------------------
  } else if (_id === "4e2otkg81") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #cf1c7d, #e17aa6, #ecbdd2, #eeffff);";

    // ---------------------------------------------
    //   user-page-upload-image-main / アーティスト
    // ---------------------------------------------
  } else if (_id === "iPgdAE8rL") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #f80014, #ff7a4f, #ffbd8b, #fcfccb);";

    // ---------------------------------------------
    //   user-page-change-url / ユニーク
    // ---------------------------------------------
  } else if (_id === "iDFuNdaD5") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #7b6bff, #a898ff, #ccc7ff, #ecf7ff);";

    // ---------------------------------------------
    //   web-push-permission / エスパー
    // ---------------------------------------------
  } else if (_id === "oU2EDF7vI") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #32aeff, #68c8cc, #75e396, #6cff55);";

    // ---------------------------------------------
    //   書紀
    // ---------------------------------------------
  } else if (_id === "NwzUOqsiC") {
    colorLine = colorText =
      "background-image: linear-gradient(25deg, #7a19fb, #705ffc, #588cfd, #00b4fd);";
  }

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`
  //   ----------------------------------------\n
  //   /app/common/title/v2/chip.js
  // `);

  // console.log(chalk`
  //   _id: {green ${_id}}
  //   urlID: {green ${urlID}}
  //   name: {green ${name}}
  // `);

  // console.log(`
  //   ----- gamesImagesAndVideosThumbnailObj -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(gamesImagesAndVideosThumbnailObj)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return (
    <div
      css={css`
        color: #fff;
        font-weight: bold;
        background: #000;

        position: relative;
        box-shadow: 0 2px 14px rgba(0, 0, 0, 0.1);

        &:before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          content: "";
          ${colorLine}
        }

        &:after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          content: "";
          ${colorLine}
        }

        // margin: 0 0 0 12px;
        padding: 0 4px;
      `}
    >
      <span
        css={css`
          ${colorText}
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        `}
      >
        {name}
      </span>
    </div>
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

// --------------------------------------------------
//   Require
// --------------------------------------------------

// ---------------------------------------------
//   Console
// ---------------------------------------------

const chalk = require("chalk");
const util = require("util");

// ---------------------------------------------
//   Node Packages
// ---------------------------------------------

const nodemailer = require("nodemailer");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * メールを送信する
 * https://nodemailer.com/about/
 * @param {string} from - 送信元のメールアドレス
 * @param {string} to - 送信先のメールアドレス
 * @param {Array} bcc - 送信先のメールアドレスが入った配列
 * @param {string} subject - メールタイトル
 * @param {string} text - メール本文
 */
const sendMail = async ({ from, to, bcc, subject, text }) => {
  // --------------------------------------------------
  //   必要な情報がない場合、処理停止
  // --------------------------------------------------

  if (
    !process.env.EMAIL_SMTP_HOST ||
    !process.env.EMAIL_SMTP_PORT ||
    !process.env.EMAIL_SMTP_USER ||
    !process.env.EMAIL_SMTP_PASSWORD ||
    !from ||
    (!to && !bcc) ||
    !subject ||
    !text
  ) {
    return;
  }

  // --------------------------------------------------
  //   create reusable transporter object using the default SMTP transport
  // --------------------------------------------------

  const smtpObj = {
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: process.env.EMAIL_SMTP_PORT === 465 ? true : false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(smtpObj);

  // --------------------------------------------------
  //   send mail with defined transport object
  // --------------------------------------------------

  const messageObj = {
    from,
    subject,
    text,
  };

  if (to) {
    messageObj.to = to;
  } else {
    messageObj.bcc = bcc;
  }

  const infoObj = await transporter.sendMail(messageObj);

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(`\n---------- infoObj ----------\n`);
  // console.dir(infoObj);
  // console.log(`\n-----------------------------------\n`);

  // console.log(chalk`
  //   sendMail
  //   process.env.EMAIL_SMTP_HOST: {green ${process.env.EMAIL_SMTP_HOST}}
  //   process.env.EMAIL_SMTP_PORT: {green ${process.env.EMAIL_SMTP_PORT}}
  //   process.env.EMAIL_SMTP_USER: {green ${process.env.EMAIL_SMTP_USER}}
  //   process.env.EMAIL_SMTP_PASSWORD: {green ${process.env.EMAIL_SMTP_PASSWORD}}
  //   from: {green ${from}}
  //   to: {green ${to}}
  //   bcc: {green ${bcc}}
  //   subject: {green ${subject}}
  //   text: {green ${text}}
  // `);
};

/**
 * メールアドレス確認メールを送信する
 * @param {string} to - 送信先のメールアドレス
 * @param {string} emailConfirmationID - メール確認ID
 */
const sendMailConfirmation = async ({ to, emailConfirmationID }) => {
  // --------------------------------------------------
  //   Send Mail
  // --------------------------------------------------

  sendMail({
    from: process.env.EMAIL_CONFIRMATION_ADDRESS,
    to,
    subject: "[Game Users] メールアドレス確認",
    text: `Game Users - メールアドレス確認

以下のURLにアクセスしてメールアドレスの登録を完了してください。
${process.env.NEXT_PUBLIC_URL_BASE}confirm/email/${emailConfirmationID}

メールを送信してから24時間以内にアクセスしてください。それ以降はURLが無効になります。

こちらのメールに覚えのない方は、上記URLにアクセスしないようにしてください。覚えがないのに同じメールが何度も送られてくる場合は、以下のメールアドレスまでご連絡ください。

＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/

　Game Users

　Email: ${process.env.EMAIL_CONTACT_ADDRESS}
　URL: https://gameusers.org/

＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/`,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(chalk`
  //   process.env.EMAIL_MESSAGE_FROM: {green ${process.env.EMAIL_MESSAGE_FROM}}
  //   to: {green ${to}}
  //   emailConfirmationID: {green ${emailConfirmationID}}
  // `);
};

/**
 * パスワード再設定メールを送信する
 * @param {string} to - 送信先のメールアドレス
 * @param {string} emailConfirmationID - メール確認ID
 */
const sendMailResetPassword = async ({ to, emailConfirmationID }) => {
  // --------------------------------------------------
  //   Send Mail
  // --------------------------------------------------

  sendMail({
    from: process.env.EMAIL_CONFIRMATION_ADDRESS,
    to,
    subject: "[Game Users] パスワード再設定",
    text: `Game Users - パスワード再設定

以下のURLにアクセスしてパスワードの再設定を行ってください。
${process.env.NEXT_PUBLIC_URL_BASE}confirm/reset-password/${emailConfirmationID}

メールを送信してから30分以内にアクセスしてください。それ以降はURLが無効になります。
このメールは他人に見せないようにしてください。アカウントのパスワードを無断で変更される可能性があります。

こちらのメールに覚えのない方は、上記URLにアクセスしないようにしてください。覚えがないのに同じメールが何度も送られてくる場合は、以下のメールアドレスまでご連絡ください。

＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/

　Game Users

　Email: ${process.env.EMAIL_CONTACT_ADDRESS}
　URL: https://gameusers.org/

＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/`,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(chalk`
  //   process.env.EMAIL_MESSAGE_FROM: {green ${process.env.EMAIL_MESSAGE_FROM}}
  //   to: {green ${to}}
  //   emailConfirmationID: {green ${emailConfirmationID}}
  // `);
};

/**
 * お問い合わせフォームを送信する
 * @param {string} name - 名前（ハンドルネーム）
 * @param {string} email - メールアドレス
 * @param {string} text - メール本文
 * @param {string} loginUsers_id - DB users _id
 * @param {string} ip - 送信者のIP
 * @param {string} userAgent - 送信者のユーザーエージェント
 */
const sendMailForm = async ({
  name,
  email,
  text,
  loginUsers_id,
  ip,
  userAgent,
}) => {
  // --------------------------------------------------
  //   Send Mail
  // --------------------------------------------------

  sendMail({
    from: process.env.EMAIL_CONTACT_ADDRESS,
    to: process.env.EMAIL_CONTACT_ADDRESS,
    subject: "お問い合わせフォーム",
    text: `${text}

＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/

　送信者情報

  Name: ${name}
  E-Mail: ${email}
  loginUsers_id: ${loginUsers_id}
　IP: ${ip}
　User Agent: ${userAgent}

＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/`,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(chalk`
  //   process.env.EMAIL_MESSAGE_FROM: {green ${process.env.EMAIL_MESSAGE_FROM}}
  //   to: {green ${to}}
  //   emailConfirmationID: {green ${emailConfirmationID}}
  // `);
};

/**
 * アカウント移行フォームを送信する
 * @param {string} name - 名前（ハンドルネーム）
 * @param {string} email - メールアドレス
 * @param {string} url - ユーザーページのURL
 * @param {string} loginID - ログインID
 * @param {string} social - ソーシャルサイト名
 * @param {string} provider - プロバイダー
 * @param {string} device - 端末
 * @param {string} browser - ブラウザ
 * @param {string} comment - コメント
 * @param {string} loginUsers_id - DB users _id
 * @param {string} ip - 送信者のIP
 * @param {string} userAgent - 送信者のユーザーエージェント
 */
const sendMailAccount = async ({
  name,
  email,
  url,
  loginID,
  social,
  provider,
  device,
  browser,
  comment,
  loginUsers_id,
  ip,
  userAgent,
}) => {
  // --------------------------------------------------
  //   Send Mail
  // --------------------------------------------------

  sendMail({
    from: process.env.EMAIL_CONTACT_ADDRESS,
    to: process.env.EMAIL_CONTACT_ADDRESS,
    subject: "アカウント移行フォーム",
    text: `ユーザーページのURL: ${url}
ログインID: ${loginID}
ソーシャルサイト名: ${social}
プロバイダー: ${provider}
端末: ${device}
ブラウザ: ${browser}
コメント: ${comment}

＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/

　送信者情報

  Name: ${name}
  E-Mail: ${email}
  loginUsers_id: ${loginUsers_id}
　IP: ${ip}
　User Agent: ${userAgent}

＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/＿/`,
  });

  // --------------------------------------------------
  //   console.log
  // --------------------------------------------------

  // console.log(chalk`
  //   process.env.EMAIL_MESSAGE_FROM: {green ${process.env.EMAIL_MESSAGE_FROM}}
  //   to: {green ${to}}
  //   emailConfirmationID: {green ${emailConfirmationID}}
  // `);
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  sendMail,
  sendMailConfirmation,
  sendMailResetPassword,
  sendMailForm,
  sendMailAccount,
};

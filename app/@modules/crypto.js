// --------------------------------------------------
//   Require
// --------------------------------------------------

const crypto = require("crypto");
// const chalk = require('chalk');

// --------------------------------------------------
//   Property
// --------------------------------------------------

const key = Buffer.from(process.env.CRYPTO_KEY, "utf8");
const iv = Buffer.from(process.env.CRYPTO_IV, "utf8");

// const key = new Buffer(process.env.CRYPTO_KEY, 'utf8');
// const iv = new Buffer(process.env.CRYPTO_IV, 'utf8');

// --------------------------------------------------
//   Function
// --------------------------------------------------

/**
 * 暗号化する
 * @param {string} text - 暗号化したいテキスト
 * @return {string} 暗号化されたテキスト
 */
const encrypt = (text) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

/**
 * 復号する
 * @param {string} text - 復号したいテキスト
 * @return {string} 復号されたテキスト
 */
const decrypt = (text) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  encrypt,
  decrypt,
};

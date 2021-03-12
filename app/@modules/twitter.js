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

const Twitter = require("twitter");

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

const lodashGet = require("lodash/get");
const lodashSet = require("lodash/set");

// --------------------------------------------------
//   function
// --------------------------------------------------

/**
 * Tweetする
 * https://github.com/desmondmorris/node-twitter
 * @param {string} twitterText - tweetする内容
 */
const tweet = ({ twitterText }) => {
  // --------------------------------------------------
  //   必要な情報がない場合は処理停止
  // --------------------------------------------------

  if (
    process.env.TWEET === "0" ||
    !process.env.TWITTER_CONSUMER_KEY ||
    !process.env.TWITTER_CONSUMER_SECRET ||
    !process.env.TWITTER_ACCESS_TOKEN ||
    !process.env.TWITTER_ACCESS_TOKEN_SECRET
  ) {
    return;
  }

  // --------------------------------------------------
  //   User based authentication
  // --------------------------------------------------

  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  // --------------------------------------------------
  //   Tweet
  // --------------------------------------------------

  client.post(
    "statuses/update",
    { status: twitterText },
    (error, tweet, response) => {
      if (error) {
        console.log(error);
      }

      // console.log(tweet);
      // console.log(response);
    }
  );
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  tweet,
};

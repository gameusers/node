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

import Linkify from "react-linkify";

/** @jsx jsx */
import { css, jsx } from "@emotion/react";

// ---------------------------------------------
//   Lodash
// ---------------------------------------------

import lodashGet from "lodash/get";

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

  const { text } = props;

  // --------------------------------------------------
  //   Component
  // --------------------------------------------------

  let componentsArr = [];

  let textArr = [];

  if (text) {
    textArr = text.split("\n").reverse();
  }

  let marginPx = 0;

  for (const [index, value] of textArr.entries()) {
    // const url = value.match('https?://([\w-]+\.)+[\w-]+(/[\w- .?%&=]*)?');
    // const pattern = 'https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+';
    // const regex = new RegExp(pattern);
    // const text = value.replace(/(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi, `<a href='$1' target='_blank'>$1</a>`);

    // const regex = new RegExp('https?://([\w-]+\.)+[\w-]+(/[\w- .?%&=]*)?');
    // const matchArr = value.match(regex);

    // let url = '';

    // if (matchArr) {
    //   url = matchArr[0];
    //   console.log(url);
    // }

    // console.log(resultMatchObj);

    // if (value === '') {
    if (!value.match(/\S/g)) {
      marginPx += 18;
    } else {
      // let text = value;

      // if (url) {
      //   text = <a href="url" target="_blank"></a>
      // }

      if (marginPx === 0) {
        componentsArr.push(<p key={index}>{value}</p>);
      } else {
        componentsArr.push(
          <p style={{ marginBottom: marginPx }} key={index}>
            {value}
          </p>
        );
      }

      marginPx = 0;
    }

    // console.log(index, value, marginPx);
  }

  componentsArr = componentsArr.reverse();

  // --------------------------------------------------
  //   Return
  // --------------------------------------------------

  return <Linkify properties={{ target: "_blank" }}>{componentsArr}</Linkify>;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

export default Component;

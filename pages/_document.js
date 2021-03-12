// --------------------------------------------------
//   _document.jsについて：https://nextjs.org/docs/advanced-features/custom-document
//   日本語の記事：https://qiita.com/tetsutaroendo/items/c7171286137d963cdecf
//
//   Next.jsでMaterial UIを利用する場合の_document.js
//   参考：https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
// --------------------------------------------------

// --------------------------------------------------
//   Import
// --------------------------------------------------

import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
// import flush from 'styled-jsx/server';
// import theme from '../app/@css/material-ui/theme';

// import '@formatjs/intl-relativetimeformat/polyfill';
// 以下のエラーが出るので入れている
// Error: Intl.RelativeTimeFormat is not available in this environment.
// Try polyfilling it using "@formatjs/intl-relativetimeformat"
// Node.jsがv12になるとIntl.RelativeTimeFormatが使えるようになるらしいので、polyfillはいらなくなるみたい
// 開発環境のNode.jsがv12になった場合は、改めてimportしなくていいかチェックすること

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head />

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
  // return {
  //   ...initialProps,
  //   // Styles fragment is rendered after the app and page rendering finish.
  //   styles: (
  //     <React.Fragment>
  //       {sheets.getStyleElement()}
  //       {flush() || null}
  //     </React.Fragment>
  //   ),
  // };
};

export default MyDocument;

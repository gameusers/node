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

const express = require("express");
// const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require("path");

// const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// const MongoStore = require('connect-mongo').default;
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const mongoose = require("mongoose");

const cron = require("node-cron");

// ---------------------------------------------
//   Model
// ---------------------------------------------

const ModelNotifications = require("./app/@database/notifications/model.js");
const ModelWebPushes = require("./app/@database/web-pushes/model.js");

// ---------------------------------------------
//   API
// ---------------------------------------------

const routerApi = require("./app/@api/v1/");

// const webpush = require('web-push');

// --------------------------------------------------
//   Server
// --------------------------------------------------

app.prepare().then(() => {
  // --------------------------------------------------
  //   express
  // --------------------------------------------------

  const server = express();

  // console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
  // console.log('process.env.URL_API = ' + process.env.NEXT_PUBLIC_URL_API);
  // console.log('process.env.DB_URL_DOCKER = ' + process.env.DB_URL_DOCKER);
  // console.log('process.env.DB_URL = ' + process.env.DB_URL);

  // const vapidKeys = webpush.generateVAPIDKeys();

  // console.log(`
  //   ----- vapidKeys -----\n
  //   ${util.inspect(JSON.parse(JSON.stringify(vapidKeys)), { colors: true, depth: null })}\n
  //   --------------------\n
  // `);

  // --------------------------------------------------
  //   Middleware Settings
  // --------------------------------------------------

  // server.use(bodyParser.json());
  // server.use(bodyParser.urlencoded({
  //   // limit: '50mb',
  //   extended: true
  // }));

  // 参考：https://qiita.com/MahoTakara/items/8495bbafc19859ef463b

  let sessObj = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 12 * 60 * 60, // 12 hours
    }), // connect-mongo 3.2.0
    // store: MongoStore.create({
    //   mongooseConnection: mongoose.connection,
    //   ttl: 12 * 60 * 60 // 12 hours
    // }),// connect-mongo 4.2.0 書き方がわからん
    cookie: {
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    },
  };

  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_URL_BASE === "https://gameusers.org/"
  ) {
    sessObj = {
      secret: process.env.SESSION_SECRET,
      proxy: true,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 7 * 24 * 60 * 60, // 7 days
      }), // connect-mongo 3.2.0
      // store: MongoStore.create({
      //   mongooseConnection: mongoose.connection,
      //   ttl: 7 * 24 * 60 * 60 // 7 days
      // }),// connect-mongo 4.2.0 書き方がわからん
      cookie: {
        secure: true,
        httpOnly: true,
        domain: "gameusers.org",
        path: "/",
        sameSite: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    };
  }

  server.use(cookieParser());

  // server.use(flash());

  server.use(session(sessObj));

  server.use(passport.initialize());
  server.use(passport.session());

  // --------------------------------------------------
  //   production build 後に public ディレクトリーにアップロードされた画像が
  //   表示されないため、express から提供する
  //   build 時に存在している画像しか表示されないらしい
  //   https://nextjs.org/docs/basic-features/static-file-serving
  // --------------------------------------------------

  server.use(express.static(path.join(__dirname, "public")));

  // --------------------------------------------------
  //   Database API
  //   参考: http://thecodebarbarian.com/building-a-nextjs-app-with-mongodb.html
  //   ユーザー認証を行う場合はこの形式で connect する | mongodb://username:password@host:port/database?options...
  //   参考：https://mongoosejs.com/docs/connections.html
  // --------------------------------------------------

  let dbUserPass = "";

  if (process.env.DB_USER && process.env.DB_PASSWORD) {
    dbUserPass = `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`;
  }

  // let dbUrl = `mongodb://${dbUserPass}${process.env.DB_URL}/gameusers?replicaSet=rs0`;
  let dbUrl = `mongodb://${dbUserPass}${process.env.DB_URL}/gameusers?replicaSet=rs0&authSource=admin`;

  if (process.env.DB_URL_DOCKER) {
    dbUrl = `mongodb://${dbUserPass}${process.env.DB_URL_DOCKER}/gameusers?replicaSet=rs0`;
  }

  // const dbUrl = `mongodb://root:password@mongo1:27017`;
  // const dbUrl = 'mongodb://root:password@mongo1:27017,mongo2:27017,mongo3:27017';
  // const dbUrl = `mongodb://root:password@mongo1:27017,mongo2:27017,mongo3:27017/gameusers?replicaSet=rs0`;

  // const dbUrl = 'mongodb://gameusers:password@mongo1:27017,mongo2:27017,mongo3:27017';
  // const dbUrl = 'mongodb://gameusers:password@mongo1:27017,mongo2:27017,mongo3:27017/gameusers?replicaSet=rs0';

  // console.log('process.env.DB_USER = ' + process.env.DB_USER);
  // console.log('process.env.DB_PASSWORD = ' + process.env.DB_PASSWORD);
  // console.log('dbUrl = ' + dbUrl);

  // mongoose.connect('mongodb://localhost:27017/gameusers', {
  mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("MongoDB connected!");
  });

  // --------------------------------------------------
  //   Cron - https://github.com/node-cron/node-cron
  // --------------------------------------------------

  // ---------------------------------------------
  //   - Notifications / 1分ごとに通知をチェックする
  // ---------------------------------------------

  cron.schedule("* * * * *", () => {
    // cron.schedule('*/20 * * * * *', () => {
    ModelNotifications.send({});
  });

  // ---------------------------------------------
  //   - Web Push Reset sendTodayCount
  //   送信カウントを0にする。一日に送信できる回数は決まっている。
  // ---------------------------------------------

  cron.schedule("0 0 0 * * *", () => {
    // cron.schedule('0 30 18 * * *', () => {
    // cron.schedule('*/20 * * * * *', () => {
    ModelWebPushes.resetSendTodayCount({});
  });

  // --------------------------------------------------
  //   Routing
  // --------------------------------------------------

  // API
  server.use("/api/v1/", routerApi);

  // ---------------------------------------------
  //   故意に Error 出力
  // ---------------------------------------------

  // server.get('/error', (req, res, next) => {
  //   throw new Error('故意のエラー');
  // });

  // ---------------------------------------------
  //   共通処理
  // ---------------------------------------------

  // const csrfToken = (req, res, next) => {
  //   createCsrfToken(req, res);
  //   next();
  // };

  // ---------------------------------------------
  //   Login
  // ---------------------------------------------

  // server.get('/login', csrfToken, (req, res, next) => {
  //   app.render(req, res, '/login', {});
  // });

  // server.get('/login/account', csrfToken, (req, res, next) => {
  //   app.render(req, res, '/login/account', {});
  // });

  // ---------------------------------------------
  //   Logout
  // ---------------------------------------------

  // server.get('/logout', csrfToken, (req, res, next) => {
  //   app.render(req, res, '/logout', {});
  // });

  // ---------------------------------------------
  //   GET
  // ---------------------------------------------

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  // ---------------------------------------------
  //   POST
  //   これを追加しないとAPIのPOSTが機能しない
  //   https://github.com/zeit/next.js/issues/7960
  // ---------------------------------------------

  server.post("*", (req, res) => {
    return handle(req, res);
  });

  // ---------------------------------------------
  //   Error
  // ---------------------------------------------

  server.use((err, req, res, next) => {
    // logger.error(`${err}`);
    // console.log(`Error: ${err}`);

    res.status(err.status || 500);
    res.send("Error");
  });

  // ---------------------------------------------
  //   listen
  // ---------------------------------------------

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

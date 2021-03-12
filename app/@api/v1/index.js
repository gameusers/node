// --------------------------------------------------
//   Require
// --------------------------------------------------

const express = require("express");

const initialize = require("./initialize");
const login = require("./login");

// --------------------------------------------------
//   Router
// --------------------------------------------------

const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.use("/initialize", initialize);
}

router.use("/login", login);

// --------------------------------------------------
//   exports
// --------------------------------------------------

module.exports = router;

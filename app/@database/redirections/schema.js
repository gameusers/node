// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, required: true },
  statusCode: { type: Number, required: true },
  source: { type: String, required: true, unique: true },
  destination: { type: String, required: true, unique: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["redirections"]) {
  model = mongoose.model("redirections");
} else {
  model = mongoose.model("redirections", schema);
}

module.exports = model;

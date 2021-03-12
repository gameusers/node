// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  urlID: { type: String, required: true },
  language: { type: String, enum: ["en", "ja"], required: true },
  name: { type: String, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["titles"]) {
  model = mongoose.model("titles");
} else {
  model = mongoose.model("titles", schema);
}

module.exports = model;

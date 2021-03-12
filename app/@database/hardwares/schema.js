// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  createdDate: { type: Date, required: true },
  updatedDate: { type: Date, required: true },
  language: { type: String, enum: ["en", "ja"], required: true },
  country: { type: String, enum: ["US", "JP"], required: true },
  hardwareID: { type: String, required: true },
  urlID: { type: String, required: true },
  name: { type: String, required: true },
  searchKeywordsArr: [String],
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["hardwares"]) {
  model = mongoose.model("hardwares");
} else {
  model = mongoose.model("hardwares", schema);
}

module.exports = model;

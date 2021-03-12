// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  createdDate: { type: Date, default: Date.now, required: true },
  updatedDate: { type: Date, default: Date.now, required: true },
  language: { type: String, enum: ["en", "ja"], required: true },
  country: { type: String, enum: ["US", "JP"], required: true },
  developerPublisherID: { type: String, required: true },
  urlID: { type: String, required: true },
  name: { type: String, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["developers-publishers"]) {
  model = mongoose.model("developers-publishers");
} else {
  model = mongoose.model("developers-publishers", schema);
}

module.exports = model;

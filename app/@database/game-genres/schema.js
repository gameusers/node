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
  genreID: { type: String, required: true },
  urlID: { type: String, required: true },
  name: { type: String, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["game-genres"]) {
  model = mongoose.model("game-genres");
} else {
  model = mongoose.model("game-genres", schema);
}

module.exports = model;

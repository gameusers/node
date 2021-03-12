// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  createdDate: { type: Date, required: true, index: true },
  updatedDate: { type: Date, required: true },
  approval: { type: Boolean, required: true },
  users_id: { type: String, required: true },
  games_id: { type: String },
  urlID: { type: String, required: true },
  language: { type: String, enum: ["en", "ja"], required: true },
  country: { type: String, enum: ["US", "JP"], required: true },
  name: { type: String, required: true },
  subtitle: String,
  searchKeywordsArr: [String],
  sortKeyword: { type: String },
  twitterHashtagsArr: [String],
  genreArr: [String],
  genreSubArr: [String],
  genreTagArr: [String],
  hardwareArr: [
    {
      _id: { type: String },
      hardwareID: { type: String, required: true },
      releaseDate: Date,
      playersMin: { type: Number, required: true },
      playersMax: { type: Number, required: true },
      publisherIDsArr: [String],
      developerIDsArr: [String],
    },
  ],
  linkArr: [
    {
      _id: { type: String },
      type: {
        type: String,
        enum: [
          "Official",
          "Twitter",
          "Facebook",
          "YouTube",
          "Steam",
          "MicrosoftStore",
          "AppStore",
          "GooglePlay",
          "Other",
        ],
        required: true,
      },
      label: String,
      url: { type: String, required: true },
    },
  ],
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["games-temps"]) {
  model = mongoose.model("games-temps");
} else {
  model = mongoose.model("games-temps", schema);
}

module.exports = model;

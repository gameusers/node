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
  gameCommunities_id: { type: String, required: true },
  urlID: { type: String, required: true },
  language: { type: String, enum: ["en", "ja"], required: true },
  country: { type: String, enum: ["US", "JP"], required: true },
  imagesAndVideos_id: { type: String },
  imagesAndVideosThumbnail_id: { type: String },
  name: { type: String, required: true },
  subtitle: String,
  sortKeyword: { type: String, required: true },
  searchKeywordsArr: [String],
  twitterHashtagsArr: [String],
  genreArr: [String],
  genreSubArr: [String],
  genreTagArr: [String],
  hardwareArr: [
    {
      _id: { type: String, required: true },
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
      _id: { type: String, required: true },
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

if (mongoose.models["games"]) {
  model = mongoose.model("games");
} else {
  model = mongoose.model("games", schema);
}

module.exports = model;

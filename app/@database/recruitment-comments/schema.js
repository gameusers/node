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
  updatedDate: { type: Date, required: true, index: true },
  gameCommunities_id: { type: String, required: true },
  recruitmentThreads_id: { type: String, required: true },
  users_id: { type: String },
  localesArr: [
    {
      _id: { type: String, required: true },
      language: { type: String, enum: ["en", "ja"], required: true },
      name: { type: String },
      comment: { type: String, required: true },
    },
  ],
  imagesAndVideos_id: { type: String },
  ids_idsArr: [String],
  publicIDsArr: [
    {
      _id: { type: String, required: true },
      platform: {
        type: String,
        enum: [
          "PlayStation",
          "Xbox",
          "Nintendo",
          "PC",
          "Android",
          "iOS",
          "Steam",
          "Origin",
          "Discord",
          "Skype",
          "ICQ",
          "Line",
          "Other",
        ],
        required: true,
      },
      id: { type: String, required: true },
    },
  ],
  publicInformationsArr: [
    {
      _id: { type: String, required: true },
      title: { type: String, required: true },
      information: { type: String, required: true },
    },
  ],
  publicSetting: { type: Number, default: 1, required: true },
  webPushAvailable: { type: Boolean, required: true },
  webPushes_id: { type: String },
  goods: { type: Number, default: 0, required: true },
  replies: { type: Number, default: 0, required: true },
  acceptLanguage: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
});

// --------------------------------------------------
//   Index
// --------------------------------------------------

// schema.index({ createdDate: -1 });

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["recruitment-comments"]) {
  model = mongoose.model("recruitment-comments");
} else {
  model = mongoose.model("recruitment-comments", schema);
}

module.exports = model;

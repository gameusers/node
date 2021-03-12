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
  updatedDate: { type: Date, required: true, index: true },
  gameCommunities_id: { type: String },
  userCommunities_id: { type: String },
  users_id: { type: String },
  localesArr: [
    {
      _id: { type: String, required: true },
      language: { type: String, enum: ["en", "ja"], required: true },
      name: { type: String, required: true },
      comment: { type: String, required: true },
    },
  ],
  imagesAndVideos_id: { type: String },
  comments: { type: Number, default: 0, required: true },
  replies: { type: Number, default: 0, required: true },
  images: { type: Number, default: 0, required: true },
  videos: { type: Number, default: 0, required: true },
  acceptLanguage: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["forum-threads"]) {
  model = mongoose.model("forum-threads");
} else {
  model = mongoose.model("forum-threads", schema);
}

module.exports = model;

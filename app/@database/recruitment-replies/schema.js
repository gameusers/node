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
  gameCommunities_id: { type: String, required: true },
  recruitmentThreads_id: { type: String, required: true },
  recruitmentComments_id: { type: String, required: true },
  replyToRecruitmentReplies_id: { type: String },
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
  goods: { type: Number, default: 0, required: true },
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

if (mongoose.models["recruitment-replies"]) {
  model = mongoose.model("recruitment-replies");
} else {
  model = mongoose.model("recruitment-replies", schema);
}

module.exports = model;

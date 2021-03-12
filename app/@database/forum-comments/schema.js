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
  gameCommunities_id: { type: String },
  userCommunities_id: { type: String },
  forumThreads_id: { type: String, required: true },
  forumComments_id: { type: String },
  replyToForumComments_id: { type: String },
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
  anonymity: { type: Boolean, required: true },
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

if (mongoose.models["forum-comments"]) {
  model = mongoose.model("forum-comments");
} else {
  model = mongoose.model("forum-comments", schema);
}

module.exports = model;

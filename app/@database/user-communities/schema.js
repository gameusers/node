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
  userCommunityID: { type: String, required: true, unique: true },
  users_id: { type: String, required: true },
  localesArr: [
    {
      _id: { type: String, required: true },
      language: { type: String, enum: ["en", "ja"], required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      descriptionShort: { type: String, required: true },
    },
  ],
  imagesAndVideos_id: { type: String },
  imagesAndVideosThumbnail_id: { type: String },
  gameCommunities_idsArr: [String],
  forumObj: {
    threadCount: { type: Number, default: 0, required: true },
  },
  updatedDateObj: {
    forum: { type: Date, required: true },
  },
  communityType: { type: String, required: true },
  anonymity: { type: Boolean, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["user-communities"]) {
  model = mongoose.model("user-communities");
} else {
  model = mongoose.model("user-communities", schema);
}

module.exports = model;

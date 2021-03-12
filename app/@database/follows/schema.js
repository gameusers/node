// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  updatedDate: { type: Date, required: true },
  gameCommunities_id: { type: String },
  userCommunities_id: { type: String },
  users_id: { type: String },
  approval: { type: Boolean, required: true },
  followArr: [String],
  followCount: { type: Number, default: 0, required: true },
  followedArr: [String],
  followedCount: { type: Number, default: 0, required: true },
  approvalArr: [String],
  approvalCount: { type: Number, default: 0, required: true },
  blockArr: [String],
  blockCount: { type: Number, default: 0, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["follows"]) {
  model = mongoose.model("follows");
} else {
  model = mongoose.model("follows", schema);
}

module.exports = model;

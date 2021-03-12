// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  createdDate: { type: Date, required: true, expires: 94608000 }, // 3年
  type: { type: String, enum: ["forumComment", "forumReply"], required: true },
  target_id: { type: String, required: true },
  targetUsers_id: { type: String },
  users_id: { type: String },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["goods"]) {
  model = mongoose.model("goods");
} else {
  model = mongoose.model("goods", schema);
}

module.exports = model;

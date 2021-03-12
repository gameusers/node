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
  forumObj: {
    threadCount: { type: Number, default: 0, required: true },
  },
  recruitmentObj: {
    threadCount: { type: Number, default: 0, required: true },
  },
  updatedDateObj: {
    forum: { type: Date, required: true },
    recruitment: { type: Date, required: true },
  },
  anonymity: { type: Boolean, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["game-communities"]) {
  model = mongoose.model("game-communities");
} else {
  model = mongoose.model("game-communities", schema);
}

module.exports = model;

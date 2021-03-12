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
  users_id: { type: String, required: true },
  exp: { type: Number, required: true },
  historiesArr: [
    {
      _id: { type: String, required: true },
      createdDate: { type: Date, required: true },
      updatedDate: { type: Date, required: true },
      type: {
        type: String,
        enum: [
          "account-ancient",
          "level-count",
          "account-count-day",
          "login-count",
          "good-count-click",
          "good-count-clicked",
          "gc-register",
          "forum-count-post",
          "recruitment-count-post",
          "follow-count",
          "followed-count",
          "title-count",
          "title-show",
          "card-player-edit",
          "card-player-upload-image-main",
          "card-player-upload-image-thumbnail",
          "user-page-upload-image-main",
          "user-page-change-url",
          "web-push-permission",
        ],
        required: true,
      },
      countDay: { type: Number, required: true },
      countMonth: { type: Number, required: true },
      countYear: { type: Number, required: true },
      countValid: { type: Number, required: true },
      countTotal: { type: Number, required: true },
    },
  ],
  acquiredTitles_idsArr: [String],
  selectedTitles_idsArr: [String],
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["experiences"]) {
  model = mongoose.model("experiences");
} else {
  model = mongoose.model("experiences", schema);
}

module.exports = model;

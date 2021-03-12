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
  users_id: { type: String },
  type: {
    type: String,
    enum: ["gc", "uc", "ur", "forum", "recruitment", "other"],
    required: true,
  },
  images: { type: Number, default: 0, required: true },
  videos: { type: Number, default: 0, required: true },
  arr: [
    {
      _id: { type: String, required: true },
      type: { type: String, enum: ["image", "video"], required: true },
      imageType: { type: String, enum: ["JPEG", "PNG", "SVG"] }, // required は不要
      localesArr: {
        type: [
          {
            _id: { type: String, required: true },
            language: { type: String, enum: ["en", "ja"], required: true },
            caption: { type: String, required: true },
          },
        ],
        default: undefined,
      },
      srcSetArr: {
        type: [
          {
            _id: { type: String, required: true },
            w: {
              type: String,
              enum: ["320w", "480w", "640w", "800w", "1920w"],
              required: true,
            },
            width: { type: Number, required: true },
            height: { type: Number, required: true },
          },
        ],
        default: undefined,
      },
      videoChannel: { type: String, enum: ["youtube"] }, // required は不要
      videoID: String,
    },
  ],
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["images-and-videos"]) {
  model = mongoose.model("images-and-videos");
} else {
  model = mongoose.model("images-and-videos", schema);
}

module.exports = model;

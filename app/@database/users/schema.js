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
  accessDate: { type: Date, required: true, index: true },
  userID: { type: String, required: true, unique: true },
  userIDInitial: { type: String, required: true, unique: true },
  pagesObj: {
    imagesAndVideos_id: { type: String },
    arr: [
      {
        _id: { type: String, required: true },
        type: { type: String, enum: ["top", "follow"], required: true },
        title: { type: String, required: true },
        language: { type: String, enum: ["en", "ja"], required: true },
      },
    ],
  },
  loginID: { type: String, required: true, unique: true },
  loginPassword: { type: String, required: true },
  emailObj: {
    value: { type: String },
    confirmation: { type: Boolean, default: false, required: true },
  },
  acceptLanguage: { type: String, required: true },
  countriesArr: [String],
  termsOfServiceAgreedVersion: { type: Date, required: true },
  webPushes_id: { type: String },
  role: { type: String, enum: ["user", "administrator"], required: true },
});

// --------------------------------------------------
//   Index
// --------------------------------------------------

// schema.index({ accessDate: -1 });

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["users"]) {
  model = mongoose.model("users");
} else {
  model = mongoose.model("users", schema);
}

module.exports = model;

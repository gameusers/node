// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  createdDate: { type: Date, required: true, expires: 86400 }, // 1day
  users_id: { type: String, required: true },
  emailConfirmationID: { type: String, required: true },
  type: { type: String, required: true },
  email: { type: String, required: true },
  count: { type: Number, required: true },
  isSuccess: { type: Boolean, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["email-confirmations"]) {
  model = mongoose.model("email-confirmations");
} else {
  model = mongoose.model("email-confirmations", schema);
}

module.exports = model;

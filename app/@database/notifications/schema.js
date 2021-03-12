// --------------------------------------------------
//   Require
// --------------------------------------------------

const mongoose = require("mongoose");

// --------------------------------------------------
//   Schema
// --------------------------------------------------

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  createdDate: { type: Date, required: true, expires: 86400 * 90 }, // 1day * 90 = 3months
  done: { type: Boolean, required: true },
  type: { type: String, required: true },
  arr: [
    {
      _id: { type: String, required: true },
      type: { type: String, required: true },
      db: { type: String, required: true },
    },
  ],
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["notifications"]) {
  model = mongoose.model("notifications");
} else {
  model = mongoose.model("notifications", schema);
}

module.exports = model;

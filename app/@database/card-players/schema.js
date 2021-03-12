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
  language: { type: String, enum: ["en", "ja"], required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  imagesAndVideos_id: { type: String },
  imagesAndVideosThumbnail_id: { type: String },
  comment: { type: String },
  age: { type: Date },
  ageAlternativeText: { type: String },
  sex: { type: String, enum: ["", "male", "female"] },
  sexAlternativeText: { type: String },
  address: { type: String },
  addressAlternativeText: { type: String },
  gamingExperience: { type: String },
  gamingExperienceAlternativeText: { type: String },
  hobbiesArr: [String],
  specialSkillsArr: [String],
  smartphoneModel: { type: String },
  smartphoneComment: { type: String },
  tabletModel: { type: String },
  tabletComment: { type: String },
  pcModel: { type: String },
  pcComment: { type: String },
  pcSpecsObj: {
    os: { type: String },
    cpu: { type: String },
    cpuCooler: { type: String },
    motherboard: { type: String },
    memory: { type: String },
    storage: { type: String },
    graphicsCard: { type: String },
    opticalDrive: { type: String },
    powerSupply: { type: String },
    pcCase: { type: String },
    monitor: { type: String },
    mouse: { type: String },
    keyboard: { type: String },
  },
  hardwareActiveArr: [String],
  hardwareInactiveArr: [String],
  ids_idsArr: [String],
  activityTimeArr: [
    {
      _id: { type: String, required: true },
      beginTime: { type: String, required: true },
      endTime: { type: String, required: true },
      weekArr: { type: [Number], required: true },
    },
  ],
  lookingForFriends: { type: Boolean, required: true },
  lookingForFriendsIcon: { type: String, required: true },
  lookingForFriendsComment: { type: String },
  voiceChat: { type: Boolean, required: true },
  voiceChatComment: { type: String },
  linkArr: [
    {
      _id: { type: String, required: true },
      type: {
        type: String,
        enum: [
          "Twitter",
          "Facebook",
          "Instagram",
          "YouTube",
          "Twitch",
          "Steam",
          "Discord",
          "Flickr",
          "Tumblr",
          "Pinterest",
          "Other",
        ],
        required: true,
      },
      label: String,
      url: { type: String, required: true },
    },
  ],
  search: { type: Boolean, required: true },
});

// --------------------------------------------------
//   Exports
// --------------------------------------------------

let model = "";

if (mongoose.models["card-players"]) {
  model = mongoose.model("card-players");
} else {
  model = mongoose.model("card-players", schema);
}

module.exports = model;

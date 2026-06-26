const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  college: {
    type: String,
    default: "",
  },

  branch: {
    type: String,
    default: "",
  },

  year: {
    type: Number,
  },

  bio: {
    type: String,
    default: "",
  },

  skills: [
    {
      type: String,
    },
  ],

  interests: [
    {
      type: String,
    },
  ],

  availability: {
    type: String,
    enum: ["Available", "Busy"],
    default: "Available",
  },

  experience: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },

  github: {
    type: String,
    default: "",
  },

  linkedin: {
    type: String,
    default: "",
  },

  profilePic: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);

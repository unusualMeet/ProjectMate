const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  requiredSkills: [
    {
      type: String,
    },
  ],

  teamSize: {
    type: Number,
    default: 4,
  },

  status: {
    type: String,
    default: "Open",
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  // =========================
  // NEW APPLICATION NOTIFICATION FIELDS
  // =========================
  hasNewApplications: {
    type: Boolean,
    default: false,
  },

  newApplicationsCount: {
    type: Number,
    default: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("project", ProjectSchema);
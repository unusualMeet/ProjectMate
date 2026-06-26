const mongoose = require("mongoose");
const ApplicationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resume: {
    type: String,
    required: true
}
});
module.exports = mongoose.model("application", ApplicationSchema);
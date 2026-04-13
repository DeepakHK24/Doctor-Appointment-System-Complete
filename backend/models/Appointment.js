const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Availability"
  },
  date: String,
  time: String,
  status: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
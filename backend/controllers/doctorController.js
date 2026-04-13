const User = require("../models/User");
const Appointment = require("../models/Appointment");

// GET ALL DOCTORS
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// GET DOCTOR APPOINTMENTS
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id
    }).populate("patientId", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// APPROVE / REJECT
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorAppointments,
  updateAppointmentStatus
};
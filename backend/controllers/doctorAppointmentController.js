const Appointment = require("../models/Appointment");

// GET ALL APPOINTMENTS FOR DOCTOR
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id
    })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE APPOINTMENT STATUS
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Appointment updated", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctorAppointments,
  updateAppointmentStatus
};

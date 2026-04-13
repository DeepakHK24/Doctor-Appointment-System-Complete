const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");
const { createNotification } = require("./notificationController");

/* =================================
   BOOK APPOINTMENT (SAFE)
================================= */
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId } = req.body;

    if (!doctorId || !slotId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const slot = await Availability.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      slot: slotId,
      status: "pending",
    });

    slot.isBooked = true;
    await slot.save();

    // 🔔 Notify doctor
    await createNotification(
      doctorId,
      "New appointment request received"
    );

    res.status(201).json(appointment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
};

/* =================================
   GET MY APPOINTMENTS (PATIENT)
================================= */
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id
    })
      .populate("doctor", "name")
      .populate("slot");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

/* =================================
   GET DOCTOR APPOINTMENTS
================================= */
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id
    })
      .populate("patient", "name")
      .populate("slot");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

/* =================================
   CANCEL APPOINTMENT (SAFE)
================================= */
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel this appointment" });
    }

    const slot = await Availability.findById(appointment.slot);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    await appointment.deleteOne();

    // 🔔 Notify doctor
    await createNotification(
      appointment.doctor,
      "An appointment was cancelled by the patient"
    );

    res.json({ message: "Appointment cancelled successfully" });

  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
};

/* =================================
   DOCTOR UPDATE STATUS (SAFE)
================================= */
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (status === "approved") {
      appointment.status = "approved";

      await Availability.findByIdAndUpdate(appointment.slot, {
        isBooked: true,
      });

      // 🔔 Notify patient
      await createNotification(
        appointment.patient,
        "Your appointment has been approved"
      );
    }

    if (status === "rejected") {
      appointment.status = "rejected";

      await Availability.findByIdAndUpdate(appointment.slot, {
        isBooked: false,
      });

      // 🔔 Notify patient
      await createNotification(
        appointment.patient,
        "Your appointment has been rejected"
      );
    }

    await appointment.save();

    res.json({ message: "Appointment updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  updateAppointmentStatus,
};
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

/* ================================
   ADMIN DASHBOARD STATS
   GET /api/admin/stats
================================ */
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalDoctors = await User.countDocuments({
      role: "doctor",
    });

    const pendingDoctors = await User.countDocuments({
      role: "doctor",
      isApproved: false,
    });

    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalUsers,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET ALL DOCTORS (Pending)
   GET /api/admin/doctors
================================ */
const getDoctorApplications = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      isApproved: false,
    }).select("-password");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET ALL PATIENTS
   GET /api/admin/patients
================================ */
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({
      role: "patient",
    }).select("-password");

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET ALL APPOINTMENTS
   GET /api/admin/appointments
================================ */
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   APPROVE DOCTOR
   PUT /api/admin/approve/:id
================================ */
const updateDoctorStatus = async (req, res) => {
  try {
    const { id, action } = req.body;

    const doctor = await User.findById(id);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (action === "approve") {
      doctor.isApproved = true;
      await doctor.save();

      await Notification.create({
        user: doctor._id,
        message: "Your doctor account has been approved by admin"
      });

      return res.json({ message: "Doctor approved successfully" });
    }

    if (action === "reject") {
      doctor.role = "patient";
      doctor.isApproved = true;
      await doctor.save();

      await Notification.create({
        user: doctor._id,
        message: "Your doctor application has been rejected"
      });

      return res.json({ message: "Doctor rejected successfully" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAdminStats,
  getDoctorApplications,
  getAllPatients,
  getAllAppointments,
  updateDoctorStatus,
};
const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getDoctorApplications,
  updateDoctorStatus,
  getAllPatients,
  getAllAppointments
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ================================
   ADMIN STATS
================================ */
router.get("/stats", protect, adminOnly, getAdminStats);

/* ================================
   GET ALL DOCTORS
================================ */
router.get("/doctors", protect, adminOnly, getDoctorApplications);

/* ================================
   GET ALL PATIENTS
================================ */
router.get("/patients", protect, adminOnly, getAllPatients);

/* ================================
   GET ALL APPOINTMENTS
================================ */
router.get("/appointments", protect, adminOnly, getAllAppointments);

/* ================================
   APPROVE DOCTOR
================================ */
router.put("/doctor-action", protect, adminOnly, updateDoctorStatus);

module.exports = router;
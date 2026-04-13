const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

// Patient
router.post("/book", protect, bookAppointment);
router.get("/my", protect, getMyAppointments);
router.delete("/:id", protect, cancelAppointment);

// Doctor
router.get("/doctor", protect, getDoctorAppointments);
router.put("/update/:id", protect, updateAppointmentStatus);

module.exports = router;
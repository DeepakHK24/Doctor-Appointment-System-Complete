const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");
const { protect } = require("../middleware/authMiddleware");

/* ================================
   ADD SLOT (Doctor)
================================ */
router.post("/add", protect, async (req, res) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time required" });
    }

    const slot = await Availability.create({
      doctorId: req.user._id,
      date,
      time,
      isBooked: false
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Failed to add slot" });
  }
});

/* ================================
   GET MY SLOTS (Doctor)
================================ */
router.get("/my", protect, async (req, res) => {
  try {
    const slots = await Availability.find({
      doctorId: req.user._id
    }).sort({ date: 1 });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch slots" });
  }
});

/* ================================
   GET SLOTS BY DOCTOR (Patient)
================================ */
router.get("/:doctorId", protect, async (req, res) => {
  try {
    const slots = await Availability.find({
      doctorId: req.params.doctorId,
      isBooked: false
    }).sort({ date: 1 });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctor slots" });
  }
});

module.exports = router;
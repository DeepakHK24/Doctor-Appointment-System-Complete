const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* GET ALL DOCTORS */
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "_id name"
    );
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

module.exports = router;
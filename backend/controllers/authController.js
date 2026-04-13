const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

/* ============================
   REGISTER USER
============================ */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient", // default patient
    });

    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   LOGIN USER
============================ */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚫 BLOCK UNAPPROVED DOCTORS
    if (user.role === "doctor" && !user.isApproved === false) {
      return res.status(403).json({
        message: "Doctor account pending admin approval",
      });
    }

    res.json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
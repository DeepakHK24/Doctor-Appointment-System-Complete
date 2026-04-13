const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ===============================
   PROTECT MIDDLEWARE
=============================== */
const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

/* ===============================
   ADMIN ONLY MIDDLEWARE
=============================== */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

module.exports = { protect, adminOnly };
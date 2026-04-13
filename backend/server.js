const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ================================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

/* ================================
   DATABASE CONNECTION
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) =>
    console.error("❌ MongoDB Connection Failed:", err.message)
  );

/* ================================
   ROUTES
================================ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/appointment", require("./routes/appointmentRoutes"));
app.use("/api/availability", require("./routes/availabilityRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));

/* 🔐 ADMIN ROUTES (NEW - SAFE ADDITION) */
app.use("/api/admin", require("./routes/adminRoutes"));

/* ================================
   ROOT ROUTE
================================ */
app.get("/", (req, res) => {
  res.send("Doctor Appointment System API Running...");
});

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
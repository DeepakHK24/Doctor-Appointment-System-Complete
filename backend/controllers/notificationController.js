const Notification = require("../models/Notification");

/* ===============================
   CREATE NOTIFICATION
=============================== */
const createNotification = async (userId, message) => {
  try {
    await Notification.create({
      user: userId,
      message,
      read: false,
    });
  } catch (error) {
    console.error("Notification creation failed:", error);
  }
};

/* ===============================
   GET MY NOTIFICATIONS
=============================== */
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ===============================
   MARK AS READ
=============================== */
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
};
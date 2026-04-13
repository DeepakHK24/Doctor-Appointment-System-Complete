import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}/api/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="header-card">
        <h1>My Notifications</h1>
        <p>Stay updated with your latest activities</p>
      </div>

      {/* NOTIFICATIONS SECTION */}
      <div className="card notifications-wrapper">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications yet 🎉</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((note) => (
              <div
                key={note._id}
                className={`notification-card ${
                  !note.isRead ? "unread" : ""
                }`}
              >
                <div className="notification-dot"></div>

                <div className="notification-content">
                  <p>{note.message}</p>
                  <span className="notification-time">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/layout.css";

const MainLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">🏥 MedCare</h2>

        <Link to="/dashboard">Dashboard</Link>

        {user?.role === "patient" && (
          <Link to="/dashboard">Book Appointment</Link>
        )}

        {user?.role === "doctor" && (
          <Link to="/dashboard">Manage Requests</Link>
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="topbar">
          <h1>
            Hello, {user?.role === "doctor" ? "Dr." : ""} {user?.name}
          </h1>

          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="stats-container">
          <div className="stat-card blue">
            <h3>Appointments</h3>
            <p>Overview</p>
          </div>

          <div className="stat-card green">
            <h3>Slots</h3>
            <p>Availability</p>
          </div>

          <div className="stat-card purple">
            <h3>Status</h3>
            <p>Activity</p>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
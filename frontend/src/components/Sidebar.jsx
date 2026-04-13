import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/layout.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="sidebar">
      <h2 className="logo">🏥 MediCare</h2>

      <nav>

        {/* ================= DASHBOARD ================= */}
        {/* Dashboard (ONLY for doctor & patient) */}
      {user.role !== "admin" && (
        <NavLink
          to={`/${user.role}-dashboard`}
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Dashboard
        </NavLink>
      )}

        {/* ================= DOCTOR LINKS ================= */}
        {user.role === "doctor" && (
          <>
            <NavLink
              to="/doctor-dashboard/appointments"
              className="sidebar-link"
            >
              Appointments
            </NavLink>

            <NavLink
              to="/doctor-dashboard/slots"
              className="sidebar-link"
            >
              Slots
            </NavLink>
          </>
        )}

        {/* ================= ADMIN LINKS ================= */}

        {user.role === "admin" && (
          <>
            <NavLink
              to="/admin?section=doctors"
              className="sidebar-link"
            >
              Pending Doctors
            </NavLink>

            <NavLink
              to="/admin?section=patients"
              className="sidebar-link"
            >
              Patients
            </NavLink>

            <NavLink
              to="/admin?section=appointments"
              className="sidebar-link"
            >
              Appointments
            </NavLink>
          </>
        )}

        {/* ================= NOTIFICATIONS ================= */}
        {(user.role === "doctor" || user.role === "patient") && (
          <NavLink
            to="/notifications"
            className="sidebar-link"
          >
            Notifications
          </NavLink>
        )}

      </nav>

      {/* ================= LOGOUT ================= */}
      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
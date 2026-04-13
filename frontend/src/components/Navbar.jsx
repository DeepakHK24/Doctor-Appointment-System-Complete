import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">🏥 MediCare System</div>

      <div className="nav-links">
        {user?.role === "patient" && (
          <Link to="/patient-dashboard">Dashboard</Link>
        )}

        {user?.role === "doctor" && (
          <Link to="/doctor-dashboard">Dashboard</Link>
        )}

        <Link to="/notifications">Notifications</Link>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
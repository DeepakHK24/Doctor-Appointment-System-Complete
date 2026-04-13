import React, { useEffect, useState } from "react";
import "../styles/layout.css";

const Topbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* =============================
     LOAD SAVED THEME
  ============================== */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      setDarkMode(true);
    }
  }, []);

  /* =============================
     TOGGLE THEME
  ============================== */
  const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  return (
    <div className="topbar">
      {/* LEFT SIDE - USER INFO */}
      <div>
        <h3>Welcome, {user?.name}</h3>
        <p className="role-text">{user?.role?.toUpperCase()}</p>
      </div>

      {/* RIGHT SIDE - THEME TOGGLE */}
      <div className="theme-toggle-wrapper">
        <span className="mode-text">
          {darkMode ? "Dark Mode" : "Light Mode"}
        </span>

        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleTheme}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default Topbar;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import "../styles/dashboard.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const API = "http://localhost:5000";

  /* ================= FETCH DATA ================= */

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/api/appointment/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.log("Error fetching appointments:", err.response?.data);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API}/api/availability/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.log("Error fetching slots:", err.response?.data);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchSlots();
  }, []);

  /* ================= ACTIONS ================= */

  const addSlot = async () => {
    if (!date || !time) {
      alert("Please select date & time");
      return;
    }

    try {
      await axios.post(
        `${API}/api/availability/add`,
        { date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDate("");
      setTime("");
      fetchSlots();
    } catch {
      alert("Failed to add slot");
    }
  };

  const updateStatus = async (id, status) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${status} this appointment?`
    );
    if (!confirmAction) return;

    try {
      await axios.put(
        `${API}/api/appointment/update/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Appointment ${status} successfully`);
      fetchAppointments();
      fetchSlots();
    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to update status");
    }
  };

  /* ================= COUNT ANIMATION ================= */

  const useCountUp = (end) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 800;
      const increment = end / (duration / 20);

      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 20);

      return () => clearInterval(counter);
    }, [end]);

    return count;
  };

  /* ================= PAGES ================= */

  const DashboardHome = () => (
    <div className="doctor-dashboard">
      <div className="dashboard-container">

        <div className="header-card">
          <h1>Doctor Dashboard</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Appointments</h4>
            <h2>{useCountUp(appointments.length)}</h2>
          </div>

          <div className="stat-card">
            <h4>Total Slots</h4>
            <h2>{useCountUp(slots.length)}</h2>
          </div>
        </div>

      </div>
    </div>
  );

  const SlotsPage = () => (
    <div className="doctor-dashboard">
      <div className="dashboard-container">
        <div className="card">
          <h3>Add Available Slot</h3><br></br>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ marginLeft: "10px" }}
          />

          <button
            className="btn btn-success"
            onClick={addSlot}
            style={{ marginLeft: "10px" }}
          >
            Add Slot
          </button>

          <hr style={{ margin: "20px 0" }} />

          <h4>Your Slots</h4>

          {slots.map((slot) => (
            <div key={slot._id} className="item-box">
              {slot.date} | {slot.time} |{" "}
              {slot.isBooked ? "Booked" : "Available"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AppointmentsPage = () => (
    <div className="doctor-dashboard">
      <div className="dashboard-container">
        <div className="card">
          <h3>Appointment Requests</h3><br></br>

          {appointments.length === 0 && <p>No appointment requests</p>}

          {appointments.map((app) => (
            <div key={app._id} className="item-box">
              <h4>{app.patient?.name}</h4>
              <p>
                {app.slot?.date} | {app.slot?.time}
              </p>

              <p>
                Status:{" "}
                <span className={`status-${app.status}`}>
                  {app.status}
                </span>
              </p>

              {app.status === "pending" && (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => updateStatus(app._id, "approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => updateStatus(app._id, "rejected")}
                    style={{ marginLeft: "10px" }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ================= ROUTES ================= */

  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="appointments" element={<AppointmentsPage />} />
      <Route path="slots" element={<SlotsPage />} />
    </Routes>
  );
};

export default DoctorDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const PatientDashboard = () => {
  const API = "http://localhost:5000";

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointments, setAppointments] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  /* ================================
     FETCH DOCTORS
  ================================= */
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API}/api/doctor`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  /* ================================
     FETCH SLOTS
  ================================= */
  const fetchSlots = async (doctorId) => {
    try {
      const res = await axios.get(
        `${API}/api/availability/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  /* ================================
     FETCH MY APPOINTMENTS
  ================================= */
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${API}/api/appointment/my`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  /* ================================
     BOOK APPOINTMENT
  ================================= */
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot) {
      alert("Please select doctor and slot");
      return;
    }

    const confirmBooking = window.confirm(
      "Are you sure you want to book this appointment?"
    );

    if (!confirmBooking) return;

    try {
      await axios.post(
        `${API}/api/appointment/book`,
        {
          doctorId: selectedDoctor,
          slotId: selectedSlot
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("✅ Appointment booked successfully");

      fetchAppointments();
      fetchSlots(selectedDoctor);
      setSelectedSlot("");

    } catch (error) {
      console.log(error.response?.data);
      alert("❌ Booking failed");
    }
  };

  /* ================================
     CANCEL APPOINTMENT
  ================================= */
  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      await axios.delete(
        `${API}/api/appointment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("❌ Appointment cancelled");

      fetchAppointments();
      if (selectedDoctor) {
        fetchSlots(selectedDoctor);
      }

    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Cancel failed");
    }
  };

  /* ================================
     USE EFFECT
  ================================= */
  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchSlots(selectedDoctor);
    } else {
      setSlots([]);
    }
  }, [selectedDoctor]);

  return (
    <div className="patient-dashboard">
      <div className="dashboard-container">

        {/* HEADER CARD */}
        <div className="patient-header">
          <h1>Patient Dashboard</h1>
          <p>Hello, {user?.name || "Patient"} 👋</p>
        </div>

        {/* BOOK SECTION */}
        <div className="card">
          <h2 className="patient-section-title">Book Appointment</h2>

          <div className="slot-form">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              disabled={slots.length === 0}
            >
              {slots.length === 0 ? (
                <option value="">No slots available</option>
              ) : (
                <>
                  <option value="">Select Slot</option>
                  {slots.map((slot) => (
                    <option key={slot._id} value={slot._id}>
                      {slot.date} | {slot.time}
                    </option>
                  ))}
                </>
              )}
            </select>

            {slots.length === 0 && selectedDoctor && (
              <p style={{ color: "#e63757", marginTop: "8px" }}>
                No slots available for this doctor
              </p>
            )}

            <button
              className="btn btn-success"
              onClick={handleBookAppointment}
            >
              Book Appointment
            </button>
          </div>
        </div>

        {/* APPOINTMENTS SECTION */}
        <div className="card">
          <h2 className="patient-section-title">My Appointments</h2>

          {appointments.length === 0 && (
            <p>No appointments found</p>
          )}

          {appointments.map((app) => (
            <div key={app._id} className="appointment-card">
              <div>
                <h3>{app.doctor?.name}</h3>
                <p>Date: {app.slot?.date}</p>
                <p>Time: {app.slot?.time}</p>
                <p className={`status-${app.status}`}>
                  {app.status}
                </p>
              </div>

              {app.status === "pending" && (
                <button
                  className="btn btn-danger"
                  onClick={() => cancelAppointment(app._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
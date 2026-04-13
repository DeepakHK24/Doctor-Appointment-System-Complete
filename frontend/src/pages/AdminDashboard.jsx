import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../styles/dashboard.css";

const AdminDashboard = () => {
  const API = "http://localhost:5000";
  const token = localStorage.getItem("token");

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const section = query.get("section") || "doctors";

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const docRes = await axios.get(`${API}/api/admin/doctors`, { headers });
      const patRes = await axios.get(`${API}/api/admin/patients`, { headers });
      const appRes = await axios.get(`${API}/api/admin/appointments`, { headers });

      setDoctors(docRes.data);
      setPatients(patRes.data);
      setAppointments(appRes.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const doctorAction = async (id, action) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this doctor?`
    );
    if (!confirmAction) return;

    await axios.put(
      `${API}/api/admin/doctor-action`,
      { id, action },
      { headers }
    );

    fetchData();
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-container">

        <div className="header-card">
          <h1>Admin Dashboard</h1>
          <p>System Management Panel</p>
        </div>

        {/* ================= DOCTORS ================= */}
        {section === "doctors" && (
          <div className="card">
            <h2>Pending Doctors</h2><br></br>

            {doctors.length === 0 && <p>No pending doctors</p>}

            {doctors.map((doc) => (
              <div key={doc._id} className="item-box">
                <div>
                  <strong>{doc.name}</strong>
                  <p>{doc.email}</p>
                </div>

                <div>
                  <button
                    className="btn btn-success"
                    onClick={() => doctorAction(doc._id, "approve")}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => doctorAction(doc._id, "reject")}
                    style={{ marginLeft: "10px" }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= PATIENTS ================= */}
        {section === "patients" && (
          <div className="card">
            <h2>All Patients</h2><br></br>

            {patients.map((pat) => (
              <div key={pat._id} className="item-box">
                <strong>{pat.name}</strong>
                <p>{pat.email}</p>
              </div>
            ))}
          </div>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {section === "appointments" && (
          <div className="card">
            <h2>All Appointments</h2><br></br>

            {appointments
                .filter(app => app.status === "approved")
                .map((app) => (
                    <div key={app._id} className="item-box">
                    <strong>
                        {app.patient?.name} - {app.doctor?.name}
                    </strong>
                    </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
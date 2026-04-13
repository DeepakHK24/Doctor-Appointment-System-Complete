import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes With Layout */}
        <Route
          path="/doctor-dashboard/*"
          element={
            <ProtectedRoute>
              <Layout>
                <DoctorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-dashboard/*"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
import API from "./axios";

// Get patient appointments
export const getPatientAppointments = () =>
  API.get("/api/appointment/patient");

// Cancel appointment
export const cancelAppointment = (id) =>
  API.put(`/api/appointment/cancel/${id}`)
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Role-based route protection
 * @param allowedRoles - array of roles allowed to access route
 */
const RoleRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;

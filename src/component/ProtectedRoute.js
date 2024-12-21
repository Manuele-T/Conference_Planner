import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
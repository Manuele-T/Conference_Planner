import React from "react";
import { Navigate } from "react-e4we3-dom";

// Redirects to login if user is not authenticated
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
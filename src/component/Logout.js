import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove all user-related data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    // Reset global user state
    setUser(null);

    alert("You have been logged out.");
    navigate("/login"); // Redirect to login page
  }, [navigate, setUser]);

  return <div>Logging out...</div>;
}

export default Logout;

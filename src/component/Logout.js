import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken"); // Remove token
    setUser(null); // Reset user state
    alert("You have been logged out.");
    navigate("/login"); // Redirect to login page
  }, [navigate, setUser]);

  return <div>Logging out...</div>;
}

export default Logout;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setUser }) {
  const navigate = useNavigate();

  // Clears user data, updates state, and redirects to login
  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    setUser(null);
    alert("You have been logged out.");
    navigate("/login");
  }, [navigate, setUser]);

  return <div>Logging out...</div>;
}

export default Logout;
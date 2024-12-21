import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    setUser(null); // Reset global user state
    alert("You have been logged out.");
    navigate("/login");
  }, [navigate, setUser]);

  return <div>Logging out...</div>;
}

export default Logout;

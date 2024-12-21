import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TalksList from "./component/TalksList";
import SpeechesOfInterest from "./component/SpeechesOfInterest";
import SpeechesToAttend from "./component/SpeechesToAttend";
import Login from "./component/Login";
import Register from "./component/Register";
import Logout from "./component/Logout";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null); // Manage logged-in username

  // On mount, see if there's a "username" in localStorage 
  // (in case the user had previously logged in and refreshed).
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername);
    }
  }, []);

  return (
    <BrowserRouter>
      <div style={{ padding: "10px", display: "flex", gap: "15px", borderBottom: "1px solid #ccc" }}>
        <span style={{ marginRight: "auto", fontWeight: "bold" }}>
          {user ? `Welcome, ${user}` : "You are not logged in"}
        </span>
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>Talks</Link>
        <Link to="/speeches-of-interest" style={{ textDecoration: "none", fontWeight: "bold" }}>Speeches of Interest</Link>
        <Link to="/speeches-to-attend" style={{ textDecoration: "none", fontWeight: "bold" }}>Your Schedule</Link>
        <Link to="/login" style={{ textDecoration: "none", fontWeight: "bold" }}>Login</Link>
        <Link to="/register" style={{ textDecoration: "none", fontWeight: "bold" }}>Register</Link>
        <Link to="/logout" style={{ textDecoration: "none", fontWeight: "bold" }}>Logout</Link>
      </div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<TalksList />} />
        <Route path="/speeches-of-interest" element={<SpeechesOfInterest />} />
        <Route path="/speeches-to-attend" element={<SpeechesToAttend />} /> {/* <--- No ProtectedRoute */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

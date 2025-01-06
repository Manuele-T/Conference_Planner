import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TalksList from "./component/TalksList";
import SpeechesOfInterest from "./component/SpeechesOfInterest";
import SpeechesToAttend from "./component/SpeechesToAttend";
import Login from "./component/Login";
import Register from "./component/Register";
import Logout from "./component/Logout";
// import ProtectedRoute from "./component/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Manage logged-in username

  // On mount, see if there's a "username" in localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername);
    }
  }, []);

  // Main routing setup for the application
  return (
    <BrowserRouter>
      <div className="top-bar">
        <span className="welcome-text">
          {user ? `Welcome, ${user}` : "You are not logged in"}
        </span>
        <Link className="nav-link" to="/">
          Talks
        </Link>
        <Link className="nav-link" to="/speeches-of-interest">
          Speeches of Interest
        </Link>
        <Link className="nav-link" to="/speeches-to-attend">
          Your Schedule
        </Link>
        <Link className="nav-link" to="/login">
          Login
        </Link>
        <Link className="nav-link" to="/register">
          Register
        </Link>
        <Link className="nav-link" to="/logout">
          Logout
        </Link>
      </div>
      <div className="container-wrapper">
        <Routes>
          <Route path="/" element={<TalksList />} />
          <Route
            path="/speeches-of-interest"
            element={<SpeechesOfInterest />}
          />
          <Route path="/speeches-to-attend" element={<SpeechesToAttend />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout setUser={setUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

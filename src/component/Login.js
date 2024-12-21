import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending login request:", { username, password });
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Received login response:", data); // Log the raw data

      if (response.ok) {
        // Save token, username, and userId in local storage
        console.log("Login successful. Storing auth token, username, userId...");
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);
        // If you included userId from the server:
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        } else {
          // If the server didn't provide userId, explicitly set it to null
          localStorage.setItem("userId", "null");
        }

        // Update global user state (this is just the username for the top bar)
        setUser(data.username);
        console.log("Global user state updated:", data.username);

        alert(`Login successful! Welcome, ${data.username}!`);
        navigate("/");
      } else {
        console.warn("Login failed with message:", data.message);
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error in login request:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "10px", width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

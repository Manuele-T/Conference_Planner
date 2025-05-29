import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [username, setUsername] = useState(""); // State for username input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for login error messages

  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      console.log("Sending login request:", { username, password }); // Log login request details
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Send login data in request body
      });

      const data = await response.json(); // Parse response JSON
      console.log("Received login response:", data); // Log response data

      if (response.ok) {
        localStorage.setItem("authToken", data.token); // Store authentication token
        localStorage.setItem("username", data.username); // Store username
        localStorage.setItem("userId", data.userId); // Store user ID

        setUser(data.username); // Update user state
        console.log("Global user state updated:", data.username); // Log state update

        alert(`Login successful! Welcome, ${data.username}!`); // Show success message
        navigate("/"); // Navigate to home page
      } else {
        console.warn("Login failed with message:", data.message); // Log failure message
        setError(data.message || "Login failed"); // Set error message
      }
    } catch (err) {
      console.error("Error in login request:", err); // Log request error
      setError("An error occurred. Please try again."); // Set general error message
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Login</h1>
      <form
        onSubmit={handleLogin} // Handle form submission
        className="mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            value={username} // Controlled input for username
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            value={password} // Controlled input for password
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
            className="form-control"
          />
        </div>
        {error && <p className="text-danger">{error}</p>} {/* Display error message if any */}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login; // Export Login component
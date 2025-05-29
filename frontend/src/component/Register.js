import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Handles user registration and redirects to login on success
function Register() {
  const [username, setUsername] = useState(""); // State for username input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Send registration data
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!"); // Notify user of success
        navigate("/login"); // Redirect to login page
      } else {
        setError(data.message || "Registration failed"); // Handle error message
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // General error handling
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Register</h1>
      <form
        onSubmit={handleRegister} // Handle form submission
        className="mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
            className="form-control"
          />
        </div>
        {error && <p className="text-danger">{error}</p>} {/* Display error if present */}
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}
export default Register;
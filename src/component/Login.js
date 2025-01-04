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
      console.log("Received login response:", data);

      if (response.ok) {
        // Save token, username, userId to local storage
        console.log("Login successful. Storing auth token, username, userId...");
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.userId);

        // Update global user state (top bar)
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
    <div className="container">
      <h1 className="text-center my-4">Login</h1>
      <form
        onSubmit={handleLogin}
        className="mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );

}

export default Login;

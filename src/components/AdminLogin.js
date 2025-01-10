import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Updated admin credentials
    const adminUsername = "premkumarbajaru";
    const adminPassword = "Prem@9030";

    if (username === adminUsername && password === adminPassword) {
      // Save authentication status in localStorage
      localStorage.setItem("isAdminAuthenticated", "true");
      toast.success("Admin login successful! Redirecting to /admin"); // Use toast for success
      navigate("/admin"); // Redirect to admin dashboard
    } else {
      toast.error("Invalid credentials. Please try again."); // Use toast for error
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
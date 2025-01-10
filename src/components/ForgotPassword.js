import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css"; // Import the CSS file

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!username || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Fetch the user by username
      const usersResponse = await fetch(
        `http://localhost:3001/users?username=${username}`
      );
      const users = await usersResponse.json();

      if (users.length === 0) {
        setError("User not found.");
        return;
      }

      const user = users[0];

      // Update the user's password
      const updateResponse = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update password.");
      }

      setMessage("Password reset successfully!");
      setError("");
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Failed to reset password. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}
        <button className="reset-button" onClick={handleResetPassword}>
          Reset Password
        </button>
        <p className="back-to-login" onClick={() => navigate("/login")}>
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
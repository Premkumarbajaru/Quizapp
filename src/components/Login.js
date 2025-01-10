import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Attempting to log in with username:", username); // Debugging

    try {
      const response = await fetch("http://localhost:3001/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const users = await response.json();
      console.log("Users from backend:", users); // Debugging

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        console.log("User found:", user); // Debugging
        localStorage.setItem("userId", user.id); // Store user ID in localStorage
        localStorage.setItem("userRole", user.role); // Store user role in localStorage
        localStorage.setItem("username", user.username); // Store username in localStorage

        if (user.role === "admin") {
          toast.success("Redirecting to admin dashboard"); // Use toast for success
          navigate("/admin"); // Redirect admin to admin dashboard
        } else {
          console.log("Fetching assigned quizzes for user:", user.username); // Debugging
          const assignedQuizzesResponse = await fetch(
            `http://localhost:3001/quizzes?assignedTo=${user.username}`
          );
          if (!assignedQuizzesResponse.ok) {
            throw new Error("Failed to fetch assigned quizzes");
          }
          const assignedQuizzes = await assignedQuizzesResponse.json();
          console.log("Assigned quizzes:", assignedQuizzes); // Debugging

          if (assignedQuizzes.length > 0) {
            toast.success("Redirecting to quiz start page"); // Use toast for success
            navigate(`/quiz/${assignedQuizzes[0].id}/start`); // Redirect to the first assigned quiz
          } else {
            toast.info("No quizzes assigned, redirecting to user dashboard"); // Use toast for info
            navigate("/user-dashboard"); // Redirect to user dashboard if no quizzes are assigned
          }
        }
      } else {
        toast.error("Invalid credentials"); // Use toast for error
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error); // Debugging
      toast.error("An error occurred. Please try again."); // Use toast for error
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Navigate to forgot password page
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <p className="forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </p>
      </div>
    </div>
  );
};

export default Login;
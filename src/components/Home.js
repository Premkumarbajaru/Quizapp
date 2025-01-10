import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Quiz App</h1>
      <h1>Get started</h1>

      <div className="d-flex justify-content-center gap-3 mt-4">
        {/* Register Button */}
        <Link to="/register" className="btn btn-primary btn-lg">
          Register
        </Link>

        {/* Login Button */}
        <Link to="/login" className="btn btn-success btn-lg">
          Login
        </Link>

        {/* Admin Button */}
        <Link to="/admin-login" className="btn btn-warning btn-lg"> {/* Redirect to admin login */}
          Admin
        </Link>
      </div>
    </div>
  );
};

export default Home;
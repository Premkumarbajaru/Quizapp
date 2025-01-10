import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS file
import Home from "./components/Home";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import CreateUser from "./components/CreateUser";
import CreateQuiz from "./components/CreateQuiz";
import QuizGameStart from "./components/QuizGameStart";
import QuizPreview from "./components/QuizPreview";
import UserDashboard from "./components/UserDashboard";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Router>
      {/* ToastContainer for toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Default route (Home) */}
        <Route path="/" element={<Home />} />

        {/* Authentication routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />

        {/* User routes */}
        <Route path="/user-dashboard" element={<UserDashboard />} />

        {/* Quiz routes */}
        <Route path="/quiz/:id" element={<QuizPreview />} />
        <Route path="/quiz/:id/start" element={<QuizGameStart />} />
        <Route path="/quiz/:id/preview" element={<QuizPreview />} />
      </Routes>
    </Router>
  );
};

export default App;
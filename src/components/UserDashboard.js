import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css"; // Import the CSS file

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username"); // Retrieve username from localStorage

    if (!username) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3001/quizzes?assignedTo=${username}`)
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, [navigate]);

  return (
    <div className="user-dashboard-container">
      <h2>Your Quizzes</h2>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <h3>{quiz.quizName}</h3>
            <button
              className="start-quiz-button"
              onClick={() => navigate(`/quiz/${quiz.id}/start`)}
            >
              Start Quiz
            </button>
          </div>
        ))
      ) : (
        <p>No quizzes assigned to you.</p>
      )}
    </div>
  );
};

export default UserDashboard;
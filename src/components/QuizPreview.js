import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/QuizPreview.css"; // Import the CSS file

const QuizPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0); // Track the user's score
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    // Fetch quiz data
    fetch(`http://localhost:3001/quizzes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Quiz not found");
        return res.json();
      })
      .then((data) => {
        console.log("Quiz Data:", data); // Debugging
        setQuiz(data);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        setError("Failed to fetch quiz data.");
      });

    // Fetch questions for the quiz
    fetch(`http://localhost:3001/questions?quizId=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Questions not found");
        return res.json();
      })
      .then((data) => {
        console.log("Questions Data:", data); // Debugging
        setQuestions(data);
        setLoading(false); // Data fetching is complete
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setError("Failed to fetch questions.");
        setLoading(false); // Data fetching is complete (with error)
      });
  }, [id]);

  // Calculate the user's score (for demonstration purposes)
  useEffect(() => {
    if (questions.length > 0) {
      const userScore = questions.filter(
        (question) => question.userAnswer === question.answer
      ).length;
      setScore(userScore);
    }
  }, [questions]);

  const handleSave = async () => {
    try {
      // Save user's answers to the questions array in db.json
      const updatedQuestions = questions.map((question) => ({
        ...question,
        userAnswer: question.userAnswer || null, // Add user's answer
      }));

      // Update each question in the database
      await Promise.all(
        updatedQuestions.map((question) =>
          fetch(`http://localhost:3001/questions/${question.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(question),
          })
        )
      );

      alert("Quiz saved successfully!");
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  const handlePublish = async () => {
    try {
      // Publish the quiz by setting published to true
      await fetch(`http://localhost:3001/quizzes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });

      alert("Quiz published successfully!");
    } catch (error) {
      console.error("Error publishing quiz:", error);
      alert("Failed to publish quiz. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading quiz...</div>; // Show loading state
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>; // Show error message
  if (!quiz) return <div className="text-center mt-5">Quiz not found.</div>; // Show if quiz data is missing

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Quiz Preview: {quiz.quizName}</h2>

      {/* Display the user's score attractively */}
      <div className="card text-white bg-success mb-4">
        <div className="card-body text-center">
          <h3 className="card-title">Your Score</h3>
          <p className="card-text display-4">
            {score} / {questions.length}
          </p>
        </div>
      </div>

      {/* Display quiz questions and answers */}
      {questions.length === 0 ? (
        <p className="text-center">No questions found for this quiz.</p>
      ) : (
        questions.map((question, index) => (
          <div key={question.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Question {index + 1}</h5>
              <p className="card-text">{question.text}</p>
              {question.type === "MCQ" && (
                <ul className="list-group">
                  {question.options.map((option, i) => (
                    <li
                      key={i}
                      className={`list-group-item ${
                        option === question.answer ? "list-group-item-success" : ""
                      }`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-success">
                <strong>Correct Answer:</strong> {question.answer}
              </p>
            </div>
          </div>
        ))
      )}

      {/* Action Buttons */}
      <div className="text-center mt-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => navigate(`/quiz/${id}/start`)} // Navigate to quiz start
        >
          Preview Quiz
        </button>
        <button className="btn btn-success me-2" onClick={handleSave}>
          Save
        </button>
        <button className="btn btn-warning" onClick={handlePublish}>
          Publish
        </button>
      </div>

      {/* Back to Dashboard button */}
      <div className="text-center mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/user")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizPreview;
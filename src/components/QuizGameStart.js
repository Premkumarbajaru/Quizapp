import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "../styles/QuizGameStart.css";

const QuizGameStart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3001/quizzes/${id}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to fetch quiz data."); // Use toast for error
      });

    fetch(`http://localhost:3001/questions?quizId=${id}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((error) => {
        console.error("Error fetching questions:", error);
        toast.error("Failed to fetch questions."); // Use toast for error
      });
  }, [id]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleTextAnswerChange = (e) => {
    setTextAnswer(e.target.value);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: e.target.value,
    }));
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type === "MCQ" && selectedAnswer === currentQuestion.answer) {
      setScore(score + 1);
    } else if (currentQuestion.type === "F/B" || currentQuestion.type === "Q&A") {
      if (textAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
        setScore(score + 1);
      }
    }

    setSelectedAnswer(null);
    setTextAnswer("");

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      toast.success("Quiz completed!"); // Use toast for success
    }
  };

  const handleClear = () => {
    setSelectedAnswer(null);
    setTextAnswer("");
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: null,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedQuestions = questions.map((question, index) => ({
        ...question,
        userAnswer: userAnswers[index] || null,
      }));

      await Promise.all(
        updatedQuestions.map((question) =>
          fetch(`http://localhost:3001/questions/${question.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(question),
          })
        )
      );

      toast.success("Quiz saved successfully!"); // Use toast for success
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz. Please try again."); // Use toast for error
    }
  };

  const handlePreview = () => {
    navigate(`/quiz/${id}/preview`);
  };

  const handlePublish = async () => {
    try {
      await fetch(`http://localhost:3001/quizzes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });

      toast.success("Quiz published successfully!"); // Use toast for success
    } catch (error) {
      console.error("Error publishing quiz:", error);
      toast.error("Failed to publish quiz. Please try again."); // Use toast for error
    }
  };

  if (!quiz || questions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  if (quizCompleted) {
    return (
      <div className="completed-container">
        <h2 className="completed-title">Quiz Completed!</h2>
        <p className="score-text">Your score: {score} out of {questions.length}</p>
        <div className="action-buttons">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="preview-button" onClick={handlePreview}>
            Preview
          </button>
          <button className="publish-button" onClick={handlePublish}>
            Publish
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Quiz: {quiz.quizName}</h2>
      <div className="question-card">
        <h5 className="question-text">Question {currentQuestionIndex + 1}</h5>
        <p className="card-text">{currentQuestion.text}</p>

        {(currentQuestion.type === "F/B" || currentQuestion.type === "Q&A") && (
          <input
            type="text"
            className="text-input"
            value={textAnswer}
            onChange={handleTextAnswerChange}
            placeholder="Type your answer here..."
          />
        )}

        {currentQuestion.type === "MCQ" && (
          <ul className="options-list">
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <button
                  className={`option-button ${
                    selectedAnswer === option ? "active" : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="button-group">
          <button
            className="clear-button"
            onClick={handleClear}
            disabled={!selectedAnswer && !textAnswer}
          >
            Clear
          </button>
          <button
            className="next-button"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer && !textAnswer}
          >
            {currentQuestionIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizGameStart;
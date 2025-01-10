import React, { useState } from "react";

const CreateQuiz = () => {
  const [quizName, setQuizName] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuiz = { quizName, noOfQuestions, published: false };
    await fetch("http://localhost:3001/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuiz),
    });
    alert("Quiz created successfully!");
  };

  return (
    <div className="container mt-5">
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Name</label>
          <input
            type="text"
            className="form-control"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Number of Questions</label>
          <input
            type="number"
            className="form-control"
            value={noOfQuestions}
            onChange={(e) => setNoOfQuestions(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Save Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
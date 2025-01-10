const handleAssignQuiz = async (quizId, username) => {
  if (!username) {
    alert("Please select a user to assign the quiz.");
    return;
  }

  try {
    console.log("Assigning quiz:", quizId, "to user:", username); // Debugging

    const response = await fetch(`http://localhost:3001/quizzes/${quizId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedTo: username }), // Assign quiz to user by username
    });

    console.log("Response status:", response.status); // Debugging
    console.log("Response data:", await response.json()); // Debugging

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend Error:", errorData); // Debugging
      throw new Error(errorData.message || "Failed to assign quiz.");
    }

    alert("Quiz assigned successfully!");

    // Refresh quizzes
    const updatedQuizzes = await fetch("http://localhost:3001/quizzes").then((res) => res.json());
    setQuizzes(updatedQuizzes);
  } catch (error) {
    console.error("Error assigning quiz:", error); // Debugging
    alert("Failed to assign quiz. Please try again.");
  }
};
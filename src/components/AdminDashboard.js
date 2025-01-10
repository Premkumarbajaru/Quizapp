import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS file
import "../styles/AdminDashboard.css"; // Import your custom CSS file

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch quizzes and users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const quizzesResponse = await fetch("http://localhost:3001/quizzes");
        const quizzesData = await quizzesResponse.json();
        setQuizzes(quizzesData);

        const usersResponse = await fetch("http://localhost:3001/users");
        const usersData = await usersResponse.json();
        const filteredUsers = usersData.filter((user) => user.role === "user");
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Assign quiz to a user
  const handleAssignQuiz = async (quizId, username) => {
    if (!username) {
      toast.warning("Please select a user to assign the quiz.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/quizzes/${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign quiz.");
      }

      toast.success("Quiz assigned successfully!");

      // Refresh quizzes
      const updatedQuizzes = await fetch("http://localhost:3001/quizzes").then((res) => res.json());
      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error("Error assigning quiz:", error);
      toast.error("Failed to assign quiz. Please try again.");
    }
  };

  // Delete a quiz
  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz.");
      }

      toast.success("Quiz deleted successfully!");

      // Refresh quizzes
      const updatedQuizzes = await fetch("http://localhost:3001/quizzes").then((res) => res.json());
      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz. Please try again.");
    }
  };

  // Remove user from a quiz
  const handleRemoveUser = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:3001/quizzes/${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: null }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove user from quiz.");
      }

      toast.success("User removed from quiz successfully!");

      // Refresh quizzes
      const updatedQuizzes = await fetch("http://localhost:3001/quizzes").then((res) => res.json());
      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error("Error removing user from quiz:", error);
      toast.error("Failed to remove user from quiz. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="container">
        <h2>Admin Dashboard</h2>
        <Link to="/create-user" className="btn btn-primary m-2">
          Create User
        </Link>
        <Link to="/create-quiz" className="btn btn-success m-2">
          Create Quiz
        </Link>

        <h3 className="mt-4">Quizzes</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Quiz Name</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>{quiz.quizName}</td>
                    <td>{quiz.assignedTo || "Not Assigned"}</td>
                    <td className="actions-cell">
                      <select
                        className="form-control assign-dropdown mb-2"
                        onChange={(e) => handleAssignQuiz(quiz.id, e.target.value)}
                      >
                        <option value="">Assign to User</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.username}>
                            {user.username}
                          </option>
                        ))}
                      </select>

                      {quiz.assignedTo && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveUser(quiz.id)}
                        >
                          Remove User
                        </button>
                      )}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        Delete Quiz
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No quizzes available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Add ToastContainer to render toast notifications */}
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
    </div>
  );
};

export default AdminDashboard;
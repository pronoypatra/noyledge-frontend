import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./AdminPanel.css";
import "../../App.css";

function AdminPanel() {
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get("/quizzes");
      const userId = localStorage.getItem("userId");

      const createdByMe = response.data.filter(
        (q) => q.createdBy._id.toString() === userId
      );

      setFilteredQuizzes(createdByMe);
    } catch (error) {
      setError(error);
    }
  };

  if (error) {
    return <p className="error-message">Error fetching quizzes.</p>;
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-title">Admin Dashboard</h2>
      <Link to="/admin/quiz/create" className="btn create-btn">
        + Create New Quiz
      </Link>

      <h3 className="subheading">Your Quizzes</h3>
      {filteredQuizzes.length === 0 ? (
        <p className="info-message">No quizzes created yet.</p>
      ) : (
        <ul className="quiz-list">
          {filteredQuizzes.map((quiz) => (
            <li key={quiz._id} className="quiz-item">
              <strong>{quiz.title}</strong> – {quiz.description}
              <div className="quiz-actions">
                <Link to={`/admin/quiz/${quiz._id}/questions`} className="btn-small">
                  Add Questions
                </Link>
                <Link to={`/admin/quiz/${quiz._id}/results`} className="btn-small">
                  View Results
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;

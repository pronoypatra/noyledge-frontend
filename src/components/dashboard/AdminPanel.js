import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../common/Navbar";
import "./AdminPanel.css";
import "../../App.css";

function AdminPanel() {
  const userId = localStorage.getItem("userId");
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

      // Fetch stats for each quiz
      const quizzesWithStats = await Promise.all(
        createdByMe.map(async (quiz) => {
          try {
            const quizResponse = await api.get(`/quizzes/${quiz._id}`);
            return {
              ...quiz,
              stats: quizResponse.data.stats,
            };
          } catch (err) {
            return quiz;
          }
        })
      );

      setFilteredQuizzes(quizzesWithStats);
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This will delete all associated questions and results.')) {
      try {
        await api.delete(`/quizzes/${quizId}`);
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Error deleting quiz');
      }
    }
  };

  if (error) {
    return <p className="error-message">Error fetching quizzes.</p>;
  }

  return (
    <div className="admin-panel">
      <Navbar />
      <div className="admin-content">
        <div className="admin-header">
          <h2 className="admin-title">Admin Dashboard</h2>
        </div>
        <div className="admin-actions">
        <Link to="/admin/quiz/create" className="btn create-btn">
          + Create New Quiz
        </Link>
        <Link to="/admin/reports" className="btn reports-btn">
          View Reports
        </Link>
        <Link to="/explore" className="btn explore-btn">
          Explore Quizzes
        </Link>
      </div>

      <h3 className="subheading">Your Quizzes</h3>
      {filteredQuizzes.length === 0 ? (
        <p className="info-message">No quizzes created yet.</p>
      ) : (
        <div className="quizzes-grid">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              {quiz.imageUrl && (
                <img
                  src={`http://localhost:5000${quiz.imageUrl}`}
                  alt={quiz.title}
                  className="quiz-image"
                />
              )}
              <div className="quiz-card-content">
                <h3>{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>
                {quiz.stats && (
                  <div className="quiz-stats">
                    <span>Participants: {quiz.stats.participantsCount}</span>
                    <span>Questions: {quiz.stats.totalQuestions}</span>
                    <span>Avg Score: {quiz.stats.averageScore}%</span>
                  </div>
                )}
                <div className="quiz-meta">
                  <span>Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                  {quiz.tags && quiz.tags.length > 0 && (
                    <div className="quiz-tags">
                      {quiz.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="quiz-actions">
                  <Link to={`/admin/quiz/${quiz._id}/questions`} className="btn-small">
                    Add Questions
                  </Link>
                  <Link to={`/admin/quiz/${quiz._id}/results`} className="btn-small">
                    Results
                  </Link>
                  <Link to={`/admin/quiz/${quiz._id}/analytics`} className="btn-small">
                    Analytics
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="btn-small delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default AdminPanel;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../common/Navbar";
import "./UserPanel.css";
import "../../App.css";

function UserPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedQuizIds, setSavedQuizIds] = useState(new Set());

  useEffect(() => {
    fetchQuizzes();
    fetchSavedQuizzes();
  }, []);

  const fetchSavedQuizzes = async () => {
    try {
      const response = await api.get('/quizzes/saved');
      const savedIds = new Set(response.data.map(quiz => quiz._id));
      setSavedQuizIds(savedIds);
    } catch (error) {
      console.error('Error fetching saved quizzes:', error);
    }
  };

  const fetchQuizzes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("❌ You must be logged in to view quizzes.");
      return;
    }

    try {
      const response = await api.get("/quizzes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      if (error.response) {
        setErrorMessage(
          `❌ Error ${error.response.status}: ${
            error.response.data.message || "Could not fetch quizzes."
          }`
        );
      } else {
        setErrorMessage("❌ Failed to connect to server.");
      }
    }
  };

  const handleSaveToggle = async (quizId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await api.post(`/quizzes/${quizId}/save`);
      const isSaved = response.data.saved;
      
      setSavedQuizIds(prev => {
        const newSet = new Set(prev);
        if (isSaved) {
          newSet.add(quizId);
        } else {
          newSet.delete(quizId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error saving/unsaving quiz:', error);
      alert('Error saving quiz. Please try again.');
    }
  };

  return (
    <div className="user-panel">
      <Navbar />
      <div className="user-content">
        <div className="user-header">
          <h2 className="user-panel-title">Available Quizzes</h2>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      {quizzes.length === 0 && !errorMessage ? (
        <p className="info-message">No quizzes available at the moment.</p>
      ) : (
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="quiz-item">
              <strong className="quiz-title">{quiz.title}</strong>
              <p className="quiz-description">{quiz.description}</p>
              <div className="quiz-action">
                <Link to={`/quiz/${quiz._id}`} className="btn attempt-btn">
                  Attempt Quiz
                </Link>
                <button
                  onClick={(e) => handleSaveToggle(quiz._id, e)}
                  className={`btn save-btn ${savedQuizIds.has(quiz._id) ? 'saved' : ''}`}
                  title={savedQuizIds.has(quiz._id) ? 'Unsave quiz' : 'Save quiz'}
                >
                  {savedQuizIds.has(quiz._id) ? '★ Saved' : '☆ Save'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

export default UserPanel;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./UserPanel.css";
import "../../App.css";

function UserPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

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

  return (
    <div className="user-panel">
      <h2 className="user-panel-title">Available Quizzes</h2>
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserPanel;

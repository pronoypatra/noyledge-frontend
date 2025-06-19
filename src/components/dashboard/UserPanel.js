import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function UserPanel() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("/api/quizzes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  return (
    <div className="user-panel">
      <h2>Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available at the moment.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              <strong>{quiz.title}</strong> - {quiz.description}
              <div>
                <Link to={`/quiz/${quiz._id}`} className="btn-small">
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

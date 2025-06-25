import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./AdminQuizList.css";
import "../../App.css";

const AdminQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api.get("/quizzes").then(res => {
      const createdByMe = res.data.filter(
        (q) => q.createdBy === localStorage.getItem("userId")
      );
      setQuizzes(createdByMe);
    });
  }, []);

  return (
    <div className="admin-quiz-list">
      <h3 className="quiz-list-title">Your Quizzes</h3>
      {quizzes.length === 0 ? (
        <p className="info-message">No quizzes found.</p>
      ) : (
        <ul className="quiz-list">
          {quizzes.map((q) => (
            <li key={q._id} className="quiz-item">
              <strong>{q.title}</strong>
              <div className="quiz-actions">
                <Link to={`/admin/quiz/${q._id}/questions`} className="btn-small">
                  Add Questions
                </Link>
                <Link to={`/admin/quiz/${q._id}/results`} className="btn-small">
                  View Results
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminQuizList;

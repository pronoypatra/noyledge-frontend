import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const AdminQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api.get("/quizzes").then(res => {
      const createdByMe = res.data.filter(q => q.createdBy === localStorage.getItem("userId"));
      setQuizzes(createdByMe);
    });
  }, []);

  return (
    <div>
      <h3>Your Quizzes</h3>
      <ul>
        {quizzes.map(q => (
          <li key={q._id}>
            <strong>{q.title}</strong> — 
            <Link to={`/admin/quiz/${q._id}/questions`}> Add Questions</Link> | 
            <Link to={`/admin/quiz/${q._id}/results`}> View Results</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminQuizList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api"; // Replaces axios with your configured API instance

function UserPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
        setErrorMessage(`❌ Error ${error.response.status}: ${error.response.data.message || 'Could not fetch quizzes.'}`);
      } else {
        setErrorMessage("❌ Failed to connect to server.");
      }
    }
  };

  return (
    <div className="user-panel p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
      {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}
      {quizzes.length === 0 && !errorMessage ? (
        <p>No quizzes available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="border p-4 rounded shadow-sm">
              <strong className="block text-lg">{quiz.title}</strong>
              <p className="text-gray-700">{quiz.description}</p>
              <div className="mt-2">
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded"
                >
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

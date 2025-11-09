import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../common/Navbar';
import './SavedQuizzes.css';

const SavedQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedQuizzes();
  }, []);

  const fetchSavedQuizzes = async () => {
    try {
      const response = await api.get('/quizzes/saved');
      setQuizzes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching saved quizzes:', error);
      setLoading(false);
    }
  };

  const handleUnsave = async (quizId) => {
    try {
      await api.post(`/quizzes/${quizId}/save`);
      fetchSavedQuizzes();
    } catch (error) {
      console.error('Error unsaving quiz:', error);
    }
  };

  if (loading) {
    return <div className="saved-loading">Loading saved quizzes...</div>;
  }

  return (
    <div className="saved-quizzes-container">
      <Navbar />
      <div className="saved-content">
        <h1>Saved Quizzes</h1>
        {quizzes.length === 0 ? (
          <div className="no-saved">No saved quizzes yet</div>
        ) : (
          <div className="quizzes-grid">
            {quizzes.map((quiz) => (
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
                  <div className="quiz-actions">
                    <Link to={`/quiz/${quiz._id}`} className="start-btn">
                      Start Quiz
                    </Link>
                    <button onClick={() => handleUnsave(quiz._id)} className="unsave-btn">
                      ★ Unsave
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
};

export default SavedQuizzes;


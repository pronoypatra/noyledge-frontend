import React, { useState } from 'react';
import api from '../../utils/api';
import './CreateQuiz.css';
import "../../App.css";

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ You must be logged in to create a quiz.');
        return;
      }

      const res = await api.post(
        '/quizzes',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        setMessage('✅ Quiz created successfully!');
        setTitle('');
        setDescription('');
      } else {
        setMessage('❌ Failed to create quiz.');
      }
    } catch (error) {
      if (error.response) {
        setMessage(`❌ Error ${error.response.status}: ${error.response.data.message || 'Something went wrong'}`);
      } else if (error.request) {
        setMessage('❌ No response from server.');
      } else {
        setMessage('❌ Error setting up the request.');
      }
    }
  };

  return (
    <div className="create-quiz-container">
      <h2 className="create-quiz-title">Create a New Quiz</h2>
      {message && <div className="quiz-status">{message}</div>}
      <form onSubmit={handleSubmit} className="create-quiz-form">
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="quiz-input"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="quiz-textarea"
          required
        />
        <button type="submit" className="submit-quiz-btn">
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;

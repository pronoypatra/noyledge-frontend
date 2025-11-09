import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../common/Navbar';
import './AddQuestions.css';
import "../../App.css";

const AddQuestions = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [message, setMessage] = useState('');

  const handleOptionChange = (value, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ You must be logged in to add a question.');
      return;
    }

    try {
      const payload = { questionText, options, correctOption };
      const res = await api.post(`/quizzes/${quizId}/questions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 201 || res.status === 200) {
        setMessage('✅ Question added!');
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectOption(0);
      } else {
        setMessage('❌ Failed to add question.');
      }
    } catch (err) {
      console.error('❌ Error adding question:', err);
      if (err.response) {
        setMessage(`❌ Error ${err.response.status}: ${err.response.data.message || 'Something went wrong'}`);
      } else {
        setMessage('❌ Could not connect to server.');
      }
    }
  };

  return (
    <div className="add-question-container">
      <Navbar />
      <div className="add-question">
        <h2 className="title">Add Question to Quiz</h2>
        {message && <div className="status-message">{message}</div>}
        <form onSubmit={handleSubmit} className="question-form">
          <textarea
            placeholder="Enter your question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="question-text"
            required
          />
          {options.map((option, index) => (
            <div key={index} className="option-row">
              <input
                type="radio"
                name="correctOption"
                checked={correctOption === index}
                onChange={() => setCorrectOption(index)}
              />
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(e.target.value, index)}
                className="option-input"
                required
              />
            </div>
          ))}
          <div className="form-buttons">
            <button type="submit" className="submit-btn">Add Question</button>
            <button 
              type="button"
              onClick={() => navigate('/dashboard')} 
              className="back-to-dashboard-btn"
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestions;

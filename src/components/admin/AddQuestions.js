import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api'; // Using your configured API utility

const AddQuestions = () => {
  const { id: quizId } = useParams();
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
      const payload = {
        questionText,
        options,
        correctOption,
      };

      const res = await api.post(
        `/quizzes/${quizId}/questions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Question to Quiz</h2>
      {message && <div className="mb-4 text-blue-600">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Enter your question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border p-2"
          required
        />
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
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
              className="flex-grow border p-2"
              required
            />
          </div>
        ))}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestions;

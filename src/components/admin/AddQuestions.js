import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
    try {
      const payload = {
        questionText,
        options,
        correctOption,
      };
      await axios.post(`/api/quizzes/${quizId}/questions`, payload);
      setMessage('✅ Question added!');
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectOption(0);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error adding question');
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

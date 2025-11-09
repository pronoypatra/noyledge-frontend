import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './CreateQuiz.css';
import "../../App.css";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleTagToggle = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('difficulty', difficulty);
      
      // Add tags - combine selected tags and custom tags
      const allTags = [...selectedTags];
      if (tags.trim()) {
        const customTags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
        allTags.push(...customTags);
      }
      formData.append('tags', JSON.stringify(allTags));
      
      if (image) {
        formData.append('image', image);
      }

      const res = await api.post('/quizzes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201 || res.status === 200) {
        setMessage('✅ Quiz created successfully!');
        setTimeout(() => {
          navigate(`/admin/quiz/${res.data.quiz._id}/questions`);
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        setMessage(`❌ Error ${error.response.status}: ${error.response.data.message || 'Something went wrong'}`);
      } else {
        setMessage('❌ Error creating quiz.');
      }
    }
  };

  return (
    <div className="create-quiz-container">
      <h2 className="create-quiz-title">Create a New Quiz</h2>
      {message && <div className="quiz-status">{message}</div>}
      <form onSubmit={handleSubmit} className="create-quiz-form">
        <div className="form-group">
          <label>Quiz Title *</label>
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="quiz-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="quiz-textarea"
          />
        </div>

        <div className="form-group">
          <label>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="quiz-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tags-section">
            <div className="predefined-tags">
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  className={`tag-btn ${selectedTags.includes(category.name) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Custom tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="quiz-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Quiz Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="quiz-input"
          />
        </div>

        <button type="submit" className="submit-quiz-btn">
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;

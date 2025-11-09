import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import api from '../../utils/api';
import { API_BASE_URL } from '../../utils/api';
import Navbar from '../common/Navbar';
import './Explore.css';

const Explore = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [savedQuizIds, setSavedQuizIds] = useState(new Set());
  const [followingUserIds, setFollowingUserIds] = useState(new Set());

  const fetchSavedQuizzes = useCallback(async () => {
    try {
      const response = await api.get('/quizzes/saved');
      const savedIds = new Set(response.data.map(quiz => quiz._id));
      setSavedQuizIds(savedIds);
    } catch (error) {
      console.error('Error fetching saved quizzes:', error);
    }
  }, []);

  const fetchFollowingStatus = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await api.get(`/profile/${userId}/following`);
        const followingList = response.data.following || [];
        const followingIds = new Set(
          followingList.map(user => user._id.toString())
        );
        setFollowingUserIds(followingIds);
      }
    } catch (error) {
      console.error('Error fetching following status:', error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchQuizzes = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 10,
        sortBy,
      };

      if (search) params.search = search;
      if (selectedTags.length > 0) params.tags = selectedTags;
      if (difficulty) params.difficulty = difficulty;

      const response = await api.get('/quizzes/explore', { params });

      if (append) {
        setQuizzes(prevQuizzes => [...prevQuizzes, ...response.data.quizzes]);
      } else {
        setQuizzes(response.data.quizzes);
      }

      setHasMore(response.data.quizzes.length === 10);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setLoading(false);
    }
  }, [search, selectedTags, difficulty, sortBy]);

  useEffect(() => {
    fetchCategories();
    fetchSavedQuizzes();
    fetchFollowingStatus();
  }, [fetchCategories, fetchSavedQuizzes, fetchFollowingStatus]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTagToggle = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
    setPage(1);
  };

  const handleLoadMore = useCallback(() => {
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      fetchQuizzes(nextPage, true);
      return nextPage;
    });
  }, [fetchQuizzes]);

  const handleSaveToggle = async (quizId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await api.post(`/quizzes/${quizId}/save`);
      const isSaved = response.data.saved;
      
      setSavedQuizIds(prev => {
        const newSet = new Set(prev);
        if (isSaved) {
          newSet.add(quizId);
        } else {
          newSet.delete(quizId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error saving/unsaving quiz:', error);
      alert('Error saving quiz. Please try again.');
    }
  };

  const handleFollowCreator = async (creatorId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await api.post(`/profile/${creatorId}/follow`);
      const isFollowing = response.data.isFollowing;
      
      setFollowingUserIds(prev => {
        const newSet = new Set(prev);
        if (isFollowing) {
          newSet.add(creatorId);
        } else {
          newSet.delete(creatorId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error following creator:', error);
      alert('Error following creator. Please try again.');
    }
  };

  return (
    <div className="explore-container">
      <Navbar />
      <div className="explore-content">
        <h1>Explore Quizzes</h1>

      <div className="explore-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-section">
          <h3>Tags</h3>
          <div className="tags-list">
            {categories.map((category) => (
              <button
                key={category._id}
                className={`tag-btn ${selectedTags.includes(category.name) ? 'active' : ''}`}
                onClick={() => handleTagToggle(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Difficulty</h3>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="filter-section">
          <h3>Sort By</h3>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date (Newest)</option>
            <option value="name">Name (A-Z)</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>

      {loading && quizzes.length === 0 ? (
        <div className="loading">Loading...</div>
      ) : (
        <InfiniteScroll
          dataLength={quizzes.length}
          next={handleLoadMore}
          hasMore={hasMore}
          loader={<div className="loading">Loading more quizzes...</div>}
        >
          <div className="quizzes-grid">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                  {quiz.imageUrl && (
                    <img
                      src={`${API_BASE_URL}${quiz.imageUrl}`}
                      alt={quiz.title}
                      className="quiz-image"
                    />
                  )}
                <div className="quiz-card-content">
                  <h3>{quiz.title}</h3>
                  <p className="quiz-description">{quiz.description}</p>
                  <div className="quiz-meta">
                    <span className="quiz-difficulty">{quiz.difficulty}</span>
                    {quiz.tags && quiz.tags.length > 0 && (
                      <div className="quiz-tags">
                        {quiz.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {quiz.stats && (
                    <div className="quiz-stats">
                      <span>{quiz.stats.participantsCount} participants</span>
                      <span>{quiz.stats.totalQuestions} questions</span>
                      <span>{quiz.stats.averageScore}% avg</span>
                    </div>
                  )}
                  {quiz.createdBy && (
                    <div className="quiz-creator">
                      <span className="creator-label">Created by:</span>
                      <Link 
                        to={`/profile/${quiz.createdBy._id}`}
                        className="creator-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {quiz.createdBy.avatar ? (
                          <img
                            src={`${API_BASE_URL}${quiz.createdBy.avatar}`}
                            alt={quiz.createdBy.name}
                            className="creator-avatar"
                          />
                        ) : (
                          <div className="creator-avatar-placeholder">
                            {quiz.createdBy.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="creator-name">{quiz.createdBy.name}</span>
                      </Link>
                      {quiz.createdBy._id && quiz.createdBy._id.toString() !== localStorage.getItem('userId') && (
                        <button
                          onClick={(e) => handleFollowCreator(quiz.createdBy._id.toString(), e)}
                          className={`follow-creator-btn ${followingUserIds.has(quiz.createdBy._id.toString()) ? 'following' : ''}`}
                          title={followingUserIds.has(quiz.createdBy._id.toString()) ? 'Unfollow creator' : 'Follow creator'}
                        >
                          {followingUserIds.has(quiz.createdBy._id.toString()) ? '✓ Following' : '+ Follow'}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="quiz-actions">
                    <Link to={`/quiz/${quiz._id}`} className="start-quiz-btn">
                      Start Quiz
                    </Link>
                    <button
                      onClick={(e) => handleSaveToggle(quiz._id, e)}
                      className={`save-quiz-btn ${savedQuizIds.has(quiz._id) ? 'saved' : ''}`}
                      title={savedQuizIds.has(quiz._id) ? 'Unsave quiz' : 'Save quiz'}
                    >
                      {savedQuizIds.has(quiz._id) ? '★ Saved' : '☆ Save'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}

      {quizzes.length === 0 && !loading && (
        <div className="no-quizzes">No quizzes found</div>
      )}
      </div>
    </div>
  );
};

export default Explore;


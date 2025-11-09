import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { API_BASE_URL } from '../../utils/api';
import Navbar from '../common/Navbar';
import FollowersModal from './FollowersModal';
import FollowingModal from './FollowingModal';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ChatIcon from '@mui/icons-material/Chat';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', bio: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [canChat, setCanChat] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get(`/profile/${userId}`);
      const user = response.data.user;
      setProfile(user);
      setStats(response.data.stats);
      setRecentQuizzes(response.data.recentQuizzes || []);
      setIsFollowing(user.isFollowing || false);

      const currentUserId = localStorage.getItem('userId');
      if (currentUserId && currentUserId !== userId) {
        const weFollowThem = user.isFollowing;
        const theyFollowUs =
          user.followersCount > 0 &&
          user.followers?.some(id => id.toString() === currentUserId);
        setCanChat(weFollowThem && theyFollowUs);
      } else {
        setCanChat(false);
      }

      setEditData({
        name: user.name,
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollowToggle = async () => {
    try {
      const response = await api.post(`/profile/${userId}/follow`);
      setIsFollowing(response.data.isFollowing);
      fetchProfile(); // Refresh profile to update counts
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Error updating follow status');
    }
  };

  const handleModalClose = () => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
    fetchProfile(); // Refresh to update counts
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('bio', editData.bio);
      if (editData.avatar && typeof editData.avatar !== 'string') {
        formData.append('avatar', editData.avatar);
      }

      await api.put(`/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  if (!profile) {
    return <div className="profile-error">Profile not found</div>;
  }

  const currentUserId = localStorage.getItem('userId');
  const canEdit = currentUserId === userId;
  const isOwnProfile = currentUserId === userId;
  const isLoggedIn = !!currentUserId;

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
        <div className="profile-avatar">
            {profile.avatar ? (
              <img src={`${API_BASE_URL}${profile.avatar}`} alt={profile.name} />
            ) : (
            <div className="avatar-placeholder">{profile.name.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p className="profile-email">{profile.email}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          
          {/* Followers and Following Counts */}
          <div className="profile-follow-stats">
            <button
              className="follow-stat-btn"
              onClick={() => setShowFollowersModal(true)}
            >
              <span className="follow-count">{profile.followersCount || 0}</span>
              <span className="follow-label">Followers</span>
            </button>
            <button
              className="follow-stat-btn"
              onClick={() => setShowFollowingModal(true)}
            >
              <span className="follow-count">{profile.followingCount || 0}</span>
              <span className="follow-label">Following</span>
            </button>
          </div>
        </div>
        <div className="profile-actions">
          {canEdit ? (
            <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          ) : isLoggedIn && !isOwnProfile ? (
            <>
              <button
                className={isFollowing ? 'unfollow-btn' : 'follow-btn'}
                onClick={handleFollowToggle}
              >
                {isFollowing ? (
                  <>
                    <PersonRemoveIcon />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <PersonAddIcon />
                    <span>Follow</span>
                  </>
                )}
              </button>
              {canChat && (
                <button
                  className="chat-btn"
                  onClick={() => navigate(`/chat?userId=${userId}`)}
                >
                  <ChatIcon />
                  <span>Chat</span>
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>

      {isEditing && (
        <form className="edit-profile-form" onSubmit={handleEdit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditData({ ...editData, avatar: e.target.files[0] })}
            />
          </div>
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      )}

      {stats && (
        <div className="profile-stats">
          <div className="stat-card">
            <h3>{stats.totalQuizzes}</h3>
            <p>Quizzes Attempted</p>
          </div>
          <div className="stat-card">
            <h3>{stats.averageScore.toFixed(1)}%</h3>
            <p>Average Score</p>
          </div>
          <div className="stat-card">
            <h3>{stats.badgesCount}</h3>
            <p>Badges Earned</p>
          </div>
        </div>
      )}

      <div className="profile-badges">
        <h2>Badges</h2>
        {profile.badges && profile.badges.length > 0 ? (
          <div className="badges-grid">
            {profile.badges.map((badge) => (
              <div key={badge._id} className="badge-item">
                <span className="badge-icon">{badge.icon}</span>
                <div>
                  <h4>{badge.name}</h4>
                  <p>{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No badges earned yet</p>
        )}
      </div>

      <div className="profile-quizzes">
        <h2>Recent Quiz Attempts</h2>
        {recentQuizzes.length > 0 ? (
          <div className="quizzes-list">
            {recentQuizzes.map((result) => (
              <div key={result._id} className="quiz-item">
                <div>
                  <h4>{result.quizId?.title || 'Quiz'}</h4>
                  <p>Score: {result.score} / {result.total} ({Math.round((result.score / result.total) * 100)}%)</p>
                  <p className="quiz-date">{new Date(result.attemptedAt).toLocaleDateString()}</p>
                </div>
                <Link to={`/quiz/${result.quizId?._id}`} className="retry-btn">
                  Retry
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No quizzes attempted yet</p>
        )}
      </div>

      {profile.followedCategories && profile.followedCategories.length > 0 && (
        <div className="profile-categories">
          <h2>Followed Categories</h2>
          <div className="categories-grid">
            {profile.followedCategories.map((category) => (
              <div key={category._id} className="category-item">
                {category.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <FollowersModal
        userId={userId}
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        onUpdate={handleModalClose}
      />
      <FollowingModal
        userId={userId}
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        onUpdate={handleModalClose}
      />
      </div>
    </div>
  );
};

export default Profile;


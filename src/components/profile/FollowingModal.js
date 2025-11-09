import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './FollowingModal.css';
import CloseIcon from '@mui/icons-material/Close';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const FollowingModal = ({ userId, isOpen, onClose, onUpdate }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canUnfollow, setCanUnfollow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && userId) {
      fetchFollowing();
    }
  }, [isOpen, userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profile/${userId}/following`);
      setFollowing(response.data.following || []);
      setCanUnfollow(response.data.canUnfollow || false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching following:', error);
      setLoading(false);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    if (!window.confirm('Are you sure you want to unfollow this user?')) {
      return;
    }

    try {
      // The follow endpoint toggles, so if already following, it will unfollow
      const response = await api.post(`/profile/${targetUserId}/follow`);
      // Check if the response indicates we're no longer following
      if (response.data.isFollowing === false || !response.data.isFollowing) {
        setFollowing(following.filter(f => f._id !== targetUserId));
        if (onUpdate) {
          onUpdate();
        }
      } else {
        // Still following, refresh the list
        fetchFollowing();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Error unfollowing user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content following-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Following</h2>
          <button className="close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading following...</div>
          ) : following.length === 0 ? (
            <div className="empty-state">Not following anyone yet</div>
          ) : (
            <div className="following-list">
              {following.map((user) => (
                <div key={user._id} className="following-item">
                  <div
                    className="following-info"
                    onClick={() => handleUserClick(user._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.avatar ? (
                      <img
                        src={`http://localhost:5000${user.avatar}`}
                        alt={user.name}
                        className="following-avatar"
                      />
                    ) : (
                      <div className="following-avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="following-details">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  {canUnfollow && (
                    <button
                      className="unfollow-btn"
                      onClick={() => handleUnfollow(user._id)}
                      title="Unfollow"
                    >
                      <PersonRemoveIcon />
                      <span>Unfollow</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingModal;


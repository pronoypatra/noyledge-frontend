import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { API_BASE_URL } from '../../utils/api';
import './FollowersModal.css';
import CloseIcon from '@mui/icons-material/Close';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const FollowersModal = ({ userId, isOpen, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canRemove, setCanRemove] = useState(false);
  const [followingStatus, setFollowingStatus] = useState(new Map());
  const currentUserId = localStorage.getItem('userId');

  const fetchFollowers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profile/${userId}/followers`);
      const followersList = response.data.followers || [];
      setFollowers(followersList);
      setCanRemove(response.data.canRemove || false);
      
      // Check which followers the current user is following
      const statusMap = new Map();
      if (currentUserId) {
        try {
          // Get current user's following list directly from the following endpoint
          const followingResponse = await api.get(`/profile/${currentUserId}/following`);
          const followingList = followingResponse.data.following || [];
          const followingIds = new Set(
            followingList.map(user => user._id.toString())
          );
          
          followersList.forEach(follower => {
            const followerId = follower._id.toString();
            statusMap.set(followerId, followingIds.has(followerId));
          });
        } catch (error) {
          console.error('Error fetching current user following status:', error);
        }
      }
      setFollowingStatus(statusMap);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching followers:', error);
      setLoading(false);
    }
  }, [userId, currentUserId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchFollowers();
    }
  }, [isOpen, userId, fetchFollowers]);

  const handleFollowToggle = async (targetUserId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await api.post(`/profile/${targetUserId}/follow`);
      const isFollowing = response.data.isFollowing;
      
      setFollowingStatus(prev => {
        const newMap = new Map(prev);
        newMap.set(targetUserId, isFollowing);
        return newMap;
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Error updating follow status');
    }
  };

  const handleUserClick = (followerId) => {
    if (followerId !== currentUserId) {
      navigate(`/profile/${followerId}`);
      onClose();
    }
  };

  const handleRemoveFollower = async (followerId) => {
    if (!window.confirm('Are you sure you want to remove this follower?')) {
      return;
    }

    try {
      await api.delete(`/profile/${userId}/followers/${followerId}`);
      setFollowers(followers.filter(f => f._id.toString() !== followerId));
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error removing follower:', error);
      alert('Error removing follower');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content followers-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Followers</h2>
          <button className="close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading followers...</div>
          ) : followers.length === 0 ? (
            <div className="empty-state">No followers yet</div>
          ) : (
            <div className="followers-list">
              {followers.map((follower) => {
                const followerId = follower._id.toString();
                const isFollowing = followingStatus.get(followerId) || false;
                const isCurrentUser = followerId === currentUserId;
                
                return (
                  <div key={follower._id} className="follower-item">
                    <div 
                      className="follower-info"
                      onClick={() => handleUserClick(followerId)}
                      style={{ cursor: 'pointer' }}
                    >
                      {follower.avatar ? (
                        <img
                          src={`${API_BASE_URL}${follower.avatar}`}
                          alt={follower.name}
                          className="follower-avatar"
                        />
                      ) : (
                        <div className="follower-avatar-placeholder">
                          {follower.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="follower-details">
                        <h4>{follower.name}</h4>
                        <p>{follower.email}</p>
                      </div>
                    </div>
                    <div className="follower-actions">
                      {canRemove && !isCurrentUser && (
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveFollower(followerId)}
                          title="Remove follower"
                        >
                          <PersonRemoveIcon />
                          <span>Remove</span>
                        </button>
                      )}
                      {!isCurrentUser && (
                        <button
                          className={`follow-btn ${isFollowing ? 'following' : ''}`}
                          onClick={(e) => handleFollowToggle(followerId, e)}
                          title={isFollowing ? 'Unfollow' : 'Follow'}
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
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;


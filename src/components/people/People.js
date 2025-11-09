import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { API_BASE_URL } from '../../utils/api';
import Navbar from '../common/Navbar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SearchIcon from '@mui/icons-material/Search';
import './People.css';

const People = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('followers');
  const [followingStatus, setFollowingStatus] = useState(new Map());

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = { sortBy };
      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get('/profile/discover', { params });
      setUsers(response.data);
      
      // Update following status map
      const statusMap = new Map();
      response.data.forEach(user => {
        statusMap.set(user._id, user.isFollowing);
      });
      setFollowingStatus(statusMap);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  }, [search, sortBy]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFollowToggle = async (userId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await api.post(`/profile/${userId}/follow`);
      const isFollowing = response.data.isFollowing;
      
      // Update local state
      setFollowingStatus(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, isFollowing);
        return newMap;
      });

      // Update user in list
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user._id === userId) {
            return {
              ...user,
              isFollowing,
              followersCount: isFollowing 
                ? user.followersCount + 1 
                : Math.max(0, user.followersCount - 1),
            };
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Error updating follow status. Please try again.');
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="people-container">
      <Navbar />
      <div className="people-content">
        <h1>Discover People</h1>
        
        <div className="people-filters">
          <div className="search-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-container">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="followers">Most Followers</option>
              <option value="name">Name (A-Z)</option>
              <option value="recent">Recently Joined</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="no-users">
            {search ? 'No users found matching your search.' : 'No users found.'}
          </div>
        ) : (
          <div className="users-grid">
            {users.map((user) => {
              const isFollowing = followingStatus.get(user._id) || false;
              return (
                <div key={user._id} className="user-card">
                  <div 
                    className="user-card-header"
                    onClick={() => handleUserClick(user._id)}
                  >
                    {user.avatar ? (
                      <img
                        src={`${API_BASE_URL}${user.avatar}`}
                        alt={user.name}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                      {user.bio && <p className="user-bio">{user.bio}</p>}
                    </div>
                  </div>
                  
                  <div className="user-stats">
                    <div className="stat-item">
                      <span className="stat-value">{user.followersCount}</span>
                      <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{user.badgesCount || 0}</span>
                      <span className="stat-label">Badges</span>
                    </div>
                    {user.mutualFollowers > 0 && (
                      <div className="stat-item mutual">
                        <span className="stat-value">{user.mutualFollowers}</span>
                        <span className="stat-label">Mutual</span>
                      </div>
                    )}
                  </div>

                  {user.badges && user.badges.length > 0 && (
                    <div className="user-badges">
                      {user.badges.map((badge, idx) => (
                        <span key={idx} className="badge-icon" title={badge.name}>
                          {badge.icon || '🏆'}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={(e) => handleFollowToggle(user._id, e)}
                    className={`follow-toggle-btn ${isFollowing ? 'following' : ''}`}
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default People;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { API_BASE_URL } from '../../utils/api';
import './ChatList.css';

const ChatList = ({ chats, selectedChatId, onChatSelect, onRefresh }) => {
  const navigate = useNavigate();
  const [mutualFollows, setMutualFollows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMutualFollows();
  }, []);

  const fetchMutualFollows = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // Get current user's following
      const followingResponse = await api.get(`/profile/${userId}/following`);
      const following = followingResponse.data.following || [];

      // Get current user's followers
      const followersResponse = await api.get(`/profile/${userId}/followers`);
      const followers = followersResponse.data.followers || [];

      // Find mutual follows (users who follow you AND you follow them)
      const followingIds = new Set(following.map(u => u._id.toString()));
      const mutual = followers.filter(f => followingIds.has(f._id.toString()));

      setMutualFollows(mutual);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mutual follows:', error);
      setLoading(false);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const response = await api.post('/chat', { participantId: userId });
      const newChat = response.data;
      onChatSelect(newChat);
      navigate(`/chat/${newChat._id}`);
      onRefresh();
    } catch (error) {
      console.error('Error starting chat:', error);
      if (error.response?.status === 403) {
        alert('Both users must follow each other to start a chat.');
      } else {
        alert('Error starting chat. Please try again.');
      }
    }
  };

  const getOtherParticipant = (chat) => {
    const currentUserId = localStorage.getItem('userId');
    return chat.participants.find(p => p._id.toString() !== currentUserId);
  };

  const getLastMessage = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      // Messages are sorted by timestamp desc, so first is last
      return chat.messages[0];
    }
    return null;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>Chats</h2>
        <button onClick={onRefresh} className="refresh-btn" title="Refresh">
          ↻
        </button>
      </div>

      <div className="chat-list">
        {chats.length === 0 ? (
          <div className="no-chats">
            <p>No chats yet</p>
            <p className="hint">Start a chat with someone you follow</p>
          </div>
        ) : (
          chats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            const lastMessage = getLastMessage(chat);
            const isSelected = chat._id === selectedChatId;

            return (
              <div
                key={chat._id}
                className={`chat-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChatSelect(chat);
                  navigate(`/chat/${chat._id}`);
                }}
              >
                {otherUser && (
                  <>
                    {otherUser.avatar ? (
                      <img
                        src={`${API_BASE_URL}${otherUser.avatar}`}
                        alt={otherUser.name}
                        className="chat-avatar"
                      />
                    ) : (
                      <div className="chat-avatar-placeholder">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="chat-info">
                      <div className="chat-name-row">
                        <h4>{otherUser.name}</h4>
                        {lastMessage && (
                          <span className="chat-time">
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="chat-preview">
                          {lastMessage.sender?._id === localStorage.getItem('userId') ? 'You: ' : ''}
                          {lastMessage.text}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {mutualFollows.length > 0 && (
        <div className="mutual-follows-section">
          <h3>Start New Chat</h3>
          <div className="mutual-follows-list">
            {mutualFollows
              .filter(user => {
                // Don't show users we already have chats with
                const existingChat = chats.find(chat => {
                  const otherUser = getOtherParticipant(chat);
                  return otherUser && otherUser._id.toString() === user._id.toString();
                });
                return !existingChat;
              })
              .map((user) => (
                <div
                  key={user._id}
                  className="mutual-follow-item"
                  onClick={() => handleStartChat(user._id)}
                >
                  {user.avatar ? (
                    <img
                      src={`${API_BASE_URL}${user.avatar}`}
                      alt={user.name}
                      className="mutual-avatar"
                    />
                  ) : (
                    <div className="mutual-avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="mutual-name">{user.name}</span>
                  <button className="start-chat-btn">+</button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './ChatWindow.css';

const ChatWindow = ({ chat, onNewMessage, onRefreshChats }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchMessages();
    
    // Set up polling for new messages (every 2 seconds)
    pollIntervalRef.current = setInterval(() => {
      fetchMessages(true); // Silent fetch
    }, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [chat._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.get(`/chat/${chat._id}/messages`);
      // Messages are already in chronological order (oldest first) from backend
      // No need to reverse - display oldest at top, newest at bottom
      setMessages(response.data);
      if (!silent) setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (!silent) setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setSending(true);
    
    // Optimistically add message to UI
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender: { _id: currentUserId },
      text: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    scrollToBottom();

    try {
      const response = await api.post(`/chat/${chat._id}/messages`, {
        text: messageText,
      });

      if (response.data && response.data.messageData) {
        // Replace temp message with real one
        setMessages(prev => {
          const filtered = prev.filter(m => m._id !== tempMessage._id);
          return [...filtered, response.data.messageData];
        });
        onNewMessage(chat._id, response.data.messageData);
        scrollToBottom();
      } else {
        // If response doesn't have expected structure, still consider it success if status is 201
        if (response.status === 201) {
          // Fetch messages to get the real one
          fetchMessages();
        } else {
          throw new Error('Unexpected response format');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      setNewMessage(messageText); // Restore message text
      
      if (error.response?.status === 403) {
        alert('Both users must follow each other to send messages.');
        // Refresh chats in case mutual follow was broken
        onRefreshChats();
      } else if (error.response?.status === 201 || error.response?.status === 200) {
        // If status is success but we got here, message was sent, just fetch to update
        fetchMessages();
      } else {
        alert('Error sending message. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = () => {
    return chat.participants.find(p => p._id.toString() !== currentUserId);
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const otherUser = getOtherParticipant();

  if (loading && messages.length === 0) {
    return (
      <div className="chat-window">
        <div className="chat-loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {otherUser && (
        <div className="chat-header">
          <div className="chat-header-info">
            {otherUser.avatar ? (
              <img
                src={`http://localhost:5000${otherUser.avatar}`}
                alt={otherUser.name}
                className="chat-header-avatar"
              />
            ) : (
              <div className="chat-header-avatar-placeholder">
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3>{otherUser.name}</h3>
              <p className="chat-status">Mutual follow</p>
            </div>
          </div>
          <button
            className="view-profile-btn"
            onClick={() => navigate(`/profile/${otherUser._id}`)}
          >
            View Profile
          </button>
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender?._id?.toString() === currentUserId ||
                                 message.sender?.toString() === currentUserId;
            
            return (
              <div
                key={message._id || index}
                className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
              >
                {!isOwnMessage && message.sender && (
                  <div className="message-sender">
                    {message.sender.avatar ? (
                      <img
                        src={`http://localhost:5000${message.sender.avatar}`}
                        alt={message.sender.name}
                        className="message-avatar"
                      />
                    ) : (
                      <div className="message-avatar-placeholder">
                        {message.sender.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                )}
                <div className="message-content">
                  {!isOwnMessage && message.sender && (
                    <div className="message-sender-name">{message.sender.name}</div>
                  )}
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          disabled={sending}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={!newMessage.trim() || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;


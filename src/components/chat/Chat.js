import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../common/Navbar';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import './Chat.css';

const Chat = () => {
  const { chatId } = useParams();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const processedUserIdRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  // Handle userIdParam - start/create chat with a user
  useEffect(() => {
    if (userIdParam && !loading && processedUserIdRef.current !== userIdParam) {
      // Wait for chats to load, then check if chat exists or create new one
      processedUserIdRef.current = userIdParam;
      
      const existingChat = chats.find(chat => {
        const otherUser = chat.participants.find(
          p => p._id.toString() === userIdParam
        );
        return !!otherUser;
      });

      if (existingChat) {
        setSelectedChat(existingChat);
        // Update URL to use chatId instead of userId
        window.history.replaceState({}, '', `/chat/${existingChat._id}`);
        processedUserIdRef.current = null; // Reset after processing
      } else {
        // Try to create a new chat
        handleStartChatWithUser(userIdParam);
      }
    }
  }, [userIdParam, chats, loading]);

  // Handle chatId from URL - open existing chat
  useEffect(() => {
    if (chatId && !userIdParam) {
      // Only handle chatId if we're not processing a userIdParam
      const chat = chats.find(c => c._id === chatId);
      if (chat) {
        setSelectedChat(chat);
      } else if (!loading) {
        // If chat not in list and we're done loading, try to fetch it
        fetchChatById(chatId);
      }
    }
  }, [chatId, chats, loading, userIdParam]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat');
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const fetchChatById = async (id) => {
    try {
      const response = await api.get('/chat');
      const chat = response.data.find(c => c._id === id);
      if (chat) {
        setSelectedChat(chat);
        setChats(response.data);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleStartChatWithUser = async (userId) => {
    try {
      const response = await api.post('/chat', { participantId: userId });
      const newChat = response.data;
      setSelectedChat(newChat);
      setChats(prev => [newChat, ...prev]);
      // Update URL to use chatId instead of userId
      window.history.replaceState({}, '', `/chat/${newChat._id}`);
      processedUserIdRef.current = null; // Reset after processing
    } catch (error) {
      console.error('Error starting chat:', error);
      processedUserIdRef.current = null; // Reset on error
      if (error.response?.status === 403) {
        alert('Both users must follow each other to start a chat.');
        // Clear the userId param on error
        window.history.replaceState({}, '', '/chat');
      } else {
        alert('Error starting chat. Please try again.');
        // Clear the userId param on error
        window.history.replaceState({}, '', '/chat');
      }
    }
  };

  const handleNewMessage = (chatId, newMessage) => {
    // Update chat's last message and timestamp
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            messages: [newMessage, ...(chat.messages || [])],
            lastMessageAt: new Date(),
          };
        }
        return chat;
      })
    );
  };

  if (loading) {
    return (
      <div className="chat-container">
        <Navbar />
        <div className="chat-loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <Navbar />
      <div className="chat-layout">
        <ChatList
          chats={chats}
          selectedChatId={selectedChat?._id}
          onChatSelect={handleChatSelect}
          onRefresh={fetchChats}
        />
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            onNewMessage={handleNewMessage}
            onRefreshChats={fetchChats}
          />
        ) : (
          <div className="chat-placeholder">
            <h2>Select a chat to start messaging</h2>
            <p>Choose a conversation from the list or start a new chat with someone you follow.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;


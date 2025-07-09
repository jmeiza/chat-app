import { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';

const ChatRoom = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // This useEffect is for fetching chats from the backend
  useEffect(() => {
    const fetchUserChats = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, please login');
        return;
      }
      try {
        const data = await api.fetchChats(token);
        setChats(data);
      }
      catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    fetchUserChats();
  }, []);
  // End of useEffect()

  // This useEffect is for displaying messages
  useEffect(() => {
    socket.connect();

    socket.on('message', (msg) => {
      if (msg.chatId === selectedChat?._id) {
        setChatMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.off('message');
      socket.disconnect();
    };
  }, []);
  // End of useEffect

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    
    socket.emit('sendMessage', {
      chatId: selectedChat._id,
      content: message,
    });
    setMessage('');
  };
  // End of sendMessage()

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    socket.emit('join chat', chat._id);
  };
  // End of handleSelectChat()

  return (
    <div>
      <h2>Your Chats</h2>
      {chats.length === 0 ? (
        <p>No chats found</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li 
              key={chat._id} 
              onClick={() => handleSelectChat(chat)}
              style={{ cursor: 'pointer', fontWeight: selectedChat?._id === chat._id ? 'bold': 'normal' }}>
                {chat.chatName || 'Unnamed Chat'}
            </li>
          ))}
        </ul>
      )}
      <div>   
        <input 
          type='text'
          placeholder='Type your message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}/>
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h3>Messages</h3>
        {chatMessages.length === 0 ? (
          <p>No messages yet </p>) : (
            <ul>
              {chatMessages.map((msg, idx) => (
                <li key={idx}>{msg.content}</li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
};

export default ChatRoom

import { useState, useEffect } from 'react';
import api from '../utils/api';

const ChatRoom = () => {
  const [chats, setChats] = useState([]);

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

  return (
    <div>
      <h2>Your Chats</h2>
      {chats.length === 0 ? (
        <p>No chats found</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat._id}>{chat.chatName || 'Unnamed Chat'}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatRoom

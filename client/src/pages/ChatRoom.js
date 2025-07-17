import { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import styles from './ChatRoom.module.css';
import ChatSidebar from '../components/ChatSidebar';
import MessagePanel from '../components/MessagePanel';

const ChatRoom = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
 ////////////////////01/////Fetching chats from backend////////////////////////
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
  }, [selectedChat]);

/////////////////////02/////Fetch information about the logged in user///////////////////////////

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await api.fetchCurrentUser(token);
        setCurrentUser(res);
      }
      catch (error){
        console.error('Error fetching current user', error);
      }
    }

    fetchCurrentUser();
  }, []);
/////////////////////03//////////Listening for a message and adding the new message to the selected chat's messages///////////////////////////
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
/////////////////////04///Emittinig a message to only members of a specific chat//////////////////////////////////
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, please login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          content: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const savedMessage = await response.json();

      socket.emit('sendMessage', savedMessage);
      setChatMessages(prev => [...prev, savedMessage]);

      setMessage('');
    }
    catch (error) {
      console.error('Error sending message:', error);
    }
  };
/////////////////////05/////Fecthing the messages of a selected chat////////////////////////////////
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    socket.emit('join chat', chat._id);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, please login');
        return;
      }

      const messagesData = await api.fetchMessages(chat._id, token);
      setChatMessages(messagesData);
    }
    catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

/////////////////////RETURN/////////////////////////////////////

  return (
    <div className={styles.container}>
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        handleSelectChat={handleSelectChat}
        setChats={setChats}
        currentUser={currentUser} 
      />
      
      <MessagePanel
        chatMessages={chatMessages}
        currentUser={currentUser}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />

    </div>
  );
};

export default ChatRoom

import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import styles from './ChatRoom.module.css';

const ChatRoom = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const messagesBoxRef = useRef(null);

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
  }, []);
/////////////////////02//////////Fetch information about the logged in user///////////////////////////

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
////////////////////04/////Automatically scrolls the page down when the user receives a new message////////////////////////////////////
useEffect(() => {
  const box = messagesBoxRef.current;
  if (!box) return;

  if (isUserAtBottom()) {
    box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }
}, [chatMessages]);
/////////////////////05///Emittinig a message to only members of a specific chat//////////////////////////////////
  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    
    socket.emit('sendMessage', {
      chatId: selectedChat._id,
      content: message,
    });
    setMessage('');
  };
/////////////////////06/////Fecthing the messages of a selected chat////////////////////////////////
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
/////////////////07//////Checks if the user is at the bottom or implying that they are waiting for new messages/////////////////////////////////////
const isUserAtBottom = () => {
  const box = messagesBoxRef.current;
  if (!box) return false;

  const distanceFromBottom = box.scrollHeight - box.scrollTop - box.clientHeight;
  return distanceFromBottom < 50;
}

/////////////////////RETURN/////////////////////////////////////

  return (
    <div className={styles.container}>
      {/*Chat List */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Your Chats</h2>
        {chats.length === 0 ? (
          <p className={styles.emptyMessage}>No chats found</p>
        ) : (
            <ul className={styles.chatList}>
              {chats.map((chat) => (
                <li 
                  key={chat._id} 
                  onClick={() => handleSelectChat(chat)}
                  className={`${styles.chatItem} ${ selectedChat?._id === chat._id ? styles.chatItemSelected: ''}`}>
                    {chat.chatName || 'Unnamed Chat'}
                </li>
              ))}
            </ul>
        )}
      </div>
      {/* Message panel */}
      <div className={styles.messagePanel}>
        <div ref={messagesBoxRef} className={styles.messagesBox}>  
          {currentUser && chatMessages.length === 0 ? (
            <p className={styles.emptyMessage}>No messages yet </p>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg._id}
                className={`${styles.message} 
                  ${ msg.sender._id === currentUser._id ? styles.sent : styles.received}`} 
              > 
                <p>{msg.content}</p>
                <span className={styles.messageSender}>{msg.sender.name}</span>
              </div> 
            ))
          )}
        </div>
        
        <div className={styles.inputContainer}>
          <input 
            type='text'
            placeholder='Type your message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={styles.inputField} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <button onClick={sendMessage} className={styles.sendButton} >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom

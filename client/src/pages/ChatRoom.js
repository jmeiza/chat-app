import { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';

const ChatRoom = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

 ////////////////////01/////////////////////////////
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
/////////////////////02/////////////////////////////////////

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
/////////////////////03/////////////////////////////////////
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
/////////////////////04/////////////////////////////////////
  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    
    socket.emit('sendMessage', {
      chatId: selectedChat._id,
      content: message,
    });
    setMessage('');
  };
/////////////////////05/////////////////////////////////////
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
    <div className="flex h-[80vh] gap-4 p-4">
      {/*Chat List */}
      <div className="w-80 bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
        {chats.length === 0 ? (
          <p className="text-gray-500">No chats found</p>
        ) : (
            <ul className="max-h-64 overflow-y-auto">
              {chats.map((chat) => (
                <li 
                  key={chat._id} 
                  onClick={() => handleSelectChat(chat)}
                  className={`cursor-pointer p-3 rounded mb-1 ${ selectedChat?._id === chat._id ? 'bg-blue-600 text-white font-bold': 'bg-gray-100 hover:bg-gray-200'}`}>
                    {chat.chatName || 'Unnamed Chat'}
                </li>
              ))}
            </ul>
        )}
      </div>
      {/* Message panel */}
      <div className="flex flex-col w-2/3 bg-white rounded-lg shadow p-4">
        <div className="flex-growflex-col overflow-y-auto p-4 bg-gray-100 rounded-md shadow-inner">  
          {currentUser && chatMessages.length === 0 ? (
            <p className="text-gray-500 text-center italic">No messages yet </p>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-2 p-3 rounded-lg max-w-xs break-words 
                  ${ msg.sender._id === currentUser._id
                    ? "bg-blue-400 text-white self-end"
                    : "bg-gray-300 text-gray-800 self-start"}`
                }
                style={{ 
                  alignSelf:
                    msg.sender._id === currentUser._id ? "flex-end" : "flex-start" 
                }} 
              > 
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs italic">{msg.sender.name}</span>
              </div> 
            ))
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <input 
            type='text'
            placeholder='Type your message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
          <button 
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom

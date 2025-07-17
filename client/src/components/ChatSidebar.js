import {useState} from 'react';
import styles from './ChatSidebar.module.css';
import axios from 'axios';

const ChatSidebar = ({ chats, selectedChat, handleSelectChat, setChats, currentUser }) => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [nameInput, setnameInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createNewChat = async () => {
    const token = localStorage.getItem('token');
    if (!nameInput.trim() || !token) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/chats`,
        { username : nameInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!chats.find(chat => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setnameInput('');
      setShowNewChat(false);
    }
    catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to create chat');
    }
    finally {
      setLoading(false);
    }
  };

  const getChatName = (chat) => {
    if (chat.isGroupChat){
      return chat.name || 'Unamed Chat';
    }
      const otherUser = chat.members.find(user => user._id !== currentUser._id);
      return otherUser?.name || otherUser?.username || 'Unamed Chat';
  };
  
  return (
      <div className={styles.sidebar}>
        {currentUser && (
          <p className={styles.usernameDisplay}>
            Logged in as <strong>{currentUser.name || currentUser.username}</strong>
          </p>
        )}
        <h2 className={styles.sidebarTitle}>Your Chats</h2>

        <button
          onClick={() => setShowNewChat(!showNewChat)}
          className={styles.newChatButton}
        >
          {showNewChat ? 'Cancel' : 'New Chat'}
        </button>

        {showNewChat && (
          <div className={styles.newChatForm}>
            <input
              type="text"
              placeholder="Enter username"
              value={nameInput}
              onChange={(e) => setnameInput(e.target.value)}
              className={styles.nameInput}
            />
            <button className={styles.createButton} onClick={createNewChat} disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
            </div>
        )}

        {chats.length === 0 ? (
          <p className={styles.emptyMessage}>No chats found</p>
        ) : (
            <ul className={styles.chatList}>
              {chats.map((chat) => (
                <li 
                  key={chat._id} 
                  onClick={() => handleSelectChat(chat)}
                  className={`${styles.chatItem} ${ selectedChat?._id === chat._id ? styles.chatItemSelected: ''}`}>
                    {getChatName(chat)}
                </li>
              ))}
            </ul>
            )}
      </div>
    );
};

export default ChatSidebar;
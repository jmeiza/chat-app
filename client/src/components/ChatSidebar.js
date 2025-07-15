import React from 'react';
import styles from './ChatSidebar.module.css';

const ChatSidebar = ({ chats, selectedChat, handleSelectChat }) => {
    return (
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
    );
};

export default ChatSidebar;
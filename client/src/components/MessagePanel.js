import { useRef, useEffect } from 'react';
import styles from './MessagePanel.module.css';


const MessagePanel = ({ chatMessages, currentUser, message, setMessage, sendMessage }) => {
    const messagesBoxRef = useRef(null);

    const isUserAtBottom = () => {
        const box = messagesBoxRef.current;
        if (!box) return false;

        const distanceFromBottom = box.scrollHeight - box.scrollTop - box.clientHeight;
        return distanceFromBottom < 50;
    };

    useEffect(() => {
        const box = messagesBoxRef.current;
        if (!box) return;

        box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
        
    }, [chatMessages]);

    return (
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
    )
}

export default MessagePanel;
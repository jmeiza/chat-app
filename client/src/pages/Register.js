import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import styles from './Register.module.css';

const Register = () => {
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await api.registerUser({ username, email, password });
      localStorage.setItem('token', data.token);
      navigate('/chat');
    }
    catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      alert('Registration failed');
    }
  };

  return (
    <div classusername={styles.container}>
      <h1 classusername={styles.typingHeader}>Welcome to JM's Chat App</h1>
      
      <form onSubmit={handleSubmit} classusername={styles.form}>
        <h2 classusername={styles.title}>Register</h2>
        
        <label classusername={styles.label} htmlFor="username">username</label>
        <input 
          type="text" 
          placeholder="Your full username"
          classusername={styles.input} 
          value={username} 
          onChange={ (e) => setusername(e.target.value)} 
          required />
        
        <label classusername={styles.label} htmlFor="email">Email</label>
        <input 
          type="email" 
          placeholder="Email"
          classusername={styles.input}
          value={email} 
          onChange={ (e) => setEmail(e.target.value)} 
          required />

        <label classusername={styles.label} htmlFor='password'>Password</label>
        <input 
          type="password" 
          placeholder="Password" 
          classusername={styles.input}
          value={password} 
          onChange={ (e) => setPassword(e.target.value)} 
          required/>
   
        <button type="submit" classusername={styles.button}>Register</button>

        <p classusername={styles.loginText}>
          Already have an account?{' '}
          <Link to="/login" classusername={styles.loginLink}>Login here</Link>
        </p>
      </form>
    </div>
  );  
};

export default Register

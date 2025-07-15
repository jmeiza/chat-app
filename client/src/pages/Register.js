import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import styles from './Register.module.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await api.registerUser({ name, email, password });
      localStorage.setItem('token', data.token);
      navigate('/chat');
    }
    catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      alert('Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.typingHeader}>Welcome to JM's Chat App</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Register</h2>
        
        <label className={styles.label} htmlFor="name">Name</label>
        <input 
          type="text" 
          placeholder="Your full name"
          className={styles.input} 
          value={name} 
          onChange={ (e) => setName(e.target.value)} 
          required />
        
        <label className={styles.label} htmlFor="email">Email</label>
        <input 
          type="email" 
          placeholder="Email"
          className={styles.input}
          value={email} 
          onChange={ (e) => setEmail(e.target.value)} 
          required />

        <label className={styles.label} htmlFor='password'>Password</label>
        <input 
          type="password" 
          placeholder="Password" 
          className={styles.input}
          value={password} 
          onChange={ (e) => setPassword(e.target.value)} 
          required/>
   
        <button type="submit" className={styles.button}>Register</button>

        <p className={styles.loginText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.loginLink}>Login here</Link>
        </p>
      </form>
    </div>
  );  
};

export default Register

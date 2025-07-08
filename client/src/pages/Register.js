import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

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
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={ (e) => setName(e.target.value)} 
        required />
      <br />
      <input 
        type="email" 
        placeholder="Email"
        value={email} 
        onChange={ (e) => setEmail(e.target.value)} 
        required />
      <br />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={ (e) => setPassword(e.target.value)} 
        required/>
      <br />
      <button type="submit">Login</button>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );  
};

export default Register

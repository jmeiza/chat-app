import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../utils/api'
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();     //Use to re-route the user to anothet page

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const data = await api.loginUser({ email, password });
            localStorage.setItem('token', data.token);
            navigate('/chat');
        }
        catch (err) {
            console.error('Login failed:', err.response?.data || err.messsage);
            alert('Login failed');
        }
    };
    return (
        <div className={styles.container}>
            <h1 className={styles.typingHeader}>Welcome to JM's Chat App</h1>
        
            <form onSubmit={handleSubmit}className={styles.form}>
                <h2 className={styles.title}>Login</h2>
                <label className={styles.label} htmlFor="email">Email</label>
                <input 
                    type="email" 
                    placeholder="Email" 
                    className={styles.input}
                    value={email} 
                    onChange={ (e) => setEmail(e.target.value)} 
                    required 
                />
                <label className={styles.label} htmlFor="password">Password</label>
                <input 
                    type="password" 
                    placeholder="Password" 
                    className={styles.input}
                    value={password} onChange={ (e) => setPassword(e.target.value)} 
                    required
                />
                <button 
                    type="submit"
                    className={styles.button}
                >
                    Login
                </button>
                <p>
                    Don't have an account?{' '} 
                    <Link to="/register" className={styles.registerLink}>Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
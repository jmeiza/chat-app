import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../utils/api'

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
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value)} required />
            <br />
            <input type="password" placeholder="Password" value={password} onChange={ (e) => setPassword(e.target.value)} required/>
            <br />
            <button type="submit">Login</button>

            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </form>
    );
};

export default Login;
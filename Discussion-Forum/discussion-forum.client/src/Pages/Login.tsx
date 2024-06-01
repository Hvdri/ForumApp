import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

import '../css/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('login', { email, password });
            localStorage.setItem('token', response.data.accessToken);
            navigate('/');
        } catch (err) {
            setError('Invalid login credentials');
        }
    };

    return (
        <div className='container'>
            <div className='auth-container'>
                <div className='title-container'>
                    <h2>Login</h2>
                </div>
                <div className='form-container'>
                    <form onSubmit={handleSubmit}>
                        <div className='fields-form'>
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className='fields-form'>
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className='fields-form'>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="submit">Login</button>
                        </div>
                    </form>
                </div>
                <div className='footer-container'>
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

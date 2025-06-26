import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });

    const user = res.data.user;
    localStorage.setItem('userId', user._id);
    localStorage.setItem('userType', res.data.user.userType); 
    if (user.userType === 'admin') {
      navigate('/admin-home');
    } else if (user.userType === 'agent') {
      navigate('/agent-home');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    alert('Login failed. Check your credentials.');
  }
};

  return (
    <div className="login-page">
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

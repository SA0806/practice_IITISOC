import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) return handleError('Email and password are required');
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => navigate('/'), 1000);
      } else {
        const details = error?.details?.[0]?.message || message;
        handleError(details);
      }
    } catch (err) {
      handleError(err.message || 'Login failed');
    }
  };

  return (
    <div className="Login-Page">
      <div className='Login-container'>
        <h1>Welcome Back</h1>
        <form onSubmit={handleLogin}>
          <div className='login-input-field'>
            <label htmlFor='email' className='login-input-heading'>Email</label>
            <input
              onChange={handleChange}
              type='email'
              name='email'
              placeholder='Enter your email...'
              value={loginInfo.email}
            />
          </div >
          <div className="password-field className='login-input-field'">
            <label htmlFor='password' className='login-input-heading'>Password</label>
            <div className="password-wrapper">
              <input
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Enter your password...'
                value={loginInfo.password}
              />
              <span onClick={togglePasswordVisibility} className="eye-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type='submit' className='Login-page-button'>Login</button>
          <span className="signup-link">Don't have an account? <Link to="/signup" className='login-signup-blue'>Signup</Link></span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;

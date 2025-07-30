import React from 'react';
import './LoginButton.css';
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    window.location.reload();
  };

  return isLoggedIn ? (
    <button onClick={handleLogout} className="login-button">Logout</button>
  ) : (
    <button onClick={() => navigate('/login')} className="login-button">Login</button>
  );
};

export default LoginButton;


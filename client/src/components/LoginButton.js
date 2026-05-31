import React from 'react';
import './LoginButton.css';
import { useNavigate } from "react-router-dom";
import { useCart } from '../Context/CartContext';

const LoginButton = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('wishlist');
    clearCart();
    navigate('/');
  };

  return isLoggedIn ? (
    <button onClick={handleLogout} className="login-button">Logout</button>
  ) : (
    <button onClick={() => navigate('/login')} className="login-button">Login</button>
  );
};

export default LoginButton;


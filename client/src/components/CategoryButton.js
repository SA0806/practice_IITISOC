// src/components/CategoryButton.jsx
import React from 'react';
import './CategoryButton.css';

const CategoryButton = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`category-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CategoryButton;

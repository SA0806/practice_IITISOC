import React from 'react';
import './ARButton.css';
import { useNavigate } from 'react-router-dom';

const ARButton = ({ selectedObjects }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('ARView', {
      state: { models: selectedObjects.map(obj => obj.model) }
    });
  };

  return (
    <button className="ar-button" onClick={handleClick}>
      Visualise in AR
    </button>
  );
};

export default ARButton;

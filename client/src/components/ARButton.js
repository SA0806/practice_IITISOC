import React from 'react';
import './ARButton.css';
import { useNavigate } from 'react-router-dom';

const ARButton = ({ selectedObjects }) => {
  const navigate = useNavigate();

  console.log("Final selectedObjects to pass:", selectedObjects);


  const handleClick = () => {
    navigate('ARView', {
      // state: { models: selectedObjects.map(obj => obj.model) }
      state: { selectedObjects }  // send full objects, not just model URLs

    });
  };

  return (
    <button className="ar-button" onClick={handleClick}>
      Visualise in AR
    </button>
  );
};

export default ARButton;

import React from 'react';
import './2DView.css';
import { useNavigate } from 'react-router-dom';

const TwoDimensionalViewButton = ({ selectedObjects }) => {
  const navigate = useNavigate();

  console.log("Final selectedObjects to pass:", selectedObjects);


  const handleClick = () => {
    navigate('TwoDimensionalViewPage', {
      // state: { models: selectedObjects.map(obj => obj.model) }
      state: { selectedObjects }  // send full objects, not just model URLs

    });
  };

  return (
    <button className="Two-Dimensional-View-button" onClick={handleClick}>
      2DView
    </button>
  );
};

export default TwoDimensionalViewButton;

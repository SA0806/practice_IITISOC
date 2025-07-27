// src/components/StartARButton.js
import React from 'react';

const StartARButton = ({ onStart }) => {
  return (
    <button className="custom-ar-button" onClick={onStart}>
      START AR
    </button>
  );
};

export default StartARButton;

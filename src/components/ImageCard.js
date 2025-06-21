// src/components/ImageCard.js
import React from 'react';
import './ImageCard.css';

const ImageCard = ({ name, image, onClick, selected }) => {
  return (
    <div
      className={`image-card ${selected ? 'selected' : ''}`}
    //   onClick={onClick}
    onClick={() => {
        console.log("ImageCard clicked:", name); // ✅ Add this
        onClick();
      }}
    >
      <img src={image} alt={name} className="card-img" 
      onError={(e) => {
    console.error("❌ Image failed to load:", image);
    e.target.style.display = 'none'; // or set fallback image
  }}
   />
      <div className="card-body">
        <p className="card-text">{name}</p>
      </div>
    </div>
  );
};

export default ImageCard;

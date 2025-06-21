// src/components/SelectedItemsBar.js
import React from 'react';
import ImageCard from './ImageCard'; // keep your custom image card
import './SelectedItemsBar.css';

const SelectedItemsBar = ({ selectedObjects, toggleObjectSelection }) => {
  return (
    <div className="selected-bar bg-light border-top shadow-lg p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Selected Items</h6>
        <span className="text-muted small">{selectedObjects.length} selected</span>
      </div>

      <div className="overflow-auto selected-items-container">
        {selectedObjects.map((obj) => (
          <ImageCard
            key={obj.name}
            name={obj.name}
            image={obj.image}
            onClick={() => toggleObjectSelection(obj)}
            selected={true}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectedItemsBar;

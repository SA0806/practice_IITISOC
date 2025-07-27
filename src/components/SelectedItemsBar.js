// src/components/SelectedItemsBar.js
import React from 'react';
import ImageCard from './ImageCard'; // keep your custom image card
import './SelectedItemsBar.css';

const SelectedItemsBar = ({ selectedObjects, toggleObjectSelection }) => {
  return (
    <div className="selected-bar bg-light border-top shadow-lg p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Selected Items</h6>
        <span className="text-muted small"  style={{ marginRight: '60px'}}>{selectedObjects.length} selected</span>
      </div>

      <div className="overflow-auto selected-items-container">
        {selectedObjects.map((obj,index) => (
          <ImageCard
            // key={obj.name}
            // id={`${obj.name}-${index}`}
             id={`${obj.name}-${obj.category}`}
            key={`${obj.category.toLowerCase()}-${index}`}
            name={obj.name}
            image={obj.image}
            onClick={() => toggleObjectSelection(obj)}
            selected={true}
            category={obj.category}
            price={obj.price}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectedItemsBar;

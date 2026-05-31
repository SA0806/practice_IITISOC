import React, { useState, useEffect } from 'react';
import ModelViewerAR from '../components/ModelViewerAR';
import { useSelectedObjects } from '../Context/SelectedObjectsContext';
import SelectedItemsBar from '../components/SelectedItemsBar';
import CartIcon from '../components/CartIcon';
import CartPanel from '../components/CartPanel';
import { syncSaveArSession } from '../utils/userApi';

const ARViewModelViewer = () => {
  const { selectedObjects, toggleObjectSelection } = useSelectedObjects();
  const [activeModel, setActiveModel] = useState(selectedObjects[0]?.model || null);
  const [cartOpen, setCartOpen] = useState(false);

  // Save AR session to history when user enters AR view
  useEffect(() => {
    if (selectedObjects.length > 0) {
      syncSaveArSession(selectedObjects);
    }
  }, []);

  return (
    <div>
      <CartIcon onClick={() => setCartOpen((prev) => !prev)} />
      <CartPanel visible={cartOpen} onClose={() => setCartOpen(false)} />
      <div className="top-bar">
        <SelectedItemsBar
          selectedObjects={selectedObjects}
          toggleObjectSelection={toggleObjectSelection}
        />
      </div>

      {activeModel && (
        <model-viewer
          src={activeModel}
          alt="3D Model in AR"
          ar
          ar-modes="scene-viewer webxr quick-look"
          auto-rotate
          camera-controls
          style={{ width: '100vw', height: '100vh', background: 'transparent' }}
        ></model-viewer>
      )}

      <div style={{
        position: 'absolute',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 100
      }}>
        {selectedObjects.map((object, index) => (
          <button key={index} onClick={() => setActiveModel(object.model)}>
            {object.name || `Model ${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ARViewModelViewer;
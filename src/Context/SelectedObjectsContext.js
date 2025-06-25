// src/context/SelectedObjectsContext.js
import React, { createContext, useContext, useState } from 'react';

const SelectedObjectsContext = createContext();

export const SelectedObjectsProvider = ({ children }) => {
  const [selectedObjects, setSelectedObjects] = useState([]);

  const toggleObjectSelection = (object) => {
    setSelectedObjects((prev) => {
      const isAlreadySelected = prev.some((item) => item.name === object.name);
      if (isAlreadySelected) {
        return prev.filter((item) => item.name !== object.name);
      } else {
        return [...prev, object];
      }
    });
  };

  return (
    <SelectedObjectsContext.Provider value={{ selectedObjects, toggleObjectSelection }}>
      {children}
    </SelectedObjectsContext.Provider>
  );
};

export const useSelectedObjects = () => useContext(SelectedObjectsContext);

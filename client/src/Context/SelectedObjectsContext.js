import React, { createContext, useContext, useState } from 'react';
import { syncSaveLayout } from '../utils/userApi';

const SelectedObjectsContext = createContext();

export const SelectedObjectsProvider = ({ children }) => {
  const [selectedObjects, setSelectedObjects] = useState([]);

  const toggleObjectSelection = async (object) => {
    setSelectedObjects((prev) => {
      const isAlreadySelected = prev.some((item) => item.name === object.name);
      const updated = isAlreadySelected
        ? prev.filter((item) => item.name !== object.name)
        : [...prev, object];

      syncSaveLayout(updated); // fire and forget
      return updated;
    });
  };

  return (
    <SelectedObjectsContext.Provider value={{ selectedObjects, setSelectedObjects, toggleObjectSelection }}>
      {children}
    </SelectedObjectsContext.Provider>
  );
};

export const useSelectedObjects = () => useContext(SelectedObjectsContext);
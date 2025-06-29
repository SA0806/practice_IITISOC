// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ARView from './pages/ARView';
import Homepage from './pages/Homepage';
import { SelectedObjectsProvider } from './Context/SelectedObjectsContext';
import ARMeasurementTool from './pages/ARMeasurementTool';
console.log("✅ Bootstrap CSS loaded");


// function App() {
//   const [page, setPage] = useState("dashboard");

//   const navigateToAR = () => setPage("ar");
//   const navigateToDashboard = () => setPage("dashboard");

//   return (
//     <>
//       {page === "dashboard" && <Dashboard navigateToAR={navigateToAR} />}
//       {page === "ar" && <ARView goBack={navigateToDashboard} />}
//     </>
//   );
// }
function App() {
  return (
    <SelectedObjectsProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Dashboard/ARView" element={<ARView />} />
        <Route path="/ARMeasurementTool" element={<ARMeasurementTool />} />

      </Routes>
      </SelectedObjectsProvider>
   
  );
}

export default App;

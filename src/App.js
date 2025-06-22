// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ARView from './pages/ARView';
import Homepage from './pages/Homepage';

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
    
      <Routes>
        <Route path="/" element={<Homepage />} />
        
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Dashboard/ARView" element={<ARView />} />
      </Routes>
   
  );
}

export default App;

// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ARView from './pages/ARView';
import Homepage from './pages/Homepage';
import { SelectedObjectsProvider } from './Context/SelectedObjectsContext';
import ARMeasurementTool from './pages/ARMeasurementTool';
import CartPage from './pages/CartPage';
import CheckoutPage from "./pages/CheckoutPage"; 
import { CartProvider } from "./Context/CartContext";
import SuccessPage from './pages/SuccessPage';

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
      <CartProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Dashboard/ARView" element={<ARView />} />
        <Route path="/ARMeasurementTool" element={<ARMeasurementTool />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />

      </Routes>
      </CartProvider>
      </SelectedObjectsProvider>
   
  );
}

export default App;

// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ARView from "./pages/ARView";
import Homepage from "./pages/Homepage";
import { SelectedObjectsProvider } from "./Context/SelectedObjectsContext";
import ARMeasurementTool from "./pages/ARMeasurementTool";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import { CartProvider } from "./Context/CartContext";
import SuccessPage from "./pages/SuccessPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "react-toastify/dist/ReactToastify.css";
import TwoDimensionalViewPage from "./pages/TwoDimensionalViewPage";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <SelectedObjectsProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Dashboard/ARView" element={<ARView />} /> */}
          <Route path="/ARMeasurementTool" element={<ARMeasurementTool />} />
          {/* <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} /> */}
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route
            path="/Dashboard/TwoDimensionalViewPage"
            element={<TwoDimensionalViewPage />}
          /> */}

          <Route
            path="/Dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/Dashboard/ARView"
            element={<PrivateRoute element={<ARView />} />}
          />
          <Route
            path="/Dashboard/TwoDimensionalViewPage"
            element={<PrivateRoute element={<TwoDimensionalViewPage />} />}
          />
          <Route
            path="/cart"
            element={<PrivateRoute element={<CartPage />} />}
          />
          <Route
            path="/checkout"
            element={<PrivateRoute element={<CheckoutPage />} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<ProfilePage />} />}
          />
        </Routes>
      </CartProvider>
    </SelectedObjectsProvider>
  );
}

export default App;

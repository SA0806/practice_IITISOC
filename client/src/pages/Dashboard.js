import React, { useState } from 'react';
import './Dashboard.css';
import CategoryButton from '../components/CategoryButton';
import Navbar from '../components/Navbar';
import Accordion from '../components/Accordion';
import ImageCard from '../components/ImageCard';
import { useNavigate } from 'react-router-dom';
import SelectedItemsBar from '../components/SelectedItemsBar';
import ARButton from '../components/ARButton';
import { useSelectedObjects } from '../Context/SelectedObjectsContext';
import CartIcon from '../components/CartIcon';
import CartPanel from '../components/CartPanel';
import TwoDimensionalViewButton from '../components/2DView';

const Dashboard = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { selectedObjects, toggleObjectSelection } = useSelectedObjects();

  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Cart functionality */}
      <CartIcon onClick={() => setCartOpen((prev) => !prev)} />
      <CartPanel visible={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Section Title */}
      <div className="section-title-wrapper">
        <h2 className="section-title">What Would You Like to See in AR?</h2>
      </div>

      {/* Category Accordion */}
      <Accordion
        selectedObjects={selectedObjects}
        toggleObjectSelection={toggleObjectSelection}
      />

      {/* Selected Items Display */}
      <SelectedItemsBar
        selectedObjects={selectedObjects}
        toggleObjectSelection={toggleObjectSelection}
      />

      {/* AR Button */}
      <div className="dashboard-button-group"style={{ display: 'flex', gap:'20px', justifyContent: 'center', marginTop: '20px' }}>
        <ARButton selectedObjects={selectedObjects} />
        <TwoDimensionalViewButton selectedObjects={selectedObjects}/>
      </div>
    </div>
  );
};

export default Dashboard;


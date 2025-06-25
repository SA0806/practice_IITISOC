// src/pages/Dashboard.js
import React, { useState } from 'react';
import './Dashboard.css';
import CategoryButton from '../components/CategoryButton'; // ✅ import the component
import Navbar from '../components/Navbar';
import Accordion from '../components/Accordion';
import ImageCard from '../components/ImageCard';
import { useNavigate } from 'react-router-dom';
import SelectedItemsBar from '../components/SelectedItemsBar';
import ARButton from '../components/ARButton';
import { useSelectedObjects } from '../Context/SelectedObjectsContext';


// const categories = ["Furniture", "Architecture", "Decor", "Paint Colours"];
// const objects = ["Object 1", "Object 2", "Object 3", "Object 4", "Object 5"];

const Dashboard = ({ navigateToAR }) => {
  const [activeCategory, setActiveCategory] = useState('');
 const { selectedObjects, toggleObjectSelection } = useSelectedObjects();
  
//   const toggleObjectSelection = (object) => {
//     console.log("Selected objects:", selectedObjects);

//   const exists = selectedObjects.find((obj) => obj.name === object.name);
//   if (exists) {
//     setSelectedObjects(selectedObjects.filter((obj) => obj.name !== object.name));
//   } else {
//     setSelectedObjects([...selectedObjects, object]);
//   }
// };
// toggleObjectSelection = (object) => {
//   setSelectedObjects((prev) => {
//     const exists = prev.find((obj) => obj.name === object.name);
//     const updated = exists
//       ? prev.filter((obj) => obj.name !== object.name)
//       : [...prev, object];

//     console.log("✅ Updated selected objects:", updated);
//     return updated;
//   });
// };

const navigate = useNavigate();



  return (
    <div className="dashboard">
      <Navbar/>
      <h2 className="section-title">Select objects</h2>
      <Accordion
  selectedObjects={selectedObjects}
  toggleObjectSelection={toggleObjectSelection}
/>

     <div >
      <SelectedItemsBar
        selectedObjects={selectedObjects}
        toggleObjectSelection={toggleObjectSelection}
      />
    </div>

 <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
  <ARButton selectedObjects={selectedObjects} />
</div>
 

</div>
  );
};

export default Dashboard;

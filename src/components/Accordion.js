import React from 'react';
import ImageCard from './ImageCard'; 
import objectData from '../data/ObjectData'; 
import { useState } from 'react';

const Accordion = ({ selectedObjects, toggleObjectSelection }) => {
//     const [selectedObjects, setSelectedObjects] = useState([]);

//      const toggleSelect = (name) => {
//     setSelectedObjects((prevSelected) =>
//       prevSelected.includes(name)
//         ? prevSelected.filter((item) => item !== name)
//         : [...prevSelected, name]
//     );
//   };

    return (<div className="accordion" id="accordionExample">
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button
        className="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseOne"
        aria-expanded="true"
        aria-controls="collapseOne"
      >
        Furniture
      </button>
    </h2>
    <div
      id="collapseOne"
      className="accordion-collapse collapse show"
      data-bs-parent="#accordionExample"
    >
      {/* <div className="accordion-body">
        <strong>This is the first item’s accordion body.</strong> It is shown by
        default, until the collapse plugin adds the appropriate classes that we
        use to style each element. These classes control the overall appearance,
        as well as the showing and hiding via CSS transitions. You can modify
        any of this with custom CSS or overriding our default variables. It’s
        also worth noting that just about any HTML can go within the{" "}
        <code>.accordion-body</code>, though the transition does limit overflow.
      </div> */}
      <div className="accordion-body d-flex flex-wrap gap-3">
       {objectData["Furniture"].map((item, index) => (
       <ImageCard 
            key={index} 
            name={item.name} 
            image={item.image}
            selected={selectedObjects.some(obj => obj.name === item.name)} // ✅ check by name
            onClick={() => toggleObjectSelection(item)} // ✅ pass full object
        />
       ))}
      </div>

    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button
        className="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseTwo"
        aria-expanded="false"
        aria-controls="collapseTwo"
      >
        Paint Colours
      </button>
    </h2>
    <div
      id="collapseTwo"
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      {/* <div className="accordion-body">
        <strong>This is the second item’s accordion body.</strong> It is hidden
        by default, until the collapse plugin adds the appropriate classes that
        we use to style each element. These classes control the overall
        appearance, as well as the showing and hiding via CSS transitions. You
        can modify any of this with custom CSS or overriding our default
        variables. It’s also worth noting that just about any HTML can go within
        the <code>.accordion-body</code>, though the transition does limit
        overflow.
      </div> */}
      <div className="accordion-body d-flex flex-wrap gap-3">
       {objectData["Paint Colours"].map((item, index) => (
       <ImageCard 
            key={index} 
            name={item.name} 
            image={item.image}
            selected={selectedObjects.some(obj => obj.name === item.name)} // ✅ check by name
            onClick={() => toggleObjectSelection(item)} // ✅ pass full object
        />
       ))}
      </div>

    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button
        className="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseThree"
        aria-expanded="false"
        aria-controls="collapseThree"
      >
        Decor
      </button>
    </h2>
    <div
      id="collapseThree"
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      {/* <div className="accordion-body">
        <strong>This is the third item’s accordion body.</strong> It is hidden
        by default, until the collapse plugin adds the appropriate classes that
        we use to style each element. These classes control the overall
        appearance, as well as the showing and hiding via CSS transitions. You
        can modify any of this with custom CSS or overriding our default
        variables. It’s also worth noting that just about any HTML can go within
        the <code>.accordion-body</code>, though the transition does limit
        overflow.
      </div> */}
     <div className="accordion-body d-flex flex-wrap gap-3">
       {objectData["Decor"].map((item, index) => (
       <ImageCard 
            key={index} 
            name={item.name} 
            image={item.image}
            selected={selectedObjects.some(obj => obj.name === item.name)} // ✅ check by name
            onClick={() => toggleObjectSelection(item)} // ✅ pass full object
        />
       ))}
      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button
        className="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseFour"
        aria-expanded="false"
        aria-controls="collapseFour"
      >
        Architecture
      </button>
    </h2>
    <div
      id="collapseFour"
      className="accordion-collapse collapse"
      data-bs-parent="#accordionExample"
    >
      {/* <div className="accordion-body">
        <strong>This is the fourth item’s accordion body.</strong> It is hidden
        by default, until the collapse plugin adds the appropriate classes that
        we use to style each element. These classes control the overall
        appearance, as well as the showing and hiding via CSS transitions. You
        can modify any of this with custom CSS or overriding our default
        variables. It’s also worth noting that just about any HTML can go within
        the <code>.accordion-body</code>, though the transition does limit
        overflow.
      </div> */}
      <div className="accordion-body d-flex flex-wrap gap-3">
       {objectData["Architecture"].map((item, index) => (
       <ImageCard 
            key={index} 
            name={item.name} 
            image={item.image}
            selected={selectedObjects.some(obj => obj.name === item.name)} // ✅ check by name
            onClick={() => toggleObjectSelection(item)} // ✅ pass full object
        />
       ))}
      </div>

    </div>
  </div>
</div>);
}

export default Accordion;
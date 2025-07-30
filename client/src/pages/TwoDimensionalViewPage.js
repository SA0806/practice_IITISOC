import React from "react";
// import LeftSidebar from "./components/LeftSidebar";
// import RightSidebar from "./components/RightSidebar";
import CanvasArea from "../components/CanvasArea";
import { FaArrowsAlt, FaUndo, FaClone, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import ImageCard from "../components/ImageCard";
import "./TwoDimensionalViewPage.css";

function TwoDimensionalViewPage() {

    const variants = [
  { color: "navy", label: "Dark Blue" },
  { color: "gray", label: "Gray" },
  { color: "#c5c5b5", label: "Beige" },
]; 
  return (
    <div className="TwoDimensionalViewPage-container">
       <div className="TwoDimensionalViewPage-left-sidebar">

        {/* Plus Button + Label */}
      <div className="upload-section">
        <button className="circle-button" title="Upload Image">
          <FaPlus />
        </button>
        <p className="upload-label">Upload Image</p>
      </div>
      {selectedObjects.map((obj,index) => (
          <ImageCard
            // key={obj.name}
            // id={`${obj.name}-${index}`}
             id={`${obj.name}-${obj.category}`}
            key={`${obj.category.toLowerCase()}-${index}`}
            name={obj.name}
            image={obj.image}
            // onClick={() => toggleObjectSelection(obj)}
            selected={true}
            category={obj.category}
            price={obj.price}
            compact={false} 
          />
        ))}


      {/* <button title="Move to"><FaArrowsAlt /></button>
      <button title="Rotate"><FaUndo /></button>
      <button title="Duplicate"><FaClone /></button>
      <button title="Remove"><FaTrash /></button> */}
    </div>
      <CanvasArea />
       <div className="TwoDimensionalViewPage-right-sidebar">
      <h3>Color</h3>
      {variants.map((variant, i) => (
        <div
          key={i}
          style={{
            background: variant.color,
            height: "50px",
            width: "50px",
            margin: "10px 0",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          title={variant.label}
        />
      ))}
      <hr />
      <button>Swap</button>
      <button>Goes well with</button>
      <button>Info</button>
    </div>
    </div>
  );
}

export default TwoDimensionalViewPage;

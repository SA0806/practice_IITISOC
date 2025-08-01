import React, { useState } from "react";
import CanvasArea from "../components/CanvasArea";
import { FaPlus } from "react-icons/fa";
import ImageCard from "../components/ImageCard";
import "./TwoDimensionalViewPage.css";
import { useSelectedObjects } from "../Context/SelectedObjectsContext";
import {
  FaSave,
  FaShareAlt,
  FaTrash,
  FaExpand,
  FaCompress,
  FaUndo,
  FaRedo,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowCircleUp,
  FaArrowCircleDown
} from "react-icons/fa";


function TwoDimensionalViewPage() {
  const { selectedObjects } = useSelectedObjects();
  const [furnitureList, setFurnitureList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const newItem = {
      name: file.name,
      image: imageUrl,
      scale: 1,
      rotation: 0,
    };
    setFurnitureList((prev) => [...prev, newItem]);
  };

  const handleSave = () => {
    const canvas = document.querySelector("canvas");
    const link = document.createElement("a");
    canvas.toBlob((blob) => {
      link.href = URL.createObjectURL(blob);
      link.download = "room-design.png";
      link.click();
    });
  };

  const updateSelected = (updates) => {
    if (selectedIndex === null) return;
    setFurnitureList((prevList) =>
      prevList.map((item, i) =>
        i === selectedIndex ? { ...item, ...updates } : item
      )
    );
  };

//   const handleShare = () => {
//     if (selectedIndex === null) return;
//     const item = furnitureList[selectedIndex];
//     alert(`Sharing: ${item.name}`);
//   };
const handleShare = () => {
  const canvas = document.querySelector("canvas");

  if (!canvas) {
    alert("Canvas not found. Please make sure the canvas is rendered.");
    return;
  }

  canvas.toBlob(async (blob) => {
    if (!blob) {
      alert("Failed to generate image from canvas.");
      return;
    }

    const file = new File([blob], "room-design.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "My Room Design",
          text: "Check out my room design!",
        });
      } catch (err) {
        alert("Sharing cancelled or failed.");
      }
    } else {
      alert("Sharing is not supported on this device/browser. Please download and share manually.");
    }
  });
};


  const handleImageCardClick = (obj) => {
    if (!obj || !obj.model) {
      alert("Model URL is missing.");
      return;
    }

    window.selectedModel = obj.model;

    const newItem = {
      url: obj.model,
      name: obj.name,
      image: obj.image,
      position: [0, 0, 0],
      scale: 0.5,
      rotation: 0,
    };

    setFurnitureList((prev) => [...prev, newItem]);
    setSelectedIndex(furnitureList.length);
  };

  const bg = furnitureList[0]?.image || null;

  return (
    <div className="TwoDimensionalViewPage-container">
      <div className="TwoDimensionalViewPage-left-sidebar">
        <div className="upload-section">
          <label htmlFor="upload-input" className="circle-button" title="Upload Image">
            <FaPlus />
          </label>
          <input
            id="upload-input"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <p className="upload-label">Upload Image</p>
        </div>

        {selectedObjects.map((obj, index) => (
          <ImageCard
            key={`${obj.category.toLowerCase()}-${index}`}
            id={`${obj.name}-${obj.category}`}
            name={obj.name}
            image={obj.image}
            selected={true}
            category={obj.category}
            price={obj.price}
            compact={true}
            onClick={() => handleImageCardClick(obj)}
          />
        ))}
      </div>

      <CanvasArea
        bg={bg}
        furnitureList={furnitureList}
        setFurnitureList={setFurnitureList}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      <div className="TwoDimensionalViewPage-right-sidebar">
        <h3 className="Tools-heading">Tools</h3>

        {/* <button onClick={handleSave} className="Tools-button"><FaSave style={{ marginRight: 8 }} /> Save as PNG</button> */}
        <button
          className="Tools-button"
          onClick={() =>
            selectedIndex !== null &&
            updateSelected({
              scale: Math.min((furnitureList[selectedIndex]?.scale || 0.5) + 0.1, 2),
            })
          }
        ><FaExpand style={{ marginRight: 8 }} /> Zoom In</button>
        <button
          className="Tools-button"
          onClick={() =>
            selectedIndex !== null &&
            updateSelected({
              scale: Math.max((furnitureList[selectedIndex]?.scale || 0.5) - 0.1, 0.1),
            })
          }
        ><FaCompress style={{ marginRight: 8 }} /> Zoom Out</button>

        {/* <span style={{ marginTop: "10px" }}>Rotate:</span> */}
        <button
          className="Tools-button"
          onClick={() =>
            selectedIndex !== null &&
            updateSelected({
              rotation: (furnitureList[selectedIndex]?.rotation || 0) + Math.PI / 12,
            })
          }
        > <FaUndo style={{ marginRight: 8 }} /> Rotate</button>
        <button
          className="Tools-button"
          onClick={() =>
            selectedIndex !== null &&
            updateSelected({
              rotation: (furnitureList[selectedIndex]?.rotation || 0) - Math.PI / 12,
            })
          }
        ><FaRedo style={{ marginRight: 8 }} /> Rotate</button>


        {/* ✨ Movement Controls */}
  {/* <div > */}
    {/* <span>Move:</span> */}
    {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}> */}
      {/* X axis */}
      <button
        className="Tools-button"
        onClick={() =>
          selectedIndex !== null &&
          updateSelected({
            position: [
              (furnitureList[selectedIndex]?.position?.[0] || 0) - 0.1,
              furnitureList[selectedIndex]?.position?.[1] || 0,
              furnitureList[selectedIndex]?.position?.[2] || 0,
            ],
          })
        }
      ><FaArrowLeft style={{ marginRight: 8 }} />  X</button>

      <button
        className="Tools-button"
        onClick={() =>
          selectedIndex !== null &&
          updateSelected({
            position: [
              (furnitureList[selectedIndex]?.position?.[0] || 0) + 0.1,
              furnitureList[selectedIndex]?.position?.[1] || 0,
              furnitureList[selectedIndex]?.position?.[2] || 0,
            ],
          })
        }
      ><FaArrowRight style={{ marginRight: 8 }} /> X</button>

      {/* Y axis */}
      <button
        className="Tools-button"
        onClick={() =>
          selectedIndex !== null &&
          updateSelected({
            position: [
              furnitureList[selectedIndex]?.position?.[0] || 0,
              (furnitureList[selectedIndex]?.position?.[1] || 0) + 0.1,
              furnitureList[selectedIndex]?.position?.[2] || 0,
            ],
          })
        }
      ><FaArrowUp style={{ marginRight: 8 }} /> Y</button>

      <button
        className="Tools-button"
        onClick={() =>
          selectedIndex !== null &&
          updateSelected({
            position: [
              furnitureList[selectedIndex]?.position?.[0] || 0,
              (furnitureList[selectedIndex]?.position?.[1] || 0) - 0.1,
              furnitureList[selectedIndex]?.position?.[2] || 0,
            ],
          })
        }
      ><FaArrowDown style={{ marginRight: 8 }} /> Y</button>

      {/* Z axis */}
      <button
        className="Tools-button"
        onClick={() =>
          selectedIndex !== null &&
          updateSelected({
            position: [
              furnitureList[selectedIndex]?.position?.[0] || 0,
              furnitureList[selectedIndex]?.position?.[1] || 0,
              (furnitureList[selectedIndex]?.position?.[2] || 0) + 0.1,
            ],
          })
        }
      ><FaArrowCircleUp style={{ marginRight: 8 }} /> Z</button>

      <button
        className="Tools-button"
        onClick={() =>
          selectedIndex !== null &&
          updateSelected({
            position: [
              furnitureList[selectedIndex]?.position?.[0] || 0,
              furnitureList[selectedIndex]?.position?.[1] || 0,
              (furnitureList[selectedIndex]?.position?.[2] || 0) - 0.1,
            ],
          })
        }
      ><FaArrowCircleDown style={{ marginRight: 8 }} /> Z</button>
    {/* </div> */}
  {/* </div> */}


        {/* <button onClick={handleShare} className="Tools-button"><FaShareAlt style={{ marginRight: 8 }} /> Share</button> */}

        {selectedIndex !== null && (
          <button
            style={{ marginTop: "10px", color: "red" }}
            onClick={() => {
              if (window.confirm("Do you really want to delete this model?")) {
                setFurnitureList((prev) => prev.filter((_, i) => i !== selectedIndex));
                setSelectedIndex(null);
              }
            }}
          >
           <FaTrash style={{ marginRight: 8 }} /> Delete
          </button>
        )}
      </div>
    </div>
    
  );
}

export default TwoDimensionalViewPage;

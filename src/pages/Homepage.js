import React from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  const handleStartDesigning = () => {
    navigate('/Dashboard');
  };

  return (
    <div className="Homepage">
      <h1 className="Homepage__heading">AR House Design</h1>
      {/* <nav className="Homepage__nav">
        <ul className="Homepage__nav-list">
          <li className="Homepage__nav-item">Platform</li>
          <li className="Homepage__nav-item">3D Viewer</li>
          <li className="Homepage__nav-item">Contact Us</li>
        </ul>
      </nav> */}
      <div className="Homepage__container">
        <img
          className="Homepage__image"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmBPt2D4U4JSwTAs3AqMlhqwk2-mHqS1XJPg&s"
          alt="home image"
        />
        <div className="Homepage__text">
          <h2 className="Homepage__subheading">Home Design Software</h2>
            <button className="Homepage__button" onClick={handleStartDesigning}>
            Start Designing
          </button>
          <p className="Homepage__description">
            Struggling to design your dream home? Let's make it easy! From creating
            floor plans to furnishing and selecting materials, you can design a cozy,
            perfect space online. Whether it's a cottage or family home, everything
            you need is just a few clicks away!
          </p>

        </div>
      </div>
    </div>
  );
};

export default Homepage;

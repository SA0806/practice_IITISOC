import React, { useContext } from 'react';
import './ImageCard.css';
import { CartContext } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

const ImageCard = ({ id, name, image, price, onClick, selected, category}) => {
    const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

   const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ id, name, price, image });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const item = { id, name, price, image, quantity: 1 };
    navigate("/checkout", { state: { item } }); // Pass only this item to checkout
  };

  return (
    <div
      className={`image-card ${selected ? 'selected' : ''}`}
      onClick={() => {
        console.log("ImageCard clicked:", name);
        onClick?.();
      }}
    >
      <img
        src={image}
        alt={name}
        className="card-img"
        onError={(e) => {
          console.error("❌ Image failed to load:", image);
          e.target.style.display = 'none';
        }}
      />
      <div className="card-body">
        <div className="card-text-holder">
          <p className="card-text">{name}</p>
        </div>
        {(category === "Furniture" || category === "Decor") && (
        <>
        <p className="card-price">Rs.{price}</p>

        <div className="button-group">
         
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
        </>
        )}


      </div>
    </div>
  );
};

export default ImageCard;

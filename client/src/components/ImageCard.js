import React, { useContext, useState } from 'react';
import './ImageCard.css';
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { syncAddToWishlist, syncRemoveFromWishlist } from '../utils/userApi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ImageCard = ({ id, name, image, price, onClick, selected, category, compact = false }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const itemId = `${name}-${category}`;
    return saved.includes(itemId);
  } catch {
    return false;
  }
});

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ id, name, price, image });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const item = { id, name, price, image, quantity: 1 };
    navigate("/checkout", { state: { item } });
  };

const handleWishlist = async (e) => {
  e.stopPropagation();
  const itemId = `${name}-${category}`;
  
  if (wishlisted) {
    // Remove from wishlist
    await syncRemoveFromWishlist(itemId);
    setWishlisted(false);
    try {
      const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
      localStorage.setItem('wishlist', JSON.stringify(saved.filter(id => id !== itemId)));
    } catch {}
  } else {
    // Add to wishlist
    await syncAddToWishlist({ id, name, price, image, category });
    setWishlisted(true);
    try {
      const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
      saved.push(itemId);
      localStorage.setItem('wishlist', JSON.stringify(saved));
    } catch {}
  }
};

  return (
    <div
      className={`image-card ${selected ? 'selected' : ''}`}
      onClick={() => {
        onClick?.();
      }}
    >
      <img
        src={image}
        alt={name}
        className="card-img"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />

      {!compact && (category === "Furniture" || category === "Decor") && (
        <button
  className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
  onClick={handleWishlist}
  title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
>
  {wishlisted ? <FaHeart /> : <FaRegHeart />}
</button>
      )}

      <div className="card-body">
        <div className="card-text-holder">
          <p className="card-text">{name}</p>
        </div>

        {!compact && (category === "Furniture" || category === "Decor") && (
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
// src/components/CartPanel.js
import React, { useRef } from 'react';
import { useCart } from '../Context/CartContext';
import './CartStyles.css';
import { useNavigate } from 'react-router-dom';

const CartPanel = ({ visible, onClose }) => {
  const { cart, removeFromCart } = useCart();
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
    onClose?.(); // Optionally close cart panel after navigation
  };

  return (
    <div ref={panelRef} className={`cart-panel ${visible ? 'open' : ''}`}>
      <h3 className="cart-heading">Your Cart</h3>
      <ul className="cart-items-list">
        {cart.length === 0 ? (
          <p className="cart-warning">Oops! Your Cart is empty. <br /> Shop now and enjoy the latest range of products...</p>
        ) : (
          cart.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name} (x{item.quantity})</span>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* ✅ Checkout Button */}
      {cart.length > 0 && (
        <div className="checkout-btn-wrapper">
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPanel;

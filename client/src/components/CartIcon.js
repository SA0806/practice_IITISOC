import React from 'react';
import { useCart } from '../Context/CartContext';
import './CartStyles.css';

const CartIcon = ({ onClick }) => {
  const { cart } = useCart();
  const safeCart = Array.isArray(cart) ? cart : [];
  const totalCount = safeCart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="cart-icon-container" onClick={onClick}>
      <i className="fas fa-shopping-cart cart-image"></i>
      {totalCount > 0 && <div className="cart-badge">{totalCount}</div>}
    </div>
  );
};

export default CartIcon;

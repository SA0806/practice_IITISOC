import React, { useContext } from 'react';
import { CartContext } from '../Context/CartContext';
import './CartStyles.css';

const CartIcon = ({ onClick }) => {
  const { cartItems } = useContext(CartContext);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-icon-container" onClick={onClick}>
      <i className="fas fa-shopping-cart cart-image"></i>

      {totalCount > 0 && <div className="cart-badge">{totalCount}</div>}
    </div>
  );
};

export default CartIcon;

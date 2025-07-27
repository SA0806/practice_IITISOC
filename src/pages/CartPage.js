import React, { useContext } from 'react';
import { CartContext } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, i) => (
            <div key={i}>
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
            </div>
          ))}
          <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          
        </>
      )}
    </div>
  );
};

export default CartPage;

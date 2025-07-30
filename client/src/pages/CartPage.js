import React from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          {cart.map((item, i) => (
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

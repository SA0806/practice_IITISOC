// src/Context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export {CartContext};

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add item to cart (local only)
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check if product already in cart
      const idx = prevCart.findIndex(item => item.id === product.id);
      if (idx !== -1) {
        // Update quantity
        const updated = [...prevCart];
        updated[idx].quantity += quantity;
        return updated;
      }
      // Add new product
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Remove item from cart (local only)
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

// src/Context/CartContext.js
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    // setCartItems((prevItems) => {
    //   const existing = prevItems.find((i) => i.id === item.id);
    //   if (existing) {
    //     return prevItems.map((i) =>
    //       i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
    //     );
    //   } else {
    //     return [...prevItems, { ...item, quantity: 1 }];
    //   }
    // });


     // Create a fallback id if it's missing
  const itemId = item.id || `${item.name}-${item.category}`;

  setCartItems((prevItems) => {
    const existing = prevItems.find((i) => i.id === itemId);
    if (existing) {
      return prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      return [...prevItems, { ...item, id: itemId, quantity: 1 }];
    }
  });

  
    // Toast-like notification
    const toast = document.createElement("div");
    toast.innerText = `${item.name} added to cart!`;
    toast.style.cssText = `
      position: fixed; bottom: 30px; right: 30px;
      background: blue; color: white; padding: 10px 20px; font-weight:500;
      border-radius: 8px; z-index: 9999; box-shadow: 0 0 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  // const removeFromCart = (itemId) => {
  //   setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  // };
  const removeFromCart = (itemId) => {
  setCartItems((prevItems) =>
    prevItems
      .map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};


  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

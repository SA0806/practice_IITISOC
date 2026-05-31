import React, { createContext, useContext, useState } from "react";
import { syncAddToCart, syncRemoveFromCart, syncClearCart } from "../utils/userApi";

const CartContext = createContext();
export { CartContext };

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = async (product, quantity = 1) => {
    setCart(prevCart => {
      const idx = prevCart.findIndex(item => item.id === product.id);
      if (idx !== -1) {
        const updated = [...prevCart];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prevCart, { ...product, quantity }];
    });
    await syncAddToCart(product);
  };

  const removeFromCart = async (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    await syncRemoveFromCart(productId);
  };

  const clearCart = async () => {
    setCart([]);
    await syncClearCart();
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
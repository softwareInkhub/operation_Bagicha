'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  name: string;
  image: string;
  price: number;
  qty: number;
  category?: string; // optional for backward compatibility
  description?: string; // optional for backward compatibility
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (name: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const found = prev.find(i => i.name === item.name);
      if (found) {
        const newQty = found.qty + item.qty;
        if (newQty <= 0) {
          // Remove item if qty is 0 or less
          return prev.filter(i => i.name !== item.name);
        }
        return prev.map(i => i.name === item.name ? { ...i, qty: newQty } : i);
      }
      // Only add if qty is positive
      if (item.qty > 0) {
        return [{ ...item }, ...prev];
      }
      return prev;
    });
  };

  const removeFromCart = (name: string) => {
    setCart(prev => prev.filter(i => i.name !== name));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}; 
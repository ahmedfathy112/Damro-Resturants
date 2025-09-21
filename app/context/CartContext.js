// context/CartContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // get the cart
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedRestaurant = localStorage.getItem("cartRestaurant");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedRestaurant) {
      setRestaurantId(savedRestaurant);
    }
  }, []);

  // save the cart to the localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (restaurantId) {
      localStorage.setItem("cartRestaurant", restaurantId);
    }
  }, [cart, restaurantId]);

  const addToCart = (item, restId) => {
    setCart((prevCart) => {
      // if another resturant preparing new cart
      if (restaurantId !== restId) {
        setRestaurantId(restId);
        return [{ ...item, quantity: 1 }];
      }

      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("cartRestaurant");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    restaurantId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getTotalItems,
    setRestaurantId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

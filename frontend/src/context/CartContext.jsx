import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Fetch cart items when user logs in or page reloads
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCouponCode('');
      setDiscountPercent(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart');
      setCartItems(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    if (!user) {
      throw new Error('Please login to add items to your cart.');
    }
    try {
      await axios.post('/api/cart', { book_id: bookId, quantity });
      await fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await axios.put(`/api/cart/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`/api/cart/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const applyCoupon = (code) => {
    setCouponError('');
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TECH30') {
      setCouponCode(cleanCode);
      setDiscountPercent(30);
    } else if (cleanCode === 'EBOOK10') {
      setCouponCode(cleanCode);
      setDiscountPercent(10);
    } else {
      setCouponError('Invalid Coupon Code');
      setCouponCode('');
      setDiscountPercent(0);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setCouponError('');
  };

  // Helper values
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <CartContext.Provider value={{
      cartItems,
      couponCode,
      discountPercent,
      couponError,
      cartSubtotal,
      discountAmount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      applyCoupon,
      removeCoupon,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

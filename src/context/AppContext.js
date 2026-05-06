// Global State Management using React Context
// Manages: Authentication, Cart, Bookings, Notifications

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMyBookings } from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ep_user');
    const savedCart = localStorage.getItem('ep_cart');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const login = async (userData) => {
    try {
      const data = await loginUser(userData);
      if (data.token) {
        setUser(data);
        localStorage.setItem('ep_user', JSON.stringify(data));
        localStorage.setItem('ep_token', data.token);
        addNotification('Welcome back, ' + data.name + '!', 'success');
        return { success: true, data };
      } else {
        addNotification(data.message || 'Login failed', 'error');
        return { success: false };
      }
    } catch (error) {
      addNotification('Login failed', 'error');
      return { success: false };
    }
  };

  const signup = async (userData) => {
    try {
      const data = await registerUser(userData);
      if (data.token) {
        setUser(data);
        localStorage.setItem('ep_user', JSON.stringify(data));
        localStorage.setItem('ep_token', data.token);
        addNotification('Account created successfully!', 'success');
        return { success: true, data };
      } else {
        addNotification(data.message || 'Signup failed', 'error');
        return { success: false };
      }
    } catch (error) {
      addNotification('Signup failed', 'error');
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setBookings([]);
    localStorage.removeItem('ep_user');
    localStorage.removeItem('ep_token');
    localStorage.removeItem('ep_cart');
    addNotification('Logged out successfully.', 'info');
  };

  const addToCart = (event, ticketType = 'General', qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.eventId === (event._id || event.id) && i.ticketType === ticketType);
      let updated;
      if (exists) {
        updated = prev.map(i => i.eventId === event.id && i.ticketType === ticketType
          ? { ...i, qty: i.qty + qty } : i
        );
      } else {
        updated = [...prev, { eventId: event._id || event.id, event, ticketType, qty, price: event.price }];
      }
      localStorage.setItem('ep_cart', JSON.stringify(updated));
      return updated;
    });
    addNotification('Ticket added to cart!', 'success');
  };

  const removeFromCart = (eventId, ticketType) => {
    setCart(prev => {
      const updated = prev.filter(i => !(i.eventId === eventId && i.ticketType === ticketType));
      localStorage.setItem('ep_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQty = (eventId, ticketType, qty) => {
    if (qty < 1) { removeFromCart(eventId, ticketType); return; }
    setCart(prev => {
      const updated = prev.map(i =>
        i.eventId === eventId && i.ticketType === ticketType ? { ...i, qty } : i
      );
      localStorage.setItem('ep_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ep_cart');
  };

  const addBooking = (booking) => {
    const b = {
      ...booking,
      id: 'TKT-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, b]);
    return b;
  };

  const addNotification = (message, type = 'info') => {
    const n = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, n]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(x => x.id !== n.id));
    }, 3500);
  };

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{
      user, login, signup, logout,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartCount, cartTotal,
      bookings, addBooking,
      notifications, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Set axios base URL from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token and user exist in local storage on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set global axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token, user: userData } = response.data;

      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      return userData;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      const { access_token, user: userData } = response.data;

      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      return userData;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

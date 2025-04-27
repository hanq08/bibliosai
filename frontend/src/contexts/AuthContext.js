import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import jwt_decode from 'jwt-decode';

// Create auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token is valid
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };

  // No need to set up axios interceptor here as it's handled in the api service

  // Load user data on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token || !isTokenValid(token)) {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getProfile();
        setCurrentUser(response.data);
        setError(null);
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Failed to load user data');
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await authAPI.login(email, password);
      
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setError(null);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.detail || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password, fullName) => {
    try {
      setLoading(true);
      
      await authAPI.register(email, password, fullName);
      
      setError(null);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.detail || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // OAuth login
  const oauthLogin = (provider) => {
    window.location.href = `/auth/oauth/${provider}`;
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    oauthLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../config/api';

export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Manages authentication state globally
 * - Initializes from localStorage on mount
 * - Provides login/logout functions
 * - Handles token persistence
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    console.log('[AuthContext] Initializing from localStorage', { savedToken: !!savedToken, savedUser: !!savedUser });

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Set authorization header for all requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (err) {
        console.error('[AuthContext] Failed to parse saved user:', err);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login function
   * Called after successful signup/login API call
   */
  const login = useCallback((newToken, userData) => {
    console.log('[AuthContext] Login successful for user:', userData?.email);
    
    setToken(newToken);
    setUser(userData);
    setError(null);
    
    // Persist to localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set auth header for API requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  }, []);

  /**
   * Logout function
   * Clears user data and redirects to login
   */
  const logout = useCallback(() => {
    console.log('[AuthContext] Logout called');
    
    setToken(null);
    setUser(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove auth header
    delete apiClient.defaults.headers.common['Authorization'];
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!token && !!user;

  /**
   * Check if user has admin role
   */
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

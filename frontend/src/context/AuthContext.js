import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../config/api';

export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Manages authentication state globally
 * - Initializes from localStorage on mount
 * - Provides login/logout/signup functions
 * - Handles token persistence
 * - Manages user profile updates
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
   * Signup function
   * Creates new user account
   */
  const signup = useCallback(async (email, password, name, role = 'user') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/auth/signup', {
        email,
        password,
        name,
        role,
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      console.log('[AuthContext] Signup successful for user:', email);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      console.error('[AuthContext] Signup error:', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login function
   * Authenticates user with email and password
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      console.log('[AuthContext] Login successful for user:', email);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      console.error('[AuthContext] Login error:', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   * Clears user data and auth token
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
   * Update user profile
   */
  const updateProfile = useCallback(async (updates) => {
    try {
      setError(null);
      const response = await apiClient.put('/auth/profile', updates);
      const updatedUser = response.data.user;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('[AuthContext] Profile updated');
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Profile update failed';
      setError(errorMsg);
      console.error('[AuthContext] Update profile error:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      setError(null);
      await apiClient.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      console.log('[AuthContext] Password changed');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Password change failed';
      setError(errorMsg);
      console.error('[AuthContext] Change password error:', errorMsg);
      return { success: false, error: errorMsg };
    }
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
    signup,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

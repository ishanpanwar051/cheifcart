import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth Hook
 * Easy access to auth context in any component
 * Usage: const { user, token, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

export default useAuth;

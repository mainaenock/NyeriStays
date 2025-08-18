import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          // Restore token in axios
          authAPI.restoreToken(token)
          
          // Verify token by getting current user
          const response = await authAPI.getCurrentUser()
          const userData = response.user || response
          
          setUser(userData)
        } catch (error) {
          console.error('Token validation failed:', error)
          localStorage.removeItem('token')
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    checkAuth()
  }, [])

  
  useEffect(() => {
    // User state changed
  }, [user])

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      setUser(response.user || response);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      setUser(response.user || response);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
  };

  // Update user function
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
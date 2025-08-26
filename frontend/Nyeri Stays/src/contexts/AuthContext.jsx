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
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token')
        
        if (token) {
          // Restore token in axios
          const tokenValid = authAPI.restoreToken(token)
          
          if (tokenValid) {
            // Verify token by getting current user
            const response = await authAPI.getCurrentUser()
            const userData = response.user || response
            
            if (userData && userData._id) {
              setUser(userData)
            } else {
              console.error('Invalid user data received:', userData)
              localStorage.removeItem('token')
              setUser(null)
            }
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        setLoading(false)
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
    loading,
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
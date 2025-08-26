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

  // Helper function to safely extract user data
  const extractUserData = (response) => {
    console.log('🔍 extractUserData input:', response)
    
    // If response is already user data
    if (response && typeof response === 'object' && response._id) {
      return response
    }
    
    // If response has a user property
    if (response && response.user && typeof response.user === 'object' && response.user._id) {
      return response.user
    }
    
    // If response has a data property
    if (response && response.data && typeof response.data === 'object' && response.data._id) {
      return response.data
    }
    
    // If response is an array with user data
    if (Array.isArray(response) && response.length > 0 && response[0]._id) {
      return response[0]
    }
    
    console.error('❌ Could not extract user data from:', response)
    return null
  }

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
            console.log('🔍 getCurrentUser response:', response)
            
            const userData = extractUserData(response)
            
            if (userData) {
              setUser(userData)
              console.log('✅ User set successfully:', userData)
            } else {
              console.error('❌ Invalid user data received:', response)
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
      console.log('🔍 Login response:', response)
      
      const userData = extractUserData(response)
      
      if (userData) {
        setUser(userData)
        console.log('✅ Login user set successfully:', userData)
      } else {
        console.error('❌ Login: Invalid user data received:', response)
      }
      
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
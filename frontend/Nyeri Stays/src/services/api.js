import axios from 'axios';
import { config } from '../config/env.js';

// Configure axios base URL - using port 4000 as that's what the backend is running on
const API_BASE_URL = config.API_BASE_URL;

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Request Error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Something went wrong');
  }
);

// Authentication API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  // Password reset
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, password) => {
    return await api.post(`/auth/reset-password/${token}`, { password });
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    return await api.put('/auth/update-password', { currentPassword, newPassword });
  },

  // Upgrade to host role
  upgradeToHost: async () => {
    return await api.put('/auth/upgrade-to-host');
  },

  // Resend verification email
  resendVerification: async () => {
    return await api.post('/auth/resend-verification');
  },

  // Logout
  logout: () => {
    setAuthToken(null);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getAuthToken();
    if (!token) return false;
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        setAuthToken(null); // Clear expired token
        return false;
      }
    } catch (error) {
      // If token is malformed, clear it
      setAuthToken(null);
      return false;
    }
    
    return true;
  },

  // Restore token from localStorage
  restoreToken(token) {
    try {
      // Decode token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        return false
      }
      
      // Set token in api instance headers (not axios directly)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return true
    } catch (error) {
      console.error('Error restoring token:', error)
      localStorage.removeItem('token')
      return false
    }
  },
};

// Properties API calls
export const propertiesAPI = {
  // Get all properties for admin dashboard
  getAllAdmin: async (filters = {}) => {
    return await api.get('/properties/admin', { params: filters });
  },
  // Get all properties with filters

  getAll: async (filters = {}) => {
    return await api.get('/properties', { params: filters });
  },

  // Get featured properties
  getFeatured: async (limit = 6) => {
    return await api.get('/properties/featured', { params: { limit } });
  },

  // Get single property
  getById: async (id) => {
    return await api.get(`/properties/${id}`);
  },

  // Get property reviews
  getReviews: async (id, page = 1, limit = 10) => {
    return await api.get(`/properties/${id}/reviews`, {
      params: { page, limit }
    });
  },

  // Get property statistics (Admin only)
  getStats: async () => {
    return await api.get('/properties/stats');
  },

  // Create property
  create: async (propertyData) => {
    return await api.post('/properties', propertyData);
  },

  // Update property
  update: async (id, propertyData) => {
    return await api.put(`/properties/${id}`, propertyData);
  },

  // Delete property
  delete: async (id) => {
    return await api.delete(`/properties/${id}`);
  },

  // Get user's properties
  getMyProperties: async () => {
    return await api.get('/properties/my-properties');
  },

  // Upload property images
  uploadImages: async (id, images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    return await api.post(`/properties/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete property image
  deleteImage: (propertyId, imageId) => {
    return api.delete(`/properties/${propertyId}/images/${imageId}`);
  },

  // Toggle property featured status (Admin only)
  toggleFeatured: (id) => {
    return api.put(`/properties/${id}/featured`);
  },
};

// Users API calls
export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    return await api.get('/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await api.put('/users/profile', profileData);
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    return await api.put('/users/password', { currentPassword, newPassword });
  },

  // Upload profile picture
  uploadProfilePicture: async (image) => {
    const formData = new FormData();
    formData.append('profilePicture', image);

    return await api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all users (Admin only)
  getAll: async (filters = {}) => {
    return await api.get('/users', { params: filters });
  },

  // Get user statistics (Admin only)
  getStats: async () => {
    return await api.get('/users/stats');
  },

  // Get single user (Admin only)
  getById: async (id) => {
    return await api.get(`/users/${id}`);
  },

  // Update user (Admin only)
  update: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },

  // Delete user (Admin only)
  delete: async (id) => {
    return await api.delete(`/users/${id}`);
  },

  // Toggle user status (Admin only)
  toggleStatus: async (id) => {
    return await api.patch(`/users/${id}/toggle-status`);
  },
};

// Bookings API calls
export const bookingsAPI = {
  // Create booking
  create: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },

  // Get user's bookings
  getMyBookings: async () => {
    return await api.get('/bookings');
  },

  // Get host's bookings
  getHostBookings: async () => {
    return await api.get('/bookings/host');
  },

  // Get single booking
  getById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  // Update booking status
  updateStatus: async (id, status) => {
    return await api.put(`/bookings/${id}/status`, { status });
  },

  // Cancel booking
  cancel: async (id) => {
    return await api.put(`/bookings/${id}/cancel`);
  },

  // Add review to booking
  addReview: async (id, reviewData) => {
    return await api.post(`/bookings/${id}/review`, reviewData);
  },

  // Check availability
  checkAvailability: async (propertyId, checkIn, checkOut, guests = 1) => {
    return await api.get(`/bookings/availability/${propertyId}`, {
      params: { checkIn, checkOut, guests }
    });
  },

  // Get all bookings (Admin only)
  getAll: async (filters = {}) => {
    return await api.get('/bookings/admin', { params: filters });
  },

  // Get booking statistics (Admin only)
  getStats: async () => {
    return await api.get('/bookings/stats');
  },

  // Get single booking (Admin only)
  getById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  // Update booking status (Admin only)
  updateStatus: async (id, status) => {
    return await api.put(`/bookings/${id}/status`, { status });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return await api.get('/health');
  },
};

export default {
  auth: authAPI,
  properties: propertiesAPI,
  users: usersAPI,
  bookings: bookingsAPI,
  health: healthAPI,
}; 
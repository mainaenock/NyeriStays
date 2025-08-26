// Environment configuration
export const config = { 
  // API Configuration - automatically detect environment
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://nyeristays.onrender.com/api' 
      : 'http://localhost:4000/api'),
  
  BACKEND_PORT: import.meta.env.VITE_BACKEND_PORT || '4000',
  
  // Backend Base URL (for images and other resources)
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://nyeristays.onrender.com' 
      : 'http://localhost:4000'),
  
  // Cloudinary Configuration (optional - for direct frontend uploads)
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  
  // Frontend Configuration
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://nyeri-stays-t8wa.onrender.com' 
      : 'http://localhost:3000'),
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
};

// Debug logging in development
if (import.meta.env.MODE === 'development') {
  console.log('🔧 Development Environment Configuration:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    VITE_FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
    'config.API_BASE_URL': config.API_BASE_URL,
    'config.BACKEND_URL': config.BACKEND_URL,
    'config.FRONTEND_URL': config.FRONTEND_URL,
    'MODE': import.meta.env.MODE,
  });
}

// Production logging (minimal)
if (import.meta.env.MODE === 'production') {
  console.log('🚀 Production Environment:', {
    'API_BASE_URL': config.API_BASE_URL,
    'BACKEND_URL': config.BACKEND_URL,
    'FRONTEND_URL': config.FRONTEND_URL,
  });
}

// Helper function to get full backend URL
export const getBackendURL = (endpoint = '') => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function to get health check URL
export const getHealthCheckURL = () => {
  return getBackendURL('/health');
};

// Helper function to get image URL (handles both Cloudinary and local URLs)
export const getImageURL = (imageUrl) => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  if (imageUrl.startsWith('http')) return imageUrl; // Cloudinary URLs are already full URLs
  if (imageUrl.startsWith('/uploads')) {
    return `${config.BACKEND_URL}${imageUrl}`; // Convert local paths to full URLs
  }
  return imageUrl;
};

export default config; 
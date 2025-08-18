// Environment configuration
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  BACKEND_PORT: import.meta.env.VITE_BACKEND_PORT || '4000',
  
  // Frontend Configuration
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
};

// Helper function to get full backend URL
export const getBackendURL = (endpoint = '') => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function to get health check URL
export const getHealthCheckURL = () => {
  return getBackendURL('/health');
};

export default config; 
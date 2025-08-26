const dotenv = require('dotenv');
dotenv.config();

// Environment configuration with defaults
const config = {
  // Server Configuration
  PORT: process.env.PORT || 10000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  MONGODB_URI: process.env.MONGO_URI,
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'nyeri-stays-jwt-secret-key-2024-development',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Frontend URL (for CORS and email links)
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://nyeri-stays001.vercel.app',
  
  // Email Configuration
  EMAIL_FROM: process.env.EMAIL_FROM || 'nyeristays@gmail.com',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  
  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  
  // Development helpers
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// Validate required configuration
const validateConfig = () => {
  const required = ['JWT_SECRET', 'MONGODB_URI'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '));
    console.warn('Using default values for development. Set these in production!');
  }
  
  return config;
};

module.exports = {
  ...validateConfig(),
  validateConfig
}; 
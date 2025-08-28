# Backend Environment Setup

## Quick Fix for JWT Error

The backend now includes default values for all required environment variables, so it should work immediately without any `.env` file.

## Optional: Create .env File

If you want to customize the configuration, create a `.env` file in the backend directory with these variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nyeri-stays

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_FROM=nyeristays@gmail.com
EMAIL_PASSWORD=your-email-app-password

# File Upload Configuration
MAX_FILE_SIZE=5242880
```

## Default Values (No .env file needed)

The application will use these defaults if no `.env` file is provided:

- **PORT**: `4000`
- **MONGODB_URI**: `mongodb://localhost:27017/nyeri-stays`
- **JWT_SECRET**: `nyeri-stays-jwt-secret-key-2024-development`
- **JWT_EXPIRE**: `7d`
- **FRONTEND_URL**: `http://localhost:5173`
- **EMAIL_FROM**: `nyeristays@gmail.com`
- **MAX_FILE_SIZE**: `5MB`

## Email Setup (Optional)

To enable email functionality (password reset, verification):

1. Use a Gmail account
2. Enable 2-factor authentication
3. Generate an App Password
4. Set `EMAIL_PASSWORD` to the App Password

## Security Notes

- The default JWT secret is for development only
- Change `JWT_SECRET` in production
- Use a strong, random secret in production
- Never commit `.env` files to version control

## Testing

The backend should now work without any environment variables. Try registering a user to test the JWT functionality. 
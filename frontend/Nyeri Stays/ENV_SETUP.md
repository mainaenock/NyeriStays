# Environment Variables Setup

## Frontend Environment Variables

To configure the frontend to connect to your backend, create a `.env` file in the frontend root directory with the following variables:

### Development (Local)
```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:4000/api
VITE_BACKEND_PORT=4000

# Backend Base URL (for images and resources)
VITE_BACKEND_URL=http://localhost:4000

# Frontend Configuration (optional)
VITE_FRONTEND_URL=http://localhost:5173
```

### Production (Vercel Deployment)
```env
# Backend API Configuration
VITE_API_BASE_URL=https://nyeristays.onrender.com/api
VITE_BACKEND_URL=https://nyeristays.onrender.com

# Cloudinary Configuration (optional)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset

# Frontend Configuration
VITE_FRONTEND_URL=https://nyeri-stays001.vercel.app

# Note: VITE_BACKEND_PORT is optional for production (HTTPS uses port 443 by default)
# VITE_BACKEND_PORT=443
```

## Default Values

If no `.env` file is provided, the application will use these default values:

- **API Base URL**: `http://localhost:4000/api`
- **Backend Port**: `4000`
- **Frontend URL**: `http://localhost:5173`

## How to Create .env File

1. In the frontend directory (`frontend/Nyeri Stays/`), create a new file named `.env`
2. Add the environment variables listed above
3. Save the file
4. Restart your development server

## Vercel Deployment

For Vercel deployment, you need to:

1. **Create `.env` file** with production values (see above)
2. **Add Environment Variables in Vercel Dashboard**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add:
     - `VITE_API_BASE_URL` = `https://nyeristays.onrender.com/api`
     - `VITE_BACKEND_URL` = `https://nyeristays.onrender.com`
     - `VITE_FRONTEND_URL` = `https://nyeri-stays001.vercel.app`
     - `VITE_BACKEND_PORT` = `443` (optional - HTTPS uses this by default)

## Testing the Connection

The application includes an API test component that will automatically test the connection to the backend when you visit the home page. This will help verify that:

1. The backend is running
2. The API endpoints are accessible
3. The CORS configuration is working correctly

## Troubleshooting

If the API test fails:

1. **Check if backend is running**: Ensure your backend server is running on port 4000
2. **Verify CORS settings**: Make sure the backend CORS configuration allows requests from `http://localhost:5173`
3. **Check network connectivity**: Ensure there are no firewall or network issues
4. **Verify environment variables**: Double-check that your `.env` file is in the correct location and has the right values

## Production Deployment

For production deployment, update the environment variables to point to your production backend URL:

```env
VITE_API_BASE_URL=https://nyeristays.onrender.com/api
VITE_BACKEND_URL=https://nyeristays.onrender.com
VITE_FRONTEND_URL=https://nyeri-stays001.vercel.app
# VITE_BACKEND_PORT=443 (optional for HTTPS)
``` 
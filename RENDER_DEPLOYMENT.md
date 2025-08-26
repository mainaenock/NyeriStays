# 🚀 Render Deployment Guide for Nyeri Stays

## 📋 **Overview**
This guide will help you deploy both your frontend (React) and backend (Node.js) to Render, keeping everything in one platform.

## 🏗️ **Architecture**
```
Render Platform
├── Frontend: Static Site (React App) - nyeri-stays-frontend
├── Backend: Web Service (Node.js API) - nyeristays (existing)
└── External Services
    ├── Database: MongoDB Atlas
    └── Images: Cloudinary
```

## 🔧 **Step 1: Backend Setup (Already Done)**

Your backend is already deployed at: `https://nyeristays.onrender.com`

**Verify it's working:**
```bash
curl https://nyeristays.onrender.com/api/health
```

## 🌐 **Step 2: Frontend Deployment**

### **2.1: Prepare Frontend for Render**

1. **Create `.env.production` file** in `frontend/Nyeri Stays/`:
```env
VITE_API_BASE_URL=https://nyeristays.onrender.com/api
VITE_BACKEND_URL=https://nyeristays.onrender.com
VITE_FRONTEND_URL=https://nyeri-stays-frontend.onrender.com
```

2. **Update your environment config** to handle production properly:
```javascript
// In src/config/env.js
API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://nyeristays.onrender.com/api' 
    : 'http://localhost:4000/api'),
```

### **2.2: Deploy to Render**

1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "Static Site"**
3. **Connect your GitHub repository**
4. **Configure the deployment:**

```
Name: nyeri-stays-frontend
Branch: main (or your default branch)
Build Command: npm run build
Publish Directory: dist
```

5. **Add Environment Variables:**
```
VITE_API_BASE_URL = https://nyeristays.onrender.com/api
VITE_BACKEND_URL = https://nyeristays.onrender.com
VITE_FRONTEND_URL = https://nyeri-stays-frontend.onrender.com
```

6. **Click "Create Static Site"**

### **2.3: Configure Custom Domain (Optional)**

1. **In your Render dashboard, go to your frontend service**
2. **Click "Settings" → "Custom Domains"**
3. **Add your domain** (e.g., `nyeristays.com`)
4. **Update DNS records** at your domain registrar

## 🔄 **Step 3: Update Backend CORS**

Your backend needs to allow requests from your new frontend domain:

1. **Go to your backend service on Render**
2. **Add/Update Environment Variable:**
```
FRONTEND_URL = https://nyeri-stays-frontend.onrender.com
```

3. **Redeploy your backend** (Render will do this automatically)

## 📱 **Step 4: Test Everything**

### **Test Backend:**
```bash
curl https://nyeristays.onrender.com/api/health
```

### **Test Frontend:**
1. **Visit your frontend URL**
2. **Check browser console** for any errors
3. **Test API calls** to ensure they work
4. **Test image loading** from Cloudinary

## 🛠️ **Troubleshooting**

### **Frontend Not Loading:**
1. **Check build logs** in Render dashboard
2. **Verify environment variables** are set correctly
3. **Check if build command** is working locally

### **API Calls Failing:**
1. **Verify CORS settings** in backend
2. **Check environment variables** in frontend
3. **Ensure backend is running** and accessible

### **Images Not Loading:**
1. **Verify Cloudinary configuration** in backend
2. **Check image URLs** in browser network tab
3. **Ensure Cloudinary environment variables** are set

## 💰 **Cost Estimation**

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| **Backend** | Free Tier | $0 |
| **Frontend** | Free Tier | $0 |
| **Total** | | **$0** |

**Note:** Free tier includes:
- 750 hours/month (enough for 24/7)
- 100GB bandwidth/month
- Automatic sleep after 15 minutes of inactivity

## 🚀 **Advanced Configuration**

### **Auto-Deploy on Git Push:**
- Render automatically deploys when you push to your main branch
- No manual deployment needed

### **Preview Deployments:**
- Create pull requests to test changes
- Render creates preview URLs automatically

### **Environment-Specific Configs:**
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

## 📊 **Performance Optimization**

1. **Enable Render's CDN** for global distribution
2. **Use Cloudinary's optimization** for images
3. **Implement proper caching** headers
4. **Monitor performance** in Render dashboard

## 🔒 **Security Considerations**

1. **Environment variables** are encrypted in Render
2. **HTTPS is automatic** and free
3. **CORS is properly configured** for your domains
4. **No sensitive data** in your code repository

## 📞 **Support**

- **Render Support**: Available in your dashboard
- **Documentation**: [render.com/docs](https://render.com/docs)
- **Community**: Render Discord and forums

## ✅ **Next Steps**

1. **Create the `.env.production` file**
2. **Deploy frontend to Render**
3. **Test the complete application**
4. **Configure custom domain** (optional)
5. **Monitor performance** and costs

## 🎯 **Benefits of This Setup**

- ✅ **Everything in one place** - Render dashboard
- ✅ **Automatic deployments** from Git
- ✅ **Free tier available** for both services
- ✅ **Global CDN** for fast loading
- ✅ **Easy scaling** when needed
- ✅ **Built-in monitoring** and logs

Your Nyeri Stays application will be fully hosted on Render with excellent performance and zero cost on the free tier!

#!/bin/bash

echo "🚀 Deploying Nyeri Stays Frontend to Render..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    echo "   cd frontend/Nyeri\ Stays"
    echo "   ../deploy-to-render.sh"
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Creating .env.production file..."
    cat > .env.production << EOF
# Production Environment for Render
VITE_API_BASE_URL=https://nyeristays.onrender.com/api
VITE_BACKEND_URL=https://nyeristays.onrender.com
VITE_FRONTEND_URL=https://nyeri-stays-frontend.onrender.com
EOF
    echo "✅ Created .env.production file"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Go to https://render.com"
    echo "2. Click 'New +' → 'Static Site'"
    echo "3. Connect your GitHub repository"
    echo "4. Configure:"
    echo "   - Name: nyeri-stays-frontend"
    echo "   - Build Command: npm run build"
    echo "   - Publish Directory: dist"
    echo "5. Add environment variables:"
    echo "   - VITE_API_BASE_URL = https://nyeristays.onrender.com/api"
    echo "   - VITE_BACKEND_URL = https://nyeristays.onrender.com"
    echo "   - VITE_FRONTEND_URL = https://nyeri-stays-frontend.onrender.com"
    echo "6. Click 'Create Static Site'"
    echo ""
    echo "📁 Your built files are in the 'dist' directory"
    echo "🌐 You can test locally with: npm run preview"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

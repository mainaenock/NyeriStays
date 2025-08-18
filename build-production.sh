#!/bin/bash

# 🚀 Nyeri Stays Production Build Script
# This script automates the production build and deployment process

set -e  # Exit on any error

echo "🏗️  Starting Nyeri Stays Production Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "Prerequisites check passed"

# Backend build
print_status "Building backend..."
cd backend

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found. Creating from template..."
    if [ -f "env.production.template" ]; then
        cp env.production.template .env.production
        print_warning "Please edit .env.production with your production values before continuing"
        print_warning "Press Enter when ready to continue..."
        read
    else
        print_error "env.production.template not found. Please create .env.production manually"
        exit 1
    fi
fi

# Install production dependencies
print_status "Installing backend production dependencies..."
npm ci --only=production

print_success "Backend build completed"

# Frontend build
print_status "Building frontend..."
cd ../frontend/Nyeri\ Stays

# Install dependencies
print_status "Installing frontend dependencies..."
npm ci

# Build for production
print_status "Building frontend for production..."
npm run build:prod

print_success "Frontend build completed"

# Check build output
if [ -d "dist" ]; then
    print_success "Production build created successfully in dist/ folder"
    print_status "Build size:"
    du -sh dist/
else
    print_error "Frontend build failed - dist/ folder not found"
    exit 1
fi

# Return to root
cd ../..

print_success "🎉 Production build completed successfully!"

echo ""
echo "📋 Next steps:"
echo "1. Review the build output in frontend/Nyeri Stays/dist/"
echo "2. Upload the dist/ folder contents to your web server"
echo "3. Start the backend server: cd backend && npm run start:prod"
echo "4. Test the production deployment"
echo ""
echo "📚 For detailed deployment instructions, see PRODUCTION_DEPLOYMENT.md"
echo ""

# Optional: Start backend server
read -p "Would you like to start the backend production server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting backend production server..."
    cd backend
    npm run start:prod
else
    print_status "Backend server not started. You can start it manually with:"
    echo "cd backend && npm run start:prod"
fi

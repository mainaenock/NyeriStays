#!/bin/bash

echo "🚀 Starting Nyeri Stays Development Environment..."

# Start backend
echo "📡 Starting Backend..."
cd backend
if [ ! -f .env ]; then
    echo "⚠️  No .env file found in backend. Creating one with development defaults..."
    cat > .env << EOF
ALLOW_LOCALHOST=true
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/nyeri_stays
JWT_SECRET=nyeri-stays-jwt-secret-key-2024-development
EOF
    echo "✅ Created .env file with development defaults"
fi

echo "📦 Installing backend dependencies..."
npm install

echo "🔧 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting Frontend..."
cd ../frontend/Nyeri\ Stays

if [ ! -f .env ]; then
    echo "⚠️  No .env file found in frontend. Creating one with development defaults..."
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:4000/api
VITE_BACKEND_URL=http://localhost:4000
VITE_FRONTEND_URL=https://nyeri-stays-t8wa.onrender.com
EOF
    echo "✅ Created .env file with development defaults"
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "🔧 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Development environment started!"
echo "📡 Backend: http://localhost:4000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

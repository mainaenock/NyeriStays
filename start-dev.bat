@echo off
echo 🚀 Starting Nyeri Stays Development Environment...

REM Start backend
echo 📡 Starting Backend...
cd backend

if not exist .env (
    echo ⚠️  No .env file found in backend. Creating one with development defaults...
    (
        echo ALLOW_LOCALHOST=true
        echo NODE_ENV=development
        echo MONGO_URI=mongodb://localhost:27017/nyeri_stays
        echo JWT_SECRET=nyeri-stays-jwt-secret-key-2024-development
    ) > .env
    echo ✅ Created .env file with development defaults
)

echo 📦 Installing backend dependencies...
call npm install

echo 🔧 Starting backend server...
start "Backend Server" cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo 🌐 Starting Frontend...
cd ..\frontend\Nyeri Stays

if not exist .env (
    echo ⚠️  No .env file found in frontend. Creating one with development defaults...
    (
        echo VITE_API_BASE_URL=http://localhost:4000/api
        echo VITE_BACKEND_URL=http://localhost:4000
        echo VITE_FRONTEND_URL=https://nyeri-stays-t8wa.onrender.com
    ) > .env
    echo ✅ Created .env file with development defaults
)

echo 📦 Installing frontend dependencies...
call npm install

echo 🔧 Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 🎉 Development environment started!
echo 📡 Backend: http://localhost:4000
echo 🌐 Frontend: http://localhost:5173
echo.
echo Both servers are running in separate windows.
echo Close the windows to stop the servers.
pause

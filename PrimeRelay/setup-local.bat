@echo off
echo 🚀 Starting PrimeRelay Local Development...
echo.

echo 📋 Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed

echo.
echo 🗄️  Setting up environment...

REM Create .env file if it doesn't exist
if not exist "backend\.env" (
    echo 📝 Creating backend .env file...
    copy ".env.example" "backend\.env" >nul
    echo ✅ Backend .env created - Please configure with your API keys
)

if not exist "frontend\.env.development" (
    echo 📝 Creating frontend .env.development file...
    echo NEXT_PUBLIC_API_URL=http://localhost:3001 > "frontend\.env.development"
    echo NEXT_PUBLIC_APP_NAME=PrimeRelay >> "frontend\.env.development"
    echo NEXT_PUBLIC_APP_DESCRIPTION=Professional SMS SaaS Platform >> "frontend\.env.development"
    echo ✅ Frontend .env.development created
)

echo.
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo ✅ Root dependencies installed

call npm run install:all
if %errorlevel% neq 0 (
    echo ❌ Failed to install workspace dependencies
    pause
    exit /b 1
)

echo ✅ Workspace dependencies installed

echo.
echo 🗄️  Setting up database...
cd backend
call npm run migrate
if %errorlevel% neq 0 (
    echo ⚠️  Database migration failed. Please check PostgreSQL is running and DATABASE_URL is correct.
    echo 📝 Make sure PostgreSQL is installed and running on localhost:5432
    echo 📝 Update backend\.env with correct database credentials
    pause
    exit /b 1
)

echo ✅ Database migration completed

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 🌐 Next steps:
echo    1. Configure your API keys in backend\.env
echo    2. Make sure Redis is running on localhost:6379
echo    3. Run: npm run dev
echo.
echo 📱 Access points:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Health:   http://localhost:3001/health
echo.
echo 🚀 Starting all services...
call npm run dev

pause

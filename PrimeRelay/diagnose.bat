@echo off
echo 🔍 PrimeRelay Diagnostic Tool
echo ============================
echo.

echo 📋 Checking System Requirements...
echo.

echo 1️⃣ Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js NOT found
    echo 💡 Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js: %%i
)

echo.
echo 2️⃣ Checking PostgreSQL...
pg_isready >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL NOT running
    echo 💡 Start PostgreSQL service or install PostgreSQL
) else (
    echo ✅ PostgreSQL is running
)

echo.
echo 3️⃣ Checking Redis...
redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Redis NOT running
    echo 💡 Start Redis server or install Redis
) else (
    echo ✅ Redis is running
)

echo.
echo 📡 Checking Port Availability...
echo.

echo 4️⃣ Checking Port 3000 (Frontend)...
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is in use
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3000') do echo    Process ID: %%i
) else (
    echo ✅ Port 3000 is available
)

echo.
echo 5️⃣ Checking Port 3001 (Backend)...
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 3001 is in use
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3001') do echo    Process ID: %%i
) else (
    echo ✅ Port 3001 is available
)

echo.
echo 📁 Checking Project Files...
echo.

echo 6️⃣ Checking Environment Files...
if not exist "backend\.env" (
    echo ❌ backend\.env NOT found
    echo 💡 Run setup-local.bat to create environment files
) else (
    echo ✅ backend\.env exists
)

if not exist "frontend\.env.development" (
    echo ❌ frontend\.env.development NOT found
    echo 💡 Run setup-local.bat to create environment files
) else (
    echo ✅ frontend\.env.development exists
)

echo.
echo 7️⃣ Checking Node Modules...
if not exist "node_modules" (
    echo ❌ Root node_modules NOT found
    echo 💡 Run: npm install
) else (
    echo ✅ Root node_modules exists
)

if not exist "frontend\node_modules" (
    echo ❌ Frontend node_modules NOT found
    echo 💡 Run: npm run install:all
) else (
    echo ✅ Frontend node_modules exists
)

if not exist "backend\node_modules" (
    echo ❌ Backend node_modules NOT found
    echo 💡 Run: npm run install:all
) else (
    echo ✅ Backend node_modules exists
)

if not exist "worker\node_modules" (
    echo ❌ Worker node_modules NOT found
    echo 💡 Run: npm run install:all
) else (
    echo ✅ Worker node_modules exists
)

echo.
echo 🗄️  Checking Database...
echo.

cd backend >nul 2>&1
if exist "primerelay" (
    echo ⚠️  Database might exist (primerelay folder found)
) else (
    echo ℹ️  Database status unknown
)

cd .. >nul 2>&1

echo.
echo 🚀 Quick Fixes Available:
echo.
echo 1. Kill processes on ports 3000/3001:
echo    for /f "tokens=5" %i in ('netstat -ano ^| findstr :3000') do taskkill /PID %i /F
echo    for /f "tokens=5" %i in ('netstat -ano ^| findstr :3001') do taskkill /PID %i /F
echo.
echo 2. Start services manually:
echo    cd backend && npm run dev
echo    cd worker && npm run dev  
echo    cd frontend && npm run dev
echo.
echo 3. Run setup script:
echo    setup-local.bat
echo.

echo 📊 Diagnostic Complete!
echo ============================
pause

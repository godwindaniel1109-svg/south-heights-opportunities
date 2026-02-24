@echo off
echo 🔧 Complete PrimeRelay Frontend Reset
echo =====================================
echo.

cd frontend

echo 🗑️  Cleaning all caches and node_modules...
if exist ".next" (
    rmdir /s /q .next
    echo ✅ .next cache cleared
)

if exist "node_modules" (
    rmdir /s /q node_modules
    echo ✅ node_modules cleared
)

if exist "package-lock.json" (
    del package-lock.json
    echo ✅ package-lock.json cleared
)

echo.
echo 📦 Installing fresh dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed

echo.
echo 🎨 Initializing Tailwind CSS...
npx tailwindcss init -p
if %errorlevel% neq 0 (
    echo ⚠️  Tailwind init failed, continuing...
)

echo.
echo 🚀 Starting frontend development server...
npm run dev

pause

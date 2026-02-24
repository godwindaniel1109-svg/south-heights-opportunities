@echo off
echo 🔧 Fixing PrimeRelay Frontend Issues...
echo.

echo 🗑️  Cleaning Next.js cache...
cd frontend
if exist ".next" (
    rmdir /s /q .next
    echo ✅ .next cache cleared
) else (
    echo ℹ️  .next cache not found
)

echo.
echo 📦 Reinstalling dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed

echo.
echo 🚀 Starting frontend...
npm run dev

pause

@echo off
echo 🔍 Deep System Check
echo ===================
echo.

echo 📋 Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found or not in PATH
    echo 💡 Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo 📋 Checking npm version...
npm --version

echo.
echo 📋 Checking current directory...
cd
echo Current directory: %CD%

echo.
echo 📋 Checking if we're in the right place...
if not exist "frontend" (
    echo ❌ frontend directory not found
    echo 💡 Make sure you're running this from the PrimeRelay root directory
    pause
    exit /b 1
) else (
    echo ✅ frontend directory found
)

echo.
echo 📋 Checking frontend structure...
cd frontend
if not exist "src\app\layout.tsx" (
    echo ❌ layout.tsx not found
    echo 💡 Frontend structure is broken
) else (
    echo ✅ layout.tsx found
)

if not exist "package.json" (
    echo ❌ package.json not found
    echo 💡 Frontend package.json is missing
) else (
    echo ✅ package.json found
)

echo.
echo 📋 Checking what's in layout.tsx...
type src\app\layout.tsx | findstr "import"
echo.

cd ..

echo 🎯 Next steps:
echo 1. If Node.js is working, try: nuclear-option.bat
echo 2. If Node.js is missing, install it first
echo 3. If directory issues, navigate to PrimeRelay folder first

pause

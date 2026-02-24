@echo off
echo 🚨 CSS Issue Emergency Fix
echo ============================
echo.

echo 🔧 Trying multiple approaches to fix CSS issue...
echo.

cd frontend

echo 1️⃣ Approach 1: Complete reset with Tailwind v3...
if exist ".next" rmdir /s /q .next
if exist "node_modules" rmdir /s /q node_modules

echo 📦 Installing dependencies...
npm install

echo 🎨 Setting up Tailwind CSS v3...
echo @tailwind base; > src\app\globals.css
echo @tailwind components; >> src\app\globals.css
echo @tailwind utilities; >> src\app\globals.css
echo. >> src\app\globals.css
echo :root { >> src\app\globals.css
echo   --background: #ffffff; >> src\app\globals.css
echo   --foreground: #171717; >> src\app\globals.css
echo } >> src\app\globals.css
echo. >> src\app\globals.css
echo body { >> src\app\globals.css
echo   color: rgb(var(--foreground)); >> src\app\globals.css
echo   background: rgb(var(--background)); >> src\app\globals.css
echo } >> src\app\globals.css

echo 🚀 Starting development server...
npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ❌ Approach 1 failed. Trying Approach 2...
    echo.
    
    echo 2️⃣ Approach 2: Using inline styles...
    copy src\app\layout-inline.tsx src\app\layout.tsx /Y
    npm run dev
)

pause

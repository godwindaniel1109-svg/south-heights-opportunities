@echo off
echo 🔥 NUCLEAR OPTION - Complete Frontend Rebuild
echo ============================================
echo.

echo ⚠️  This will completely rebuild the frontend from scratch!
echo.

cd frontend

echo 🗑️  Deleting EVERYTHING except source code...
if exist ".next" rmdir /s /q .next
if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del package-lock.json
if exist "tailwind.config.ts" del tailwind.config.ts
if exist "postcss.config.mjs" del postcss.config.mjs

echo.
echo 📝 Creating minimal package.json...
(
echo {
echo   "name": "frontend",
echo   "version": "0.1.0",
echo   "private": true,
echo   "scripts": {
echo     "dev": "next dev",
echo     "build": "next build",
echo     "start": "next start",
echo     "lint": "next lint"
echo   },
echo   "dependencies": {
echo     "axios": "^1.13.5",
echo     "js-cookie": "^3.0.5",
echo     "lucide-react": "^0.574.0",
echo     "next": "14.2.5",
echo     "react": "^18.3.1",
echo     "react-dom": "^18.3.1"
echo   },
echo   "devDependencies": {
echo     "@types/node": "^20",
echo     "@types/react": "^18",
echo     "@types/react-dom": "^18",
echo     "eslint": "^8",
echo     "eslint-config-next": "14.2.5",
echo     "typescript": "^5"
echo   }
echo }
) > package.json

echo.
echo 📦 Installing Next.js 14 (more stable)...
npm install

echo.
echo 🗑️  Removing CSS files completely...
if exist "src\app\globals.css" del src\app\globals.css
if exist "src\app\styles.css" del src\app\styles.css

echo.
echo 📝 Using minimal layout (no CSS)...
copy src\app\layout-minimal.tsx src\app\layout.tsx /Y

echo.
echo 🚀 Starting minimal frontend...
npm run dev

pause

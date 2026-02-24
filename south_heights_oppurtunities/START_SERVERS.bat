@echo off
echo ========================================
echo   Starting All Servers (Backend, User, Admin)
echo ========================================
echo.

echo [1/3] Starting Backend Server (Port 4000)...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm install && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Starting User Frontend (Port 3000)...
start "User Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Admin Frontend (Port 5000)...
start "Admin Frontend" cmd /k "cd /d %~dp0admin && npm install && npm run dev"

echo.
echo ========================================
echo   All servers are starting in new windows!
echo ========================================
echo.
echo Wait for:
echo   - Backend: "Server running on port 4000"
echo   - User Frontend: "Local: http://localhost:3000"
echo   - Admin Frontend: "Local: http://localhost:5000"
echo.
echo Then open:
echo   - User App: http://localhost:3000
echo   - Admin App: http://localhost:5000
echo.
pause

@echo off
REM Start Prime SMS Hub Development Server on Windows

echo.
echo ========================================================
echo   PRIME SMS HUB - Development Server Startup
echo ========================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "backend\" (
    echo ❌ Backend directory not found
    echo Please ensure you're in the project root directory
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist; prefer Python 3.11
set PYEXEC=
py -3.11 --version >nul 2>&1 && set PYEXEC=py -3.11 || (
    py -3.10 --version >nul 2>&1 && set PYEXEC=py -3.10 || set PYEXEC=python
)

if not exist "venv311\" (
    echo 📦 Creating Python 3.11 virtual environment and installing dependencies...
    %PYEXEC% -3.11 -m venv venv311 2>nul || %PYEXEC% -m venv venv311
    call venv311\Scripts\activate.bat
    python -m pip install --upgrade pip setuptools wheel
    pip install -q -r backend/requirements.txt
) else (
    call venv311\Scripts\activate.bat
    echo 📦 Installing/updating dependencies in the virtual environment (venv311)...
    python -m pip install --upgrade pip setuptools wheel
    pip install -q -r backend/requirements.txt
)

REM Run migrations
echo 🗄️  Running database migrations...
cd backend
python manage.py migrate --noinput
cd ..

REM Start Django in background window
echo 🚀 Starting Django in new window...
cmd.exe /c start "Django Server" cmd /k "cd /d %CD%\backend && ..\venv311\Scripts\python.exe manage.py runserver 8000 --noreload"

REM Wait until Django is responsive on health endpoint
echo 🔁 Waiting for Django to respond on http://127.0.0.1:8000/api/health/
powershell -Command "$ready = $false; while(-not $ready){ try{ $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/health/' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; if($r.StatusCode -eq 200){ $ready = $true } } catch { Start-Sleep -Seconds 1 } }; Write-Output 'Django is ready.'"

REM Optionally open browser
if /I "%START_BROWSER%"=="true" (
    start http://localhost:8000
)

REM Start the live reload server in the current window
echo.
echo ✅ Starting LiveReload (frontend watcher) — connects to Django at http://localhost:8000
echo.
python liveserver.py --no-django

pause

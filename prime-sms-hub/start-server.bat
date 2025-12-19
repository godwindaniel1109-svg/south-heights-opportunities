@echo off
title Prime SMS Hub - Development Server
color 0A

echo.
echo ================================
echo  Prime SMS Hub - Dev Server
echo ================================
echo.

REM Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [*] Node.js detected. Installing dependencies...
    call npm install --silent
    if %ERRORLEVEL% EQU 0 (
        echo [*] Starting Node.js server...
        node server.js
        goto :end
    )
)

REM Fallback to Python if Node.js fails or not available
echo [*] Using Python server...
python server.py

:end
pause
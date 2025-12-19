#!/usr/bin/env pwsh
# Prime SMS Hub - Development Server Launcher
# Supports both Node.js and Python with auto-fallback

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host " Prime SMS Hub - Dev Server" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$PORT = 8000

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    return $connection
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param($Port)
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($processes) {
        Write-Host "[!] Port $Port is in use. Stopping existing process..." -ForegroundColor Yellow
        foreach ($proc in $processes) {
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 1
    }
}

# Check and clear port if needed
if (Test-Port -Port $PORT) {
    Stop-ProcessOnPort -Port $PORT
}

# Try Node.js first
$nodeAvailable = Get-Command node -ErrorAction SilentlyContinue
if ($nodeAvailable) {
    Write-Host "[*] Node.js detected. Installing dependencies..." -ForegroundColor Green
    npm install --silent 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[*] Starting Node.js server...`n" -ForegroundColor Green
        node server.js
        exit
    }
}

# Fallback to Python
$pythonAvailable = Get-Command python -ErrorAction SilentlyContinue
if ($pythonAvailable) {
    Write-Host "[*] Using Python server...`n" -ForegroundColor Green
    python server.py
    exit
}

# No server available
Write-Host "[!] Neither Node.js nor Python found!" -ForegroundColor Red
Write-Host "[!] Please install Node.js or Python to run the server.`n" -ForegroundColor Red
Read-Host "Press Enter to exit"
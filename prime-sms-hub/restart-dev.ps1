<#
Restart-dev PowerShell script for Prime SMS Hub
Runs dev-clean.ps1 to stop repo-managed servers, then starts dev environment via start-dev.ps1
Usage:
    .\restart-dev.ps1            # restart (no browser)
    .\restart-dev.ps1 -StartBrowser  # restart and open browser to LiveReload
#>

param(
    [switch]$StartBrowser,
    [switch]$NewWindow,
    [switch]$Force
)

$scriptRoot = (Get-Location).Path
Write-Host "=== PRIME SMS HUB - Restart Dev ===" -ForegroundColor Cyan
Write-Host "Repo root: $scriptRoot"

# Run dev-clean to stop existing processes for the repo only
$cleanScript = Join-Path $scriptRoot 'dev-clean.ps1'
if (Test-Path $cleanScript) {
    Write-Host "Running dev-clean.ps1 to stop current dev server processes..." -ForegroundColor Yellow
    if ($Force) {
        & powershell -NoProfile -ExecutionPolicy Bypass -File $cleanScript -Force
    } else {
        & powershell -NoProfile -ExecutionPolicy Bypass -File $cleanScript
    }
} else {
    Write-Host "dev-clean.ps1 not found; skipping cleanup." -ForegroundColor Yellow
}

# Short delay after cleanup
Start-Sleep -Seconds 1

# Optionally start start-dev.ps1 in a new window or current shell
$startScript = Join-Path $scriptRoot 'start-dev.ps1'
if (Test-Path $startScript) {
    if ($NewWindow) {
        Write-Host "Starting dev servers in new PowerShell window..." -ForegroundColor Green
        $args = @()
        if ($StartBrowser) { $args += '-StartBrowser' }
        $argLine = $args -join ' '
        Start-Process -FilePath powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$startScript`" $argLine" -WorkingDirectory $scriptRoot
    } else {
        Write-Host "Starting dev servers in current window (this will block until LiveReload logs appear)..." -ForegroundColor Green
        if ($StartBrowser) {
            & powershell -NoProfile -ExecutionPolicy Bypass -File $startScript -StartBrowser
        } else {
            & powershell -NoProfile -ExecutionPolicy Bypass -File $startScript
        }
    }
} else {
    Write-Host "start-dev.ps1 not found; cannot start dev servers." -ForegroundColor Red
    exit 1
}

Write-Host "Restart command finished. Use .\dev-status.ps1 to view active servers." -ForegroundColor Cyan

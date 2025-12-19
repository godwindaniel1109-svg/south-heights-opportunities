# Dev cleanup helper: stops background Django and LiveReload processes for this repo only
param(
    [switch]$Force
)

Write-Host "=== PRIME SMS HUB - Dev Cleanup ===" -ForegroundColor Cyan

$cwd = (Get-Location).Path
$procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'manage.py runserver|liveserver.py' }
if (-not $procs) {
    Write-Host "No matching dev server processes found." -ForegroundColor Yellow
    exit 0
}

foreach ($proc in $procs) {
    $cmd = $proc.CommandLine
    if ($Force) {
        Write-Host "(Force) Stopping PID $($proc.ProcessId): $cmd" -ForegroundColor Green
        try {
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
            Write-Host "Stopped PID $($proc.ProcessId)" -ForegroundColor Green
        } catch {
            Write-Host "Failed to stop PID $($proc.ProcessId): $_" -ForegroundColor Red
        }
    } else {
        if ($cmd -and $cmd -match [regex]::Escape($cwd)) {
            Write-Host "Stopping PID $($proc.ProcessId): $cmd" -ForegroundColor Green
            try {
                Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
                Write-Host "Stopped PID $($proc.ProcessId)" -ForegroundColor Green
            } catch {
                Write-Host "Failed to stop PID $($proc.ProcessId): $_" -ForegroundColor Red
            }
        } else {
            Write-Host "Skipping PID $($proc.ProcessId) (not in repo path): $cmd" -ForegroundColor Yellow
        }
    }
}

Write-Host "Cleanup complete." -ForegroundColor Cyan

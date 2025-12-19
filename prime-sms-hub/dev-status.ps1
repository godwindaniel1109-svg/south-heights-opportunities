# Dev status helper: shows Django and LiveReload process information
$portsToCheck = @(8000) + (5500..5510)

Write-Host "=== PRIME SMS HUB - Dev Status ===" -ForegroundColor Cyan

foreach ($port in $portsToCheck) {
    try {
        $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction Stop | Select-Object -First 1
        if ($conn) {
            $pid = $conn.OwningProcess
            $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$pid"
            Write-Host "Port $($port): LISTENING (PID=$pid) - $($proc.CommandLine)"
        } else {
            Write-Host "Port $($port): not bound"
        }
    } catch {
        Write-Host "Port $($port): not bound"
    }
}

# Show any running Python processes that look like the servers
$pyProcs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'manage.py runserver|liveserver.py' }
if ($pyProcs) {
    Write-Host "`nDetected Python server processes:" -ForegroundColor Green
    foreach ($p in $pyProcs) {
        Write-Host "PID: $($p.ProcessId) - $($p.CommandLine)"
    }
} else {
    Write-Host "`nNo standard server Python processes detected."
}

Write-Host "\nTip: Use Stop-Process -Id <pid> to kill a process, or run .\start-dev.ps1 to start servers." -ForegroundColor Yellow

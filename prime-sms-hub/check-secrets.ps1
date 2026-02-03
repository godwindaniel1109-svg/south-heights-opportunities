# Pre-commit secret checker for GitHub safety
# Run this before committing to ensure no secrets are exposed

Write-Host "🔒 Checking for exposed secrets..." -ForegroundColor Cyan

$issues = @()

# Check for real API keys
$apiKeyPatterns = @(
    "pk_live_[a-zA-Z0-9]{40,}",
    "sk_live_[a-zA-Z0-9]{40,}",
    "AIza[a-zA-Z0-9_-]{35,}"
)

# Check for common password patterns
$passwordPatterns = @(
    'password\s*[:=]\s*[''"].{8,}[''"]',
    'passwd\s*[:=]\s*[''"].{8,}[''"]'
)

# Files to check (exclude node_modules, venv, etc.)
$filesToCheck = Get-ChildItem -Recurse -File | 
    Where-Object { 
        $_.FullName -notmatch 'node_modules|venv|__pycache__|\.git' -and
        $_.FullName -notmatch '\.(log|sqlite3|db|pyc)$' -and
        $_.FullName -notmatch 'check-secrets\.ps1'
    }

foreach ($file in $filesToCheck) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($null -eq $content) { continue }
        
        # Check for API keys
        foreach ($pattern in $apiKeyPatterns) {
            if ($content -match $pattern) {
                $issues += "⚠️  Found API key pattern in: $($file.FullName)"
            }
        }
        
        # Check for passwords
        foreach ($pattern in $passwordPatterns) {
            if ($content -match $pattern) {
                $issues += "⚠️  Found password pattern in: $($file.FullName)"
            }
        }
    } catch {
        # Skip binary files
        continue
    }
}

# Check for .env files
$envFiles = Get-ChildItem -Recurse -File -Filter "*.env" | 
    Where-Object { $_.FullName -notmatch '\.env\.example' }
if ($envFiles) {
    foreach ($file in $envFiles) {
        $issues += "❌ Found .env file: $($file.FullName) (should be gitignored)"
    }
}

# Check for config.js files (should use config.example.js)
$configFiles = Get-ChildItem -Recurse -File -Filter "config.js" | 
    Where-Object { $_.FullName -notmatch 'config.example.js' }
if ($configFiles) {
    foreach ($file in $configFiles) {
        $issues += "⚠️  Found config.js: $($file.FullName) (should be gitignored or use config.example.js)"
    }
}

# Check for database files
$dbFiles = Get-ChildItem -Recurse -File -Filter "*.sqlite3"
if ($dbFiles) {
    foreach ($file in $dbFiles) {
        $issues += "⚠️  Found database file: $($file.FullName) (should be gitignored)"
    }
}

# Report results
Write-Host "`n" -NoNewline
if ($issues.Count -eq 0) {
    Write-Host "✅ No secrets found! Safe to commit." -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Found $($issues.Count) potential security issues:" -ForegroundColor Red
    Write-Host ""
    foreach ($issue in $issues) {
        Write-Host $issue -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "⚠️  Please fix these issues before committing to GitHub!" -ForegroundColor Red
    exit 1
}

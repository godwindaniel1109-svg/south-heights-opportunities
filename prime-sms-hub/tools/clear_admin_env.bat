@echo off
REM Clears persisted ADMIN_* environment variables
setx ADMIN_USERNAME ""
setx ADMIN_PASSWORD ""
setx ADMIN_EMAIL ""
echo Cleared ADMIN_* environment variables (if any)

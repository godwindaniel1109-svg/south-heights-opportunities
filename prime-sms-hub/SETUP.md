# Server Setup Guide

## ✅ What's Been Fixed

1. **Mobile Sidebar Navigation** - Added hamburger menu toggle for mobile devices
2. **Navigation Flow** - Landing page → Login/Register → Dashboard (with sidebar)
3. **Stable Server** - Created robust Python and Node.js servers with error handling

## 🎯 Current Server Status

The server is running at: **http://localhost:8000**

## 🔄 To Restart the Server

### Quick Method (Recommended)
Double-click `start-server.bat` or run:
```bash
python server.py
```

### If Server is Stuck
1. Open Task Manager (Ctrl + Shift + Esc)
2. Find "Python" process
3. End the process
4. Run `python server.py` again

### Alternative: PowerShell Method
```powershell
# Kill existing Python processes
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force

# Start new server
python server.py
```

## 📱 Testing Mobile Sidebar

1. Open http://localhost:8000/profile.html
2. Resize browser to mobile width (< 768px) or use DevTools mobile view
3. Click the hamburger menu (☰) button in the header
4. Sidebar should slide in from the left
5. Click outside (on overlay) or a menu item to close

## 🎨 Features Added

### Mobile Menu Toggle
- Hamburger icon appears on screens < 768px
- Smooth slide-in animation
- Dark overlay backdrop
- Auto-close on navigation
- Touch-friendly

### Server Improvements
- Better error messages
- Port conflict detection
- Graceful shutdown handling
- CORS enabled for development
- Auto-restart capability

## 🐛 Common Issues

**Issue**: Port 8000 already in use
**Solution**: 
```powershell
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

**Issue**: Server crashes randomly
**Solution**: Use the new `server.py` which has better error handling and won't crash on common errors

**Issue**: Mobile menu not working
**Solution**: Clear browser cache (Ctrl + F5) to reload the updated CSS and JavaScript
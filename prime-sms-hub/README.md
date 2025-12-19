# Prime SMS Hub

SMS Solutions Platform with Firebase integration.

## 🚀 Quick Start

### Option 1: Using Python (Recommended for Windows)
```bash
python server.py
```

### Option 2: Using Node.js
```bash
npm install
npm start
```

### Option 3: Using Batch File (Windows)
```bash
start-server.bat
```

### Option 4: Using PowerShell (Windows)
```powershell
.\start-server.ps1
```

## 📱 Navigation Flow

1. **Landing Page** (`index.html`) - Click "Get Started" button
2. **Login/Register** (`login.html` or `register.html`) - Sign in or create account
3. **Dashboard** (`dashboard.html`) - Main app with sidebar navigation

## 🛠️ Server Features

- **Auto-restart**: The Python server includes better error handling
- **Port conflict resolution**: Automatically detects and handles port conflicts
- **CORS enabled**: For development purposes
- **Graceful shutdown**: Proper cleanup on exit

## 📂 Project Structure

```
prime-sms-hub/
├── index.html          # Landing page
├── login.html          # Login page
├── register.html       # Registration page
├── dashboard.html      # Main dashboard
├── profile.html        # User profile
├── css/               # Stylesheets
├── js/                # JavaScript files
├── images/            # Image assets
├── server.py          # Python development server
├── server.js          # Node.js development server (optional)
└── package.json       # Node.js dependencies (optional)
```

## 🔧 Troubleshooting

### Server won't start
- **Port already in use**: Kill any process using port 8000
  ```powershell
  Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force
  ```
- **Python not found**: Install Python 3.x from python.org

### Server keeps crashing
- Use the improved `server.py` which has better error handling
- Check the console output for specific error messages

## 🌐 Access the Application

Once the server is running, open your browser and navigate to:
- **Local**: http://localhost:8000

### Live Reload
- **LiveReload** (frontend): http://localhost:5500 — serves the frontend from the repository root and provides live-reload on changes.  

### Soft Live Reload & Admin CSS
- **Soft Live Reload:** A soft mode is supported so pages can opt-in to receive change notifications without a full page reload. To opt a page in, add `data-live-reload="soft"` to the `<body>` element and listen for the `live-reload:changed` event in your page script to refresh only the API-driven parts (wallet, tables, widgets). See `js/live-reload.js` for the dispatching logic.
- **Admin CSS not showing?** Ensure static files are served in development (runserver or `python server.py`) or configure WhiteNoise/`collectstatic` in production so `static/admin/css/custom_admin.css` is available to the admin UI.

## 📝 Notes

- The mobile sidebar toggle has been fixed for all dashboard pages
- Firebase configuration is in `js/firebase-config.js`
- All authentication flows redirect to the dashboard after successful login
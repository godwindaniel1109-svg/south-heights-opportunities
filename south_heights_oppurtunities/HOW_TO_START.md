# 🚀 HOW TO START - Step by Step

## ⚠️ Why Same URL?

**One Frontend App = One URL**

The `frontend/` folder is ONE React app that has:
- `/` route = Landing page
- `/login` route = Login page  
- `/dashboard` route = User dashboard
- `/admin` route = Admin dashboard (only for admins)

**It's like one building with different rooms!**

---

## 🔧 Fix "localhost refused to connect"

This error means **the servers are NOT running**. Follow these steps:

---

## Step 1: Install Dependencies (First Time Only)

### **Backend:**
Open PowerShell/Terminal and run:
```powershell
cd C:\Users\HP\Desktop\my-project-folder\south_heights_oppurtunities\backend
npm install
```

Wait for it to finish (may take 2-5 minutes)

### **Frontend:**
Open PowerShell/Terminal and run:
```powershell
cd C:\Users\HP\Desktop\my-project-folder\south_heights_oppurtunities\frontend
npm install
```

Wait for it to finish (may take 2-5 minutes)

---

## Step 2: Start Backend Server

**Open Terminal/PowerShell Window 1:**

```powershell
cd C:\Users\HP\Desktop\my-project-folder\south_heights_oppurtunities\backend
npm run dev
```

**You should see:**
```
Server running on port 4000
```

**✅ Keep this window open! Don't close it!**

---

## Step 3: Start Frontend Server

**Open a NEW Terminal/PowerShell Window 2:**

```powershell
cd C:\Users\HP\Desktop\my-project-folder\south_heights_oppurtunities\frontend
npm run dev
```

**You should see:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**✅ Keep this window open too!**

**Note the URL:** It might be `http://localhost:3000` or `http://localhost:5173`

---

## Step 4: Open Browser

**Copy the EXACT URL from Terminal 2** and paste in browser:

- `http://localhost:3000` (if that's what it shows)
- OR `http://localhost:5173` (if that's what it shows)

**Don't just type "localhost" - use the full URL with port!**

---

## ✅ What You Should See

### **If Backend is Running:**
- Terminal 1 shows: "Server running on port 4000"
- No errors in Terminal 1

### **If Frontend is Running:**
- Terminal 2 shows: "Local: http://localhost:XXXX"
- Browser opens automatically (or you open it manually)
- You see the landing page

---

## 🐛 Troubleshooting

### **Error: "npm is not recognized"**
**Solution:** Install Node.js from https://nodejs.org

### **Error: "Cannot find module"**
**Solution:** Run `npm install` in both folders

### **Error: "Port already in use"**
**Solution:** 
- Close other programs using port 3000 or 4000
- Or change port in config files

### **Error: "localhost refused to connect"**
**Causes:**
1. ❌ Frontend server not running → Start Terminal 2
2. ❌ Wrong URL → Use exact URL from terminal
3. ❌ Port blocked → Check firewall

### **Still Not Working?**

**Check these:**
1. ✅ Are BOTH terminals showing "running" messages?
2. ✅ Did you use the EXACT URL from Terminal 2?
3. ✅ Are there any error messages in the terminals?
4. ✅ Did you wait for `npm install` to finish?

---

## 📱 Visual Guide

```
┌─────────────────────────────────────┐
│  TERMINAL 1 (Backend)               │
│  cd backend                          │
│  npm run dev                         │
│  ✅ Server running on port 4000     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  TERMINAL 2 (Frontend)              │
│  cd frontend                         │
│  npm run dev                         │
│  ✅ Local: http://localhost:3000    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  BROWSER                             │
│  Open: http://localhost:3000       │
│  ✅ See Landing Page                │
└─────────────────────────────────────┘
```

---

## 🎯 Quick Test

1. **Both terminals running?** ✅
2. **Browser open to correct URL?** ✅
3. **See landing page?** ✅

**If YES to all → It's working!**

**If NO → Check error messages in terminals**

---

## 💡 Remember

- **One Frontend App** = One URL (`http://localhost:3000`)
- **Different Routes:**
  - `/` = Landing (everyone)
  - `/dashboard` = User dashboard (logged in users)
  - `/admin` = Admin dashboard (admin only)

- **Backend** runs separately on port 4000
- **Frontend** connects to backend automatically

---

**Start both servers, then open browser! 🚀**

# 🔧 FIX: "localhost refused to connect"

## ✅ GOOD NEWS: Node.js is Already Installed!

You have **Node.js v20.10.0** installed. The problem is just that **the servers aren't running**.

---

## 🚀 SOLUTION: Start Both Servers

### **Method 1: Double-Click (EASIEST)**

1. Find `START_SERVERS.bat` in your project folder
2. **Double-click it**
3. Two windows will open automatically
4. Wait for the Frontend window to show: `Local: http://localhost:3000`
5. Copy that URL and open in browser

---

### **Method 2: Manual (Step-by-Step)**

#### **STEP 1: Open PowerShell/Terminal Window 1**

Press `Windows Key + X` → Click "Windows PowerShell"

Then type these commands **ONE BY ONE** (press Enter after each):

```powershell
cd C:\Users\HP\Desktop\my-project-folder\south_heights_oppurtunities\backend
```

```powershell
npm install
```

Wait for it to finish (may take 1-2 minutes)

```powershell
npm run dev
```

**✅ You should see:** `Server running on port 4000`

**⚠️ KEEP THIS WINDOW OPEN! Don't close it!**

---

#### **STEP 2: Open PowerShell/Terminal Window 2** (NEW WINDOW!)

Press `Windows Key + X` again → Click "Windows PowerShell" (NEW window!)

Then type these commands **ONE BY ONE**:

```powershell
cd C:\Users\HP\Desktop\my-project-folder\south_heights_oppurtunities\frontend
```

```powershell
npm install
```

Wait for it to finish (may take 1-2 minutes)

```powershell
npm run dev
```

**✅ You should see:** `Local: http://localhost:3000` (or similar)

**⚠️ KEEP THIS WINDOW OPEN TOO!**

---

#### **STEP 3: Open Browser**

1. Look at **Window 2** (Frontend)
2. Find the line that says: `Local: http://localhost:XXXX`
3. **Copy that EXACT URL** (usually `http://localhost:3000`)
4. Paste it in your browser
5. Press Enter

**✅ You should see the landing page!**

---

## 📋 What You Should See

### **Window 1 (Backend):**
```
Server running on port 4000
```

### **Window 2 (Frontend):**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

### **Browser:**
- Landing page with "Pennysavia USA"
- "Join Now" and "Sign In" buttons

---

## ❌ Common Mistakes

1. **Closing the terminal windows** → Servers stop running
2. **Not waiting for npm install** → Errors occur
3. **Using wrong URL** → Must use the EXACT URL from Window 2
4. **Only starting one server** → Need BOTH backend AND frontend

---

## 🐛 Still Not Working?

### **Check 1: Are both windows showing "running"?**
- Window 1: Should say "Server running on port 4000"
- Window 2: Should say "Local: http://localhost:XXXX"
- If not → Check for error messages

### **Check 2: Error Messages?**

**"npm is not recognized"**
- Node.js not installed → But you have it! Try restarting terminal

**"Cannot find module"**
- Run `npm install` first in both folders

**"Port already in use"**
- Close other programs using ports 3000 or 4000
- Or kill Node processes: `taskkill /F /IM node.exe`

**"EADDRINUSE"**
- Port is already in use
- Close the other terminal window or change port

---

## 💡 Remember

- **Backend** (port 4000) = Server that handles data
- **Frontend** (port 3000) = Website you see in browser
- **Both must be running** for the app to work!

---

## 🎯 Quick Test

1. ✅ Both terminals showing "running"?
2. ✅ Browser open to URL from Window 2?
3. ✅ See landing page?

**If YES to all → It's working! 🎉**

**If NO → Check error messages in terminals**

---

**The servers just need to be started - that's all!**

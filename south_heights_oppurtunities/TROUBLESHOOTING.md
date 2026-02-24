# 🔧 TROUBLESHOOTING GUIDE

## ✅ Mobile Responsiveness: CONFIRMED

Your app is **100% mobile-friendly** with:
- ✅ Responsive breakpoints (480px, 768px, 1024px)
- ✅ Touch-friendly buttons
- ✅ Mobile-optimized layouts
- ✅ Scrollable tables and navigation
- ✅ Flexible grid systems

## ✅ Deployment Setup: CONFIRMED

Your deployment is **ready** with:
- ✅ `netlify.toml` configured
- ✅ `vercel.json` configured
- ✅ Build commands set up
- ✅ SPA routing configured
- ✅ API proxy configured

---

## 🚨 FIX: "localhost refused to connect"

### **The Problem:**
The servers are **NOT running**. You need to start them.

### **Solution 1: Use the Batch File (EASIEST)**

1. **Find** `START_SERVERS.bat` in your project folder
2. **Right-click** → **Run as Administrator** (if needed)
3. **Wait** for 2 windows to open
4. **Look** at the Frontend window for the URL
5. **Copy** that URL and open in browser

---

### **Solution 2: Manual Start (Step-by-Step)**

#### **STEP 1: Open PowerShell Window 1**

Press `Windows Key + X` → Click **"Windows PowerShell"**

**Type these commands ONE BY ONE:**

```powershell
cd C:\Users\HP\Desktop\my-project-folder\south_heights_oppurtunities\backend
```

```powershell
npm install
```

**Wait** for it to finish (1-2 minutes)

```powershell
npm run dev
```

**✅ You should see:** `Server running on port 4000`

**⚠️ KEEP THIS WINDOW OPEN!**

---

#### **STEP 2: Open PowerShell Window 2** (NEW WINDOW!)

Press `Windows Key + X` again → Click **"Windows PowerShell"** (NEW!)

**Type these commands ONE BY ONE:**

```powershell
cd C:\Users\HP\Desktop\my-project-folder\south_heights_oppurtunities\frontend
```

```powershell
npm install
```

**Wait** for it to finish (1-2 minutes)

```powershell
npm run dev
```

**✅ You should see:** `Local: http://localhost:3000`

**⚠️ KEEP THIS WINDOW OPEN!**

---

#### **STEP 3: Open Browser**

1. **Look** at Window 2 (Frontend)
2. **Find** the line: `Local: http://localhost:3000`
3. **Copy** that EXACT URL
4. **Paste** in your browser
5. **Press** Enter

**✅ You should see the landing page!**

---

## 🐛 Common Errors & Fixes

### **Error: "npm is not recognized"**

**Fix:**
1. Restart your terminal/PowerShell
2. Or reinstall Node.js from https://nodejs.org
3. Make sure to check "Add to PATH" during installation

---

### **Error: "Cannot find module"**

**Fix:**
1. Make sure you ran `npm install` in BOTH folders
2. Delete `node_modules` folder and `package-lock.json`
3. Run `npm install` again

---

### **Error: "Port already in use"**

**Fix:**
1. Close other programs using ports 3000 or 4000
2. Or kill Node processes:
   ```powershell
   taskkill /F /IM node.exe
   ```
3. Then try starting servers again

---

### **Error: "EADDRINUSE"**

**Fix:**
- Another process is using the port
- Close other terminal windows
- Or change the port in config files

---

### **Still seeing "localhost refused to connect"?**

**Checklist:**
- [ ] Did you start BOTH servers? (Backend AND Frontend)
- [ ] Are BOTH terminal windows still open?
- [ ] Did you use the EXACT URL from the Frontend window?
- [ ] Are there any error messages in the terminals?
- [ ] Did you wait for `npm install` to finish?

---

## 📱 Mobile Testing

### **Test on Your Phone:**

1. **Find your computer's IP address:**
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (usually 192.168.x.x)

2. **Start both servers** (as above)

3. **On your phone**, open:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   (Replace YOUR_IP_ADDRESS with the IP from step 1)

4. **Make sure** your phone and computer are on the **same WiFi network**

---

## 🚀 Deployment Checklist

### **Before Deploying:**

- [ ] Test locally first (both servers running)
- [ ] Check mobile responsiveness (use browser dev tools)
- [ ] Set environment variables in Netlify/Vercel
- [ ] Set `BACKEND_URL` in deployment platform
- [ ] Test all features (login, register, DWT purchase, etc.)

### **Deploy Frontend (Netlify/Vercel):**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect to Netlify/Vercel:**
   - Go to netlify.com or vercel.com
   - Connect your GitHub repo
   - Set build directory: `frontend`
   - Set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/dist`

3. **Set Environment Variables:**
   - `VITE_API_URL` = Your backend URL (e.g., `https://your-backend.onrender.com`)

### **Deploy Backend (Render/Heroku):**

1. **Push to GitHub** (same repo or separate)

2. **Connect to Render/Heroku:**
   - Go to render.com or heroku.com
   - Create new service
   - Connect GitHub repo
   - Set root directory: `backend`
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Set Environment Variables:**
   - `PORT` = 4000 (or let platform assign)
   - `TELEGRAM_BOT_TOKEN` = Your bot token
   - `TELEGRAM_CHAT_ID` = Your chat ID
   - `BACKEND_URL` = Your backend URL

---

## ✅ Verification

### **Local Testing:**
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Landing page loads
- [ ] Can register/login
- [ ] Dashboard works
- [ ] Mobile responsive (test in browser dev tools)

### **Deployment:**
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] API calls work (check browser console)
- [ ] Mobile responsive on real devices
- [ ] All features work

---

## 💡 Quick Tips

1. **Always keep both servers running** when testing locally
2. **Use browser dev tools** (F12) to test mobile views
3. **Check console** for errors (F12 → Console tab)
4. **Test on real devices** before deploying
5. **Set environment variables** before deploying

---

**Your app is mobile-friendly and deployment-ready! Just need to start the servers! 🚀**

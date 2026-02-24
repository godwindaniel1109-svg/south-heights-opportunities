# 🚀 Quick Start Guide - User vs Admin

## 📋 Understanding the Setup

### **There is ONLY ONE Frontend** - It serves BOTH users and admin!

- **User Frontend:** `frontend/` folder
  - Landing page, Login, Register, Dashboard (for regular users)
  - **Admin Dashboard:** Accessible at `/admin` route (for admins only)
  - **Same app, different routes!**

- **Backend:** `backend/` folder
  - API server that both user and admin use
  - Handles chat, submissions, user management

---

## 🔧 Fix "localhost refused to connect"

This error means the servers aren't running. Follow these steps:

### **Step 1: Start Backend Server**

Open **Terminal/PowerShell** (Terminal 1):

```bash
cd backend
npm install
npm run dev
```

**Wait for:** `Server running on port 4000` or similar message

**Keep this terminal open!**

---

### **Step 2: Start Frontend Server**

Open a **NEW Terminal/PowerShell** window (Terminal 2):

```bash
cd frontend
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:5173` or `http://localhost:3000`

**Keep this terminal open!**

---

### **Step 3: Open Browser**

Open your browser and go to:
- `http://localhost:5173` (if Vite shows port 5173)
- OR `http://localhost:3000` (if Vite shows port 3000)
- Check the terminal output for the exact URL!

---

## 👥 User vs Admin - Same App, Different Access

### **For Regular Users:**

1. **Open:** `http://localhost:5173` (or port shown)
2. **See:** Landing page
3. **Register/Login:** As regular user
4. **Access:** Dashboard with tabs (Meetups, Jobs, Chat, etc.)
5. **Cannot access:** `/admin` route (will redirect)

**User Email Examples:**
- `test@example.com`
- `user@test.com`
- Any email EXCEPT `admin@pennysavia.com`

---

### **For Admin:**

1. **Open:** `http://localhost:5173` (same URL!)
2. **Register/Login:** With email `admin@pennysavia.com` ⚠️ **MUST BE EXACT**
3. **After login:** Click **🛡️ Admin** link in header
4. **OR go to:** `http://localhost:5173/admin`
5. **Access:** Full admin dashboard

**Admin Email:**
- `admin@pennysavia.com` (exact match required)

---

## 🎯 Quick Test Steps

### **Test as User:**

```bash
# 1. Start backend (Terminal 1)
cd backend
npm run dev

# 2. Start frontend (Terminal 2 - NEW TERMINAL)
cd frontend
npm run dev

# 3. Open browser: http://localhost:5173
# 4. Register: test@example.com / password123
# 5. Use dashboard features
```

### **Test as Admin:**

```bash
# 1. Backend already running (Terminal 1)
# 2. Frontend already running (Terminal 2)

# 3. Open browser: http://localhost:5173
# 4. Logout from user account
# 5. Register: admin@pennysavia.com / admin123
# 6. Click 🛡️ Admin link OR go to /admin
# 7. Use admin features
```

---

## 🐛 Troubleshooting

### **"localhost refused to connect"**

**Problem:** Servers aren't running

**Solution:**
1. Check Terminal 1 - Is backend running?
   - Should see: "Server running on port 4000"
   - If not: `cd backend && npm run dev`

2. Check Terminal 2 - Is frontend running?
   - Should see: "Local: http://localhost:5173"
   - If not: `cd frontend && npm run dev`

3. Check the correct port:
   - Look at terminal output
   - Use the exact URL shown (might be 5173, 3000, or other)

---

### **"Cannot find module" errors**

**Solution:**
```bash
# Install dependencies
cd backend
npm install

cd ../frontend
npm install
```

---

### **"Port already in use"**

**Solution:**
- Close other applications using the port
- Or change port in config files
- Backend: Check `backend/index.js` for PORT
- Frontend: Check `frontend/vite.config.js` for port

---

### **Admin link not showing**

**Problem:** Not logged in as admin

**Solution:**
1. Make sure email is exactly: `admin@pennysavia.com`
2. Logout and login again
3. Check browser console for errors

---

## 📱 Summary

| Component | Folder | Port | URL | Who Uses It |
|-----------|--------|------|-----|-------------|
| **Frontend** | `frontend/` | 5173 or 3000 | `http://localhost:5173` | **BOTH** users and admin |
| **Backend** | `backend/` | 4000 | `http://localhost:4000` | **BOTH** users and admin |

**Routes:**
- `/` - Landing page (everyone)
- `/login` - Login (everyone)
- `/register` - Register (everyone)
- `/dashboard` - User dashboard (logged in users)
- `/admin` - Admin dashboard (admin only)

---

## ✅ Quick Checklist

Before testing:
- [ ] Backend running on port 4000
- [ ] Frontend running on port 5173 (or shown port)
- [ ] Both terminals showing "running" messages
- [ ] Browser open to correct URL

To test user:
- [ ] Register with regular email
- [ ] Access dashboard
- [ ] Use chat, meetups, jobs

To test admin:
- [ ] Register with `admin@pennysavia.com`
- [ ] Click 🛡️ Admin link
- [ ] Access admin dashboard
- [ ] Test moderation features

---

**Need help? Check the terminal outputs for error messages!**

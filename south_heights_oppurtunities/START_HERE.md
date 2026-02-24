# 🚀 START HERE - Fix "localhost refused to connect"

## ⚠️ Important: There is ONLY ONE Frontend!

**The `frontend/` folder serves BOTH:**
- ✅ **Regular Users** (Landing, Login, Dashboard)
- ✅ **Admin** (Access at `/admin` route)

**You don't need separate apps!**

---

## 🔧 Fix the Error - Start Both Servers

The error means servers aren't running. You need **TWO terminals open**:

### **Terminal 1: Backend Server**

```powershell
cd backend
npm install
npm run dev
```

**Wait for:** `Server running on port 4000` ✅

**Keep this terminal open!**

---

### **Terminal 2: Frontend Server** (NEW TERMINAL WINDOW)

```powershell
cd frontend
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:3000` or `http://localhost:5173` ✅

**Check the terminal for the exact URL!**

---

### **Open Browser**

Go to the URL shown in Terminal 2:
- Usually: `http://localhost:3000`
- Or: `http://localhost:5173`

---

## 👥 User vs Admin - Same App!

### **For Regular Users:**

1. Open: `http://localhost:3000` (or port shown)
2. Register with any email (EXCEPT `admin@pennysavia.com`)
3. Example: `user@test.com` / `password123`
4. You'll see: Dashboard with tabs (Meetups, Jobs, Chat, etc.)

### **For Admin:**

1. Open: `http://localhost:3000` (SAME URL!)
2. Register with email: `admin@pennysavia.com` ⚠️ **EXACT EMAIL**
3. Password: `admin123`
4. After login: Click **🛡️ Admin** link in header
5. OR go to: `http://localhost:3000/admin`
6. You'll see: Full admin dashboard

---

## 📋 Quick Checklist

Before opening browser:
- [ ] Terminal 1: Backend running (port 4000)
- [ ] Terminal 2: Frontend running (port 3000 or 5173)
- [ ] Both terminals show "running" messages

To test:
- [ ] Open browser to URL from Terminal 2
- [ ] See landing page
- [ ] Register as user
- [ ] Register as admin (`admin@pennysavia.com`)
- [ ] Access admin dashboard

---

## 🐛 Still Not Working?

### **Check Terminal 1 (Backend):**
- Should see: "Server running on port 4000"
- If error: Run `npm install` first

### **Check Terminal 2 (Frontend):**
- Should see: "Local: http://localhost:XXXX"
- If error: Run `npm install` first
- Use the EXACT URL shown

### **Browser:**
- Use the URL from Terminal 2
- Don't use `localhost` without port number
- Try the exact URL shown (e.g., `http://localhost:3000`)

---

## ✅ Summary

| What | Folder | Port | URL | Who Uses |
|------|--------|------|-----|----------|
| **Frontend** | `frontend/` | 3000 or 5173 | `http://localhost:3000` | **BOTH** users & admin |
| **Backend** | `backend/` | 4000 | `http://localhost:4000` | **BOTH** users & admin |

**Routes:**
- `/` = Landing page (everyone)
- `/dashboard` = User dashboard (logged in)
- `/admin` = Admin dashboard (admin only)

---

**Start both servers, then open the browser! 🎉**

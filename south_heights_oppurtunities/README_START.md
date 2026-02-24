# ⚡ QUICK START - Read This First!

## 🎯 The Answer to Your Questions

### **Q: Why same URL?**
**A:** There is **ONE frontend app** that serves both users and admin. It's like one website with different pages:
- `http://localhost:3000/` = Landing page (everyone)
- `http://localhost:3000/dashboard` = User dashboard (logged in users)
- `http://localhost:3000/admin` = Admin dashboard (admin only)

### **Q: Which is for user and which is for admin?**
**A:** 
- **`frontend/` folder** = BOTH user and admin (same app!)
- **`backend/` folder** = Server that both use

**Access:**
- Regular users → Login → See dashboard
- Admin users → Login with `admin@pennysavia.com` → Click 🛡️ Admin link → See admin dashboard

---

## 🚨 Fix "localhost refused to connect"

**This error means servers aren't running!**

### **You Need 2 Terminal Windows:**

#### **Window 1 - Backend:**
```powershell
cd backend
npm install
npm run dev
```
**Wait for:** "Server running on port 4000"

#### **Window 2 - Frontend:**
```powershell
cd frontend
npm install
npm run dev
```
**Wait for:** "Local: http://localhost:3000"

#### **Then:**
- Open browser
- Go to the URL from Window 2
- See landing page!

---

## 📁 Folder Structure

```
south_heights_oppurtunities/
├── frontend/     ← ONE app for BOTH users & admin
│   └── Routes:
│       ├── /          → Landing (everyone)
│       ├── /dashboard → User dashboard (users)
│       └── /admin     → Admin dashboard (admin only)
│
└── backend/      ← Server for BOTH
    └── API endpoints
```

---

## ✅ Quick Checklist

Before opening browser:
- [ ] Window 1: Backend running (port 4000)
- [ ] Window 2: Frontend running (port 3000)
- [ ] Both show "running" messages

To test:
- [ ] Open browser to URL from Window 2
- [ ] See landing page
- [ ] Register as user → See dashboard
- [ ] Register as admin (`admin@pennysavia.com`) → See admin dashboard

---

**Start both servers, then it will work! 🎉**

# 🔌 Port Configuration

## 📍 Different URLs for User and Admin

Your application uses **3 different ports**:

| Service | Port | URL | Who Uses It |
|---------|------|-----|-------------|
| **Backend API** | 4000 | `http://localhost:4000` | Both user & admin (API calls) |
| **User Frontend** | 3000 | `http://localhost:3000` | Regular users |
| **Admin Frontend** | 5000 | `http://localhost:5000` | Admin only |

---

## 🚀 How to Start

### **Option 1: Use Batch File**

Double-click: `START_SERVERS.bat`

This will start:
- ✅ Backend on port 4000
- ✅ User frontend on port 3000
- ✅ Admin frontend on port 5000

---

### **Option 2: Manual (3 Terminal Windows)**

#### **Window 1 - Backend:**
```powershell
cd backend
npm install
npm run dev
```
**Wait for:** `Server running on port 4000`

#### **Window 2 - User Frontend:**
```powershell
cd frontend
npm install
npm run dev
```
**Wait for:** `Local: http://localhost:3000`

#### **Window 3 - Admin Frontend:**
```powershell
cd admin
npm install
npm run dev
```
**Wait for:** `Local: http://localhost:5000`

---

## 🌐 Access URLs

### **For Regular Users:**
- **Landing Page:** `http://localhost:3000`
- **Dashboard:** `http://localhost:3000/dashboard`
- **Login:** `http://localhost:3000/login`
- **Register:** `http://localhost:3000/register`

### **For Admin:**
- **Admin Dashboard:** `http://localhost:5000`
- **Admin Users:** `http://localhost:5000/admin/users`
- **Admin Submissions:** `http://localhost:5000/admin/submissions`
- **Admin Chat:** `http://localhost:5000/admin/chat`

---

## ✅ Quick Test

1. **Start all 3 servers** (use `START_SERVERS.bat` or manual)
2. **Open 2 browser tabs:**
   - Tab 1: `http://localhost:3000` (User app)
   - Tab 2: `http://localhost:5000` (Admin app)
3. **Test both!**

---

## 📋 Summary

- **Backend:** Port 4000 (API server)
- **User Frontend:** Port 3000 (Regular users)
- **Admin Frontend:** Port 5000 (Admin only)

**No more same URL! Separate ports for user and admin!** 🎉

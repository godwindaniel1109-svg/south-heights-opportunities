# 🛡️ Admin URL - Separate Port!

## ✅ Admin Now Has Its Own Port!

**Admin Dashboard URL:**
```
http://localhost:5000
```

**User App URL:**
```
http://localhost:3000
```

**Backend API:**
```
http://localhost:4000
```

---

## 🚀 How to Start

### **Easy Way:**
Double-click `START_SERVERS.bat`

This starts all 3 servers:
- ✅ Backend on port 4000
- ✅ User frontend on port 3000  
- ✅ Admin frontend on port 5000

---

### **Manual Way (3 Windows):**

**Window 1 - Backend:**
```powershell
cd backend
npm install
npm run dev
```
→ Port 4000

**Window 2 - User Frontend:**
```powershell
cd frontend
npm install
npm run dev
```
→ Port 3000

**Window 3 - Admin Frontend:**
```powershell
cd admin
npm install
npm run dev
```
→ Port 5000

---

## 🌐 Access URLs

| App | URL | Port |
|-----|-----|------|
| **User App** | `http://localhost:3000` | 3000 |
| **Admin App** | `http://localhost:5000` | 5000 |
| **Backend API** | `http://localhost:4000` | 4000 |

---

## ✅ Quick Test

1. **Start all servers** (use `START_SERVERS.bat`)
2. **Open 2 browser tabs:**
   - Tab 1: `http://localhost:3000` (User)
   - Tab 2: `http://localhost:5000` (Admin)
3. **Done!** ✅

---

**No more same URL! Admin has its own port 5000!** 🎉

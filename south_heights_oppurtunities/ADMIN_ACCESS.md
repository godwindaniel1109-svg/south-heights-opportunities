# 🛡️ Admin Dashboard Access

## 📍 Admin URL

**Admin Dashboard URL:**
```
http://localhost:3000/admin
```

**Same frontend app, different route!**

---

## 🔐 How to Access Admin Dashboard

### **Step 1: Register/Login as Admin**

You need to register or login with the admin email:

**Admin Email:** `admin@pennysavia.com`  
**Password:** Any password (for demo)

### **Step 2: Access Admin Dashboard**

**Option 1: Direct URL**
- Open browser
- Go to: `http://localhost:3000/admin`
- If you're logged in as admin → You'll see the admin dashboard
- If you're not logged in → You'll be redirected to login

**Option 2: From Dashboard**
- Login/Register with `admin@pennysavia.com`
- Go to Dashboard (`http://localhost:3000/dashboard`)
- Click the **🛡️ Admin** link in the header
- You'll be taken to `/admin`

---

## ✅ Quick Test

1. **Register** with email: `admin@pennysavia.com`
2. **Login** with that account
3. **Go to:** `http://localhost:3000/admin`
4. **You should see:** Full admin dashboard with:
   - Overview/Stats
   - User Management
   - Submissions Management
   - Chat Moderation
   - Settings
   - Activity Logs

---

## 🔒 Admin Access Rules

- **Only users with email `admin@pennysavia.com` can access `/admin`**
- **Regular users** will be redirected to `/dashboard` if they try to access `/admin`
- **Not logged in?** You'll be redirected to `/login`

---

## 📋 Summary

| URL | Who Can Access |
|-----|----------------|
| `http://localhost:3000/` | Everyone (Landing page) |
| `http://localhost:3000/dashboard` | Logged in users |
| `http://localhost:3000/admin` | **Only admin** (`admin@pennysavia.com`) |

---

**Admin URL: `http://localhost:3000/admin`** 🚀

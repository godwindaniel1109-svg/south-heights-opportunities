# 🧪 Local Testing Guide

## Quick Start - Test Everything Locally

### **Step 1: Start Backend Server**

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not done)
npm install

# Create .env file (if not exists)
# Copy .env.example or create new .env with:
# TELEGRAM_BOT_TOKEN=your_token_here
# TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here
# PORT=4000

# Start backend
npm run dev
# or
node index.js
```

Backend will run on: `http://localhost:4000`

---

### **Step 2: Start Frontend (User App)**

Open a **NEW terminal window**:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000` (or port shown in terminal)

---

### **Step 3: Test User Flow**

1. **Open Browser:** `http://localhost:3000`

2. **Landing Page:**
   - Should see hero images
   - Click "Join Now" or "Sign In"

3. **Register New User:**
   - Fill in name, email, password
   - Email: `test@example.com`
   - Password: `password123`
   - Click "Register"
   - You'll be redirected to dashboard

4. **Dashboard Features:**
   - ✅ See $10,000 virtual money in wallet
   - ✅ Navigate tabs: Meetups, Jobs, Free Money, Buy DWT, Withdraw, Referral, Chat
   - ✅ Test Chat - send messages
   - ✅ View meetups across PA
   - ✅ View job opportunities (need DWT first)

5. **Buy DWT:**
   - Go to "Buy DWT" tab
   - Fill form and upload payment proof image
   - Submit (will be pending until admin approves)

---

### **Step 4: Test Admin Dashboard**

1. **Register Admin Account:**
   - Logout from current account
   - Register with email: `admin@pennysavia.com`
   - Password: `admin123`
   - This email is hardcoded as admin

2. **Access Admin:**
   - After login, go to: `http://localhost:3000/admin`
   - Or add admin link in dashboard (we'll add this)

3. **Admin Features:**
   - ✅ Overview dashboard with stats
   - ✅ View all submissions
   - ✅ See payment proof images
   - ✅ Approve/reject submissions
   - ✅ Manage users (ban/unban)
   - ✅ View analytics
   - ✅ Moderate chat (coming soon)

---

### **Step 5: Test Chat**

1. **Open Chat:**
   - Login as user
   - Go to "Chat" tab in dashboard
   - Send messages

2. **Test Real-time (if backend running):**
   - Open chat in two different browsers/incognito
   - Login as different users
   - Messages should appear in real-time

3. **Admin Chat Moderation:**
   - Login as admin
   - Go to admin dashboard → Chat section
   - Delete messages, ban users, etc.

---

## 🔧 Troubleshooting

### **Backend won't start:**
- Check if port 4000 is already in use
- Install dependencies: `cd backend && npm install`
- Check `.env` file exists

### **Frontend won't start:**
- Check if port 3000 is already in use
- Install dependencies: `cd frontend && npm install`
- Clear cache: `npm cache clean --force`

### **Can't see images:**
- Make sure backend is running
- Check browser console for errors
- Verify image paths in network tab

### **Chat not working:**
- Make sure backend is running
- Check browser console
- Verify WebSocket connection

### **Admin not accessible:**
- Make sure email is exactly: `admin@pennysavia.com`
- Check browser console for errors
- Try logging out and back in

---

## 📋 Testing Checklist

### **User Features:**
- [ ] Landing page loads
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard shows $10,000 wallet
- [ ] Can view meetups
- [ ] Can view jobs (after DWT approval)
- [ ] Can buy DWT
- [ ] Can upload payment proof
- [ ] Can use chat
- [ ] Can see referral code

### **Admin Features:**
- [ ] Can login as admin
- [ ] Can access `/admin` route
- [ ] Can see overview stats
- [ ] Can view submissions
- [ ] Can see payment proof images
- [ ] Can approve/reject submissions
- [ ] Can view all users
- [ ] Can ban/unban users
- [ ] Can moderate chat
- [ ] Can delete messages

### **Chat Features:**
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Can see other users' messages
- [ ] Admin can delete messages
- [ ] Admin can ban users from chat
- [ ] Banned users can't send messages

---

## 🚀 Quick Commands

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Then open browser:
# http://localhost:3000
```

---

**Ready to test! 🎉**

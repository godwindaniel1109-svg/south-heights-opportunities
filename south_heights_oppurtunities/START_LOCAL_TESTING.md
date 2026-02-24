# 🚀 Start Local Testing - Quick Guide

## Step 1: Install Dependencies

### Backend:
```bash
cd backend
npm install
```

### Frontend:
```bash
cd frontend
npm install
```

---

## Step 2: Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

**Backend runs on:** `http://localhost:4000`

---

## Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**Frontend runs on:** `http://localhost:3000` (or port shown)

---

## Step 4: Test User Flow

1. **Open Browser:** `http://localhost:3000`

2. **Landing Page:**
   - ✅ See hero images
   - ✅ Click "Join Now"

3. **Register:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Click "Register"

4. **Dashboard:**
   - ✅ See $10,000 wallet
   - ✅ Navigate all tabs
   - ✅ Test Chat (send messages)
   - ✅ View Meetups
   - ✅ View Jobs

---

## Step 5: Test Admin

1. **Logout** from current account

2. **Register Admin:**
   - Email: `admin@pennysavia.com` ⚠️ **MUST BE THIS EXACT EMAIL**
   - Password: `admin123`
   - Register

3. **Access Admin:**
   - After login, click **🛡️ Admin** link in header
   - Or go to: `http://localhost:3000/admin`

4. **Admin Features:**
   - ✅ Overview stats
   - ✅ View submissions
   - ✅ See payment images
   - ✅ Approve/reject
   - ✅ Manage users
   - ✅ Moderate chat

---

## Step 6: Test Chat

1. **User Chat:**
   - Login as regular user
   - Go to Chat tab
   - Send messages
   - See real-time updates (if backend running)

2. **Admin Chat Moderation:**
   - Login as admin
   - Go to Chat tab
   - See 🗑️ delete button on messages
   - See 🚫 ban button on user messages
   - Delete/ban to test

---

## ✅ Quick Test Checklist

- [ ] Landing page loads
- [ ] Can register user
- [ ] Can login
- [ ] Dashboard shows $10,000
- [ ] Chat works
- [ ] Can register admin
- [ ] Admin dashboard accessible
- [ ] Can view submissions
- [ ] Can see images
- [ ] Can approve/reject
- [ ] Can ban users
- [ ] Can moderate chat

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check port 4000 is free
- Run: `cd backend && npm install`

**Frontend won't start?**
- Check port 3000 is free
- Run: `cd frontend && npm install`

**Chat not real-time?**
- Make sure backend is running
- Check browser console

**Admin not working?**
- Email MUST be: `admin@pennysavia.com`
- Check browser console for errors

---

**Ready to test! 🎉**

# 🚀 Complete Deployment Guide for Pennysavia USA

This guide explains exactly which folders/files to deploy where for Vercel/Netlify and Render.

## 📁 Project Structure Overview

```
south_heights_oppurtunities/
├── frontend/          → Deploy to Vercel/Netlify (User Frontend)
├── admin/            → Deploy to Vercel/Netlify (Admin Frontend) - OPTIONAL
├── backend/          → Deploy to Render/Heroku (Backend API)
└── (root files)      → Not deployed directly
```

---

## 🎯 Deployment Targets

### 1. **User Frontend** → Vercel or Netlify
**Folder:** `frontend/`  
**What it is:** React app for regular users (Landing, Login, Dashboard, Jobs, Meetups, etc.)

### 2. **Admin Frontend** → Vercel or Netlify (Separate deployment)
**Folder:** `admin/` (if exists)  
**What it is:** Admin dashboard for managing users and submissions  
**Note:** You can also access admin from user frontend at `/admin` route

### 3. **Backend API** → Render or Heroku
**Folder:** `backend/`  
**What it is:** Express.js server with Telegram bot integration

---

## 📦 Deployment Steps

### **Option A: User Frontend to Vercel**

1. **Push to GitHub:**
   ```bash
   git add frontend/
   git commit -m "Ready for user frontend deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - **Root Directory:** Set to `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - Click "Deploy"

3. **Environment Variables (if needed):**
   - `VITE_API_URL` = Your backend URL (e.g., `https://your-backend.onrender.com`)

---

### **Option B: User Frontend to Netlify**

1. **Push to GitHub** (same as above)

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repo
   - **Base directory:** `frontend`
   - **Build command:** `cd frontend && npm install && npm run build`
   - **Publish directory:** `frontend/dist`
   - Click "Deploy site"

3. **Configure Redirects:**
   - Netlify will use `netlify.toml` in root (already configured)
   - Or add `_redirects` file in `frontend/public/`:
     ```
     /*    /index.html   200
     ```

---

### **Backend to Render**

1. **Push to GitHub:**
   ```bash
   git add backend/
   git commit -m "Ready for backend deployment"
   git push origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - **Name:** `pennysavia-backend`
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Plan:** Free (or paid)

3. **Environment Variables:**
   Add these in Render dashboard:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here
   BACKEND_URL=https://your-backend.onrender.com
   PORT=10000
   NODE_ENV=production
   ```

4. **Get Backend URL:**
   - After deployment, Render gives you a URL like: `https://pennysavia-backend.onrender.com`
   - Use this URL in your frontend `VITE_API_URL`

---

### **Backend to Heroku** (Alternative)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App:**
   ```bash
   heroku login
   cd backend
   heroku create pennysavia-backend
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set TELEGRAM_ADMIN_CHAT_ID=your_chat_id
   heroku config:set BACKEND_URL=https://pennysavia-backend.herokuapp.com
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## 🔗 Connecting Frontend to Backend

After deploying both:

1. **Update Frontend Environment Variable:**
   - In Vercel/Netlify dashboard
   - Go to Environment Variables
   - Add: `VITE_API_URL=https://your-backend.onrender.com`
   - Redeploy frontend

2. **Update Backend CORS:**
   - Backend already has CORS enabled for all origins
   - If you need to restrict, update `backend/index.js`:
     ```js
     app.use(cors({
       origin: ['https://your-frontend.vercel.app', 'https://your-frontend.netlify.app']
     }))
     ```

---

## 📸 Image Handling

### **For Local Development:**
- Images uploaded to `backend/public/uploads/`
- Served at `http://localhost:4000/uploads/filename.jpg`

### **For Production:**
- **Option 1:** Use cloud storage (AWS S3, Cloudinary, etc.)
- **Option 2:** Keep using backend uploads folder
  - Make sure `BACKEND_URL` is set correctly
  - Images will be at: `https://your-backend.onrender.com/uploads/filename.jpg`

### **Update Backend for Production Images:**
The backend already handles this! Just set `BACKEND_URL` environment variable.

---

## 🛡️ Admin Dashboard Access

### **Option 1: Access from User Frontend**
- Deploy user frontend normally
- Admin can login with email: `admin@pennysavia.com`
- Access admin at: `https://your-frontend.vercel.app/admin`

### **Option 2: Separate Admin Deployment** (if you have `admin/` folder)
- Deploy `admin/` folder separately to Vercel/Netlify
- Use different subdomain: `admin.yourdomain.com`

---

## ✅ Deployment Checklist

### **User Frontend:**
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel/Netlify
- [ ] `VITE_API_URL` set to backend URL
- [ ] Test login/register
- [ ] Test image uploads
- [ ] Test admin access

### **Backend:**
- [ ] Code pushed to GitHub
- [ ] Deployed to Render/Heroku
- [ ] Environment variables set
- [ ] Test API endpoints
- [ ] Test Telegram bot
- [ ] Test image uploads

### **Post-Deployment:**
- [ ] Frontend can connect to backend
- [ ] Images display correctly
- [ ] Telegram bot receives notifications
- [ ] Admin dashboard works
- [ ] All routes work (SPA routing)

---

## 🔧 Troubleshooting

### **Images not showing:**
- Check `BACKEND_URL` is set correctly
- Verify backend is serving `/uploads/` folder
- Check image URLs in browser console

### **API calls failing:**
- Verify `VITE_API_URL` is set
- Check CORS settings in backend
- Check backend logs in Render/Heroku

### **Telegram bot not working:**
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Verify `TELEGRAM_ADMIN_CHAT_ID` is correct
- Check backend logs for errors

### **Admin dashboard not loading:**
- Make sure you're logged in as admin
- Check email is `admin@pennysavia.com`
- Check browser console for errors

---

## 📝 Quick Reference

| Component | Folder | Deploy To | URL Example |
|-----------|--------|-----------|------------|
| User Frontend | `frontend/` | Vercel/Netlify | `https://pennysavia.vercel.app` |
| Admin Frontend | `admin/` or `/admin` route | Vercel/Netlify | Same as user or separate |
| Backend API | `backend/` | Render/Heroku | `https://pennysavia-backend.onrender.com` |

---

## 🚀 Quick Deploy Commands

```bash
# 1. Push all code
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy frontend (Vercel CLI)
cd frontend
vercel --prod

# 3. Deploy backend (Render CLI or via dashboard)
# Use Render dashboard or:
cd backend
# Set up Render service via dashboard
```

---

**Need help?** Check the logs in your deployment platform's dashboard!

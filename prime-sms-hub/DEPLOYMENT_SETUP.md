# 🚀 Complete Deployment Setup Guide

## 📦 Deployment Architecture

```
┌─────────────────────────────────────────┐
│  Repository: prime-sms-hub             │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Frontend │  │  Backend │  │ Admin  ││
│  │ (Netlify)│  │ (Vercel) │  │(Netlify)││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

---

## 1️⃣ **Frontend Deployment (Netlify)**

### Configuration
- **File**: `netlify.toml` (at repository root)
- **Publish Directory**: `frontend`
- **Build Command**: None (static site)

### Steps:
1. **Connect Repository to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select branch: `main`

2. **Configure Build Settings**:
   - **Base directory**: Leave empty (or `.`)
   - **Publish directory**: `frontend`
   - **Build command**: Leave empty

3. **Environment Variables** (if needed):
   - Go to **Site settings** → **Environment variables**
   - Add any frontend environment variables

4. **Deploy**:
   - Netlify will auto-deploy on every push to `main`
   - Your frontend will be live at: `https://your-site.netlify.app`

---

## 2️⃣ **Backend Deployment (Vercel)**

### Configuration
- **File**: `backend/vercel.json`
- **Runtime**: Python 3.11
- **Framework**: Django

### Steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Backend**:
   ```bash
   cd backend
   vercel
   ```
   - Follow prompts:
     - Link to existing project? **No** (first time)
     - Project name: `prime-sms-hub-backend`
     - Directory: `./` (current directory)
     - Override settings? **No**

4. **Set Environment Variables** (Vercel Dashboard):
   Go to your project → **Settings** → **Environment Variables**
   
   Add these variables:
   ```env
   DJANGO_SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-vercel-url.vercel.app,your-custom-domain.com
   
   # Firebase
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_PROJECT_ID=your-project-id
   
   # Paystack
   PAYSTACK_SECRET_KEY=sk_live_your_secret_key
   PAYSTACK_PUBLIC_KEY=pk_live_your_public_key
   
   # 5SIM
   FIVESIM_API_KEY=your-5sim-api-key
   FIVESIM_API_URL=https://5sim.net/v1
   
   # SendGrid
   SENDGRID_API_KEY=SG.your-sendgrid-key
   DEFAULT_FROM_EMAIL=noreply@yourdomain.com
   
   # Telegram
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
   TELEGRAM_WEBHOOK_SECRET=your-webhook-secret
   
   # Admin
   ADMIN_DASHBOARD_SECRET=your-admin-secret
   
   # Database (Vercel Postgres or external)
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   # OR use SQLite for development (not recommended for production)
   ```

5. **Run Migrations** (First deployment):
   ```bash
   vercel env pull .env.local
   # Then run migrations
   python manage.py migrate
   ```

6. **Create Superuser** (First deployment):
   ```bash
   python manage.py createsuperuser
   ```

7. **Production Deployment**:
   ```bash
   vercel --prod
   ```

8. **Your API will be live at**: `https://your-backend.vercel.app/api/`

---

## 3️⃣ **Admin Panel Deployment (Netlify - Separate Site)**

### Option A: Separate Netlify Site (Recommended)

1. **Create New Netlify Site**:
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect same GitHub repository
   - Select branch: `main`

2. **Configure Build Settings**:
   - **Base directory**: Leave empty
   - **Publish directory**: `admin`
   - **Build command**: Leave empty

3. **Custom Domain** (Optional):
   - Use subdomain: `admin.yourdomain.com`
   - Or separate domain: `admin-primesmshub.netlify.app`

4. **Environment Variables**:
   - Add `API_BASE_URL` pointing to your Vercel backend:
     ```
     API_BASE_URL=https://your-backend.vercel.app/api
     ```

### Option B: Same Netlify Site (Subdirectory)

If you want admin on the same domain:
- Deploy frontend normally
- Admin will be at: `https://your-site.netlify.app/admin/`
- Update `admin/js/backend-api.js` to use correct API base URL

---

## 🔗 **Connecting Frontend to Backend**

### Update Frontend API Configuration

1. **Edit `frontend/js/backend-api.js`**:
   ```javascript
   const API_BASE_URL = 'https://your-backend.vercel.app/api';
   ```

2. **Or use environment variable** (in Netlify):
   - Add `API_BASE_URL` in Netlify environment variables
   - Update `backend-api.js` to read from environment

---

## 🔗 **Connecting Admin to Backend**

### Update Admin API Configuration

1. **Edit `admin/js/backend-api.js`**:
   ```javascript
   const API_BASE_URL = 'https://your-backend.vercel.app/api';
   ```

2. **Or use environment variable** (in Netlify):
   - Add `API_BASE_URL` in Netlify environment variables
   - Update `backend-api.js` to read from environment

---

## 📋 **Deployment Checklist**

### Frontend (Netlify)
- [ ] Repository connected to Netlify
- [ ] Publish directory set to `frontend`
- [ ] Environment variables configured (if any)
- [ ] Custom domain configured (optional)
- [ ] Auto-deploy enabled

### Backend (Vercel)
- [ ] Vercel CLI installed and logged in
- [ ] Backend deployed to Vercel
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Superuser created
- [ ] API endpoints tested
- [ ] CORS configured for frontend domain

### Admin (Netlify)
- [ ] Separate Netlify site created (or subdirectory configured)
- [ ] Publish directory set to `admin`
- [ ] API base URL configured
- [ ] Admin login tested

---

## 🔧 **Troubleshooting**

### Backend Issues

**Problem**: 500 errors on Vercel
- **Solution**: Check Vercel function logs
- Ensure all environment variables are set
- Check `ALLOWED_HOSTS` includes your Vercel domain

**Problem**: Database connection errors
- **Solution**: Use Vercel Postgres or external database
- SQLite won't work on Vercel (read-only filesystem)

**Problem**: Static files not loading
- **Solution**: Configure `STATIC_URL` and `STATIC_ROOT` in settings
- Use Vercel's static file handling

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check CORS settings in backend
- Verify `API_BASE_URL` is correct
- Check browser console for errors

**Problem**: 404 errors on routes
- **Solution**: Ensure SPA redirects are configured in `netlify.toml`

### Admin Issues

**Problem**: Admin can't connect to backend
- **Solution**: Verify `API_BASE_URL` in admin config
- Check CORS allows admin domain
- Verify admin authentication endpoint works

---

## 🌐 **Final URLs**

After deployment, you'll have:

- **Frontend**: `https://your-frontend.netlify.app`
- **Backend API**: `https://your-backend.vercel.app/api`
- **Admin Panel**: `https://your-admin.netlify.app` (or `https://your-frontend.netlify.app/admin`)

---

## 📝 **Next Steps**

1. Deploy backend to Vercel
2. Deploy frontend to Netlify
3. Deploy admin to Netlify (separate site)
4. Update API URLs in frontend and admin
5. Test all functionality
6. Configure custom domains (optional)

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# 🚀 Vercel Backend Deployment Guide

## ✅ What's Configured

1. **`backend/vercel.json`** - Vercel configuration file
2. **`backend/api/wsgi.py`** - WSGI entry point for Vercel
3. **Django settings** - Ready for production

---

## 📋 Deployment Steps

### ⚠️ **IMPORTANT: Choose Your Method**

**Method 1: GitHub Integration (Recommended - No Node.js needed)** ✅
- See `VERCEL_DEPLOYMENT_ALTERNATIVE.md` for detailed steps
- Go to Vercel Dashboard → Import from GitHub
- Set Root Directory to `backend`
- Add environment variables
- Deploy!

**Method 2: Vercel CLI (Requires Node.js)**

### Step 1: Install Node.js (if not installed)
- Download from: https://nodejs.org/
- Install LTS version
- Restart terminal

### Step 2: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 3: Login to Vercel
```bash
vercel login
```

### Step 4: Deploy Backend
```bash
cd backend
vercel
```

Follow the prompts:
- **Link to existing project?** → **No** (first time)
- **Project name?** → `prime-sms-hub-backend`
- **Directory?** → `./` (current directory)
- **Override settings?** → **No**

### Step 4: Set Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → **Settings** → **Environment Variables**

Add these **REQUIRED** variables:

```env
# Django
SECRET_KEY=your-very-long-random-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.vercel.app,*.vercel.app

# CORS (add your frontend and admin URLs)
CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app,https://your-admin.netlify.app

# Firebase
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

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
ADMIN_DASHBOARD_SECRET=your-secure-admin-secret

# Database (IMPORTANT: Vercel doesn't support SQLite)
# Use Vercel Postgres or external database
DATABASE_URL=postgresql://user:password@host:port/dbname
# OR configure PostgreSQL manually:
# DB_ENGINE=django.db.backends.postgresql
# DB_NAME=your_db_name
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# DB_HOST=your_db_host
# DB_PORT=5432
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

---

## ⚠️ Important Notes

### Database
- **SQLite won't work on Vercel** (read-only filesystem)
- **Use Vercel Postgres** or external PostgreSQL database
- Update `DATABASE_URL` in environment variables

### Static Files
- Vercel handles static files automatically
- No need to run `collectstatic` manually

### Migrations
- Run migrations after first deployment:
  ```bash
  vercel env pull .env.local
  python manage.py migrate
  ```

### Create Superuser
- Create admin user after deployment:
  ```bash
  python manage.py createsuperuser
  ```

---

## 🔗 Your API URLs

After deployment:
- **Production**: `https://your-backend.vercel.app/api/`
- **Preview**: `https://your-backend-*.vercel.app/api/`

Test endpoints:
- Health: `https://your-backend.vercel.app/api/health/`
- Firebase Config: `https://your-backend.vercel.app/api/firebase-config/`

---

## 🔧 Troubleshooting

### 500 Errors
- Check Vercel function logs
- Verify all environment variables are set
- Check `ALLOWED_HOSTS` includes your Vercel domain

### CORS Errors
- Add frontend/admin URLs to `CORS_ALLOWED_ORIGINS`
- Format: `https://domain1.com,https://domain2.com`

### Database Errors
- Ensure `DATABASE_URL` is set correctly
- Use PostgreSQL, not SQLite
- Check database connection from Vercel

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

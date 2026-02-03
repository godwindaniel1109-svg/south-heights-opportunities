# 🔑 Vercel Environment Variables - Complete List

Copy and paste these into Vercel Dashboard → Settings → Environment Variables

---

## ✅ **REQUIRED Variables**

### Django Core
```env
SECRET_KEY=your-very-long-random-secret-key-minimum-50-characters
DEBUG=False
ALLOWED_HOSTS=your-app.vercel.app,*.vercel.app,your-custom-domain.com
```

### CORS Configuration
```env
CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app,https://your-admin.netlify.app
```

### Database (IMPORTANT: Use PostgreSQL, NOT SQLite)
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
```
**OR** configure manually:
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
```

---

## 🔥 **Firebase Configuration**

```env
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

---

## 💳 **Paystack Configuration**

```env
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key_here
PAYSTACK_SECRET_KEY=sk_live_your_secret_key_here
```

---

## 📱 **5SIM API Configuration**

```env
FIVESIM_API_KEY=your_5sim_api_key_here
FIVESIM_API_URL=https://5sim.net/v1
```

---

## 📧 **SendGrid Email Configuration**

```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

---

## 🤖 **Telegram Bot Configuration**

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=123456789
TELEGRAM_WEBHOOK_SECRET=your_secure_webhook_secret_here
```

---

## 👨‍💼 **Admin Dashboard Configuration**

```env
ADMIN_DASHBOARD_SECRET=your_secure_admin_secret_here
```

---

## 📋 **Quick Copy-Paste Template**

Copy this entire block and fill in your values:

```env
# Django Core
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.vercel.app,*.vercel.app

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app,https://your-admin.netlify.app

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Firebase
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Paystack
PAYSTACK_PUBLIC_KEY=pk_live_your_key
PAYSTACK_SECRET_KEY=sk_live_your_key

# 5SIM
FIVESIM_API_KEY=your-5sim-key
FIVESIM_API_URL=https://5sim.net/v1

# SendGrid
SENDGRID_API_KEY=SG.your-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_CHAT_ID=your-chat-id
TELEGRAM_WEBHOOK_SECRET=your-webhook-secret

# Admin
ADMIN_DASHBOARD_SECRET=your-admin-secret
```

---

## 📝 **How to Add in Vercel**

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter **Key** and **Value**
5. Select environment: **Production**, **Preview**, **Development** (or all)
6. Click **Save**
7. Repeat for each variable

---

## ⚠️ **Important Notes**

- **SECRET_KEY**: Generate a secure random string (minimum 50 characters)
  - You can use: `python -c "import secrets; print(secrets.token_urlsafe(50))"`
  
- **DATABASE_URL**: Must be PostgreSQL (SQLite won't work on Vercel)
  - Use Vercel Postgres or external PostgreSQL service
  
- **ALLOWED_HOSTS**: Include your Vercel domain (`*.vercel.app`)
  - Add custom domain if you have one
  
- **CORS_ALLOWED_ORIGINS**: Add your frontend and admin Netlify URLs
  - Format: `https://domain1.com,https://domain2.com`
  - No trailing slashes

---

## 🔒 **Security Tips**

- ✅ Never commit these values to Git
- ✅ Use different values for production and development
- ✅ Rotate secrets regularly
- ✅ Use strong, random values for secrets
- ✅ Keep this file private (don't commit with real values)

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

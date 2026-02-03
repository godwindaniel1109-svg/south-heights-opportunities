# 🔧 Vercel 500 Error - Fix Guide

## ❌ **The Problem**

You're getting:
```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

This is **very common** with Django on Vercel. Here's how to fix it:

---

## 🔍 **Common Causes**

### 1. **SQLite Database** (Most Common) ❌
- **Problem**: Vercel has a **read-only filesystem**
- **SQLite won't work** - it needs to write to disk
- **Solution**: Use PostgreSQL (Vercel Postgres or external)

### 2. **Missing Environment Variables**
- **Problem**: Required env vars not set
- **Solution**: Add all variables in Vercel dashboard

### 3. **Missing Dependencies**
- **Problem**: `psycopg2` not installed for PostgreSQL
- **Solution**: Added to `requirements.txt`

### 4. **Path Issues**
- **Problem**: WSGI can't find Django modules
- **Solution**: Fixed in `backend/api/wsgi.py`

---

## ✅ **Fixes Applied**

### Fix 1: Database Configuration
Updated `backend/prime_sms/settings.py` to:
- ✅ Use PostgreSQL when `DATABASE_URL` is set (Vercel)
- ✅ Fallback to SQLite for local development
- ✅ Auto-detect from environment

### Fix 2: Added PostgreSQL Driver
Added to `backend/requirements.txt`:
```
psycopg2-binary==2.9.9
```

---

## 🚀 **Step-by-Step Fix**

### Step 1: Set Up Vercel Postgres Database

1. **Go to Vercel Dashboard** → Your Project
2. Click **Storage** tab
3. Click **Create Database** → **Postgres**
4. Vercel will automatically create `DATABASE_URL` environment variable
5. **Done!** (No need to add manually)

**OR** use external PostgreSQL:
- Supabase (free): https://supabase.com/
- Neon (free): https://neon.tech/
- Railway (free): https://railway.app/

### Step 2: Add ALL Environment Variables

Go to **Vercel Dashboard** → **Settings** → **Environment Variables**

**REQUIRED Variables:**
```env
# Django Core
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.vercel.app,*.vercel.app

# Database (Auto-created if using Vercel Postgres)
DATABASE_URL=postgresql://user:pass@host:port/dbname

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app

# Firebase (all 6 values)
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

# Paystack
PAYSTACK_PUBLIC_KEY=...
PAYSTACK_SECRET_KEY=...

# 5SIM
FIVESIM_API_KEY=...
FIVESIM_API_URL=https://5sim.net/v1

# SendGrid
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=...

# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_CHAT_ID=...
TELEGRAM_WEBHOOK_SECRET=...

# Admin
ADMIN_DASHBOARD_SECRET=...
```

### Step 3: Run Migrations

After deploying, you need to run migrations:

**Option A: Using Vercel CLI** (if you have Node.js):
```bash
vercel env pull .env.local
cd backend
python manage.py migrate
```

**Option B: Using Vercel Dashboard**:
1. Go to **Deployments** tab
2. Click on latest deployment
3. Go to **Functions** tab
4. You can't run migrations directly, but you can:
   - Create a one-time migration script
   - Or use Vercel's Postgres dashboard to run SQL

**Option C: Create Migration Endpoint** (Recommended):
Add this to `backend/api/views.py`:
```python
@api_view(['POST'])
@permission_classes([AllowAny])
def run_migrations(request):
    """One-time migration endpoint (remove after first run)"""
    secret = request.data.get('secret')
    if secret != 'your-migration-secret':
        return Response({'error': 'Forbidden'}, status=403)
    from django.core.management import call_command
    from io import StringIO
    out = StringIO()
    call_command('migrate', stdout=out)
    return Response({'output': out.getvalue()})
```

Then call it once:
```bash
curl -X POST https://your-backend.vercel.app/api/run-migrations/ \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-migration-secret"}'
```

### Step 4: Redeploy

1. **Commit the fixes**:
   ```bash
   git add backend/prime_sms/settings.py backend/requirements.txt
   git commit -m "Fix Vercel deployment: PostgreSQL support"
   git push
   ```

2. **Vercel will auto-deploy**
3. **Check deployment logs** in Vercel dashboard

---

## 🔍 **Check Vercel Logs**

1. Go to **Vercel Dashboard** → Your Project
2. Click **Deployments** tab
3. Click on the failed deployment
4. Click **Functions** tab
5. Click on the function that failed
6. Check **Logs** tab

**Look for:**
- Database connection errors
- Missing environment variables
- Import errors
- Path errors

---

## 🆘 **Common Error Messages & Fixes**

### Error: "No such file or directory: db.sqlite3"
**Fix**: Database is now configured to use PostgreSQL when `DATABASE_URL` is set

### Error: "ModuleNotFoundError: No module named 'psycopg2'"
**Fix**: Added `psycopg2-binary==2.9.9` to requirements.txt

### Error: "django.core.exceptions.ImproperlyConfigured: SECRET_KEY"
**Fix**: Add `SECRET_KEY` to Vercel environment variables

### Error: "DisallowedHost"
**Fix**: Add your Vercel domain to `ALLOWED_HOSTS`:
```
ALLOWED_HOSTS=your-app.vercel.app,*.vercel.app
```

### Error: "Database connection failed"
**Fix**: 
- Verify `DATABASE_URL` is set in Vercel
- Check database is accessible
- Run migrations

---

## ✅ **Verification Checklist**

- [ ] Vercel Postgres database created (or external PostgreSQL)
- [ ] `DATABASE_URL` environment variable set
- [ ] All other environment variables added
- [ ] `psycopg2-binary` in requirements.txt
- [ ] Database migrations run
- [ ] `ALLOWED_HOSTS` includes Vercel domain
- [ ] `SECRET_KEY` is set
- [ ] Code pushed to GitHub
- [ ] Vercel redeployed
- [ ] Checked deployment logs

---

## 🧪 **Test After Fix**

1. **Health Check**:
   ```
   https://your-backend.vercel.app/api/health/
   ```
   Should return: `{"status": "ok", "message": "..."}`

2. **Firebase Config**:
   ```
   https://your-backend.vercel.app/api/firebase-config/
   ```
   Should return Firebase config

3. **Admin Stats** (with auth):
   ```
   https://your-backend.vercel.app/api/admin/stats/
   ```

---

## 📝 **Quick Fix Summary**

1. ✅ **Database**: Use PostgreSQL (Vercel Postgres)
2. ✅ **Dependencies**: Added `psycopg2-binary`
3. ✅ **Settings**: Auto-detect PostgreSQL from `DATABASE_URL`
4. ✅ **Environment**: Add all required variables
5. ✅ **Migrations**: Run after first deployment

---

**After these fixes, your backend should work on Vercel!** 🚀

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

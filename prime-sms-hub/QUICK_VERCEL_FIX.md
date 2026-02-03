# 🚨 Quick Fix for Vercel 500 Error

## ⚡ **Immediate Steps**

### 1. **Create Vercel Postgres Database** (5 minutes)

1. Go to **Vercel Dashboard** → Your Project
2. Click **Storage** tab
3. Click **Create Database** → **Postgres**
4. ✅ Vercel automatically creates `DATABASE_URL` environment variable

### 2. **Add Environment Variables** (10 minutes)

Go to **Vercel Dashboard** → **Settings** → **Environment Variables**

**Minimum Required:**
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.vercel.app,*.vercel.app
DATABASE_URL=postgresql://... (auto-created by Vercel Postgres)
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### 3. **Run Migrations** (After deployment)

**Option A: Using Vercel Postgres Dashboard**
1. Go to **Vercel Dashboard** → **Storage** → Your Postgres DB
2. Click **Data** tab
3. Tables will be created automatically on first request (if migrations run)

**Option B: Create Migration Endpoint** (Temporary)
Add to `backend/api/urls.py`:
```python
from .migrations_helper import run_migrations

urlpatterns = [
    # ... existing patterns ...
    path('migrate/', run_migrations, name='run_migrations'),  # TEMPORARY - remove after use
]
```

Then call once:
```bash
curl -X POST "https://your-backend.vercel.app/api/migrate/?secret=your-migration-secret" \
  -H "Content-Type: application/json"
```

**Then remove the endpoint!**

### 4. **Commit & Push**

```bash
git add backend/prime_sms/settings.py backend/requirements.txt
git commit -m "Fix Vercel: PostgreSQL support and psycopg2"
git push
```

Vercel will auto-deploy.

---

## 🔍 **Check Logs**

1. **Vercel Dashboard** → **Deployments** → Latest deployment
2. Click **Functions** → Click the function
3. Check **Logs** tab for errors

**Common errors you'll see:**
- `No such file or directory: db.sqlite3` → Database issue (fixed)
- `ModuleNotFoundError: psycopg2` → Missing dependency (fixed)
- `SECRET_KEY not set` → Add environment variable
- `DisallowedHost` → Add to ALLOWED_HOSTS

---

## ✅ **What Was Fixed**

1. ✅ **Database**: Now uses PostgreSQL when `DATABASE_URL` is set
2. ✅ **Dependencies**: Added `psycopg2-binary==2.9.9`
3. ✅ **Settings**: Auto-detects PostgreSQL from environment

---

## 🧪 **Test**

After deployment, test:
```
https://your-backend.vercel.app/api/health/
```

Should return: `{"status": "ok", "message": "..."}`

---

**See `VERCEL_500_ERROR_FIX.md` for detailed troubleshooting!**

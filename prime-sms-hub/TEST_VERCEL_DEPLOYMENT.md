# 🧪 Test Your Vercel Deployment

## 🔗 **Your Deployment URL**

```
https://prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app
```

**Note:** This looks like a **Preview Deployment** (not production). That's fine for testing!

---

## ✅ **Test Endpoints**

### **1. Health Check** (Should work without auth)
```
https://prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app/api/health/
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Prime SMS Hub Backend is running"
}
```

### **2. Firebase Config** (Should work without auth)
```
https://prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app/api/firebase-config/
```

**Expected Response:**
```json
{
  "apiKey": "...",
  "authDomain": "...",
  ...
}
```

---

## ❌ **Common Errors & Fixes**

### **Error 1: 500 Internal Server Error**

**Possible Causes:**
1. **Missing SECRET_KEY** → Add to Vercel environment variables
2. **Database not set up** → Create Vercel Postgres database
3. **Missing other environment variables** → Add all required vars

**Fix:**
- Check Vercel Dashboard → **Deployments** → Click on deployment → **Functions** → Check **Logs**

### **Error 2: 404 Not Found**

**Possible Causes:**
- Wrong URL path
- Routes not configured correctly

**Fix:**
- Make sure you're using `/api/health/` (with trailing slash)
- Check `backend/vercel.json` routes are correct

### **Error 3: DisallowedHost**

**Error Message:**
```
Invalid HTTP_HOST header: 'prime-sms-jaqjbvp59...vercel.app'
```

**Fix:**
- Add your Vercel domain to `ALLOWED_HOSTS`:
  ```
  prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app,*.vercel.app
  ```

### **Error 4: Database Connection Error**

**Error Message:**
```
django.db.utils.OperationalError: could not connect to server
```

**Fix:**
- Create Vercel Postgres database
- Make sure `DATABASE_URL` is set automatically
- Run migrations (see below)

---

## 🔍 **Check Deployment Logs**

1. **Go to Vercel Dashboard** → Your Project
2. **Click Deployments** tab
3. **Click on the latest deployment** (the one with your URL)
4. **Click Functions** tab
5. **Click on the function** (usually `api/wsgi.py`)
6. **Check Logs** tab

**Look for:**
- ❌ Red errors (these tell you what's wrong)
- ⚠️ Yellow warnings
- ✅ Green success messages

---

## 🚀 **Quick Fixes**

### **Fix 1: Add ALLOWED_HOSTS for Preview Deployments**

In Vercel Environment Variables:
- **Key**: `ALLOWED_HOSTS`
- **Value**: `prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app,*.vercel.app`
- **Environment**: ☑ Production, ☑ Preview, ☑ Development

### **Fix 2: Check All Environment Variables**

Make sure these are set for **Preview** environment:
- `SECRET_KEY`
- `DEBUG` (set to `False`)
- `ALLOWED_HOSTS` (with `*.vercel.app`)

### **Fix 3: Create Database**

1. **Vercel Dashboard** → Your Project → **Storage** tab
2. **Create Database** → **Postgres**
3. `DATABASE_URL` will be auto-created
4. **Redeploy** your app

---

## 🧪 **Test in Browser**

1. **Open browser**
2. **Visit**: `https://prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app/api/health/`
3. **Check what you see:**
   - ✅ JSON response → Working!
   - ❌ Error page → Check logs
   - ⏳ Loading forever → Check logs

---

## 📝 **What Error Are You Seeing?**

Please tell me:
1. **What error message** do you see? (500, 404, etc.)
2. **Where do you see it?** (Browser, logs, etc.)
3. **What does the response say?** (Copy the error text)

Then I can help you fix it specifically! 🚀

---

## ✅ **Expected Working Response**

When you visit `/api/health/`, you should see:

```json
{
  "status": "ok",
  "message": "Prime SMS Hub Backend is running"
}
```

If you see this, **your backend is working!** 🎉

# 🔧 Fix Preview Deployment Error

## 🔗 **Your Preview URL**

```
https://prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app
```

This is a **Preview Deployment** (not production). That's fine, but you need to configure it!

---

## ❌ **Most Common Error: DisallowedHost**

If you see this error:
```
Invalid HTTP_HOST header: 'prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app'
```

**This means `ALLOWED_HOSTS` doesn't include your preview URL!**

---

## ✅ **Fix: Update ALLOWED_HOSTS**

### **Step 1: Go to Environment Variables**

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

### **Step 2: Edit ALLOWED_HOSTS**

1. **Find `ALLOWED_HOSTS`** in the list
2. **Click 3 dots (⋯)** → **Edit**
3. **Update the Value** to include `*.vercel.app`:

   **Current (probably):**
   ```
   your-production-domain.vercel.app
   ```

   **Change to:**
   ```
   prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app,*.vercel.app
   ```

   **OR** (better - works for all deployments):
   ```
   *.vercel.app
   ```

4. **Check Environments:**
   - ☑ **Production**
   - ☑ **Preview** ← **IMPORTANT!**
   - ☑ **Development**

5. **Click Save**

---

## 🎯 **Recommended ALLOWED_HOSTS Value**

For maximum compatibility, use:
```
*.vercel.app
```

This allows **all** Vercel preview and production deployments to work!

---

## 🔄 **After Updating**

1. **Redeploy:**
   - Go to **Deployments** tab
   - Click **3 dots (⋯)** on latest deployment
   - Click **Redeploy**

2. **Wait 1-2 minutes**

3. **Test again:**
   ```
   https://prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app/api/health/
   ```

---

## 🧪 **Test Your Deployment**

### **Option 1: Browser**
1. Open browser
2. Visit: `https://prime-sms-jaqjbvp59-godwin-daniels-projects-465b0742.vercel.app/api/health/`
3. You should see:
   ```json
   {
     "status": "ok",
     "message": "Prime SMS Hub Backend is running"
   }
   ```

### **Option 2: Check Logs**
1. **Vercel Dashboard** → **Deployments** → Latest deployment
2. **Functions** → Click function → **Logs**
3. Look for errors (red text)

---

## 📋 **Complete Checklist**

Make sure these are set for **Preview** environment:

- [ ] `SECRET_KEY` → Set and enabled for Preview
- [ ] `DEBUG` → Set to `False` and enabled for Preview
- [ ] `ALLOWED_HOSTS` → Set to `*.vercel.app` and enabled for Preview
- [ ] `DATABASE_URL` → Auto-created if you have Postgres (should work for all environments)

---

## 🆘 **Other Common Errors**

### **Error: 500 Internal Server Error**

**Check:**
1. **Logs** in Vercel Dashboard
2. **All environment variables** are set for Preview
3. **Database** is created and `DATABASE_URL` exists

### **Error: ModuleNotFoundError**

**Fix:**
- Make sure `requirements.txt` includes all dependencies
- Redeploy (Vercel will reinstall packages)

### **Error: Database Connection Failed**

**Fix:**
1. **Create Vercel Postgres** database
2. `DATABASE_URL` will be auto-created
3. **Redeploy**

---

## ✅ **Quick Fix Summary**

1. **Edit `ALLOWED_HOSTS`** → Set to `*.vercel.app`
2. **Enable for Preview** environment
3. **Redeploy**
4. **Test** the URL again

---

**After this fix, your preview deployment should work!** 🚀

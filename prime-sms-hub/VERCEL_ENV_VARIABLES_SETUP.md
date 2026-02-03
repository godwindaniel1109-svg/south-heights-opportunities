# 🔧 Step-by-Step: Adding Environment Variables to Vercel

## 📍 **Where to Add Variables**

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on **your project** (the one you deployed)
3. Click **Settings** tab (top menu)
4. Click **Environment Variables** (left sidebar)

---

## ✅ **Step-by-Step: Adding Each Variable**

### **Step 1: Find Your Vercel App URL**

1. In Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Look at the top - you'll see your app URL like:
   ```
   https://prime-sms-hub-backend-abc123.vercel.app
   ```
   OR if you have a custom domain:
   ```
   https://api.primesmshub.com
   ```

**Copy this URL** - you'll need it!

---

### **Step 2: Generate SECRET_KEY**

**Option A: Using Python (Recommended)**
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

**Option B: Using PowerShell (Windows)**
```powershell
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

**Option C: Online Generator**
- Go to: https://djecrety.ir/
- Click "Generate Secret Key"
- Copy the generated key

**Example output:**
```
xK9mP2qR5vT8wY1zA4bC7dE0fG3hI6jK9lM2nO5pQ8rS1tU4vW7xY0zA3bC6dE9f
```

**This is your SECRET_KEY** - copy it!

---

### **Step 3: Add Variables to Vercel**

In **Vercel Dashboard** → **Settings** → **Environment Variables**, click **Add New**

#### **Variable 1: SECRET_KEY**

1. **Key**: `SECRET_KEY`
2. **Value**: Paste the key you generated (the long random string)
3. **Environment**: Select **Production**, **Preview**, and **Development** (or just **Production**)
4. Click **Save**

**Example:**
```
Key: SECRET_KEY
Value: xK9mP2qR5vT8wY1zA4bC7dE0fG3hI6jK9lM2nO5pQ8rS1tU4vW7xY0zA3bC6dE9f
```

---

#### **Variable 2: DEBUG**

1. **Key**: `DEBUG`
2. **Value**: `False` (exactly like this, capital F)
3. **Environment**: Select **Production** (and Preview if you want)
4. Click **Save**

**Example:**
```
Key: DEBUG
Value: False
```

**Note:** For local development, you can set this to `True`, but for production (Vercel), always use `False`

---

#### **Variable 3: ALLOWED_HOSTS**

1. **Key**: `ALLOWED_HOSTS`
2. **Value**: Your Vercel app URL (without `https://`)
   - If your URL is: `https://prime-sms-hub-backend-abc123.vercel.app`
   - Use: `prime-sms-hub-backend-abc123.vercel.app,*.vercel.app`
3. **Environment**: Select **Production** (and Preview)
4. Click **Save**

**Example 1 (Vercel default domain):**
```
Key: ALLOWED_HOSTS
Value: prime-sms-hub-backend-abc123.vercel.app,*.vercel.app
```

**Example 2 (Custom domain):**
```
Key: ALLOWED_HOSTS
Value: api.primesmshub.com,primesmshub.com,*.vercel.app
```

**Why `*.vercel.app`?**
- This allows Vercel preview deployments to work
- `*` means "any subdomain"

---

## 📸 **Visual Guide**

### **What You'll See in Vercel:**

```
┌─────────────────────────────────────────┐
│ Environment Variables                    │
├─────────────────────────────────────────┤
│ Key              │ Value                 │
├──────────────────┼───────────────────────┤
│ SECRET_KEY       │ xK9mP2qR5vT8wY1zA... │
│ DEBUG            │ False                  │
│ ALLOWED_HOSTS    │ your-app.vercel.app...│
└─────────────────────────────────────────┘
```

---

## 🎯 **Complete Example**

Let's say your Vercel app URL is:
```
https://prime-sms-hub-backend-xyz789.vercel.app
```

**Your environment variables should be:**

| Key | Value |
|-----|-------|
| `SECRET_KEY` | `xK9mP2qR5vT8wY1zA4bC7dE0fG3hI6jK9lM2nO5pQ8rS1tU4vW7xY0zA3bC6dE9f` |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `prime-sms-hub-backend-xyz789.vercel.app,*.vercel.app` |

---

## ✅ **Quick Checklist**

- [ ] Found my Vercel app URL
- [ ] Generated SECRET_KEY (using Python or online)
- [ ] Added SECRET_KEY to Vercel
- [ ] Added DEBUG = False to Vercel
- [ ] Added ALLOWED_HOSTS with my app URL to Vercel
- [ ] Selected "Production" environment for all variables
- [ ] Clicked "Save" for each variable

---

## 🔄 **After Adding Variables**

1. **Redeploy** your app:
   - Go to **Deployments** tab
   - Click the **3 dots** (⋯) on latest deployment
   - Click **Redeploy**
   - OR just push a new commit to trigger auto-deploy

2. **Wait for deployment** to complete (1-2 minutes)

3. **Test** your API:
   ```
   https://your-app.vercel.app/api/health/
   ```

---

## 🆘 **Troubleshooting**

### "I can't find my Vercel app URL"
- Go to **Deployments** tab
- Click on any deployment
- Look at the top - the URL is shown there
- OR check your project settings → **Domains**

### "Where do I generate SECRET_KEY?"
- Use Python: `python -c "import secrets; print(secrets.token_urlsafe(50))"`
- OR use: https://djecrety.ir/

### "What if I don't have Python?"
- Use online generator: https://djecrety.ir/
- OR use any random long string (at least 50 characters)

### "Should I use Production, Preview, or Development?"
- **Production**: For your live app (required)
- **Preview**: For preview deployments (optional but recommended)
- **Development**: For local dev (optional)

**Minimum**: Just select **Production**

---

## 📝 **Summary**

1. **SECRET_KEY**: Long random string (generate with Python)
2. **DEBUG**: `False` (exactly like this)
3. **ALLOWED_HOSTS**: Your Vercel app domain + `,*.vercel.app`

**That's it!** After adding these 3 variables and redeploying, your app should work! 🚀

---

**Need more help?** Check `VERCEL_500_ERROR_FIX.md` for detailed troubleshooting!

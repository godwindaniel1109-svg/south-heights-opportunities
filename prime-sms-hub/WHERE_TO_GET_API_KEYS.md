# 🔑 Where to Get Your API Keys

Complete guide on where to find/obtain each API key for your Vercel deployment.

---

## 1️⃣ **SECRET_KEY** (Django)

### Generate a new secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

**OR** use online generator:
- https://djecrety.ir/ (Django secret key generator)

**Copy the generated key** → Use as `SECRET_KEY` in Vercel

---

## 2️⃣ **Firebase Keys**

### Where to get:
1. Go to: https://console.firebase.google.com/
2. **Create a project** (or select existing)
3. Click **⚙️ Settings** (gear icon) → **Project settings**
4. Scroll to **"Your apps"** section
5. Click **Web icon** (`</>`) to add web app
6. Register your app (give it a name)
7. **Copy the config object**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // ← FIREBASE_API_KEY
  authDomain: "your-project.firebaseapp.com",        // ← FIREBASE_AUTH_DOMAIN
  projectId: "your-project-id",                     // ← FIREBASE_PROJECT_ID
  storageBucket: "your-project.appspot.com",        // ← FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789012",                 // ← FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789012:web:abcdefghijklmnop"      // ← FIREBASE_APP_ID
};
```

**Enable these services:**
- ✅ Authentication (Email/Password)
- ✅ Firestore Database
- ✅ Storage

---

## 3️⃣ **Paystack Keys**

### Where to get:
1. Go to: https://dashboard.paystack.com/
2. **Sign up** or **Login**
3. Click **Settings** → **API Keys & Webhooks**
4. You'll see:
   - **Public Key** (starts with `pk_test_` or `pk_live_`) → `PAYSTACK_PUBLIC_KEY`
   - **Secret Key** (starts with `sk_test_` or `sk_live_`) → `PAYSTACK_SECRET_KEY`

**Important:**
- Use **Test keys** for development
- Use **Live keys** for production
- Copy both keys

---

## 4️⃣ **5SIM API Key**

### Where to get:
1. Go to: https://5sim.net/
2. **Sign up** or **Login**
3. Go to **Profile** → **API** section
4. Click **"Generate API Key"** or copy existing key
5. Copy the key → Use as `FIVESIM_API_KEY`

**Note:** You may need to fund your 5SIM account to use the API

---

## 5️⃣ **SendGrid API Key**

### Where to get:
1. Go to: https://app.sendgrid.com/
2. **Sign up** (free tier available)
3. Go to **Settings** → **API Keys**
4. Click **"Create API Key"**
5. Give it a name (e.g., "Prime SMS Hub")
6. Select **"Full Access"** or **"Restricted Access"** (with Mail Send permission)
7. **Copy the key** (starts with `SG.`) → Use as `SENDGRID_API_KEY`

**Also set:**
- `SENDGRID_FROM_EMAIL` = Your verified sender email
- `DEFAULT_FROM_EMAIL` = Same as above

**Verify sender:**
- Go to **Settings** → **Sender Authentication**
- Verify your email or domain

---

## 6️⃣ **Telegram Bot Keys**

### Where to get:

#### A. Bot Token:
1. Open Telegram app (mobile or desktop)
2. Search for **@BotFather**
3. Start a chat and send: `/newbot`
4. Follow prompts:
   - Bot name: `Prime SMS Hub Support Bot`
   - Bot username: `primesmshub_support_bot` (must end with `_bot`)
5. BotFather will give you a **token** (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)
6. Copy token → Use as `TELEGRAM_BOT_TOKEN`

#### B. Admin Chat ID (Easiest Method):
1. Search for **@userinfobot** on Telegram
2. Start a chat with it
3. It will show your **Chat ID** (a number like `123456789`)
4. Copy this number → Use as `TELEGRAM_ADMIN_CHAT_ID`

**Alternative Method:**
1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for `"chat":{"id":123456789}` in the response
4. Copy the ID

#### C. Webhook Secret:
- Generate a secure random string:
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
- Use as `TELEGRAM_WEBHOOK_SECRET`

**After getting keys, see `TELEGRAM_BOT_SETUP.md` for complete setup instructions!**

---

## 7️⃣ **ADMIN_DASHBOARD_SECRET**

### Generate:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**OR** use any secure random string (minimum 32 characters)

---

## 8️⃣ **DATABASE_URL** (PostgreSQL)

### Option A: Vercel Postgres (Easiest)
1. Go to Vercel Dashboard
2. Your Project → **Storage** tab
3. Click **"Create Database"** → **Postgres**
4. Vercel will automatically create `DATABASE_URL` environment variable
5. **Done!** (No need to add manually)

### Option B: External PostgreSQL
1. Use services like:
   - **Supabase** (free tier): https://supabase.com/
   - **Neon** (free tier): https://neon.tech/
   - **Railway** (free tier): https://railway.app/
   - **ElephantSQL** (free tier): https://www.elephantsql.com/

2. Create database
3. Get connection string (format: `postgresql://user:password@host:port/dbname`)
4. Use as `DATABASE_URL`

---

## 9️⃣ **CORS_ALLOWED_ORIGINS**

### Format:
```
https://your-frontend.netlify.app,https://your-admin.netlify.app
```

**Where to get:**
- After deploying frontend to Netlify → Copy the URL
- After deploying admin to Netlify → Copy the URL
- Add both URLs separated by comma (no spaces)

**Example:**
```
https://primesmshub.netlify.app,https://admin-primesmshub.netlify.app
```

---

## 🔟 **ALLOWED_HOSTS**

### Format:
```
your-app.vercel.app,*.vercel.app,your-custom-domain.com
```

**Where to get:**
- After deploying to Vercel → Your app URL will be: `your-project.vercel.app`
- Add `*.vercel.app` to allow all Vercel preview deployments
- Add custom domain if you have one

**Example:**
```
prime-sms-hub-backend.vercel.app,*.vercel.app,api.yourdomain.com
```

---

## 📋 **Quick Checklist**

- [ ] **SECRET_KEY** - Generated using Python command
- [ ] **Firebase** - From Firebase Console → Project Settings
- [ ] **Paystack** - From Paystack Dashboard → API Keys
- [ ] **5SIM** - From 5SIM.net → Profile → API
- [ ] **SendGrid** - From SendGrid Dashboard → API Keys
- [ ] **Telegram** - From @BotFather (bot token + chat ID)
- [ ] **ADMIN_DASHBOARD_SECRET** - Generated random string
- [ ] **DATABASE_URL** - From Vercel Postgres or external provider
- [ ] **CORS_ALLOWED_ORIGINS** - Your Netlify URLs
- [ ] **ALLOWED_HOSTS** - Your Vercel domain

---

## 🆘 **Need Help?**

### Can't find a key?
- Check the service's documentation
- Look in Settings/Profile/API sections
- Contact service support

### Key not working?
- Verify you copied the entire key (no spaces)
- Check if key is for correct environment (test vs live)
- Ensure service account has proper permissions

---

## 🔒 **Security Reminders**

- ✅ **Never share** your keys publicly
- ✅ **Never commit** keys to Git
- ✅ Use **different keys** for development and production
- ✅ **Rotate keys** regularly
- ✅ Use **strong, random** values for secrets

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

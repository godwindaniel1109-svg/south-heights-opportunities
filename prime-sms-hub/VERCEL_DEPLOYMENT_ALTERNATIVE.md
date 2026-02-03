# 🚀 Vercel Deployment - Alternative Methods

## ❌ Problem
`npm` is not recognized because **Node.js is not installed** on your system.

---

## ✅ Solution Options

### **Option 1: Install Node.js (Recommended)**

1. **Download Node.js**:
   - Go to: https://nodejs.org/
   - Download the **LTS version** (Long Term Support)
   - Choose **Windows Installer (.msi)** for 64-bit

2. **Install Node.js**:
   - Run the downloaded `.msi` file
   - Follow the installation wizard
   - ✅ Check "Add to PATH" during installation
   - Complete the installation

3. **Restart PowerShell/Terminal**:
   - Close and reopen your terminal
   - Verify installation:
     ```powershell
     node --version
     npm --version
     ```

4. **Install Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

5. **Deploy**:
   ```powershell
   cd backend
   vercel login
   vercel
   ```

---

### **Option 2: Deploy via GitHub (No CLI Needed)** ✅ **EASIEST**

You don't need Node.js or Vercel CLI! Deploy directly from GitHub:

#### Step 1: Push Your Code to GitHub
```powershell
git add .
git commit -m "Add Vercel backend configuration"
git push
```

#### Step 2: Connect to Vercel via GitHub
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository: `godwindaniel1109-svg/prime-sms-hub`
5. Click **"Import"**

#### Step 3: Configure Project
- **Framework Preset**: Select **"Other"** or **"Django"**
- **Root Directory**: Click **"Edit"** and set to: `backend`
- **Build Command**: Leave empty (or `echo "No build needed"`)
- **Output Directory**: Leave empty
- **Install Command**: Leave empty

#### Step 4: Set Environment Variables
Click **"Environment Variables"** and add all your variables:
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=*.vercel.app
CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app
FIREBASE_API_KEY=...
PAYSTACK_SECRET_KEY=...
# ... (all other variables)
```

#### Step 5: Deploy
- Click **"Deploy"**
- Vercel will automatically:
  - Detect `backend/vercel.json`
  - Use `backend/api/wsgi.py` as entry point
  - Deploy your Django backend

#### Step 6: Auto-Deploy
- Every push to `main` branch will auto-deploy
- Preview deployments for pull requests

---

### **Option 3: Use Vercel Web Interface**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. **Import from Git** → Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Framework**: Other
5. Add environment variables
6. Deploy!

---

## 🎯 **Recommended: Option 2 (GitHub Integration)**

**Why?**
- ✅ No Node.js installation needed
- ✅ No CLI commands needed
- ✅ Automatic deployments on every push
- ✅ Preview deployments for PRs
- ✅ Easy to manage from web interface
- ✅ Free for personal projects

---

## 📋 Quick Steps (GitHub Method)

1. ✅ **Push code to GitHub** (already done!)
2. ✅ **Go to Vercel Dashboard**
3. ✅ **Import from GitHub**
4. ✅ **Set Root Directory to `backend`**
5. ✅ **Add environment variables**
6. ✅ **Deploy!**

---

## 🔗 After Deployment

Your backend will be live at:
- **Production**: `https://your-project.vercel.app/api/`
- **Preview**: `https://your-project-*.vercel.app/api/`

Test it:
- Health: `https://your-project.vercel.app/api/health/`
- Firebase Config: `https://your-project.vercel.app/api/firebase-config/`

---

## ⚠️ Important Notes

### Database
- **SQLite won't work on Vercel** (read-only filesystem)
- Use **Vercel Postgres** or external PostgreSQL
- Add `DATABASE_URL` in environment variables

### Environment Variables
- Set ALL variables in Vercel dashboard
- They're encrypted and secure
- Available to your Django app automatically

### CORS
- Add your frontend/admin URLs to `CORS_ALLOWED_ORIGINS`
- Format: `https://domain1.com,https://domain2.com`

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Check `ALLOWED_HOSTS` includes `*.vercel.app`
4. Ensure database is configured (not SQLite)

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# 🎛️ Admin Panel Deployment Guide

## 📦 Deployment Options

You have **2 options** for deploying the admin panel:

### Option 1: Separate Netlify Site (Recommended) ✅
- **URL**: `https://admin-primesmshub.netlify.app`
- **Pros**: Isolated, separate domain, easier to manage
- **Cons**: Requires separate Netlify site

### Option 2: Same Netlify Site (Subdirectory)
- **URL**: `https://your-frontend.netlify.app/admin/`
- **Pros**: Same domain, simpler setup
- **Cons**: Mixed with frontend

---

## 🚀 Option 1: Separate Netlify Site (Recommended)

### Step 1: Create New Netlify Site
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Select branch: `main`

### Step 2: Configure Build Settings
- **Base directory**: Leave empty (or `.`)
- **Publish directory**: `admin`
- **Build command**: Leave empty

### Step 3: Set Environment Variables
Go to **Site settings** → **Environment variables**

Add:
```env
API_BASE_URL=https://your-backend.vercel.app/api
```

### Step 4: Deploy
- Netlify will auto-deploy on every push
- Your admin will be live at: `https://your-admin-site.netlify.app`

### Step 5: Update Admin API Configuration
Edit `admin/js/backend-api.js`:
```javascript
// Update this line:
const API_BASE_URL = process.env.API_BASE_URL || 'https://your-backend.vercel.app/api';
```

Or use Netlify's environment variable injection (requires build step).

---

## 🚀 Option 2: Same Netlify Site (Subdirectory)

### Step 1: Update Root `netlify.toml`
Add admin redirects to your root `netlify.toml`:

```toml
[build]
  publish = "frontend"
  command = "echo 'Frontend static site - no build needed'"

# Frontend SPA redirects
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Admin routes (before SPA redirect)
[[redirects]]
  from = "/admin/*"
  to = "/admin/:splat"
  status = 200
```

### Step 2: Copy Admin Files to Frontend
```bash
# Copy admin folder into frontend
cp -r admin frontend/admin
```

### Step 3: Update Admin Paths
Update all paths in `frontend/admin/*.html`:
- Change `href="css/..."` to `href="admin/css/..."`
- Change `src="js/..."` to `src="admin/js/..."`

### Step 4: Deploy
- Deploy frontend normally
- Admin will be at: `https://your-frontend.netlify.app/admin/`

---

## 🔧 Configuration

### Update API Base URL

**For Separate Site:**
Edit `admin/js/backend-api.js`:
```javascript
const API_BASE_URL = 'https://your-backend.vercel.app/api';
```

**For Same Site:**
Admin can use same API URL as frontend.

---

## ✅ Recommended Setup

**I recommend Option 1 (Separate Site)** because:
- ✅ Clean separation
- ✅ Easier to manage
- ✅ Can use different domain/subdomain
- ✅ Independent deployments
- ✅ Better security isolation

---

## 📋 Deployment Checklist

- [ ] Netlify site created (separate or same)
- [ ] Publish directory set to `admin`
- [ ] Environment variables configured
- [ ] API base URL updated in `admin/js/backend-api.js`
- [ ] Admin login tested
- [ ] All admin features tested
- [ ] Custom domain configured (optional)

---

## 🔗 Final URLs

After deployment:
- **Admin Panel**: `https://admin-primesmshub.netlify.app`
- **Backend API**: `https://your-backend.vercel.app/api`
- **Frontend**: `https://your-frontend.netlify.app`

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

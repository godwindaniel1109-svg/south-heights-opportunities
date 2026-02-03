# 🌐 Domain Setup Guide - primesmshub.com

## 📋 **Domain Configuration Checklist**

When you purchase `primesmshub.com`, here's what you need to configure:

---

## 1️⃣ **Netlify Domain Configuration (Frontend)**

### Steps:
1. Go to **Netlify Dashboard** → Your Frontend Site
2. Click **Domain settings**
3. Click **Add custom domain**
4. Enter: `primesmshub.com`
5. Netlify will show you DNS records to add

### DNS Records to Add:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

**OR** (if Netlify provides different IPs, use those)

---

## 2️⃣ **Vercel Domain Configuration (Backend API)**

### Steps:
1. Go to **Vercel Dashboard** → Your Backend Project
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `api.primesmshub.com` (subdomain for API)

### DNS Records to Add:
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

**OR** Vercel will provide specific DNS records - use those

---

## 3️⃣ **Admin Panel Domain (Optional)**

### Option A: Subdomain
```
Type: CNAME
Name: admin
Value: your-admin-site.netlify.app
```

### Option B: Same Domain (Subdirectory)
- No additional DNS needed
- Admin will be at: `primesmshub.com/admin/`

---

## 4️⃣ **Update Environment Variables**

### Frontend (Netlify)
After domain is configured, update:
```env
API_BASE_URL=https://api.primesmshub.com/api
```

### Backend (Vercel)
Update `ALLOWED_HOSTS`:
```env
ALLOWED_HOSTS=api.primesmshub.com,primesmshub.com,www.primesmshub.com
```

Update `CORS_ALLOWED_ORIGINS`:
```env
CORS_ALLOWED_ORIGINS=https://primesmshub.com,https://www.primesmshub.com,https://admin.primesmshub.com
```

---

## 5️⃣ **SSL/HTTPS**

- ✅ **Netlify**: Automatically provides SSL (Let's Encrypt)
- ✅ **Vercel**: Automatically provides SSL (Let's Encrypt)
- No additional configuration needed!

---

## 6️⃣ **DNS Propagation**

After adding DNS records:
- ⏱️ **Wait 24-48 hours** for DNS to propagate globally
- 🔍 **Check propagation**: https://www.whatsmydns.net/
- ✅ **Test**: Visit `primesmshub.com` to verify

---

## 7️⃣ **Update Code References**

### Files to Update:

#### `frontend/js/backend-api.js`
```javascript
// Update API_BASE_URL if hardcoded
const API_BASE_URL = 'https://api.primesmshub.com/api';
```

#### `admin/js/backend-api.js`
```javascript
// Update API_BASE_URL if hardcoded
const API_BASE_URL = 'https://api.primesmshub.com/api';
```

#### `frontend/index.html`
```html
<meta name="api-base" content="https://api.primesmshub.com/api">
```

---

## 📋 **Final URLs After Setup**

- **Frontend**: `https://primesmshub.com`
- **Backend API**: `https://api.primesmshub.com/api`
- **Admin Panel**: `https://admin.primesmshub.com` (or `https://primesmshub.com/admin`)

---

## 🔧 **Quick Setup Script**

After domain is purchased and DNS is configured:

1. **Update Netlify**:
   - Add domain in Netlify dashboard
   - Wait for SSL certificate (automatic)

2. **Update Vercel**:
   - Add `api.primesmshub.com` domain
   - Wait for SSL certificate (automatic)

3. **Update Environment Variables**:
   - Frontend: `API_BASE_URL`
   - Backend: `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`

4. **Test**:
   - Visit `https://primesmshub.com`
   - Check API: `https://api.primesmshub.com/api/health/`
   - Test login/register functionality

---

## 🆘 **Troubleshooting**

### Domain not working?
- Check DNS propagation: https://www.whatsmydns.net/
- Verify DNS records are correct
- Wait 24-48 hours for full propagation

### SSL not working?
- Netlify/Vercel auto-provision SSL
- May take a few minutes after domain is added
- Check domain settings in dashboard

### API calls failing?
- Verify `CORS_ALLOWED_ORIGINS` includes your domain
- Check `ALLOWED_HOSTS` includes API domain
- Verify `API_BASE_URL` is correct in frontend

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

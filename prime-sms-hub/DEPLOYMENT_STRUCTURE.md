# Prime SMS Hub - Deployment Structure Guide

## 📁 Project Structure

The project is now organized into three separate deployment units:

```
prime-sms-hub/
├── frontend/          # User-facing application (Deploy to Netlify)
│   ├── *.html        # All user pages
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   ├── images/       # Images and assets
│   ├── media/        # User uploads
│   └── netlify.toml  # Netlify deployment config
│
├── admin/             # Admin panel (Deploy to Netlify separately)
│   ├── admin-*.html  # Admin pages
│   ├── css/          # Admin-specific styles
│   ├── js/           # Admin JavaScript
│   └── netlify.toml  # Netlify deployment config
│
└── backend/           # Django API (Deploy to Vercel/Railway/Heroku)
    ├── api/          # Django app
    ├── prime_sms/    # Django project settings
    ├── manage.py     # Django management
    ├── requirements.txt
    └── vercel.json   # Vercel deployment config
```

## 🚀 Deployment Instructions

### Frontend Deployment (Netlify)

1. **Connect Repository:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings:**
   - **Base directory:** `frontend`
   - **Publish directory:** `frontend`
   - **Build command:** (leave empty - static site)

3. **Environment Variables:**
   - `API_BASE_URL` - Your backend API URL (e.g., `https://api.yourapp.com/api`)
   - `FIREBASE_API_KEY` - Firebase configuration
   - `PAYSTACK_PUBLIC_KEY` - Paystack public key

4. **Deploy:**
   - Netlify will auto-deploy on git push
   - Frontend will be available at: `https://your-frontend.netlify.app`

### Admin Panel Deployment (Netlify - Separate Site)

1. **Create New Netlify Site:**
   - Same repository, but different site
   - **Base directory:** `admin`
   - **Publish directory:** `admin`

2. **Add Password Protection (Recommended):**
   - Go to Site Settings > Build & deploy > Environment
   - Set up password protection for admin site

3. **Admin Site URL:**
   - Will be at: `https://your-admin.netlify.app`

### Backend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd backend
   vercel
   ```

3. **Environment Variables (Vercel Dashboard):**
   - `FIVESIM_API_KEY` - 5SIM API key
   - `PAYSTACK_SECRET_KEY` - Paystack secret key
   - `TELEGRAM_BOT_TOKEN` - Telegram bot token
   - `TELEGRAM_ADMIN_CHAT_ID` - Admin chat ID
   - `SECRET_KEY` - Django secret key
   - `DEBUG` - Set to `False` in production
   - `ALLOWED_HOSTS` - Your domain(s)

4. **Backend URL:**
   - Will be at: `https://your-api.vercel.app/api`

## 🔗 Cross-Deployment Links

### Frontend → Backend
- API calls use `API_BASE_URL` environment variable
- Configured in `frontend/js/backend-api.js`

### Admin → Backend
- Admin pages also use `API_BASE_URL`
- Same API endpoints as frontend

### Frontend → Admin
- Link to admin from frontend: Use full admin URL
- Or use relative path: `../admin/admin-login.html` (if same domain)

## ⚙️ Configuration Updates Needed

After deployment, update these files:

1. **frontend/js/backend-api.js:**
   ```javascript
   const API_BASE_URL = process.env.API_BASE_URL || 'https://your-api.vercel.app/api';
   ```

2. **frontend/js/firebase-config.js:**
   - Update Firebase config with production credentials

3. **frontend/js/paystack.js:**
   - Update Paystack public key

## 📊 Admin Full Control Features

The admin dashboard has complete control over:

1. **User Management:**
   - View all users
   - Activate/Deactivate accounts
   - View wallet balances
   - Transaction history per user

2. **Transaction Management:**
   - View all transactions
   - Approve/Reject pending payments
   - Manual transaction adjustments

3. **Number Management:**
   - View all purchased numbers
   - Monitor 5SIM integration
   - View SMS messages

4. **Financial Overview:**
   - Total revenue
   - Daily/Monthly statistics
   - Pending payments
   - Wallet balances

5. **Support Management:**
   - View all support conversations
   - Reply to users via Telegram
   - Track ticket status

6. **System Monitoring:**
   - API status
   - Database health
   - Integration status (5SIM, Paystack)

## 🔐 Security Considerations

1. **Admin Panel:**
   - Use Netlify password protection
   - Or implement authentication middleware
   - Limit access by IP if possible

2. **API Security:**
   - Use CORS properly
   - Implement rate limiting
   - Use environment variables for secrets
   - Enable HTTPS only

3. **Firebase:**
   - Use production Firebase project
   - Configure security rules
   - Enable authentication methods

## 📝 Deployment Checklist

- [ ] Deploy frontend to Netlify
- [ ] Deploy admin to Netlify (separate site)
- [ ] Deploy backend to Vercel
- [ ] Set all environment variables
- [ ] Update API_BASE_URL in frontend
- [ ] Test all API endpoints
- [ ] Configure CORS in backend
- [ ] Set up webhook URLs (Paystack)
- [ ] Test payment flows
- [ ] Test admin login
- [ ] Test user registration/login
- [ ] Verify logout confirmation works
- [ ] Test mobile responsiveness

## 🔄 Development vs Production

### Development
- All three run locally: `python liveserver.py`
- Frontend at: `http://localhost:8000`
- Admin at: `http://localhost:8000/admin-login.html`
- Backend API at: `http://localhost:8000/api`

### Production
- Frontend: `https://frontend-domain.com`
- Admin: `https://admin-domain.com`
- Backend: `https://api-domain.com/api`

## 🛠️ Maintenance

- **Frontend Updates:** Push to git → Netlify auto-deploys
- **Admin Updates:** Push to git → Netlify auto-deploys  
- **Backend Updates:** Push to git → Vercel auto-deploys

## 📞 Support

For deployment issues:
- Netlify: Check build logs in dashboard
- Vercel: Check deployment logs
- Backend: Check server logs in Vercel dashboard
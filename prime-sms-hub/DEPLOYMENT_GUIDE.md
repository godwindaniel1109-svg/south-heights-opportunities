# Prime SMS Hub - Complete Deployment Guide

## 📋 What's Been Completed

### ✅ Frontend Improvements
1. **Consistent Branding** - App name styled uniformly across all pages
2. **Mobile Responsive** - Both user and admin panels work perfectly on mobile
3. **Enhanced Paystack** - Supports Card, USSD, and Bank Transfer payments
4. **Admin Notifications** - Real-time notifications when users make payments
5. **Bug Fixes** - Fixed duplicate IDs, mobile sidebar issues, and navigation flow

### 🎨 UI Enhancements
- Consistent logo and branding colors
- Mobile hamburger menu for all dashboard pages
- Smooth animations and transitions
- Professional admin panel design
- Notification system with sound alerts

## 🌐 Access URLs

### User Portal
- **Landing Page**: http://localhost:8000/
- **Login**: http://localhost:8000/login.html
- **Register**: http://localhost:8000/register.html
- **Dashboard**: http://localhost:8000/dashboard.html
- **Profile**: http://localhost:8000/profile.html
- **Buy Number**: http://localhost:8000/buy-number.html
- **Fund Wallet**: http://localhost:8000/fund-wallet.html
- **Transaction History**: http://localhost:8000/transaction-history.html
- **Order History**: http://localhost:8000/order-history.html
- **Support**: http://localhost:8000/support.html

### Admin Portal
- **Admin Login**: http://localhost:8000/admin-login.html
- **Admin Dashboard**: http://localhost:8000/admin-dashboard.html
- **User Management**: http://localhost:8000/admin-users.html
- **Payment Management**: http://localhost:8000/admin-payments.html
- **Transaction Management**: http://localhost:8000/admin-transactions.html

## 🔧 Backend Requirements

### 1. Firebase Setup (Already Configured)
**Current Status**: Firebase config exists in `js/firebase-config.js`

**What You Need**:
- ✅ Firebase project created
- ✅ Firestore database enabled
- ✅ Firebase Authentication enabled
- ✅ Firebase Storage enabled

**Collections Structure**:
```javascript
users/{userId}
  - email: string
  - name: string
  - balance: number (in kobo)
  - createdAt: timestamp
  - referralCode: string
  - status: 'active' | 'suspended'

numbers/{numberId}
  - userId: string
  - phoneNumber: string
  - country: string
  - service: string
  - purchaseId: string
  - price: number
  - status: 'active' | 'expired'
  - expiresAt: timestamp
  - createdAt: timestamp
  - sms: array

transactions/{transactionId}
  - userId: string
  - type: 'deposit' | 'purchase' | 'refund'
  - amount: number
  - status: 'completed' | 'failed'
  - paymentMethod: 'paystack' | 'palmpay'
  - reference: string
  - createdAt: timestamp

pendingPayments/{paymentId}
  - userId: string
  - amount: number
  - proofImage: string (URL)
  - status: 'pending' | 'approved'
  - createdAt: timestamp
```

### 2. Paystack Integration
**Current Status**: Basic integration exists in `js/paystack.js`

**What You Need**:
```javascript
// Update in js/paystack.js
const PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY_HERE';
const PAYSTACK_SECRET_KEY = 'YOUR_PAYSTACK_SECRET_KEY_HERE';
```

**Features Implemented**:
- ✅ Card payments
- ✅ USSD payments
- ✅ Bank transfer support
- ✅ Payment verification
- ✅ Transaction logging

**Paystack Setup Steps**:
1. Create account at https://paystack.com
2. Get API keys from Settings → API Keys & Webhooks
3. Set up webhook URL: `https://yourdomain.com/api/paystack/webhook`
4. Enable payment channels: Card, USSD, Bank Transfer

### 3. 5SIM API Integration
**Current Status**: Integration exists in `js/fivesim.js`

**What You Need**:
```javascript
// Update in js/fivesim.js
const FIVESIM_API_KEY = 'YOUR_5SIM_API_KEY';
```

**5SIM Setup Steps**:
1. Create account at https://5sim.net
2. Get API key from profile settings
3. Fund your 5SIM account
4. Configure pricing in your app

### 4. Firebase Security Rules
**Required**: Set up Firestore security rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Numbers collection
    match /numbers/{numberId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Pending payments
    match /pendingPayments/{paymentId} {
      allow read, write: if request.auth != null;
    }
    
    // Admin access (add admin UIDs here)
    match /{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid in ['ADMIN_UID_1', 'ADMIN_UID_2'];
    }
  }
}
```

### 5. Cloud Functions (Recommended)
**Purpose**: Handle backend logic securely

**Required Functions**:
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Paystack webhook handler
exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
  // Verify payment and update user balance
  const { event, data } = req.body;
  
  if (event === 'charge.success') {
    const { reference, amount, customer } = data;
    
    // Update user balance in Firestore
    // Create transaction record
    // Send notification to admin
  }
  
  res.status(200).send('OK');
});

// Admin notification trigger
exports.notifyAdminOnPayment = functions.firestore
  .document('transactions/{transactionId}')
  .onCreate(async (snap, context) => {
    const transaction = snap.data();
    
    // Send push notification to admin
    // Send email notification
    // Update admin dashboard stats
  });
```

### 6. Environment Variables
**Create `.env` file**:
```env
# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id

# Paystack
PAYSTACK_PUBLIC_KEY=YOUR_PAYSTACK_PUBLIC_KEY_HERE
PAYSTACK_SECRET_KEY=YOUR_PAYSTACK_SECRET_KEY_HERE
PAYSTACK_WEBHOOK_SECRET=xxxxx

# 5SIM
FIVESIM_API_KEY=your_5sim_api_key

# Admin
ADMIN_EMAIL=admin@primesmshub.com
ADMIN_UID=firebase_admin_uid
```

### 7. Notification System
**Browser Notifications** (Already Implemented):
```javascript
// Request permission on admin login
if ('Notification' in window) {
  Notification.requestPermission();
}
```

**Email Notifications** (Needs Setup):
- Use SendGrid, Mailgun, or Firebase Extensions
- Send emails for:
  - New user registrations
  - Successful payments
  - Failed transactions
  - Low balance alerts

### 8. Deployment Checklist

**Before Going Live**:
- [ ] Update all API keys (Paystack, 5SIM, Firebase)
- [ ] Set up Firebase security rules
- [ ] Deploy Cloud Functions
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Set up error tracking (Sentry)
- [ ] Configure backup strategy
- [ ] Test all payment flows
- [ ] Test mobile responsiveness
- [ ] Set up monitoring and alerts

**Hosting Options**:

1. **Render (Backend / API)**
   - Use the `Procfile` included to run Daphne ASGI server for WebSockets:
     `web: daphne -b 0.0.0.0 -p $PORT prime_sms.asgi:application`
   - Set environment variables in Render dashboard:
     - `SECRET_KEY`, `DEBUG=false`, `ALLOWED_HOSTS`, `REDIS_URL`, `ADMIN_DASHBOARD_SECRET`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, etc.
   - Ensure `requirements.txt` includes `channels`, `channels-redis`, `daphne` (already present).
   - Use Redis (via `REDIS_URL`) for Channels production channel layer.

2. **Netlify (Frontend)**
   - Connect your GitHub repo and configure builds as needed. For this static repo you can deploy without a build step.
   - In Netlify site settings add an environment variable `API_BASE` or use HTML meta tag `api-base` to point to the Render backend API base (e.g. `https://api.example.com/api`).
   - If you need to inject the API base at build time, use a simple build script or Netlify's _Replace values_ build plugin to populate `index.html` meta tag.

3. **Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

4. **Netlify (simple)**
   - Connect GitHub repo
   - Auto-deploy on push


---

> Tips:
> - Keep secrets in Render/Netlify env vars and never commit `.env`
> - Use an HTTPS certificate (Render/Netlify provide this automatically)
> - Test Paystack and Telegram webhooks in production by registering the webhook URL (e.g., `https://api.example.com/api/support/telegram/webhook/`) and configuring the `TELEGRAM_WEBHOOK_SECRET` in envs.

### 9. Monitoring & Analytics
**Recommended Tools**:
- Google Analytics for user tracking
- Firebase Analytics for app events
- Sentry for error tracking
- LogRocket for session replay
- Hotjar for user behavior

### 10. Security Enhancements
**Implement**:
- Rate limiting on API calls
- CAPTCHA on registration/login
- 2FA for admin accounts
- IP whitelisting for admin panel
- Regular security audits
- Data encryption at rest

## 📱 Mobile App Considerations
If you plan to build mobile apps:
- Use React Native or Flutter
- Reuse Firebase backend
- Implement push notifications
- Add biometric authentication
- Optimize for offline mode

## 🔄 Continuous Improvement
**Next Steps**:
1. Add user analytics dashboard
2. Implement referral system
3. Add bulk SMS purchasing
4. Create API for third-party integrations
5. Add multi-currency support
6. Implement automated testing

## 📞 Support
For backend setup assistance:
- Firebase: https://firebase.google.com/docs
- Paystack: https://paystack.com/docs
- 5SIM: https://5sim.net/docs

---

**Note**: All sensitive keys and credentials should be stored securely and never committed to version control.
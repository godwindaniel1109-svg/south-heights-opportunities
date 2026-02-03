# Pennysavia USA

**A community platform for connections, opportunities, and virtual wealth sharing across Pennsylvania.**

## Overview

Pennysavia USA is a React + Vite frontend with an Express.js backend that enables:
- **User Authentication**: Register/Login with localStorage (can upgrade to Firebase/Auth0)
- **Virtual Wallet**: Every user starts with $10,000 in virtual funds
- **Meetups**: Connect with people across PA cities (Philadelphia, Pittsburgh, Harrisburg, Allentown, etc.)
- **Jobs**: Browse Pennsylvania-based job opportunities with search filtering
- **DWT Tokens**: Purchase digital tokens to unlock premium features and withdrawals
- **Withdrawal System**: Withdraw funds (requires 2 Apple gift card images + 15-digit code forwarded to Telegram)
- **Referral Program**: Share unique codes to refer friends and earn rewards

## Quick Start

### Frontend (React + Vite)
```bash
npm install
npm run dev
# Open http://localhost:5173
```

### Backend (Express)
```bash
cd backend
npm install
cp .env.example .env
# Fill in TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID in .env
npm run dev
# Backend runs on http://localhost:4000
```

## Project Structure

```
south_heights_oppurtunities/
├── src/                          # React frontend (Vite)
│   ├── components/
│   │   ├── Wallet.jsx            # Virtual wallet display
│   │   └── Wallet.css
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication & user state
│   ├── pages/
│   │   ├── LandingPage.jsx       # Hero with image carousel
│   │   ├── LoginPage.jsx         # Login form
│   │   ├── RegisterPage.jsx      # Register form
│   │   ├── Dashboard.jsx         # Main app (tabs: Meetups, Jobs, DWT, Withdraw, Referral)
│   │   ├── MeetupsPage.jsx       # PA meetups by city (filterable)
│   │   ├── JobsPage.jsx          # PA jobs (searchable)
│   │   ├── WithdrawPage.jsx      # Withdraw + Telegram integration
│   │   ├── BuyDWTPage.jsx        # Purchase DWT tokens
│   │   ├── ReferralPage.jsx      # Referral codes
│   │   ├── FreeMoneyPage.jsx     # Opportunities
│   │   └── *.css                 # Page styles
│   └── App.jsx, index.css, main.jsx
│
├── backend/                      # Express.js server
│   ├── index.js                  # /api/send-telegram endpoint
│   ├── package.json
│   ├── .env                      # Telegram credentials (keep secret!)
│   └── .env.example              # Template
│
├── images/                       # Your landing page photos (5 images)
├── index.html                    # Entry point (Google Inter font)
├── package.json, vite.config.js  # Vite config
├── DEPLOY.md                     # Deployment guide
└── README.md                     # This file
```

## Features Implemented

✅ **Landing Page** - Responsive hero with image carousel, feature cards  
✅ **Authentication** - Register/Login with localStorage  
✅ **Dashboard** - Tab-based navigation, wallet display  
✅ **Virtual Wallet** - $10,000 default balance, DWT token tracking  
✅ **Pennsylvania Meetups** - 8+ meetups across 4 PA cities with city filter  
✅ **Pennsylvania Jobs** - 10+ jobs with search by title/location/company  
✅ **DWT Purchase** - Buy tokens system  
✅ **Withdrawal** - Requires 2 Apple gift card images + 15-digit code → Telegram  
✅ **Referral Program** - Share referral links  
✅ **Responsive Design** - Mobile-first, tested on 600px+ breakpoints  
✅ **Backend** - Express server with Telegram Bot API integration  
✅ **Deployment Ready** - DEPLOY.md with Netlify/Vercel + Render/Heroku steps  

## Environment Variables

### Backend `.env` (Required)
```
TELEGRAM_BOT_TOKEN=8403984953:AAEH68RfaaH--DaloJ7nmdMI2p2Av1678B8
TELEGRAM_ADMIN_CHAT_ID=7099353645
TELEGRAM_WEBHOOK_SECRET=tg-sec-7099353645-20260106
PORT=4000
```

### Frontend `.env` (Optional, if backend on different domain)
```
VITE_API_URL=https://your-backend.herokuapp.com
```

## Deployment

### Frontend → Netlify / Vercel
1. Connect GitHub repo
2. Build: `npm run build` → `dist/`
3. Deploy

### Backend → Render / Heroku
1. Set environment variables (Telegram credentials)
2. Deploy `backend/` directory
3. Get backend URL
4. Frontend calls backend API

**See [DEPLOY.md](DEPLOY.md) for detailed step-by-step instructions.**

## Tech Stack

**Frontend:** React 18, Vite, React Router 6, CSS3  
**Backend:** Express.js, Axios, dotenv, CORS  
**Hosting:** Netlify/Vercel (frontend), Render/Heroku (backend)  
**Font:** Google Inter (modern, readable)  
**Colors:** Indigo (#6366f1) primary, Purple (#8b5cf6) secondary  

## Customization

### Add More Photos
- Place JPG/PNG in `images/` folder
- Update `src/pages/LandingPage.jsx` img tags

### Add More Jobs/Meetups
- Edit job/meetup arrays in `JobsPage.jsx` / `MeetupsPage.jsx`
- Or fetch from an API

### Upgrade Auth
- Replace localStorage in `src/context/AuthContext.jsx` with Firebase, Auth0, or Supabase

### Add Database
- Replace localStorage with MongoDB, PostgreSQL, or Firebase Firestore

## Security

🔒 **Never commit `.env`** — add to `.gitignore` (already done)  
🔒 **Keep Telegram token safe** — only on backend, never expose in frontend code  
🔒 **Use JWT + secure cookies** — current localStorage is demo-only  

## Support & Troubleshooting

- Check `DEPLOY.md` for deployment issues
- Review browser console (Frontend) and backend logs (Render/Heroku)
- Verify Telegram credentials are correct
- Ensure backend is running before testing image uploads

## Roadmap

- [ ] Persistent database (MongoDB/PostgreSQL)
- [ ] JWT authentication
- [ ] Admin dashboard
- [ ] Stripe payment integration
- [ ] Real-time notifications (WebSockets)
- [ ] Map view for meetups
- [ ] Video chat for meetups
- [ ] Email notifications
- [ ] 2FA authentication

---

**Ready to deploy! See [DEPLOY.md](DEPLOY.md) for step-by-step deployment guide.** 🚀
3. **Dashboard**: After login, users access the main dashboard
4. **DWT Purchase**: Users must purchase DWT before viewing jobs or withdrawing
5. **Admin Approval**: DWT purchases require admin approval
6. **Access**: Once DWT is approved, users can access jobs and withdraw funds

## Technology Stack

- React 18
- React Router DOM
- Vite
- CSS3 (Responsive Design)

## Project Structure

```
src/
├── components/
│   ├── Wallet.jsx          # Wallet display component
│   └── Wallet.css
├── context/
│   └── AuthContext.jsx     # Authentication & user state management
├── pages/
│   ├── LandingPage.jsx     # Landing page (currently redirects)
│   ├── LoginPage.jsx       # User login
│   ├── RegisterPage.jsx    # User registration
│   ├── Dashboard.jsx       # Main dashboard with tabs
│   ├── BuyDWTPage.jsx      # DWT purchase form
│   ├── JobsPage.jsx        # Job opportunities (requires DWT)
│   ├── MeetupsPage.jsx     # Community meetups
│   ├── FreeMoneyPage.jsx   # Free money opportunities
│   ├── WithdrawPage.jsx    # Fund withdrawal
│   ├── ReferralPage.jsx    # Referral program
│   └── *.css               # Page styles
└── App.jsx                 # Main app component with routing
```

## Key Features Explained

### DWT System
- Users must purchase DWT tokens ($50 each) to view job opportunities and withdraw funds
- Each DWT purchase requires uploading a payment proof image
- Purchases are pending until admin approval
- Once approved, DWT tokens are added to the user's account

### Withdrawal System
- Users need approved DWT tokens to withdraw funds
- Withdrawal formula: $1 = 1 DWT token
- DWT tokens are consumed when withdrawing

### Referral System
- Each user gets a unique referral code
- Users can share their referral link
- Referral codes can be used during registration via URL parameter

## Notes

- Data is currently stored in localStorage (for demo purposes)
- In production, this should connect to a backend API
- Admin approval for DWT purchases would be handled by an admin panel (not included)
- Image uploads are stored as base64 (should use cloud storage in production)

## License

This project is proprietary software for Pennysavia USA.

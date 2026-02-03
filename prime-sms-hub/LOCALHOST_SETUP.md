# Local Development Server Setup

## Quick Start (Windows)

### Option 1: Python HTTP Server (Recommended - Simplest)

```powershell
cd "c:\Users\HP\Desktop\prime-sms-hub"
python -m http.server 8000
```

**Access:**
- **Webapp**: http://localhost:8000
- **Admin**: http://localhost:8000/admin-login.html
- **Dashboard**: http://localhost:8000/dashboard.html

---

### Option 2: Node.js HTTP Server

Install http-server globally (if not already installed):
```powershell
npm install -g http-server
```

Run the server:
```powershell
cd "c:\Users\HP\Desktop\prime-sms-hub"
http-server -p 8000 -c-1
```

**Access:**
- **Webapp**: http://localhost:8000
- **Admin**: http://localhost:8000/admin-login.html

---

### Option 3: Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` → "Open with Live Server"
3. Server runs on `http://localhost:5500` by default

**Access:**
- **Webapp**: http://localhost:5500
- **Admin**: http://localhost:5500/admin-login.html

---

## Key Endpoints

### Webapp Routes
| Route | File | Description |
|-------|------|-------------|
| `/` | `index.html` | Landing page |
| `/login.html` | `login.html` | User login |
| `/register.html` | `register.html` | User registration |
| `/dashboard.html` | `dashboard.html` | Main dashboard (authenticated) |
| `/buy-number.html` | `buy-number.html` | Buy phone numbers |
| `/order-history.html` | `order-history.html` | View orders |
| `/transaction-history.html` | `transaction-history.html` | View transactions |
| `/fund-wallet.html` | `fund-wallet.html` | Fund wallet |
| `/support.html` | `support.html` | Support & contact |

### Admin Routes
| Route | File | Description |
|-------|------|-------------|
| `/admin-login.html` | `admin-login.html` | Admin login |
| `/admin-dashboard.html` | `admin-dashboard.html` | Admin dashboard |
| `/admin-users.html` | `admin-users.html` | User management |
| `/admin-payments.html` | `admin-payments.html` | Payment management |

---

## Test Credentials

### Admin Account
- **Email**: admin@example.com (CHANGE THIS)
- **Password**: CHANGE_THIS_PASSWORD (CHANGE THIS)

### User Account (Demo)
- **Email**: user@example.com
- **Password**: password123

---

## Features to Test

### User Registration & Login
1. Navigate to `/register.html`
2. Fill in: Email, Phone, Password, Confirm Password
3. Test password visibility toggle (👁️ button)
4. Click "Create Account"
5. Should redirect to `/dashboard.html`

### Admin Panel
1. Navigate to `/admin-login.html`
2. Login with admin credentials above
3. Click on profile picture to upload custom avatar
4. Test sidebar navigation

### Wallet & Payments
1. Go to `/fund-wallet.html`
2. View bank transfer details (Kuda Bank)
3. Test Paystack payment method (Card & USSD only)
4. Paystack key placeholder: `pk_test_YOUR_PAYSTACK_KEY`

### Support Page
1. Navigate to `/support.html`
2. View contact info:
   - WhatsApp: +234 915 5359 202
   - Email: primesmshub50@gmail.com
   - Response Time: 1 minute

---

## Environment Configuration

### LocalStorage (Session Data)
The app uses browser localStorage for user sessions:
- `isLoggedIn` - User login status
- `userEmail` - Currently logged-in user email
- `adminSession` - Admin session data (JSON)
- `adminProfilePicture` - Admin profile picture (base64)

### No Backend Required
- All data is mock/demo data
- Perfect for frontend development and testing
- Production will require API integration

---

## Troubleshooting

### Port 8000 Already in Use
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### CORS Issues
- Local file:// protocol may block some features
- Always use http:// (localhost)

### Images Not Loading
- Ensure `/images` folder exists
- Check browser console for 404 errors

### Scripts Not Running
- Open browser DevTools (F12)
- Check Console tab for errors
- Verify JS files exist in `/js` folder

---

## Production Deployment

When ready for production, update:
1. `js/firebase-config.js` - Add Firebase credentials
2. `js/paystack.js` - Add real Paystack public key
3. Backend API endpoints - Replace mock data with real APIs
4. Environment variables - Use `.env` file

---

## Notes
- All files are static (HTML/CSS/JS)
- No build process required
- Works on any device on the same network using your machine's IP
  - Example: `http://192.168.x.x:8000` (replace with your IP)

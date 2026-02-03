# 🚀 Prime SMS Hub - Complete Backend Setup & Live Reload Guide

## What Has Been Created

✅ **Django Backend** with complete API structure
✅ **Database Models** for Users, Transactions, Phone Numbers, SMS, Wallets
✅ **API Endpoints** for all features (payments, phone numbers, wallet)
✅ **Third-party Integrations**:
   - Firebase Authentication & Storage
   - Paystack Payments
   - 5SIM Virtual Phone Numbers
   - SendGrid Email Service

✅ **Live Reload System** for instant frontend updates
✅ **Admin Dashboard** with custom interface
✅ **Startup Scripts** for Windows/Linux/Mac

---

## 🚀 Quick Start (Windows)

### Step 1: Double-click to Start
```
start-dev.bat
```

This will:
- Check Python installation
- Install dependencies
- Run database migrations
- Start the development server

### Step 2: Open in Browser
```
http://localhost:8000
```

---

## 🐍 Manual Setup (All Platforms)

### Step 1: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Step 2: Configure API Keys
Edit `backend/.env` and add your keys:
```env
FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
PAYSTACK_SECRET_KEY=YOUR_PAYSTACK_SECRET_KEY_HERE
FIVESIM_API_KEY=YOUR_5SIM_API_KEY_HERE
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY_HERE
```

**⚠️ SECURITY NOTE**: Never commit real API keys to GitHub! Copy from `backend/.env.example` and fill in your actual keys.

### Step 3: Initialize Database
```bash
cd backend
python manage.py migrate
cd ..
```

### Step 4: Create Admin Account (Optional)
```bash
cd backend
python manage.py createsuperuser
cd ..
```

### Step 5: Start Server
```bash
python liveserver.py
```

---

## 📍 Access Points

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:8000 |
| **API** | http://localhost:8000/api |
| **Admin Dashboard** | http://localhost:8000/admin |
| **Health Check** | http://localhost:8000/api/health |
| **Firebase Config** | http://localhost:8000/api/firebase-config |

---

## 📡 API Endpoints

### Authentication
```
GET /api/users/me/          - Get current user
POST /api/users/logout/     - Logout
```

### Transactions
```
GET /api/transactions/                  - List transactions
POST /api/transactions/                 - Create transaction
POST /api/transactions/verify_payment/  - Verify Paystack payment
```

### Phone Numbers
```
GET /api/phone-numbers/                 - List my numbers
POST /api/phone-numbers/buy_number/     - Buy a number
GET /api/phone-numbers/available_numbers/ - Get available numbers & pricing
```

### Wallet
```
GET /api/wallet/balance/    - Get wallet balance
POST /api/wallet/add_funds/ - Add funds to wallet
```

---

## 🔄 Live Reload Features

### How It Works
1. **Backend**: Django's auto-reloader detects Python changes
2. **Frontend**: Detects HTML/CSS/JS changes in real-time
3. **Browser**: Automatically refreshes when files change

### Include in HTML
Add this to your HTML files for live reload:
```html
<script src="js/live-reload.js"></script>
```

### Using Backend API
Include this in your HTML to use the API:
```html
<script src="js/backend-api.js"></script>

<script>
// Example usage
api.getWalletBalance().then(wallet => {
    console.log('Balance:', wallet.balance);
});
</script>
```

---

## 🗄️ Database Models

### User
- Standard Django authentication
- Extended with wallet

### Wallet
- Tracks user balance
- Currency support

### Transaction
- Records payments
- Tracks status (pending/completed/failed)

### PhoneNumber
- Stores purchased numbers
- Links to 5SIM API
- Tracks expiration

### SMSMessage
- Incoming SMS storage
- Linked to phone numbers

---

## 🛠️ Troubleshooting

### Port 8000 Already in Use
**Windows**:
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**Linux/Mac**:
```bash
# Find process
lsof -i :8000

# Kill it
kill -9 <PID>
```

### Dependencies Not Installing
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Then install dependencies
pip install -r backend/requirements.txt
```

### Database Issues
```bash
cd backend
rm db.sqlite3  # Delete database
python manage.py migrate  # Recreate fresh
cd ..
```

### API Not Responding
```bash
# Check health
curl http://localhost:8000/api/health/

# Check Django is running
# Look at terminal output
```

---

## 🔐 Environment Variables

All sensitive data is in `backend/.env`:

```env
# Django
DEBUG=True
SECRET_KEY=...
ALLOWED_HOSTS=localhost,127.0.0.1

# Firebase
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...

# Paystack
PAYSTACK_PUBLIC_KEY=...
PAYSTACK_SECRET_KEY=...

# 5SIM
FIVESIM_API_KEY=...

# SendGrid
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=...
```

---

## 📊 Admin Dashboard

Access: http://localhost:8000/admin

Features:
- Manage users
- View transactions
- Monitor phone numbers
- Check SMS messages
- Track wallet balances
- View analytics

---

## 🔗 Frontend Integration

### JavaScript API Client
```javascript
// Import the API client
// <script src="js/backend-api.js"></script>

// Get current user
api.getCurrentUser().then(user => {
    console.log('User:', user);
});

// Get wallet balance
api.getWalletBalance().then(wallet => {
    console.log('Balance:', wallet.balance);
});

// Buy a phone number
api.buyPhoneNumber('US', 'WHATSAPP', 2.99).then(number => {
    console.log('Number:', number.phone_number);
});

// Get transactions
api.getTransactions().then(transactions => {
    console.log('Transactions:', transactions);
});
```

---

## 📝 Example API Requests

### Using cURL
```bash
# Get Firebase config
curl http://localhost:8000/api/firebase-config/

# Get wallet balance (requires auth token)
curl -H "Authorization: Token YOUR_TOKEN" \
     http://localhost:8000/api/wallet/balance/

# Buy a phone number
curl -X POST http://localhost:8000/api/phone-numbers/buy_number/ \
     -H "Authorization: Token YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"country":"US","service":"WHATSAPP","amount":2.99}'
```

### Using Python
```python
import requests

headers = {'Authorization': 'Token YOUR_TOKEN'}

# Get wallet
response = requests.get('http://localhost:8000/api/wallet/balance/', headers=headers)
print(response.json())

# Get available numbers
response = requests.get('http://localhost:8000/api/phone-numbers/available_numbers/')
print(response.json())
```

---

## 🚢 Production Deployment

See `DEPLOYMENT_GUIDE.md` for:
- Server setup (AWS/DigitalOcean)
- Database configuration (PostgreSQL)
- SSL/HTTPS setup
- Gunicorn/Nginx configuration
- Environment production setup

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Paystack API](https://paystack.com/docs/api)
- [5SIM API](https://5sim.net/api)
- [SendGrid Documentation](https://docs.sendgrid.com/)

---

## 🤝 Support

For issues:
1. Check terminal output for error messages
2. Run health check: `curl http://localhost:8000/api/health/`
3. Check admin panel: http://localhost:8000/admin
4. Review logs in terminal

---

**Last Updated**: December 12, 2025
**Status**: ✅ Ready for Development

# Prime SMS Hub Development Setup

This document provides setup instructions for the Prime SMS Hub development environment.

## Prerequisites

- Python 3.8+
- pip (Python package manager)
- Virtual Environment (optional but recommended)

## Quick Start

### Windows
```batch
start-dev.bat
```

### Linux/Mac
```bash
python3 quickstart.py
python3 liveserver.py
```

## Manual Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Configure Environment
Edit `backend/.env` with your API keys:
- Firebase credentials
- Paystack keys
- 5SIM API token
- SendGrid API key

### 3. Run Migrations
```bash
cd backend
python manage.py migrate
cd ..
```

### 4. Create Admin User (Optional)
```bash
cd backend
python manage.py createsuperuser
cd ..
```

### 5. Start Development Server
```bash
python liveserver.py
```

## Access Points

- **Frontend**: http://localhost:8000
- **API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin
- **API Health**: http://localhost:8000/api/health
- **Firebase Config**: http://localhost:8000/api/firebase-config

## API Endpoints

### Authentication
- GET `/api/users/me/` - Get current user
- POST `/api/users/logout/` - Logout

### Transactions
- GET `/api/transactions/` - List transactions
- POST `/api/transactions/` - Create transaction
- POST `/api/transactions/verify_payment/` - Verify payment

### Phone Numbers
- GET `/api/phone-numbers/` - List phone numbers
- POST `/api/phone-numbers/buy_number/` - Buy number
- GET `/api/phone-numbers/available_numbers/` - Get available numbers

### Wallet
- GET `/api/wallet/balance/` - Get balance
- POST `/api/wallet/add_funds/` - Add funds

## Troubleshooting

### Port 8000 already in use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Virtual Environment Issues
```bash
# Create new venv
python -m venv venv

# Activate
# Windows
venv\Scripts\activate.bat
# Linux/Mac
source venv/bin/activate
```

### Database Issues
```bash
cd backend
python manage.py migrate --fake-initial
python manage.py migrate
cd ..
```

## Production Deployment

See `DEPLOYMENT_GUIDE.md` for production setup instructions.

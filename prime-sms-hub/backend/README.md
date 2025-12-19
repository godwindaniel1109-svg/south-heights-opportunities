# Prime SMS Hub Backend Structure

## Directory Layout
```
backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables (contains API keys)
├── db.sqlite3               # Development database
├── prime_sms/               # Main Django project
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # URL routing
│   └── wsgi.py              # WSGI configuration
└── api/                     # API application
    ├── models.py            # Database models
    ├── views.py             # API views/endpoints
    ├── serializers.py       # DRF serializers
    ├── services.py          # Third-party service integrations
    ├── urls.py              # API routes
    ├── admin.py             # Django admin configuration
    └── apps.py              # App configuration
```

## Key Features

### 1. **Authentication & Users**
- Django built-in user authentication
- Token-based API authentication
- User profile management

### 2. **Payments Integration**
- **Paystack**: Complete payment processing
  - `initialize_transaction()` - Start payment
  - `verify_transaction()` - Verify payment
  
### 3. **Phone Numbers**
- **5SIM API Integration**
  - Buy virtual phone numbers
  - Get SMS messages
  - Check activation status
  - Support for multiple countries/services

### 4. **Email Notifications**
- **SendGrid Integration**
  - Transaction confirmations
  - SMS notifications
  - Custom email templates

### 5. **Wallet System**
- User wallet management
- Fund wallet via Paystack
- Deduct funds for purchases
- Transaction history

## Models

### User
- Standard Django User model
- Extended with Wallet relationship

### Wallet
- `balance` - Current wallet balance
- `currency` - Currency code (default: USD)
- `created_at`, `updated_at` - Timestamps

### Transaction
- `user` - Foreign key to User
- `transaction_type` - purchase, fund, refund
- `amount` - Transaction amount
- `status` - pending, completed, failed
- `reference` - Unique reference ID
- `description` - Transaction details

### PhoneNumber
- `user` - Foreign key to User
- `phone_number` - The actual phone number
- `country` - Country code
- `service` - Service (WhatsApp, Telegram, etc.)
- `status` - active, inactive, expired
- `expires_at` - Expiration date
- `activation_id` - 5SIM activation ID

### SMSMessage
- `phone_number` - Foreign key to PhoneNumber
- `sender` - SMS sender
- `content` - Message content
- `received_at` - Timestamp

## API Endpoints

### Health & Config
- `GET /api/health/` - Health check
- `GET /api/firebase-config/` - Get Firebase config

### Users
- `GET /api/users/` - List users (admin only)
- `GET /api/users/me/` - Current user
- `POST /api/users/logout/` - Logout

### Transactions
- `GET /api/transactions/` - List user transactions
- `POST /api/transactions/` - Create transaction
- `POST /api/transactions/verify_payment/` - Verify payment

### Phone Numbers
- `GET /api/phone-numbers/` - List phone numbers
- `POST /api/phone-numbers/buy_number/` - Buy number
- `GET /api/phone-numbers/available_numbers/` - Get pricing

### Wallet
- `GET /api/wallet/balance/` - Get balance
- `POST /api/wallet/add_funds/` - Add funds

## Services

### PaystackService
Payment processing for wallet funding

### FiveSimService
Virtual phone number purchasing and management

### EmailService
Transactional email via SendGrid

### FirebaseService
Firebase configuration provider

## Configuration

All API keys are stored in `backend/.env`:

```env
FIREBASE_API_KEY=...
PAYSTACK_SECRET_KEY=...
FIVESIM_API_KEY=...
SENDGRID_API_KEY=...
```

## Running the Backend

### Development
Recommended (Windows): use the development starters that create and use a Python 3.11 virtual environment (venv311), run migrations, start Django (in a separate window) and enable LiveReload.

```powershell
# From project root — create venv311 and start Django + LiveReload using PowerShell
.\start-dev.ps1    # PowerShell: starts Django (8000) + livereload frontend (5500)
```

```bash
# From project root — Batch fallback
.\start-dev.bat
```

If you prefer to manually start processes, use the following:

```bash
cd backend
venv311\Scripts\python.exe manage.py runserver 8000 --noreload
# in another terminal after Django is responding
cd ..
venv311\Scripts\python.exe liveserver.py --no-django --live-port 5500

Note: The Django server runs the API and admin on port 8000. The frontend static files are served by the LiveReload server (default 5500). Opening http://localhost:8000/ now serves the repo index.html (root) — the LiveReload frontend remains available at http://localhost:5500/index.html. If you customize or move the index file, update the view accordingly.
```

### Manual Start
```bash
cd backend
python manage.py runserver
```

### Migrations
```bash
cd backend
python manage.py migrate
```

### Create Admin User
```bash
cd backend
python manage.py createsuperuser
```

## Admin Panel

Access at `http://localhost:8000/admin`

Manage:
- Users
- Transactions
- Phone Numbers
- SMS Messages
- Wallets

## Testing APIs

### With curl
```bash
# Get Firebase config
curl http://localhost:8000/api/firebase-config/

# Health check
curl http://localhost:8000/api/health/
```

### With Python
```python
import requests

# Get user profile (requires token)
headers = {'Authorization': 'Token YOUR_TOKEN'}
response = requests.get('http://localhost:8000/api/users/me/', headers=headers)
print(response.json())
```

## Database

Development uses SQLite3 (`db.sqlite3`).

For production, update `settings.py` to use PostgreSQL:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'prime_sms',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Static Files & Media

- **Static Files**: `backend/../static/`
- **Media Files**: `backend/../media/`

## Logging

Logs are output to console by default. Modify `settings.py` to add file logging.

## Deployment

See root `DEPLOYMENT_GUIDE.md` for production deployment instructions.

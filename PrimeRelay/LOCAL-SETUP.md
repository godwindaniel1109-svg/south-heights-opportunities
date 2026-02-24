# 🏠 PrimeRelay Local Development Setup

## 📋 Prerequisites

Make sure you have these installed:
- **Node.js 18+** 
- **PostgreSQL** (installed and running)
- **Redis** (installed and running)
- **Git**

## 🚀 Quick Local Setup

### 1. Database Setup

**PostgreSQL:**
```sql
-- Create database
CREATE DATABASE primerelay;

-- Create user (optional)
CREATE USER primerelay_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE primerelay TO primerelay_user;
```

**Redis:**
```bash
# Start Redis (Windows)
redis-server

# Or if using Redis on Windows Subsystem for Linux
sudo service redis-server start
```

### 2. Environment Configuration

Create environment files:

**Backend (.env):**
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/primerelay

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-here-change-in-production

# Paystack (Test Keys)
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key

# SMS Providers (Get from providers)
TERMII_API_KEY=your-termii-api-key
MTNAIRTEL_API_KEY=your-mtnairtel-api-key
SMARTSMPP_API_KEY=your-smartsmpp-api-key

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Webhook URLs
DLR_WEBHOOK_URL=http://localhost:3001/api/webhooks/dlr
```

**Frontend (.env.development):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=PrimeRelay
NEXT_PUBLIC_APP_DESCRIPTION=Professional SMS SaaS Platform
```

### 3. Install Dependencies

```bash
# From root directory
npm install

# Install all workspace dependencies
npm run install:all
```

### 4. Database Migration

```bash
cd backend
npm run migrate
```

### 5. Start All Services

**Option 1: Start all together (recommended)**
```bash
# From root directory
npm run dev
```

**Option 2: Start individually**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Worker  
cd worker
npm run dev

# Terminal 3 - Frontend
cd frontend
npm run dev
```

## 🌐 Access Points

Once running, access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Documentation**: http://localhost:3001/api (endpoints listed below)

## 🧪 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:3001/health
```

### 2. Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📱 Frontend Features

- **Landing Page**: http://localhost:3000
- **Register**: http://localhost:3000/register
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard (after login)

## 🔧 Common Issues & Solutions

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l

# Reset database if needed
DROP DATABASE primerelay;
CREATE DATABASE primerelay;
```

### Redis Connection Issues
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Frontend Build Issues
```bash
# Clear Next.js cache
cd frontend
rm -rf .next

# Reinstall dependencies
npm install
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### SMS
- `POST /api/sms/send` - Send single SMS
- `POST /api/sms/campaign` - Send bulk campaign
- `GET /api/sms/campaigns` - Get campaigns
- `GET /api/sms/campaigns/:id` - Get campaign details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/wallet` - Get wallet balance
- `GET /api/users/transactions` - Get transactions

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `GET /api/payments/verify/:reference` - Verify payment
- `GET /api/payments/methods` - Get payment methods

### Webhooks
- `POST /api/webhooks/paystack` - Paystack webhook
- `POST /api/webhooks/dlr` - Delivery report webhook

## 🎯 Development Workflow

1. **Make changes** to code
2. **Services auto-reload** (nodemon/Next.js hot reload)
3. **Test in browser** at http://localhost:3000
4. **Check logs** in terminal for debugging
5. **Database changes** - update schema.sql and run migrate

## 🛠️ Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=primerelay:*
```

## 📝 Notes

- **Backend runs on port 3001**
- **Frontend runs on port 3000**
- **Worker connects to same Redis as backend**
- **Database migrations run automatically on first backend start**
- **SMS providers require real API keys for actual sending**

You're all set! 🎉 Start developing your SMS platform!

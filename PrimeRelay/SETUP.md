# PrimeRelay Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Git

### 1. Clone & Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Environment Setup

Copy environment templates and configure:

```bash
# Backend
cp .env.example .env

# Frontend (create manually since it's gitignored)
# Create frontend/.env.development with:
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=PrimeRelay
NEXT_PUBLIC_APP_DESCRIPTION=Professional SMS SaaS Platform
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis services
# Then run migrations:
cd backend
npm run migrate
```

### 4. Start Services

```bash
# Start all services (development mode)
npm run dev

# Or start individually:
# Backend
cd backend && npm run dev

# Worker  
cd worker && npm run dev

# Frontend
cd frontend && npm run dev
```

## 📁 Project Structure

```
PrimeRelay/
├── frontend/          # Next.js + Tailwind (Dashboard)
├── backend/           # Express.js + PostgreSQL (API)
├── worker/            # BullMQ + Redis (SMS Queue Worker)
└── README.md
```

## 🔧 Configuration

### Required Environment Variables

**Backend (.env):**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string  
- `JWT_SECRET` - JWT signing secret
- `PAYSTACK_SECRET_KEY` - Paystack API key
- `TERMII_API_KEY` - Termii SMS provider key
- `MTNAIRTEL_API_KEY` - MTN/Airtel API key
- `SMARTSMPP_API_KEY` - SmartSMPP API key

**Frontend (.env.development):**
- `NEXT_PUBLIC_API_URL=http://localhost:3001`

## 📊 Key Features Implemented

### ✅ Core Architecture
- **Queue-based SMS sending** (prevents crashes)
- **Multiple SMS providers** with automatic failover
- **Real-time delivery reports** via webhooks
- **Prepaid wallet system** with Paystack integration
- **JWT authentication** with refresh tokens
- **Rate limiting** and security middleware

### ✅ Frontend Features
- **Mobile-first responsive design**
- **Dashboard with statistics**
- **Campaign management**
- **Transaction history**
- **Wallet management**
- **User authentication**

### ✅ Backend Features
- **RESTful API** with proper validation
- **Database migrations** and schema
- **Queue worker** for SMS processing
- **Payment processing** with Paystack
- **Webhook handlers** for DLR and payments

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend & Worker (Railway)
```bash
# Deploy backend
cd backend
# Connect to Railway and deploy

# Deploy worker  
cd worker
# Connect to Railway and deploy
```

## 📱 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔍 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test
```

## 📝 Next Steps

1. **Configure SMS providers** with real API keys
2. **Set up Paystack** for payments
3. **Configure webhooks** for delivery reports
4. **Add monitoring** and logging
5. **Set up CI/CD** for deployments

## 🛠️ Development Notes

- **Never process SMS in request handlers** - always queue
- **Provider rotation** happens automatically
- **All transactions** are logged for audit
- **Mobile-first** design approach
- **Queue-based** architecture ensures scalability

## 📞 Support

Built with ❤️ for reliable SMS infrastructure in Nigeria and beyond.

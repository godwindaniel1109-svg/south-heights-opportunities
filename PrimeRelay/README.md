# PrimeRelay - Professional SMS SaaS Platform

A reliable, scalable SMS routing platform built for businesses and developers with queue-based architecture for maximum reliability.

## 🚀 Quick Start (Local Development)

### Windows Users
```bash
# Run the setup script
setup-local.bat
```

### Mac/Linux Users
```bash
# Make script executable and run
chmod +x setup-local.sh
./setup-local.sh
```

### Manual Setup
See [LOCAL-SETUP.md](./LOCAL-SETUP.md) for detailed manual setup instructions.

## 📱 Access Points

Once running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🏗️ Architecture

```
PrimeRelay/
├── frontend/     # Next.js + Tailwind CSS (User Dashboard)
├── backend/      # Express.js + PostgreSQL (API Server)
└── worker/       # BullMQ + Redis (SMS Queue Worker)
```

## ✨ Key Features

- **Queue-based SMS sending** (prevents crashes under load)
- **Multiple SMS providers** (Termii, MTN/Airtel, SmartSMPP) with auto-failover
- **Real-time delivery reports** via webhooks
- **Prepaid wallet system** with Paystack integration
- **Mobile-first responsive design** optimized for thumb usage
- **REST API** for developers with full documentation
- **Scalable architecture** built for high-volume messaging

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with full migrations
- **Queue**: Redis + BullMQ for background processing
- **Payment**: Paystack integration
- **Authentication**: JWT with refresh tokens

## 📊 Core Features

### User Dashboard
- Campaign management and scheduling
- Real-time delivery tracking
- Transaction history and wallet management
- Contact list management
- Analytics and reporting

### API Features
- Send single SMS or bulk campaigns
- Schedule messages for later delivery
- Get detailed delivery reports
- Manage contacts and sender IDs
- Wallet funding via Paystack

### Admin Features
- User management and approval
- Traffic monitoring and analytics
- Profit dashboard
- Spam account management

## 🔧 Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Git

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/primerelay
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
PAYSTACK_SECRET_KEY=sk_test_your-key
TERMII_API_KEY=your-termii-key
```

### Running Services

```bash
# Install dependencies
npm install
npm run install:all

# Run database migrations
cd backend && npm run migrate

# Start all services
npm run dev

# Or start individually:
npm run dev --workspace=frontend
npm run dev --workspace=backend  
npm run dev --workspace=worker
```

## 📚 Documentation

- [Local Setup Guide](./LOCAL-SETUP.md) - Detailed local development setup
- [API Documentation](./API-DOCS.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend & Worker (Railway/DigitalOcean)
```bash
# Deploy backend
cd backend
# Connect to Railway and deploy

# Deploy worker  
cd worker
# Connect to Railway and deploy
```

## 🔒 Security Features

- JWT authentication with refresh tokens
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- SQL injection prevention

## 📈 Scalability

- Queue-based processing prevents overload
- Horizontal scaling support
- Database connection pooling
- Redis-based session management
- Provider rotation for reliability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

Built with ❤️ for reliable SMS infrastructure in Nigeria and beyond.

---

**PrimeRelay** - Send with confidence. 🚀

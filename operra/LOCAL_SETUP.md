# Operra Local Development Setup

## 🚀 Quick Start Guide

### 1. Database Setup (PostgreSQL)

```bash
# Install PostgreSQL if not already installed
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Ubuntu: sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
# Windows: Services -> postgresql-x64-XX -> Start
# Mac: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql

# Create database
createdb operra

# Run schema creation
psql -d operra -f operra-backend/src/database/schema.sql
```

### 2. Backend Setup

```bash
cd operra-backend

# Copy environment variables
cp .env.example .env

# Edit .env file with your settings:
DATABASE_URL=postgresql://username:password@localhost:5432/operra
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
PAYSTACK_WEBHOOK_SECRET=whsec_your-webhook-secret
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend will run on: **http://localhost:3000**

### 3. Frontend Setup

```bash
cd operra-frontend

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local file:
NEXT_PUBLIC_API_URL=http://localhost:3000

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3001**

## 🧪 Testing the Application

### 1. Foundation Testing
Visit: **http://localhost:3001/test**
- Tests database connection
- Verifies API endpoints
- Checks JWT functionality
- Validates schema setup

### 2. Complete User Flow
1. **Landing Page**: http://localhost:3001
2. **Sign Up**: http://localhost:3001/signup
   - Create company account
   - Add admin user details
3. **Dashboard**: http://localhost:3001/dashboard
   - View business metrics
   - Navigate sidebar menu
4. **Customers**: http://localhost:3001/customers
   - Add new customers
   - Edit existing customers
5. **Sales**: http://localhost:3001/sales
   - Create invoices
   - Manage invoice status

## 🔧 Common Issues & Solutions

### Database Connection Failed
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database `operra` exists
- Check username/password are correct

### Frontend Can't Connect to Backend
- Ensure backend is running on port 3000
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS settings in backend

### Tailwind CSS Not Working
- Run `npm install` in frontend directory
- Restart the development server
- Check PostCSS configuration

### JWT Token Issues
- Clear browser localStorage
- Check JWT_SECRET in .env
- Restart backend server

## 📱 Access Points

Once both servers are running:

- **Landing Page**: http://localhost:3001
- **Signup**: http://localhost:3001/signup
- **Login**: http://localhost:3001/login
- **Dashboard**: http://localhost:3001/dashboard (requires login)
- **Customers**: http://localhost:3001/customers (requires login)
- **Sales**: http://localhost:3001/sales (requires login)
- **API Health Check**: http://localhost:3000/health
- **Foundation Tests**: http://localhost:3001/test

## 🎯 Quick Test Checklist

1. ✅ Both servers start without errors
2. ✅ Foundation tests all pass
3. ✅ Can create new company account
4. ✅ Can login to dashboard
5. ✅ Can add customers
6. ✅ Can create invoices
7. ✅ Data persists across page refreshes

## 🛠️ Development Tips

- Backend logs show in terminal
- Frontend logs show in browser dev tools
- Use browser Network tab to debug API calls
- Database can be inspected with pgAdmin or DBeaver
- Clear localStorage to test fresh login flow

## 📞 Support

If you encounter issues:
1. Check console logs for errors
2. Verify all environment variables are set
3. Ensure both servers are running
4. Test foundation endpoints first

# Operra Foundation Testing Guide

## 🧪 Complete Testing Checklist

### 1. PostgreSQL Database Setup

```bash
# Install PostgreSQL if not already installed
# On Windows: Download from postgresql.org
# On Mac: brew install postgresql
# On Ubuntu: sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
# Windows: Services -> postgresql-x64-XX -> Start
# Mac: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql

# Create database
createdb operra

# Run schema creation
psql -d operra -f operra-backend/src/database/schema.sql

# (Optional) Run test data insertion
psql -d operra -f operra-backend/src/database/test-setup.sql
```

### 2. Backend Server Testing

```bash
cd operra-backend

# Copy environment variables
cp .env.example .env

# Edit .env with your database connection string
# DATABASE_URL=postgresql://username:password@localhost:5432/operra
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Install dependencies
npm install

# Start development server
npm run dev
```

**Test these endpoints:**
- `GET http://localhost:3000/health` - Server health check
- `GET http://localhost:3000/test/db` - Database connection
- `GET http://localhost:3000/test/schema` - Schema verification
- `GET http://localhost:3000/test/isolation` - Company isolation test
- `GET http://localhost:3000/test/jwt` - JWT functionality

### 3. Frontend Server Testing

```bash
cd operra-frontend

# Copy environment variables
cp .env.local.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

**Test these pages:**
- `http://localhost:3001` - Landing page
- `http://localhost:3001/test` - Foundation testing page

### 4. Complete Flow Testing

1. **Visit test page**: `http://localhost:3001/test`
2. **Click "Run Tests Again"** to execute all tests
3. **Verify all tests pass** before proceeding to Phase 2

## 🎯 Expected Results

### ✅ All Tests Should Pass:
- Frontend Rendering: Next.js + Tailwind CSS working
- API Connection: Backend server responding
- Database Connection: PostgreSQL connected
- Database Schema: All tables created correctly
- Company Isolation: Multi-tenant architecture working
- JWT Functionality: Token generation/verification working

### ⚠️ Common Issues & Solutions:

**Database Connection Failed:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database `operra` exists

**Schema Test Failed:**
- Run `psql -d operra -f src/database/schema.sql`
- Check for SQL syntax errors

**API Connection Failed:**
- Ensure backend server is running on port 3000
- Check CORS settings in backend

**JWT Test Failed:**
- Verify JWT_SECRET is set in .env
- Check @fastify/jwt plugin is properly registered

## 🚀 Ready for Phase 2?

Once all tests pass, you're ready to build:
- Dashboard with analytics
- Customer management
- Invoice system
- Real business operations

## 📞 Support

If tests fail:
1. Check console logs for detailed errors
2. Verify environment variables
3. Ensure all dependencies are installed
4. Restart both servers after configuration changes

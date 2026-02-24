# 🔧 PrimeRelay Troubleshooting Guide

## 🚨 "Site Can't Be Reached" - Quick Fixes

### 1. Check if Services Are Running

**Windows Command Prompt:**
```bash
# Check what's running on ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill processes if needed (replace PID)
taskkill /PID <PID> /F
```

### 2. Start Services Manually

**Option A: Start Each Service Separately**

Open 3 separate terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Worker:**
```bash
cd worker
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

**Option B: Check Setup Script Output**
```bash
# Run setup with verbose output
setup-local.bat
```

### 3. Common Issues & Solutions

#### Issue: Port Already in Use
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Find and kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

#### Issue: Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Test database connection
psql postgresql://postgres:password@localhost:5432/primerelay
```

#### Issue: Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

#### Issue: Node.js Not Found
```bash
# Check Node.js version
node --version

# Should show v18.x.x or higher
```

### 4. Manual Environment Setup

If setup script failed, create files manually:

**backend/.env:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/primerelay
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=PrimeRelay
NEXT_PUBLIC_APP_DESCRIPTION=Professional SMS SaaS Platform
```

### 5. Step-by-Step Manual Start

**Step 1: Install Dependencies**
```bash
npm install
npm run install:all
```

**Step 2: Setup Database**
```bash
cd backend
npm run migrate
```

**Step 3: Start Services**
```bash
# From root directory
npm run dev
```

### 6. Check Logs for Errors

Look for these common errors:

**Backend Errors:**
- `EADDRINUSE: address already in use` → Port conflict
- `Connection refused` → Database/Redis not running
- `Authentication failed` → Wrong database credentials

**Frontend Errors:**
- `Network error` → Backend not running
- `CORS error` → Wrong API URL

### 7. Test Individual Services

**Test Backend Health:**
```bash
curl http://localhost:3001/health
```

**Test Frontend:**
Open browser directly to: http://localhost:3000

### 8. Firewall/Antivirus Issues

Sometimes Windows Firewall blocks Node.js:

**Windows Firewall:**
1. Go to Windows Security → Firewall & network protection
2. Click "Allow an app through firewall"
3. Add Node.js and allow ports 3000 & 3001

**Antivirus:**
- Temporarily disable antivirus
- Add exceptions for Node.js
- Add exceptions for ports 3000 & 3001

### 9. Alternative Ports

If ports 3000/3001 are blocked, modify:

**backend/.env:**
```env
PORT=3002
```

**frontend/.env.development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

Then access:
- Frontend: http://localhost:3000
- Backend: http://localhost:3002

### 10. Reset Everything

If nothing works, reset:

```bash
# Clean install
rmdir /s node_modules
rmdir /s frontend\node_modules
rmdir /s backend\node_modules
rmdir /s worker\node_modules

# Reinstall
npm install
npm run install:all

# Restart services
npm run dev
```

## 🆘 Still Having Issues?

**Check these in order:**
1. ✅ Node.js installed (`node --version`)
2. ✅ PostgreSQL running (`pg_isready`)
3. ✅ Redis running (`redis-cli ping`)
4. ✅ Ports available (`netstat -ano | findstr :3000`)
5. ✅ Environment files created
6. ✅ Dependencies installed
7. ✅ Database migrated

**Debug Mode:**
Add to backend/.env:
```env
DEBUG=primerelay:*
NODE_ENV=development
```

This will show detailed logs for troubleshooting.

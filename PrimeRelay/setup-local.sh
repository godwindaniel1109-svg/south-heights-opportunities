#!/bin/bash

echo "🚀 Starting PrimeRelay Local Development..."
echo

echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js is installed"

echo
echo "🗄️  Setting up environment..."

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp ".env.example" "backend/.env"
    echo "✅ Backend .env created - Please configure with your API keys"
fi

if [ ! -f "frontend/.env.development" ]; then
    echo "📝 Creating frontend .env.development file..."
    cat > "frontend/.env.development" << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=PrimeRelay
NEXT_PUBLIC_APP_DESCRIPTION=Professional SMS SaaS Platform
EOF
    echo "✅ Frontend .env.development created"
fi

echo
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

echo "✅ Root dependencies installed"

npm run install:all
if [ $? -ne 0 ]; then
    echo "❌ Failed to install workspace dependencies"
    exit 1
fi

echo "✅ Workspace dependencies installed"

echo
echo "🗄️  Setting up database..."
cd backend
npm run migrate
if [ $? -ne 0 ]; then
    echo "⚠️  Database migration failed. Please check PostgreSQL is running and DATABASE_URL is correct."
    echo "📝 Make sure PostgreSQL is installed and running on localhost:5432"
    echo "📝 Update backend/.env with correct database credentials"
    exit 1
fi

echo "✅ Database migration completed"

cd ..

echo
echo "🎉 Setup completed successfully!"
echo
echo "🌐 Next steps:"
echo "   1. Configure your API keys in backend/.env"
echo "   2. Make sure Redis is running on localhost:6379"
echo "   3. Run: npm run dev"
echo
echo "📱 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"
echo
echo "🚀 Starting all services..."
npm run dev

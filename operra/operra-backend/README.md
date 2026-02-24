# Operra Backend

The operating system for modern African businesses - Backend API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Set up PostgreSQL database and update `DATABASE_URL` in `.env`

4. Run database migrations:
```bash
psql -d your_database_name -f src/database/schema.sql
```

5. Start development server:
```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `PAYSTACK_SECRET_KEY` - Paystack API secret key
- `PAYSTACK_WEBHOOK_SECRET` - Paystack webhook secret
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## API Endpoints

### Authentication
- `POST /auth/register` - Register new company and admin
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Protected Routes (JWT required)
- `GET /api/profile` - Get user profile

## Database Schema

The application uses a multi-tenant architecture with `company_id` isolation:

- `companies` - Company workspaces
- `users` - Staff members with roles
- `customers` - Customer records
- `products` - Products/services
- `invoices` - Sales invoices
- `invoice_items` - Invoice line items
- `payments` - Payment records
- `expenses` - Expense tracking
- `tasks` - Task management
- `activity_logs` - Audit trail

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Fastify
- **Database**: PostgreSQL
- **Auth**: JWT with refresh tokens
- **Language**: TypeScript

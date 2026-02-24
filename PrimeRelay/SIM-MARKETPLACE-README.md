# PrimeRelay - SIM Number Marketplace

A professional platform for purchasing virtual and real SIM numbers for verification purposes.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
npm run dev
```

## 📱 Features

- **Dashboard** - Overview with wallet balance and stats
- **Buy Numbers** - Purchase virtual/real SIM numbers
- **Buy USA Numbers** - Specialized USA marketplace
- **Fund Wallet** - Paystack integration for payments
- **My Orders** - Track all purchased numbers
- **Transactions** - Wallet movement history
- **Settings** - Profile and preferences
- **Support** - Chat-based customer support

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (dashboard)/       # Protected routes
│   │   ├── dashboard/
│   │   ├── buy-numbers/
│   │   ├── buy-usa-numbers/
│   │   ├── fund-wallet/
│   │   ├── my-orders/
│   │   ├── transactions/
│   │   ├── settings/
│   │   └── support/
│   ├── auth/              # Authentication pages
│   └── globals.css
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── lib/                  # Utilities and API clients
├── types/                # TypeScript definitions
└── hooks/                # Custom React hooks
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Context + useReducer
- **API**: Axios with interceptors
- **Payment**: Paystack
- **SIM Providers**: 5sim API integration

## 📊 Pages Overview

### 1. Dashboard
- Welcome message with user name
- Wallet balance banner (desktop only)
- Quick action card for number purchase
- Statistics cards (4 metrics)
- Recent orders table

### 2. Buy Numbers
- Country selection dropdown
- App selection (WhatsApp, Telegram, etc.)
- Provider filtering
- Number type selection (Virtual/Real SIM)
- Price preview and purchase

### 3. Buy USA Numbers
- USA-specific marketplace
- Grid layout of available numbers
- No country selector (USA only)

### 4. Fund Wallet
- Wallet balance display
- Paystack payment integration
- Funding history table

### 5. My Orders
- Complete order history
- Number management actions
- Expiry tracking

### 6. Transactions
- Wallet movement history
- Credit/Debit indicators
- Balance tracking

### 7. Settings
- Profile management
- Notification preferences
- Security settings

### 8. Support
- Chat-style interface
- Telegram bot integration (future)

## 🔧 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_APP_NAME=PrimeRelay
NEXT_PUBLIC_APP_DESCRIPTION=SIM Number Marketplace
```

## 📱 Responsive Design

- **Desktop**: Fixed sidebar, wallet banner in header
- **Mobile**: Collapsible sidebar, wallet in Fund Wallet page only

## 🚀 Deployment

```bash
npm run build
npm start
```

## 📞 Support

Built for reliable SIM number marketplace operations.

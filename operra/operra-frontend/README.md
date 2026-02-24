# Operra Frontend

The operating system for modern African businesses - Frontend application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your backend

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Inter (headings), Roboto (body)

## Color Palette

- **Primary**: Deep Indigo (#1E2A78)
- **Accent**: Emerald (#1FBF75)
- **Background**: Soft Gray (#F5F7FB)
- **Text**: Dark Slate (#1F2937)
- **Danger**: Soft Red (#E5484D)

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── lib/               # Utilities and helpers
└── types/             # TypeScript type definitions
```

## Features

- Professional landing page
- Responsive design
- Premium SaaS UI/UX
- Authentication system
- Dashboard with analytics
- Sales and invoicing
- Customer management
- Expense tracking
- Team management
- Task/sprint system

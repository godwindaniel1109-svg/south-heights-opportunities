# 📱 Prime SMS Hub - SMS Solutions Platform

A scalable, mobile-friendly platform for purchasing and managing virtual phone numbers for SMS verification.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js (optional, for some tools)
- API Keys for: Firebase, Paystack, 5SIM

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prime-sms-hub
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your API keys
   pip install -r requirements.txt
   python manage.py migrate
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   cp js/config.example.js js/config.js
   # Edit js/config.js with your API keys
   ```

4. **Start Development Server**
   ```bash
   # From project root
   python liveserver.py
   ```

## 📁 Project Structure

```
prime-sms-hub/
├── frontend/          # User-facing application (Deploy to Netlify)
│   ├── *.html        # All user pages
│   ├── css/          # Stylesheets (mobile-responsive)
│   ├── js/           # JavaScript files
│   │   ├── config.example.js  # Template config
│   │   ├── config.js          # Your config (gitignored)
│   │   └── config-loader.js   # Config loader
│   └── images/       # Assets
│
├── admin/             # Admin panel (Deploy to Netlify separately)
│   └── ...           # Admin-specific files
│
└── backend/           # Django API (Deploy to Vercel/Railway)
    ├── .env.example   # Template environment
    ├── .env           # Your environment (gitignored)
    └── api/           # Django app
```

## 🔐 Configuration

### Backend Configuration
Copy `backend/.env.example` to `backend/.env` and fill in:
- Django `SECRET_KEY`
- `FIREBASE_API_KEY`
- `PAYSTACK_PUBLIC_KEY` & `PAYSTACK_SECRET_KEY`
- `FIVESIM_API_KEY`
- Other API keys as needed

### Frontend Configuration
Copy `frontend/js/config.example.js` to `frontend/js/config.js` and fill in:
- `FIREBASE_CONFIG` - Complete Firebase config
- `PAYSTACK_PUBLIC_KEY` - Paystack public key
- `FIVESIM_API_KEY` - 5SIM API key
- `API_BASE_URL` - Backend API URL

**⚠️ Important:** `config.js` and `.env` are gitignored - they won't be committed.

## 📱 Mobile Support

- ✅ Fully responsive design
- ✅ Touch-friendly interface (min 44x44px buttons)
- ✅ Mobile-optimized layouts
- ✅ Viewport meta tags on all pages
- ✅ Works on iOS, Android, and tablets

## 🛠️ Development

See [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) for detailed setup instructions.

### Running Locally
```bash
python liveserver.py
```

Access:
- Frontend: http://localhost:8000
- Admin: http://localhost:8000/admin/admin-login.html
- API: http://localhost:8000/api

## 🚀 Deployment

### Frontend & Admin (Netlify)
1. Connect repository to Netlify
2. Set base directory: `frontend` or `admin`
3. Set environment variable: `API_BASE_URL`
4. Deploy!

### Backend (Vercel/Railway)
1. Connect repository
2. Set base directory: `backend`
3. Add all environment variables from `.env.example`
4. Deploy!

See [DEPLOYMENT_STRUCTURE.md](DEPLOYMENT_STRUCTURE.md) for detailed deployment guide.

## 🔒 Security

- ✅ Sensitive files gitignored (`.env`, `config.js`)
- ✅ Example config files included (`.env.example`, `config.example.js`)
- ✅ API keys loaded from environment/config files
- ✅ CORS configured for production
- ✅ HTTPS recommended for production

## 📚 Documentation

- [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) - Developer setup guide
- [DEPLOYMENT_STRUCTURE.md](DEPLOYMENT_STRUCTURE.md) - Deployment instructions
- [API_CONFIGURATION.md](API_CONFIGURATION.md) - API setup details
- [STRUCTURE_SUMMARY.md](STRUCTURE_SUMMARY.md) - Project structure details

## 🎯 Features

- 📞 Buy virtual phone numbers (5SIM integration)
- 💰 Wallet funding (Paystack & manual transfer)
- 📊 Transaction history
- 📱 Mobile-responsive interface
- 👨‍💼 Admin dashboard for full control
- 🔔 Real-time notifications
- 🌍 Multi-country support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Authors

[Your Name/Team]

## 🙏 Acknowledgments

- Firebase for authentication and database
- Paystack for payment processing
- 5SIM for virtual phone numbers

---

**Need help?** Check the documentation or open an issue.
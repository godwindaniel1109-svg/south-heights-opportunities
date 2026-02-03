# 👨‍💻 Developer Setup Guide

## 📋 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd prime-sms-hub
   ```

2. **Backend Setup**
   ```bash
   cd backend
   # Copy environment example
   cp .env.example .env
   # Edit .env with your actual API keys
   # Install dependencies (if using virtualenv)
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   # Copy config example
   cp js/config.example.js js/config.js
   # Edit js/config.js with your actual API keys
   ```

4. **Start Development Server**
   ```bash
   # From project root
   python liveserver.py
   ```

## 🔐 Configuration Files

### Backend (`.env`)
Located in `backend/.env` (copy from `backend/.env.example`)

**Required Variables:**
- `SECRET_KEY` - Django secret key
- `FIREBASE_API_KEY` - Firebase API key
- `PAYSTACK_PUBLIC_KEY` - Paystack public key
- `PAYSTACK_SECRET_KEY` - Paystack secret key
- `FIVESIM_API_KEY` - 5SIM API key

### Frontend (`config.js`)
Located in `frontend/js/config.js` (copy from `frontend/js/config.example.js`)

**Required Variables:**
- `FIREBASE_CONFIG` - Complete Firebase configuration object
- `PAYSTACK_PUBLIC_KEY` - Paystack public key (for client-side)
- `FIVESIM_API_KEY` - 5SIM API key (for client-side fallback)
- `API_BASE_URL` - Backend API URL (defaults to same origin)

## 📁 Project Structure

```
prime-sms-hub/
├── frontend/          # User-facing application
│   ├── *.html        # HTML pages
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   │   ├── config.example.js  # Example config (commit to git)
│   │   ├── config.js          # Your config (gitignored)
│   │   └── config-loader.js   # Config loader
│   └── images/       # Images
│
├── admin/             # Admin panel
│   └── ...           # Similar structure to frontend
│
└── backend/           # Django API
    ├── .env.example   # Example environment (commit to git)
    ├── .env           # Your environment (gitignored)
    └── api/           # Django app
```

## 🔒 Security Notes

1. **NEVER commit sensitive files:**
   - `backend/.env`
   - `frontend/js/config.js`
   - Any file with actual API keys

2. **Always use example files:**
   - `backend/.env.example` - Template for environment variables
   - `frontend/js/config.example.js` - Template for frontend config

3. **Check `.gitignore`:**
   - Ensure `.env` and `config.js` are listed
   - Run `git status` before committing to verify

## 📱 Mobile Development

The app is designed to be mobile-responsive:
- Viewport meta tag included in all HTML
- CSS uses flexbox/grid for responsive layouts
- Touch-friendly button sizes (min 44x44px)
- Media queries for mobile breakpoints

## 🧪 Testing

### Local Testing
```bash
# Start development server
python liveserver.py

# Access:
# Frontend: http://localhost:8000
# Admin: http://localhost:8000/admin/admin-login.html
# API: http://localhost:8000/api
```

### API Testing
Use Postman or curl to test API endpoints:
```bash
curl http://localhost:8000/api/health
```

## 🐛 Troubleshooting

### Config not loading
- Ensure `config.js` exists in `frontend/js/`
- Check browser console for errors
- Verify file is loaded before other scripts

### Environment variables not working
- Ensure `.env` file exists in `backend/`
- Check variable names match `.env.example`
- Restart server after changing `.env`

### Firebase not initializing
- Check `config.js` has correct Firebase credentials
- Verify Firebase project is active
- Check browser console for Firebase errors

## 📝 Code Style

- Use ES6+ JavaScript features
- Follow existing code patterns
- Add comments for complex logic
- Use meaningful variable names
- Keep functions focused and small

## 🔄 Git Workflow

1. Create feature branch: `git checkout -b feature-name`
2. Make changes
3. Test locally
4. Commit: `git commit -m "Description"`
5. Push: `git push origin feature-name`
6. Create pull request

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Paystack API Docs](https://paystack.com/docs/api/)
- [5SIM API Docs](https://5sim.net/docs)

## ❓ Need Help?

Check existing documentation:
- `DEPLOYMENT_STRUCTURE.md` - Deployment guide
- `API_CONFIGURATION.md` - API setup details
- `README.md` - Project overview
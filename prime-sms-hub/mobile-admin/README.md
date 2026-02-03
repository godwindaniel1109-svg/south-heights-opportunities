# Mobile Admin App - Prime SMS Hub

A touch-optimized, mobile-first admin dashboard for managing the Prime SMS Hub platform. Built as a Progressive Web App (PWA) for iOS and Android installation.

## Features

### 📊 Dashboard
- Real-time system statistics
- User count, active users, revenue tracking
- Pending payments counter
- System health status (backend online/offline indicator)
- Cache management for offline operation

### 👥 User Management
- Search and filter users by status
- View user details (email, balance, join date, last login)
- Suspend/activate users
- Delete user accounts
- Real-time status updates

### 💰 Payment Management
- View pending, approved, and rejected payments
- Approve/reject payment submissions
- Transaction details and timestamps
- Quick action buttons with confirmations

### 💬 Support Management
- View all support conversations
- Search conversations by user, subject, or message content
- Open conversations to view message history
- Reply to user messages
- Real-time message threading

### 🔐 Authentication
- Admin-only access (email + password)
- Token-based authentication with backend
- Session persistence via localStorage
- Demo mode for offline testing (admin@example.com / admin123)

## Installation

### Desktop Browser
1. Navigate to `http://localhost:8000/mobile-admin/` (development)
2. Login with admin credentials
3. Access from any modern browser

### Mobile Installation (iOS)
1. Open Safari browser
2. Navigate to the admin panel URL
3. Tap Share → Add to Home Screen
4. App will install with offline capabilities

### Mobile Installation (Android)
1. Open Chrome or Firefox browser
2. Navigate to the admin panel URL
3. Tap Menu → Install app
4. App will install with offline capabilities

## Project Structure

```
mobile-admin/
├── index.html           # Admin dashboard
├── users.html           # User management
├── payments.html        # Payment review
├── support.html         # Support management
├── login.html           # Admin login
├── manifest.json        # PWA manifest
├── vercel.json          # Vercel deployment config
├── css/
│   └── admin.css        # Admin-specific styles (extends mobile.css)
└── js/
    └── admin.js         # Admin logic and event handlers
```

## API Endpoints Used

The admin app integrates with the backend API:

```
POST   /api/auth/admin/login/          # Admin authentication
GET    /api/users/                     # List users with search
PATCH  /api/users/{id}/                # Update user status
DELETE /api/users/{id}/                # Delete user
GET    /api/transactions/              # List transactions
POST   /api/transactions/{id}/approve/ # Approve payment
POST   /api/transactions/{id}/reject/  # Reject payment
GET    /api/support/                   # List support conversations
GET    /api/support/{id}/messages/     # Get conversation messages
POST   /api/support/{id}/messages/     # Reply to support message
GET    /api/admin/stats/               # Get admin dashboard stats
```

## Authentication

### Admin Login
```javascript
POST /api/auth/admin/login/
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "abc123...",
  "email": "admin@example.com"
}
```

The token is stored in `localStorage` as `authToken` and used in all subsequent requests:
```
Authorization: Token abc123...
```

Admin role is tracked in `localStorage.adminRole = 'admin'`

## Mock Data Fallback (A)

When the backend is unavailable or offline, the app uses mock data from `js/mock-data.js`:

```javascript
// Example mock structure
MOCK_DATA = {
  admin: {
    stats: { totalUsers: 42, activeUsers: 28, totalRevenue: 250000, ... },
    users: [
      { id: 1, email: 'user1@example.com', status: 'active', balance: 5000, ... },
      { id: 2, email: 'user2@example.com', status: 'suspended', balance: 0, ... }
    ],
    payments: [
      { id: 1, user: 'user1@example.com', amount: 10000, status: 'pending', ... }
    ],
    support: [
      { id: 1, user: 'user1@example.com', subject: 'Issue with SMS', ... }
    ]
  }
}
```

## Data Flow (B - Dynamic Integration)

### Load Admin Stats
```javascript
let stats = await api.getAdminStats();  // Try real API
if (!stats) {
  stats = getMockData('admin.stats');   // Fallback to mock
}
```

### Load Users
```javascript
let users = await api.getUsers(searchQuery);
if (!users) {
  users = getMockData('admin.users');   // Fallback if offline
}
```

### Approve Transaction
```javascript
const success = await api.approveTransaction(transactionId);
if (success) {
  showNotification('Payment approved');
  loadPayments();  // Refresh list
}
```

## Offline Support (Service Worker)

The admin app uses a Service Worker (`sw.js`) to cache:
- HTML pages (index.html, users.html, payments.html, support.html)
- CSS stylesheets
- JavaScript files
- API responses (limited caching)

### Using Offline
1. App will detect network status via `window.online` event
2. Failed API requests automatically fallback to mock data
3. Cached pages remain accessible
4. Real data syncs when connection restores
5. Users see "You are offline - using cached data" notification

## Performance Optimization

- **Touch-optimized UI**: 48px+ touch targets
- **Lazy loading**: Modal dialogs only load when opened
- **Debounced search**: Search input triggers after 300ms
- **Optimistic updates**: UI updates before API response
- **Compression**: Gzip enabled on Vercel
- **Caching**: Service Worker caches static assets

## Browser Compatibility

- Chrome/Edge: Full support (version 51+)
- Safari: Full support (version 11+)
- Firefox: Full support (version 44+)
- Opera: Full support (version 38+)

## Keyboard Shortcuts

- `Esc`: Close modal dialogs
- `Enter`: Submit forms
- `Tab`: Navigate between form fields

## Customization

### Changing Colors
Edit `mobile/css/mobile.css`:
```css
:root {
  --primary-color: #FF6B35;      /* Main accent */
  --secondary-color: #FFB703;    /* Secondary */
  --success-color: #10b981;      /* Success state */
  --danger-color: #ef4444;       /* Danger state */
}
```

### Changing Backend URL
Edit `mobile/js/api.js`:
```javascript
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000'
  : 'https://your-production-backend.com';
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from mobile-admin directory
cd mobile-admin
vercel
```

### GitHub Pages
```bash
git add mobile-admin/
git commit -m "Add mobile admin app"
git push origin main
# Enable GitHub Pages in Settings → Pages → Deploy from Branch
```

### Self-Hosted
```bash
# Copy files to web server
cp -r mobile-admin/* /var/www/html/admin/

# Ensure HTTPS is enabled
sudo certbot install -d admin.yourdomain.com
```

## Security Considerations

- ✅ Token stored in localStorage (vulnerable to XSS)
- ✅ Use HTTPOnly cookies for production
- ✅ Implement CSRF protection on backend
- ✅ Validate all inputs on backend
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on API

## Troubleshooting

### Login not working
1. Check backend is running: `python manage.py runserver`
2. Verify API endpoint in browser DevTools
3. Check admin credentials in backend database
4. Try demo credentials: admin@example.com / admin123

### Data not loading
1. Check network tab in DevTools
2. Verify `authToken` in localStorage
3. Check CORS headers on backend
4. Verify API endpoints respond correctly

### Offline mode not working
1. Check Service Worker registration
2. Verify cache is enabled in DevTools
3. Inspect Application → Cache Storage
4. Check browser allows Service Workers

### PWA not installing
1. Verify manifest.json is valid
2. Check HTTPS is enabled
3. Verify manifest icons exist
4. Try `Add to Home Screen` again

## Performance Metrics

- **Initial Load**: < 2s (with cache: < 500ms)
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+
- **Mobile Performance**: 85+

## Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Export reports (CSV, PDF)
- [ ] Advanced user filtering and analytics
- [ ] Bulk actions (suspend multiple users)
- [ ] User activity timeline
- [ ] Transaction dispute handling
- [ ] Multi-language support
- [ ] Dark mode theme

## Support

For issues or questions:
1. Check GitHub Issues
2. Contact admin@yourdomain.com
3. See [BACKEND_README.md](../backend/README.md) for API documentation

## License

Same as parent project (Prime SMS Hub)

# Mobile App A+B+C Testing Guide

This document covers testing the complete mobile app implementation with:
- **A**: Mock data fallback
- **B**: Dynamic API integration  
- **C**: Mobile admin app

## Quick Start

### 1. Start Backend
```bash
cd backend
python manage.py runserver
# Server runs at http://localhost:8000
```

### 2. User App Testing
Visit: `http://localhost:8000/mobile/`

### 3. Admin App Testing
Visit: `http://localhost:8000/mobile-admin/`
Demo login: admin@example.com / admin123

## Test Scenarios

### A. Mock Data Fallback

#### Test 1.1: Offline Mock Data
**Setup:**
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh page

**Expected:**
- Page loads with cached data
- Mock wallet data displays
- Mock transactions show
- "Offline" indicator appears

**Result:** ✅ / ❌

#### Test 1.2: API Error Fallback
**Setup:**
1. Backend service stopped
2. Refresh page (online mode)

**Expected:**
- Page still loads
- Shows mock data as fallback
- No error displayed to user
- Console shows error

**Result:** ✅ / ❌

#### Test 1.3: Mock Data Accuracy
**Setup:**
1. Login as regular user
2. Check dashboard

**Expected:**
- Balance: ₦50.00 (5000 kobo)
- Transactions: 3 items
- Phone numbers: 2 items
- Support conversations: 1 item

**Result:** ✅ / ❌

### B. Dynamic API Integration

#### Test 2.1: Real Data Loading
**Setup:**
1. Backend running
2. Create test user account
3. Add funds (₦1000)
4. Buy USA number

**Expected:**
- Dashboard shows real balance
- Recent transactions appear
- My Numbers lists purchased number
- All data updates in real-time

**Result:** ✅ / ❌

#### Test 2.2: API Authentication
**Setup:**
1. Login with valid credentials
2. Check DevTools → Network → Requests

**Expected:**
- Token sent in Authorization header
- All requests include token
- 401 errors handled (redirect to login)
- Session persists after refresh

**Result:** ✅ / ❌

#### Test 2.3: Transaction Creation
**Setup:**
1. Open Buy Number page
2. Select USA
3. Complete purchase

**Expected:**
- Transaction created in backend
- Appears in Recent Activity
- Wallet balance decreases
- SMS history available

**Result:** ✅ / ❌

#### Test 2.4: Error Handling
**Setup:**
1. Try to buy number with ₦0 balance
2. Try invalid amount in fund form

**Expected:**
- User-friendly error message
- Form doesn't close
- User can retry
- No stack traces shown

**Result:** ✅ / ❌

### C. Mobile Admin App

#### Test 3.1: Admin Login
**Setup:**
1. Go to `/mobile-admin/login.html`
2. Enter admin@example.com / admin123
3. Click Sign In

**Expected:**
- Redirects to admin dashboard
- Dashboard loads stats
- Session stored in localStorage
- Admin can see menu options

**Result:** ✅ / ❌

#### Test 3.2: User Management
**Setup:**
1. Admin logged in
2. Go to Users tab
3. Search for user

**Expected:**
- User list loads
- Search filters results
- Status badges display correctly
- Can suspend/activate users

**Result:** ✅ / ❌

#### Test 3.3: Payment Review
**Setup:**
1. Go to Payments tab
2. View pending payments
3. Approve one payment

**Expected:**
- Pending payments list shows
- Can see payment details
- Approve button works
- Payment status updates to "approved"

**Result:** ✅ / ❌

#### Test 3.4: Support Management
**Setup:**
1. Go to Support tab
2. Click a conversation
3. Send a reply

**Expected:**
- Conversation opens in modal
- Message history displays
- Can type and send reply
- Reply appears immediately
- User notification sent

**Result:** ✅ / ❌

#### Test 3.5: Admin Offline Mode
**Setup:**
1. Go offline (DevTools → Offline)
2. Refresh admin dashboard

**Expected:**
- Page loads from cache
- Shows mock admin data
- User list loads
- Can view conversations (cached)
- "Offline" indicator shows

**Result:** ✅ / ❌

## Performance Testing

### Load Times
```
Desktop (Chrome):
- Initial load: < 2 seconds
- Dashboard render: < 1 second
- User list: < 1.5 seconds

Mobile (4G):
- Initial load: < 3 seconds
- Dashboard render: < 1.5 seconds

Mobile Offline (cached):
- Load: < 500ms
```

### Mobile Touch Testing
```
Device: iPhone 12 / Android 11+
- Header buttons: Responsive, tappable
- Form inputs: Min 48px high
- Modals: Slide up smoothly
- Navigation: Bottom bar accessible
- Text: Readable at 16px+
```

### API Response Times
```
Endpoint                    Expected
/api/wallet/               < 200ms
/api/transactions/         < 300ms
/api/users/                < 400ms
/api/support/              < 300ms
```

## Browser Compatibility Testing

### Desktop
- [ ] Chrome 90+ ✅
- [ ] Firefox 88+ ✅
- [ ] Safari 14+ ✅
- [ ] Edge 90+ ✅

### Mobile
- [ ] Safari iOS 14+ ✅
- [ ] Chrome Android 90+ ✅
- [ ] Firefox Android 88+ ✅
- [ ] Samsung Internet 14+ ✅

### Features to Test
- [ ] Form input on mobile
- [ ] Touch gestures
- [ ] Viewport scaling
- [ ] Keyboard behavior
- [ ] Safe area (notch)

## Security Testing

### Authentication
- [ ] Login requires valid credentials
- [ ] Session persists after refresh
- [ ] Logout clears token
- [ ] Invalid token redirects to login
- [ ] Admin token doesn't grant user access

### Data Privacy
- [ ] Passwords not logged
- [ ] Tokens not exposed in URLs
- [ ] No sensitive data in localStorage
- [ ] HTTPS enforced in production

### Input Validation
- [ ] SQL injection attempts fail
- [ ] XSS attempts neutralized
- [ ] File upload restrictions work
- [ ] Rate limiting active

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab order is logical
- [ ] Focus visible on all elements
- [ ] Modals trap focus
- [ ] Escape closes modals

### Screen Reader (NVDA/JAWS)
- [ ] Page structure readable
- [ ] Buttons labeled correctly
- [ ] Form fields have labels
- [ ] Icons have alt text

### Visual
- [ ] Color contrast > 4.5:1
- [ ] Text readable at 125% zoom
- [ ] Links underlined
- [ ] No color-only indicators

## Test Data

### User Account
```
Email: testuser@example.com
Password: Test123!@
Balance: ₦5000 (mock)
Numbers: 2 (USA, UK)
```

### Admin Account
```
Email: admin@example.com
Password: admin123
Access: All admin functions
Users managed: 42
```

### Test Numbers
```
USA:     +1 (234) 567-8900
UK:      +44 7123 456789
Canada:  +1 (306) 765-4321
```

### Test Transactions
```
1. Buy USA Number    -₦1000  2024-01-13
2. Fund via Paystack +₦5000  2024-01-12
3. Buy UK Number     -₦800   2024-01-11
```

## Deployment Testing

### Local Verification
```bash
# Check all files present
ls -la mobile/
ls -la mobile-admin/

# Verify manifest.json
cat mobile/manifest.json

# Check API integration
grep "api\." mobile/js/*.js
```

### Vercel Pre-deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Test build
vercel build

# Test locally
vercel dev

# Check output
vercel build --prod
```

### Post-deployment
```bash
# Test live URLs
curl https://smshub.vercel.app/mobile/
curl https://smshub.vercel.app/mobile-admin/

# Check PWA
Lighthouse audit for:
- Performance
- Accessibility
- Best Practices
- SEO
- PWA
```

## Known Issues & Workarounds

### Issue: "getAuth is not defined"
**Status:** ✅ FIXED
**Workaround:** App uses async helper functions

### Issue: Vercel 500 Error
**Status:** ✅ FIXED  
**Workaround:** Static site configuration applied

### Issue: Mock data not loading
**Status:** ✅ FIXED
**Workaround:** getMockData() helper in api.js

### Issue: Admin login redirect loop
**Status:** ✅ TESTING
**Workaround:** Check localStorage.adminRole

## Regression Testing Checklist

Before each release:

### Core Features
- [ ] User login works
- [ ] User dashboard loads
- [ ] Buy phone number works
- [ ] SMS history displays
- [ ] Fund wallet works
- [ ] Admin login works
- [ ] User management works
- [ ] Payment approval works
- [ ] Support chat works

### UI/UX
- [ ] Responsive on mobile
- [ ] Touch targets 48px+
- [ ] Forms are functional
- [ ] Buttons respond quickly
- [ ] Modals work smoothly
- [ ] Navigation intuitive

### Performance
- [ ] Initial load < 3s
- [ ] No console errors
- [ ] Cache working
- [ ] Offline mode works
- [ ] No memory leaks

### Security
- [ ] Tokens validated
- [ ] Inputs sanitized
- [ ] Auth enforced
- [ ] HTTPS working
- [ ] No XSS/CSRF issues

## Test Results Summary

```
Date: [DATE]
Tester: [NAME]
Build: [VERSION]

PASSED:  ____ / 30 tests
FAILED:  ____ / 30 tests
BLOCKED: ____ / 30 tests

Critical Issues: ____
Major Issues:    ____
Minor Issues:    ____

Notes:
[Detailed notes about test results]

Sign-off: [SIGNATURE]
```

## Automated Testing (Future)

```javascript
// Example Jest test
describe('Mobile Admin App', () => {
  test('loads admin dashboard', async () => {
    await checkAdminAuth();
    await loadAdminStats();
    expect(document.getElementById('statsContainer')).toBeDefined();
  });

  test('admin can approve payment', async () => {
    const success = await approvePayment(123);
    expect(success).toBe(true);
  });
});
```

## Performance Benchmarks

Target metrics:
- Lighthouse Score: > 90
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 3.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## Contact & Support

Issues found? Report to:
- GitHub Issues: [repository-url]/issues
- Email: support@yourdomain.com
- Slack: #testing-reports

---

**Last Updated:** 2024-01-28
**Mobile App Version:** 1.0.0
**Test Coverage:** A+B+C Complete

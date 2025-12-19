# DEPLOYMENT CHECKLIST

## Pre-Launch Configuration

### 1. Firebase Setup
- [ ] Create Firebase project at firebase.google.com
- [ ] Enable Email/Password authentication
- [ ] Enable Google Sign-In
- [ ] Create Firestore database
- [ ] Create these collections:
  - [ ] `users`
  - [ ] `numbers`
  - [ ] `transactions`
  - [ ] `pendingPayments`
- [ ] Copy Firebase config to `js/firebase-config.js`
- [ ] Set up Firestore security rules
- [ ] Enable Firebase Storage (for proof images)
- [ ] Create Firebase Cloud Functions project

### 2. Paystack Configuration
- [ ] Create Paystack account at paystack.com
- [ ] Copy Public Key to `js/paystack.js` (line 4)
- [ ] Copy Secret Key for backend
- [ ] Generate webhook secret
- [ ] Set webhook URL to: `https://yourdomain.com/api/webhooks/paystack`
- [ ] Test with Paystack test card: 4084 0343 5010 3889
- [ ] Switch to live mode when ready

### 3. 5sim Configuration
- [ ] Create 5sim account at 5sim.net
- [ ] Generate API key
- [ ] Copy to `js/fivesim.js` (line 6)
- [ ] Set webhook URL to: `https://yourdomain.com/api/webhooks/5sim`
- [ ] Test number purchasing with test account
- [ ] Set up SMS forwarding webhook
- [ ] Test SMS receiving flow

### 4. Admin Setup
- [ ] Change admin credentials in `admin-login.html`
- [ ] Create secure admin password (min 8 chars)
- [ ] Test admin login
- [ ] Create additional admin users if needed
- [ ] Document admin credentials securely

### 5. Email Service Setup
- [ ] Choose email provider (SendGrid, Firebase, etc.)
- [ ] Get API key
- [ ] Create email templates for:
  - [ ] Password reset
  - [ ] Transaction confirmation
  - [ ] SMS received notification
  - [ ] Payment verification
  - [ ] Referral bonus
- [ ] Test email sending

### 6. Bank Account Configuration
- [ ] Verify GTB account number in `fund-wallet.html`
- [ ] Update bank account holder name
- [ ] Add bank details to admin documentation

### 7. PalmPay Configuration
- [ ] Verify account number: 9155359202
- [ ] Update if using different account
- [ ] Set up proof upload storage
- [ ] Test file upload functionality

---

## Testing Checklist

### User Flows
- [ ] User registration & login
- [ ] Email verification
- [ ] Google sign-in
- [ ] Password reset
- [ ] Profile editing
- [ ] Avatar upload

### Number Purchasing
- [ ] Browse available numbers
- [ ] Search by country
- [ ] Filter by service
- [ ] View pricing
- [ ] Purchase number
- [ ] Receive purchase confirmation

### SMS Management
- [ ] View received SMS
- [ ] Auto-refresh SMS
- [ ] Copy phone number
- [ ] Extend number duration
- [ ] View expired numbers

### Wallet Funding
- [ ] Paystack payment flow
  - [ ] Enter amount
  - [ ] Complete payment
  - [ ] Verify transaction
  - [ ] Balance updates
- [ ] PalmPay flow
  - [ ] Manual transfer
  - [ ] Proof upload
  - [ ] Admin approval
  - [ ] Balance updates
- [ ] Bank transfer flow
  - [ ] View bank details
  - [ ] Manual transfer
  - [ ] Pending payment
  - [ ] Verification

### User Account
- [ ] Edit profile
- [ ] Change password
- [ ] View transaction history
- [ ] Export transactions (CSV/PDF)
- [ ] View referral code
- [ ] Copy referral link
- [ ] View referral earnings

### Admin Panel
- [ ] Admin login
- [ ] View dashboard metrics
- [ ] View user list
- [ ] Search users
- [ ] Edit user balance
- [ ] Suspend/activate user
- [ ] Approve pending payments
- [ ] View system status

### Support
- [ ] Search FAQ
- [ ] Open WhatsApp
- [ ] Send email
- [ ] Live chat (if integrated)
- [ ] Page loads without auth

### Responsive Design
- [ ] Mobile (480px)
  - [ ] All pages readable
  - [ ] Forms touchable
  - [ ] Modals functional
- [ ] Tablet (768px)
  - [ ] Layout correct
  - [ ] Buttons accessible
  - [ ] Tables scrollable
- [ ] Desktop (1024px+)
  - [ ] Full layout
  - [ ] All features visible
  - [ ] Performance good

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up Firestore security rules
- [ ] Validate all user inputs
- [ ] Hash passwords (Firebase handles)
- [ ] Protect API keys
- [ ] Use environment variables
- [ ] Set up rate limiting
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Monitor for suspicious activity
- [ ] Backup database regularly
- [ ] Test account deletion
- [ ] Test session timeouts
- [ ] Verify email validation

---

## Performance Checklist

- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] No console errors
- [ ] No console warnings
- [ ] Memory usage normal
- [ ] Smooth scrolling
- [ ] Modal animations smooth
- [ ] Form submission responsive
- [ ] Database queries optimized
- [ ] Caching configured
- [ ] CDN enabled for assets

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari
- [ ] Samsung Internet

---

## Deployment Steps

### 1. Code Preparation
- [ ] All sensitive info removed
- [ ] API keys in environment variables
- [ ] Debug console.log removed
- [ ] Mock data cleaned up
- [ ] Error handling complete

### 2. Choose Hosting
- [ ] Firebase Hosting (recommended)
- [ ] Vercel
- [ ] Netlify
- [ ] Traditional VPS
- [ ] Custom server

### 3. Domain Configuration
- [ ] Domain purchased
- [ ] DNS records configured
- [ ] SSL certificate installed
- [ ] Subdomain setup (if needed)
- [ ] Email MX records added

### 4. Database Migration
- [ ] Firestore collections created
- [ ] Security rules deployed
- [ ] Indexes created
- [ ] Backups configured
- [ ] Test data loaded

### 5. Deployment
- [ ] Code pushed to repository
- [ ] Build process tested
- [ ] Environment variables set
- [ ] Database connected
- [ ] APIs connected
- [ ] Webhooks configured
- [ ] Email service connected

### 6. Post-Deployment
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] APIs responding
- [ ] Database connected
- [ ] Email sending
- [ ] Payments working
- [ ] Analytics tracking
- [ ] Error logging active

---

## Monitoring Setup

- [ ] Google Analytics configured
- [ ] Error logging enabled
- [ ] Uptime monitoring active
- [ ] Database monitoring on
- [ ] API performance tracked
- [ ] Email delivery tracked
- [ ] Payment tracking
- [ ] SMS delivery logs
- [ ] User activity logs
- [ ] Admin activity logs

---

## Launch Announcement

- [ ] Prepare launch email
- [ ] Create social media posts
- [ ] Update website/landing
- [ ] Send to early users
- [ ] Request feedback
- [ ] Monitor for issues
- [ ] Be ready for support

---

## Post-Launch Tasks

### Week 1
- [ ] Monitor for bugs
- [ ] Fix critical issues
- [ ] Respond to user support
- [ ] Check analytics
- [ ] Review payment processing
- [ ] Test SMS delivery

### Month 1
- [ ] Gather user feedback
- [ ] Fix reported bugs
- [ ] Optimize performance
- [ ] Plan improvements
- [ ] Review security logs
- [ ] Update documentation

### Ongoing
- [ ] Regular backups
- [ ] Security updates
- [ ] Performance monitoring
- [ ] User support
- [ ] Feature improvements
- [ ] Analytics review

---

## Troubleshooting Guide

### Firebase Not Connecting
- [ ] Check internet connection
- [ ] Verify API key
- [ ] Check Firestore enabled
- [ ] Check security rules
- [ ] Verify database URL

### Paystack Payment Fails
- [ ] Check Public Key
- [ ] Verify card valid
- [ ] Check amount >= ₦100
- [ ] Verify account active
- [ ] Check API endpoint

### 5sim Numbers Not Loading
- [ ] Check API key
- [ ] Verify account has balance
- [ ] Check country supported
- [ ] Verify service available
- [ ] Check rate limits

### Admin Login Fails
- [ ] Check localStorage
- [ ] Verify credentials
- [ ] Clear browser cache
- [ ] Try incognito mode
- [ ] Check browser storage

### SMS Not Received
- [ ] Check webhook URL
- [ ] Verify webhook secret
- [ ] Check API logs
- [ ] Test with 5sim directly
- [ ] Verify number active

---

## Rollback Plan

If issues occur:

1. **Immediate Actions**
   - [ ] Disable affected features
   - [ ] Post status update
   - [ ] Notify admins

2. **Investigation**
   - [ ] Check error logs
   - [ ] Review recent changes
   - [ ] Test in development
   - [ ] Identify root cause

3. **Fix**
   - [ ] Implement fix
   - [ ] Test thoroughly
   - [ ] Deploy updated code
   - [ ] Monitor closely

4. **Communication**
   - [ ] Update users
   - [ ] Explain issue
   - [ ] Share ETA for fix
   - [ ] Post resolution

---

## Sign-Off

- [ ] Project lead approval
- [ ] CTO/technical approval
- [ ] Security audit passed
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Ready for production

---

**Project:** Prime SMS Hub  
**Version:** 1.0.0  
**Date:** February 2024  
**Status:** Ready for Deployment Checklist

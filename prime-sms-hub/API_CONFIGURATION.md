# API Configuration & Reference Guide

## 🔑 Configuration Files to Update

### 1. Firebase Configuration
**File:** `js/firebase-config.js`

```javascript
const firebaseConfig = {
    apiKey: "YOUR_WEB_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**Where to get credentials:**
1. Go to Firebase Console (console.firebase.google.com)
2. Create new project or select existing
3. Go to Settings → Service Accounts
4. Copy Web API credentials

---

### 2. Paystack Configuration
**File:** `js/paystack.js`

```javascript
// Line 4
const PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY_HERE';

// Line 5 (in verifyPaystackPayment function)
const PAYSTACK_SECRET_KEY = 'YOUR_PAYSTACK_SECRET_KEY_HERE';
```

**How to set up:**
1. Create account at paystack.com
2. Go to Settings → API Keys
3. Copy Public Key (for frontend)
4. Copy Secret Key (for backend)
5. Add webhook URL: `https://yourdomain.com/api/paystack-webhook`

**Webhook Handler Location:** Backend function needed

---

### 3. 5sim API Configuration
**File:** `js/fivesim.js`

```javascript
// Line 6
const FIVESIM_API_KEY = 'your_5sim_api_key_here';

// Line 9
const FIVESIM_BASE_URL = 'https://5sim.net/v1';
```

**How to set up:**
1. Create account at 5sim.net
2. Go to Settings → API
3. Generate API key
4. Set webhook URL: `https://yourdomain.com/api/5sim-webhook`

**Webhook Handler Location:** Backend function for SMS receiving

---

### 4. Admin Credentials
**File:** `admin-login.html`

```javascript
// Line 53-56
const ADMIN_CREDENTIALS = {
    email: 'admin@primesmshub.com',
    password: 'Admin@12345'
};
```

**Change these to your secure admin credentials**

---

## 📡 API Endpoints

### Paystack Endpoints
```
// Verify Payment
GET https://api.paystack.co/transaction/verify/{reference}
Headers: Authorization: Bearer {SECRET_KEY}

Response:
{
    "status": "success",
    "message": "Authorization URL created",
    "data": {
        "reference": "ref123",
        "amount": 50000,
        "status": "success",
        "customer": {...}
    }
}
```

### 5sim Endpoints
```
// Get Available Numbers
GET https://5sim.net/v1/numbers/{country}/{service}
Headers: Authorization: Bearer {API_KEY}

// Check SMS
GET https://5sim.net/v1/sms/{purchase_id}
Headers: Authorization: Bearer {API_KEY}

// Expire Number
POST https://5sim.net/v1/sms/{purchase_id}/finish
Headers: Authorization: Bearer {API_KEY}
```

---

## 🔄 Webhook URLs to Configure

### Paystack Webhook
**URL:** `https://yourdomain.com/api/webhooks/paystack`
**Method:** POST
**Headers:** `x-paystack-signature`

**Events to listen:**
- `charge.success` - Payment successful
- `charge.failed` - Payment failed

### 5sim Webhook
**URL:** `https://yourdomain.com/api/webhooks/5sim`
**Method:** POST

**Events to listen:**
- `sms_received` - New SMS message
- `number_expired` - Number expired

---

## 💾 Firestore Collections Setup

### 1. Create `users` Collection
```
Collection: users
Document ID: {userId from Firebase Auth}

Fields:
- email (string)
- name (string)
- phone (string)
- country (string)
- balance (number) - in kobo
- referralCode (string)
- referralCount (number)
- referralEarnings (number)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### 2. Create `numbers` Collection
```
Collection: numbers
Document ID: Auto-generated

Fields:
- userId (string)
- phoneNumber (string)
- country (string)
- service (string)
- purchaseId (string)
- purchasePrice (number)
- status (string: active/expired)
- expiresAt (timestamp)
- sms (array)
  - from (string)
  - text (string)
  - receivedAt (timestamp)
  - read (boolean)
- createdAt (timestamp)
```

### 3. Create `transactions` Collection
```
Collection: transactions
Document ID: Auto-generated

Fields:
- userId (string)
- type (string: credit/debit)
- amount (number)
- status (string: completed/pending)
- paymentMethod (string)
- reference (string)
- description (string)
- createdAt (timestamp)
```

### 4. Create `pendingPayments` Collection
```
Collection: pendingPayments
Document ID: Auto-generated

Fields:
- userId (string)
- amount (number)
- method (string: palmpay/bank)
- reference (string)
- proofImageUrl (string)
- status (string: pending/approved/rejected)
- adminNotes (string)
- createdAt (timestamp)
- approvedAt (timestamp)
```

---

## 🔐 Security Rules Template

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Numbers - users can read their own
    match /numbers/{numberDocument=**} {
      allow read: if request.auth.uid == resource.data.userId;
    }

    // Transactions - users can read their own
    match /transactions/{transactionDocument=**} {
      allow read: if request.auth.uid == resource.data.userId;
    }

    // Pending payments - admin only
    match /pendingPayments/{paymentDocument=**} {
      allow read: if request.auth.token.admin == true;
      allow write: if false;
    }
  }
}
```

**To set security rules:**
1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database → Rules
4. Paste rules above
5. Publish

---

## 🚀 Environment Variables

Create `.env` file (for backend):
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email@firebase.gserviceaccount.com

PAYSTACK_SECRET_KEY=YOUR_PAYSTACK_SECRET_KEY_HERE
PAYSTACK_PUBLIC_KEY=YOUR_PAYSTACK_PUBLIC_KEY_HERE

FIVESIM_API_KEY=your_api_key
5SIM_WEBHOOK_SECRET=your_webhook_secret

PALMPAY_ACCOUNT=9155359202
BANK_ACCOUNT_NUMBER=0012345678
BANK_NAME=Guaranty Trust Bank (GTB)

JWT_SECRET=your_jwt_secret
NODE_ENV=production
APP_URL=https://yourdomain.com
```

---

## 🧪 Testing Credentials

### Paystack Test Mode
```
Test Card: 4084 0343 5010 3889
CVV: 408
Expiry: 12/25
OTP: 123456
```

### Firebase Emulator (Local Testing)
```bash
firebase emulators:start
# Runs at http://localhost:4000
```

---

## 📊 Payment Processing Flow

### Paystack Flow
```
1. User enters amount → frontend
2. Frontend calls initializePaystackPayment()
3. Paystack popup opens
4. User enters card details
5. Paystack processes payment
6. Callback to frontend with reference
7. Frontend verifies with backend
8. Backend calls Paystack API to verify
9. Backend creates transaction record
10. Frontend updates balance
```

### PalmPay Flow
```
1. User enters amount → frontend
2. Frontend shows transfer instructions
3. User transfers to 9155359202
4. User uploads payment proof
5. Frontend creates pendingPayment record
6. Admin reviews in admin panel
7. Admin approves payment
8. Backend updates user balance
9. Frontend notifies user
```

---

## 🔄 SMS Receiving Flow

### Webhook Handler Example
```javascript
// Handler for POST to /api/webhooks/5sim
app.post('/api/webhooks/5sim', async (req, res) => {
    const { purchase_id, phone_from, text, timestamp } = req.body;
    
    // Find number by purchaseId
    const number = await db.collection('numbers')
        .where('purchaseId', '==', purchase_id)
        .limit(1)
        .get();
    
    if (number.empty) {
        return res.status(404).send('Number not found');
    }
    
    // Add SMS to array
    const numberDoc = number.docs[0];
    await numberDoc.ref.update({
        sms: firebase.firestore.FieldValue.arrayUnion({
            from: phone_from,
            text: text,
            receivedAt: new Date(timestamp * 1000),
            read: false
        })
    });
    
    // Send email notification to user
    const userData = await db.collection('users')
        .doc(numberDoc.data().userId).get();
    
    sendEmail(userData.data().email, 
        `New SMS received on ${numberDoc.data().phoneNumber}`,
        `From: ${phone_from}\n\n${text}`
    );
    
    res.status(200).send('SMS received');
});
```

---

## 📈 Monitoring & Logging

### Log Important Events
```javascript
// In your Firebase Cloud Function
console.log('Payment received', {
    userId: user.uid,
    amount: amount,
    method: 'paystack',
    timestamp: new Date(),
    reference: reference
});

// Track in Firestore
await db.collection('logs').add({
    type: 'payment',
    userId: user.uid,
    amount: amount,
    status: 'success',
    timestamp: new Date()
});
```

---

## 🆘 Troubleshooting

### Firebase Not Connected
- Check internet connection
- Verify API key is correct
- Check Firestore Database is enabled
- Check Security Rules allow your app

### Paystack Payment Fails
- Verify PAYSTACK_PUBLIC_KEY is correct
- Check card is not expired
- Check amount is minimum ₦100
- Check Paystack account is activated

### 5sim Numbers Not Showing
- Verify FIVESIM_API_KEY is correct
- Check 5sim account has credit
- Verify country/service combination is valid
- Check API rate limits

### Admin Login Fails
- Check admin credentials in admin-login.html
- Clear localStorage and retry
- Verify browser allows localStorage

---

## 📞 API Support

- **Paystack Support:** https://paystack.com/support
- **5sim Support:** https://5sim.net/contact
- **Firebase Support:** https://firebase.google.com/support

---

**Last Updated:** February 2024
**Version:** 1.0.0

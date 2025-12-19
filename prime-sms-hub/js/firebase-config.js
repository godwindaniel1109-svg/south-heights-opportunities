// ========================================
// FIREBASE CONFIGURATION
// ========================================

// Load Firebase SDK from CDN
if (!window.firebase) {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    document.head.appendChild(script);
}

const firebaseConfig = {
    apiKey: "AIzaSyD8ljUFvRZmGajh4UTfh6zfb85OnHanoGM",
    authDomain: "prime-sms-hub.firebaseapp.com",
    projectId: "prime-sms-hub",
    storageBucket: "prime-sms-hub.firebasestorage.app",
    messagingSenderId: "789181833042",
    appId: "1:789181833042:web:c2b063e001c484856a248b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ========================================
// FIRESTORE COLLECTIONS STRUCTURE
// ========================================

/**
 * Collections:
 * 
 * 1. users/{userId}
 *    - email: string
 *    - name: string
 *    - balance: number (in kobo)
 *    - createdAt: timestamp
 *    - referralCode: string
 *    - status: 'active' | 'suspended'
 * 
 * 2. numbers/{numberId}
 *    - userId: string
 *    - phoneNumber: string
 *    - country: string
 *    - service: string
 *    - purchaseId: string (5sim ID)
 *    - price: number
 *    - status: 'active' | 'expired'
 *    - expiresAt: timestamp
 *    - createdAt: timestamp
 *    - sms: array
 * 
 * 3. transactions/{transactionId}
 *    - userId: string
 *    - type: 'deposit' | 'purchase' | 'refund'
 *    - amount: number
 *    - status: 'completed' | 'failed'
 *    - paymentMethod: 'paystack' | 'palmpay'
 *    - reference: string
 *    - createdAt: timestamp
 * 
 * 4. pendingPayments/{paymentId}
 *    - userId: string
 *    - amount: number
 *    - proofImage: string (URL)
 *    - status: 'pending' | 'approved'
 *    - createdAt: timestamp
 */

// ========================================
// AUTH HELPER FUNCTIONS
// ========================================

async function getCurrentUser() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            resolve(user);
        });
    });
}

async function getUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

async function updateUserBalance(userId, amount) {
    try {
        await db.collection('users').doc(userId).update({
            balance: firebase.firestore.FieldValue.increment(amount)
        });
        return true;
    } catch (error) {
        console.error('Error updating balance:', error);
        return false;
    }
}

// ========================================
// TRANSACTION FUNCTIONS
// ========================================

async function createTransaction(userId, type, amount, paymentMethod, reference) {
    try {
        const transactionId = db.collection('transactions').doc().id;
        await db.collection('transactions').doc(transactionId).set({
            userId,
            type,
            amount,
            status: 'completed',
            paymentMethod,
            reference,
            createdAt: new Date()
        });
        return transactionId;
    } catch (error) {
        console.error('Error creating transaction:', error);
        return null;
    }
}

async function getTransactions(userId, limit = 50) {
    try {
        const snapshot = await db.collection('transactions')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting transactions:', error);
        return [];
    }
}

// ========================================
// NUMBERS FUNCTIONS
// ========================================

async function saveNumber(userId, phoneNumber, country, service, purchaseId, price) {
    try {
        const numberId = db.collection('numbers').doc().id;
        await db.collection('numbers').doc(numberId).set({
            userId,
            phoneNumber,
            country,
            service,
            purchaseId,
            price,
            status: 'active',
            expiresAt: new Date(Date.now() + 20 * 60000),
            createdAt: new Date(),
            sms: []
        });
        return numberId;
    } catch (error) {
        console.error('Error saving number:', error);
        return null;
    }
}

async function getUserNumbers(userId) {
    try {
        const snapshot = await db.collection('numbers')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting numbers:', error);
        return [];
    }
}

async function addSMSToNumber(numberId, smsData) {
    try {
        await db.collection('numbers').doc(numberId).update({
            sms: firebase.firestore.FieldValue.arrayUnion({
                ...smsData,
                receivedAt: new Date()
            })
        });
        return true;
    } catch (error) {
        console.error('Error adding SMS:', error);
        return false;
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatBalance(kobo) {
    return '₦' + (kobo / 100).toFixed(2);
}

function koboToNaira(kobo) {
    return kobo / 100;
}

function nairaToKobo(naira) {
    return Math.round(naira * 100);
}
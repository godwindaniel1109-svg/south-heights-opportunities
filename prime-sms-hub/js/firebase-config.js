// ========================================
// FIREBASE CONFIGURATION
// ========================================

// Hide Firebase internal errors from users - wrap console.error
const originalError = console.error;
console.error = function(...args) {
    const msg = args[0]?.toString() || '';
    // Hide Firebase/internal errors from users, but log for debugging
    if (msg.includes('Firebase') || msg.includes('firestore') || msg.includes('auth')) {
        // Log to browser console for dev, but don't show in UI
        originalError.apply(console, ['[Internal]', ...args]);
    } else {
        originalError.apply(console, args);
    }
};

// Load Firebase SDKs and initialize safely
(function(){
    const libs = [
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js',
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js'
    ];
    libs.forEach(src => {
        if (!document.querySelector(`script[src="${src}"]`)) {
            const s = document.createElement('script'); s.src = src; document.head.appendChild(s);
        }
    });
    const check = setInterval(() => {
        if (window.firebase && firebase.auth) {
            clearInterval(check);
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            window.auth = firebase.auth();
            window.db = firebase.firestore();
            window.storage = firebase.storage();
        }
    }, 100);
})();

const firebaseConfig = {
  apiKey: "AIzaSyDoJYqyAwFbG0ZKuEQzJSlwucQjQwTmmMo",
  authDomain: "primesmshub-24c8b.firebaseapp.com",
  projectId: "primesmshub-24c8b",
  storageBucket: "primesmshub-24c8b.firebasestorage.app",
  messagingSenderId: "546449049036",
  appId: "1:546449049036:web:4663a2846e0da751d24969"
};

// Initialize (will also be done by loader above); expose lazy vars
const auth = window.auth || (window.firebase && firebase.auth && firebase.auth());
const db = window.db || (window.firebase && firebase.firestore && firebase.firestore());
const storage = window.storage || (window.firebase && firebase.storage && firebase.storage());

// Compatibility helpers for code that expects the modular Firebase API (getAuth/getDB/getStorage)
function getAuth(){
    if (typeof auth !== 'undefined' && auth) return auth;
    if (window.firebase && firebase.auth) return firebase.auth();
    throw new Error('Firebase Auth not initialized');
}
function getDB(){
    if (typeof db !== 'undefined' && db) return db;
    if (window.firebase && firebase.firestore) return firebase.firestore();
    throw new Error('Firestore not initialized');
}
function getStorage(){
    if (typeof storage !== 'undefined' && storage) return storage;
    if (window.firebase && firebase.storage) return firebase.storage();
    throw new Error('Firebase Storage not initialized');

// Async initializers that wait for Firebase to be ready
// Configurable init timeout (ms). Override by setting window.FIREBASE_INIT_TIMEOUT_MS
window.FIREBASE_INIT_TIMEOUT_MS = window.FIREBASE_INIT_TIMEOUT_MS || 8000;

function getAuthAsync(timeout = window.FIREBASE_INIT_TIMEOUT_MS, signal) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        if (signal && signal.aborted) return reject(new Error('Auth init cancelled'));
        const onAbort = () => { reject(new Error('Auth init cancelled')); };
        if (signal) signal.addEventListener('abort', onAbort, { once: true });
        (function check() {
            if ((typeof auth !== 'undefined' && auth) || (window.firebase && firebase.auth)) {
                if (signal) signal.removeEventListener('abort', onAbort);
                return resolve((typeof auth !== 'undefined' && auth) ? auth : firebase.auth());
            }
            if (signal && signal.aborted) {
                if (signal) signal.removeEventListener('abort', onAbort);
                return reject(new Error('Auth init cancelled'));
            }
            if (Date.now() - start > timeout) {
                if (signal) signal.removeEventListener('abort', onAbort);
                return reject(new Error('Auth init timeout'));
            }
            setTimeout(check, 100);
        })();
    });
}
function getDBAsync(timeout = window.FIREBASE_INIT_TIMEOUT_MS, signal) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        if (signal && signal.aborted) return reject(new Error('Firestore init cancelled'));
        const onAbort = () => { reject(new Error('Firestore init cancelled')); };
        if (signal) signal.addEventListener('abort', onAbort, { once: true });
        (function check() {
            if ((typeof db !== 'undefined' && db) || (window.firebase && firebase.firestore)) {
                if (signal) signal.removeEventListener('abort', onAbort);
                return resolve((typeof db !== 'undefined' && db) ? db : firebase.firestore());
            }
            if (signal && signal.aborted) {
                if (signal) signal.removeEventListener('abort', onAbort);
                return reject(new Error('Firestore init cancelled'));
            }
            if (Date.now() - start > timeout) {
                if (signal) signal.removeEventListener('abort', onAbort);
                return reject(new Error('Firestore init timeout'));
            }
            setTimeout(check, 100);
        })();
    });
}
} 

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
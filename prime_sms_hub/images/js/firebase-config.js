// ================================
// FIREBASE CONFIGURATION
// ================================

// Your Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8ljUFvRZmGajh4UTfh6zfb85OnHanoGM",
    authDomain: "prime-sms-hub.firebaseapp.com",
    projectId: "prime-sms-hub",
    storageBucket: "prime-sms-hub.firebasestorage.app",
    messagingSenderId: "789181833042",
    appId: "1:789181833042:web:c2b063e001c484856a248b"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other files
window.firebase = firebase;
window.auth = auth;
window.db = db;
window.storage = storage;

// ================================
// FIREBASE AUTH STATE LISTENER
// ================================
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User authenticated:', user.email);
        
        // Update user info in UI
        if (typeof updateUserInfo === 'function') {
            updateUserInfo(user);
        }
        
        // Load user data
        if (typeof loadUserData === 'function') {
            loadUserData(user.uid);
        }
        
    } else {
        // User is signed out
        console.log('User not authenticated, redirecting to login...');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
});

// ================================
// UTILITY FUNCTIONS
// ================================

// Show Toast Message
function showToast(message, type = 'success') {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    switch (type) {
        case 'success':
            toastr.success(message);
            break;
        case 'error':
            toastr.error(message);
            break;
        case 'warning':
            toastr.warning(message);
            break;
        case 'info':
            toastr.info(message);
            break;
        default:
            toastr.success(message);
    }
}

// Format Currency
function formatCurrency(amount, currency = 'NGN') {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

// Format Date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Generate Order ID
function generateOrderId() {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Validate Phone Number
function validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
}

// Validate Email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show Loading
function showLoading(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
    }
}

// Hide Loading
function hideLoading(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// ================================
// FIREBASE OPERATIONS
// ================================

// Get User Document
async function getUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            return doc.data();
        } else {
            console.log('No user document found');
            return null;
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
}

// Update User Document
async function updateUserDocument(userId, data) {
    try {
        await db.collection('users').doc(userId).update(data);
        return true;
    } catch (error) {
        console.error('Error updating user document:', error);
        throw error;
    }
}

// Create Order
async function createOrder(orderData) {
    try {
        const orderId = generateOrderId();
        const orderRef = db.collection('orders').doc(orderId);
        
        await orderRef.set({
            ...orderData,
            orderId: orderId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return orderId;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// Get User Orders
async function getUserOrders(userId) {
    try {
        const snapshot = await db.collection('orders')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting user orders:', error);
        throw error;
    }
}

// Get User Numbers
async function getUserNumbers(userId) {
    try {
        const snapshot = await db.collection('numbers')
            .where('userId', '==', userId)
            .where('status', '==', 'active')
            .orderBy('purchasedAt', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting user numbers:', error);
        throw error;
    }
}

// Get Available Numbers
async function getAvailableNumbers(filters = {}) {
    try {
        let query = db.collection('available_numbers')
            .where('status', '==', 'available');
        
        // Apply filters
        if (filters.country) {
            query = query.where('country', '==', filters.country);
        }
        
        if (filters.service) {
            query = query.where('service', '==', filters.service);
        }
        
        // Apply sorting
        if (filters.sortBy === 'price_asc') {
            query = query.orderBy('price', 'asc');
        } else if (filters.sortBy === 'price_desc') {
            query = query.orderBy('price', 'desc');
        } else {
            query = query.orderBy('popularity', 'desc');
        }
        
        const snapshot = await query.limit(100).get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting available numbers:', error);
        throw error;
    }
}

// ================================
// INITIALIZATION
// ================================
console.log('FireBase configuration loaded successfully');

// Make functions globally available
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.generateOrderId = generateOrderId;
window.validatePhoneNumber = validatePhoneNumber;
window.validateEmail = validateEmail;
window.getUserData = getUserData;
window.updateUserDocument = updateUserDocument;
window.createOrder = createOrder;
window.getUserOrders = getUserOrders;
window.getUserNumbers = getUserNumbers;
window.getAvailableNumbers = getAvailableNumbers;
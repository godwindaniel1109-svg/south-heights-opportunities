/**
 * ============================================
 * Frontend Configuration Example
 * ============================================
 * Copy this file to config.js (it will be gitignored)
 * and fill in your actual API keys and configuration
 * 
 * NEVER commit config.js to git - it contains sensitive information
 */

// Firebase Configuration
const FIREBASE_CONFIG = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

// Paystack Configuration
const PAYSTACK_PUBLIC_KEY = 'pk_test_YOUR_PUBLIC_KEY_HERE';

// 5SIM API Configuration  
const FIVESIM_API_KEY = 'YOUR_5SIM_API_KEY_HERE';

// Backend API Configuration
const API_BASE_URL = window.location.origin + '/api'; // Default: same origin
// For production with separate backend:
// const API_BASE_URL = 'https://api.yourdomain.com/api';

// Service Charge (in Naira)
const SERVICE_CHARGE = 5;

// Currency Exchange Rate (USD to NGN)
const NGN_EXCHANGE_RATE = 1200;

// Markup Factor (multiplier for pricing)
const MARKUP_FACTOR = 2;
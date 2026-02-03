/**
 * ============================================
 * Configuration Loader
 * ============================================
 * 
 * This file loads configuration from config.js if it exists,
 * otherwise falls back to default/example values.
 * 
 * For new developers:
 * 1. Copy config.example.js to config.js
 * 2. Fill in your actual API keys
 * 3. config.js is gitignored and won't be committed
 */

// Try to load config.js (will be undefined if file doesn't exist)
let userConfig = {};
try {
    // This will be loaded via a script tag if config.js exists
    if (typeof window.USER_CONFIG !== 'undefined') {
        userConfig = window.USER_CONFIG;
    }
} catch (e) {
    console.warn('Config file not found, using defaults. Copy config.example.js to config.js');
}

// Default/fallback configuration
const DEFAULT_CONFIG = {
    FIREBASE_CONFIG: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abc123"
    },
    PAYSTACK_PUBLIC_KEY: 'pk_test_YOUR_PUBLIC_KEY_HERE',
    FIVESIM_API_KEY: 'YOUR_5SIM_API_KEY_HERE',
    API_BASE_URL: window.location.origin + '/api',
    SERVICE_CHARGE: 5,
    NGN_EXCHANGE_RATE: 1200,
    MARKUP_FACTOR: 2
};

// Merge user config with defaults (user config takes precedence)
const CONFIG = {
    FIREBASE_CONFIG: userConfig.FIREBASE_CONFIG || DEFAULT_CONFIG.FIREBASE_CONFIG,
    PAYSTACK_PUBLIC_KEY: userConfig.PAYSTACK_PUBLIC_KEY || DEFAULT_CONFIG.PAYSTACK_PUBLIC_KEY,
    FIVESIM_API_KEY: userConfig.FIVESIM_API_KEY || DEFAULT_CONFIG.FIVESIM_API_KEY,
    API_BASE_URL: userConfig.API_BASE_URL || DEFAULT_CONFIG.API_BASE_URL,
    SERVICE_CHARGE: userConfig.SERVICE_CHARGE || DEFAULT_CONFIG.SERVICE_CHARGE,
    NGN_EXCHANGE_RATE: userConfig.NGN_EXCHANGE_RATE || DEFAULT_CONFIG.NGN_EXCHANGE_RATE,
    MARKUP_FACTOR: userConfig.MARKUP_FACTOR || DEFAULT_CONFIG.MARKUP_FACTOR
};

// Export config for use in other files
window.APP_CONFIG = CONFIG;

// Warn if using default values (likely means config.js is missing)
if (!userConfig.FIREBASE_CONFIG || !userConfig.PAYSTACK_PUBLIC_KEY || !userConfig.FIVESIM_API_KEY) {
    console.warn('⚠️ Using default configuration. Create config.js from config.example.js for production.');
}
/* ========================================
   5SIM API INTEGRATION
   ======================================== */

// 5sim API configuration
const FIVESIM_BASE_URL = 'https://5sim.net/v1';
const FIVESIM_API_KEY = 'your_5sim_api_key_here'; // Replace with your actual API key

// Service types supported by 5sim
const FIVESIM_SERVICES = {
    'telegram': 'Telegram',
    'whatsapp': 'WhatsApp',
    'discord': 'Discord',
    'google': 'Google',
    'twitter': 'Twitter',
    'facebook': 'Facebook',
    'instagram': 'Instagram'
};

// Country pricing from 5sim (example prices in USD)
const FIVESIM_PRICING = {
    'gb': { country: 'United Kingdom', flag: '🇬🇧', services: { telegram: 0.95, whatsapp: 0.95, discord: 0.95 } },
    'us': { country: 'United States', flag: '🇺🇸', services: { telegram: 1.50, whatsapp: 1.50, discord: 1.50 } },
    'fr': { country: 'France', flag: '🇫🇷', services: { telegram: 0.95, whatsapp: 0.95, discord: 0.95 } },
    'de': { country: 'Germany', flag: '🇩🇪', services: { telegram: 0.95, whatsapp: 0.95, discord: 0.95 } },
    'it': { country: 'Italy', flag: '🇮🇹', services: { telegram: 0.80, whatsapp: 0.80, discord: 0.80 } },
    'es': { country: 'Spain', flag: '🇪🇸', services: { telegram: 0.85, whatsapp: 0.85, discord: 0.85 } },

    'au': { country: 'Australia', flag: '🇦🇺', services: { telegram: 1.10, whatsapp: 1.10, discord: 1.10 } },
    'in': { country: 'India', flag: '🇮🇳', services: { telegram: 0.45, whatsapp: 0.45, discord: 0.45 } },
    'br': { country: 'Brazil', flag: '🇧🇷', services: { telegram: 0.55, whatsapp: 0.55, discord: 0.55 } }
};

/**
 * Get available numbers from 5sim for a country and service
 * @param {string} country - Country code (e.g., 'us', 'gb')
 * @param {string} service - Service type (e.g., 'telegram', 'whatsapp')
 * @returns {Promise<Array>} Array of available numbers
 */
async function getAvailableNumbers(country, service) {
    try {
        // Attempt to fetch from backend API first
        try {
            const params = new URLSearchParams();
            if (country) params.set('country', country);
            if (service) params.set('service', service);
            const res = await fetch(`/api/phone-numbers/available_numbers/?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                // If backend returns an object, try to normalize to an array
                if (Array.isArray(data)) return data;
                // else try to aggregate lists
                const lists = Object.values(data).filter(v => Array.isArray(v));
                if (lists.length) return lists.flat();
            }
        } catch (err) {
            console.warn('Backend available_numbers failed, falling back to client mock', err);
        }

        // Fallback: return mock data
        const countryData = FIVESIM_PRICING[country];
        if (!countryData) {
            throw new Error(`Country ${country} not supported`);
        }

        const servicePrice = countryData.services[service];
        if (!servicePrice) {
            throw new Error(`Service ${service} not available for ${country}`);
        }

        // Mock API response
        const mockNumbers = [];
        for (let i = 0; i < 5; i++) {
            const areaCode = generateAreaCode(country);
            const number = generatePhoneNumber(country, areaCode);
            mockNumbers.push({
                id: `5sim_${Date.now()}_${i}`,
                phone: number,
                country: country,
                service: service,
                price: servicePrice,
                status: 'available'
            });
        }

        console.log(`Retrieved ${mockNumbers.length} available numbers for ${country}/${service} (mock)`);
        return mockNumbers;
    } catch (error) {
        console.error('Error getting available numbers:', error);
        throw error;
    }
}

/**
 * Purchase a number from 5sim
 * @param {string} phoneNumber - Phone number to purchase
 * @param {string} country - Country code
 * @param {string} service - Service type
 * @param {number} durationDays - Duration in days (default 20 minutes = 0.014 days)
 * @returns {Promise<Object>} Purchase confirmation
 */
async function buyNumber(phoneNumber, country, service, durationDays = 0.014) {
    try {
        // Try to call backend to perform purchase (server side will handle 5sim and transactions)
        try {
            const res = await fetch('/api/phone-numbers/buy_number/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: country, service: service })
            });
            if (res.ok) {
                const data = await res.json();
                return { success: true, message: 'Number purchased via server', data };
            }
        } catch (err) {
            console.warn('Backend buy_number failed, falling back to client mock', err);
        }

        // Fallback: client-side mock purchase (legacy)
        const countryData = FIVESIM_PRICING[country];
        const priceUSD = countryData.services[service];
        const priceNGN = priceUSD * 1200;
        const sellingPrice = priceNGN * 2;

        const purchaseId = `purch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Mock local storage operations
        const user = getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        await saveNumber(user.uid, phoneNumber, country, service, purchaseId, sellingPrice / 100);
        await updateUserBalance(user.uid, -(sellingPrice / 100));
        await createTransaction(user.uid, 'debit', sellingPrice / 100, 'number_purchase', purchaseId);

        return {
            success: true,
            message: `Number ${phoneNumber} purchased successfully (mock)`,
            purchaseId
        };

    } catch (error) {
        console.error('Error buying number:', error);
        throw error;
    }
}

/**
 * Get SMS messages for a number
 * @param {string} purchaseId - Purchase ID from 5sim
 * @returns {Promise<Array>} Array of SMS messages
 */
async function checkSMS(purchaseId) {
    try {
        // In production, this would call the real 5sim API
        // For now, return mock data or fetch from Firestore
        
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Fetch from Firestore
        const numbers = await getUserNumbers(user.uid);
        const number = numbers.find(n => n.purchaseId === purchaseId);

        if (!number) {
            throw new Error('Number not found');
        }

        return number.sms || [];
    } catch (error) {
        console.error('Error checking SMS:', error);
        return [];
    }
}

/**
 * Add SMS to a number (called from 5sim webhook)
 * @param {string} purchaseId - Purchase ID
 * @param {Object} smsData - SMS data { from, text, receivedAt }
 */
async function receiveSMS(purchaseId, smsData) {
    try {
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Add SMS to Firestore
        await addSMSToNumber(purchaseId, {
            from: smsData.from,
            text: smsData.text,
            receivedAt: new Date(),
            read: false
        });

        // Send notification to user
        sendEmailNotification(user.email, `New SMS received on a number`, 
            `From: ${smsData.from}\n\nMessage: ${smsData.text}`);

        console.log(`SMS received for number ${purchaseId}`);
        return true;
    } catch (error) {
        console.error('Error receiving SMS:', error);
        return false;
    }
}

/**
 * Set up webhook for SMS notifications
 * @param {string} webhookUrl - URL to receive webhooks
 * @returns {Promise<Object>} Webhook setup response
 */
async function setWebhook(webhookUrl) {
    try {
        // In production, this would register the webhook with 5sim
        console.log(`Webhook would be set to: ${webhookUrl}`);
        
        return {
            success: true,
            webhookUrl: webhookUrl,
            status: 'active',
            message: 'Webhook configured successfully'
        };
    } catch (error) {
        console.error('Error setting webhook:', error);
        throw error;
    }
}

/**
 * Expire/close a number
 * @param {string} purchaseId - Purchase ID
 * @returns {Promise<Object>} Expiration result
 */
async function expireNumber(purchaseId) {
    try {
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Update number status in Firestore
        await updateNumberStatus(purchaseId, 'expired');

        console.log(`Number ${purchaseId} marked as expired`);
        
        return {
            success: true,
            purchaseId: purchaseId,
            status: 'expired',
            message: 'Number has been expired'
        };
    } catch (error) {
        console.error('Error expiring number:', error);
        throw error;
    }
}

/**
 * Extend number duration
 * @param {string} purchaseId - Purchase ID
 * @param {number} durationDays - Additional days
 * @returns {Promise<Object>} Extension result
 */
async function extendNumberDuration(purchaseId, durationDays) {
    try {
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Calculate extension cost (same as daily rate)
        const dailyRate = 50; // ₦50 per day (approximate)
        const extensionCost = (dailyRate * durationDays) / 100; // Convert to kobo

        // Deduct from balance
        const newBalance = await updateUserBalance(user.uid, -extensionCost);

        // Create transaction
        await createTransaction(
            user.uid,
            'debit',
            extensionCost,
            'number_extension',
            purchaseId
        );

        console.log(`Number ${purchaseId} extended by ${durationDays} days`);

        return {
            success: true,
            purchaseId: purchaseId,
            extensionDays: durationDays,
            extensionCost: extensionCost,
            newBalance: newBalance,
            message: `Number extended for ${durationDays} days`
        };
    } catch (error) {
        console.error('Error extending number duration:', error);
        throw error;
    }
}

/**
 * Generate area code for a country
 * @param {string} country - Country code
 * @returns {string} Area code
 */
function generateAreaCode(country) {
    const areaCodes = {
        'us': ['212', '310', '415', '512', '617', '773', '858', '949'],
        'gb': ['020', '121', '161', '191', '113'],
    
        'au': ['02', '03', '07', '08']
    };

    const codes = areaCodes[country] || ['000'];
    return codes[Math.floor(Math.random() * codes.length)];
}

/**
 * Generate phone number for a country
 * @param {string} country - Country code
 * @param {string} areaCode - Area code
 * @returns {string} Phone number
 */
function generatePhoneNumber(country, areaCode) {
    let baseNumber = '';
    const randomPart = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');

    if (country === 'us') {
        baseNumber = `+1${areaCode}${randomPart}`;
    } else if (country === 'gb') {
        baseNumber = `+44${areaCode}${randomPart}`;
    } else if (country === 'au') {
        baseNumber = `+61${areaCode}${randomPart}`;
    } else {
        // Default format
        baseNumber = `+${country}${areaCode}${randomPart}`;
    }

    return baseNumber;
}

/**
 * Send email notification to user
 * @param {string} email - User email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 */
function sendEmailNotification(email, subject, body) {
    // In production, integrate with email service (SendGrid, Firebase, etc.)
    console.log(`Email notification to ${email}: ${subject}\n${body}`);
}

/**
 * Setup 5sim integration
 */
function setup5simIntegration() {
    try {
        console.log('5sim integration initialized');
        // Additional setup if needed
    } catch (error) {
        console.error('Error setting up 5sim integration:', error);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', setup5simIntegration);

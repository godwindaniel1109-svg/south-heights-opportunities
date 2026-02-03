/* ========================================
   PAYSTACK PAYMENT INTEGRATION
   ======================================== */

// Paystack public key (replace with your actual key)
const PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY_HERE'; // Set via config-loader or env in production

/**
 * Initialize Paystack payment with Card and USSD support
 * @param {number} amount - Amount in naira
 * @param {string} email - Customer email
 * @param {Array} channels - Payment channels to enable (default: ['card', 'ussd', 'bank'])
 * @returns {Promise} Payment promise
 */
async function initializePaystackPayment(amount, email, channels = ['card', 'ussd', 'bank']) {
    try {
        // Validate inputs
        if (!amount || amount < 100) {
            throw new Error('Amount must be at least ₦100');
        }
        if (!email || !isValidEmail(email)) {
            throw new Error('Invalid email address');
        }

        // Convert naira to kobo for Paystack
        const amountInKobo = Math.round(amount * 100);

        // Create Paystack reference
        const reference = `PST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
            amount: amountInKobo,
            email: email,
            reference: reference,
            publicKey: PAYSTACK_PUBLIC_KEY,
            channels: channels, // Enable card, USSD, and bank transfer
            metadata: {
                custom_fields: [
                    {
                        display_name: "Payment Method",
                        variable_name: "payment_method",
                        value: channels.join(', ')
                    }
                ]
            }
        };
    } catch (error) {
        console.error('Error initializing Paystack payment:', error);
        throw error;
    }
}

/**
 * Verify Paystack payment
 * @param {string} reference - Payment reference
 * @returns {Promise} Verification result
 */
async function verifyPaystackPayment(reference) {
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer your_secret_key_here` // Replace with actual secret key
            }
        });

        if (!response.ok) {
            throw new Error(`Paystack verification failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error verifying Paystack payment:', error);
        return null;
    }
}

/**
 * Handle Paystack payment response
 * @param {Object} response - Payment response from Paystack
 * @returns {Promise} Transaction result
 */
async function handlePaystackResponse(response) {
    try {
        // Log response for debugging
        console.log('Paystack Response:', response);

        // Verify the payment status
        if (response.status !== 'success') {
            throw new Error('Payment was not successful');
        }

        // Get user email
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Create transaction record in Firestore
        const transactionId = await createTransaction(
            user.uid,
            'credit',
            response.amount / 100, // Convert from kobo to naira
            'paystack',
            response.reference
        );

        if (!transactionId) {
            throw new Error('Failed to create transaction record');
        }

        // Update user balance
        const newBalance = await updateUserBalance(user.uid, response.amount / 100);

        return {
            success: true,
            transactionId: transactionId,
            newBalance: newBalance,
            reference: response.reference,
            message: 'Payment successful! Your wallet has been funded.'
        };
    } catch (error) {
        console.error('Error handling Paystack response:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Open Paystack payment modal
 * @param {number} amount - Amount to charge
 */
function openPaystackModal(amount) {
    try {
        const modal = document.getElementById('paystackModal');
        const form = document.getElementById('paystackForm');
        
        if (!modal || !form) {
            throw new Error('Paystack modal not found');
        }

        modal.style.display = 'flex';

        form.onsubmit = async (e) => {
            e.preventDefault();

            const user = getCurrentUser();
            if (!user) {
                showAlert('Please log in to fund your wallet', 'error');
                return;
            }

            const inputAmount = parseFloat(document.getElementById('amount').value);
            
            if (inputAmount < 100) {
                showAlert('Minimum amount is ₦100', 'error');
                return;
            }

            // Initialize Paystack payment
            const paystackConfig = await initializePaystackPayment(inputAmount, user.email);

            // Load Paystack script
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.onload = () => {
                // Open Paystack payment modal
                const handler = PaystackPop.setup({
                    key: PAYSTACK_PUBLIC_KEY,
                    email: paystackConfig.email,
                    amount: paystackConfig.amount,
                    ref: paystackConfig.reference,
                    onClose: () => {
                        showAlert('Payment window closed', 'info');
                    },
                    onSuccess: async (response) => {
                        const result = await handlePaystackResponse(response);
                        if (result.success) {
                            showAlert(result.message, 'success');
                            modal.style.display = 'none';
                            form.reset();
                            // Reload dashboard to update balance
                            if (window.location.pathname.includes('dashboard')) {
                                location.reload();
                            }
                        } else {
                            showAlert(result.error, 'error');
                        }
                    }
                });
                handler.openIframe();
            };
            document.body.appendChild(script);
        };
    } catch (error) {
        console.error('Error opening Paystack modal:', error);
        showAlert(error.message, 'error');
    }
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Setup Paystack integration
 */
function setupPaystackIntegration() {
    try {
        const paystackBtn = document.getElementById('paystackBtn');
        const modal = document.getElementById('paystackModal');
        const form = document.getElementById('paystackForm');
        
        if (!paystackBtn) return;

        paystackBtn.addEventListener('click', () => {
            const amount = document.getElementById('amount')?.value || 1000;
            openPaystackModal(amount);
        });

        // Close modal on backdrop click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        // Close modal on close button
        const closeBtn = document.querySelector('#paystackModal .close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    } catch (error) {
        console.error('Error setting up Paystack integration:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', setupPaystackIntegration);

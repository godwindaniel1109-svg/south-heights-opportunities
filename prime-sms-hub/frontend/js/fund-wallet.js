/* ========================================
   FUND WALLET PAGE FUNCTIONALITY
   ======================================== */

/**
 * Open Paystack payment modal
 */
function openPaystackModal() {
    const modal = document.getElementById('paystackModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Open PalmPay payment modal
 */
function openPalmPayModal() {
    const modal = document.getElementById('palmpayModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Open Bank Transfer modal
 */
function openBankTransferModal() {
    const modal = document.getElementById('bankModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Close modal
 * @param {string} modalId - Modal element ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @param {Element} button - Button element to show feedback
 */
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.backgroundColor = '#4ade80';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        showAlert('Failed to copy', 'error');
    });
}

/**
 * Handle quick add button click
 * @param {number} amount - Amount in naira
 * @param {string} method - Payment method (paystack, palmpay, bank)
 */
function quickAdd(amount, method) {
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.value = amount;
    }

    if (method === 'paystack') {
        openPaystackModal();
    } else if (method === 'palmpay') {
        openPalmPayModal();
    } else if (method === 'bank') {
        openBankTransferModal();
    }
}

/**
 * Handle PalmPay payment
 */
async function handlePalmPayPayment(e) {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        showAlert('Please log in first', 'error');
        return;
    }

    const amount = parseFloat(document.getElementById('palmpayAmount').value);
    const proofFile = document.getElementById('proofFile').files[0];
    const reference = document.getElementById('palmpayReference').value;

    if (!amount || amount < 100) {
        showAlert('Minimum amount is ₦100', 'error');
        return;
    }

    if (!proofFile) {
        showAlert('Please upload payment proof', 'error');
        return;
    }

    if (!reference) {
        showAlert('Please enter transaction reference', 'error');
        return;
    }

    try {
        // Upload proof file
        const fileName = `palmpay_${user.uid}_${Date.now()}`;
        // In production, use Firebase Storage
        // await uploadProofToStorage(user.uid, proofFile);

        // Create pending payment record
        const pendingPaymentId = await createPendingPayment(
            user.uid,
            'palmpay',
            amount,
            reference,
            fileName
        );

        showAlert('Payment submitted for verification. You will be notified once approved.', 'success');
        closeModal('palmpayModal');
        document.getElementById('palmpayForm').reset();

        // Reload page after 2 seconds
        setTimeout(() => {
            location.reload();
        }, 2000);
    } catch (error) {
        console.error('Error processing PalmPay payment:', error);
        showAlert(error.message || 'Error processing payment', 'error');
    }
}

/**
 * Create pending payment record in Firestore
 * @param {string} userId - User ID
 * @param {string} method - Payment method
 * @param {number} amount - Amount in naira
 * @param {string} reference - Payment reference
 * @param {string} proofFile - Proof file name
 */
async function createPendingPayment(userId, method, amount, reference, proofFile) {
    try {
        // In production, use Firebase
        const pendingPaymentId = `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log(`Pending payment created: ${pendingPaymentId}`, {
            userId,
            method,
            amount,
            reference,
            proofFile,
            status: 'pending',
            createdAt: new Date()
        });

        return pendingPaymentId;
    } catch (error) {
        console.error('Error creating pending payment:', error);
        throw error;
    }
}

/**
 * Load user balance and transaction history
 */
async function loadWalletData() {
    try {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Update balance display
        const userData = await getUserData(user.uid);
        const balanceKobo = userData?.balance || 0;
        const balanceNGN = formatBalance(balanceKobo);

        const balanceElements = document.querySelectorAll('[data-balance]');
        balanceElements.forEach(el => {
            el.textContent = balanceNGN;
        });

        // Load recent transactions
        const transactions = await getTransactions(user.uid, 10);
        displayRecentTransactions(transactions);

    } catch (error) {
        console.error('Error loading wallet data:', error);
        showAlert('Error loading wallet data', 'error');
    }
}

/**
 * Display recent transactions
 * @param {Array} transactions - Transactions array
 */
function displayRecentTransactions(transactions) {
    const transactionsList = document.getElementById('recentTransactions');
    if (!transactionsList) return;

    if (!transactions || transactions.length === 0) {
        transactionsList.innerHTML = '<p>No transactions yet</p>';
        return;
    }

    const html = transactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <span class="transaction-type">${t.type === 'credit' ? '+ ' : '- '}${t.type === 'credit' ? 'Credit' : 'Debit'}</span>
                <span class="transaction-method">${t.paymentMethod || 'N/A'}</span>
            </div>
            <div class="transaction-amount ${t.type === 'credit' ? 'credit' : 'debit'}">
                ${formatBalance(t.amount)}
            </div>
        </div>
    `).join('');

    transactionsList.innerHTML = html;
}

/**
 * Update amount info display
 */
function updateAmountInfo() {
    const amountInput = document.getElementById('amount');
    const amountInfo = document.getElementById('amountInfo');
    
    if (!amountInput || !amountInfo) return;

    const amount = parseFloat(amountInput.value) || 0;
    
    if (amount > 0) {
        const infoText = `
            <p>Amount: ₦${amount.toLocaleString()}</p>
            <p>Fee: ₦0 (Free with Paystack)</p>
            <p>Total: ₦${amount.toLocaleString()}</p>
        `;
        amountInfo.innerHTML = infoText;
        amountInfo.style.display = 'block';
    } else {
        amountInfo.style.display = 'none';
    }
}

/**
 * Setup event listeners for fund wallet page
 */
function setupFundWalletListeners() {
    // Quick add buttons
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            const method = btn.dataset.method || 'paystack';
            quickAdd(parseInt(amount), method);
        });
    });

    // Modal close buttons
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Amount input listener
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', updateAmountInfo);
    }

    // PalmPay form
    const palmpayForm = document.getElementById('palmpayForm');
    if (palmpayForm) {
        palmpayForm.addEventListener('submit', handlePalmPayPayment);
    }

    // Copy to clipboard buttons
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copy;
            copyToClipboard(text, btn);
        });
    });

    // Paystack method button
    const paystackMethodBtn = document.getElementById('paystackMethodBtn');
    if (paystackMethodBtn) {
        paystackMethodBtn.addEventListener('click', openPaystackModal);
    }

    // PalmPay method button
    const palmpayMethodBtn = document.getElementById('palmpayMethodBtn');
    if (palmpayMethodBtn) {
        palmpayMethodBtn.addEventListener('click', openPalmPayModal);
    }

    // Bank method button
    const bankMethodBtn = document.getElementById('bankMethodBtn');
    if (bankMethodBtn) {
        bankMethodBtn.addEventListener('click', openBankTransferModal);
    }
}

/**
 * Initialize page
 */
async function initFundWalletPage() {
    try {
        // Check authentication
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Load wallet data
        await loadWalletData();

        // Poll wallet data every 5 seconds (only update API-driven parts)
        setInterval(loadWalletData, 5000);

        // Listen for soft live-reload events and trigger an immediate refresh
        window.addEventListener('live-reload:changed', (e) => {
            console.log('Live reload event received:', e.detail);
            try { loadWalletData(); } catch (err) { console.error(err); }
        });

        // Setup event listeners
        setupFundWalletListeners();

        console.log('Fund wallet page initialized');
    } catch (error) {
        console.error('Error initializing fund wallet page:', error);
        showAlert('Error loading page', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initFundWalletPage);

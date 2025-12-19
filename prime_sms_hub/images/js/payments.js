// ================================
// PAYMENT PROCESSING SYSTEM
// ================================

// Global Variables
let paymentMethods = [];
let pendingTransactions = [];
let paymentGateways = {
    flutterwave: {
        name: 'Flutterwave',
        enabled: true,
        currencies: ['NGN', 'USD', 'GBP', 'EUR'],
        minAmount: 100,
        maxAmount: 5000000
    },
    paystack: {
        name: 'Paystack',
        enabled: true,
        currencies: ['NGN', 'USD', 'GHS', 'KES', 'ZAR'],
        minAmount: 100,
        maxAmount: 10000000
    },
    stripe: {
        name: 'Stripe',
        enabled: false,
        currencies: ['USD', 'EUR', 'GBP'],
        minAmount: 50,
        maxAmount: 999999
    },
    bank_transfer: {
        name: 'Bank Transfer',
        enabled: true,
        currencies: ['NGN'],
        minAmount: 1000,
        maxAmount: 5000000
    },
    crypto: {
        name: 'Crypto',
        enabled: true,
        currencies: ['USDT', 'BTC', 'ETH'],
        minAmount: 5,
        maxAmount: 100000
    }
};

// ================================
// PAYMENT INITIALIZATION
// ================================
function initPayments() {
    loadPaymentMethods();
    setupPaymentListeners();
    loadTransactionHistory();
}

// ================================
// PAYMENT METHODS
// ================================
async function loadPaymentMethods() {
    try {
        // In a real app, you would fetch from Firestore
        // For demo, we'll use predefined methods
        
        paymentMethods = [
            {
                id: 'card',
                name: 'Credit/Debit Card',
                icon: 'fa-credit-card',
                type: 'flutterwave',
                currencies: ['NGN', 'USD'],
                fees: { percentage: 1.5, fixed: 0 },
                status: 'active'
            },
            {
                id: 'bank_transfer',
                name: 'Bank Transfer',
                icon: 'fa-university',
                type: 'bank_transfer',
                currencies: ['NGN'],
                fees: { percentage: 0, fixed: 0 },
                status: 'active',
                details: {
                    bankName: 'Prime Bank',
                    accountNumber: '1234567890',
                    accountName: 'Prime SMS Hub Ltd'
                }
            },
            {
                id: 'crypto',
                name: 'Cryptocurrency',
                icon: 'fa-bitcoin',
                type: 'crypto',
                currencies: ['USDT', 'BTC'],
                fees: { percentage: 0, fixed: 0 },
                status: 'active',
                networks: ['TRC20', 'ERC20', 'BEP20']
            },
            {
                id: 'mobile_money',
                name: 'Mobile Money',
                icon: 'fa-mobile-alt',
                type: 'flutterwave',
                currencies: ['GHS', 'KES', 'UGX', 'RWF', 'TZS', 'ZMW'],
                fees: { percentage: 1.5, fixed: 0 },
                status: 'active'
            }
        ];
        
        // Update payment methods UI if on balance section
        updatePaymentMethodsUI();
        
    } catch (error) {
        console.error('Error loading payment methods:', error);
    }
}

function updatePaymentMethodsUI() {
    const methodsGrid = document.querySelector('.methods-grid');
    if (!methodsGrid) return;
    
    methodsGrid.innerHTML = '';
    
    paymentMethods.forEach(method => {
        const methodCard = createPaymentMethodCard(method);
        methodsGrid.appendChild(methodCard);
    });
}

function createPaymentMethodCard(method) {
    const card = document.createElement('div');
    card.className = 'method-card';
    card.setAttribute('data-method', method.id);
    
    let feeText = '';
    if (method.fees.percentage > 0) {
        feeText = `${method.fees.percentage}% fee`;
    } else {
        feeText = 'No fees';
    }
    
    card.innerHTML = `
        <div class="method-icon">
            <i class="fas ${method.icon}"></i>
        </div>
        <h4>${method.name}</h4>
        <p>${feeText}</p>
        <div class="method-currencies">
            ${method.currencies.map(currency => `<span class="currency-tag">${currency}</span>`).join('')}
        </div>
    `;
    
    card.addEventListener('click', () => selectPaymentMethod(method.id));
    
    return card;
}

// ================================
// PAYMENT PROCESSING
// ================================
function setupPaymentListeners() {
    // Quick top-up amounts
    document.querySelectorAll('.topup-amount').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            if (amount === 'custom') {
                showCustomAmountInput();
            } else {
                initiateTopup(parseFloat(amount));
            }
        });
    });
    
    // Payment method selection
    document.querySelectorAll('.method-card').forEach(card => {
        card.addEventListener('click', function() {
            const methodId = this.getAttribute('data-method');
            selectPaymentMethod(methodId);
        });
    });
    
    // Proceed to payment button
    document.getElementById('proceedPaymentBtn')?.addEventListener('click', processPayment);
}

function selectPaymentMethod(methodId) {
    // Remove selected class from all
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked
    const selectedCard = document.querySelector(`.method-card[data-method="${methodId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Store selected method
    localStorage.setItem('selectedPaymentMethod', methodId);
    
    // Update payment summary
    updatePaymentSummary(methodId);
}

function showCustomAmountInput() {
    const customAmount = prompt('Enter custom amount (in NGN):', '1000');
    if (customAmount && !isNaN(customAmount) && parseFloat(customAmount) > 0) {
        const amount = parseFloat(customAmount);
        if (amount < 100) {
            showToast('Minimum amount is ₦100', 'error');
            return;
        }
        initiateTopup(amount);
    }
}

async function initiateTopup(amount) {
    // Create topup modal
    const modalContent = `
        <div class="modal-header">
            <h3>Top Up Balance</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="topup-form">
                <div class="form-group">
                    <label for="topupAmount">Amount (NGN)</label>
                    <input type="number" id="topupAmount" min="100" max="1000000" 
                           value="${amount}" step="100">
                </div>
                
                <div class="payment-methods-selection">
                    <h4>Select Payment Method</h4>
                    <div class="methods-list" id="topupMethodsList">
                        <!-- Payment methods will be loaded here -->
                    </div>
                </div>
                
                <div class="payment-summary">
                    <h4>Payment Summary</h4>
                    <div class="summary-item">
                        <span>Amount:</span>
                        <span id="summaryAmount">₦${amount.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span>Fee (1.5%):</span>
                        <span id="summaryFee">₦${(amount * 0.015).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="summary-item total">
                        <span>Total:</span>
                        <span id="summaryTotal">₦${(amount * 1.015).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
                
                <button class="btn-primary btn-block" id="proceedPaymentBtn">
                    <i class="fas fa-lock"></i> Proceed to Payment
                </button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'topupModal';
    modal.innerHTML = `
        <div class="modal-content">
            ${modalContent}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
        
        // Load payment methods in modal
        loadPaymentMethodsInModal();
        
        // Add event listeners
        const topupAmount = document.getElementById('topupAmount');
        const summaryAmount = document.getElementById('summaryAmount');
        const summaryFee = document.getElementById('summaryFee');
        const summaryTotal = document.getElementById('summaryTotal');
        
        topupAmount.addEventListener('input', () => {
            const amount = parseFloat(topupAmount.value) || 0;
            const fee = amount * 0.015;
            const total = amount + fee;
            
            summaryAmount.textContent = formatCurrency(amount);
            summaryFee.textContent = formatCurrency(fee);
            summaryTotal.textContent = formatCurrency(total);
        });
        
        document.getElementById('proceedPaymentBtn').addEventListener('click', () => {
            processPayment(parseFloat(topupAmount.value));
        });
        
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }, 10);
}

function loadPaymentMethodsInModal() {
    const methodsList = document.getElementById('topupMethodsList');
    if (!methodsList) return;
    
    methodsList.innerHTML = '';
    
    paymentMethods.forEach(method => {
        const methodItem = document.createElement('div');
        methodItem.className = 'method-item';
        methodItem.setAttribute('data-method', method.id);
        
        methodItem.innerHTML = `
            <div class="method-item-icon">
                <i class="fas ${method.icon}"></i>
            </div>
            <div class="method-item-info">
                <h5>${method.name}</h5>
                <p>${method.fees.percentage > 0 ? `${method.fees.percentage}% fee` : 'No fees'}</p>
            </div>
            <div class="method-item-select">
                <input type="radio" name="paymentMethod" value="${method.id}" 
                       ${method.id === 'card' ? 'checked' : ''}>
            </div>
        `;
        
        methodItem.addEventListener('click', function() {
            document.querySelectorAll('.method-item').forEach(item => {
                item.classList.remove('selected');
            });
            this.classList.add('selected');
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
        });
        
        methodsList.appendChild(methodItem);
    });
}

async function processPayment(amount) {
    const amountInput = document.getElementById('topupAmount');
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!amountInput && !amount) {
        showToast('Please enter an amount', 'error');
        return;
    }
    
    const paymentAmount = amount || parseFloat(amountInput.value);
    const paymentMethod = selectedMethod ? selectedMethod.value : 'card';
    
    // Validate amount
    if (paymentAmount < 100) {
        showToast('Minimum amount is ₦100', 'error');
        return;
    }
    
    if (paymentAmount > 1000000) {
        showToast('Maximum amount is ₦1,000,000', 'error');
        return;
    }
    
    // Get selected payment method details
    const method = paymentMethods.find(m => m.id === paymentMethod);
    if (!method) {
        showToast('Please select a payment method', 'error');
        return;
    }
    
    // Show processing
    showToast('Processing payment...', 'info');
    
    // Create transaction record
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    const fee = paymentAmount * (method.fees.percentage / 100) + method.fees.fixed;
    const totalAmount = paymentAmount + fee;
    
    try {
        // Create pending transaction
        const transactionData = {
            transactionId: transactionId,
            userId: currentUser.uid,
            type: 'deposit',
            method: paymentMethod,
            amount: paymentAmount,
            fee: fee,
            total: totalAmount,
            currency: 'NGN',
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            description: `Balance top-up via ${method.name}`
        };
        
        await db.collection('transactions').doc(transactionId).set(transactionData);
        
        // Process based on payment method
        switch (paymentMethod) {
            case 'card':
                await processCardPayment(transactionId, totalAmount, method);
                break;
            case 'bank_transfer':
                await processBankTransfer(transactionId, totalAmount, method);
                break;
            case 'crypto':
                await processCryptoPayment(transactionId, totalAmount, method);
                break;
            case 'mobile_money':
                await processMobileMoney(transactionId, totalAmount, method);
                break;
            default:
                throw new Error('Unsupported payment method');
        }
        
    } catch (error) {
        console.error('Payment processing error:', error);
        showToast('Payment failed: ' + error.message, 'error');
        
        // Update transaction as failed
        await db.collection('transactions').doc(transactionId).update({
            status: 'failed',
            error: error.message,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

// ================================
// PAYMENT METHOD SPECIFIC FUNCTIONS
// ================================
async function processCardPayment(transactionId, amount, method) {
    try {
        // In a real application, you would integrate with Flutterwave/Paystack
        // For demo, we'll simulate a successful payment
        
        showToast('Redirecting to payment gateway...', 'info');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock payment gateway response
        const mockResponse = {
            status: 'success',
            transaction_ref: `REF${Date.now()}`,
            amount: amount,
            currency: 'NGN',
            customer: {
                email: currentUser.email,
                name: userData.name
            }
        };
        
        // Complete the transaction
        await completePayment(transactionId, mockResponse, method);
        
    } catch (error) {
        throw new Error(`Card payment failed: ${error.message}`);
    }
}

async function processBankTransfer(transactionId, amount, method) {
    try {
        // Show bank details modal
        const modalContent = `
            <div class="modal-header">
                <h3>Bank Transfer Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="bank-transfer-details">
                    <div class="bank-info">
                        <div class="info-item">
                            <label>Bank Name:</label>
                            <strong>${method.details.bankName}</strong>
                        </div>
                        <div class="info-item">
                            <label>Account Number:</label>
                            <strong>${method.details.accountNumber}</strong>
                        </div>
                        <div class="info-item">
                            <label>Account Name:</label>
                            <strong>${method.details.accountName}</strong>
                        </div>
                        <div class="info-item">
                            <label>Amount:</label>
                            <strong class="text-success">${formatCurrency(amount)}</strong>
                        </div>
                    </div>
                    
                    <div class="instructions">
                        <h4>Instructions:</h4>
                        <ol>
                            <li>Transfer exactly <strong>${formatCurrency(amount)}</strong> to the account above</li>
                            <li>Use your email or transaction ID as reference</li>
                            <li>Upload proof of payment below</li>
                            <li>Your balance will be updated within 1-2 hours</li>
                        </ol>
                    </div>
                    
                    <div class="proof-upload">
                        <h4>Upload Proof of Payment</h4>
                        <div class="upload-area" id="uploadArea">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Click to upload screenshot or receipt</p>
                            <input type="file" id="proofUpload" accept="image/*,.pdf" style="display: none;">
                        </div>
                        <div id="uploadPreview"></div>
                    </div>
                    
                    <div class="transaction-id">
                        <p><strong>Transaction ID:</strong> ${transactionId}</p>
                        <p><small>Use this as reference when transferring</small></p>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-secondary" id="cancelBankTransfer">Cancel</button>
                        <button class="btn-primary" id="confirmBankTransfer" disabled>
                            <i class="fas fa-check"></i> I have made the transfer
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'bankTransferModal';
        modal.innerHTML = `
            <div class="modal-content">
                ${modalContent}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
            
            // Upload functionality
            const uploadArea = document.getElementById('uploadArea');
            const proofUpload = document.getElementById('proofUpload');
            const uploadPreview = document.getElementById('uploadPreview');
            const confirmBtn = document.getElementById('confirmBankTransfer');
            
            uploadArea.addEventListener('click', () => proofUpload.click());
            
            proofUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Show preview
                    uploadPreview.innerHTML = `
                        <div class="upload-preview">
                            <i class="fas fa-file"></i>
                            <span>${file.name}</span>
                            <button class="btn-remove" onclick="removeUpload()">&times;</button>
                        </div>
                    `;
                    confirmBtn.disabled = false;
                }
            });
            
            // Confirm button
            confirmBtn.addEventListener('click', async () => {
                showToast('Payment submitted for verification', 'info');
                
                // Update transaction status
                await db.collection('transactions').doc(transactionId).update({
                    status: 'pending_verification',
                    proofUploaded: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Add notification for admin (in real app)
                
                // Close modal
                modal.remove();
                
                showToast('Thank you! We will verify your payment within 1-2 hours.', 'success');
            });
            
            // Cancel button
            document.getElementById('cancelBankTransfer').addEventListener('click', () => {
                modal.remove();
            });
            
            // Close modal
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }, 10);
        
    } catch (error) {
        throw new Error(`Bank transfer setup failed: ${error.message}`);
    }
}

async function processCryptoPayment(transactionId, amount, method) {
    try {
        // For demo, we'll show crypto address
        const usdAmount = amount / 450; // Rough conversion NGN to USD
        const usdtAmount = usdAmount.toFixed(2);
        
        const modalContent = `
            <div class="modal-header">
                <h3>Cryptocurrency Payment</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="crypto-payment">
                    <div class="crypto-info">
                        <div class="info-item">
                            <label>Amount (USD):</label>
                            <strong>$${usdAmount.toFixed(2)}</strong>
                        </div>
                        <div class="info-item">
                            <label>Amount (USDT):</label>
                            <strong>${usdtAmount} USDT</strong>
                        </div>
                        <div class="info-item">
                            <label>Network:</label>
                            <strong>TRC20 (Recommended)</strong>
                        </div>
                    </div>
                    
                    <div class="wallet-address">
                        <h4>Send USDT to this address:</h4>
                        <div class="address-box">
                            <code id="cryptoAddress">TXYZ1234567890abcdefghijklmnopqrstuv</code>
                            <button class="btn-copy" onclick="copyCryptoAddress()">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="qr-code">
                            <div id="cryptoQRCode"></div>
                            <p>Scan to pay</p>
                        </div>
                    </div>
                    
                    <div class="crypto-instructions">
                        <h4>Important:</h4>
                        <ul>
                            <li>Send only USDT (TRC20 network)</li>
                            <li>Send exactly ${usdtAmount} USDT</li>
                            <li>Include transaction ID in memo if possible</li>
                            <li>Payment will be confirmed after 3 network confirmations</li>
                        </ul>
                    </div>
                    
                    <div class="transaction-id">
                        <p><strong>Transaction ID:</strong> ${transactionId}</p>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-secondary" id="cancelCrypto">Cancel</button>
                        <button class="btn-primary" id="confirmCrypto">
                            <i class="fas fa-check"></i> I have sent the payment
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'cryptoModal';
        modal.innerHTML = `
            <div class="modal-content">
                ${modalContent}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
            
            // Generate QR code (simplified)
            const qrContainer = document.getElementById('cryptoQRCode');
            qrContainer.innerHTML = `
                <div class="qr-placeholder">
                    <i class="fas fa-qrcode"></i>
                    <p>QR Code would be generated here</p>
                </div>
            `;
            
            // Confirm button
            document.getElementById('confirmCrypto').addEventListener('click', async () => {
                showToast('Waiting for blockchain confirmation...', 'info');
                
                // In real app, you would poll a blockchain API
                // For demo, we'll simulate confirmation
                
                // Update transaction status
                await db.collection('transactions').doc(transactionId).update({
                    status: 'pending_blockchain',
                    cryptoAmount: usdtAmount,
                    network: 'TRC20',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Close modal
                modal.remove();
                
                showToast('Payment submitted. Awaiting blockchain confirmation.', 'success');
            });
            
            // Cancel button
            document.getElementById('cancelCrypto').addEventListener('click', () => {
                modal.remove();
            });
            
            // Close modal
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }, 10);
        
    } catch (error) {
        throw new Error(`Crypto payment setup failed: ${error.message}`);
    }
}

async function processMobileMoney(transactionId, amount, method) {
    // Similar to bank transfer but for mobile money
    // Implementation would depend on the specific mobile money provider
    showToast('Mobile money payment coming soon!', 'info');
}

// ================================
// PAYMENT COMPLETION
// ================================
async function completePayment(transactionId, paymentResponse, method) {
    try {
        const transactionRef = db.collection('transactions').doc(transactionId);
        const transactionDoc = await transactionRef.get();
        
        if (!transactionDoc.exists) {
            throw new Error('Transaction not found');
        }
        
        const transaction = transactionDoc.data();
        
        // Update transaction with payment response
        await transactionRef.update({
            status: 'completed',
            gatewayResponse: paymentResponse,
            completedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update user balance
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({
            balance: firebase.firestore.FieldValue.increment(transaction.amount),
            totalDeposits: firebase.firestore.FieldValue.increment(transaction.amount),
            lastDepositAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update local user data
        userData.balance += transaction.amount;
        
        // Update UI
        document.getElementById('balanceAmount').textContent = formatCurrency(userData.balance);
        document.getElementById('statBalance').textContent = formatCurrency(userData.balance);
        document.getElementById('currentBalance').textContent = formatCurrency(userData.balance);
        
        // Add notification
        await addNotification(
            'Payment Successful',
            `Your balance has been topped up with ${formatCurrency(transaction.amount)}`,
            'success'
        );
        
        // Close modal if open
        const topupModal = document.getElementById('topupModal');
        if (topupModal) topupModal.remove();
        
        showToast(`Payment successful! ${formatCurrency(transaction.amount)} added to your balance.`, 'success');
        
        // Reload transaction history
        loadTransactionHistory();
        
    } catch (error) {
        console.error('Error completing payment:', error);
        throw error;
    }
}

// ================================
// TRANSACTION HISTORY
// ================================
async function loadTransactionHistory() {
    try {
        const transactionsTable = document.getElementById('transactionsTable');
        if (!transactionsTable) return;
        
        // Show loading
        transactionsTable.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    <div class="spinner"></div>
                    <p>Loading transactions...</p>
                </td>
            </tr>
        `;
        
        // Load transactions
        const snapshot = await db.collection('transactions')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();
        
        if (snapshot.empty) {
            transactionsTable.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-exchange-alt"></i>
                        <p>No transactions yet</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        transactionsTable.innerHTML = '';
        snapshot.forEach(doc => {
            const transaction = doc.data();
            const row = createTransactionRow(transaction);
            transactionsTable.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading transaction history:', error);
    }
}

function createTransactionRow(transaction) {
    const row = document.createElement('tr');
    
    // Status badge
    let statusClass = '';
    let statusText = transaction.status;
    
    switch (transaction.status) {
        case 'completed':
            statusClass = 'status-success';
            break;
        case 'pending':
        case 'pending_verification':
        case 'pending_blockchain':
            statusClass = 'status-warning';
            break;
        case 'failed':
            statusClass = 'status-failed';
            break;
        default:
            statusClass = 'status-pending';
    }
    
    // Type icon
    let typeIcon = 'fa-exchange-alt';
    let typeText = transaction.type;
    
    if (transaction.type === 'deposit') {
        typeIcon = 'fa-arrow-down';
        typeText = 'Deposit';
    } else if (transaction.type === 'purchase') {
        typeIcon = 'fa-shopping-cart';
        typeText = 'Purchase';
    } else if (transaction.type === 'refund') {
        typeIcon = 'fa-undo';
        typeText = 'Refund';
    }
    
    row.innerHTML = `
        <td>${formatDate(transaction.createdAt)}</td>
        <td>
            <i class="fas ${typeIcon}"></i> ${typeText}
        </td>
        <td class="${transaction.amount >= 0 ? 'text-success' : 'text-danger'}">
            ${transaction.amount >= 0 ? '+' : ''}${formatCurrency(transaction.amount)}
        </td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td><small>${transaction.transactionId}</small></td>
    `;
    
    // Add click event to show details
    row.addEventListener('click', () => showTransactionDetails(transaction));
    
    return row;
}

async function showTransactionDetails(transaction) {
    const modalContent = `
        <div class="modal-header">
            <h3>Transaction Details</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="transaction-details">
                <div class="detail-item">
                    <label>Transaction ID:</label>
                    <span>${transaction.transactionId}</span>
                </div>
                <div class="detail-item">
                    <label>Type:</label>
                    <span>${transaction.type}</span>
                </div>
                <div class="detail-item">
                    <label>Amount:</label>
                    <span class="${transaction.amount >= 0 ? 'text-success' : 'text-danger'}">
                        ${transaction.amount >= 0 ? '+' : ''}${formatCurrency(transaction.amount)}
                    </span>
                </div>
                ${transaction.fee ? `
                <div class="detail-item">
                    <label>Fee:</label>
                    <span>${formatCurrency(transaction.fee)}</span>
                </div>
                ` : ''}
                ${transaction.total ? `
                <div class="detail-item">
                    <label>Total:</label>
                    <span>${formatCurrency(transaction.total)}</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <label>Status:</label>
                    <span class="status-badge ${transaction.status === 'completed' ? 'status-success' : 'status-warning'}">
                        ${transaction.status}
                    </span>
                </div>
                <div class="detail-item">
                    <label>Date:</label>
                    <span>${formatDate(transaction.createdAt)}</span>
                </div>
                ${transaction.description ? `
                <div class="detail-item">
                    <label>Description:</label>
                    <span>${transaction.description}</span>
                </div>
                ` : ''}
                ${transaction.method ? `
                <div class="detail-item">
                    <label>Payment Method:</label>
                    <span>${transaction.method}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'transactionDetailsModal';
    modal.innerHTML = `
        <div class="modal-content">
            ${modalContent}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }, 10);
}

// ================================
// UTILITY FUNCTIONS
// ================================
function updatePaymentSummary(methodId) {
    // Update payment summary based on selected method
    const summary = document.querySelector('.payment-summary');
    if (!summary) return;
    
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return;
    
    const amount = parseFloat(document.getElementById('topupAmount')?.value) || 1000;
    const fee = amount * (method.fees.percentage / 100) + method.fees.fixed;
    const total = amount + fee;
    
    summary.innerHTML = `
        <h4>Payment Summary</h4>
        <div class="summary-item">
            <span>Amount:</span>
            <span>${formatCurrency(amount)}</span>
        </div>
        <div class="summary-item">
            <span>Fee (${method.fees.percentage}%):</span>
            <span>${formatCurrency(fee)}</span>
        </div>
        <div class="summary-item total">
            <span>Total:</span>
            <span class="text-success">${formatCurrency(total)}</span>
        </div>
    `;
}

function copyCryptoAddress() {
    const address = document.getElementById('cryptoAddress');
    if (address) {
        navigator.clipboard.writeText(address.textContent)
            .then(() => showToast('Address copied to clipboard!', 'success'))
            .catch(() => showToast('Failed to copy address', 'error'));
    }
}

function removeUpload() {
    const proofUpload = document.getElementById('proofUpload');
    const uploadPreview = document.getElementById('uploadPreview');
    const confirmBtn = document.getElementById('confirmBankTransfer');
    
    if (proofUpload) proofUpload.value = '';
    if (uploadPreview) uploadPreview.innerHTML = '';
    if (confirmBtn) confirmBtn.disabled = true;
}

// ================================
// INITIALIZE PAYMENTS
// ================================
document.addEventListener('DOMContentLoaded', function() {
    if (window.currentUser) {
        initPayments();
    }
});

// ================================
// EXPORT FUNCTIONS
// ================================
window.initPayments = initPayments;
window.loadTransactionHistory = loadTransactionHistory;
window.initiateTopup = initiateTopup;
window.copyCryptoAddress = copyCryptoAddress;
window.removeUpload = removeUpload;

console.log('Payments JavaScript loaded successfully');
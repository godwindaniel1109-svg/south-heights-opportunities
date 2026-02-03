// ================================
// NUMBER PURCHASING & MANAGEMENT
// ================================

// Global Variables
let availableNumbers = [];
let filteredNumbers = [];
let selectedNumber = null;

// ================================
// BUY NUMBERS SECTION
// ================================
async function loadBuyNumbers() {
    try {
        const numbersGrid = document.getElementById('numbersGrid');
        
        // Show loading
        numbersGrid.innerHTML = `
            <div class="loading-numbers">
                <div class="spinner"></div>
                <p>Loading available numbers...</p>
            </div>
        `;
        
        // Load countries and services
        await loadCountriesAndServices();
        
        // Load available numbers
        await loadAvailableNumbers();
        
        // Setup filters
        setupNumberFilters();
        
    } catch (error) {
        console.error('Error loading buy numbers section:', error);
        showToast('Failed to load numbers. Please try again.', 'error');
    }
}

async function loadCountriesAndServices() {
    try {
        const countrySelect = document.getElementById('countryFilter');
        const serviceSelect = document.getElementById('serviceFilter');
        
        // Clear existing options
        countrySelect.innerHTML = '<option value="">All Countries</option>';
        serviceSelect.innerHTML = '<option value="">All Services</option>';
        
        // Add countries (you can fetch these from Firestore)
        const countries = [
            { code: 'US', name: 'United States', flag: '🇺🇸' },
            { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
            { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
            { code: 'AU', name: 'Australia', flag: '🇦🇺' },
            { code: 'DE', name: 'Germany', flag: '🇩🇪' },
            { code: 'FR', name: 'France', flag: '🇫🇷' },
            { code: 'IN', name: 'India', flag: '🇮🇳' },
            { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
            { code: 'ZA', name: 'South Africa', flag: '🇿🇦' }
        ];
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = `${country.flag} ${country.name}`;
            countrySelect.appendChild(option);
        });
        
        // Add services (you can fetch these from Firestore)
        const services = [
            'WhatsApp', 'Telegram', 'Facebook', 'Twitter',
            'Google', 'Instagram', 'TikTok', 'Discord',
            'Amazon', 'Netflix', 'PayPal', 'Binance'
        ];
        
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            serviceSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading countries and services:', error);
    }
}

async function loadAvailableNumbers() {
    try {
        // In a real application, you would fetch from Firestore
        // For demo, we'll create sample numbers
        
        availableNumbers = generateSampleNumbers();
        filteredNumbers = [...availableNumbers];
        
        displayNumbers(filteredNumbers);
        
    } catch (error) {
        console.error('Error loading available numbers:', error);
    }
}

function generateSampleNumbers() {
    const countries = [
        { code: 'US', name: 'United States', flag: '🇺🇸', price: 500 },
        { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', price: 600 },
        { code: 'NG', name: 'Nigeria', flag: '🇳🇬', price: 300 },
        { code: 'AU', name: 'Australia', flag: '🇦🇺', price: 650 }
    ];
    
    const services = ['WhatsApp', 'Telegram', 'Facebook', 'Twitter', 'Google'];
    
    const numbers = [];
    
    countries.forEach(country => {
        services.forEach(service => {
            // Generate 2-3 numbers per country/service combination
            const count = Math.floor(Math.random() * 2) + 2;
            
            for (let i = 0; i < count; i++) {
                const phoneNumber = generatePhoneNumber(country.code);
                
                numbers.push({
                    id: `NUM${Date.now()}${Math.random().toString(36).substr(2, 6)}`,
                    country: country.code,
                    countryName: country.name,
                    flag: country.flag,
                    service: service,
                    phoneNumber: phoneNumber,
                    price: country.price + Math.floor(Math.random() * 200),
                    duration: '30 days',
                    reliability: Math.floor(Math.random() * 30) + 70, // 70-99%
                    popularity: Math.floor(Math.random() * 5) + 1, // 1-5 stars
                    status: 'available',
                    features: ['SMS', 'Voice', 'Call Forwarding'].slice(0, Math.floor(Math.random() * 3) + 1)
                });
            }
        });
    });
    
    return numbers;
}

function generatePhoneNumber(countryCode) {
    const prefixes = {
        'US': ['+1-212', '+1-310', '+1-415'],
        'UK': ['+44-20', '+44-79', '+44-77'],
        'NG': ['+234-701', '+234-802', '+234-903'],
            'AU': ['+61-2', '+61-3', '+61-4']
    };
    
    const prefix = prefixes[countryCode]?.[Math.floor(Math.random() * prefixes[countryCode].length)] || '+1-212';
    const suffix = Math.floor(Math.random() * 9000000 + 1000000).toString().substring(0, 7);
    
    return `${prefix}-${suffix.substring(0, 3)}-${suffix.substring(3)}`;
}

function displayNumbers(numbers) {
    const numbersGrid = document.getElementById('numbersGrid');
    
    if (numbers.length === 0) {
        numbersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No numbers found</h3>
                <p>Try changing your filter criteria</p>
                <button class="btn-small" id="resetFiltersBtn">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    numbersGrid.innerHTML = '';
    
    numbers.forEach(number => {
        const numberCard = createNumberCard(number);
        numbersGrid.appendChild(numberCard);
    });
}

function createNumberCard(number) {
    const card = document.createElement('div');
    card.className = 'number-card';
    card.setAttribute('data-id', number.id);
    
    card.innerHTML = `
        <div class="number-header">
            <div class="number-info">
                <h3>${number.service}</h3>
                <div class="country-flag">
                    ${number.flag} ${number.countryName}
                </div>
            </div>
            <div class="number-status">
                <span class="status-badge status-success">Available</span>
            </div>
        </div>
        <div class="number-body">
            <div class="number-phone">
                ${number.phoneNumber}
            </div>
            <div class="number-details">
                <div class="detail-item">
                    <div class="detail-label">Reliability</div>
                    <div class="detail-value">${number.reliability}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Popularity</div>
                    <div class="detail-value">
                        ${'★'.repeat(number.popularity)}${'☆'.repeat(5 - number.popularity)}
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Duration</div>
                    <div class="detail-value">${number.duration}</div>
                </div>
            </div>
            <div class="number-price">
                <div class="price-amount">${formatCurrency(number.price)}</div>
                <div class="price-duration">One-time payment</div>
            </div>
        </div>
        <div class="number-footer">
            <button class="btn-buy" data-id="${number.id}">
                <i class="fas fa-shopping-cart"></i> Buy Now
            </button>
            <button class="btn-details" data-id="${number.id}">
                <i class="fas fa-info-circle"></i> Details
            </button>
        </div>
    `;
    
    // Add event listeners
    const buyBtn = card.querySelector('.btn-buy');
    const detailsBtn = card.querySelector('.btn-details');
    
    buyBtn.addEventListener('click', () => purchaseNumber(number.id));
    detailsBtn.addEventListener('click', () => showNumberDetails(number.id));
    
    return card;
}

function setupNumberFilters() {
    const applyBtn = document.getElementById('applyFiltersBtn');
    const resetBtn = document.getElementById('resetFiltersBtn');
    
    applyBtn.addEventListener('click', applyNumberFilters);
    resetBtn.addEventListener('click', resetNumberFilters);
}

function applyNumberFilters() {
    const countryFilter = document.getElementById('countryFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    // Filter numbers
    filteredNumbers = availableNumbers.filter(number => {
        let matches = true;
        
        if (countryFilter && number.country !== countryFilter) {
            matches = false;
        }
        
        if (serviceFilter && number.service !== serviceFilter) {
            matches = false;
        }
        
        return matches;
    });
    
    // Sort numbers
    filteredNumbers.sort((a, b) => {
        switch (sortFilter) {
            case 'price_asc':
                return a.price - b.price;
            case 'price_desc':
                return b.price - a.price;
            case 'popular':
                return b.popularity - a.popularity;
            default:
                return 0;
        }
    });
    
    // Display filtered numbers
    displayNumbers(filteredNumbers);
}

function resetNumberFilters() {
    document.getElementById('countryFilter').value = '';
    document.getElementById('serviceFilter').value = '';
    document.getElementById('sortFilter').value = 'price_asc';
    
    filteredNumbers = [...availableNumbers];
    displayNumbers(filteredNumbers);
}

// ================================
// NUMBER PURCHASE FUNCTIONS
// ================================
async function purchaseNumber(numberId) {
    try {
        // Find the selected number
        const number = availableNumbers.find(n => n.id === numberId);
        
        if (!number) {
            showToast('Number not found', 'error');
            return;
        }
        
        // Check if user has sufficient balance
        if (userData.balance < number.price) {
            showToast('Insufficient balance. Please top up first.', 'error');
            showTopupModal();
            return;
        }
        
        // Show confirmation modal
        const confirmed = await showPurchaseConfirmation(number);
        
        if (!confirmed) {
            return;
        }
        
        // Process purchase
        await processNumberPurchase(number);
        
    } catch (error) {
        console.error('Error purchasing number:', error);
        showToast('Purchase failed. Please try again.', 'error');
    }
}

async function showPurchaseConfirmation(number) {
    return new Promise((resolve) => {
        const modalContent = `
            <div class="modal-header">
                <h3>Confirm Purchase</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="purchase-confirmation">
                    <div class="confirmation-header">
                        <i class="fas fa-shopping-cart fa-3x text-success"></i>
                        <h4>Confirm Number Purchase</h4>
                    </div>
                    
                    <div class="confirmation-details">
                        <div class="detail-row">
                            <span>Number:</span>
                            <strong>${number.phoneNumber}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Country:</span>
                            <strong>${number.flag} ${number.countryName}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Service:</span>
                            <strong>${number.service}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Duration:</span>
                            <strong>${number.duration}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Price:</span>
                            <strong class="text-success">${formatCurrency(number.price)}</strong>
                        </div>
                    </div>
                    
                    <div class="balance-check">
                        <p>Your balance: <strong>${formatCurrency(userData.balance)}</strong></p>
                        <p>After purchase: <strong>${formatCurrency(userData.balance - number.price)}</strong></p>
                    </div>
                    
                    <div class="confirmation-actions">
                        <button class="btn-secondary" id="cancelPurchaseBtn">Cancel</button>
                        <button class="btn-primary" id="confirmPurchaseBtn">
                            <i class="fas fa-check"></i> Confirm Purchase
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'purchaseModal';
        modal.innerHTML = `
            <div class="modal-content">
                ${modalContent}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
            
            // Add event listeners
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });
            
            document.getElementById('cancelPurchaseBtn').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            document.getElementById('confirmPurchaseBtn').addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });
        }, 10);
    });
}

async function processNumberPurchase(number) {
    try {
        showToast('Processing purchase...', 'info');
        
        // Generate order ID
        const orderId = generateOrderId();
        
        // Calculate expiry date (30 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        // Start Firestore batch write
        const batch = db.batch();
        
        // 1. Create order document
        const orderRef = db.collection('orders').doc(orderId);
        batch.set(orderRef, {
            orderId: orderId,
            userId: currentUser.uid,
            numberId: number.id,
            phoneNumber: number.phoneNumber,
            country: number.country,
            service: number.service,
            price: number.price,
            status: 'completed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            expiresAt: expiryDate
        });
        
        // 2. Create number document
        const numberRef = db.collection('numbers').doc(number.id);
        batch.set(numberRef, {
            numberId: number.id,
            userId: currentUser.uid,
            phoneNumber: number.phoneNumber,
            country: number.country,
            countryName: number.countryName,
            service: number.service,
            purchasePrice: number.price,
            purchaseDate: firebase.firestore.FieldValue.serverTimestamp(),
            expiryDate: expiryDate,
            status: 'active',
            lastUsed: firebase.firestore.FieldValue.serverTimestamp(),
            totalSms: 0,
            features: number.features
        });
        
        // 3. Update user balance
        const userRef = db.collection('users').doc(currentUser.uid);
        batch.update(userRef, {
            balance: firebase.firestore.FieldValue.increment(-number.price),
            totalSpent: firebase.firestore.FieldValue.increment(number.price),
            totalOrders: firebase.firestore.FieldValue.increment(1)
        });
        
        // 4. Create transaction record
        const transactionRef = db.collection('transactions').doc(orderId);
        batch.set(transactionRef, {
            transactionId: orderId,
            userId: currentUser.uid,
            type: 'purchase',
            amount: -number.price,
            description: `Purchase of ${number.phoneNumber} for ${number.service}`,
            status: 'completed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // 5. Update available number status (in real app, you'd mark it as sold)
        // For demo, we'll just simulate it
        
        // Execute batch
        await batch.commit();
        
        // Update local user data
        userData.balance -= number.price;
        userData.totalOrders = (userData.totalOrders || 0) + 1;
        
        // Update UI
        document.getElementById('balanceAmount').textContent = formatCurrency(userData.balance);
        document.getElementById('statBalance').textContent = formatCurrency(userData.balance);
        document.getElementById('currentBalance').textContent = formatCurrency(userData.balance);
        document.getElementById('totalOrders').textContent = userData.totalOrders;
        
        // Remove purchased number from available numbers
        availableNumbers = availableNumbers.filter(n => n.id !== number.id);
        filteredNumbers = filteredNumbers.filter(n => n.id !== number.id);
        displayNumbers(filteredNumbers);
        
        // Add notification
        await addNotification(
            'Purchase Successful',
            `You have successfully purchased ${number.phoneNumber} for ${number.service}`,
            'success'
        );
        
        showToast(`Successfully purchased ${number.phoneNumber}!`, 'success');
        
        // Update dashboard stats
        await loadActiveNumbers();
        
    } catch (error) {
        console.error('Error processing purchase:', error);
        throw error;
    }
}

// ================================
// NUMBER DETAILS MODAL
// ================================
async function showNumberDetails(numberId) {
    try {
        const number = availableNumbers.find(n => n.id === numberId);
        
        if (!number) {
            showToast('Number details not found', 'error');
            return;
        }
        
        const modalContent = `
            <div class="modal-header">
                <h3>Number Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="number-details-modal">
                    <div class="number-header-details">
                        <div class="number-icon">
                            ${number.flag}
                        </div>
                        <div class="number-info-details">
                            <h4>${number.phoneNumber}</h4>
                            <p>${number.countryName} • ${number.service}</p>
                        </div>
                    </div>
                    
                    <div class="number-stats">
                        <div class="stat-item">
                            <i class="fas fa-shield-alt"></i>
                            <div>
                                <span class="stat-label">Reliability</span>
                                <span class="stat-value">${number.reliability}%</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-star"></i>
                            <div>
                                <span class="stat-label">Popularity</span>
                                <span class="stat-value">
                                    ${'★'.repeat(number.popularity)}${'☆'.repeat(5 - number.popularity)}
                                </span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <span class="stat-label">Duration</span>
                                <span class="stat-value">${number.duration}</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-bolt"></i>
                            <div>
                                <span class="stat-label">Response Time</span>
                                <span class="stat-value">${Math.floor(Math.random() * 5) + 1}s</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="features-list">
                        <h5>Features:</h5>
                        <ul>
                            ${number.features.map(feature => `<li><i class="fas fa-check text-success"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="pricing-details">
                        <h5>Pricing:</h5>
                        <div class="price-breakdown">
                            <div class="price-item">
                                <span>Number Cost:</span>
                                <span>${formatCurrency(number.price)}</span>
                            </div>
                            <div class="price-item">
                                <span>Service Fee:</span>
                                <span>${formatCurrency(0)}</span>
                            </div>
                            <div class="price-item total">
                                <span>Total:</span>
                                <span class="text-success">${formatCurrency(number.price)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" id="closeDetailsBtn">Close</button>
                        <button class="btn-primary" id="buyFromDetailsBtn" data-id="${number.id}">
                            <i class="fas fa-shopping-cart"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modalBody = document.querySelector('#numberDetailsModal .modal-content');
        modalBody.innerHTML = modalContent;
        
        // Show modal
        showModal('numberDetailsModal');
        
        // Add event listeners
        setTimeout(() => {
            document.getElementById('closeDetailsBtn').addEventListener('click', () => {
                hideModal('numberDetailsModal');
            });
            
            document.getElementById('buyFromDetailsBtn').addEventListener('click', () => {
                hideModal('numberDetailsModal');
                purchaseNumber(number.id);
            });
            
            // Reattach close button listener
            document.querySelector('#numberDetailsModal .modal-close').addEventListener('click', () => {
                hideModal('numberDetailsModal');
            });
        }, 100);
        
    } catch (error) {
        console.error('Error showing number details:', error);
        showToast('Failed to load number details', 'error');
    }
}

// ================================
// MY NUMBERS SECTION
// ================================
async function loadMyNumbers() {
    try {
        const numbersList = document.getElementById('myNumbersList');
        
        // Show loading
        numbersList.innerHTML = `
            <div class="loading-numbers">
                <div class="spinner"></div>
                <p>Loading your numbers...</p>
            </div>
        `;
        
        // Load user's numbers
        const snapshot = await db.collection('numbers')
            .where('userId', '==', currentUser.uid)
            .where('status', '==', 'active')
            .orderBy('purchaseDate', 'desc')
            .get();
        
        if (snapshot.empty) {
            numbersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-phone-slash"></i>
                    <h3>No numbers yet</h3>
                    <p>You haven't purchased any numbers yet</p>
                    <button class="btn-small" onclick="switchSection('buy-numbers')">
                        Buy Your First Number
                    </button>
                </div>
            `;
            return;
        }
        
        numbersList.innerHTML = '';
        snapshot.forEach(doc => {
            const number = doc.data();
            const numberCard = createMyNumberCard(number);
            numbersList.appendChild(numberCard);
        });
        
    } catch (error) {
        console.error('Error loading my numbers:', error);
        showToast('Failed to load your numbers', 'error');
    }
}

function createMyNumberCard(number) {
    const card = document.createElement('div');
    card.className = 'number-card my-number-card';
    
    // Calculate days remaining
    const expiryDate = number.expiryDate?.toDate ? number.expiryDate.toDate() : new Date();
    const today = new Date();
    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    let expiryStatus = 'expired';
    let statusClass = 'status-failed';
    
    if (daysRemaining > 7) {
        expiryStatus = `${daysRemaining} days remaining`;
        statusClass = 'status-success';
    } else if (daysRemaining > 0) {
        expiryStatus = `${daysRemaining} days remaining`;
        statusClass = 'status-warning';
    }
    
    card.innerHTML = `
        <div class="number-header">
            <div class="number-info">
                <h3>${number.service}</h3>
                <div class="country-flag">
                    ${number.country} ${number.countryName}
                </div>
            </div>
            <div class="number-status">
                <span class="status-badge ${statusClass}">${expiryStatus}</span>
            </div>
        </div>
        <div class="number-body">
            <div class="number-phone">
                ${number.phoneNumber}
            </div>
            <div class="number-stats">
                <div class="stat-item">
                    <i class="fas fa-sms"></i>
                    <div>
                        <span class="stat-label">Total SMS</span>
                        <span class="stat-value">${number.totalSms || 0}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-calendar"></i>
                    <div>
                        <span class="stat-label">Purchased</span>
                        <span class="stat-value">${formatDate(number.purchaseDate)}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-hourglass-end"></i>
                    <div>
                        <span class="stat-label">Expires</span>
                        <span class="stat-value">${formatDate(number.expiryDate)}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="number-footer">
            <button class="btn-action" onclick="viewNumberInbox('${number.numberId}')">
                <i class="fas fa-inbox"></i> Inbox
            </button>
            <button class="btn-action" onclick="renewNumber('${number.numberId}')">
                <i class="fas fa-redo"></i> Renew
            </button>
            <button class="btn-action" onclick="manageNumber('${number.numberId}')">
                <i class="fas fa-cog"></i> Manage
            </button>
        </div>
    `;
    
    return card;
}

async function viewNumberInbox(numberId) {
    // Switch to inbox section and filter by this number
    switchSection('inbox');
    
    // You would set a filter to show only messages for this number
    setTimeout(() => {
        showToast(`Loading inbox for selected number...`, 'info');
    }, 500);
}

async function renewNumber(numberId) {
    try {
        // In a real app, you would implement renewal logic
        showToast('Renewal feature coming soon!', 'info');
        
    } catch (error) {
        console.error('Error renewing number:', error);
        showToast('Failed to renew number', 'error');
    }
}

async function manageNumber(numberId) {
    try {
        // In a real app, you would show management options
        showToast('Management options coming soon!', 'info');
        
    } catch (error) {
        console.error('Error managing number:', error);
        showToast('Failed to manage number', 'error');
    }
}

// ================================
// ORDERS SECTION
// ================================
async function loadAllOrders() {
    try {
        const ordersTable = document.getElementById('ordersTable');
        
        // Show loading
        ordersTable.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    <div class="spinner"></div>
                    <p>Loading orders...</p>
                </td>
            </tr>
        `;
        
        // Load orders
        const snapshot = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            ordersTable.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <p>No orders found</p>
                        <button class="btn-small" onclick="switchSection('buy-numbers')">
                            Make Your First Purchase
                        </button>
                    </td>
                </tr>
            `;
            return;
        }
        
        ordersTable.innerHTML = '';
        snapshot.forEach(doc => {
            const order = doc.data();
            const row = createOrderTableRow(order);
            ordersTable.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Failed to load orders', 'error');
    }
}

function createOrderTableRow(order) {
    const row = document.createElement('tr');
    
    // Status badge
    let statusClass = 'status-pending';
    let statusText = 'Pending';
    
    if (order.status === 'completed') {
        statusClass = 'status-success';
        statusText = 'Completed';
    } else if (order.status === 'failed') {
        statusClass = 'status-failed';
        statusText = 'Failed';
    } else if (order.status === 'processing') {
        statusClass = 'status-warning';
        statusText = 'Processing';
    }
    
    row.innerHTML = `
        <td><strong>${order.orderId}</strong></td>
        <td>${order.phoneNumber}</td>
        <td>${order.service}</td>
        <td>${formatCurrency(order.price)}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${formatDate(order.createdAt)}</td>
        <td>
            <button class="btn-action-small" onclick="viewOrderDetails('${order.orderId}')" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action-small" onclick="downloadInvoice('${order.orderId}')" title="Download Invoice">
                <i class="fas fa-download"></i>
            </button>
        </td>
    `;
    
    return row;
}

async function viewOrderDetails(orderId) {
    try {
        const orderDoc = await db.collection('orders').doc(orderId).get();
        
        if (!orderDoc.exists) {
            showToast('Order not found', 'error');
            return;
        }
        
        const order = orderDoc.data();
        
        const modalContent = `
            <div class="modal-header">
                <h3>Order Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-details">
                    <div class="order-id">
                        <strong>Order ID:</strong> ${order.orderId}
                    </div>
                    
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>Phone Number:</label>
                            <span>${order.phoneNumber}</span>
                        </div>
                        <div class="detail-item">
                            <label>Service:</label>
                            <span>${order.service}</span>
                        </div>
                        <div class="detail-item">
                            <label>Country:</label>
                            <span>${order.country}</span>
                        </div>
                        <div class="detail-item">
                            <label>Price:</label>
                            <span class="text-success">${formatCurrency(order.price)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge ${order.status === 'completed' ? 'status-success' : 'status-pending'}">
                                ${order.status}
                            </span>
                        </div>
                        <div class="detail-item">
                            <label>Order Date:</label>
                            <span>${formatDate(order.createdAt)}</span>
                        </div>
                    </div>
                    
                    <div class="order-actions">
                        <button class="btn-secondary" onclick="closeOrderDetails()">Close</button>
                        <button class="btn-primary" onclick="downloadInvoice('${order.orderId}')">
                            <i class="fas fa-download"></i> Download Invoice
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'orderDetailsModal';
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
        
    } catch (error) {
        console.error('Error viewing order details:', error);
        showToast('Failed to load order details', 'error');
    }
}

function closeOrderDetails() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.remove();
    }
}

async function downloadInvoice(orderId) {
    showToast('Generating invoice...', 'info');
    
    // In a real app, you would generate and download a PDF invoice
    setTimeout(() => {
        showToast('Invoice download will be available soon!', 'info');
    }, 1000);
}

// ================================
// EXPORT FUNCTIONS
// ================================
window.loadBuyNumbers = loadBuyNumbers;
window.purchaseNumber = purchaseNumber;
window.showNumberDetails = showNumberDetails;
window.loadMyNumbers = loadMyNumbers;
window.viewNumberInbox = viewNumberInbox;
window.renewNumber = renewNumber;
window.manageNumber = manageNumber;
window.loadAllOrders = loadAllOrders;
window.viewOrderDetails = viewOrderDetails;
window.downloadInvoice = downloadInvoice;

console.log('Numbers JavaScript loaded successfully');
/* ========================================
   MY NUMBERS PAGE FUNCTIONALITY
   ======================================== */

let currentNumbers = [];
let refreshInterval = null;

/**
 * Load user's active numbers
 */
async function loadMyNumbers() {
    try {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        currentNumbers = await getUserNumbers(user.uid);
        
        // Update stats
        updateStats();
        
        // Display numbers
        displayNumbers();

        console.log(`Loaded ${currentNumbers.length} numbers`);
    } catch (error) {
        console.error('Error loading numbers:', error);
        showAlert('Error loading numbers', 'error');
    }
}

/**
 * Update stats cards
 */
function updateStats() {
    const activeCount = currentNumbers.filter(n => n.status === 'active').length;
    const expiringCount = currentNumbers.filter(n => {
        const expiresAt = new Date(n.expiresAt);
        const now = new Date();
        const hoursUntilExpiry = (expiresAt - now) / (1000 * 60 * 60);
        return n.status === 'active' && hoursUntilExpiry < 1;
    }).length;
    const totalSMS = currentNumbers.reduce((sum, n) => sum + (n.sms?.length || 0), 0);

    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('expiringCount').textContent = expiringCount;
    document.getElementById('totalSMS').textContent = totalSMS;
}

/**
 * Display numbers grid
 */
function displayNumbers() {
    const numbersGrid = document.getElementById('numbersGrid');
    const emptyState = document.getElementById('emptyState');

    if (!numbersGrid) return;

    if (currentNumbers.length === 0) {
        numbersGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Apply filters
    const filteredNumbers = filterNumbers();

    if (filteredNumbers.length === 0) {
        numbersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No numbers match your filters</p>';
        return;
    }

    const html = filteredNumbers.map(number => {
        const expiresAt = new Date(number.expiresAt);
        const now = new Date();
        const timeLeft = getTimeRemaining(expiresAt, now);
        const statusClass = number.status === 'active' ? 'status-active' : 'status-expired';
        const countryFlag = getCountryFlag(number.country);

        return `
            <div class="number-card">
                <div class="number-header">
                    <span class="country-flag">${countryFlag}</span>
                    <span class="status-badge ${statusClass}">${number.status}</span>
                </div>
                <div class="number-phone">
                    ${number.phoneNumber}
                </div>
                <div class="number-service">
                    ${number.service}
                </div>
                <div class="number-time-remaining">
                    ${timeLeft}
                </div>
                <div class="number-sms-count">
                    📨 ${number.sms?.length || 0} SMS
                </div>
                <div class="number-actions">
                    <button class="btn btn-sm btn-primary" onclick="openSMSModal('${number.id}')">
                        View SMS
                    </button>
                    ${number.status === 'active' ? `
                        <button class="btn btn-sm btn-secondary" onclick="openExtendModal('${number.id}')">
                            Extend
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    numbersGrid.innerHTML = html;
}

/**
 * Filter numbers based on user selection
 */
function filterNumbers() {
    const serviceFilter = document.getElementById('serviceFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const searchInput = document.getElementById('searchNumbers')?.value.toLowerCase() || '';

    return currentNumbers.filter(number => {
        const matchService = serviceFilter === 'all' || number.service === serviceFilter;
        const matchStatus = statusFilter === 'all' || number.status === statusFilter;
        const matchSearch = number.phoneNumber.includes(searchInput);
        return matchService && matchStatus && matchSearch;
    });
}

/**
 * Get time remaining until expiry
 */
function getTimeRemaining(expiresAt, now) {
    const totalMs = expiresAt - now;
    
    if (totalMs <= 0) {
        return 'Expired';
    }

    const totalSeconds = Math.floor(totalMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

    if (days > 0) {
        return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    } else {
        return `${minutes}m remaining`;
    }
}

/**
 * Get country flag emoji
 */
function getCountryFlag(country) {
    const flags = {
        'gb': '🇬🇧', 'us': '🇺🇸', 'fr': '🇫🇷', 'de': '🇩🇪',
        'it': '🇮🇹', 'es': '🇪🇸', 'au': '🇦🇺',
        'in': '🇮🇳', 'br': '🇧🇷'
    };
    return flags[country] || '🌍';
}

/**
 * Open SMS viewing modal
 * @param {string} numberId - Number ID
 */
function openSMSModal(numberId) {
    const number = currentNumbers.find(n => n.id === numberId);
    if (!number) return;

    const modal = document.getElementById('smsModal');
    const smsList = document.getElementById('smsList');
    const numberDisplay = document.getElementById('modalNumberDisplay');

    if (!modal || !smsList) return;

    numberDisplay.textContent = number.phoneNumber;

    const smsArray = number.sms || [];
    
    if (smsArray.length === 0) {
        smsList.innerHTML = '<p>No SMS received yet</p>';
    } else {
        const html = smsArray.map(sms => `
            <div class="sms-item">
                <div class="sms-from">From: ${sms.from}</div>
                <div class="sms-text">${sms.text}</div>
                <div class="sms-time">${new Date(sms.receivedAt).toLocaleString()}</div>
            </div>
        `).join('');
        smsList.innerHTML = html;
    }

    modal.style.display = 'flex';

    // Setup refresh button
    const refreshBtn = document.getElementById('refreshSMSBtn');
    if (refreshBtn) {
        refreshBtn.onclick = () => refreshSMS(numberId);
    }
}

/**
 * Refresh SMS for a number
 * @param {string} numberId - Number ID
 */
async function refreshSMS(numberId) {
    try {
        const user = getCurrentUser();
        if (!user) return;

        // In production, call checkSMS from fivesim.js
        const smsMessages = await checkSMS(numberId);
        
        // Update local data
        const number = currentNumbers.find(n => n.id === numberId);
        if (number) {
            number.sms = smsMessages;
            
            // Update display
            const smsList = document.getElementById('smsList');
            if (smsMessages.length === 0) {
                smsList.innerHTML = '<p>No SMS received yet</p>';
            } else {
                const html = smsMessages.map(sms => `
                    <div class="sms-item">
                        <div class="sms-from">From: ${sms.from}</div>
                        <div class="sms-text">${sms.text}</div>
                        <div class="sms-time">${new Date(sms.receivedAt).toLocaleString()}</div>
                    </div>
                `).join('');
                smsList.innerHTML = html;
            }

            showAlert('SMS refreshed', 'success');
        }
    } catch (error) {
        console.error('Error refreshing SMS:', error);
        showAlert('Error refreshing SMS', 'error');
    }
}

/**
 * Open extend duration modal
 * @param {string} numberId - Number ID
 */
function openExtendModal(numberId) {
    const number = currentNumbers.find(n => n.id === numberId);
    if (!number) return;

    const modal = document.getElementById('extendModal');
    const numberDisplay = document.getElementById('extendNumberDisplay');
    const priceInfo = document.getElementById('priceInfo');
    const durationSelect = document.getElementById('durationSelect');

    if (!modal) return;

    numberDisplay.textContent = number.phoneNumber;

    modal.style.display = 'flex';

    // Update price when duration changes
    if (durationSelect) {
        durationSelect.onchange = () => {
            updateExtendPrice(parseInt(durationSelect.value));
        };
        // Initial price update
        updateExtendPrice(parseInt(durationSelect.value));
    }

    // Setup confirm button
    const confirmBtn = document.getElementById('confirmExtendBtn');
    if (confirmBtn) {
        confirmBtn.onclick = () => handleExtendNumber(numberId);
    }
}

/**
 * Update extend price display
 * @param {number} days - Number of days
 */
function updateExtendPrice(days) {
    const dailyRate = 50; // ₦50 per day (approximate)
    const totalPrice = (dailyRate * days) / 100; // Convert to kobo and display as naira
    const priceDisplay = document.getElementById('priceDisplay');
    
    if (priceDisplay) {
        priceDisplay.textContent = `₦${(dailyRate * days).toLocaleString()}`;
    }
}

/**
 * Handle extend number
 * @param {string} numberId - Number ID
 */
async function handleExtendNumber(numberId) {
    try {
        const user = getCurrentUser();
        if (!user) {
            showAlert('Please log in first', 'error');
            return;
        }

        const durationSelect = document.getElementById('durationSelect');
        const days = parseInt(durationSelect.value);

        // In production, call extendNumberDuration from fivesim.js
        const result = await extendNumberDuration(numberId, days);

        if (result.success) {
            showAlert(result.message, 'success');
            closeModal('extendModal');
            
            // Reload numbers
            setTimeout(() => {
                loadMyNumbers();
            }, 1000);
        } else {
            showAlert('Error extending number', 'error');
        }
    } catch (error) {
        console.error('Error extending number:', error);
        showAlert(error.message || 'Error extending number', 'error');
    }
}

/**
 * Close modal
 * @param {string} modalId - Modal ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Setup event listeners
 */
function setupMyNumbersListeners() {
    // Filter listeners
    const filters = ['serviceFilter', 'statusFilter', 'searchNumbers'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', displayNumbers);
            if (filterId === 'searchNumbers') {
                element.addEventListener('input', displayNumbers);
            }
        }
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

    // Auto-refresh SMS every 10 seconds
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(async () => {
        const user = getCurrentUser();
        if (user) {
            await loadMyNumbers();
        }
    }, 10000);
}

/**
 * Initialize page
 */
async function initMyNumbersPage() {
    try {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Load numbers
        await loadMyNumbers();

        // Setup listeners
        setupMyNumbersListeners();

        console.log('My numbers page initialized');
    } catch (error) {
        console.error('Error initializing my numbers page:', error);
        showAlert('Error loading page', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initMyNumbersPage);

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (refreshInterval) clearInterval(refreshInterval);
});

// Soft live-reload handler: refresh numbers when a soft change is detected
window.addEventListener('live-reload:changed', async function () {
    try {
        console.log('live-reload:changed - refreshing my numbers');
        await loadMyNumbers();
    } catch (e) {
        console.warn('Failed to refresh my numbers on live-reload event', e);
    }
});

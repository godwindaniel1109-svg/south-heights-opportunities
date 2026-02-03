// ========================================
// BUY USA NUMBER PAGE JAVASCRIPT
// ========================================

const US_STATES = {
    ca: { name: 'California', code: 'CA', areaCodes: ['212', '415', '310', '408'] },
    tx: { name: 'Texas', code: 'TX', areaCodes: ['214', '713', '512', '830'] },
    ny: { name: 'New York', code: 'NY', areaCodes: ['212', '718', '917', '631'] },
    fl: { name: 'Florida', code: 'FL', areaCodes: ['305', '407', '813', '561'] },
    il: { name: 'Illinois', code: 'IL', areaCodes: ['312', '773', '708', '630'] },
    pa: { name: 'Pennsylvania', code: 'PA', areaCodes: ['215', '412', '610', '717'] },
    oh: { name: 'Ohio', code: 'OH', areaCodes: ['216', '614', '513', '330'] },
    ga: { name: 'Georgia', code: 'GA', areaCodes: ['404', '770', '678', '706'] },
    nc: { name: 'North Carolina', code: 'NC', areaCodes: ['704', '919', '910', '336'] },
    mi: { name: 'Michigan', code: 'MI', areaCodes: ['313', '586', '734', '616'] },
    nj: { name: 'New Jersey', code: 'NJ', areaCodes: ['201', '908', '973', '609'] },
    va: { name: 'Virginia', code: 'VA', areaCodes: ['703', '804', '540', '757'] },
    wa: { name: 'Washington', code: 'WA', areaCodes: ['206', '425', '253', '360'] },
    az: { name: 'Arizona', code: 'AZ', areaCodes: ['602', '480', '623', '928'] },
    ma: { name: 'Massachusetts', code: 'MA', areaCodes: ['617', '508', '413', '774'] }
};

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initializeBuyUSANumber();
});

// USA services will be fetched dynamically from 5SIM API
let US_SERVICES = {}; // { serviceKey: { name, priceUSD, priceNGN } }

// Fetch services from 5SIM API for USA
async function fetchUSServices() {
    try {
        const response = await fetch('/api/phone-numbers/available_numbers/?country=us');
        if (!response.ok) {
            throw new Error('Failed to fetch USA services from 5SIM API');
        }

        const data = await response.json();
        US_SERVICES = {};

        // Process 5SIM pricing data for USA
        if (typeof data === 'object' && !Array.isArray(data)) {
            // If data is object, check for 'us' key
            const usData = data['us'] || data['US'];
            if (usData && usData.services) {
                Object.entries(usData.services).forEach(([service, priceUSD]) => {
                    if (typeof priceUSD === 'number') {
                        const priceNGN = Math.round(priceUSD * 2 * 1200); // 2x markup, USD to NGN (1 USD = 1200 NGN)
                        const serviceName = service.charAt(0).toUpperCase() + service.slice(1).replace(/_/g, ' ');
                        US_SERVICES[service] = {
                            name: serviceName,
                            priceUSD: priceUSD,
                            priceNGN: priceNGN
                        };
                    }
                });
            }
        } else if (Array.isArray(data)) {
            // If array, find items for USA
            data.forEach(item => {
                if (item && typeof item === 'object') {
                    const country = (item.country || item.iso || item.code || '').toLowerCase();
                    if (country === 'us') {
                        const services = item.services || {};
                        Object.entries(services).forEach(([service, priceUSD]) => {
                            if (typeof priceUSD === 'number') {
                                const priceNGN = Math.round(priceUSD * 2 * 1200);
                                const serviceName = service.charAt(0).toUpperCase() + service.slice(1).replace(/_/g, ' ');
                                US_SERVICES[service] = {
                                    name: serviceName,
                                    priceUSD: priceUSD,
                                    priceNGN: priceNGN
                                };
                            }
                        });
                    }
                }
            });
        }

        // Populate service dropdown with fetched services
        populateServiceSelect();
    } catch (error) {
        console.error('Error fetching USA services from 5SIM:', error);
        // Show error but don't block the page
        const selects = document.querySelectorAll('#serviceSelect');
        selects.forEach(select => {
            if (select.querySelectorAll('option:not([value=""])').length === 0) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = 'Error loading services. Please refresh.';
                opt.disabled = true;
                select.appendChild(opt);
            }
        });
    }
}

function populateServiceSelect() {
    const selects = document.querySelectorAll('#serviceSelect');
    selects.forEach(select => {
        // clear existing (keep placeholder)
        select.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
        
        if (Object.keys(US_SERVICES).length > 0) {
            // Sort services alphabetically by name
            const sortedServices = Object.entries(US_SERVICES).sort((a, b) => 
                a[1].name.localeCompare(b[1].name)
            );
            
            sortedServices.forEach(([key, serviceData]) => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = `${serviceData.name} - ₦${serviceData.priceNGN.toLocaleString()}`;
                opt.dataset.priceNgn = serviceData.priceNGN;
                opt.dataset.priceUsd = serviceData.priceUSD;
                select.appendChild(opt);
            });
        }
    });
}

function setupServiceFlow() {
    const continueBtn = document.getElementById('serviceContinueBtn');
    const serviceSelect = document.getElementById('serviceSelect');

    if (serviceSelect) {
        serviceSelect.addEventListener('change', () => {
            const val = serviceSelect.value;
            const duration = document.getElementById('duration')?.value || '1';
            if (val) fetchAndDisplayNumbers(val, duration);
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', function () {
            const select = document.getElementById('serviceSelect');
            const duration = document.getElementById('duration')?.value || '1';
            if (!select || !select.value) {
                showAlert('Please select a service', 'danger');
                return;
            }
            fetchAndDisplayNumbers(select.value, duration);
        });
    }

    // populate order history tables where present
    populateOrderHistory();
}

async function fetchAndDisplayNumbers(serviceKey, duration) {
    const numbersGrid = document.getElementById('numbersGrid');
    if (!numbersGrid) return;
    
    const serviceName = US_SERVICES[serviceKey]?.name || serviceKey;
    numbersGrid.innerHTML = `<div class="loading">Fetching numbers for ${serviceName}...</div>`;

    try {
        // Fetch from backend API (5SIM)
        const response = await fetch(`/api/phone-numbers/available_numbers/?country=us&service=${encodeURIComponent(serviceKey)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch numbers');
        }

        const data = await response.json();
        let numbers = [];

        // Process 5SIM response - structure may vary
        if (Array.isArray(data)) {
            numbers = data;
        } else if (data && typeof data === 'object') {
            const usData = data['us'] || data['US'];
            if (usData && usData.services) {
                // 5SIM returns pricing, not individual numbers - numbers are purchased on-demand
                // Show available service with price
                const priceUSD = usData.services[serviceKey];
                if (typeof priceUSD === 'number') {
                    const priceNGN = Math.round(priceUSD * 2 * 1200);
                    numbers.push({
                        phone: 'Available on purchase',
                        service: serviceName,
                        priceUSD: priceUSD,
                        priceNGN: priceNGN,
                        serviceKey: serviceKey
                    });
                }
            }
        }

        if (!numbers || numbers.length === 0) {
            numbersGrid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500"><p class="text-lg">No numbers available for ${serviceName} right now.</p></div>`;
            return;
        }

        // Get price in Naira from service data or calculate
        const serviceData = US_SERVICES[serviceKey];
        const priceNGN = serviceData ? serviceData.priceNGN : (numbers[0].priceNGN || Math.round((numbers[0].priceUSD || 0) * 2 * 1200));

        numbersGrid.innerHTML = numbers.map(n => {
            const phone = n.phone || n.number || n.msisdn || 'Available on purchase';
            const displayPriceNGN = n.priceNGN || priceNGN;
            const displayService = serviceName || n.service || serviceKey;
            
            return `
                <div class="number-card" onclick="openPurchaseModal('${phone}', '${displayService}', '${displayPriceNGN}', '${serviceKey}')">
                    <div class="number-flag">🇺🇸</div>
                    <div class="number-value">${phone}</div>
                    <div class="number-info">
                        <span class="number-type">${displayService}</span>
                        <span class="number-price">₦${displayPriceNGN.toLocaleString()}</span>
                    </div>
                    <ul class="number-features">
                        <li>SMS Capable</li>
                        <li>Suitable for ${displayService}</li>
                    </ul>
                    <button class="btn btn-primary">Select Number</button>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Error fetching numbers:', err);
        numbersGrid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500"><p class="text-lg">Error fetching numbers. Try again later.</p></div>`;
    }
}

function openPurchaseModal(number, serviceName, price, serviceKey) {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        document.getElementById('selectedNumber').value = number;
        document.getElementById('selectedState').value = serviceName;
        document.getElementById('selectedServiceKey').value = serviceKey;
        // Price is already in Naira
        const priceNum = typeof price === 'string' ? parseFloat(price.replace(/[₦,]/g, '')) : parseFloat(price);
        document.getElementById('selectedPrice').value = '₦' + priceNum.toLocaleString();
        modal.classList.remove('hidden');
    }
}

async function handlePurchase(e) {
    e.preventDefault();

    const number = document.getElementById('selectedNumber').value;
    const serviceKey = document.getElementById('selectedServiceKey').value;
    const priceText = document.getElementById('selectedPrice').value;
    const priceNGN = parseFloat(priceText.replace(/[₦,]/g, ''));

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        // Check wallet balance first
        const walletResponse = await fetch('/api/wallet/balance/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        
        if (walletResponse.ok) {
            const walletData = await walletResponse.json();
            const walletBalance = parseFloat(walletData.balance || 0);
            
            if (walletBalance < priceNGN) {
                showAlert(`Insufficient wallet balance. Your balance is ₦${walletBalance.toLocaleString()}, but you need ₦${priceNGN.toLocaleString()}. Please fund your wallet first.`, 'danger');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }
        }

        // Buy number from backend API
        const response = await fetch('/api/phone-numbers/buy_number/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({
                country: 'us',
                service: serviceKey.toLowerCase(),
                amount: priceNGN
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Purchase failed');
        }

        const data = await response.json();
        showAlert(data.message || `Successfully purchased number ${data.phone_number || number}`, 'success');
        document.getElementById('purchaseModal').classList.add('hidden');
        setTimeout(() => { window.location.href = 'order-history.html'; }, 1200);
    } catch (err) {
        console.error(err);
        showAlert(err.message || 'Purchase failed. Please try again.', 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function populateOrderHistory() {
    const table = document.getElementById('orderHistoryTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    const countryCodeLabel = 'US';

    // Sample rows per user's example (country code adjusted)
    const sample = [
        { phone: '123-456-7890', code: countryCodeLabel, service: 'WhatsApp', timer: '10:00', id: '1', date: '12/14/25', status: 'Active' },
        { phone: '234-567-8901', code: countryCodeLabel, service: 'Telegram', timer: '05:30', id: '2', date: '12/13/25', status: 'Expired' },
        { phone: '345-678-9012', code: countryCodeLabel, service: 'Google', timer: '12:00', id: '3', date: '12/10/25', status: 'Active' }
    ];

    sample.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.phone}</td>
            <td>${r.code}</td>
            <td>${r.service}</td>
            <td>${r.timer}</td>
            <td>${r.id}</td>
            <td>${r.date}</td>
            <td class="${r.status === 'Active' ? 'status-active' : 'status-expired'}">${r.status}</td>
        `;
        tbody.appendChild(tr);
    });
}

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
}

async function initializeBuyUSANumber() {
    setupEventListeners();
    loadUserData();
    // Fetch services from 5SIM API first, then populate dropdown
    await fetchUSServices();
    setupServiceFlow();
}

function setupEventListeners() {
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', handleSearch);
    }

    const logoutBtns = document.querySelectorAll('#logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = document.getElementById('purchaseModal');
            if (modal) modal.classList.add('hidden');
        });
    });

    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handlePurchase);
    }

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

function loadUserData() {
    const userEmail = localStorage.getItem('userEmail');
    const userEmailElements = document.querySelectorAll('#userEmail');
    userEmailElements.forEach(el => {
        el.textContent = userEmail || 'user@example.com';
    });
}

function handleSearch(e) {
    e.preventDefault();

    const state = document.getElementById('state').value;
    const areaCode = document.getElementById('areaCode').value;
    const numberType = document.getElementById('numberType').value;
    const duration = document.getElementById('duration').value;

    if (!state || !numberType || !duration) {
        showAlert('Please select state, number type and duration', 'danger');
        return;
    }

    const numbersGrid = document.getElementById('numbersGrid');
    numbersGrid.innerHTML = '<div class="loading">Searching for numbers...</div>';

    // Simulate API call
    setTimeout(() => {
        displayNumbers(state, areaCode, numberType, duration);
    }, 1000);
}

// This function is deprecated - use fetchAndDisplayNumbers instead which fetches from 5SIM
// Keeping for backwards compatibility but it should not be called
function displayNumbers(state, areaCode, numberType, duration) {
    console.warn('displayNumbers is deprecated. Use fetchAndDisplayNumbers with service selection instead.');
    const numbersGrid = document.getElementById('numbersGrid');
    numbersGrid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500"><p class="text-lg">Please select a service to view available numbers.</p></div>';
}



function closeModal(e) {
    const modal = (e && e.target) ? e.target.closest('.modal') : document.getElementById('purchaseModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}



function handleLogout() {
    // Use logout confirmation helper
    if (typeof showLogoutConfirmation === 'function') {
        showLogoutConfirmation(() => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            showAlert('Logout successful!', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    } else {
        // Fallback if helper not loaded
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        }
    }
}

function showAlert(message, type = 'info') {
    const alert = document.getElementById('alert');
    if (!alert) return;

    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    alert.classList.remove('alert-hidden');

    setTimeout(() => {
        alert.classList.add('alert-hidden');
    }, 4000);
}

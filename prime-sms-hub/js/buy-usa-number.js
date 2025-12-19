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

// List of available services/apps (from user spec)
const SERVICES = [
    'WhatsApp','Telegram','Google','Facebook','Instagram','TikTok','Twitter/X','LinkedIn','Snapchat','Viber','Signal','Zoom','PayPal','Discord','Slack','Microsoft','Netflix','Spotify','Gmail','Yahoo','Outlook','Reddit','Pinterest','Amazon','eBay','Uber','Lyft','Airbnb','Binance','Coinbase','Venmo','CashApp','WeChat','QQ','Line','KakaoTalk','Hike','Truecaller','ProtonMail','Bumble','Tinder','Hinge','OkCupid','Grindr','Teams','Clubhouse','Shopify','WordPress','GitHub','Payoneer'
];

function populateServiceSelect() {
    const selects = document.querySelectorAll('#serviceSelect');
    selects.forEach(select => {
        // clear existing (keep placeholder)
        select.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
        SERVICES.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.toLowerCase().replace(/\s|\//g, '_');
            opt.textContent = s;
            select.appendChild(opt);
        });
    });
}

function setupServiceFlow() {
    const continueBtn = document.getElementById('serviceContinueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function () {
            const select = document.getElementById('serviceSelect');
            const duration = document.getElementById('duration')?.value || '1';
            if (!select || !select.value) {
                showAlert('Please select a service', 'danger');
                return;
            }
            const serviceName = select.options[select.selectedIndex].textContent;
            // generate sample numbers for the selected service
            displayNumbersForService(serviceName, duration);
        });
    }

    // populate order history tables where present
    populateOrderHistory();
}

function displayNumbersForService(serviceName, duration) {
    const numbersGrid = document.getElementById('numbersGrid');
    if (!numbersGrid) return;
    numbersGrid.innerHTML = '<div class="loading">Searching for numbers for ' + serviceName + '...</div>';

    setTimeout(() => {
        const prices = { '1': 4.99, '3': 13.99, '6': 25.99, '12': 45.99 };
        const numbers = [];
        const path = window.location.pathname || '';
        const isCanada = path.toLowerCase().includes('canada');
        const countryFlag = isCanada ? '🇨🇦' : '🇺🇸';
        const countryCode = isCanada ? '+1' : '+1'; // both use +1 but kept for clarity

        for (let i = 0; i < 6; i++) {
            const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
            const fullNumber = `${countryCode}${String(randomNumber)}`;
            numbers.push({ number: fullNumber, service: serviceName, price: prices[duration] || 4.99 });
        }

        numbersGrid.innerHTML = numbers.map(num => `
            <div class="number-card" onclick="openPurchaseModal('${num.number}', '${num.service}', 'service', '${num.price}')">
                <div class="number-flag">${countryFlag}</div>
                <div class="number-value">${num.number}</div>
                <div class="number-info">
                    <span class="number-type">${num.service}</span>
                    <span class="number-price">$${num.price.toFixed(2)}</span>
                </div>
                <ul class="number-features">
                    <li>SMS Capable</li>
                    <li>Suitable for ${num.service}</li>
                </ul>
                <button class="btn btn-primary">Select Number</button>
            </div>
        `).join('');
    }, 700);
}

function populateOrderHistory() {
    const table = document.getElementById('orderHistoryTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    const path = window.location.pathname || '';
    const isCanada = path.toLowerCase().includes('canada');
    const countryCodeLabel = isCanada ? 'CA' : 'US';

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

function initializeBuyUSANumber() {
    setupEventListeners();
    loadUserData();
    populateServiceSelect();
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
        btn.addEventListener('click', closeModal);
    });

    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handlePurchase);
    }

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
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

function displayNumbers(state, areaCode, numberType, duration) {
    const stateData = US_STATES[state];
    const numbersGrid = document.getElementById('numbersGrid');
    const prices = {
        local: { 1: 4.99, 3: 13.99, 6: 25.99, 12: 45.99 },
        tollfree: { 1: 9.99, 3: 27.99, 6: 49.99, 12: 89.99 },
        premium: { 1: 19.99, 3: 55.99, 6: 99.99, 12: 179.99 }
    };

    // Generate sample numbers
    const numbers = [];
    const selectedAreaCode = areaCode || stateData.areaCodes[0];
    
    for (let i = 0; i < 6; i++) {
        const randomNumber = Math.floor(Math.random() * 10000000);
        const fullNumber = `+1${selectedAreaCode}${String(randomNumber).padStart(7, '0')}`;
        numbers.push({
            number: fullNumber,
            areaCode: selectedAreaCode,
            state: stateData.name,
            type: numberType,
            price: prices[numberType][duration],
            features: ['SMS Capable', 'Voice Ready', 'US Coverage', 'Unlimited Messaging']
        });
    }

    numbersGrid.innerHTML = numbers.map(num => `
        <div class="number-card" onclick="openPurchaseModal('${num.number}', '${num.state}', '${num.type}', '${num.price}')">
            <div class="number-flag">🇺🇸</div>
            <div class="number-value">${num.number}</div>
            <div class="number-info">
                <span class="number-type">${num.type}</span>
                <span class="number-price">$${num.price.toFixed(2)}</span>
            </div>
            <ul class="number-features">
                ${num.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <button class="btn btn-primary">Select Number</button>
        </div>
    `).join('');
}

function openPurchaseModal(number, state, type, price) {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        document.getElementById('selectedNumber').value = number;
        document.getElementById('selectedState').value = state;
        document.getElementById('selectedType').value = type;
        document.getElementById('selectedPrice').value = '$' + parseFloat(price).toFixed(2);
        modal.classList.add('active');
    }
}

function closeModal(e) {
    const modal = e.target.closest('.modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handlePurchase(e) {
    e.preventDefault();

    const number = document.getElementById('selectedNumber').value;
    const useForSending = document.getElementById('useForSending').checked;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    setTimeout(() => {
        showAlert(`Successfully purchased USA number ${number}!`, 'success');
        document.getElementById('purchaseModal').classList.remove('active');
        
        setTimeout(() => {
            window.location.href = 'order-history.html';
        }, 1500);
    }, 1500);
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    showAlert('Logout successful!', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
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

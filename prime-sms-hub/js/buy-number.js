// ========================================
// BUY NUMBER PAGE JAVASCRIPT
// ========================================

const COUNTRIES = {
    gb: { name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
    fr: { name: 'France', flag: '🇫🇷', code: '+33' },
    de: { name: 'Germany', flag: '🇩🇪', code: '+49' },
    it: { name: 'Italy', flag: '🇮🇹', code: '+39' },
    es: { name: 'Spain', flag: '🇪🇸', code: '+34' },
    au: { name: 'Australia', flag: '🇦🇺', code: '+61' },
    jp: { name: 'Japan', flag: '🇯🇵', code: '+81' },
    in: { name: 'India', flag: '🇮🇳', code: '+91' },
    br: { name: 'Brazil', flag: '🇧🇷', code: '+55' }
};

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initializeBuyNumber();
});

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
}

function initializeBuyNumber() {
    setupEventListeners();
    loadUserData();
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

    const country = document.getElementById('country').value;
    const numberType = document.getElementById('numberType').value;
    const duration = document.getElementById('duration').value;

    if (!country || !numberType || !duration) {
        showAlert('Please select all fields', 'danger');
        return;
    }

    const numbersGrid = document.getElementById('numbersGrid');
    numbersGrid.innerHTML = '<div class="loading">Searching for numbers...</div>';

    // Simulate API call
    setTimeout(() => {
        displayNumbers(country, numberType, duration);
    }, 1000);
}

function displayNumbers(country, numberType, duration) {
    const countryData = COUNTRIES[country];
    const numbersGrid = document.getElementById('numbersGrid');
    const prices = {
        local: 5.99,
        tollfree: 9.99,
        mobile: 7.99
    };

    // Generate sample numbers
    const numbers = [];
    for (let i = 0; i < 6; i++) {
        const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
        numbers.push({
            number: `${countryData.code}${randomNumber}`,
            type: numberType,
            price: (prices[numberType] || 5.99),
            features: ['SMS Capable', 'Voice Ready', 'Global Reach']
        });
    }

    numbersGrid.innerHTML = numbers.map(num => `
        <div class="number-card" onclick="openPurchaseModal('${num.number}', '${countryData.name}', '${num.price}')">
            <div class="number-flag">${countryData.flag}</div>
            <div class="number-value">${num.number}</div>
            <div class="number-info">
                <span class="number-type">${num.type}</span>
                <span class="number-price">$${num.price.toFixed(2)}/${duration}m</span>
            </div>
            <ul class="number-features">
                ${num.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <button class="btn btn-primary">Select Number</button>
        </div>
    `).join('');
}

function openPurchaseModal(number, country, price) {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        document.getElementById('selectedNumber').value = number;
        document.getElementById('selectedCountry').value = country;
        document.getElementById('selectedPrice').value = '$' + price.toFixed(2);
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
        showAlert(`Successfully purchased number ${number}!`, 'success');
        document.getElementById('purchaseModal').classList.remove('active');
        
        setTimeout(() => {
            window.location.href = 'order-history.html';
        }, 1500);
    }, 1500);
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

// If a table-based BUY page is used (server-driven), fetch numbers for the page COUNTRY
async function fetchCountryNumbers() {
    try {
        if (typeof COUNTRY === 'undefined') return;
        const tbody = document.getElementById('numbersTableBody');
        if (!tbody) return;

        const res = await api.request(`/phone-numbers/available_numbers/?country=${encodeURIComponent(COUNTRY)}`);
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (res && Array.isArray(res.data)) list = res.data;
        else if (res && typeof res === 'object') Object.values(res).forEach(v => { if (Array.isArray(v)) list = list.concat(v); });

        tbody.innerHTML = '';
        if (!list || list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No numbers available for this country.</td></tr>';
            return;
        }

        list.forEach(item => {
            const phone = item.phone || item.number || item.msisdn || item.phone_number || item.name || item.id || '';
            const service = item.service || item.product || item.type || item.name || '-';
            const price = (item.price || item.cost || item['price_display'] || item['amount'] || item['price']) || '-';
            const available = (item.available === false) ? '<span style="color: var(--cancelled);">Unavailable</span>' : '<span style="color: var(--success);">✓ Available</span>';

            const tr = document.createElement('tr');
            tr.innerHTML = `\
                <td>${phone}</td>\
                <td>${service}</td>\
                <td>${price}</td>\
                <td>${available}</td>\
                <td><button class="btn-buy" onclick="openPurchaseModal('${phone}', '${service}', '${price}')">Buy</button></td>\
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('Could not load numbers for COUNTRY', e);
    }
}

// Load on page ready if this is a country-specific table page
document.addEventListener('DOMContentLoaded', function () {
    try {
        fetchCountryNumbers();
    } catch (e) {
        // ignore
    }
});

// Soft live-reload: refresh the table when a soft change is detected
window.addEventListener('live-reload:changed', function () {
    try {
        console.log('live-reload:changed - refreshing available numbers table');
        fetchCountryNumbers();
    } catch (e) {
        console.warn('Failed to refresh country numbers on live-reload event', e);
    }
});

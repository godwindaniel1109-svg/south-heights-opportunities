// ========================================
// DASHBOARD PAGE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initializeDashboard();
});

function initializeDashboard() {
    loadUserData();
    setupEventListeners();
    loadActivityData();
}

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
}

function loadUserData() {
    const userEmail = localStorage.getItem('userEmail');
    const userEmailElements = document.querySelectorAll('#userEmail');
    userEmailElements.forEach(el => {
        el.textContent = userEmail || 'user@example.com';
    });

    // Populate welcome message on dashboard header
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome) {
        if (userEmail) {
            const name = userEmail.split('@')[0];
            userWelcome.textContent = `Welcome, ${name}`;
        } else {
            userWelcome.textContent = 'Welcome back!';
        }
    }

    // Simulate loading user stats
    updateStats({
        balance: 60.55,
        smsSent: 245,
        activeNumbers: 3,
        successRate: 98.5
    });
}

function updateStats(stats) {
    const balanceEl = document.getElementById('balance');
    const smsSentEl = document.getElementById('smsSent');
    const activeNumbersEl = document.getElementById('activeNumbers');
    const successRateEl = document.getElementById('successRate');

    if (balanceEl) balanceEl.textContent = '₦' + (typeof stats.balance === 'number' ? stats.balance.toFixed(2) : stats.balance);
    if (smsSentEl) smsSentEl.textContent = stats.smsSent;
    if (activeNumbersEl) activeNumbersEl.textContent = stats.activeNumbers;
    if (successRateEl) successRateEl.textContent = stats.successRate + '%';
}

function setupEventListeners() {
    const logoutBtns = document.querySelectorAll('#logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    const addFundsBtn = document.getElementById('addFundsBtn');
    if (addFundsBtn) {
        addFundsBtn.addEventListener('click', openAddFundsModal);
    }

    const addFundsForm = document.getElementById('addFundsForm');
    if (addFundsForm) {
        addFundsForm.addEventListener('submit', handleAddFunds);
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Modal background click to close
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function loadActivityData() {
    // Simulated activity data - replace with real API call
    const activities = [
        {
            icon: '📨',
            title: 'SMS Sent',
            desc: '5 messages to +1234567890',
            time: '2 hours ago'
        },
        {
            icon: '💰',
            title: 'Funds Added',
            desc: '$50.00 credited to account',
            time: '1 day ago'
        }
    ];

    const activityList = document.getElementById('activityList');
    if (activityList && activityList.children.length === 0) {
        activityList.innerHTML = '';
        // Keep existing activity items
    }
}

function openAddFundsModal(e) {
    e.preventDefault();
    const modal = document.getElementById('addFundsModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(e) {
    const modal = e.target.closest('.modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleAddFunds(e) {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!amount || !paymentMethod) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    if (parseFloat(amount) < 5) {
        showAlert('Minimum amount is $5.00', 'danger');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    setTimeout(() => {
        showAlert(`Successfully added $${parseFloat(amount).toFixed(2)} to your account!`, 'success');
        
        // Update balance
        const currentBalance = parseFloat(document.getElementById('balance').textContent.replace('$', ''));
        updateStats({
            balance: currentBalance + parseFloat(amount),
            smsSent: parseInt(document.getElementById('smsSent').textContent),
            activeNumbers: parseInt(document.getElementById('activeNumbers').textContent),
            successRate: parseFloat(document.getElementById('successRate').textContent)
        });

        document.getElementById('addFundsModal').classList.remove('active');
        e.target.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Proceed to Payment';
    }, 1500);
}

function handleLogout() {
    // Use logout confirmation helper
    if (typeof showLogoutConfirmation === 'function') {
        showLogoutConfirmation(() => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('loginMethod');
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
            localStorage.removeItem('loginMethod');
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

// Soft live-reload handler: refresh dashboard widgets when soft change occurs
window.addEventListener('live-reload:changed', async function () {
    try {
        console.log('live-reload:changed - refreshing dashboard');
        loadUserData();
        // Try to refresh wallet/balance from API if available
        if (typeof api !== 'undefined' && api.getWalletBalance) {
            try {
                const wallet = await api.getWalletBalance();
                const currencyMap = { 'NGN': '₦', 'USD': '$', 'EUR': '€' };
                const currencySymbol = currencyMap[wallet.currency] || wallet.currency || '';
                const amount = Number(wallet.balance || 0);
                updateStats({ balance: amount, smsSent: document.getElementById('smsSent')?.textContent || 0, activeNumbers: document.getElementById('activeNumbers')?.textContent || 0, successRate: document.getElementById('successRate')?.textContent || '0' });
            } catch (e) {
                console.warn('Could not refresh wallet balance during soft reload', e);
            }
        }
    } catch (e) {
        console.warn('Failed to refresh dashboard on live-reload event', e);
    }
});

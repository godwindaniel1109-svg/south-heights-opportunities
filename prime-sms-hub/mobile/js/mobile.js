/* ==================== MOBILE APP CORE JS ==================== */

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed'));
}

// Check auth on load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardData();
});

// Authentication check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update UI with user info
    const userName = userEmail ? userEmail.split('@')[0] : 'User';
    document.getElementById('userName').textContent = `Welcome, ${userName}`;
}

// Load dashboard data
async function loadDashboardData() {
    const userEmail = localStorage.getItem('userEmail');
    
    // Fetch real wallet data, fallback to mock
    let wallet = await api.getWallet();
    if (!wallet) {
      wallet = getMockData('wallet');
    }
    
    const balance = wallet ? (wallet.balance / 100).toFixed(2) : '0.00';
    document.getElementById('balance').textContent = `₦${balance}`;
    
    // Fetch recent transactions
    let transactions = await api.getTransactions(3);
    if (!transactions) {
      transactions = getMockData('transactions');
    }
    
    const recentActivity = document.getElementById('recentActivity');
    if (!transactions || transactions.length === 0) {
        recentActivity.innerHTML = '<div style="padding: 1rem; text-align: center;">No activity yet</div>';
    } else {
        recentActivity.innerHTML = transactions.map(t => `
            <div style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); text-align: left;">
                <div style="font-weight: 600; color: var(--text-primary);">${t.description}</div>
                <div style="color: var(--text-secondary); font-size: 0.75rem;">₦${(t.amount / 100).toFixed(2)} • ${new Date(t.created_at).toLocaleDateString()}</div>
            </div>
        `).join('');
    }
}

// Navigation
function goTo(page) {
    window.location.href = page;
}

function setActive(element) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

// Menu modal
function toggleMenu() {
    const modal = document.getElementById('menuModal');
    modal.classList.toggle('active');
}

// Add funds
function openAddFunds() {
    const amount = prompt('Enter amount to add (₦):');
    if (amount && !isNaN(amount) && amount > 0) {
        alert(`Processing ₦${amount} payment...`);
        // In production, integrate with Paystack
    }
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
}

// Prevent pull-to-refresh on mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, false);

// Handle orientation change
window.addEventListener('orientationchange', () => {
    // Adjust UI if needed
    document.documentElement.style.height = '100vh';
});

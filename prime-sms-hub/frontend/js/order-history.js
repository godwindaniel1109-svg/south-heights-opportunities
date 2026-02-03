// ========================================
// ORDER HISTORY PAGE JAVASCRIPT
// ========================================

let allOrders = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initializeOrderHistory();
});

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
}

function initializeOrderHistory() {
    setupEventListeners();
    loadUserData();
    loadOrders();
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterOrders);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', filterOrders);
    }

    const logoutBtns = document.querySelectorAll('#logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Pagination buttons
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', handlePagination);
    });
}

function loadUserData() {
    const userEmail = localStorage.getItem('userEmail');
    const userEmailElements = document.querySelectorAll('#userEmail');
    userEmailElements.forEach(el => {
        el.textContent = userEmail || 'user@example.com';
    });
}

function loadOrders() {
    // Simulated order data - replace with actual API call
    allOrders = [
        {
            id: '#ORD-001',
            number: '+14155552671',
            country: '🇺🇸 USA',
            type: 'Local',
            purchaseDate: 'Dec 1, 2024',
            expiryDate: 'Jan 1, 2025',
            price: '$4.99',
            status: 'active'
        },
        {
            id: '#ORD-002',
            number: '+441234567890',
            country: '🇬🇧 UK',
            type: 'Local',
            purchaseDate: 'Nov 15, 2024',
            expiryDate: 'Dec 15, 2024',
            price: '$5.99',
            status: 'expired'
        },
        {
            id: '#ORD-003',
            number: '+33123456789',
            country: '🇫🇷 France',
            type: 'Toll Free',
            purchaseDate: 'Nov 1, 2024',
            expiryDate: 'Feb 1, 2025',
            price: '$9.99',
            status: 'active'
        }
    ];

    displayOrders(allOrders);
}

function displayOrders(orders) {
    const ordersTable = document.getElementById('ordersTable');
    const emptyState = document.getElementById('emptyState');

    if (!orders || orders.length === 0) {
        ordersTable.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    ordersTable.style.display = 'table-body';
    if (emptyState) emptyState.style.display = 'none';

    ordersTable.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.number}</td>
            <td>${order.country}</td>
            <td>${order.type}</td>
            <td>${order.purchaseDate}</td>
            <td>${order.expiryDate}</td>
            <td>${order.price}</td>
            <td><span class="badge badge-${order.status === 'active' ? 'success' : 'warning'}">${order.status}</span></td>
            <td>
                <button class="btn-action" title="Details" onclick="openOrderDetailsModal('${order.id}')">📋</button>
                <button class="btn-action" title="Renew">🔄</button>
                <button class="btn-action" title="Cancel">❌</button>
            </td>
        </tr>
    `).join('');
}

function filterOrders() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const statusValue = document.getElementById('statusFilter').value;

    const filtered = allOrders.filter(order => {
        const matchesSearch = order.number.toLowerCase().includes(searchValue) ||
                            order.country.toLowerCase().includes(searchValue);
        const matchesStatus = !statusValue || order.status === statusValue;
        return matchesSearch && matchesStatus;
    });

    displayOrders(filtered);
}

function openOrderDetailsModal(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('detailsModal');
    if (modal) {
        document.getElementById('detailOrderId').textContent = order.id;
        document.getElementById('detailNumber').textContent = order.number;
        document.getElementById('detailCountry').textContent = order.country;
        document.getElementById('detailPurchaseDate').textContent = order.purchaseDate;
        document.getElementById('detailExpiryDate').textContent = order.expiryDate;
        document.getElementById('detailPrice').textContent = order.price;
        document.getElementById('detailStatus').innerHTML = `<span class="badge badge-${order.status === 'active' ? 'success' : 'warning'}">${order.status}</span>`;
        
        modal.classList.add('active');
    }
}

function closeModal(e) {
    const modal = e.target.closest('.modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handlePagination(e) {
    const btn = e.target;
    if (!btn.disabled) {
        showAlert('Navigating to page...', 'info');
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

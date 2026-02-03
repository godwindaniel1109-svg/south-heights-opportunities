// ========================================
// TRANSACTION HISTORY PAGE JAVASCRIPT
// ========================================

let allTransactions = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initializeTransactionHistory();
});

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
}

function initializeTransactionHistory() {
    setupEventListeners();
    loadUserData();
    loadTransactions();
    // Update balance display using backend API
    if (typeof api !== 'undefined' && api.getWalletBalance) {
        try { updateWalletBalance(); } catch (e) { console.warn('updateWalletBalance failed', e); }
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterTransactions);
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', filterTransactions);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', filterTransactions);
    }

    const logoutBtns = document.querySelectorAll('#logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportAsCSV);
    }

    const exportPDFBtn = document.getElementById('exportPDF');
    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', exportAsPDF);
    }

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

async function updateWalletBalance() {
    try {
        const wallet = await api.getWalletBalance();
        const amountEl = document.getElementById('walletBalanceSidebar');
        const summaryEl = document.getElementById('summaryNetBalance');
        const currencyMap = {
            'NGN': '₦',
            'USD': '$',
            'EUR': '€'
        };
        const currencySymbol = currencyMap[wallet.currency] || wallet.currency || '';
        const amount = Number(wallet.balance || 0);
        const formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        if (amountEl) amountEl.textContent = `${currencySymbol}${formatted}`;
        if (summaryEl) summaryEl.textContent = `${currencySymbol}${formatted}`;
    } catch (err) {
        console.warn('Failed to fetch wallet balance', err);
    }
}

function loadTransactions() {
    // Simulated transaction data - replace with actual API call
    allTransactions = [
        {
            date: 'Dec 8, 2024 10:30',
            reference: '#TXN-001',
            description: 'Phone Number Purchase - +14155552671',
            type: 'debit',
            amount: '-$4.99',
            balance: '$245.01',
            status: 'completed'
        },
        {
            date: 'Dec 7, 2024 14:20',
            reference: '#TXN-002',
            description: 'Account Credit - Credit Card',
            type: 'credit',
            amount: '+$100.00',
            balance: '$250.00',
            status: 'completed'
        },
        {
            date: 'Dec 6, 2024 09:15',
            reference: '#TXN-003',
            description: 'Phone Number Purchase - +441234567890',
            type: 'debit',
            amount: '-$5.99',
            balance: '$150.00',
            status: 'completed'
        },
        {
            date: 'Dec 5, 2024 16:45',
            reference: '#TXN-004',
            description: 'Account Credit - PayPal',
            type: 'credit',
            amount: '+$50.00',
            balance: '$155.99',
            status: 'completed'
        },
        {
            date: 'Dec 4, 2024 11:30',
            reference: '#TXN-005',
            description: 'Phone Number Purchase - +33123456789',
            type: 'debit',
            amount: '-$9.99',
            balance: '$105.99',
            status: 'completed'
        },
        {
            date: 'Dec 1, 2024 13:20',
            reference: '#TXN-006',
            description: 'Account Credit - Credit Card',
            type: 'credit',
            amount: '+$100.00',
            balance: '$115.98',
            status: 'completed'
        }
    ];

    displayTransactions(allTransactions);
}

function displayTransactions(transactions) {
    const transactionsTable = document.getElementById('transactionsTable');
    const emptyState = document.getElementById('emptyState');

    if (!transactions || transactions.length === 0) {
        transactionsTable.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    transactionsTable.style.display = 'table-body';
    if (emptyState) emptyState.style.display = 'none';

    transactionsTable.innerHTML = transactions.map(txn => `
        <tr>
            <td>${txn.date}</td>
            <td>${txn.reference}</td>
            <td>${txn.description}</td>
            <td><span class="badge badge-${txn.type === 'credit' ? 'success' : 'danger'}">${txn.type}</span></td>
            <td class="${txn.type === 'credit' ? 'text-success' : 'text-danger'}">${txn.amount}</td>
            <td>${txn.balance}</td>
            <td><span class="badge badge-success">${txn.status}</span></td>
            <td>
                <button class="btn-action" title="View Details" onclick="openTransactionDetailsModal('${txn.reference}')">👁️</button>
                <button class="btn-action" title="Download">⬇️</button>
            </td>
        </tr>
    `).join('');
}

function filterTransactions() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const typeValue = document.getElementById('typeFilter').value;
    const statusValue = document.getElementById('statusFilter').value;

    const filtered = allTransactions.filter(txn => {
        const matchesSearch = txn.reference.toLowerCase().includes(searchValue) ||
                            txn.description.toLowerCase().includes(searchValue);
        const matchesType = !typeValue || txn.type === typeValue;
        const matchesStatus = !statusValue || txn.status === statusValue;
        return matchesSearch && matchesType && matchesStatus;
    });

    displayTransactions(filtered);
}

function openTransactionDetailsModal(reference) {
    const txn = allTransactions.find(t => t.reference === reference);
    if (!txn) return;

    const modal = document.getElementById('detailsModal');
    if (modal) {
        document.getElementById('detailReference').textContent = txn.reference;
        document.getElementById('detailDate').textContent = txn.date;
        document.getElementById('detailDescription').textContent = txn.description;
        document.getElementById('detailType').innerHTML = `<span class="badge badge-${txn.type === 'credit' ? 'success' : 'danger'}">${txn.type}</span>`;
        document.getElementById('detailAmount').textContent = txn.amount;
        document.getElementById('detailBalance').textContent = txn.balance;
        document.getElementById('detailStatus').innerHTML = `<span class="badge badge-success">${txn.status}</span>`;
        
        modal.classList.add('active');
    }
}

function closeModal(e) {
    const modal = e.target.closest('.modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function exportAsCSV() {
    if (allTransactions.length === 0) {
        showAlert('No transactions to export', 'warning');
        return;
    }

    const csv = [
        ['Date', 'Reference', 'Description', 'Type', 'Amount', 'Balance', 'Status'],
        ...allTransactions.map(txn => [
            txn.date,
            txn.reference,
            txn.description,
            txn.type,
            txn.amount,
            txn.balance,
            txn.status
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    showAlert('Transactions exported as CSV', 'success');
}

function exportAsPDF() {
    if (allTransactions.length === 0) {
        showAlert('No transactions to export', 'warning');
        return;
    }

    // Basic PDF generation (in production, use a library like jsPDF)
    let pdfContent = 'TRANSACTION HISTORY REPORT\n';
    pdfContent += '=' .repeat(50) + '\n\n';
    
    allTransactions.forEach(txn => {
        pdfContent += `Reference: ${txn.reference}\n`;
        pdfContent += `Date: ${txn.date}\n`;
        pdfContent += `Description: ${txn.description}\n`;
        pdfContent += `Type: ${txn.type}\n`;
        pdfContent += `Amount: ${txn.amount}\n`;
        pdfContent += `Balance: ${txn.balance}\n`;
        pdfContent += `Status: ${txn.status}\n`;
        pdfContent += '-'.repeat(50) + '\n\n';
    });

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.txt';
    a.click();
    window.URL.revokeObjectURL(url);

    showAlert('Transactions exported as PDF', 'success');
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

// Soft live-reload handler: refresh wallet balance and transactions when soft change occurs
window.addEventListener('live-reload:changed', async function () {
    try {
        console.log('live-reload:changed - refreshing transactions and wallet balance');
        if (typeof updateWalletBalance === 'function') await updateWalletBalance();
        if (typeof loadTransactions === 'function') loadTransactions();
    } catch (e) {
        console.warn('Failed to refresh transactions on live-reload event', e);
    }
});

/**
 * Mobile Admin App Logic
 * Handles authentication, data loading, tab switching, and admin actions
 */

// Check admin authentication on page load
async function checkAdminAuth() {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('authToken');
    const adminRole = localStorage.getItem('adminRole');
    
    if (!token || adminRole !== 'admin') {
        // Not logged in or not admin - redirect to login
        window.location.href = '../login.html?redirect=/mobile-admin/';
        return false;
    }
    return true;
}

/**
 * Load admin dashboard stats
 */
async function loadAdminStats() {
    const container = document.getElementById('statsContainer');
    if (!container) return;

    try {
        let stats = await api.getAdminStats();
        if (!stats) {
            stats = getMockData('admin.stats') || {
                totalUsers: 0,
                activeUsers: 0,
                totalRevenue: 0,
                pendingPayments: 0,
                failedTransactions: 0
            };
        }

        container.innerHTML = `
            <div class="stats-grid">
                <div class="admin-stat">
                    <div class="stat-value">${stats.totalUsers || 0}</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="admin-stat">
                    <div class="stat-value">${stats.activeUsers || 0}</div>
                    <div class="stat-label">Active (30d)</div>
                </div>
                <div class="admin-stat">
                    <div class="stat-value">₦${(stats.totalRevenue || 0).toFixed(0)}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="admin-stat">
                    <div class="stat-value">${stats.pendingPayments || 0}</div>
                    <div class="stat-label">Pending Payments</div>
                </div>
            </div>
        `;

        // Load system status
        loadSystemStatus();
    } catch (error) {
        console.error('Failed to load stats:', error);
        container.innerHTML = '<div class="error-message">Failed to load stats</div>';
    }
}

/**
 * Load system status
 */
async function loadSystemStatus() {
    const container = document.getElementById('systemStatus');
    if (!container) return;

    try {
        const backendStatus = await checkBackendStatus();
        const cacheStatus = await checkCacheStatus();

        container.innerHTML = `
            <div class="status-item">
                <span class="status-badge status-${backendStatus ? 'active' : 'offline'}">
                    ${backendStatus ? '✓ Backend Online' : '✗ Backend Offline'}
                </span>
            </div>
            <div class="status-item">
                <span class="status-badge status-active">
                    ✓ Cache Ready (${cacheStatus})
                </span>
            </div>
            <div class="status-item">
                <button class="btn btn-sm btn-secondary" onclick="clearCache()">Clear Cache</button>
            </div>
        `;
    } catch (error) {
        console.error('Failed to load system status:', error);
    }
}

/**
 * Check backend connectivity
 */
async function checkBackendStatus() {
    try {
        const response = await fetch(`${api.baseURL}/api/health/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Check cache status
 */
async function checkCacheStatus() {
    if (!navigator.storage || !navigator.storage.estimate) {
        return 'N/A';
    }
    try {
        const estimate = await navigator.storage.estimate();
        const used = (estimate.usage / 1024 / 1024).toFixed(1); // MB
        return `${used} MB`;
    } catch (error) {
        return 'N/A';
    }
}

/**
 * Clear app cache
 */
async function clearCache() {
    try {
        if ('caches' in window) {
            const names = await caches.keys();
            await Promise.all(names.map(name => caches.delete(name)));
        }
        showNotification('Cache cleared successfully');
        loadSystemStatus();
    } catch (error) {
        console.error('Failed to clear cache:', error);
        showNotification('Failed to clear cache', 'error');
    }
}

/**
 * Switch between admin tabs
 */
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Show selected tab
    const tab = document.getElementById(tabName + 'Tab');
    if (tab) {
        tab.classList.remove('hidden');
    }

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(tabName));
    });

    // Load data for the selected tab
    if (tabName === 'users') {
        loadUsers();
    } else if (tabName === 'payments') {
        loadPayments();
    } else if (tabName === 'support') {
        loadConversations();
    }
}

/**
 * Set active navigation item
 */
function setActive(element) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

/**
 * Logout admin user
 */
async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('userEmail');
        window.location.href = '../admin-login.html';
    }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 10px;
        right: 10px;
        padding: 12px;
        background-color: ${type === 'error' ? '#d32f2f' : '#388e3c'};
        color: white;
        border-radius: 4px;
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), duration);
}

/**
 * Show loading state
 */
function showLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                <div style="margin-bottom: 10px;">⏳</div>
                ${message}
            </div>
        `;
    }
}

/**
 * Show empty state
 */
function showEmpty(containerId, message = 'No items found') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #999;">
                ${message}
            </div>
        `;
    }
}

/**
 * Show modal dialog
 */
function showModal(title, message, actions = []) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="modal-body">${message}</div>
            <div class="modal-footer">
                ${actions.map(action => `
                    <button class="btn btn-${action.type || 'primary'}" onclick="${action.onClick || 'this.parentElement.parentElement.parentElement.remove()'}">${action.label}</button>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    // Check admin authentication first
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) return;

    // Load initial data
    if (document.getElementById('statsContainer')) {
        await loadAdminStats();
    }

    // Set up offline indicator
    window.addEventListener('online', () => {
        showNotification('Back online', 'success');
    });
    window.addEventListener('offline', () => {
        showNotification('You are offline - using cached data', 'warning');
    });
});

// ============================================================================
// USER MANAGEMENT FUNCTIONS
// ============================================================================

let allUsers = [];
let filteredUsers = [];
let currentFilter = 'all';

/**
 * Load users list
 */
async function loadUsers() {
    showLoading('usersContainer', 'Loading users...');
    try {
        let users = await api.getUsers();
        if (!users) {
            users = getMockData('admin.users') || [];
        }
        allUsers = users;
        filterUsers('all');
    } catch (error) {
        console.error('Failed to load users:', error);
        showEmpty('usersContainer', 'Failed to load users');
    }
}

/**
 * Filter users by status
 */
function filterUsers(status) {
    currentFilter = status;
    if (status === 'all') {
        filteredUsers = allUsers;
    } else {
        filteredUsers = allUsers.filter(u => u.status === status);
    }
    renderUsers();
    updateFilterButtons();
}

/**
 * Search users by email or name
 */
function searchUsers() {
    const query = document.getElementById('userSearch')?.value.toLowerCase() || '';
    if (!query) {
        filterUsers(currentFilter);
        return;
    }
    filteredUsers = allUsers.filter(u =>
        (u.email && u.email.toLowerCase().includes(query)) ||
        (u.name && u.name.toLowerCase().includes(query))
    );
    renderUsers();
}

/**
 * Render users list
 */
function renderUsers() {
    const container = document.getElementById('usersContainer');
    if (!container) return;

    if (filteredUsers.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">No users found</div>';
        return;
    }

    container.innerHTML = filteredUsers.map(user => `
        <div class="user-item">
            <div class="user-info">
                <div class="user-name">${user.name || user.email}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-meta">
                    Balance: ₦${(user.balance || 0).toFixed(2)} | 
                    Joined: ${user.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}
                </div>
            </div>
            <div class="user-status">
                <span class="status-badge status-${user.status}">${user.status}</span>
            </div>
            <div class="user-actions">
                ${user.status === 'active' ? `<button class="btn btn-sm btn-danger" onclick="suspendUser(${user.id})">Suspend</button>` : ''}
                ${user.status === 'suspended' ? `<button class="btn btn-sm btn-success" onclick="activateUser(${user.id})">Activate</button>` : ''}
                <button class="btn btn-sm btn-secondary" onclick="viewUserDetails(${user.id})">View</button>
            </div>
        </div>
    `).join('');
}

/**
 * Update filter button styles
 */
function updateFilterButtons() {
    document.querySelectorAll('.filter-btn')?.forEach(btn => {
        const btnStatus = btn.textContent.toLowerCase().trim();
        btn.classList.toggle('active', btnStatus === currentFilter || btnStatus.includes(currentFilter));
    });
}

/**
 * Suspend a user
 */
async function suspendUser(userId) {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    
    showNotification('Suspending user...', 'info');
    const success = await api.updateUser(userId, { status: 'suspended' });
    if (success) {
        showNotification('User suspended successfully');
        loadUsers();
    } else {
        showNotification('Failed to suspend user', 'error');
    }
}

/**
 * Activate a suspended user
 */
async function activateUser(userId) {
    if (!confirm('Are you sure you want to activate this user?')) return;
    
    showNotification('Activating user...', 'info');
    const success = await api.updateUser(userId, { status: 'active' });
    if (success) {
        showNotification('User activated successfully');
        loadUsers();
    } else {
        showNotification('Failed to activate user', 'error');
    }
}

/**
 * View user details
 */
async function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    showModal(`User: ${user.email}`, `
        <div style="text-align: left;">
            <p><strong>Name:</strong> ${user.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Balance:</strong> ₦${(user.balance || 0).toFixed(2)}</p>
            <p><strong>Status:</strong> ${user.status}</p>
            <p><strong>Joined:</strong> ${user.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Last Login:</strong> ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
        </div>
    `);
}

// ============================================================================
// PAYMENT MANAGEMENT FUNCTIONS
// ============================================================================

let allPayments = [];
let filteredPayments = [];
let currentPaymentFilter = 'pending';

/**
 * Load payments list
 */
async function loadPayments() {
    showLoading('paymentsContainer', 'Loading payments...');
    try {
        let payments = await api.getTransactions();
        if (!payments) {
            payments = getMockData('admin.payments') || [];
        }
        allPayments = payments;
        filterPayments('pending');
    } catch (error) {
        console.error('Failed to load payments:', error);
        showEmpty('paymentsContainer', 'Failed to load payments');
    }
}

/**
 * Filter payments by status
 */
function filterPayments(status) {
    currentPaymentFilter = status;
    filteredPayments = allPayments.filter(p => 
        !p.status || p.status.toLowerCase() === status.toLowerCase()
    );
    renderPayments();
    updatePaymentFilterButtons();
}

/**
 * Render payments list
 */
function renderPayments() {
    const container = document.getElementById('paymentsContainer');
    if (!container) return;

    if (filteredPayments.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 20px; color: #999;">No ${currentPaymentFilter} payments</div>`;
        return;
    }

    container.innerHTML = filteredPayments.map(payment => `
        <div class="payment-item">
            <div class="payment-info">
                <div class="payment-user">${payment.user || payment.email || 'Unknown'}</div>
                <div class="payment-amount">₦${(payment.amount || 0).toFixed(2)}</div>
                <div class="payment-meta">
                    ${payment.method || 'Payment'} • 
                    ${payment.date ? new Date(payment.date).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
            </div>
            <div class="payment-status">
                <span class="status-badge status-${payment.status || 'pending'}">${payment.status || 'pending'}</span>
            </div>
            ${(!payment.status || payment.status === 'pending') ? `
                <div class="payment-actions">
                    <button class="btn btn-sm btn-success" onclick="approvePayment(${payment.id})">Approve</button>
                    <button class="btn btn-sm btn-danger" onclick="rejectPayment(${payment.id})">Reject</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Update payment filter button styles
 */
function updatePaymentFilterButtons() {
    document.querySelectorAll('.filter-btn')?.forEach(btn => {
        const btnStatus = btn.textContent.toLowerCase().trim();
        btn.classList.toggle('active', btnStatus === currentPaymentFilter);
    });
}

/**
 * Approve a payment
 */
async function approvePayment(paymentId) {
    const payment = allPayments.find(p => p.id === paymentId);
    if (!payment || !confirm(`Approve payment of ₦${(payment.amount || 0).toFixed(2)}?`)) return;
    
    showNotification('Approving payment...', 'info');
    const success = await api.approveTransaction(paymentId);
    if (success) {
        showNotification('Payment approved successfully');
        loadPayments();
    } else {
        showNotification('Failed to approve payment', 'error');
    }
}

/**
 * Reject a payment
 */
async function rejectPayment(paymentId) {
    const payment = allPayments.find(p => p.id === paymentId);
    if (!payment || !confirm(`Reject payment of ₦${(payment.amount || 0).toFixed(2)}?`)) return;
    
    showNotification('Rejecting payment...', 'info');
    const success = await api.rejectTransaction(paymentId);
    if (success) {
        showNotification('Payment rejected');
        loadPayments();
    } else {
        showNotification('Failed to reject payment', 'error');
    }
}

// ============================================================================
// SUPPORT MANAGEMENT FUNCTIONS
// ============================================================================

let allConversations = [];
let filteredConversations = [];
let selectedConversationId = null;

/**
 * Load support conversations
 */
async function loadConversations() {
    showLoading('conversationsContainer', 'Loading conversations...');
    try {
        let conversations = await api.getSupportConversations();
        if (!conversations) {
            conversations = getMockData('admin.support') || [];
        }
        allConversations = conversations;
        filteredConversations = conversations;
        renderConversations();
    } catch (error) {
        console.error('Failed to load conversations:', error);
        showEmpty('conversationsContainer', 'Failed to load conversations');
    }
}

/**
 * Search conversations
 */
function searchConversations() {
    const query = document.getElementById('supportSearch')?.value.toLowerCase() || '';
    if (!query) {
        filteredConversations = allConversations;
    } else {
        filteredConversations = allConversations.filter(c =>
            (c.user && c.user.toLowerCase().includes(query)) ||
            (c.subject && c.subject.toLowerCase().includes(query)) ||
            (c.lastMessage && c.lastMessage.toLowerCase().includes(query))
        );
    }
    renderConversations();
}

/**
 * Render conversations list
 */
function renderConversations() {
    const container = document.getElementById('conversationsContainer');
    if (!container) return;

    if (filteredConversations.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">No conversations found</div>';
        return;
    }

    container.innerHTML = filteredConversations.map(conv => `
        <div class="conversation-item" onclick="openConversationDetail(${conv.id})">
            <div class="conversation-header">
                <div class="conversation-user">${conv.user || 'Unknown'}</div>
                <div class="conversation-date">${conv.date ? new Date(conv.date).toLocaleDateString() : new Date().toLocaleDateString()}</div>
            </div>
            <div class="conversation-subject">${conv.subject || 'Support Request'}</div>
            <div class="conversation-preview">${conv.lastMessage || 'No messages'}</div>
            ${conv.unread ? '<div class="unread-badge">New</div>' : ''}
        </div>
    `).join('');
}

/**
 * Open conversation detail
 */
async function openConversationDetail(conversationId) {
    selectedConversationId = conversationId;
    const conversation = allConversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const modal = document.getElementById('detailModal') || document.querySelector('.modal');
    if (modal) {
        document.getElementById('modalTitle').textContent = `${conversation.user} - ${conversation.subject}`;
        showLoading('messagesContainer', 'Loading messages...');
        
        let messages = conversation.messages || [];
        if (messages.length === 0) {
            messages = await api.getSupportMessages(conversationId);
        }
        
        renderMessages(messages);
        modal.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('replyText')?.focus();
        }, 100);
    }
}

/**
 * Render messages in conversation
 */
function renderMessages(messages) {
    const container = document.getElementById('messagesContainer');
    if (!container) return;

    container.innerHTML = messages.map(msg => `
        <div class="message" style="text-align: ${msg.sender === 'admin' ? 'right' : 'left'};">
            <div class="message-bubble" style="background-color: ${msg.sender === 'admin' ? '#FF6B35' : '#f0f0f0'}; color: ${msg.sender === 'admin' ? 'white' : 'black'};">
                <div class="message-text">${msg.text || msg.content}</div>
                <div class="message-time" style="font-size: 0.75rem; opacity: 0.7;">
                    ${msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    `).join('');

    // Scroll to bottom
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

/**
 * Send reply to conversation
 */
async function sendReply() {
    const text = document.getElementById('replyText')?.value.trim();
    if (!text || !selectedConversationId) return;

    const replyInput = document.getElementById('replyText');
    replyInput.value = '';
    replyInput.disabled = true;

    showNotification('Sending reply...', 'info');
    const success = await api.replySupportMessage(selectedConversationId, text);
    
    if (success) {
        showNotification('Reply sent');
        await openConversationDetail(selectedConversationId);
        loadConversations();
    } else {
        showNotification('Failed to send reply', 'error');
    }
    
    replyInput.disabled = false;
}

/**
 * Close detail modal
 */
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    selectedConversationId = null;
}

/**
 * Close modal dialog
 */
function closeModal() {
    const modal = document.querySelector('.modal:not(.hidden)');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Format date for display
 */
function formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `₦${(amount || 0).toFixed(2)}`;
}

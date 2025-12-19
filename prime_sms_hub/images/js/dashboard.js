// ================================
// DASHBOARD MAIN FUNCTIONALITY
// ================================

// Global Variables
let currentUser = null;
let userData = null;
let notifications = [];
let unreadCount = 0;

// ================================
// DOM CONTENT LOADED
// ================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
});

// ================================
// INITIALIZATION FUNCTIONS
// ================================
async function initDashboard() {
    try {
        // Check authentication
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                
                // Load user data from Firestore
                await loadUserData(user.uid);
                
                // Initialize UI
                initUI();
                
                // Load dashboard data
                await loadDashboardData();
                
                // Set up event listeners
                setupEventListeners();
                
                // Hide loading screen
                setTimeout(() => {
                    document.getElementById('loadingScreen').style.display = 'none';
                    document.querySelector('.container').style.display = 'flex';
                }, 1000);
                
            } else {
                // Redirect to login if not authenticated
                window.location.href = 'login.html';
            }
        });
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showToast('Failed to load dashboard. Please refresh.', 'error');
    }
}

// Load user data from Firestore
async function loadUserData(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists) {
            userData = userDoc.data();
            
            // Update user info in UI
            document.getElementById('userName').textContent = userData.name || 'User';
            document.getElementById('userEmail').textContent = currentUser.email;
            document.getElementById('userId').textContent = userId.substring(0, 8);
            document.getElementById('welcomeName').textContent = userData.name || 'User';
            
            // Update balance
            document.getElementById('balanceAmount').textContent = 
                formatCurrency(userData.balance || 0);
            document.getElementById('statBalance').textContent = 
                formatCurrency(userData.balance || 0);
            document.getElementById('currentBalance').textContent = 
                formatCurrency(userData.balance || 0);
            
            // Update stats
            document.getElementById('totalOrders').textContent = 
                userData.totalOrders || 0;
            document.getElementById('accountLevel').textContent = 
                userData.role === 'admin' ? 'Admin' : 
                userData.accountTier || 'Basic';
            
            return userData;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        throw error;
    }
}

// Initialize UI elements
function initUI() {
    // Set current page title
    updatePageTitle('Dashboard');
    
    // Initialize theme from user settings
    const theme = userData?.settings?.theme || 'dark';
    setTheme(theme);
    
    // Initialize notifications
    loadNotifications();
    
    // Initialize mobile menu
    initMobileMenu();
}

// ================================
// DASHBOARD DATA LOADING
// ================================
async function loadDashboardData() {
    try {
        // Load active numbers count
        await loadActiveNumbers();
        
        // Load SMS statistics
        await loadSMSStats();
        
        // Load recent orders
        await loadRecentOrders();
        
        // Load notifications
        await loadNotifications();
        
        // Load available numbers (for buy section)
        await loadAvailableNumbers();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load active numbers count
async function loadActiveNumbers() {
    try {
        const snapshot = await db.collection('numbers')
            .where('userId', '==', currentUser.uid)
            .where('status', '==', 'active')
            .get();
        
        const count = snapshot.size;
        document.getElementById('activeNumbers').textContent = count;
        document.getElementById('activeSessions').textContent = count;
    } catch (error) {
        console.error('Error loading active numbers:', error);
    }
}

// Load SMS statistics
async function loadSMSStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Total SMS
        const totalSnapshot = await db.collection('messages')
            .where('userId', '==', currentUser.uid)
            .get();
        
        // Today's SMS
        const todaySnapshot = await db.collection('messages')
            .where('userId', '==', currentUser.uid)
            .where('timestamp', '>=', today)
            .get();
        
        document.getElementById('totalSms').textContent = totalSnapshot.size;
        document.getElementById('todaySms').textContent = todaySnapshot.size;
    } catch (error) {
        console.error('Error loading SMS stats:', error);
    }
}

// Load recent orders
async function loadRecentOrders() {
    try {
        const snapshot = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();
        
        const ordersTable = document.getElementById('recentOrdersTable');
        
        if (snapshot.empty) {
            ordersTable.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <p>No orders yet</p>
                        <button class="btn-small" id="placeFirstOrderBtn">Place Your First Order</button>
                    </td>
                </tr>
            `;
            return;
        }
        
        ordersTable.innerHTML = '';
        snapshot.forEach(doc => {
            const order = doc.data();
            const row = createOrderRow(order);
            ordersTable.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading recent orders:', error);
    }
}

// Create order row for table
function createOrderRow(order) {
    const row = document.createElement('tr');
    
    // Format date
    const orderDate = order.createdAt?.toDate 
        ? formatDate(order.createdAt.toDate())
        : 'N/A';
    
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
        <td><strong>${order.orderId || 'N/A'}</strong></td>
        <td>${order.service || 'N/A'}</td>
        <td>${order.phoneNumber || 'N/A'}</td>
        <td>${formatCurrency(order.price || 0)}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${orderDate}</td>
    `;
    
    return row;
}

// ================================
// NAVIGATION & UI FUNCTIONS
// ================================
function updatePageTitle(title) {
    document.getElementById('pageTitle').textContent = title;
}

function setTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// ================================
// NOTIFICATIONS
// ================================
async function loadNotifications() {
    try {
        const snapshot = await db.collection('notifications')
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        
        notifications = [];
        unreadCount = 0;
        
        const notificationList = document.getElementById('notificationList');
        notificationList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const notification = doc.data();
            notification.id = doc.id;
            notifications.push(notification);
            
            if (!notification.read) {
                unreadCount++;
            }
            
            const item = createNotificationItem(notification);
            notificationList.appendChild(item);
        });
        
        // Update badge
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('inboxBadge').textContent = unreadCount > 9 ? '9+' : unreadCount;
        
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function createNotificationItem(notification) {
    const item = document.createElement('div');
    item.className = 'notification-item';
    if (!notification.read) {
        item.classList.add('unread');
    }
    
    // Icon based on type
    let icon = 'fas fa-info-circle';
    let iconClass = 'text-info';
    
    switch (notification.type) {
        case 'success':
            icon = 'fas fa-check-circle';
            iconClass = 'text-success';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            iconClass = 'text-warning';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            iconClass = 'text-danger';
            break;
        case 'payment':
            icon = 'fas fa-coins';
            iconClass = 'text-success';
            break;
        case 'order':
            icon = 'fas fa-shopping-cart';
            iconClass = 'text-info';
            break;
    }
    
    const timeAgo = getTimeAgo(notification.timestamp?.toDate() || new Date());
    
    item.innerHTML = `
        <i class="${icon} ${iconClass}"></i>
        <div class="notification-content">
            <p>${notification.message || 'New notification'}</p>
            <span class="notification-time">${timeAgo}</span>
        </div>
    `;
    
    // Mark as read on click
    item.addEventListener('click', () => {
        markNotificationAsRead(notification.id);
        item.classList.remove('unread');
    });
    
    return item;
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

async function markNotificationAsRead(notificationId) {
    try {
        await db.collection('notifications').doc(notificationId).update({
            read: true,
            readAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        unreadCount = Math.max(0, unreadCount - 1);
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('inboxBadge').textContent = unreadCount > 9 ? '9+' : unreadCount;
        
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// ================================
// SECTION NAVIGATION
// ================================
function setupNavigation() {
    // Sidebar navigation
    document.querySelectorAll('.nav-menu li:not(#logoutBtn)').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            
            if (section) {
                switchSection(section);
            }
        });
    });
    
    // Quick action cards
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    // Section buttons
    document.getElementById('viewAllOrdersBtn')?.addEventListener('click', () => switchSection('orders'));
    document.getElementById('viewOrdersBtn')?.addEventListener('click', () => switchSection('orders'));
    document.getElementById('addFundsBtn')?.addEventListener('click', () => switchSection('balance'));
    document.getElementById('quickBuyBtn')?.addEventListener('click', () => switchSection('buy-numbers'));
    document.getElementById('placeFirstOrderBtn')?.addEventListener('click', () => switchSection('buy-numbers'));
    document.getElementById('manageSessionsBtn')?.addEventListener('click', () => switchSection('my-numbers'));
    document.getElementById('upgradeAccountBtn')?.addEventListener('click', () => showUpgradeModal());
    document.getElementById('quickTopupBtn')?.addEventListener('click', () => showTopupModal());
    document.getElementById('tutorialBtn')?.addEventListener('click', () => showTutorial());
}

function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionId}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update active nav item
        const navItem = document.querySelector(`.nav-menu li[data-section="${sectionId}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
        
        // Update page title
        const sectionTitle = targetSection.querySelector('h2')?.textContent || sectionId;
        updatePageTitle(sectionTitle);
        
        // Load section-specific data
        loadSectionData(sectionId);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

async function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'orders':
            await loadAllOrders();
            break;
        case 'my-numbers':
            await loadMyNumbers();
            break;
        case 'buy-numbers':
            await loadBuyNumbers();
            break;
        case 'inbox':
            await loadInboxMessages();
            break;
        case 'balance':
            await loadTransactionHistory();
            break;
        case 'transactions':
            await loadAllTransactions();
            break;
        case 'support':
            loadSupportContent();
            break;
        case 'settings':
            loadSettingsContent();
            break;
    }
}

function handleQuickAction(action) {
    switch (action) {
        case 'buy-number':
            switchSection('buy-numbers');
            break;
        case 'view-inbox':
            switchSection('inbox');
            break;
        case 'add-funds':
            switchSection('balance');
            break;
        case 'support':
            switchSection('support');
            break;
    }
}

// ================================
// EVENT LISTENERS
// ================================
function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', refreshDashboard);
    
    // Notifications dropdown
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    notificationBtn.addEventListener('click', () => {
        notificationDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
    
    // Mark all notifications as read
    document.getElementById('markAllRead').addEventListener('click', markAllNotificationsAsRead);
    
    // Setup navigation
    setupNavigation();
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('show');
        });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Window resize handling
    window.addEventListener('resize', handleResize);
}

async function handleLogout() {
    try {
        // Update last logout time
        await db.collection('users').doc(currentUser.uid).update({
            lastLogout: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Sign out from Firebase
        await auth.signOut();
        
        showToast('Logged out successfully', 'success');
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Logout failed. Please try again.', 'error');
    }
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    setTheme(newTheme);
    
    // Update user settings
    if (userData) {
        db.collection('users').doc(currentUser.uid).update({
            'settings.theme': newTheme
        });
    }
}

async function refreshDashboard() {
    showToast('Refreshing dashboard...', 'info');
    await loadDashboardData();
    showToast('Dashboard refreshed!', 'success');
}

async function markAllNotificationsAsRead() {
    try {
        const batch = db.batch();
        
        notifications.forEach(notification => {
            if (!notification.read) {
                const notificationRef = db.collection('notifications').doc(notification.id);
                batch.update(notificationRef, {
                    read: true,
                    readAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
        
        await batch.commit();
        await loadNotifications();
        
        showToast('All notifications marked as read', 'success');
        
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        showToast('Failed to mark notifications as read', 'error');
    }
}

function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && !sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
    }
}

// ================================
// MODAL FUNCTIONS
// ================================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function showTopupModal() {
    // Create topup modal content
    const modalContent = `
        <div class="modal-header">
            <h3>Top Up Balance</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="topup-form">
                <div class="form-group">
                    <label for="topupAmount">Amount (NGN)</label>
                    <input type="number" id="topupAmount" min="100" max="1000000" placeholder="Enter amount" value="1000">
                </div>
                <div class="form-group">
                    <label>Payment Method</label>
                    <div class="payment-options">
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="flutterwave" checked>
                            <i class="fas fa-credit-card"></i>
                            <span>Card Payment</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="bank">
                            <i class="fas fa-university"></i>
                            <span>Bank Transfer</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="crypto">
                            <i class="fab fa-bitcoin"></i>
                            <span>Crypto</span>
                        </label>
                    </div>
                </div>
                <div class="topup-summary">
                    <p>Amount: <strong id="summaryAmount">₦1,000.00</strong></p>
                    <p>Fee: <strong>₦0.00</strong></p>
                    <p class="total">Total: <strong id="summaryTotal">₦1,000.00</strong></p>
                </div>
                <button class="btn-primary btn-block" id="proceedPaymentBtn">
                    <i class="fas fa-lock"></i> Proceed to Payment
                </button>
            </div>
        </div>
    `;
    
    const modalBody = document.querySelector('#topupModal .modal-content');
    modalBody.innerHTML = modalContent;
    
    // Set up event listeners for modal
    setTimeout(() => {
        const topupAmount = document.getElementById('topupAmount');
        const summaryAmount = document.getElementById('summaryAmount');
        const summaryTotal = document.getElementById('summaryTotal');
        
        topupAmount.addEventListener('input', () => {
            const amount = parseFloat(topupAmount.value) || 0;
            summaryAmount.textContent = formatCurrency(amount);
            summaryTotal.textContent = formatCurrency(amount);
        });
        
        document.getElementById('proceedPaymentBtn').addEventListener('click', processTopup);
        
        // Reattach close button listener
        document.querySelector('#topupModal .modal-close').addEventListener('click', () => {
            hideModal('topupModal');
        });
    }, 100);
    
    showModal('topupModal');
}

async function processTopup() {
    const amount = parseFloat(document.getElementById('topupAmount').value);
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (!amount || amount < 100) {
        showToast('Minimum top-up amount is ₦100', 'error');
        return;
    }
    
    showToast('Processing payment...', 'info');
    
    // In a real application, you would integrate with a payment gateway here
    // For now, we'll simulate a successful payment
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update user balance
        const newBalance = (userData.balance || 0) + amount;
        await db.collection('users').doc(currentUser.uid).update({
            balance: newBalance,
            totalSpent: firebase.firestore.FieldValue.increment(amount)
        });
        
        // Record transaction
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        await db.collection('transactions').doc(transactionId).set({
            transactionId: transactionId,
            userId: currentUser.uid,
            type: 'deposit',
            amount: amount,
            method: paymentMethod,
            status: 'completed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            description: 'Balance top-up'
        });
        
        // Update local user data
        userData.balance = newBalance;
        
        // Update UI
        document.getElementById('balanceAmount').textContent = formatCurrency(newBalance);
        document.getElementById('statBalance').textContent = formatCurrency(newBalance);
        document.getElementById('currentBalance').textContent = formatCurrency(newBalance);
        
        // Hide modal
        hideModal('topupModal');
        
        showToast(`Successfully added ${formatCurrency(amount)} to your balance!`, 'success');
        
        // Add notification
        await addNotification(
            'Payment Successful',
            `Your balance has been topped up with ${formatCurrency(amount)}`,
            'success'
        );
        
    } catch (error) {
        console.error('Payment error:', error);
        showToast('Payment failed. Please try again.', 'error');
    }
}

async function addNotification(title, message, type = 'info') {
    try {
        await db.collection('notifications').add({
            userId: currentUser.uid,
            title: title,
            message: message,
            type: type,
            read: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Reload notifications
        await loadNotifications();
        
    } catch (error) {
        console.error('Error adding notification:', error);
    }
}

function showUpgradeModal() {
    // Simple upgrade modal
    const modalContent = `
        <div class="modal-header">
            <h3>Upgrade Account</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="upgrade-options">
                <div class="upgrade-option">
                    <h4>Basic</h4>
                    <p class="price">Free</p>
                    <ul>
                        <li>✓ Up to 5 active numbers</li>
                        <li>✓ Standard support</li>
                        <li>✗ Advanced features</li>
                    </ul>
                    <button class="btn-secondary">Current Plan</button>
                </div>
                <div class="upgrade-option recommended">
                    <h4>Premium</h4>
                    <p class="price">₦5,000/month</p>
                    <ul>
                        <li>✓ Up to 50 active numbers</li>
                        <li>✓ Priority support</li>
                        <li>✓ Advanced features</li>
                    </ul>
                    <button class="btn-primary">Upgrade Now</button>
                </div>
                <div class="upgrade-option">
                    <h4>Enterprise</h4>
                    <p class="price">Custom</p>
                    <ul>
                        <li>✓ Unlimited numbers</li>
                        <li>✓ 24/7 dedicated support</li>
                        <li>✓ Custom solutions</li>
                    </ul>
                    <button class="btn-secondary">Contact Sales</button>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'upgradeModal';
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
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Upgrade button
        const upgradeBtn = modal.querySelector('.upgrade-option.recommended .btn-primary');
        upgradeBtn.addEventListener('click', () => {
            showToast('Redirecting to upgrade page...', 'info');
            setTimeout(() => {
                modal.remove();
            }, 1000);
        });
    }, 10);
}

function showTutorial() {
    // Simple tutorial modal
    const modalContent = `
        <div class="modal-header">
            <h3><i class="fas fa-play-circle"></i> Quick Tutorial</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="tutorial-steps">
                <div class="tutorial-step">
                    <h4>1. Buy a Virtual Number</h4>
                    <p>Go to "Buy Numbers" and select a number from available countries and services.</p>
                </div>
                <div class="tutorial-step">
                    <h4>2. Receive SMS</h4>
                    <p>Use your virtual number to receive SMS from any service or website.</p>
                </div>
                <div class="tutorial-step">
                    <h4>3. View Messages</h4>
                    <p>Check received messages in your "Inbox" section.</p>
                </div>
                <div class="tutorial-step">
                    <h4>4. Manage Numbers</h4>
                    <p>View and manage your active numbers in "My Numbers" section.</p>
                </div>
            </div>
            <div class="tutorial-video">
                <div class="video-placeholder">
                    <i class="fas fa-video"></i>
                    <p>Video tutorial coming soon</p>
                </div>
            </div>
            <div class="tutorial-actions">
                <button class="btn-primary" id="startTutorialBtn">
                    <i class="fas fa-play"></i> Start Interactive Tutorial
                </button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'tutorialModal';
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
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Start tutorial button
        document.getElementById('startTutorialBtn').addEventListener('click', () => {
            showToast('Starting interactive tutorial...', 'info');
            setTimeout(() => {
                modal.remove();
                // Start tutorial flow
                switchSection('buy-numbers');
            }, 500);
        });
    }, 10);
}

// ================================
// INITIALIZE DASHBOARD
// ================================
console.log('Dashboard JavaScript loaded successfully');

// Export functions for use in other files
window.switchSection = switchSection;
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
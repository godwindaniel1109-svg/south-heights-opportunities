/* ========================================
   PROFILE PAGE FUNCTIONALITY
   ======================================== */

/**
 * Load user profile data
 */
async function loadProfileData() {
    try {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const userData = await getUserData(user.uid);
        
        // Update profile card
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userName').textContent = userData?.name || 'User';
        
        // Update stats
        document.getElementById('totalSpent').textContent = formatBalance(userData?.totalSpent || 0);
        document.getElementById('numbersActive').textContent = userData?.numbersActive || 0;
        document.getElementById('referralsEarned').textContent = `₦${((userData?.referralEarnings || 0) / 100).toLocaleString()}`;
        document.getElementById('accountAge').textContent = 'Member since ' + new Date(userData?.createdAt).toLocaleDateString();

        // Fill account form
        document.getElementById('fullName').value = userData?.name || '';
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = userData?.phone || '';
        document.getElementById('country').value = userData?.country || '';

        // Load referral code
        const referralCode = userData?.referralCode || generateReferralCode();
        document.getElementById('referralCode').value = referralCode;
        document.getElementById('referralLink').value = `${window.location.origin}/?ref=${referralCode}`;

        // Load referral stats
        document.getElementById('referralCount').textContent = userData?.referralCount || 0;
        document.getElementById('referralEarnings').textContent = formatBalance(userData?.referralEarnings || 0);

        console.log('Profile data loaded');
    } catch (error) {
        console.error('Error loading profile data:', error);
        showAlert('Error loading profile', 'error');
    }
}

/**
 * Generate referral code
 */
function generateReferralCode() {
    return 'PSH' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Show/hide tabs
 * @param {string} tabName - Tab name (account, security, referral, preferences)
 */
function showTab(tabName) {
    // Hide all tabs
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}Tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Activate button
    const selectedBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}

/**
 * Handle account form submission
 */
async function submitAccountForm(e) {
    e.preventDefault();

    try {
        const user = getCurrentUser();
        if (!user) {
            showAlert('Please log in first', 'error');
            return;
        }

        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const country = document.getElementById('country').value;

        if (!fullName) {
            showAlert('Full name is required', 'error');
            return;
        }

        // In production, update in Firestore
        console.log('Updating account:', { fullName, phone, country });

        showAlert('Account updated successfully', 'success');
    } catch (error) {
        console.error('Error submitting account form:', error);
        showAlert('Error updating account', 'error');
    }
}

/**
 * Open password change modal
 */
function openPasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Handle password change
 */
async function submitPasswordChange(e) {
    e.preventDefault();

    try {
        const user = getCurrentUser();
        if (!user) {
            showAlert('Please log in first', 'error');
            return;
        }

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert('All fields are required', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showAlert('Password must be at least 8 characters', 'error');
            return;
        }

        // In production, use Firebase to change password
        console.log('Password change requested');

        showAlert('Password changed successfully', 'success');
        closeModal('passwordModal');
        document.getElementById('passwordForm').reset();

    } catch (error) {
        console.error('Error changing password:', error);
        showAlert('Error changing password', 'error');
    }
}

/**
 * Toggle 2FA
 */
function toggle2FA() {
    const checkbox = document.getElementById('twoFAToggle');
    const status = checkbox.checked ? 'enabled' : 'disabled';
    
    console.log(`2FA ${status}`);
    showAlert(`2FA has been ${status}`, 'success');
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @param {Element} button - Button element
 */
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Error copying:', err);
        showAlert('Failed to copy', 'error');
    });
}

/**
 * Open delete account modal
 */
function openDeleteAccountModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Confirm delete account
 */
async function confirmDeleteAccount() {
    try {
        const user = getCurrentUser();
        if (!user) {
            showAlert('Please log in first', 'error');
            return;
        }

        // In production, delete account via Firebase
        console.log('Account deletion initiated');

        showAlert('Account has been deleted', 'success');
        
        // Logout
        setTimeout(() => {
            localStorage.removeItem('userSession');
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('Error deleting account:', error);
        showAlert('Error deleting account', 'error');
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
 * Update language preference
 */
function updateLanguage(language) {
    console.log(`Language changed to: ${language}`);
    showAlert(`Language changed to ${language}`, 'success');
}

/**
 * Toggle notification preference
 */
function toggleNotificationPreference(preference) {
    const checkbox = event.target;
    const status = checkbox.checked ? 'enabled' : 'disabled';
    console.log(`${preference} ${status}`);
}

/**
 * Setup event listeners
 */
function setupProfileListeners() {
    // Account form
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', submitAccountForm);
    }

    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', submitPasswordChange);
    }

    // 2FA toggle
    const twoFAToggle = document.getElementById('twoFAToggle');
    if (twoFAToggle) {
        twoFAToggle.addEventListener('change', toggle2FA);
    }

    // Modal close
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

    // Copy buttons
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            copyToClipboard(btn.dataset.copy, btn);
        });
    });

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = btn.textContent.toLowerCase().split(' ')[0];
            showTab(tabName);
        });
    });
}

/**
 * Initialize profile page
 */
async function initProfilePage() {
    try {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Load profile data
        await loadProfileData();
        // initialise checkbox value
        try {
            document.getElementById('notifySound').checked = (user.profile && user.profile.notify_sound) !== false;
        } catch (e) {}
            // set global notify preference to be used by notifications
            try {
                window.__notifySoundEnabled = (user.profile && user.profile.notify_sound) !== false;
            } catch (e) {
                window.__notifySoundEnabled = true;
            }

        // Setup listeners
        setupProfileListeners();

                const notifySound = document.getElementById('notifySound').checked;
                try {
                    await toggleNotifySound(notifySound);
                    showAlert('Preferences saved', 'success');
                } catch (err) {
                    showAlert('Failed to save preferences', 'error');
                }

        console.log('Profile page initialized');
    } catch (error) {
        console.error('Error initializing profile page:', error);
        showAlert('Error loading page', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProfilePage);

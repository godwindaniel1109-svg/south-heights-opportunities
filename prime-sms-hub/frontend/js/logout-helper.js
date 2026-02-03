/**
 * Centralized Logout Confirmation Helper
 * Provides a reusable logout confirmation dialog across the application
 */

/**
 * Show logout confirmation dialog
 * @param {Function} onConfirm - Callback when user confirms logout
 * @param {Function} onCancel - Optional callback when user cancels
 */
function showLogoutConfirmation(onConfirm, onCancel) {
    // Remove existing modal if any
    const existingModal = document.getElementById('logoutConfirmationModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'logoutConfirmationModal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease-in;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #1a1f3c 0%, #0d122b 100%);
        border-radius: 16px;
        padding: 2rem;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(66, 197, 245, 0.2);
        animation: slideUp 0.3s ease-out;
    `;

    // Modal header
    const header = document.createElement('div');
    header.style.cssText = `
        text-align: center;
        margin-bottom: 1.5rem;
    `;
    header.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔒</div>
        <h3 style="color: #ffffff; font-size: 1.5rem; font-weight: 600; margin: 0;">Confirm Logout</h3>
    `;

    // Modal body
    const body = document.createElement('div');
    body.style.cssText = `
        text-align: center;
        margin-bottom: 2rem;
    `;
    body.innerHTML = `
        <p style="color: #94a3b8; font-size: 1rem; line-height: 1.6;">
            Are you sure you want to logout?
        </p>
    `;

    // Modal buttons
    const buttons = document.createElement('div');
    buttons.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: center;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'No, Cancel';
    cancelBtn.style.cssText = `
        flex: 1;
        padding: 0.75rem 1.5rem;
        background: rgba(66, 197, 245, 0.1);
        border: 1px solid rgba(66, 197, 245, 0.3);
        border-radius: 8px;
        color: #42c5f5;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 1rem;
    `;
    cancelBtn.onmouseenter = () => {
        cancelBtn.style.background = 'rgba(66, 197, 245, 0.2)';
        cancelBtn.style.transform = 'translateY(-2px)';
    };
    cancelBtn.onmouseleave = () => {
        cancelBtn.style.background = 'rgba(66, 197, 245, 0.1)';
        cancelBtn.style.transform = 'translateY(0)';
    };
    cancelBtn.onclick = () => {
        modal.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
            modal.remove();
            if (onCancel) onCancel();
        }, 200);
    };

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Yes, Logout';
    confirmBtn.style.cssText = `
        flex: 1;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border: none;
        border-radius: 8px;
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 1rem;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    `;
    confirmBtn.onmouseenter = () => {
        confirmBtn.style.transform = 'translateY(-2px)';
        confirmBtn.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
    };
    confirmBtn.onmouseleave = () => {
        confirmBtn.style.transform = 'translateY(0)';
        confirmBtn.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
    };
    confirmBtn.onclick = () => {
        modal.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
            modal.remove();
            if (onConfirm) onConfirm();
        }, 200);
    };

    // Close on overlay click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => {
                modal.remove();
                if (onCancel) onCancel();
            }, 200);
        }
    };

    // Escape key handler
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => {
                modal.remove();
                if (onCancel) onCancel();
            }, 200);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Assemble modal
    buttons.appendChild(cancelBtn);
    buttons.appendChild(confirmBtn);
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modalContent.appendChild(buttons);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    if (!document.getElementById('logoutModalStyles')) {
        style.id = 'logoutModalStyles';
        document.head.appendChild(style);
    }
}

/**
 * Standard logout handler - clears localStorage and redirects
 */
function performLogout() {
    // Clear all auth data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginMethod');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminSession');
    
    // Redirect to login
    window.location.href = 'login.html';
}

/**
 * Wrapper function to show confirmation and perform logout
 */
function handleLogoutWithConfirmation() {
    showLogoutConfirmation(() => {
        performLogout();
    });
}
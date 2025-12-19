// ========================================
// AUTH PAGE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const googleLoginBtn = document.getElementById('googleLogin');
    const forgotPassword = document.querySelector('.forgot-password');
    const linkSignup = document.querySelector('.link-signup');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }

    if (forgotPassword) {
        forgotPassword.addEventListener('click', handleForgotPassword);
    }

    // signup link now navigates to register.html (no JS override needed)
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input
    if (!email || !password) {
        showAlert('Please enter email and password', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    // Simulate authentication (replace with actual Firebase auth)
    setTimeout(() => {
        // Store user session
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        showAlert('Login successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
}

function handleGoogleLogin(e) {
    e.preventDefault();

    // Show loading state
    e.target.disabled = true;
    e.target.textContent = 'Signing in with Google...';

    // Simulate Google authentication
    setTimeout(() => {
        localStorage.setItem('userEmail', 'user@gmail.com');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginMethod', 'google');

        showAlert('Google sign in successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
}

function handleForgotPassword(e) {
    e.preventDefault();
    showAlert('Password reset functionality will be available soon!', 'info');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

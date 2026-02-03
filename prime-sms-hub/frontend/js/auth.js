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

async function handleLogin(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearFieldErrors();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate input
    let hasError = false;
    if (!email) {
        showFieldError('emailError', 'Email address is required');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        hasError = true;
    }

    if (!password) {
        showFieldError('passwordError', 'Password is required');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    showFormSpinner();

    // create a cancelable controller so user can cancel waiting for Firebase
    const initController = new AbortController();
    showFormSpinner(initController);
    try {
        const auth = await getAuthAsync(window.FIREBASE_INIT_TIMEOUT_MS, initController.signal).catch(err => { console.error('Auth init failed', err); if (err.message && err.message.toLowerCase().includes('cancel')) showAlert('Initialization cancelled', 'info'); else showAlert('Authentication service temporarily unavailable. Please try again.', 'danger'); return null; });
        if (!auth) return;
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            await auth.signOut();
            showFieldError('emailError', 'Please verify your email before signing in. Check your inbox for the verification email.');
            return;
        }

        // Store user session
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        showAlert('Login successful!', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
    } catch (err) {
        console.error(err);
        let errorMessage = 'Authentication failed';
        
        // Map Firebase errors to user-friendly messages
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            errorMessage = 'Invalid email or password';
            showFieldError('passwordError', errorMessage);
        } else if (err.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format';
            showFieldError('emailError', errorMessage);
        } else if (err.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
            showFieldError('passwordError', errorMessage);
        } else if (err.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your connection and try again.';
            showFieldError('passwordError', errorMessage);
        } else {
            errorMessage = err.message || 'Authentication failed. Please try again.';
            showFieldError('passwordError', errorMessage);
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        hideFormSpinner();
    }
}

// Spinner helpers (show/hide the inline spinner element)
function showFormSpinner(controller){
    const s = document.getElementById('formSpinner');
    const cancelBtn = document.getElementById('formSpinnerCancel');
    if (s) s.classList.remove('hidden');
    if (cancelBtn && controller) {
        cancelBtn.classList.remove('hidden');
        cancelBtn.onclick = () => {
            controller.abort();
            hideFormSpinner();
            showAlert('Initialization cancelled', 'info');
        };
    }
}
function hideFormSpinner(){
    const s = document.getElementById('formSpinner');
    const cancelBtn = document.getElementById('formSpinnerCancel');
    if (s) s.classList.add('hidden');
    if (cancelBtn) { cancelBtn.classList.add('hidden'); cancelBtn.onclick = null; }
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
    // Prefer an inline alert next to the form if present, otherwise fall back to global alert
    const inline = document.getElementById('formAlert');
    const alert = inline || document.getElementById('alert');
    if (!alert) return;

    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    alert.classList.remove('alert-hidden');

    setTimeout(() => {
        if (inline) alert.classList.add('alert-hidden');
        else alert.classList.add('alert-hidden');
    }, 4000);
}

function showFieldError(errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        // Also add error styling to the input
        const inputId = errorId.replace('Error', '');
        const input = document.getElementById(inputId);
        if (input) {
            input.style.borderColor = '#ef4444';
        }
    }
}

function clearFieldErrors() {
    const errorElements = ['emailError', 'passwordError'];
    errorElements.forEach(id => {
        const errorEl = document.getElementById(id);
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.textContent = '';
            const inputId = id.replace('Error', '');
            const input = document.getElementById(inputId);
            if (input) {
                input.style.borderColor = '';
            }
        }
    });
} 

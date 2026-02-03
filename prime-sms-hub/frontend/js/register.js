document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const toggles = document.querySelectorAll('.toggle-pass');

    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = '🙈';
            } else {
                input.type = 'password';
                btn.textContent = '👁️';
            }
            input.focus();
        });
    });

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegister();
        });
    }
});

function showAlert(message, type = 'info') {
    const inline = document.getElementById('formAlert');
    const alert = inline || document.getElementById('alert');
    if (!alert) return;
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    alert.classList.remove('alert-hidden');
    setTimeout(() => alert.classList.add('alert-hidden'), 4000);
} 

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function handleRegister() {
    // Clear previous errors
    clearFieldErrors();

    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    let hasError = false;

    if (!email) {
        showFieldError('regEmailError', 'Email address is required');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showFieldError('regEmailError', 'Please enter a valid email address');
        hasError = true;
    }

    if (!phone) {
        showFieldError('regPhoneError', 'Phone number is required');
        hasError = true;
    }

    if (!password) {
        showFieldError('regPasswordError', 'Password is required');
        hasError = true;
    } else if (password.length < 6) {
        showFieldError('regPasswordError', 'Password must be at least 6 characters');
        hasError = true;
    }

    if (!confirm) {
        showFieldError('regConfirmError', 'Please confirm your password');
        hasError = true;
    } else if (password !== confirm) {
        showFieldError('regConfirmError', 'Passwords do not match');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    showFormSpinner();

    // create a cancelable controller so user can cancel waiting for Firebase/DB
    const initController = new AbortController();
    showFormSpinner(initController);
    try {
        const auth = await getAuthAsync(window.FIREBASE_INIT_TIMEOUT_MS, initController.signal).catch(err => { console.error('Auth init failed', err); if (err.message && err.message.toLowerCase().includes('cancel')) showAlert('Initialization cancelled', 'info'); else showAlert('Authentication service temporarily unavailable. Please try again.', 'danger'); return null; });
        if (!auth) return;
        const db = await getDBAsync(window.FIREBASE_INIT_TIMEOUT_MS, initController.signal).catch(err => { console.error('DB init failed', err); if (err.message && err.message.toLowerCase().includes('cancel')) showAlert('Initialization cancelled', 'info'); else showAlert('Data service temporarily unavailable. Please try again.', 'danger'); return null; });
        if (!db) return;
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await user.sendEmailVerification();

        // Save basic user record in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            phone: phone,
            balance: 0,
            createdAt: new Date()
        });

        showAlert('Account created. Verification email sent. Please verify your email before signing in.', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1600);
    } catch (err) {
        console.error(err);
        let errorMessage = 'Registration failed';
        
        // Map Firebase errors to user-friendly messages
        if (err.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            showFieldError('regEmailError', errorMessage);
        } else if (err.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format';
            showFieldError('regEmailError', errorMessage);
        } else if (err.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please use a stronger password (at least 6 characters).';
            showFieldError('regPasswordError', errorMessage);
        } else if (err.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your connection and try again.';
            showFieldError('regEmailError', errorMessage);
        } else {
            errorMessage = err.message || 'Registration failed. Please try again.';
            showFieldError('regEmailError', errorMessage);
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        hideFormSpinner();
    }
}

// Spinner helpers (show/hide the inline spinner element)
function showFormSpinner(){
    const s = document.getElementById('formSpinner');
    if (s) s.classList.remove('hidden');
}
function hideFormSpinner(){
    const s = document.getElementById('formSpinner');
    if (s) s.classList.add('hidden');
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
    const errorElements = ['regEmailError', 'regPhoneError', 'regPasswordError', 'regConfirmError'];
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
